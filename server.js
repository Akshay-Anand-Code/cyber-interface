import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const app = express();
app.use(cors());

const TWITTER_BEARER_TOKEN = process.env.VITE_TWITTER_BEARER_TOKEN;
const TWITTER_USER_ID = process.env.VITE_TWITTER_USER_ID;
const CACHE_FILE = 'tweet_cache.json';

// Cache and rate limit settings
let cachedTweets = null;
let lastFetchTime = null;
const CACHE_DURATION = 15 * 60 * 1000; // 2 hours cache
const RETRY_DELAY = 15 * 60 * 1000; // 15 minutes between retries
const MAX_RETRIES = 3;
let isRateLimited = false;
let rateLimitResetTime = null;

// Initialize with some mock data
const mockTweets = {
  data: [
    {
      id: '1',
      text: 'Loading tweets... Please wait while we connect to Twitter.',
      created_at: new Date().toISOString(),
      public_metrics: { like_count: 0, retweet_count: 0 }
    }
  ]
};

// Load cached tweets from file
async function loadCachedTweets() {
  try {
    if (await fs.access(CACHE_FILE).catch(() => false)) {
      const data = await fs.readFile(CACHE_FILE, 'utf8');
      const parsed = JSON.parse(data);
      console.log('Loaded tweets from cache file');
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Error loading cache:', error);
    return null;
  }
}

// Save tweets to cache file
async function saveCachedTweets(tweets) {
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(tweets));
    console.log('Saved tweets to cache file');
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

// Check if we're currently rate limited
function checkRateLimit() {
  if (!isRateLimited) return false;
  if (Date.now() > rateLimitResetTime) {
    isRateLimited = false;
    rateLimitResetTime = null;
    return false;
  }
  return true;
}

// Add this function to properly calculate next fetch time
function getNextFetchTime() {
  if (!lastFetchTime) return 'now';
  const timeLeft = (lastFetchTime + CACHE_DURATION) - Date.now();
  if (timeLeft <= 0) return 'now';
  return `${Math.round(timeLeft / 1000 / 60)} minutes`;
}

// Fetch tweets from Twitter API
async function fetchTwitterTweets() {
  if (checkRateLimit()) {
    console.log('Still rate limited, waiting until:', new Date(rateLimitResetTime).toLocaleTimeString());
    throw new Error('Rate limited');
  }

  try {
    console.log('Attempting to fetch tweets...');
    const params = new URLSearchParams({
      'tweet.fields': 'created_at,public_metrics',
      'max_results': '2',
      'exclude': 'retweets,replies'
    });

    const response = await fetch(
      `https://api.twitter.com/2/users/${TWITTER_USER_ID}/tweets?${params}`,
      {
        headers: {
          'Authorization': TWITTER_BEARER_TOKEN,
          'User-Agent': 'v2TweetLookupJS',
        },
      }
    );

    console.log('Twitter API Response Status:', response.status);

    if (response.status === 429) {
      const resetTime = response.headers.get('x-rate-limit-reset');
      isRateLimited = true;
      rateLimitResetTime = resetTime ? (parseInt(resetTime) * 1000) : (Date.now() + RETRY_DELAY);
      console.log(`Rate limited. Will retry after: ${new Date(rateLimitResetTime).toLocaleTimeString()}`);
      throw new Error('Rate limited');
    }

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Twitter API Error Response:', data);
      throw new Error(`Twitter API responded with status ${response.status}`);
    }

    if (data.data && data.data.length > 0) {
      const transformedData = {
        data: data.data.slice(0, 2).map(tweet => ({
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at,
          public_metrics: tweet.public_metrics || {
            like_count: 0,
            retweet_count: 0
          }
        }))
      };
      return transformedData;
    }
    
    throw new Error('No tweets found in response');
  } catch (error) {
    console.error('Fetch error details:', error);
    throw error;
  }
}

// Initialize cache on server start
async function initializeCache() {
  try {
    // First try to load from cache file
    cachedTweets = await loadCachedTweets();
    if (!cachedTweets) {
      console.log('No cache found, using mock data');
      cachedTweets = mockTweets;
    }

    // Only try to fetch if we have no cached tweets
    if (!cachedTweets.data || cachedTweets.data.length === 0) {
      try {
        const freshTweets = await fetchTwitterTweets();
        if (freshTweets.data && freshTweets.data.length > 0) {
          cachedTweets = freshTweets;
          await saveCachedTweets(cachedTweets);
          lastFetchTime = Date.now();
          console.log('Successfully initialized with fresh tweets');
        }
      } catch (error) {
        console.log('Could not fetch fresh tweets, using cache/mock data');
      }
    }
  } catch (error) {
    console.error('Error during initialization:', error);
    cachedTweets = mockTweets;
  }
}

app.get('/api/tweets', async (req, res) => {
  try {
    const now = Date.now();
    const shouldFetch = !checkRateLimit() && 
                       (!lastFetchTime || (now - lastFetchTime > CACHE_DURATION));

    if (shouldFetch) {
      try {
        const newTweets = await fetchTwitterTweets();
        cachedTweets = newTweets;
        await saveCachedTweets(cachedTweets);
        lastFetchTime = now;
        console.log('Successfully fetched and cached new tweets');
      } catch (error) {
        console.log('Using cached/mock data due to fetch error:', error.message);
      }
    } else {
      console.log('Using cached data, next fetch in:', getNextFetchTime());
    }

    res.json(cachedTweets || mockTweets);
  } catch (error) {
    console.error('Server Error:', error);
    res.json(cachedTweets || mockTweets);
  }
});

// Add this function near the top of your file
function validateTwitterToken() {
  if (!TWITTER_BEARER_TOKEN) {
    throw new Error('Twitter Bearer Token is missing');
  }
  if (!TWITTER_BEARER_TOKEN.startsWith('Bearer ')) {
    console.warn('Twitter Bearer Token should start with "Bearer ". Adding prefix...');
    TWITTER_BEARER_TOKEN = `Bearer ${TWITTER_BEARER_TOKEN}`;
  }
  console.log('Twitter token validation passed');
}

// Modify your initialization code
// Initialize and start server
async function startServer() {
  try {
    validateTwitterToken();
    await initializeCache();
    app.listen(3001, () => {
      console.log('Proxy server running on port 3001');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 