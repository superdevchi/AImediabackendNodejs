// import express from 'express';
// import axios from 'axios';
//
// const app = express();
// const port = 3000;
//
// app.use(express.json());
//
// /**
//  * Generates stream rules for the Twitter API filtered stream endpoint.
//  * @param {string[]} topics - Topics to filter tweets by.
//  * @param {string[]} users - Usernames to filter tweets by.
//  * @param {string} tagPrefix - Prefix for rule tags to categorize tweets.
//  * @returns {Object[]} - An array of rule objects ready for the API.
//  */
// function generateStreamRules(topics, users, tagPrefix) {
//     const rules = [];
//
//     // Add topic-based rules
//     for (const topic of topics) {
//         rules.push({
//             value: `${topic} lang:en`,
//             tag: `${tagPrefix}: ${topic}`
//         });
//     }
//
//     // Add user-based rules
//     for (const user of users) {
//         rules.push({
//             value: `from:${user} OR @${user}`,
//             tag: `${tagPrefix}: ${user}`
//         });
//     }
//
//     return rules;
// }
//
// /**
//  * Adds rules to the Twitter filtered stream endpoint.
//  * @param {Object[]} rules - The rules to add.
//  * @param {string} bearerToken - The Twitter API bearer token.
//  * @returns {Promise<Object>} - The API response.
//  */
// async function addStreamRules(rules, bearerToken) {
//     const endpoint = 'https://api.twitter.com/2/tweets/search/stream/rules';
//
//     try {
//         const response = await axios.post(
//             endpoint,
//             { add: rules },
//             {
//                 headers: {
//                     Authorization: `Bearer ${bearerToken}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error('Error adding stream rules:', error.response?.data || error.message);
//         throw error;
//     }
// }
//
// /**
//  * Connects to the Twitter filtered stream endpoint.
//  * @param {string} bearerToken - The Twitter API bearer token.
//  * @param {Function} onTweet - Callback for handling tweets.
//  */
// async function connectToStream(bearerToken, onTweet) {
//     const endpoint = 'https://api.twitter.com/2/tweets/search/stream';
//
//     try {
//         const response = await axios.get(endpoint, {
//             headers: {
//                 Authorization: `Bearer ${bearerToken}`
//             },
//             responseType: 'stream'
//         });
//
//         response.data.on('data', (chunk) => {
//             try {
//                 const tweet = JSON.parse(chunk);
//                 onTweet(tweet);
//             } catch (err) {
//                 console.error('Error parsing tweet:', err);
//             }
//         });
//
//         response.data.on('error', (err) => {
//             console.error('Stream error:', err);
//         });
//
//     } catch (error) {
//         console.error('Error connecting to stream:', error.response?.data || error.message);
//         throw error;
//     }
// }
//
// // Express Endpoints
// app.post('/rules', async (req, res) => {
//     const { topics, users, tagPrefix, bearerToken } = req.body;
//
//     try {
//         const rules = generateStreamRules(topics, users, tagPrefix);
//         const ruleResponse = await addStreamRules(rules, bearerToken);
//         res.status(200).json({ message: 'Rules added successfully', data: ruleResponse });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// app.get('/stream', async (req, res) => {
//     const { bearerToken } = req.query;
//
//     try {
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');
//
//         await connectToStream(bearerToken, (tweet) => {
//             res.write(`data: ${JSON.stringify(tweet)}\n\n`);
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });
//
//
// import axios from 'axios';
//
// /**
//  * Generates stream rules for the Twitter API filtered stream endpoint.
//  * @param {string[]} topics - Topics to filter tweets by.
//  * @param {string[]} users - Usernames to filter tweets by.
//  * @param {string} tagPrefix - Prefix for rule tags to categorize tweets.
//  * @returns {Object[]} - An array of rule objects ready for the API.
//  */
// function generateStreamRules(topics, users, tagPrefix) {
//     const rules = [];
//
//     // Add topic-based rules
//     for (const topic of topics) {
//         rules.push({
//             value: `${topic} lang:en`,
//             tag: `${tagPrefix}: ${topic}`
//         });
//     }
//
//     // Add user-based rules
//     for (const user of users) {
//         rules.push({
//             value: `from:${user} OR @${user}`,
//             tag: `${tagPrefix}: ${user}`
//         });
//     }
//
//     return rules;
// }
//
// /**
//  * Adds rules to the Twitter filtered stream endpoint.
//  * @param {Object[]} rules - The rules to add.
//  * @param {string} bearerToken - The Twitter API bearer token.
//  * @returns {Promise<Object>} - The API response.
//  */
// async function addStreamRules(rules, bearerToken) {
//     const endpoint = 'https://api.twitter.com/2/tweets/search/stream/rules';
//
//     try {
//         const response = await axios.post(
//             endpoint,
//             { add: rules },
//             {
//                 headers: {
//                     Authorization: `Bearer ${bearerToken}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error('Error adding stream rules:', error.response?.data || error.message);
//         throw error;
//     }
// }
//
// /**
//  * Connects to the Twitter filtered stream endpoint.
//  * @param {string} bearerToken - The Twitter API bearer token.
//  * @param {Function} onTweet - Callback for handling tweets.
//  */
// async function connectToStream(bearerToken, onTweet) {
//     const endpoint = 'https://api.twitter.com/2/tweets/search/stream';
//
//     try {
//         const response = await axios.get(endpoint, {
//             headers: {
//                 Authorization: `Bearer ${bearerToken}`
//             },
//             responseType: 'stream'
//         });
//
//         response.data.on('data', (chunk) => {
//             try {
//                 const tweet = JSON.parse(chunk);
//                 onTweet(tweet);
//             } catch (err) {
//                 console.error('Error parsing tweet:', err);
//             }
//         });
//
//         response.data.on('error', (err) => {
//             console.error('Stream error:', err);
//         });
//
//     } catch (error) {
//         console.error('Error connecting to stream:', error.response?.data || error.message);
//         throw error;
//     }
// }
//
// // Example usage
// const topics = ['tech', 'DEI', 'politics'];
// const users = ['elonmusk', 'JustinTrudeau'];
// const tagPrefix = 'UserInterest';
// const bearerToken = 'YOUR_TWITTER_BEARER_TOKEN';
//
// (async () => {
//     try {
//         const rules = generateStreamRules(topics, users, tagPrefix);
//         const ruleResponse = await addStreamRules(rules, bearerToken);
//         console.log('Rules added:', ruleResponse);
//
//         await connectToStream(bearerToken, (tweet) => {
//             console.log('Received tweet:', tweet);
//         });
//     } catch (error) {
//         console.error('Error setting up stream:', error);
//     }
// })();
//
//
//
// /**
//  * Generates rules for Twitter's filtered stream API based on user input.
//  *
//  * @param {Array} topics - List of topics (e.g., tech, politics, DEI).
//  * @param {Array} users - List of Twitter usernames (without @, e.g., elonmusk).
//  * @param {String} tagPrefix - Optional tag prefix for categorizing rules.
//  * @returns {Array} - Array of rule objects ready to be sent to the API.
//  */
// function generateTwitterStreamRules(topics, users, tagPrefix = "") {
//     // Validate inputs
//     if (!Array.isArray(topics) || !Array.isArray(users)) {
//         throw new Error("Topics and users must be arrays.");
//     }
//
//     const rules = [];
//
//     // Generate rules for each topic and user combination
//     topics.forEach((topic) => {
//         if (users.length > 0) {
//             // Rule: Tweets from specific users related to the topic
//             const usersRule = users.map((user) => `from:${user}`).join(" OR ");
//             rules.push({
//                 value: `(${usersRule}) ${topic}`,
//                 tag: `${tagPrefix}Tweets about '${topic}' from specific users`,
//             });
//         }
//
//         // Rule: General tweets related to the topic
//         rules.push({
//             value: `${topic}`,
//             tag: `${tagPrefix}General tweets about '${topic}'`,
//         });
//     });
//
//     // Optional: Add rules for mentions of users without topics
//     if (users.length > 0) {
//         const mentionsRule = users.map((user) => `@${user}`).join(" OR ");
//         rules.push({
//             value: `(${mentionsRule})`,
//             tag: `${tagPrefix}Mentions of specified users`,
//         });
//     }
//
//     return rules;
// }
//
// // Example usage
// const topics = ["tech", "politics", "DEI"];
// const users = ["elonmusk", "justintrudeau", "TwitterDev"];
// const tagPrefix = "User-Generated: ";
//
// const rules = generateTwitterStreamRules(topics, users, tagPrefix);
// console.log(rules);
//
// /* Example Output:
// [
//   {
//     value: "(from:elonmusk OR from:justintrudeau OR from:TwitterDev) tech",
//     tag: "User-Generated: Tweets about 'tech' from specific users"
//   },
//   {
//     value: "tech",
//     tag: "User-Generated: General tweets about 'tech'"
//   },
//   {
//     value: "(from:elonmusk OR from:justintrudeau OR from:TwitterDev) politics",
//     tag: "User-Generated: Tweets about 'politics' from specific users"
//   },
//   {
//     value: "politics",
//     tag: "User-Generated: General tweets about 'politics'"
//   },
//   {
//     value: "(from:elonmusk OR from:justintrudeau OR from:TwitterDev) DEI",
//     tag: "User-Generated: Tweets about 'DEI' from specific users"
//   },
//   {
//     value: "DEI",
//     tag: "User-Generated: General tweets about 'DEI'"
//   },
//   {
//     value: "(@elonmusk OR @justintrudeau OR @TwitterDev)",
//     tag: "User-Generated: Mentions of specified users"
//   }
// ]
// */
//
//
// // async function uploadImagesToSupabase(imageFiles) {
// //     const uploadedUrls = [];
// //
// //     for (const file of imageFiles) {
// //         const fileName = `images/${Date.now()}.png`;
// //         const { data, error } = await supabase.storage
// //             .from('images')
// //             .upload(fileName, file);
// //
// //         if (error) {
// //             console.error('Error uploading file:', error);
// //             continue;
// //         }
// //
// //         const { data: urlData } = supabase.storage
// //             .from('images')
// //             .getPublicUrl(fileName);
// //
// //         uploadedUrls.push(urlData.publicUrl);
// //     }
// //
// //     return uploadedUrls;
// // }
//
// // async function uploadImagesToSupabase(imageFiles) {
// //     const uploadedUrls = [];
// //
// //     for (const file of imageFiles) {
// //         // Sanitize the file name
// //         const sanitizedFileName = `images/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
// //
// //         // Check if the file is an image
// //         const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
// //         if (!validImageTypes.includes(file.mimetype)) {
// //             console.error(`Unsupported file type: ${file.mimetype}`);
// //             continue; // Skip unsupported files
// //         }
// //
// //         const { data, error } = await supabase.storage
// //             .from('images')
// //             .upload(sanitizedFileName, file);
// //
// //         if (error) {
// //             console.error('Error uploading file:', error);
// //             continue;
// //         }
// //
// //         // Get the public URL of the uploaded image
// //         const { publicURL } = supabase.storage.from('images').getPublicUrl(sanitizedFileName);
// //         uploadedUrls.push(publicURL);
// //     }
// //
// //     return uploadedUrls;
// // }
//
// // async function uploadImagesToSupabase(imageFiles) {
// //     const uploadedUrls = [];
// //
// //     for (const file of imageFiles) {
// //         try {
// //             // Sanitize the file name
// //             const sanitizedFileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
// //
// //             // Check if the file is an image
// //             const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
// //             if (!validImageTypes.includes(file.mimetype)) {
// //                 console.error(`Unsupported file type: ${file.mimetype}`);
// //                 continue; // Skip unsupported files
// //             }
// //
// //             // Read file content (if `file` is not already a Blob/File object)
// //             const fileContent = require('fs').readFileSync(file.path); // Replace `file.path` if needed.
// //
// //             // Upload the file to Supabase
// //             const { data, error } = await supabase.storage
// //                 .from('images') // Bucket name
// //                 .upload(sanitizedFileName, fileContent, {
// //                     contentType: file.mimetype, // Ensure correct MIME type
// //                     upsert: false, // Prevent overwriting
// //                 });
// //
// //             if (error) {
// //                 console.error('Error uploading file:', error.message);
// //                 continue;
// //             }
// //
// //             // Get the public URL of the uploaded image
// //             const { publicUrl } = supabase.storage
// //                 .from('images') // Bucket name
// //                 .getPublicUrl(sanitizedFileName);
// //
// //             if (!publicUrl) {
// //                 console.error('Failed to retrieve public URL for file:', sanitizedFileName);
// //                 continue;
// //             }
// //
// //             console.log(`Uploaded file: ${sanitizedFileName}, URL: ${publicUrl}`);
// //             uploadedUrls.push(publicUrl);
// //         } catch (err) {
// //             console.error('Unexpected error during file upload:', err.message);
// //         }
// //     }
// //
// //     return uploadedUrls;
// // }
//
// // import fs from 'fs'; // Use import instead of require
//
// // async function uploadImagesToSupabase(imageFiles) {
// //     const uploadedUrls = [];
// //
// //     for (const file of imageFiles) {
// //         try {
// //             // Sanitize the file name
// //             const sanitizedFileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
// //
// //             // Check if the file is an image
// //             const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
// //             if (!validImageTypes.includes(file.mimetype)) {
// //                 console.error(`Unsupported file type: ${file.mimetype}`);
// //                 continue; // Skip unsupported files
// //             }
// //
// //             // Read file content
// //             const fileContent = fs.readFileSync(file.path); // Read file content from path
// //
// //             // Upload the file to Supabase
// //             const { data, error } = await supabase.storage
// //                 .from('images') // Bucket name
// //                 .upload(sanitizedFileName, fileContent, {
// //                     contentType: file.mimetype, // Ensure correct MIME type
// //                     upsert: false, // Prevent overwriting
// //                 });
// //
// //             if (error) {
// //                 console.error('Error uploading file:', error.message);
// //                 continue;
// //             }
// //
// //             // Get the public URL of the uploaded image
// //             const { publicUrl } = supabase.storage
// //                 .from('images') // Bucket name
// //                 .getPublicUrl(sanitizedFileName);
// //
// //             if (!publicUrl) {
// //                 console.error('Failed to retrieve public URL for file:', sanitizedFileName);
// //                 continue;
// //             }
// //
// //             console.log(`Uploaded file: ${sanitizedFileName}, URL: ${publicUrl}`);
// //             uploadedUrls.push(publicUrl);
// //         } catch (err) {
// //             console.error('Unexpected error during file upload:', err.message);
// //         }
// //     }
// //
// //     return uploadedUrls;
// // }
//
//
//
// // app.post('/chat-with-image', async (req, res) => {
// //     try {
// //         const userMessage = req.body.message;
// //         const base64Images = req.body.images || [];
// //
// //
// //         console.log("images in base 64 \n "+ base64Images);
// //         console.log("user message \n "+ userMessage)
// //
// //         if (!userMessage || !Array.isArray(base64Images)) {
// //             return res.status(400).json({ error: 'Invalid request format' });
// //         }
// //         let aiResponse = '';
// //
// //         if (userMessage || base64Images.length > 0) {
// //             const messages = [];
// //
// //             if (userMessage) {
// //                 messages.push({
// //                     role: "user",
// //                     content: userMessage
// //                 });
// //
// //                 conversationHistory.push({ role: "user", content: userMessage });
// //             }
// //
// //             for (const base64Image of base64Images) {
// //                 messages.push({
// //                     role: "user",
// //                     content: [
// //                         {
// //                             type: "image_url",
// //                             image_url: {
// //                                 url: base64Image,
// //                                 detail: "high",
// //                             },
// //                         }
// //                     ],
// //                 });
// //                 conversationHistory.push({ role: "user", content: [{
// //                         type: "image_url",
// //                         image_url: {
// //                             url: base64Image,
// //                             detail: "high",
// //                         },
// //                     }] });
// //             }
// //
// //
// //
// //
// //             console.log(messages);
// //
// //
// //             const validMessages = conversationHistory.filter(msg => msg.role && msg.content);
// //             console.log("valid messages"+validMessages);
// //             const message = [
// //                 { role: "system", content: "You are a high-level social media manager." },
// //                 ...validMessages
// //             ];
// //
// //             const completion = await ai.chat.completions.create({
// //                 model: "grok-2-vision-1212",
// //                 messages:messages
// //             });
// //
// //             aiResponse = completion.choices[0].message.content;
// //             console.log(aiResponse);
// //             conversationHistory.push({ role: "assistant", content: aiResponse });
// //
// //
// //         } else {
// //             aiResponse = "No message or image provided.";
// //         }
// //
// //         // Add to conversation history
// //         // await addToConversationHistory(req.user.id, userMessage, aiResponse, base64Images);
// //
// //         res.json({
// //             response: advancedCleanup(aiResponse),
// //             // imageUrls: base64Images,
// //         });
// //     } catch (error) {
// //         console.error('Error in /chat-with-image:', error);
// //         res.status(500).json({ error: 'An error occurred while processing your request.' });
// //     }
// // });
//
//
//
//
//
//
// // chatInputForm.addEventListener('submit', async (event) => {
// //     event.preventDefault();
// //     const userMessage = messageInput.value.trim();
// //     const imageFiles = imageInput.files;
// //
// //     if (!userMessage && imageFiles.length === 0) {
// //         return; // Don't send if there's no message and no images
// //     }
// //
// //     displayMessage(userMessage, 'user');
// //     messageInput.value = '';
// //     displayMessage('AI is processing...', 'loading');
// //
// //
// //     let body;
// //     let headers = {};
// //     let url = '/chat';
// //
// //     // const formData = new FormData();
// //     // formData.append('message', userMessage);
// //     // for (let i = 0; i < imageFiles.length; i++) {
// //     //     formData.append('images', imageFiles[i]);
// //     // }
// //
// //     const imagePromises = Array.from(imageFiles).map(file => {
// //     return new Promise((resolve, reject) => {
// //         const reader = new FileReader();
// //         reader.onloadend = () => resolve(reader.result);
// //         reader.onerror = reject;
// //         reader.readAsDataURL(file);
// //     });
// // });
// //
// // const base64Images = await Promise.all(imagePromises);
// // // formData.append('images', JSON.stringify(base64Images));
// //
// //
// //     if (imageFiles.length > 0) {
// //         url = '/chat-with-image';
// //
// //         body = JSON.stringify({
// //         message:userMessage,
// //         images: base64Images
// //         });
// //     }else{
// //         body = JSON.stringify({ message: userMessage });
// //     }
// //
// //     try {
// //         const response = await fetch(url, {
// //             method: 'POST',
// //             headers: {'Content-Type': 'application/json'},
// //             body: body
// //         });
// //
// //         const data = await response.json();
// //         removeLoadingIndicator();
// //
// //         if (response.ok) {
// //             displayMessage(data.response, 'assistant');
// //             if (data.imageUrls) {
// //                 data.imageUrls.forEach(url => displayMessage(url, 'assistant'));
// //             }
// //         } else {
// //             displayMessage('Error: ' + data.error, 'assistant');
// //         }
// //     } catch (error) {
// //         console.error('Error:', error);
// //         removeLoadingIndicator();
// //         displayMessage('Error communicating with the server.', 'assistant');
// //     }
// //
// //     chatMessages.scrollTop = chatMessages.scrollHeight;
// //     imageInput.value = '';
// //     imagePreviewContainer.innerHTML = '';
// // });
//
//
// app.get('/home', authenticateToken, async (req, res) => {
//     try {
//         const { data: profile, error: profileError } = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('id', req.user.id)
//             .single();
//
//         if (profileError) throw profileError;
//
//         const { data: socialAccounts, error: socialError } = await supabase
//             .from('socials')
//             .select('*')
//             .eq('owner', req.user.id);
//
//         if (socialError) throw socialError;
//
//         res.send(`
//
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>AI Chat Interface</title>
//     <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//     <style>
//         .chat-container {
//             height: calc(100vh - 2rem);
//         }
//         .chat-messages {
//             height: calc(100% - 140px);
//         }
//         .message {
//             cursor: pointer;
//             transition: background 0.2s ease;
//         }
//         .message:hover {
//             background: rgba(0, 0, 255, 0.1);
//         }
//         .selected {
//             background: rgba(0, 0, 255, 0.2);
//         }
//         #image-preview-container {
//             display: flex;
//             flex-wrap: wrap;
//             gap: 10px;
//             margin-top: 10px;
//         }
//         .image-preview {
//             position: relative;
//             width: 100px;
//             height: 100px;
//         }
//         .image-preview img {
//             width: 100%;
//             height: 100%;
//             object-fit: cover;
//             border-radius: 8px;
//         }
//         .remove-image {
//             position: absolute;
//             top: 0;
//             right: 0;
//             background: rgba(255, 0, 0, 0.7);
//             color: white;
//             border: none;
//             cursor: pointer;
//             padding: 2px 5px;
//             font-size: 12px;
//             border-radius: 50%;
//         }
//     </style>
// </head>
// <body class="bg-gray-100">
//     <div class="container mx-auto p-4">
//         <div class="flex">
//             <!-- Sidebar -->
//             <div class="w-1/4 pr-4">
//                 <h1 class="text-2xl font-bold mb-4">Welcome, sam@evil.com</h1>
//                 <h2 class="text-xl font-semibold mb-2">Your Information:</h2>
//                 <p class="mb-4">Email: sam@evil.com</p>
//                 <h2 class="text-xl font-semibold mb-2">Your Social Media Accounts:</h2>
//                 <ul class="list-disc pl-5 mb-4">
//                     <li>twitter: z911000</li>
//                 </ul>
//                 <h2 class="text-xl font-semibold mb-2">Add Social Media Account</h2>
//                 <div class="space-x-2">
//                     <a href="/auth/twitter" class="bg-blue-500 text-white px-4 py-2 rounded">Connect Twitter</a>
//                 </div>
//             </div>
//
//             <!-- Chat Section -->
//             <div class="w-3/4">
//                 <div class="chat-container bg-white rounded-lg shadow-lg overflow-hidden">
//                     <!-- Chat Messages -->
//                     <div class="chat-messages p-4 overflow-y-auto" id="chat-messages">
//                         <!-- Example Message -->
//                         <div class="message assistant mb-4 p-3 rounded-lg bg-gray-100" onclick="selectMessage(this)">
//                             <p>This is a sample message from the AI.</p>
//                         </div>
//                     </div>
//
//                     <!-- Chat Input -->
//                     <form class="chat-input-form flex flex-col p-4 bg-gray-100" id="chat-input-form">
//                         <div class="flex mb-2">
//                             <input type="text" id="message-input" class="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type your message..." required />
//                             <input type="file" id="image-input" accept="image/*" multiple class="hidden" />
//                             <label for="image-input" class="bg-green-500 text-white px-4 py-2 cursor-pointer">
//                                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                 </svg>
//                             </label>
//                             <button type="button" id="voice-record-button" class="bg-red-500 text-white px-4 py-2">
//                                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
//                                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422A12.083 12.083 0 0112 22.5a12.083 12.083 0 01-6.16-11.922L12 14z" />
//                                 </svg>
//                             </button>
//                             <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 transition duration-200">Send</button>
//                         </div>
//                         <div id="image-preview-container"></div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     </div>
//
//                 <script>
//
//                                             // Message selection logic
//                             // function selectMessage(element) {
//                             //     document.querySelectorAll('.message').forEach(msg => msg.classList.remove('selected'));
//                             //     element.classList.add('selected');
//                             // }
//
//         //                   function selectMessage(element) {
//         //     document.querySelectorAll('.message').forEach(msg => msg.classList.remove('selected'));
//         //     element.classList.add('selected');
//         // }
//         //
//         // // Recording logic
//         // if (!navigator.mediaDevices || !window.MediaRecorder) {
//         //     console.error("Your browser does not support audio recording!");
//         // }
//         //
//         // function startRecording() {
//         //     console.log("Attempting to start recording...");
//         //     navigator.mediaDevices.getUserMedia({ audio: true })
//         //         .then(stream => {
//         //             const mediaRecorder = new MediaRecorder(stream);
//         //             const audioChunks = [];
//         //             mediaRecorder.start();
//         //             console.log("Recording started...");
//         //
//         //             mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
//         //
//         //             mediaRecorder.onstop = () => {
//         //                 const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });
//         //                 const audioURL = URL.createObjectURL(audioBlob);
//         //                 console.log("Recording completed:", audioURL);
//         //                 displayRecording(audioURL);
//         //             };
//         //
//         //             setTimeout(() => {
//         //                 console.log("Stopping recording...");
//         //                 mediaRecorder.stop();
//         //             }, 5000);
//         //         })
//         //         .catch(error => {
//         //             console.error("Error accessing microphone:", error);
//         //             alert("Please allow microphone access to record audio.");
//         //         });
//         // }
//         //
//         // document.getElementById('voice-record-button').addEventListener('click', startRecording);
//         //
//         // function displayRecording(audioURL) {
//         //     const chatMessages = document.getElementById('chat-messages');
//         //     const audioElement = document.createElement('audio');
//         //     audioElement.src = audioURL;
//         //     audioElement.controls = true;
//         //     audioElement.className = 'max-w-xs rounded-lg mb-4';
//         //     const messageElement = document.createElement('div');
//         //     messageElement.className = 'message assistant mb-4 p-3 rounded-lg bg-gray-100';
//         //     messageElement.appendChild(audioElement);
//         //     chatMessages.appendChild(messageElement);
//         // }
//
//                            function selectMessage(element) {
//                         element.classList.toggle('selected');
//                     }
//
//                     // Recording logic with start/stop toggle
//                     let isRecording = false;
//                     let mediaRecorder;
//                     let audioChunks = [];
//
//                     function startRecording() {
//                         navigator.mediaDevices.getUserMedia({ audio: true })
//                             .then(stream => {
//                                 mediaRecorder = new MediaRecorder(stream);
//                                 audioChunks = [];
//                                 mediaRecorder.start();
//                                 console.log("Recording started...");
//                                 mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
//
//                                 mediaRecorder.onstop = () => {
//                                     const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });
//                                     const audioURL = URL.createObjectURL(audioBlob);
//                                     console.log("Recording completed:", audioURL);
//                                     displayAudioMessage(audioURL);
//                                 };
//                             })
//                             .catch(error => {
//                                 console.error("Error accessing microphone:", error);
//                                 alert("Please allow microphone access to record audio.");
//                             });
//                     }
//
//                     function stopRecording() {
//                         if (mediaRecorder) {
//                             console.log("Stopping recording...");
//                             mediaRecorder.stop();
//                         }
//                     }
//
//                     function toggleRecording() {
//                         const recordButton = document.getElementById('voice-record-button');
//                         if (!isRecording) {
//                             startRecording();
//                             recordButton.textContent = 'Stop';
//                             recordButton.classList.remove('bg-red-500');
//                             recordButton.classList.add('bg-green-500');
//                         } else {
//                             stopRecording();
//                             recordButton.textContent = 'Record';
//                             recordButton.classList.remove('bg-green-500');
//                             recordButton.classList.add('bg-red-500');
//                         }
//                         isRecording = !isRecording;
//                     }
//
//                     document.getElementById('voice-record-button').addEventListener('click', toggleRecording);
//
//                     // function displayRecording(audioURL) {
//                     //     const chatMessages = document.getElementById('chat-messages');
//                     //     const audioElement = document.createElement('audio');
//                     //     audioElement.src = audioURL;
//                     //     audioElement.controls = true;
//                     //     audioElement.className = 'max-w-xs rounded-lg mb-4';
//                     //     const messageElement = document.createElement('div');
//                     //     messageElement.className = 'message assistant mb-4 p-3 rounded-lg bg-gray-100';
//                     //     messageElement.appendChild(audioElement);
//                     //     chatMessages.appendChild(messageElement);
//                     // }
//
//
//                   function displayAudioMessage(audioURL, role = 'user') {
//                     const chatMessages = document.getElementById('chat-messages');
//                     const audioElement = document.createElement('audio');
//                     audioElement.src = audioURL;
//                     audioElement.controls = true;
//                     audioElement.className = 'max-w-xs rounded-lg mb-4';
//                         const messageElement = document.createElement('div');
//                         messageElement.className = \`message \${role} mb-4 p-3 rounded-lg \${role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}\`;
//
//                      messageElement.appendChild(audioElement);
//                     chatMessages.appendChild(messageElement);
//
//                     // Scroll to the bottom to ensure the new message is visible
//                     chatMessages.scrollTop = chatMessages.scrollHeight;
//
//                    }
//
//
//
//
//                     const chatMessages = document.getElementById('chat-messages');
//                     const messageInput = document.getElementById('message-input');
//                     const imageInput = document.getElementById('image-input');
//                     const imagePreviewContainer = document.getElementById('image-preview-container');
//                     const chatInputForm = document.getElementById('chat-input-form');
//
//                     imageInput.addEventListener('change', handleImageSelection);
//                     function handleImageSelection(event) {
//                         const files = event.target.files;
//                         imagePreviewContainer.innerHTML = '';
//
//                         for (let i = 0; i < files.length; i++) {
//                             const file = files[i];
//                             const reader = new FileReader();
//
//                             reader.onload = function(e) {
//                                 const previewDiv = document.createElement('div');
//                                 previewDiv.className = 'image-preview';
//                                 previewDiv.innerHTML = \`
//                                     <img src="\${e.target.result}" alt="Preview">
//                                     <button class="remove-image" data-index="\${i}">X</button>
//                                 \`;
//                                 imagePreviewContainer.appendChild(previewDiv);
//                             }
//
//                             reader.readAsDataURL(file);
//                         }
//                     }
//
//                     imagePreviewContainer.addEventListener('click', function(e) {
//                         if (e.target.classList.contains('remove-image')) {
//                             const index = e.target.getAttribute('data-index');
//                             const newFileList = Array.from(imageInput.files).filter((_, i) => i != index);
//
//                             const dataTransfer = new DataTransfer();
//                             newFileList.forEach(file => dataTransfer.items.add(file));
//                             imageInput.files = dataTransfer.files;
//
//                             handleImageSelection({ target: { files: imageInput.files } });
//                         }
//                     });
//                     chatInputForm.addEventListener('submit', async (event) => {
//                     event.preventDefault();
//                     const userMessage = messageInput.value.trim();
//                     const imageFiles = imageInput.files;
//
//                     if (!userMessage && imageFiles.length === 0) {
//                         return; // Don't send if there's no message and no images
//                     }
//
//                     displayMessage(userMessage, 'user');
//                     messageInput.value = '';
//                     displayMessage('AI is processing...', 'loading');
//
//                     let url;
//                     let body;
//
//                     // Check if there are images
//                     if (imageFiles.length > 0) {
//                         url = '/chat-with-image'; // Endpoint for handling messages with images
//                         const formData = new FormData();
//
//                         // Append user message
//                         formData.append('message', userMessage);
//
//                         // Append image files
//                         for (let i = 0; i < imageFiles.length; i++) {
//                             formData.append('images', imageFiles[i]); // Append each file
//                         }
//
//                         // Send FormData directly
//                         try {
//                             const response = await fetch(url, {
//                                 method: 'POST',
//                                 body: formData // Send FormData directly
//                             });
//
//                             const data = await response.json();
//                             removeLoadingIndicator();
//
//                             if (response.ok) {
//                                 displayMessage(data.response, 'assistant');
//                                 if (data.imageUrls) {
//                                     data.imageUrls.forEach(url => displayMessage(url, 'assistant'));
//                                 }
//                             } else {
//                                 displayMessage('Error: ' + data.error, 'assistant');
//                             }
//                         } catch (error) {
//                             console.error('Error:', error);
//                             removeLoadingIndicator();
//                             displayMessage('Error communicating with the server.', 'assistant');
//                         }
//                     } else {
//                         url = '/chat'; // Endpoint for handling text messages only
//
//                         // Prepare the JSON body
//                         body = JSON.stringify({ message: userMessage });
//
//                         try {
//                             const response = await fetch(url, {
//                                 method: 'POST',
//                                 headers: { 'Content-Type': 'application/json' },
//                                 body: body // Send JSON body
//                             });
//
//                             const data = await response.json();
//                             console.log("front end resonse "+ JSON.stringify(data.response, null, 2));
//                             removeLoadingIndicator();
//
//                             if (response.ok) {
//                                 // displayMessage(data.response, 'assistant');
//                                  if (data.response.text) {
//                                     // displayMessage(data.response.text, 'assistant');
//                                     displayMessageText(data.response.text, 'assistant');
//                                  }
//                                   if (data.response.images && data.response.images.length > 0) {
//                                   console.log("images array " + JSON.stringify(data.response.images));
//                                         data.response.images.forEach(imageUrl => {
//                                             displayMessageImage(imageUrl)
//                                         });
//                                     }
//                             } else {
//                                 displayMessage('Error: ' + data.error, 'assistant');
//                             }
//                         } catch (error) {
//                             console.error('Error:', error);
//                             removeLoadingIndicator();
//                             displayMessage('Error communicating with the server.', 'assistant');
//                         }
//                     }
//
//                     chatMessages.scrollTop = chatMessages.scrollHeight;
//                 });
//
//
//
//
//                     function displayMessage(message, role) {
//                         const messageElement = document.createElement('div');
//                         messageElement.className = \`message \${role} mb-4 p-3 rounded-lg \${role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}\`;
//
//                         // if (message.startsWith('http') || (message.startsWith('data:image') &&  (message.endsWith('.jpg') || message.endsWith('.png') || message.endsWith('.gif')))) {
//                         //     const imgElement = document.createElement('img');
//                         //     imgElement.src = message;
//                         //     imgElement.className = 'max-w-xs h-auto rounded-lg';
//                         //     messageElement.appendChild(imgElement);
//                         // } else {
//                         //     messageElement.textContent = message;
//                         // }
//
//                          if (typeof message === 'string') {
//                             messageElement.textContent = message;
//                                 } else if (typeof message === 'object' && message !== null) {
//                                     if (message.text) {
//                                         // const textElement = document.createElement('p');
//                                         // textElement.textContent = message.text;
//                                         // messageElement.appendChild(textElement);
//                                         displayMessageText(data.response.text, 'assistant');
//                                     }
//
//                                     if (message.images && Array.isArray(message.images)) {
//                                         message.images.forEach(imageUrl => {
//                                             // const imgElement = document.createElement('img');
//                                             // imgElement.src = imageUrl;
//                                             // imgElement.className = 'max-w-xs h-auto rounded-lg';
//                                             // messageElement.appendChild(imgElement);
//                                         displayMessageImage(imageUrl)
//
//                                         });
//                                     }
//                                 }
//
//                         chatMessages.appendChild(messageElement);
//                     }
//
//                     function removeLoadingIndicator() {
//                         const loadingMessages = chatMessages.querySelectorAll('.loading');
//                         loadingMessages.forEach(msg => msg.remove());
//                     }
//
//
//                     function displayMessageText(message, role) {
//                     const messageElement = document.createElement('div');
//                     messageElement.className = \`message \${role} mb-4 p-3 rounded-lg \${role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}\`;
//                     messageElement.textContent = message;
//                     chatMessages.appendChild(messageElement);
//                     chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
//                 }
//
//                 // Helper function to validate image types
//                     function isValidImageType(url) {
//                         return /\\.(jpeg|jpg|png|gif)$/i.test(url);
//                     }
//
//
//                 function displayMessageImage(imageUrl) {
//                     const imgElement = document.createElement('img');
//                     imgElement.src = imageUrl;
//                     imgElement.alt = 'Generated Image';
//                     imgElement.className = 'max-w-xs h-auto rounded-lg mb-4'; // Add Tailwind classes for styling
//
//                     const messageElement = document.createElement('div');
//                     messageElement.className = 'message assistant mb-4 p-3 rounded-lg bg-gray-100';
//                     messageElement.appendChild(imgElement);
//
//                     const chatMessages = document.getElementById('chat-messages');
//                     chatMessages.appendChild(messageElement);
//                     chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the bottom
//                 }
//
//
//
//                 </script>
//             </body>
//             </html>
//         `);
//     } catch (error) {
//         res.status(400).send(`Error: ${error.message}`);
//     }
// });
//
//
//
// // app.post('/auth/login', async (req, res) => {
// //     const { email, password } = req.body;
// //     try {
// //         const { data, error } = await supabase.auth.signInWithPassword({ email, password });
// //         if (error) throw error;
// //         // res.status(200).send({ message: 'Login successful', session: data.session });
// //         // Store the access token in the session
// //         req.session.accessToken = data.session.access_token;
// //         req.session.refreshToken = data.session.refresh_token;
// //         session.userid = data.user.id
// //         session.supabaseaccesstoken = data.session.access_token
// //         console.log("Login Successful \n "+data.session)
// //         // res.redirect('/home');
// //         res.status(201).send({ message: 'User registered successfully', user: data.session });
// //
// //     } catch (error) {
// //         res.status(400).send({ error: error.message });
// //     }
// // });
// // app.post('/auth/login', async (req, res) => {
// //     const { email, password } = req.body;
// //     try {
// //         const { data, error } = await supabase.auth.signInWithPassword({ email, password });
// //         if (error) throw error;
// //
// //         // Extract session details
// //         const { access_token, refresh_token, user } = data.session;
// //
// //         // Store the access token and refresh token in session or database if needed
// //         req.session.accessToken = access_token;
// //         req.session.refreshToken = refresh_token;
// //         session.userid = user.id;  // Storing the user ID for session tracking
// //         session.supabaseaccesstoken = access_token; // Store the access token for session use
// //
// //         console.log("Login Successful \n", data.session);
// //
// //         // Send the correct response
// //         res.status(200).send({
// //             // message: 'Login successful',
// //             accessToken: access_token,  // Send access token back
// //             refreshToken: refresh_token,  // Send refresh token back
// //             user: {
// //                 id: user.id,
// //                 email: user.email,
// //                 role: user.role,
// //                 email_verified: user.email_confirmed_at ? true : false,  // Assuming confirmed email status is used
// //                 createdAt: user.created_at,
// //                 updatedAt: user.updated_at,
// //                 provider: user.app_metadata.provider  // Example of provider info
// //             }
// //         });
// //     } catch (error) {
// //         // Send error response if login fails
// //         res.status(400).send({ error: error.message });
// //     }
// // });
//
//
// // app.get('/auth/twitter', passport.authenticate('twitter'));
//
// // app.get('/auth/twitter', (req, res, next) => {
// //     const state = JSON.stringify({ userId: req.query.userId });
// //     passport.authenticate('twitter', {
// //         state, // Include the state parameter
// //     })(req, res, next);
// // });
//
// // app.get('/auth/twitter', (req, res, next) => {
// //     const userId = req.query.userId; // Retrieve the userId from the query string
// //     if (!userId) {
// //         return res.status(400).send('Missing user ID');
// //     }
// //
// //     // Store userId in a state parameter
// //     const authenticator = passport.authenticate('twitter', {
// //         state: JSON.stringify({ userId }),
// //     });
// //
// //     authenticator(req, res, next);
// // });
//
// // app.get('/auth/twitter/callback',
// //     passport.authenticate('twitter', { failureRedirect: '/login' }),
// //     async function(req, res) {
// //         // Successful authentication user to supabase
// //         // req.session.twitterUser = req.user;
// //         // res.redirect('/link-account');
// //
// //         res.redirect('/');
// //     }
// // );
//
// // app.get('/auth/twitter/callback',
// //     passport.authenticate('twitter', { failureRedirect: '/login' }),
// //     async (req, res) => {
// //         try {
// //             // Parse the state parameter to retrieve userId
// //             const state = JSON.parse(req.query.state);
// //             const userId = state.userId;
// //
// //             if (!userId) {
// //                 return res.status(400).send('User ID not found in state');
// //             }
// //
// //             // Check if the Twitter account is already linked to this user
// //             const { data: existingAccount, error: checkError } = await supabase
// //                 .from('socials')
// //                 .select('*')
// //                 .eq('socialmedia', 'twitter')
// //                 .eq('account_username', req.user.username)
// //                 .single();
// //
// //             if (checkError && checkError.code !== 'PGRST116') {
// //                 console.error('Error checking for existing account:', checkError);
// //                 throw checkError;
// //             }
// //
// //             if (existingAccount) {
// //                 console.log('Twitter account already linked');
// //                 return res.redirect('your-app-url://twitter-already-linked');
// //             }
// //
// //             // Insert the new Twitter account
// //             const { error: insertError } = await supabase
// //                 .from('socials')
// //                 .insert({
// //                     owner: userId, // Associate with the user ID
// //                     socialmedia: 'twitter',
// //                     account_username: req.user.username,
// //                     access_token: req.user.token,
// //                     access_secret: req.user.tokenSecret,
// //                 });
// //
// //             if (insertError) {
// //                 console.error('Error inserting account into database:', insertError);
// //                 return res.status(500).send('Failed to save Twitter account');
// //             }
// //
// //             console.log('Twitter account linked successfully');
// //             res.redirect('/twitter-success');
// //         } catch (err) {
// //             console.error('Error in callback:', err);
// //             res.status(500).send('Internal server error');
// //         }
// //     }
// // );
//
// //
// // app.get('/link-account', async (req, res) => {
// //     const { data: supabaseUser, error } = await supabase.auth.getUser(req.session.accessToken);
// //
// //     if (error || !supabaseUser) {
// //         return res.redirect('/login');
// //     }
// //
// //     try {
// //         // Check if the Twitter account already exists
// //         const { data: existingAccount, error: checkError } = await supabase
// //             .from('socials')
// //             .select('*')
// //             .eq('socialmedia', 'twitter')
// //             .eq('account_username', session.x_username)
// //             .single();
// //
// //         if (checkError && checkError.code !== 'PGRST116') {
// //             throw checkError;
// //         }
// //
// //         if (existingAccount) {
// //             console.log("Twitter account already linked");
// //             res.send({
// //                 response: "twitter already linked"
// //             })
// //
// //             return res.redirect('/home');
// //         }
// //
// //         const { error: linkError } = await supabase
// //             .from('socials')
// //             .insert({
// //                 owner: session.userid,
// //                 socialmedia: 'twitter',
// //                 account_username: session.x_username,
// //                 access_token: session.x_accessToken,
// //                 access_secrect: session.x_accessSecret
// //             });
// //
// //         if (linkError) throw linkError;
// //         console.log("Twitter account linked successfully");
// //         res.redirect('/home');
// //     } catch (error) {
// //         console.error('Error linking account:', error);
// //         res.status(500).send('Error linking account');
// //     }
// // });
//
//
// // app.get('/tiktok/oauth', (req, res) => {
// //     const csrfState = Math.random().toString(36).substring(2);
// //     res.cookie('csrfState', csrfState, { maxAge: 60000 });
// //
// //     let url = 'https://www.tiktok.com/v2/auth/authorize/';
// //
// //     // the following params need to be in `application/x-www-form-urlencoded` format.
// //     url += '?client_key= sbawusmc1oa26dq0nc';
// //     url += '&scope=user.info.basic';
// //     url += '&response_type=code';
// //     url += '&redirect_uri= https://189d-2001-569-7466-a400-907b-e7-a239-3f9e.ngrok-free.app/auth/tiktok/callback';
// //     url += '&state=' + csrfState;
// //
// //     res.redirect(url);
// // })
// //
// // app.get('/auth/tiktok/callback', async (req, res) => {
// //
// //
// //     }
// //
// // );
//
//
//
// // async function generateAIContent(prompt) {
// //     try {
// //         // Determine the type(s) dynamically and number of images if applicable
// //         const { types, imageCount } = determineContentTypesAndImageCount(prompt);
// //
// //         if (!types.length) {
// //             throw new Error('Unable to determine content type from the prompt.');
// //         }
// //
// //         const results = {};
// //
// //         // Handle text-only situation
// //         if (types.length === 1 && types.includes('text')) {
// //             const textPrompt = await preprocessPromptForText(prompt);
// //             console.log(textPrompt);
// //             const textResponse = await generateText(textPrompt);
// //             results.text = textResponse;
// //             return results;
// //         }
// //
// //         // Handle image-only or multiple images
// //         if (types.length === 1 && types.includes('image')) {
// //             const imageprompt = await preprocessPromptForImage(prompt);
// //             const imageResponse = await generateImages(imageprompt,imageCount);
// //             results.images = imageResponse;
// //             return results;
// //         }
// //
// //         // Handle both text and image(s)
// //         if (types.length === 2 && types.includes('text') && types.includes('image')) {
// //             const textPrompt = await preprocessPromptForText(prompt);
// //             const imageprompt = await preprocessPromptForImage(prompt);
// //             const [textResponse, imageResponse] = await Promise.all([
// //
// //                 await generateText(textPrompt),
// //                 await generateImages(imageprompt,imageCount),
// //             ]);
// //             results.text = textResponse;
// //             results.images = imageResponse;
// //             return results;
// //         }
// //     } catch (error) {
// //         console.error('Error generating AI content:', error.message);
// //         throw new Error('Failed to generate AI content.');
// //     }
// // }
//
//
// // function determineContentTypesAndImageCount(prompt) {
// //     const lowerPrompt = prompt.toLowerCase();
// //
// //     // Check for image-related terms
// //     const imageKeywords = ['image', 'visual', 'photo', 'picture', 'illustration'];
// //     const hasImage = imageKeywords.some((keyword) => lowerPrompt.includes(keyword));
// //
// //     // Check for text-related terms
// //     const textKeywords = ['write', 'quote', 'text', 'description', 'caption'];
// //     const hasText = textKeywords.some((keyword) => lowerPrompt.includes(keyword));
// //
// //     // Detect image count (default to 1 if not specified)
// //     const imageCountMatch = lowerPrompt.match(/(\d+)\s+(images|photos|pictures|visuals)/);
// //     const imageCount = imageCountMatch ? parseInt(imageCountMatch[1], 10) : 1;
// //
// //     const types = [];
// //     if (hasImage) types.push('image');
// //     if (hasText) types.push('text');
// //
// //     return { types, imageCount };
// // }
//
//
//
// // async function generateImages(prompt, count = 1) {
// //     try {
// //         const input = { prompt: String(prompt) };
// //
// //         // Generate image tasks in parallel
// //         const generationTasks = Array.from({ length: count }, async (_, index) => {
// //             try {
// //                 const result = await run('@cf/black-forest-labs/flux-1-schnell', input);
// //
// //                 if (result instanceof ArrayBuffer) {
// //                     const jsonString = new TextDecoder().decode(result);
// //                     const jsonResult = JSON.parse(jsonString);
// //
// //                     const toBlob = base64ToBlob(jsonResult.result.image, 'image/jpeg');
// //                     const url = await uploadToSupabaseStorage(
// //                         toBlob,
// //                         `images/${Date.now()}-generated-image-${index}`,
// //                         "images"
// //                     );
// //
// //                     console.log(`Image ${index + 1} generated: ${url}`);
// //                     return url; // Return the URL for this image
// //                 } else {
// //                     throw new Error("Unexpected response format");
// //                 }
// //             } catch (error) {
// //                 console.error(`Error generating image ${index + 1}:`, error);
// //                 return null; // Return null for failed image
// //             }
// //         });
// //
// //         // Wait for all tasks to complete
// //         const urls = await Promise.all(generationTasks);
// //
// //         // Filter out null values (failed generations)
// //         const successfulUrls = urls.filter((url) => url !== null);
// //
// //         if (successfulUrls.length === 0) {
// //             throw new Error("All image generation tasks failed.");
// //         }
// //
// //         return successfulUrls;
// //     } catch (error) {
// //         console.error("Error generating images:", error);
// //         throw error;
// //     }
// // }

