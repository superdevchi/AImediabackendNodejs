// class PostScheduler {
//     /**
//      * Converts a time amount and unit into milliseconds.
//      * @param {number} amount - The numeric amount.
//      * @param {string} unit - The time unit (minutes, hours, days).
//      * @returns {number} The amount in milliseconds.
//      */
//     static convertToMilliseconds(amount, unit) {
//         if (isNaN(amount)) return 0;
//         unit = unit.toLowerCase();
//         if (unit.startsWith('minute') || unit === 'min' || unit === 'mins') {
//             return amount * 60 * 1000;
//         } else if (unit.startsWith('hour') || unit === 'hr' || unit === 'hrs') {
//             return amount * 60 * 60 * 1000;
//         } else if (unit.startsWith('day')) {
//             return amount * 24 * 60 * 60 * 1000;
//         }
//         return 0;
//     }
//
//     /**
//      * Scheduling rules with regex patterns and corresponding handlers.
//      */
//     static schedulingRules = [
//         {
//             // Relative time: "post this in X minutes/hours/days"
//             regex: /post this in (\d+)\s*(minute|minutes|min|mins|hour|hours|hr|hrs|day|days)/i,
//             handler: (match) => {
//                 const amount = parseInt(match[1], 10);
//                 if (isNaN(amount) || amount < 0) {
//                     throw new Error("Invalid time amount");
//                 }
//                 const unit = match[2];
//                 const milliseconds = PostScheduler.convertToMilliseconds(amount, unit);
//                 const scheduledTime = new Date(Date.now() + milliseconds);
//                 return {
//                     time: scheduledTime,
//                     type: 'relative',
//                     timeDescription: `in ${amount} ${unit}`
//                 };
//             }
//         },
//         {
//             // Specific time: "post this at HH:MM AM/PM"
//             regex: /post this at (\d{1,2}):(\d{2})\s*(am|pm)?/i,
//             handler: (match) => {
//                 let hours = parseInt(match[1], 10);
//                 const minutes = parseInt(match[2], 10);
//                 const period = match[3] ? match[3].toLowerCase() : null;
//                 if (period === 'pm' && hours < 12) {
//                     hours += 12;
//                 } else if (period === 'am' && hours === 12) {
//                     hours = 0;
//                 }
//                 const scheduledTime = new Date();
//                 scheduledTime.setHours(hours, minutes, 0, 0);
//                 // If the specified time is already past today, schedule for tomorrow.
//                 if (scheduledTime < new Date()) {
//                     scheduledTime.setDate(scheduledTime.getDate() + 1);
//                 }
//                 return {
//                     time: scheduledTime,
//                     type: 'specific-time',
//                     timeDescription: `at ${match[1]}:${match[2]} ${period || ''}`
//                 };
//             }
//         },
//         {
//             // Specific date and time: "post this on MM/DD/YYYY at HH:MM AM/PM"
//             regex: /post this on (\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\s*at\s*(\d{1,2}):(\d{2})\s*(am|pm)?/i,
//             handler: (match) => {
//                 const month = parseInt(match[1], 10) - 1;
//                 const day = parseInt(match[2], 10);
//                 let year = match[3] ? parseInt(match[3], 10) : new Date().getFullYear();
//                 if (year < 100) year += 2000;
//                 let hours = parseInt(match[4], 10);
//                 const minutes = parseInt(match[5], 10);
//                 const period = match[6] ? match[6].toLowerCase() : null;
//                 if (period === 'pm' && hours < 12) {
//                     hours += 12;
//                 } else if (period === 'am' && hours === 12) {
//                     hours = 0;
//                 }
//                 const scheduledTime = new Date(year, month, day, hours, minutes, 0, 0);
//                 return {
//                     time: scheduledTime,
//                     type: 'specific-date',
//                     timeDescription: `on ${match[1]}/${match[2]}/${year} at ${match[4]}:${match[5]} ${period || ''}`
//                 };
//             }
//         },
//         {
//             // Natural language: "post this tomorrow at HH:MM AM/PM" or "post this next Monday"
//             regex: /post this (tomorrow|next (monday|tuesday|wednesday|thursday|friday|saturday|sunday))(?:\s*at\s*(\d{1,2}):(\d{2})\s*(am|pm)?)?/i,
//             handler: (match) => {
//                 const dateText = match[1].toLowerCase();
//                 const scheduledTime = new Date();
//
//                 if (dateText === 'tomorrow') {
//                     scheduledTime.setDate(scheduledTime.getDate() + 1);
//                 } else if (dateText.startsWith('next ')) {
//                     const targetDay = match[2].toLowerCase();
//                     const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//                     const targetIndex = daysOfWeek.indexOf(targetDay);
//                     const currentDay = scheduledTime.getDay();
//                     let daysToAdd = targetIndex - currentDay;
//                     if (daysToAdd <= 0) daysToAdd += 7;
//                     scheduledTime.setDate(scheduledTime.getDate() + daysToAdd);
//                 }
//
//                 // Set time if specified; default to 9:00 AM if not.
//                 if (match[3]) {
//                     let hours = parseInt(match[3], 10);
//                     const minutes = parseInt(match[4], 10);
//                     const period = match[5] ? match[5].toLowerCase() : null;
//                     if (period === 'pm' && hours < 12) {
//                         hours += 12;
//                     } else if (period === 'am' && hours === 12) {
//                         hours = 0;
//                     }
//                     scheduledTime.setHours(hours, minutes, 0, 0);
//                 } else {
//                     scheduledTime.setHours(9, 0, 0, 0);
//                 }
//
//                 return {
//                     time: scheduledTime,
//                     type: 'natural-date',
//                     timeDescription: match[3]
//                         ? `${dateText} at ${match[3]}:${match[4]} ${match[5] || ''}`
//                         : `${dateText} at 9:00 AM`
//                 };
//             }
//         }
//     ];
//
//     /**
//      * Analyzes user input for scheduling commands and schedules posts accordingly.
//      * @param {string} userText - The complete text input from the user.
//      * @param {Function} scheduleCallback - Function to call when scheduling a post.
//      * @returns {Object} Result containing scheduling info and post content.
//      */
//     static analyzeAndSchedulePost(userText, scheduleCallback) {
//         for (const rule of PostScheduler.schedulingRules) {
//             const match = userText.match(rule.regex);
//             if (match) {
//                 let result;
//                 try {
//                     result = rule.handler(match);
//                 } catch (e) {
//                     console.error("Error processing scheduling rule:", e);
//                     continue; // Skip to next rule if there's an error
//                 }
//
//                 // Remove the detected scheduling command from the input text
//                 const postContent = userText.replace(match[0], '').trim();
//
//                 // Invoke the callback with the post content and scheduled time
//                 if (scheduleCallback && typeof scheduleCallback === 'function') {
//                     scheduleCallback(postContent, result.time);
//                 }
//
//                 return {
//                     scheduled: true,
//                     scheduledTime: result.time,
//                     scheduledTimeMs: result.time.getTime(),
//                     timeDescription: result.timeDescription,
//                     scheduledTimeFormatted: result.time.toLocaleString(),
//                     postContent,
//                     command: match[0]
//                 };
//             }
//         }
//         // No scheduling command found; return original text.
//         return {
//             scheduled: false,
//             postContent: userText
//         };
//     }
//
//
//
// }
//
// export default PostScheduler;


import cron from 'node-cron';
// import postTweets  from './Tweet.js'; // Ensure you have a function to post the tweet

import postTweets from './Tweet.js'

class PostScheduler {
    /**
     * Schedules a tweet at the given time using cron.
     * @param prompt
     * @param texts
     * @param socials
     * @param userid
     * @param scheduledTime
     * @param users
     * @param files
     */
    static scheduleTweet({prompt, texts, socials, userid, scheduledTime,users,files}) {
        const now = new Date();
        if (scheduledTime <= now) {
            console.error('Error: Scheduled time must be in the future.');
            return;
        }

        const cronTime = `${scheduledTime.getSeconds()} ${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${scheduledTime.getMonth() + 1} *`;

        const job = cron.schedule(cronTime, async () => {
            const tweetUrls = await postTweets({
                textEntries: texts,
                imageFiles: files,
                users: users,
                userid: userid,
            });
            console.log(`✅ Tweet posted at ${new Date().toLocaleString()}`);
            job.stop(); // Stop after executing once
        });

        console.log(`📅 Tweet scheduled: "" at ${scheduledTime.toLocaleString()}`);
    }
}

export default PostScheduler;
