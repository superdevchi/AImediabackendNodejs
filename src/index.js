import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { TwitterApi, EUploadMimeType } from 'twitter-api-v2';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {lookup} from 'mime-types'
import { Buffer } from 'buffer';
import OpenAI  from "openai";
import axios from 'axios';

import postTweets from './Tweet.js'

// import {OAuth} from "oauth";
import OAuth from 'oauth-1.0a';

import crypto from "crypto";

const ai = new OpenAI({

    apiKey: "",
    baseURL: 'https://api.x.ai/v1'
})


import { createClient } from '@supabase/supabase-js';
import { text } from 'stream/consumers';

import PostScheduler from './schedule.js'

const app = express();

// supabase
const supabaseUrl = 'https://zdzzzeiutwkfbtwmqfnv.supabase.co'; // Your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpkenp6ZWl1dHdrZmJ0d21xZm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MTU2NTgsImV4cCI6MjA0OTQ5MTY1OH0.3jKzr4712LZEEwPEoO-_Z1nm94_AvbxuMvKyiUFrqRk'; // Your Supabase Service Role Key
const supabase = createClient(supabaseUrl, supabaseKey);



passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


app.use(session({
    secret: '7Bx9L#mQ2pR$vZ8nK3fA@wY5cJ6tH',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ limit: '200mb',extended: true }));  // Parse URL-encoded bodies
app.use(express.json({limit: '200mb'}));

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/', // Temporary folder for storing uploads
    limits: { fileSize: 200 * 1024 * 1024 },
    storage: multer.memoryStorage()// 200MB file size limit
});

// Helper function to determine MIME type
function getMimeType(filePath) {
    const mimeType = lookup(filePath); // Returns the MIME type based on the file extension
    return mimeType || EUploadMimeType.Jpeg; // Default to JPEG if unknown
}

// Routes

app.post('/auth/signup', async (req, res) => {
    const { email, password, full_name } = req.body;
    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        const userId = data.user.id;
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: userId, email: email }]);
        if (profileError) throw profileError;

        const user = data.user;
        // Format the user object to match the Swift model structure.
        const formattedUser = {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.created_at,  // Supabase returns this in ISO format
            updatedAt: user.updated_at,
            userMetadata: {
                email: user.user_metadata.email,
                emailVerified: user.user_metadata.email_verified
            },
            appMetadata: {
                provider: user.app_metadata.provider
            }
        };
        res.status(201).send({ message: 'User registered successfully', user: formattedUser });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});





app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Extract session details
        const { access_token, refresh_token, user } = data.session;

        // Store the access token and refresh token in session
        req.session.accessToken = access_token;
        req.session.refreshToken = refresh_token;
        session.userid = user.id;
        session.supabaseaccesstoken = access_token;

        console.log("Login Successful \n", data.session);

        // Send the correct response, including metadata for the user
        res.status(200).send({
            // message: 'Login successful',
            accessToken: access_token,
            refreshToken: refresh_token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
                userMetadata: {
                    email: user.user_metadata.email,
                    emailVerified: user.user_metadata.email_verified
                },
                appMetadata: {
                    provider: user.app_metadata.provider
                }
            }
        });
    } catch (error) {
        // Send error response if login fails
        res.status(400).send({ error: error.message });
    }
});


app.post('/upload-audio', upload.single('audio'), (req, res) => {
    if (req.file) {
        res.json({ message: 'Audio uploaded successfully', filename: req.file.filename });
    } else {
        res.status(400).json({ error: 'No audio file uploaded' });
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to the home page, maybe instagram failed or from ios and this is accepted maybe');
});



// Store temporary request tokens (in production, use a DB)
let oauthRequestTokens = {};


const oauth = new OAuth({
    consumer: {
        key: "lcmOYTAberZpSa39YaNgksAXA", // Replace with your Twitter API Key
        secret: "Irq4y76uKmudb4ayT0AYUjpoNkAYiG3HdfqYcMVCVGyQWNVKE8" // Replace with your Twitter API Secret
    },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString, key) {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64');
    }
});
const userid = ""