// conversationHistory.push({ role: "user", content: message });
//
// const validMessages = conversationHistory.filter(msg => msg.role && msg.content);
//
// const messages = [
//     { role: "system", content: "You are a high-level social media manager." },
//     ...validMessages
// ];
//
// // Check if the message is a request for image generation
// if (message.toLowerCase().includes("generate image")) {
//     const prompt = message; // Use the entire message as the prompt
//     const  imageUrl = await generateImage(prompt); // Call your generateImage function
//     console.log("image url in /chat \n " + imageUrl)
//     // Store the generated image URL in conversation history
//     conversationHistory.push({ role: "assistant", content: imageUrl });
//
//     return res.json({
//         response: imageUrl, // Return the blob URL directly
//         conversationHistory: validMessages
//     });
// }
//
// const response = await ai.chat.completions.create({
//     model: "grok-2-1212",
//     messages,
//     tools: toolsDefinition,
//     tool_choice: "auto",
// });
//
// let aiResponse = response.choices[0].message;
// let toolCalls = aiResponse.tool_calls;
//
// if (toolCalls) {
//     for (const toolCall of toolCalls) {
//         const functionName = toolCall.function.name;
//         const functionArgs = JSON.parse(toolCall.function.arguments);
//
//         if (toolsMap[functionName]) {
//             const result = toolsMap[functionName](functionArgs);
//             conversationHistory.push({
//                 role: "tool",
//                 content: JSON.stringify(result),
//                 tool_call_id: toolCall.id
//             });
//         } else {
//             console.error(`Unknown function called: ${functionName}`);
//         }
//     }
//
//     const finalResponse = await ai.chat.completions.create({
//         model: "grok-2-1212",
//         messages: [
//             { role: "system", content: "You are a high-level social media manager." },
//             ...validMessages,
//             ...conversationHistory.filter(msg => msg.role === "tool")
//         ],
//         tools: toolsDefinition,
//         tool_choice: "auto"
//     });
//
//     aiResponse = finalResponse.choices[0].message;
// }
//
// if (aiResponse.content) {
//     conversationHistory.push({ role: "assistant", content: aiResponse.content });
// }
//
// res.json({
//     response: advancedCleanup(aiResponse.content),
//     conversationHistory: validMessages
// });

