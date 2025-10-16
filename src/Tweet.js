import OAuth from 'oauth-1.0a';
import axios from "axios";
import crypto from "crypto";


import { TwitterApi, EUploadMimeType } from 'twitter-api-v2';

import {saveTweetsToPostsDynamic, getTweetById, extractTweetId} from './index.js'




async function postTweets({ textEntries = [], imageFiles = [], users, userid }) {
    console.log(`List of Users: ${JSON.stringify(users)}`);

    // Ensure users is an array
    if (!Array.isArray(users)) {
        users = [users];
    }

    const tweetUrls = [];

    // Loop over each user
    for (const user of users) {
        if (!user || !user.accessToken || !user.accessSecret) {
            console.warn(`Skipping invalid user: ${JSON.stringify(user)}`);
            continue;
        }

        const client = new TwitterApi({
            appKey: "lcmOYTAberZpSa39YaNgksAXA",
            appSecret: "Irq4y76uKmudb4ayT0AYUjpoNkAYiG3HdfqYcMVCVGyQWNVKE8",
            accessToken: user.accessToken,
            accessSecret: user.accessSecret
        });

        // Loop over each text entry (and corresponding image file, if any)
        for (let i = 0; i < textEntries.length; i++) {
            const text = textEntries[i];
            let mediaIds = [];

            // Upload image if provided for this text entry
            if (imageFiles[i]) {
                const media = await client.v1.uploadMedia(Buffer.from(imageFiles[i].buffer), {
                    mimeType: imageFiles[i].mimetype
                });
                mediaIds.push(media);
            }

            // Post tweet with text (and media if available)
            const response = await client.v2.tweet({
                text: text,
                media: mediaIds.length > 0 ? { media_ids: mediaIds } : undefined
            });

            // Construct tweet URL. If twitterScreenName is provided, use it; otherwise, default to 'unknown'
            const screenName = user.twitterScreenName || "unknown";
            const tweetUrl = `https://twitter.com/${screenName}/status/${response.data.id}`;
            tweetUrls.push({ tweetUrl, user });
            console.log(`Tweet URL: ${tweetUrl}`);
        }
    }


    // Optionally fetch tweet details and further processing...
    const tweetDetailsArray = await Promise.all(
        tweetUrls.map(async ({ tweetUrl, user }) => {
            const tweetId = extractTweetId(tweetUrl);
            if (!tweetId) {
                console.error('Invalid tweet URL:', tweetUrl);
                return null;
            }
            try {
                const tweetData = await getTweetById(tweetId, user);
                console.log(`Fetched details for tweet ${tweetId}`);
                return { tweetId, tweetUrl, tweetData, user };
            } catch (error) {
                console.error(`Error fetching details for tweet ${tweetId}:`, error);
                return null;
            }
        })
    );

    console.log(tweetDetailsArray);
    const savedpost = saveTweetsToPostsDynamic(tweetDetailsArray, userid);
    console.log(savedpost);

    // Return just the tweet URL strings
    return tweetUrls;
}











// Export the function so it can be used in other files
export default postTweets;