// 1️⃣ Twitter Authentication (Request Token)
app.get('/auth/twitter', (req, res) => {
    const userId = req.query.userId;
    console.log(userId);
    session.userId = userId;
    // if (!userId) return res.status(400).send('Missing user ID');

    const url = "https://api.twitter.com/oauth/request_token";
    const requestData = {
        url,
        method: 'POST'
    };

    // Get OAuth Request Token
    const headers = oauth.toHeader(oauth.authorize(requestData));

    axios.post(url, null, { headers })
        .then((response) => {
            const results = new URLSearchParams(response.data);
            const oauth_token = results.get('oauth_token');
            const oauth_token_secret = results.get('oauth_token_secret');

            // Store request token & secret temporarily
            oauthRequestTokens[oauth_token] = oauth_token_secret;

            // Redirect user to Twitter for authentication
            res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`);
        })
        .catch((error) => {
            console.error("Error getting OAuth request token:", error);
            return res.status(500).send("Error requesting OAuth token");
        });
});

// 2️⃣ Handle Twitter Callback & Exchange Request Token for Access Token
app.get('/auth/twitter/callback', (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;
    const oauth_token_secret = oauthRequestTokens[oauth_token];

    if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
        return res.status(400).send("Invalid OAuth request");
    }

    const url = "https://api.twitter.com/oauth/access_token";
    const requestData = {
        url,
        method: 'POST',
        data: { oauth_token, oauth_verifier }
    };

    // Get OAuth Access Token
    const headers = oauth.toHeader(oauth.authorize(requestData, { key: oauth_token, secret: oauth_token_secret }));

    axios.post(url, null, { headers })
        .then(async (response) => {
            const results = new URLSearchParams(response.data);
            const oauth_access_token = results.get('oauth_token');
            const oauth_access_token_secret = results.get('oauth_token_secret');
            const twitterUserId = results.get('user_id');
            const twitterScreenName = results.get('screen_name');

            // Store user session (you can use a session management system here)
            req.session.oauthAccessToken = oauth_access_token;
            req.session.oauthAccessSecret = oauth_access_token_secret;
            req.session.twitterUserId = twitterUserId;
            req.session.twitterScreenName = twitterScreenName;

            console.log("OAuth Access Token:", oauth_access_token);
            console.log("OAuth Access Token Secret:", oauth_access_token_secret);
            console.log("Twitter User ID:", twitterUserId);
            console.log("Twitter Screen Name:", twitterScreenName);

            const linked = await linkTwitterAccount(session.userId, twitterScreenName, oauth_access_token, oauth_access_token_secret);

            if (linked !== false) {
                res.redirect('/twitter-success');
            } else {
                res.redirect('/auth/twitter');
            }
        })
        .catch((error) => {
            console.error("Error getting OAuth access token:", error);
            return res.status(500).send("Error getting access token");
        });
});



async function linkTwitterAccount(userid, username, token, tokenSecret) {
    try {
        const userId = userid;
        const twitterUsername = username;

        // 1. Check if THIS USER already linked THIS TWITTER ACCOUNT
        const { data: existingAccount, error: checkError } = await supabase
            .from('socials')
            .select('*')
            .eq('owner', userId)          // Check by user ID
            .eq('socialmedia', 'twitter') // Check for Twitter accounts
            .eq('account_username', twitterUsername) // Check specific Twitter handle
            .single();

        // Handle "no rows found" error gracefully
        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking for existing account:', checkError);
            return false;
        }

        // 2. Block if user already linked this exact Twitter account
        if (existingAccount) {
            console.log('This Twitter account is already linked to your profile!');
            return false;
        }

        // 3. Insert new account if not a duplicate
        const { error: insertError } = await supabase
            .from('socials')
            .insert({
                owner: userId,
                socialmedia: 'Twitter',
                account_username: twitterUsername,
                access_token: token,
                access_secrect: tokenSecret
            });

        if (insertError) {
            console.error('Error inserting account:', insertError);
            return false;
        }

        console.log('Twitter account linked successfully');
        return true;
    } catch (err) {
        console.error('Error linking Twitter account:', err);
        return false;
    }
}




app.get('/twitter-success', (req, res) => {
   res.send('sucessfully successfully');
});




app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.redirect('/auth/twitter');
    }
});








app.post("/ai/post", upload.array('images'), async (req, res) => {
    try {
        // Extract fields from the request body, including an optional timestamp.
        let { prompt, data, socials, userid, timestamp } = req.body;

        // Validate required fields.
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }
        if (!socials) {
            return res.status(400).json({ error: "social is required." });
        }
        if (!userid) {
            return res.status(400).json({ error: "userid is required." });
        }

        // Process the data field into an array of texts.
        let texts = [];
        if (data) {
            if (typeof data === 'string') {
                try {
                    texts = JSON.parse(data);
                    if (!Array.isArray(texts)) {
                        texts = [texts];
                    }
                } catch (err) {
                    texts = [data];
                }
            } else if (Array.isArray(data)) {
                texts = data;
            }
        }

        console.log("Prompt:", prompt);
        console.log("Texts:", texts);
        console.log("socials:", socials);

        // Check and log any uploaded files.
        const files = req.files || [];
        if (files.length > 0) {
            console.log(`Received ${files.length} image(s).`);
        } else {
            console.log("No image files received.");
        }

        // Log each text entry.
        texts.forEach((text, index) => {
            console.log(`Text ${index + 1}:`, text);
        });

        // Log each file detail.
        files.forEach((file, index) => {
            console.log(`File ${index + 1}: originalname=${file.originalname}, size=${file.size}`);
        });

        // Get user tokens and socials.
        const userInfos = await getUserSocialsTokens(userid);
        if (!Array.isArray(socials)) {
            if (typeof socials === 'string') {
                try {
                    socials = JSON.parse(socials);
                } catch (err) {
                    console.error('Error parsing socials:', err.message);
                    return res.status(400).json({ error: "Invalid socials format." });
                }
            } else if (socials && typeof socials === 'object' && Array.isArray(socials.socials)) {
                socials = socials.socials;
            } else {
                console.error('Error: socials is not a valid array', socials);
                return res.status(400).json({ error: "Invalid socials format." });
            }
        }
        const socialsArray = Array.isArray(socials) ? socials : [socials];
        console.log(socialsArray);

        // Sort userInfos based on the selected socials.
        const sortedUsers = socials
            .filter(social => social.isSelected)
            .map(social => userInfos.find(user => user.id === social.id))
            .filter(Boolean);

        if (sortedUsers.length === 0) {
            return res.status(400).json({ error: "No matching users found in socials." });
        }

        const users = sortedUsers.map(info => {
            let accessSecret = info.access_secrect;
            try {
                accessSecret = JSON.parse(info.access_secrect);
            } catch (e) {
                // Use raw value if JSON parsing fails.
            }
            return {
                accessToken: info.access_token,
                accessSecret: accessSecret,
                twitterScreenName: info.name // Assuming this exists.
            };
        });

        console.log(`Users for posting: ${JSON.stringify(sortedUsers)}`);

        // Check if a scheduled timestamp is provided and valid.
        let scheduledTime = timestamp ? new Date(Number(timestamp)) : null;
        const now = new Date();

        if (scheduledTime && scheduledTime > now) {
            console.log(`Scheduled tweet for ${scheduledTime.toLocaleString()}`);
            // Call the scheduleTweet function.
            PostScheduler.scheduleTweet({
                prompt: prompt,
                texts: texts,
                socials: socials,
                userid: userid,
                scheduledTime: scheduledTime,
                users: users,
                files: files
            });
            return res.status(200).json({
                response: `Tweet has been scheduled for ${scheduledTime.toLocaleString()}`
            });
        } else {
            // Immediate tweet posting.
            const tweetUrls = await postTweets({
                textEntries: texts,
                imageFiles: files,
                users: users,
                userid: userid,
            });

            // Optionally fetch tweet details and further processing...
            // const tweetDetailsArray = await Promise.all(
            //     tweetUrls.map(async ({ tweetUrl, user }) => {
            //         const tweetId = extractTweetId(tweetUrl);
            //         if (!tweetId) {
            //             console.error('Invalid tweet URL:', tweetUrl);
            //             return null;
            //         }
            //         try {
            //             const tweetData = await getTweetById(tweetId, user);
            //             console.log(`Fetched details for tweet ${tweetId}`);
            //             return { tweetId, tweetUrl, tweetData, user };
            //         } catch (error) {
            //             console.error(`Error fetching details for tweet ${tweetId}:`, error);
            //             return null;
            //         }
            //     })
            // );
            //
            // console.log(tweetDetailsArray);
            // const savedpost = saveTweetsToPostsDynamic(tweetDetailsArray, userid);
            // console.log(savedpost);

            return res.status(200).json({
                response: `Post is successfully uploaded to your Twitter`
            });
        }
    } catch (error) {
        console.error("Error in /ai/post route:", error);
        res.status(500).json({ error: error.message });
    }
});




export async function saveTweetsToPostsDynamic(tweetsData, userid) {
    // Map each tweet object into a post object matching your Supabase posts table schema.
    const postsToInsert = tweetsData.map(tweet => {
        // Extract tweet text.
        const tweetText = tweet.tweetData.data.text;
        // Default values assume a text post.
        let mediaType = "text";
        let mediaContent = tweetText;
        let caption = tweetText;

        // Check if tweet data includes media information.
        // This example assumes media data is available under tweetData.data.entities.media.
        if (
            tweet.tweetData.data.entities &&
            tweet.tweetData.data.entities.media &&
            tweet.tweetData.data.entities.media.length > 0
        ) {
            mediaType = "image";
            // Use the first image URL if there are multiple.
            mediaContent = tweet.tweetData.data.entities.media[0].media_url;
            // Optionally, you might still want the tweet text as the caption.
            caption = tweetText;
        }

        return {
            // The authenticated user's id is saved in user_id.
            user_id: userid,
            // The twitterScreenName from the tweet's user info becomes the username.
            username: tweet.user.twitterScreenName,
            // Default profile image; update if you have dynamic profile images.
            profile_image: "person.circle.fill",
            // Set media_type and media_content dynamically.
            media_type: mediaType,
            media_content: mediaContent,
            // The tweet text is used as caption.
            caption: caption,
            // Initialize likes, comments, and shares.
            likes: 0,
            comments: 0,
            shares: 0,
            // Set the timestamp; you might use tweet.created_at if available.
            timestamp: new Date(),
            // Mark the source as "twitter".
            source: "twitter"
        };
    });

    // Insert the posts into your Supabase "posts" table.
    const { data, error } = await supabase
        .from('posts')
        .insert(postsToInsert);

    if (error) {
        console.error("Error inserting posts:", error);
        return { success: false, error };
    }

    console.log("Posts inserted successfully:", data);
    return { success: true, data };
}

// Helper: Extract tweet ID from a tweet URL
export function extractTweetId(tweetUrl) {
    const match = tweetUrl.match(/status\/(\d+)/);
    if (match && match[1]) {
        return match[1];
    } else {
        console.error('Invalid tweet URL:', tweetUrl);
        return null;
    }
}





function classifySocialMedia(prompt) {
    if (!prompt || prompt.trim() === "") {
        return "unknown";
    }

    // Normalize the prompt to lowercase for case-insensitive matching.
    const lowerPrompt = prompt.toLowerCase();

    // List of possible social media platforms. "x" is included as a substitute for Twitter.
    const platforms = ["facebook", "twitter", "x", "instagram", "linkedin", "tiktok", "snapchat"];

    // Loop through the platforms and return the first one that is found in the prompt.
    for (const platform of platforms) {
        if (lowerPrompt.includes(platform)) {
            return platform;
        }
    }

    // If none of the platforms are mentioned, return "unknown".
    return "unknown";
}





app.get('/posts/:userid', async (req, res) => {
    const { userid } = req.params;

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', userid)
            .order('timestamp', { ascending: false });

        if (error) {
            console.error("Error fetching posts:", error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error("Error in GET /posts/:userid:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/convo', async (req, res) => {
    res.send(conversationHistory);
})


app.post('/ai/audio', upload.single('audio'),async (req, res) => {


    try{

        // Log the incoming file details
        console.log('Received file:', {
            exists: !!req.file,
            mimetype: req.file?.mimetype,
            size: req.file?.size,
            hasBuffer: !!req.file?.buffer
        });

        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded' });
        }

        // Ensure buffer exists before converting
        if (!req.file.buffer) {
            return res.status(500).json({ error: 'File buffer is missing. Check multer storage settings.' });
        }

    const base64audio = await audioToBase64(req.file.buffer);

        // Construct API input
        const input = {
            audio: base64audio,
            task: "transcribe",
            language: "en",
            vad_filter: "false"
        };

        // @cf/bytedance/stable-diffusion-xl-lightning
        const response = await run('@cf/openai/whisper-large-v3-turbo', input)

        const buffer = await response;
        const jsonString = Buffer.from(buffer).toString();

        if (!response) {
            res.status(400).json({ error: 'No audio response from server' });
        }


        // res.status(200).send(jsonString);
        const transcription = JSON.parse(jsonString);
        res.status(200).send({
            transcription: transcription.result.text,
        });

    }catch(error){
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });

    }
})



app.post('/chat-with-image', upload.array('images'), async (req, res) => {
    try {
        const { message: userMessage, user_id } = req.body;

        // Validate inputs
        if (!user_id) return res.status(400).json({ error: 'User ID required' });
        if (!userMessage) return res.status(400).json({ error: 'Message required' });
        if (!req.files?.length) return res.status(400).json({ error: 'At least one image required' });

        // 1. Get existing conversation history
        const { data: existingConvo } = await supabase
            .from('conversations')
            .select('messages')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })
            .limit(1);

        let messages = existingConvo?.[0]?.messages || [];

        // 2. Process images
        const imageUrls = await convertImagesToBase64(req.files);

        // 3. Build multi-modal message
        const newMessage = {
            role: "user",
            content: [
                { type: "text", text: userMessage },
                ...imageUrls.map(url => ({
                    type: "image_url",
                    image_url: { url: url, detail: "high" }
                }))
            ]
        };

        // 4. Add to conversation history
        messages.push(newMessage);

        // 5. Add system message if missing
        if (!messages.some(m => m.role === "system")) {
            messages.unshift({
                role: "system",
                content: "You are a visual AI assistant. Analyze images carefully and provide detailed descriptions along with answers to any questions."
            });
        }

        // 6. Get AI response using Grok Vision
        const completion = await ai.chat.completions.create({
            model: "grok-2-vision-1212",
            messages: messages,
        });

        // 7. Update conversation history
        const aiResponse = completion.choices[0].message.content;
        messages.push({ role: "assistant", content: aiResponse });

        // 8. Save to database
        await supabase.from('conversations')
            .upsert({ user_id, messages });

        // 9. Return response
        res.json({
            response: advancedCleanup(aiResponse)}
        );

    } catch (error) {
        console.error('Error in /chat-with-image:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data?.error || 'Vision processing error'
        });
    }
});


function advancedCleanup(content) {
    return content
        .replace(/^(###|##)\s*/gm, '')  // Remove header markers while preserving indentation
        .replace(/\*\*/g, '')           // Remove markdown formatting
        .replace(/`/g, '')              // Remove code markers
        .replace(/\n{3,}/g, '\n\n')     // Normalize multiple newlines
        .trim();
}




async function convertImagesToBase64(imageFiles) {
    const base64Urls = [];

    for (const file of imageFiles) {
        try {
            // Read the file from the provided file path
            const fileContent = fs.readFileSync(file.path);

            // Convert the file to a Base64 string
            const base64String = fileContent.toString('base64');

            // Generate the Base64 URL
            const base64Url = `data:${file.mimetype};base64,${base64String}`;

            // Add the Base64 URL to the array
            base64Urls.push(base64Url);
        } catch (err) {
            console.error(`Error processing file "${file.originalname}":`, err.message);
        }
    }

    return base64Urls;
}















// const CLIENT_KEY = 'sbawusmc1oa26dq0nc'

app.post("/ai/chat", async (req, res) => {
    const { prompt, user_id } = req.body;

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing prompt' });
    }
    if (!user_id) {
        return res.status(400).json({ error: 'User ID required' });
    }

    try {
        // 1. Retrieve existing conversation
        const { data: existingConvo, error: fetchError } = await supabase
            .from('conversations')
            .select('messages')
            .eq('user_id', user_id)
            .single();

        // Handle empty conversation case
        let messages = existingConvo?.messages || [];

        // 2. Add new user message
        const userMessage = {
            role: "user",
            content: [{ type: "text", text: prompt }],
            created_at: new Date().toISOString()
        };
        messages.push(userMessage);

        // 3. Generate AI response
        const response = await generateAIContent(prompt, user_id, messages);

        // 4. Create assistant message from response
        const assistantMessage = {
            role: "assistant",
            content: [],
            created_at: new Date().toISOString()
        };

        // Add text response if available
        if (response.text) {
            assistantMessage.content.push({
                type: "text",
                text: advancedCleanup(response.text)
            });
        }

        // Add images if generated
        if (response.images && response.images.length > 0) {
            response.images.forEach(url => {
                assistantMessage.content.push({
                    type: "image_url",
                    image_url: { url: url, detail: "high" }
                });
            });
        }

        // 5. Update conversation history
        messages.push(assistantMessage);

        const { error: updateError } = await supabase
            .from('conversations')
            .upsert({
                user_id: user_id,
                messages: messages,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id',
                returning: 'minimal'
            });

        if (updateError) throw updateError;
        res.json(response);

    } catch (err) {
        console.error('Error in /ai/chat:', err);
        res.status(500).json({
            success: false,
            error: err.message,
            system: "Failed to process AI request"
        });
    }
});




async function generateAIContent(prompt, user_id, existingMessages) {
    try {
        // Determine the type(s) dynamically and number of images if applicable
        const { types, imageCount } = determineContentTypesAndImageCount(prompt);

        if (!types.length) {
            throw new Error('Unable to determine content type from the prompt.');
        }

        const results = {};

        // Handle text-only situation
        if (types.length === 1 && types.includes('text')) {
            const textPrompt = await preprocessPromptForText(prompt);
            console.log(textPrompt);
            const textResponse = await generateText(textPrompt,user_id, filterImageUrlMessages(existingMessages));
            results.text = textResponse;
            return results;
        }

        // Handle image-only or multiple images
        if (types.length === 1 && types.includes('image')) {
            const imageprompt = await preprocessPromptForImage(prompt);
            const imageResponse = await generateImages(imageprompt, imageCount);
            results.images = imageResponse;
            return results;
        }

        // Handle both text and image(s)
        if (types.length === 2 && types.includes('text') && types.includes('image')) {
            const textPrompt = await preprocessPromptForText(prompt);
            const imageprompt = await preprocessPromptForImage(prompt);
            const [textResponse, imageResponse] = await Promise.all([
                generateText(textPrompt,user_id, filterImageUrlMessages(existingMessages)),
                generateImages(imageprompt, imageCount),
            ]);
            results.text = textResponse;
            results.images = imageResponse;
            return results;
        }

        // Handle text-only situation
        if (types.length === 1 && types.includes('post')) {
            // const textPrompt = await preprocessPromptForText(prompt);
            // const textResponse = await generateText(textPrompt,user_id, filterImageUrlMessages(existingMessages));
            // results.text = textResponse;
            // return results;
            return results.text = "making post"

        }


    } catch (error) {
        console.error('Error generating AI content:', error.message);

        // Improved error handling
        if (error.message.includes('Unable to determine content type')) {
            throw new Error('Failed to determine content type. Please provide a clearer prompt.');
        }

        throw new Error('Failed to generate AI content.');
    }
}




function preprocessPromptForText(prompt) {
    const imageKeywords = [
        'generate an image',
        'create a visual',
        'draw',
        'paint',
        'make an illustration',
        'design',
        'sketch',
        'render',
        'images',
        'pictures',
        'visuals',
        'photos',
    ];

    // Split sentences using punctuation as delimiters.
    const sentences = prompt.split(/(?<=\.)|(?<=,)|and/g);

    console.log("Sentences Before Filtering:", sentences);

    // Keep sentences that don't predominantly contain image-related keywords.
    const filteredSentences = sentences.filter((sentence) => {
        const containsKeyword = imageKeywords.some((keyword) =>
            sentence.toLowerCase().includes(keyword)
        );

        // Log details for debugging
        console.log(
            `Checking Sentence: "${sentence.trim()}" - Contains Keyword: ${containsKeyword}`
        );

        return !containsKeyword || sentence.toLowerCase().includes("write"); // Retain if related to text.
    });

    // Rejoin the remaining sentences and clean up.
    const cleanedPrompt = filteredSentences.join(' ').replace(/\s+/g, ' ').trim();

    console.log("Cleaned Text Prompt:", cleanedPrompt);

    return cleanedPrompt || 'Please provide specific text instructions.';
}

function preprocessPromptForImage(prompt) {
    const imageKeywords = [
        'generate an image',
        'create a visual',
        'draw',
        'paint',
        'make an illustration',
        'design',
        'sketch',
        'render',
        'images',
        'pictures',
        'visuals',
        'photos',
    ];

    // Split sentences using punctuation as delimiters.
    const sentences = prompt.split(/(?<=\.)|(?<=,)|and/g);

    console.log("Sentences Before Filtering:", sentences);

    // Keep sentences that contain image-related keywords.
    const filteredSentences = sentences.filter((sentence) => {
        const containsKeyword = imageKeywords.some((keyword) =>
            sentence.toLowerCase().includes(keyword)
        );

        // Log details for debugging
        console.log(
            `Checking Sentence: "${sentence.trim()}" - Contains Keyword: ${containsKeyword}`
        );

        return containsKeyword;
    });

    // Rejoin the remaining sentences and clean up.
    const cleanedPrompt = filteredSentences.join(' ').replace(/\s+/g, ' ').trim();

    console.log("Cleaned Image Prompt:", cleanedPrompt);

    return cleanedPrompt || 'Please provide specific image-related instructions.';
}




// Helper to determine content types and image count
function determineContentTypesAndImageCount(prompt) {
    const lowerPrompt = prompt.toLowerCase().trim();

    // Check for image-related terms
    const imageKeywords = ['image', 'visual', 'photo', 'picture', 'illustration'];
    const hasImage = imageKeywords.some((keyword) => lowerPrompt.includes(keyword));

    // Check for text-related terms
    const textKeywords = ['write', 'quote', 'text', 'description', 'caption'];
    const hasText = textKeywords.some((keyword) => lowerPrompt.includes(keyword));

    // Detect image count (default to 1 if not specified)
    const imageCountMatch = lowerPrompt.match(/(\d+)\s+(images|photos|pictures|visuals)/);
    const imageCount = imageCountMatch ? parseInt(imageCountMatch[1], 10) : 1;


    const types = [];
    if (hasImage) types.push('image');
    if (hasText) types.push('text');
    // if(isPostPrompt) types.push('post');

    // Fallback: Assume text if no content type is detected
    if (types.length === 0) {
        console.warn('No specific content type detected, defaulting to text.');
        types.push('text');
    }

    console.log(` type: {${types}, ${imageCount}`)
    return { types, imageCount };
}








// Helper to generate text
async function generateText(prompt, user_id, existingMessages = []) {
    try {
        const systemMessage = {
            role: "system",
            content: "You are a high-level social media manager, You are a helpful assistant who provides insightful text responses, including quotes when requested."
        };

        const filteredexistingmessages = filterImageUrlMessages(existingMessages);

        // Centralized system message check
        const messages = existingMessages.some(m => m.role === "system")
            ? existingMessages
            : [systemMessage, ...existingMessages];


        const response = await ai.chat.completions.create({
            model: "grok-2-latest",
            messages: messages,
            tools: toolsDefinition,
            tool_choice: "none",
        });

        return advancedCleanup(response.choices[0].message.content);
    } catch (error) {
        console.error('Text generation failed:', error);
        return 'Error generating response';
    }
}

async function getConversationHistory(user_id) {
    const { data, error } = await supabase
        .from('conversations')
        .select('messages')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(1);

    return error ? [] : data?.[0]?.messages || [];
}


function filterImageUrlMessages(messages) {
    // Filter the messages array to exclude any content with type "image_url"
    return messages.filter(message => {
        // Check if the message's content array contains any object with type "image_url"
        return !message.content.some(contentItem => contentItem.type === "image_url");
    });
}




async function generateImages(prompt, count = 1, inferenceSteps = 8,  width = 1024, height = 1024) {
    try {
        // Add randomness to the input prompt for variation
        const inputs = Array.from({ length: count }, (_, index) => ({
            prompt: `${prompt} - ${Math.random().toString(36).substring(2, 8)}`, // Add random string
            seed: Math.floor(Math.random() * 1000000), // Random seed if supported by the model
            inference_steps: inferenceSteps,
            width,
            height,
            guidance: 5
            // New parameter for inference steps
        }));

        // Generate images with unique parameters
        const generationTasks = inputs.map(async (input, index) => {
            try {
                // Run the model (e.g., stable-diffusion-xl-lightning)
                const result = await run('@cf/bytedance/stable-diffusion-xl-lightning', input);

                if (result instanceof ArrayBuffer) {
                    // Directly convert the ArrayBuffer to a Blob (the API returns a PNG image)
                    const imageBlob = new Blob([result], { type: 'image/png' });

                    // Add timestamp AND random string to filename
                    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
                    const filename = `images/${uniqueSuffix}-generated-image-${index}.png`;

                    // Upload the image to Supabase Storage and get the URL
                    const url = await uploadToSupabaseStorage(imageBlob, filename, "images");

                    console.log(`Image ${index + 1} generated: ${url}`);
                    return url;
                } else {
                    throw new Error("Unexpected response format");
                }
            } catch (error) {
                console.error(`Error generating image ${index + 1}:`, error);
                return null;
            }
        });

        const urls = await Promise.all(generationTasks);
        const successfulUrls = urls.filter((url) => url !== null);

        if (successfulUrls.length === 0) {
            throw new Error("All image generation tasks failed.");
        }

        return successfulUrls;
    } catch (error) {
        console.error("Error generating images:", error);
        throw error;
    }
}





async function uploadToSupabaseStorage(fileBlob, fileName, bucketName) {
    try {
        // Upload the file to Supabase storage
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, fileBlob, {
                contentType: fileBlob.type, // Automatically set the MIME type from the Blob
                upsert: true, // Optional: Overwrite if the file already exists
            });

        if (error) {
            console.error('Error uploading file to Supabase:', error);
            return null;
        }

        return geturl(fileName); // Return the public URL
    } catch (err) {
        console.error('Unexpected error during Supabase upload:', err);
        return null;
    }
}