// app.post("/ai/chat", async (req, res) => {
//
//     const { prompt,user_id } = req.body;
//
//     if (!prompt) {
//         return res.status(400).json({ error: 'Prompt is required' });
//     }
//
//     try{
//         const response = await generateAIContent(prompt,user_id)
//         console.log(response)
//         res.json(response)
//
//     }catch(err){
//         console.log(err);
//     }
//
// })

// app.post("/ai/chat", async (req, res) => {
//     const { prompt, user_id } = req.body;
//
//     // Validate inputs
//     if (!prompt || typeof prompt !== 'string') {
//         return res.status(400).json({ error: 'Invalid or missing prompt' });
//     }
//     if (!user_id) {
//         return res.status(400).json({ error: 'User ID required' });
//     }
//
//     try {
//         // 1. Retrieve conversation history
//         const { data: existingConvo, error: fetchError } = await supabase
//             .from('conversations')
//             .select('messages')
//             .eq('user_id', user_id)
//             .order('created_at', { ascending: false })
//             .limit(1);
//
//         let messages = existingConvo?.[0]?.messages || [];
//
//         // 2. Add system message if missing
//         if (!messages.some(m => m.role === "system")) {
//             messages = [
//                 {
//                     role: "system",
//                     content: "You are a versatile AI assistant capable of handling both text and image-based requests."
//                 },
//                 ...messages
//             ];
//         }
//
//         // 3. Add new user message
//         messages.push({ role: "user", content: prompt });
//
//         // 4. Generate AI response
//         const response = await generateAIContent(prompt, user_id, messages);
//
//         // 5. Add AI response to history
//         messages.push({ role: "assistant", content: response.text });
//
//         // 6. Update database
//         const { error: updateError } = await supabase
//             .from('conversations')
//             .upsert({
//                 user_id: user_id,
//                 messages: messages
//             });
//
//         if (updateError) throw updateError;
//
//         // 7. Return formatted response
//         res.json(
//         response);
//
//     } catch (err) {
//         console.error('Error in /ai/chat:', err);
//         res.status(500).json({
//             success: false,
//             error: err.message,
//             system: "Failed to process AI request"
//         });
//     }
// });
// app.post('/chat', async (req, res) => {
//     const { message } = req.body;
//     console.log('message is ' + message);
//     if (!message || typeof message !== 'string') {
//         return res.status(400).json({ error: 'Invalid or missing message' });
//     }
//
//     try {
//
//         const response = await generateAIContent(message)
//         console.log("node response \n  "+ JSON.stringify(response, null, 2));
//
//         return res.json({
//             response: response,
//         })
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'An error occurred while processing your request.' });
//     }
// });

