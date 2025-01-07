const TWITTER_BEARER_TOKEN = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
const TWITTER_USER_ID = import.meta.env.VITE_TWITTER_USER_ID;

// Helper function to format the date
function formatTweetTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
}

export async function fetchUserTweets() {
  try {
    const response = await fetch('https://cyber-interface.onrender.com/api/tweets');

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Twitter rate limit reached, will retry later');
        return [];
      }
      throw new Error('Failed to fetch tweets');
    }

    const data = await response.json();
    
    if (!data.data) {
      console.error('Unexpected response format:', data);
      return [];
    }

    return data.data.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      time: formatTweetTime(tweet.created_at),
      metrics: tweet.public_metrics || { like_count: 0, retweet_count: 0 }
    }));
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return [];
  }
} 