async function geturl(filepath){
    const { data, error } = await supabase.storage.from("images").getPublicUrl(filepath);

    if (error) {
        console.error('Error fetching URL:', error);
    } else {
        // console.log('Response data:', data);
        const publicUrl = data.publicUrl;
        // console.log('Public URL:', publicUrl);
    }
    return data.publicUrl;
}

app.get('/get', async (req, res) => {
    const url = await geturl()
    console.log(url);

    res.status(200).send(url);
})



async function generateImage(prompt) {
    try {
        const input = { prompt: String(prompt) };
        const result = await run('@cf/black-forest-labs/flux-1-schnell', input);


        if (result instanceof ArrayBuffer) {
            // console.log("result from imagee generation \n"+ result);
            const jsonString = new TextDecoder().decode(result);
            const jsonResult = JSON.parse(jsonString);
            const toblob = base64ToBlob(jsonResult.result.image, 'image/jpeg')

            const url = await uploadToSupabaseStorage(toblob,`images/${Date.now()}-generated-image`,"images")
            return  url;

        } else {
            throw new Error("Unexpected response format");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
}

// Function to convert base64 to Blob
function base64ToBlob(base64, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}



app.get('/image', async (req, res) => {

    const result = await generateImage("cyber truck under an aurora");
    // console.log(result);
    res.json(result);
})


app.get("/getsocials/:id", async (req, res) => {
    const { id } = req.params;
    const socials = await getUserSocials(id);

    if (socials) {
        res.json(socials);
    } else {
        res.status(500).json({ error: "Failed to fetch user socials" });
    }
});


app.delete("/deletesocials/", async (req, res) => {
    const {  user_id, username,socialmedia } = req.body;

    const isdeleted = deleteUserSocial(user_id, username, socialmedia);
    if (!isdeleted) {
        console.log("not deleted")
        res.status(500).json({error: "error to delete"})
    }
    res.json({

        success: true,
        message : "{" +
            `username ${username}` +
            `social media ${socialmedia}` +

            "}"
    });
    console.log(isdeleted)
})




export async function getTweetById(tweetId, user) {
    // Create a new client using the user's credentials.
    const client = new TwitterApi({
        appKey: "lcmOYTAberZpSa39YaNgksAXA",
        appSecret: "Irq4y76uKmudb4ayT0AYUjpoNkAYiG3HdfqYcMVCVGyQWNVKE8",
        accessToken: user.accessToken,
        accessSecret: user.accessSecret,
    });

    // Use the v2 client method to get tweet details.
    try {
        const tweetData = await client.v2.singleTweet(tweetId);
        return tweetData;
    } catch (error) {
        throw error;
    }
}

// GET route to retrieve a tweet by ID
app.get('/tweet/:id', async (req, res) => {
    try {
        const tweet = await getTweetById(req.params.id);
        res.send(tweet); // Send the tweet data as the response
    } catch (error) {
        res.status(500).send(error); // Send error if something goes wrong
    }
});






async function deleteUserSocial(userId, username, socialmedia) {
    try {
        const { error } = await supabase
            .from('socials')
            .delete()
            .match({ owner: userId, account_username: username, socialmedia: socialmedia });

        if (error) {
            throw error;
        }

        console.log(`Successfully deleted ${socialmedia} account for ${username} (User ID: ${userId})`);
        return true;
    } catch (err) {
        console.error('Error deleting user social:', err.message);
        return false;
    }
}

function postTweet(content, imageUrl) {
    // Simulate posting a tweet logic
    console.log(`Posting tweet: ${content} with image: ${imageUrl}`);
    return { success: true, tweetId: "123456789" };
}


async function run(model, input) {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/cc80b7088b3b1dbadd1a7b2da603546d/ai/run/${model}`,
        {
            headers: {
                Authorization: "Bearer gjC53kADLs7giI0yXO39ZdwIkIi7mykNBz68Wq8j",
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(input)
        }
    );

    // console.log(response, "RESPONSE")
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.arrayBuffer();
}
const audioToBase64 = (fileBuffer) => {
    return fileBuffer.toString('base64');
};


// Define tool functions
const toolsMap = {
    generateImage,
    postTweet,
};

// Define tools for the AI
const toolsDefinition = [
    {
        type: "function",
        function: {
            name: "generateImage",
            description: "Generate an image based on a prompt",
            parameters: {
                type: "object",
                properties: {
                    prompt: {
                        type: "string",
                        description: "Description of the image to generate"
                    }
                },
                required: ["prompt"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "postTweet",
            description: "Post a tweet with optional image",
            parameters: {
                type: "object",
                properties: {
                    content: {
                        type: "string",
                        description: "The text content of the tweet"
                    },
                    imageUrl: {
                        type: "string",
                        description: "URL of the image to include in the tweet"
                    }
                },
                required: ["content"]
            }
        }
    }
];

let conversationHistory = []; // Store conversation history


async function getUserSocials(userId) {
    try {
        const { data, error } = await supabase
            .from('socials')
            .select('id, socialmedia, account_username, access_token,access_secrect')
            .eq('owner', userId);

        if (error) {
            throw error;
        }

        console.log(JSON.stringify(data));

        return data.map(social => ({
            id: social.id,
            name: social.account_username,
            socialmedia: social.socialmedia,
            isSelected: false
        }));
    } catch (err) {
        console.error('Error fetching user socials:', err.message);
        return null;
    }
}

async function getUserSocialsTokens(userId) {
    try {
        const { data, error } = await supabase
            .from('socials')
            .select('id, socialmedia, account_username, access_token,access_secrect')
            .eq('owner', userId);

        if (error) {
            throw error;
        }

        // console.log(JSON.stringify(data));

        return data.map(social => ({
            id: social.id,
            name: social.account_username,
            socialmedia: social.socialmedia,
            access_token: social.access_token,
            access_secrect: social.access_secrect,
        }));
    } catch (err) {
        console.error('Error fetching user socials:', err.message);
        return null;
    }
}

// Start server
app.listen(5500, () => {
    console.log('Server running on http://localhost:5500');
});