// async function generateText(prompt) {
//     try {
//
//         conversationHistory.push({ role: "user", content: prompt });
//
//         const validMessages = conversationHistory.filter(msg => msg.role && msg.content);
//
//         const messages = [
//             { role: "system", content: "You are a high-level social media manager." },
//             ...validMessages
//         ];
//
//         const response = await ai.chat.completions.create({
//             model: "grok-2-latest",
//             messages,
//             tools: toolsDefinition,
//             tool_choice: "auto",
//         });
//
//         let aiResponse = response.choices[0].message;
//         return advancedCleanup(aiResponse.content);
//     } catch (error) {
//         console.warn('Failed to generate text:', error.message);
//         return 'Error generating text';
//     }
// }
// async function generateText(prompt, user_id, existingMessages = []) {
//     try {
//         // Get full message history from DB if not provided
//         const messages = existingMessages.length > 0 ? existingMessages :
//             await getConversationHistory(user_id);
//
//         const systemMessage = {
//             role: "system",
//             content: "You are a high-level social media manager."
//         };
//
//         // Ensure system message is first
//         const fullMessages = messages.some(m => m.role === "system")
//             ? messages
//             : [systemMessage, ...messages];
//
//         const response = await ai.chat.completions.create({
//             model: "grok-2-latest",
//             messages: fullMessages,
//             tools: toolsDefinition,
//             tool_choice: "auto",
//         });
//
//         return advancedCleanup(response.choices[0].message.content);
//
//     } catch (error) {
//         console.error('Text generation failed:', error);
//         return 'Error generating response';
//     }
// }


