import fetch from 'node-fetch'; // Install using: npm install node-fetch
import path from 'path';

// Function to upload media (uses Twitter API v1.1)
// Function to post a tweet
async function postTweet(text, accessToken, tokenSecret) {
    const url = "https://api.x.com/2/tweets";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Use access token for authentication
        },
        body: JSON.stringify({ text }), // The tweet content
    });

    if (response.ok) {
        const data = await response.json();
        console.log("Tweet posted successfully:", data);
        return data;
    } else {
        console.error("Error posting tweet:", response.statusText);
    }
}

async function uploadMedia(imagePath, accessToken, tokenSecret) {
    const url = "https://upload.twitter.com/1.1/media/upload.json";
    const formData = new FormData();
    formData.append("media", imagePath);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`, // Use access token for authentication
        },
        body: formData,
    });

    if (response.ok) {
        const data = await response.json();
        console.log("Media uploaded successfully:", data);
        return data.media_id_string;
    } else {
        console.error("Error uploading media:", response.statusText);
    }
}


// Helper Function to Post Tweet Using Twitter API v2 and twitter-api-v2
async function postTweet(text, accessToken, tokenSecret) {
    const client = new TwitterApi({
        appKey: "aGpqsjtN9SqOcyPn7x40Pp6O5",
        appSecret: "bVYzQrrKMTQoCcbfLHxvQgPwMgvKxYK9doVh21zoDBUzoznWHX",
        accessToken: accessToken, // User's access token
        accessSecret: tokenSecret, // User's access token secret
    });

    const twitterclient = client.readWrite

    try {

        // Post the tweet using the v2 API
        const result = await twitterclient.v2.tweet(text);
        console.log("Tweet posted successfully:", result);
        return result;
    } catch (error) {
        console.error("Error posting tweet:", error);
        throw new Error(`Error posting tweet: ${error}`);
    }


}

async function postTweetWithImage(text, imagePath, accessToken, tokenSecret) {
    const client = new TwitterApi({
        appKey: 'aGpqsjtN9SqOcyPn7x40Pp6O5',
        appSecret: 'bVYzQrrKMTQoCcbfLHxvQgPwMgvKxYK9doVh21zoDBUzoznWHX',
        accessToken,
        accessSecret: tokenSecret,
    });

    try {
        // Step 1: Upload the image
        const mediaData = await client.v1.uploadMedia(imagePath, { type: 'image/jpeg' });

        // Step 2: Post the tweet with the image
        const tweet = await client.v2.tweet(text, { media_ids: [mediaData.media_id_string] });

        console.log('Tweet posted successfully:', tweet);
        return tweet;
    } catch (error) {
        console.error('Error posting tweet:', error);
        throw error;
    }
}