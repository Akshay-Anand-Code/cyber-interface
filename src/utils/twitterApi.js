const TWITTER_BEARER_TOKEN = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
const TWITTER_USER_ID = import.meta.env.VITE_TWITTER_USER_ID;

export async function fetchUserTweets() {
  try {
    const response = await fetch(
      `https://api.twitter.com/2/users/${TWITTER_USER_ID}/tweets?max_results=10&tweet.fields=created_at,public_metrics`,
      {
        headers: {
          Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tweets');
    }

    const data = await response.json();
    return data.data.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      time: new Date(tweet.created_at).toRelative(),
      metrics: tweet.public_metrics
    }));
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return [];
  }
} 