// app.post("/ai/chat", async (req, res) => {
//     const { prompt, user_id } = req.body;
//
//     if (!prompt || typeof prompt !== 'string') {
//         return res.status(400).json({ error: 'Invalid or missing prompt' });
//     }
//     if (!user_id) {
//         return res.status(400).json({ error: 'User ID required' });
//     }
//
//     try {
//         // 1. Retrieve raw conversation history
//         const { data: existingConvo } = await supabase
//             .from('conversations')
//             .select('messages')
//             .eq('user_id', user_id)
//             .order('created_at', { ascending: false })
//             .limit(1);
//
//         const messages = existingConvo?.[0]?.messages || [];
//
//         // 2. Add user message without modifying messages
//         const updatedMessages = [...messages, { role: "user", content: prompt }];
//
//         // 3. Generate response (system check happens inside generateText)
//         const response = await generateAIContent(prompt, user_id, updatedMessages);
//
//         // 4. Update history with AI response
//         const finalMessages = [
//             ...updatedMessages,
//             { role: "assistant", content: response.text }
//         ];
//
//         await supabase.from('conversations').upsert({
//             user_id: user_id,
//             messages: finalMessages
//         });
//
//         res.json(response);
//
//     } catch (err) {
//         console.error('Error in /ai/chat:', err);
//         res.status(500).json({
//             success: false,
//             error: err.message,
//             system: "Failed to process AI request"
//         });
//     }
// });



// app.post('/chat-with-image', upload.array('images'), async (req, res) => {
//     try {
//         const userMessage = req.body.message;
//
//         // Check if userMessage is provided
//         if (!userMessage) {
//             return res.status(400).json({ error: 'User message is required' });
//         }
//
//         console.log(req.files)
//
//         // Upload images to Supabase and get URLs
//         const uploadedImageUrls = await convertImagesToBase64(req.files);
//         const messages = [
//             { role: "user", content: userMessage },
//             ...uploadedImageUrls.map(url => ({
//                 role: "user",
//                 content: [{
//                     type: "image_url",
//                     image_url: {
//                         url: url,
//                         detail: "high",
//                     },
//                 }],
//             }))
//         ];
//
//         conversationHistory.push(messages)
//
//
//         console.log("Messages sent to AI:", messages);
//
//         // Assuming you have a function to get AI response
//         const completion = await ai.chat.completions.create({
//             model: "grok-2-vision-1212",
//             messages: messages,
//         });
//
//         const aiResponse = completion.choices[0].message.content;
//         console.log("AI Response:", aiResponse);
//
//         // Send response back to client
//         res.json({
//             response: advancedCleanup(aiResponse),
//             // imageUrls: uploadedImageUrls,
//         });
//     } catch (error) {
//         console.error('Error in /chat-with-image:', error);
//         res.status(500).json({ error: 'An error occurred while processing your request.' });
//     }




// Helper to determine content types and image count
// function determineContentTypesAndImageCount(prompt) {
//     const lowerPrompt = prompt.toLowerCase().trim();
//
//     // Define keyword categories
//     const imageKeywords = ['image', 'visual', 'photo', 'picture', 'illustration', 'graphic', 'drawing', 'art'];
//     const textKeywords = ['write', 'quote', 'text', 'description', 'caption', 'compose', 'generate'];
//     const postKeywords = ['post', 'share', 'upload', 'publish', 'make a post', 'create a post'];
//     const socialMediaPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok'];
//
//     // Check for content types
//     const hasImage = imageKeywords.some(keyword => lowerPrompt.includes(keyword));
//     const hasText = textKeywords.some(keyword => lowerPrompt.includes(keyword));
//     const isPostPrompt = postKeywords.some(keyword => lowerPrompt.includes(keyword));
//
//     // Detect explicit number of images requested
//     const imageCountMatch = lowerPrompt.match(/(\d+)\s+(images|photos|pictures|visuals|graphics)/);
//     const imageCount = imageCountMatch ? parseInt(imageCountMatch[1], 10) : (hasImage ? 1 : 0);
//
//     // Detect the social media platform (if any)
//     const detectedPlatform = socialMediaPlatforms.find(platform => lowerPrompt.includes(platform)) || null;
//
//     // Classify content types (strict separation of "post")
//     const types = [];
//     if (isPostPrompt) {
//         types.push('post');  // Ensure "post" is always separate
//     } else {
//         if (hasImage) types.push('image');
//         if (hasText) types.push('text');
//     }
//
//     // Default to 'text' if no type detected
//     if (types.length === 0) {
//         console.warn('No specific content type detected, defaulting to text.');
//         types.push('text');
//     }
//
//     return { types, imageCount };
// }



// // Create the route for AI classification
// app.post("/ai/classify", async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         if (!prompt) {
//             return res.status(400).json({ error: "Prompt is required" });
//         }
//
//         // Call the classifier function to get the classification.
//         const classification = await classifyPrompt(prompt);
//
//         // Return the classification result as JSON.
//         res.json({ success: true, classification });
//     } catch (error) {
//         console.error("Error in /ai/classify route:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });
//
//
//
//
// // Helper function: Use an AI model to classify the prompt.
// async function classifyPrompt(prompt) {
//     const classificationSystemMessage = {
//         role: "system",
//         content: "You are a classifier that analyzes a prompt and returns a JSON object with two properties: 'type' (which can be 'post', 'text', or 'image') and 'imageCount' (a number, defaulting to 0 if no images are requested)."
//     };
//
//     // Few-shot examples can be added in the prompt below if needed.
//     const classificationPrompt =
//         `Analyze the following prompt and determine its content type and the number of images requested.
//
//     Examples:
//     1. Prompt: "Write a quote about inspiration"
//        Output: {"type": "text", "imageCount": 0}
//     2. Prompt: "Generate an image of a sunset"
//        Output: {"type": "image", "imageCount": 1}
//     3. Prompt: "Post this image on Instagram"
//        Output: {"type": "post", "imageCount": 1}
//
//
//     Now, analyze this prompt:
//     "${prompt}"
//
//     Output:`;
//
//     try {
//         const response = await ai.chat.completions.create({
//             model: "grok-2-latest", // or your preferred classification model
//             messages: [
//                 classificationSystemMessage,
//                 { role: "user", content: prompt }
//             ]
//         });
//
//         const resultText = response.choices[0].message.content;
//         console.log(resultText);
//         // Attempt to parse the result as JSON.
//         const classification = JSON.parse(resultText);
//         return classification;
//     } catch (error) {
//         console.error("Classification failed:", error);
//         // If the classification fails, fallback to default values.
//         return { type: "text", imageCount: 0 };
//     }
// }



// Configure Passport Twitter Strategy
// passport.use(new TwitterStrategy(
//     {
//         consumerKey: "cpig4OoLnJ5e3q7UTKBTApLjL", // Add your Twitter consumer key here
//         consumerSecret: "IWcR87FzMLqoVfAllcY0cBcW2jVvlsTSze2oBpfLMjMZbI67Cf", // Add your Twitter consumer secret here
//         callbackURL: "http://localhost:5500/auth/twitter/callback"
//     },
//     async function(req,token, tokenSecret, profile, cb) {
//
//         // console.log("access token" , token);
//         // console.log("access token secret" , tokenSecret);
//         // Save user information and tokens to your database here
//         // profile.accessToken = token;
//         // profile.tokenSecret = tokenSecret;
//         //
//         // session.x_accessToken = profile.accessToken;
//         // session.x_accessSecret = profile.tokenSecret;
//         // session.x_username = profile.username;
//         //
//         // console.log("Successful authentication");
//         // console.log("Token:", token);
//         // console.log("Token Secret:", tokenSecret);
//         // console.log("Profile:", profile);
//         // console.log("cb" + cb)
//
//         // return cb(null, profile);
//
//         try {
//             const userId = session.userId;
//             const twitterUsername = profile.username;
//
//             // 1. Check if THIS USER already linked THIS TWITTER ACCOUNT
//             const { data: existingAccount, error: checkError } = await supabase
//                 .from('socials')
//                 .select('*')
//                 .eq('owner', userId)          // Check by user ID
//                 .eq('socialmedia', 'twitter') // Check for Twitter accounts
//                 .eq('account_username', twitterUsername) // Check specific Twitter handle
//                 .single();
//
//             // Handle "no rows found" error gracefully
//             if (checkError && checkError.code !== 'PGRST116') {
//                 console.error('Error checking for existing account:', checkError);
//                 return cb(checkError);
//             }
//
//             // 2. Block if user already linked this exact Twitter account
//             if (existingAccount) {
//                 const error = new Error('This Twitter account is already linked to your profile!');
//                 return cb(error);
//             }
//
//             // 3. Insert new account if not a duplicate
//             const { error: insertError } = await supabase
//                 .from('socials')
//                 .insert({
//                     owner: userId,
//                     socialmedia: 'Twitter',
//                     account_username: twitterUsername,
//                     access_token: token,
//                     access_secrect: tokenSecret
//                 });
//
//             if (insertError) {
//                 console.error('Error inserting account:', insertError);
//                 return cb(insertError);
//             }
//
//             console.log('Twitter account linked successfully');
//             return cb(null, profile);
//         } catch (err) {
//             return cb(err);
//         }
//     }
// ));



//
// app.get('/tweet', (req, res) => {
//     if (req.isAuthenticated()) {
//         res.send(`
//             <!DOCTYPE html>
//             <html lang="en">
//             <head>
//                 <meta charset="UTF-8">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <title>Post a Tweet</title>
//                 <script>
//                     // JavaScript function to clear the selected media
//                     function clearMedia() {
//                         const fileInput = document.getElementById('imageInput');
//                         fileInput.value = ''; // Clear the selected file
//                         const message = document.getElementById('mediaClearedMessage');
//                         message.textContent = 'Media cleared.';
//                         setTimeout(() => message.textContent = '', 2000); // Remove message after 2 seconds
//                     }
//                 </script>
//             </head>
//             <body>
//                 <h1>Post a Tweet</h1>
//                 <form action="/tweet" method="POST" enctype="multipart/form-data">
//                     <textarea name="text" rows="4" cols="50" placeholder="What's happening?"></textarea><br><br>
//                     <input type="file" id="imageInput" name="image" accept="image/*">
//                     <button type="button" onclick="clearMedia()">Clear Media</button><br><br>
//                     <span id="mediaClearedMessage" style="color: green;"></span><br>
//                     <button type="submit">Tweet</button>
//                 </form>
//             </body>
//             </html>
//         `);
//     } else {
//         res.redirect('/auth/twitter'); // Redirect to Twitter authentication if not logged in
//     }
// });
//
//
//
//
// // Handle the form submission
// app.post('/tweet', upload.single('image'), async (req, res) => {
//     const text = req.body.text;
//     const image = req.file; // The uploaded image file
//
//     // console.log('Access Token:', req.user.accessToken);
//     // console.log('Access Secret:', req.user.tokenSecret);
//
//     // Initialize Twitter client
//     const client = new TwitterApi({
//         appKey: 'cpig4OoLnJ5e3q7UTKBTApLjL',
//         appSecret: 'IWcR87FzMLqoVfAllcY0cBcW2jVvlsTSze2oBpfLMjMZbI67Cf',
//         accessToken: req.user.accessToken, // Replace with the actual token
//         accessSecret: req.user.tokenSecret, // Replace with the actual token secret
//     });
//
//     try {
//         let mediaId = null;
//
//         // Upload the image if provided
//         if (image) {
//             const mimeType = getMimeType(image.path);
//             console.log('Detected MIME type:', mimeType);
//
//             const mediaData = await client.v1.uploadMedia(fs.readFileSync(image.path), {
//                 mimeType, // Use dynamically determined MIME type
//             });
//             mediaId = mediaData;
//             console.log('Uploaded Media ID:', mediaId);
//         }
//
//         // Construct tweet parameters
//         const tweetParams = mediaId
//             ? { text, media: { media_ids: [mediaId] } }
//             : { text };
//
//         // Post the tweet
//         const tweet = await client.v2.tweet(tweetParams);
//
//
//         console.log('Tweet posted successfully:', tweet);
//
//         // Cleanup the uploaded file
//         if (image) fs.unlinkSync(image.path);
//
//         res.status(200).send('Tweet posted successfully!');
//     } catch (error) {
//         console.error('Error posting tweet:', error);
//
//         // Cleanup the uploaded file in case of an error
//         if (image) fs.unlinkSync(image.path);
//
//         res.status(500).send('Error posting tweet');
//     }
// });
//
//
// // Route to send a direct message
// app.post('/send-message', async (req, res) => {
//     if (req.isAuthenticated()) {
//         const { recipientId, messageText } = req.body; // Get recipient ID and message from request body
//         const { accessToken, tokenSecret } = req.user;
//
//         try {
//             const result = await sendDirectMessage(recipientId, messageText, accessToken);
//             res.json(result);
//         } catch (error) {
//             console.error("Error sending direct message:", error);
//             res.status(500).send("Error sending direct message");
//         }
//     } else {
//         res.status(401).send("User not authenticated");
//     }
// });
//
// app.get('/ai', async (req, res) => {
//     const completion = await ai.chat.completions.create({
//         model: "grok-2-1212",
//         messages: [
//             {role:"system", content: "You are a high level social media manager, your job is to get context of user type of post, generate text and images relating to the user and upload "},
//             {role:"user", content: "Whast the meaning of grok"},
//         ]
//     })
//     console.log(completion.choices[0].message);
//     // console.log(completion);
//
//     }
// )


// async function postTweets(res, user) {
//     const users = user.map(user => ({
//         accessToken: user.accessToken,
//         accessSecret: user.accessSecret
//     }))[0];
//
//     const url = "https://api.twitter.com/2/tweets";
//     const token = users.accessToken;
//     const tokenSecret = users.accessSecret;
//     const message = { text: "Hello, AI API! 🚀" };
//
//     // Initialize OAuth 1.0a with your credentials
//     const oauthClient = oauth({
//         consumer: {
//             key: process.env.TWITTER_CONSUMER_KEY, // Your consumer key
//             secret: process.env.TWITTER_CONSUMER_SECRET, // Your consumer secret
//         },
//         token: {
//             key: token, // User's OAuth token
//             secret: tokenSecret, // User's OAuth token secret
//         },
//         signature_method: 'HMAC-SHA1',
//         hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64'),
//     });
//
//     // Prepare the request data for signing
//     const requestData = {
//         url,
//         method: 'POST',
//         data: message,
//     };
//
//     // Generate OAuth headers
//     const headers = oauthClient.toHeader(oauthClient.authorize(requestData));
//
//     try {
//         // Make the API call with the signed headers
//         const response = await axios.post(url, message, {
//             headers: {
//                 ...headers,
//                 'Content-Type': 'application/json',
//             },
//         });
//
//         // Send the success response
//         res.send("Tweet posted successfully!");
//     } catch (error) {
//         // Log the error and ensure only one response is sent
//         if (!res.headersSent) {
//             console.error("Error posting tweet:", error.response?.data || error.message);
//             res.status(500).send("Error posting tweet");
//         }
//     }
// }

// app.post("/ai/post", upload.array('images'),async (req, res) => {
//
//     const {prompt, data} = req.body;
//
//     console.log(JSON.stringify(prompt), JSON.stringify(data), req.files);
//
//     res.status(200).json({
//         response: "Post is sucessfully uploaded to your twitter here is a link to the post",
//     })
//
// })


// app.get('/auth/twitter/callback',
//     passport.authenticate('twitter', { failureRedirect: '/login' }),
//     (req, res) => {
//
//         // console.log("req.user"+req.user);
//         // Twitter account is already linked at this point
//         res.redirect('/twitter-success');
//     }
// );


// app.get('/auth/twitter', (req, res, next) => {
//     const userId = req.query.userId;
//     console.log(userId);
//     session.userId = userId;
//     // if (!userId) return res.status(400).send('Missing user ID');
//
//     // Dynamically set callback URL with userId
//     // const callbackURL = `http://localhost:5500/auth/twitter/callback?userId=${userId}`;
//
//
//     oauth.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
//         if (error) {
//             console.error("Error getting OAuth request token:", error);
//             return res.status(500).send("Error requesting OAuth token");
//         }
//
//         // Store request token & secret in memory
//         oauthRequestTokens[oauth_token] = oauth_token_secret;
//
//         // Redirect user to Twitter for authentication
//         res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`);
//     });
//
//
//
//     // passport.authenticate('twitter', { callbackURL })(req, res, next);
// });
//
//
// // 2️⃣ Handle Twitter Callback & Exchange Request Token for Access Token
// app.get('/auth/twitter/callback', (req, res) => {
//     const { oauth_token, oauth_verifier } = req.query;
//     const oauth_token_secret = oauthRequestTokens[oauth_token];
//
//     if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
//         return res.status(400).send("Invalid OAuth request");
//     }
//
//     // Exchange request token for access token
//     oauth.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier,
//         async (error, oauth_access_token, oauth_access_token_secret, results) => {
//             if (error) {
//                 console.error("Error getting OAuth access token:", error);
//                 return res.status(500).send("Error getting access token");
//             }
//
//             // Store user session
//             req.session.oauthAccessToken = oauth_access_token;
//             req.session.oauthAccessSecret = oauth_access_token_secret;
//             req.session.twitterUserId = results.user_id;
//             req.session.twitterScreenName = results.screen_name;
//
//             console.log("OAuth Access Token:", oauth_access_token);
//             console.log("OAuth Access Token Secret:", oauth_access_token_secret);
//             console.log("Twitter User ID:", results.user_id);
//             console.log("Twitter Screen Name:", results.screen_name);
//
//
//             const linked = await linkTwitterAccount(session.userId, results.screen_name, oauth_token, oauth_token_secret);
//
//             if (linked != false) {
//                 res.redirect('/twitter-success');
//             } else {
//                 res.redirect(`auth/twitter`);
//             }
//             // Redirect to success page
//
//         }
//     );
// });


// sync function writeTweet({ oauth_token, oauth_token_secret }, tweet) {
//     const token = {
//         key: oauth_token,
//         secret: oauth_token_secret
//     }

//     console.log(token , "token on write tweet" , tweet , "tweet")

//     const url = 'https://api.twitter.com/2/tweets';

//     const headers = oauth.toHeader(oauth.authorize({
//         url,
//         method: 'POST'
//     }, token));

//     try {
//         // const request = await fetch(url, {
//         //     method: 'POST',
//         //     body: JSON.stringify(tweet),
//         //     responseType: 'json',
//         //     headers: {
//         //         Authorization: headers['Authorization'],
//         //         'user-agent': 'V2CreateTweetJS',
//         //         'content-type': 'application/json',
//         //         'accept': 'application/json'
//         //     }
//         // })

//         const request = await axios.post(url, tweet, {
//             headers: {
//                 Authorization: headers['Authorization'],
//                 'User-Agent': 'V2CreateTweetJS', // Use 'User-Agent' in PascalCase
//                 'Content-Type': 'application/json',
//                 Accept: 'application/json'
//             }
//         });

//         const body = await request.json();
//         return body;
//     } catch (error) {
//         console.error('Error:', error)
//     }
// }


// async function postTweetToTwitter({ textEntries, imageFiles, user, combineText = false }) {
    //     // Validate: at least one of text or images must be present.
    //     if ((!textEntries || textEntries.length === 0) && (!imageFiles || imageFiles.length === 0)) {
    //         throw new Error("At least text or an image must be provided.");
    //     }
    
    
    //     // console.log(  "USER TO BE POSTED" + JSON.stringify(user));
    
    
    //     const users = user.map(user => ({
    //         accessToken: user.accessToken,
    //         accessSecret: user.accessSecret
    //     }))[0];
    
    //     console.log("userinfo " + JSON.stringify(users));
    
    
    
    
    //     // Initialize Twitter client.
    //     const client = new TwitterApi({
    //         appKey: 'cpig4OoLnJ5e3q7UTKBTApLjL',
    //         appSecret: 'IWcR87FzMLqoVfAllcY0cBcW2jVvlsTSze2oBpfLMjMZbI67Cf',
    //         accessToken: "ftkuIFmSB2VVizjMRdzNHBJ5cpVQfh",
    //         accessSecret: "pGrboeVZ4ztnymfisxsBiOTCtqUII78z7QxBQ1EglsbbU",
    //     });
    
    //     // Process images: upload each file and collect media IDs.
    //     // let mediaIds = [];
    //     // if (imageFiles && imageFiles.length > 0) {
    //     //     for (const file of imageFiles) {
    //     //         if (file) {
    //     //             const mimeType = getMimeType(file.path);
    //     //             console.log("Detected MIME type:", mimeType);
    //     //             const imageData = fs.readFileSync(file.path);
    //     //             const mediaData = await client.v1.uploadMedia(imageData, { mimeType });
    //     //             mediaIds.push(mediaData);
    //     //             console.log("Uploaded Media ID:", mediaData);
    //     //             // Cleanup the uploaded file.
    //     //             fs.unlinkSync(file.path);
    //     //         }
    //     //     }
    //     // }
    //     let mediaIds = [];
    //     if (imageFiles && imageFiles.length > 0) {
    //         for (const file of imageFiles) {
    //             if (file) {
    //                 let mimeType;
    //                 let imageData;
    //                 if (file.path) {
    //                     // Using disk storage: use file.path
    //                     mimeType = getMimeType(file.path);
    //                     console.log("Detected MIME type from path:", mimeType);
    //                     imageData = fs.readFileSync(file.path);
    //                 } else if (file.buffer) {
    //                     // Using memory storage: use file.buffer and file.mimetype
    //                     mimeType = file.mimetype;
    //                     console.log("Detected MIME type from buffer:", mimeType);
    //                     imageData = file.buffer;
    //                 } else {
    //                     throw new Error("No file data available.");
    //                 }
    
    //                 // Upload the image using Twitter API
    //                 const mediaData = await client.v1.uploadMedia(imageData, { mimeType });
    //                 mediaIds.push(mediaData);
    //                 console.log("Uploaded Media ID:", mediaData);
    
    //                 // Cleanup: if using disk storage, remove the file.
    //                 if (file.path && fs.existsSync(file.path)) {
    //                     fs.unlinkSync(file.path);
    //                 }
    //             }
    //         }
    //     }
    
    
    //     // Process text entries.
    //     let tweetTexts = [];
    //     if (textEntries && textEntries.length > 0) {
    //         if (combineText) {
    //             // Combine all text entries into one tweet.
    //             tweetTexts = [textEntries.join(" ").trim()];
    //         } else {
    //             // Each text entry becomes its own tweet.
    //             tweetTexts = textEntries.map(text => text.trim());
    //         }
    //     }
    
    //     // If no text is provided but images are available, post tweet with empty text.
    //     if (tweetTexts.length === 0 && mediaIds.length > 0) {
    //         tweetTexts = [""];
    //     }
    
    //     // Post tweet(s) using the Twitter client.
    //     let responses = [];
    //     for (const tweetText of tweetTexts) {
    //         const tweetParams = mediaIds.length > 0
    //             ? { text: tweetText, media: { media_ids: mediaIds } }
    //             : { text: tweetText };
    //         const tweet = await client.v2.tweet(tweetParams);
    //         responses.push(tweet);
    //     }
    
    //     return responses;
    // }




    // async function generateImages(prompt, count = 1) {
//     try {
//         // Add randomness to the input prompt for variation
//         const inputs = Array.from({ length: count }, (_, index) => ({
//             prompt: `${prompt} - ${Math.random().toString(36).substring(2, 8)}`, // Add random string for variation
//             seed: Math.floor(Math.random() * 1000000) // Use a random seed if supported by the model
//         }));

//         // Generate images with unique parameters
//         const generationTasks = inputs.map(async (input, index) => {
//             try {
//                 // Call the model (using the stable-diffusion-xl-lightning model)
//                 const result = await run('@cf/bytedance/stable-diffusion-xl-lightning', input);

//                 if (result instanceof ArrayBuffer) {
//                     // Directly convert the ArrayBuffer to a Blob (the API returns a PNG image)
//                     const imageBlob = new Blob([result], { type: 'image/png' });

//                     // Create a unique filename using a timestamp and a random string
//                     const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
//                     const filename = `images/${uniqueSuffix}-generated-image-${index}.png`;

//                     // Upload the image to Supabase Storage and get the URL
//                     const url = await uploadToSupabaseStorage(imageBlob, filename, "images");

//                     console.log(`Image ${index + 1} generated: ${url}`);
//                     return url;
//                 } else {
//                     throw new Error("Unexpected response format");
//                 }
//             } catch (error) {
//                 console.error(`Error generating image ${index + 1}:`, error);
//                 return null;
//             }
//         });

//         const urls = await Promise.all(generationTasks);
//         const successfulUrls = urls.filter((url) => url !== null);

//         if (successfulUrls.length === 0) {
//             throw new Error("All image generation tasks failed.");
//         }

//         return successfulUrls;
//     } catch (error) {
//         console.error("Error generating images:", error);
//         throw error;
//     }
// }





// async function generateImages(prompt, count = 1, inferenceSteps = 8) {
//     try {
//         // Add randomness to the input prompt for variation
//         const inputs = Array.from({ length: count }, (_, index) => ({
//             prompt: `${prompt} - ${Math.random().toString(36).substring(2, 8)}`, // Add random string
//             seed: Math.floor(Math.random() * 1000000), // Random seed if supported by the model
//             inference_steps: inferenceSteps // New parameter for inference steps
//         }));

//         // Generate images with unique parameters
//         const generationTasks = inputs.map(async (input, index) => {
//             try {
//                 // Run the model (e.g., stable-diffusion-xl-lightning)
//                 const result = await run('@cf/bytedance/stable-diffusion-xl-lightning', input);

//                 if (result instanceof ArrayBuffer) {
//                     // Directly convert the ArrayBuffer to a Blob (the API returns a PNG image)
//                     const imageBlob = new Blob([result], { type: 'image/png' });

//                     // Add timestamp AND random string to filename
//                     const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
//                     const filename = `images/${uniqueSuffix}-generated-image-${index}.png`;

//                     // Upload the image to Supabase Storage and get the URL
//                     const url = await uploadToSupabaseStorage(imageBlob, filename, "images");

//                     console.log(`Image ${index + 1} generated: ${url}`);
//                     return url;
//                 } else {
//                     throw new Error("Unexpected response format");
//                 }
//             } catch (error) {
//                 console.error(`Error generating image ${index + 1}:`, error);
//                 return null;
//             }
//         });

//         const urls = await Promise.all(generationTasks);
//         const successfulUrls = urls.filter((url) => url !== null);

//         if (successfulUrls.length === 0) {
//             throw new Error("All image generation tasks failed.");
//         }

//         return successfulUrls;
//     } catch (error) {
//         console.error("Error generating images:", error);
//         throw error;
//     }
// }



// WORKING
// app.post("/ai/post", upload.array('images'), async (req, res) => {
//     try {
//         // Extract prompt and data from the request body
//         let { prompt, data, socials,userid } = req.body;
//
//         // Ensure a prompt is provided
//         if (!prompt ) {
//             return res.status(400).json({ error: "Prompt is required." });
//         }
//
//         if (!socials ) {
//             return res.status(400).json({ error: "social is required." });
//         }
//
//         if (!userid ) {
//             return res.status(400).json({ error: "userid is required." });
//         }
//
//         // Process the data field.
//         // If data is a string, try to parse it as JSON. Otherwise, assume it's already an array.
//         let texts = [];
//         if (data) {
//             if (typeof data === 'string') {
//                 try {
//                     texts = JSON.parse(data);
//                     // Ensure texts is an array.
//                     if (!Array.isArray(texts)) {
//                         texts = [texts];
//                     }
//                 } catch (err) {
//                     // If parsing fails, treat it as a single text entry.
//                     texts = [data];
//                 }
//             } else if (Array.isArray(data)) {
//                 texts = data;
//             }
//         }
//
//         // Log the prompt and texts array
//         console.log("Prompt:", prompt);
//         console.log("Texts:", texts);
//         console.log("socials:", socials);
//
//         // Check and log the files from the request
//         const files = req.files || [];
//         if (files.length > 0) {
//             console.log(`Received ${files.length} image(s).`);
//         } else {
//             console.log("No image files received.");
//         }
//
//         // Loop through each text entry and log or process it
//         texts.forEach((text, index) => {
//             console.log(`Text ${index + 1}:`, text);
//             // Add further processing if needed...
//         });
//
//         // Loop through each file and log or process it
//         files.forEach((file, index) => {
//             console.log(`File ${index + 1}: originalname=${file.originalname}, size=${file.size}`);
//             // You could also process the file buffer here if needed.
//         });
//
//         var userInfos = await getUserSocialsTokens(userid)
//
//
//         // console.log(userInfos);
//
//
//
//         // Ensure socials is an array
//         if (!Array.isArray(socials)) {
//             if (typeof socials === 'string') {
//                 try {
//                     socials = JSON.parse(socials);
//                 } catch (err) {
//                     console.error('Error parsing socials:', err.message);
//                     return [];
//                 }
//             } else if (socials && typeof socials === 'object' && Array.isArray(socials.socials)) {
//                 socials = socials.socials; // Handles cases where socials is nested in an object
//             } else {
//                 console.error('Error: socials is not a valid array', socials);
//                 return [];
//             }
//         }
//
//         const socialsArray = Array.isArray(socials) ? socials : [socials];
//
//         console.log(socialsArray);
//
//
//         // Sort userInfos based on the order in the socials array
//         const sortedUsers = socials
//             .filter(social => social.isSelected)
//             .map(social => userInfos.find(user => user.id === social.id))
//             .filter(Boolean);
//
//
//         if (sortedUsers.length === 0) {
//             return res.status(400).json({ error: "No matching users found in socials." });
//         }
//
//         const users = (Array.isArray(sortedUsers) ? sortedUsers : [sortedUsers]).map(info => {
//             let accessSecret = info.access_secrect;
//             try {
//                 accessSecret = JSON.parse(info.access_secrect);
//             } catch (e) {
//                 // If parsing fails, use the raw value
//             }
//             return {
//                 accessToken: info.access_token,
//                 accessSecret: info.access_secrect,
//                 twitterScreenName: info.name // Assume this exists or fetch it
//             };
//         });
//
//
//
//         console.log(`users to send yo post tweet ${JSON.stringify(sortedUsers)}  _______________________________-`);
//
//
//         const tweetUrls = await postTweets({
//             textEntries: texts,
//             imageFiles: files,
//             users: users
//         });
//
//        console.log(tweetUrls)
//         // postTweets(user);
//         // postTweetToTwitter(texts,files,user,true)
//
//         // const tweet = await writeTweet({oauth_token: JSON.stringify(users.accessToken), oauth_token_secret: JSON.stringify(users.accessSecret)},"post from ai")
//
//
//         // For each tweet URL, fetch tweet details dynamically using the appropriate credentials
//         const tweetDetailsArray = await Promise.all(
//             tweetUrls.map(async ({ tweetUrl, user }) => {
//                 const tweetId = extractTweetId(tweetUrl);
//                 if (!tweetId) {
//                     console.error('Invalid tweet URL:', tweetUrl);
//                     return null;
//                 }
//                 try {
//                     const tweetData = await getTweetById(tweetId, user);
//                     console.log(`Fetched details for tweet ${tweetId}`);
//
//                     console.log(JSON.stringify(tweetData));
//                     return { tweetId, tweetUrl, tweetData, user };
//                 } catch (error) {
//                     console.error(`Error fetching details for tweet ${tweetId}:`, error);
//                     return null;
//                 }
//             })
//         );
//
//        console.log(tweetDetailsArray)
//
//
//         var savedpost = saveTweetsToPostsDynamic(tweetDetailsArray, userid);
//
//        console.log(savedpost);
//
//         // Simulate processing the post (e.g., uploading to Twitter)
//         // For now, we simply respond with a success message and include the received details.
//         res.status(200).json({
//             response: `Post is successfully uploaded to your Twitter. Here is a link to the post, \n${tweetUrls.join("\n")} `,
//             // prompt: prompt,
//             // texts: texts,
//             // fileCount: files.length
//         });
//     } catch (error) {
//         console.error("Error in /ai/post route:", error);
//         res.status(500).json({ error: error.message });
//     }
// });


// // app.get("/schedule-tweet/:content/:timestamp", (req, res) => {
// //     const { content, timestamp } = req.params;
// //
// //     if (!content || !timestamp) {
// //         return res.status(400).json({ error: "Missing required parameters: content and timestamp" });
// //     }
// //
// //     const scheduledTime = new Date(Number(timestamp));
// //
// //     if (isNaN(scheduledTime.getTime())) {
// //         return res.status(400).json({ error: "Invalid timestamp" });
// //     }
// //
// //     PostScheduler.scheduleTweet(content, scheduledTime);
// //
// //     return res.json({
// //         success: true,
// //         message: "Tweet scheduled successfully",
// //         scheduledTime: scheduledTime.toISOString(), // Return formatted time
// //         humanReadableTime: scheduledTime.toLocaleString() // More user-friendly time format
// //     });
// // });
//
//
// // POST route to schedule a tweet
// // app.post("/schedule-tweet", (req, res) => {
// //     const {  prompt, data, timestamp, userid, socials } = req.body;
// //
// //     if ( !timestamp || !userid || !socials) {
// //         return res.status(400).send("Missing required parameters: content, timestamp, userid, and socials");
// //     }
// //
// //     const scheduledTime = new Date(Number(timestamp) * 1000); // Convert seconds to milliseconds
// //
// //     if (isNaN(scheduledTime.getTime())) {
// //         return res.status(400).send("Invalid timestamp");
// //     }
// //
// //     try {
// //         PostScheduler.scheduleTweet(content, scheduledTime, userid, socials);
// //         return res.send(`Tweet scheduled successfully at ${scheduledTime.toLocaleString()}`);
// //     } catch (error) {
// //         return res.status(500).send("Failed to schedule tweet");
// //     }
// // });
//
//
// app.post("/schedule-tweet",upload.array('images'), async (req, res) => {
//     try {
//         let {prompt, data, socials, userid, timestamp} = req.body;
//
//         if (!prompt || !timestamp || !userid || !socials) {
//             return res.status(400).send("Missing required parameters: prompt, timestamp, userid, and socials");
//         }
//
//         let texts = [];
//         if (data) {
//             if (typeof data === 'string') {
//                 try {
//                     texts = JSON.parse(data);
//                     if (!Array.isArray(texts)) {
//                         texts = [texts];
//                     }
//                 } catch (err) {
//                     texts = [data];
//                 }
//             } else if (Array.isArray(data)) {
//                 texts = data;
//             }
//         }
//
//         const files = req.files || [];
//         if (files.length > 0) {
//             console.log(`Received ${files.length} image(s).`);
//         } else {
//             console.log("No image files received.");
//         }
//
//         let scheduledTime = new Date(Number(timestamp) * 1000);
//         if (isNaN(scheduledTime.getTime())) {
//             return res.status(400).send("Invalid timestamp");
//         }
//
//         if (!Array.isArray(socials)) {
//             if (typeof socials === 'string') {
//                 try {
//                     socials = JSON.parse(socials);
//                 } catch (err) {
//                     return res.status(400).send("Invalid socials format");
//                 }
//             } else {
//                 return res.status(400).send("Socials must be an array");
//             }
//         }
//
//         var userInfos = await getUserSocialsTokens(userid)
//
//
//         console.log(userInfos);
//
//
//         // Ensure socials is an array
//         if (!Array.isArray(socials)) {
//             if (typeof socials === 'string') {
//                 try {
//                     socials = JSON.parse(socials);
//                 } catch (err) {
//                     console.error('Error parsing socials:', err.message);
//                     return [];
//                 }
//             } else if (socials && typeof socials === 'object' && Array.isArray(socials.socials)) {
//                 socials = socials.socials; // Handles cases where socials is nested in an object
//             } else {
//                 console.error('Error: socials is not a valid array', socials);
//                 return [];
//             }
//         }
//
//         const socialsArray = Array.isArray(socials) ? socials : [socials];
//
//         console.log(socialsArray);
//
//
//         // Sort userInfos based on the order in the socials array
//         const sortedUsers = socials
//             .filter(social => social.isSelected)
//             .map(social => userInfos.find(user => user.id === social.id))
//             .filter(Boolean);
//
//
//         console.log(sortedUsers ,"sorted user");
//         if (sortedUsers.length === 0) {
//             return res.status(400).json({error: "No matching users found in socials."});
//         }
//
//         const users = (Array.isArray(sortedUsers) ? sortedUsers : [sortedUsers]).map(info => {
//             let accessSecret = info.access_secrect;
//             try {
//                 accessSecret = JSON.parse(info.access_secrect);
//             } catch (e) {
//                 // If parsing fails, use the raw value
//             }
//             return {
//                 accessToken: info.access_token,
//                 accessSecret: info.access_secrect,
//                 twitterScreenName: info.name // Assume this exists or fetch it
//             };
//         });
//
//         sortedUser
//
//          PostScheduler.scheduleTweet({prompt: prompt, texts: texts, socials:socials, userid:userid, scheduledTime:scheduledTime, users: users, files:files});
//
//         // return res.json({
//         //     success: true,
//         //     message: "Tweet scheduled successfully",
//         //     scheduledTime: scheduledTime.toISOString(),
//         //     humanReadableTime: scheduledTime.toLocaleString()
//         // });
//
//         return res.send(`Tweet scheduled successfully at ${scheduledTime.toLocaleString()}`);
//     } catch (error) {
//         console.error("Error scheduling tweet:", error);
//         return res.status(500).json({success: false, message: "Failed to schedule tweet"});
//     }
// });
//


// const oauth = new OAuth(
//     "https://api.twitter.com/oauth/request_token",
//     "https://api.twitter.com/oauth/access_token",
//     "cpig4OoLnJ5e3q7UTKBTApLjL",
//     "IWcR87FzMLqoVfAllcY0cBcW2jVvlsTSze2oBpfLMjMZbI67Cf",
//     "1.0A",
//     "http://localhost:5500/auth/twitter/callback",
//     "HMAC-SHA1"
// );


// app.get('/login', (req, res) => {
//     res.send(`
//     <h1>Login</h1>
//     <form action="/auth/login" method="post">
//       <input type="email" name="email" placeholder="Email" required><br>
//       <input type="password" name="password" placeholder="Password" required><br>
//       <button type="submit">Login</button>
//     </form>
//   `);
// });


// app.get('/register', (req, res) => {
//     res.send(`
//     <h1>Register</h1>
//     <form action="/auth/signup" method="post">
//       <input type="email" name="email" placeholder="Email" required><br>
//       <input type="password" name="password" placeholder="Password" required><br>
//       <input type="text" name="full_name" placeholder="Full Name" required><br>
//       <button type="submit">Register</button>
//     </form>
//   `);
// });


// middle ware
// async function authenticateToken(req, res, next) {
//     // const token = req.headers['authorization']?.split(' ')[1];
//     const token = session.supabaseaccesstoken
//
//     if (!token) return res.status(401).send('Access Token Required');
//
//     try {
//         const { data, error } = await supabase.auth.getUser(token);
//         if (error || !data.user) return res.status(403).send('Invalid Token');
//         req.user = data.user;
//         next();
//     } catch (err) {
//         console.error('Token validation error:', err);
//         res.status(403).send('Token Validation Failed');
//     }
// }


// async function postTweets({ textEntries = [], imageFiles = [], user }) {
//     // const Twitter = require('twitter-api-v2').TwitterApi; // Adjust based on your library
//
//
//     console.log(`List of User  ${JSON.stringify(user)}`);
//     const client = new TwitterApi({
//         appKey: "lcmOYTAberZpSa39YaNgksAXA",
//         appSecret: "Irq4y76uKmudb4ayT0AYUjpoNkAYiG3HdfqYcMVCVGyQWNVKE8",
//         accessToken: user.accessToken,
//         accessSecret: user.accessSecret
//     });
//
//     const tweetUrls = [];
//     for (let i = 0; i < textEntries.length; i++) {
//         const text = textEntries[i];
//         let mediaIds = [];
//
//         // Upload images if provided and match with the current text entry
//         if (imageFiles[i]) {
//             const media = await client.v1.uploadMedia(Buffer.from(imageFiles[i].buffer), {
//                 mimeType: imageFiles[i].mimetype
//             });
//             mediaIds.push(media);
//         }
//
//         // Post tweet
//         const response = await client.v2.tweet({
//             text: text,
//             media: mediaIds.length > 0 ? { media_ids: mediaIds } : undefined
//         });
//
//
//
//         // Construct tweet URL
//         const tweetUrl = `https://twitter.com/${user[0].twitterScreenName}/status/${response.data.id}`;
//
//         tweetUrls.push(tweetUrl);
//         console.log(tweetUrls)
//     }
//
//     return tweetUrls;
// }


// async function postTweets(user) {
//     try {
//         if (!user || !Array.isArray(user) || user.length === 0) {
//             console.log("Invalid user data.");
//             return;
//         }

//         const { accessToken, accessSecret } = user[0];
//         if (!accessToken || !accessSecret) {
//             console.log("Missing access token or secret.");
//             return;
//         }

//         const client = new TwitterApi({
//             appKey: "lcmOYTAberZpSa39YaNgksAXA",
//             appSecret: "Irq4y76uKmudb4ayT0AYUjpoNkAYiG3HdfqYcMVCVGyQWNVKE8",
//             accessToken: accessToken,
//             accessSecret: accessSecret
//         });

//         const response = await client.v2.tweet("Hello, AI API! 🚀");
//         console.log("Tweet posted successfully:", response.data);
//     } catch (error) {
//         console.error("Error posting tweet:", error);
//     }
// }

// async function testAuth(user) {
//     try {
//         if (!user || !Array.isArray(user) || user.length === 0) {
//             console.log("Invalid user data.");
//             return;
//         }

//         const { accessToken, accessSecret } = user[0];
//         if (!accessToken || !accessSecret) {
//             console.log("Missing access token or secret.");
//             return;
//         }

//         const client = new TwitterApi({
//             appKey: "lcmOYTAberZpSa39YaNgksAXA",
//             appSecret: "Irq4y76uKmudb4ayT0AYUjpoNkAYiG3HdfqYcMVCVGyQWNVKE8",
//             accessToken: accessToken,
//             accessSecret: accessSecret
//         });

//         const me = await client.v2.me();
//         console.log("Authenticated user:", me.data);
//     } catch (error) {
//         console.error("Authentication error:", error);
//     }
// }


// async function postTweets({ textEntries = [], imageFiles = [], user }) {
//     try {
//         // Validate user input
//         if (!user || !Array.isArray(user) || user.length === 0) {
//             console.log("Invalid user data.");
//             return;
//         }

//         const { accessToken, accessSecret } = user[0];
//         if (!accessToken || !accessSecret) {
//             console.log("Missing access token or secret.");
//             return;
//         }

//         // Initialize Twitter client
//         const client = new TwitterApi({
//             appKey: "lcmOYTAberZpSa39YaNgksAXA",
//             appSecret: "Irq4y76uKmudb4ayT0AYUjpoNkAYiG3HdfqYcMVCVGyQWNVKE8",
//             accessToken: accessToken,
//             accessSecret: accessSecret
//         });

//         const tweetUrls = [];

//         // Rule 1: Upload images if provided and get media IDs
//         let mediaIds = [];
//         if (imageFiles.length > 0) {
//             for (const file of imageFiles) {
//                 const mimeType = file.path ? mime.lookup(file.path) : file.mimetype;
//                 if (!mimeType) {
//                     console.log("Unable to determine MIME type for file:", file);
//                     continue;
//                 }
//                 const imageData = file.path ? fs.readFileSync(file.path) : file.buffer;
//                 const mediaData = await client.v1.uploadMedia(imageData, { mimeType });
//                 mediaIds.push(mediaData);
//                 if (file.path) fs.unlinkSync(file.path); // Clean up temporary file
//             }
//         }

//         // Rule 2: Handle posting based on textEntries and imageFiles
//         let responses = [];
//         if (textEntries.length > 0) {
//             // Rule 2a: Post the first text entry with images (if any)
//             const firstTweetParams = {
//                 text: textEntries[0],
//                 ...(mediaIds.length > 0 && { media: { media_ids: mediaIds } })
//             };
//             const firstTweet = await client.v2.tweet(firstTweetParams);
//             responses.push(firstTweet);

//             // Rule 2b: Post remaining text entries as separate tweets without images
//             for (let i = 1; i < textEntries.length; i++) {
//                 const tweetParams = { text: textEntries[i] };
//                 const tweet = await client.v2.tweet(tweetParams);
//                 responses.push(tweet);
//             }
//         } else if (mediaIds.length > 0) {
//             // Rule 2c: If no text but images exist, post a tweet with empty text and images
//             const tweetParams = {
//                 text: te,
//                 media: { media_ids: mediaIds }
//             };
//             const tweet = await client.v2.tweet(tweetParams);
//             responses.push(tweet);
//         } else {
//             console.log("Nothing to post: no text entries or images provided.");
//             return;
//         }

//         console.log("Tweets posted successfully:", responses.map(res => res.data));
//     } catch (error) {
//         console.error("Error posting tweets:", error);
//     }
// }