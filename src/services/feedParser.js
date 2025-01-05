import { DOMParser } from 'xmldom';
import { CONFIG } from '../config';

function parseDate(dateStr) {
    if (!dateStr) return null;
    try {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
    } catch {
        return null;
    }
}

export async function parseFeed(url, lastParsed, env) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(url, { 
            signal: controller.signal,
            headers: {
                'User-Agent': 'RSS Digest Bot/1.0'  // Some feeds require User-Agent
            }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch feed: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");

        // Check for RSS
        if (xmlDoc.getElementsByTagName("rss").length) {
            var items = Array.from(xmlDoc.getElementsByTagName("item")).map(item => {
                const pubDateStr = item.getElementsByTagName("pubDate")[0]?.textContent || 
                                 item.getElementsByTagName("dc:date")[0]?.textContent;
                return {
                    title: item.getElementsByTagName("title")[0]?.textContent || "No Title",
                    link: item.getElementsByTagName("link")[0]?.textContent,
                    pubDate: parseDate(pubDateStr),
                    guid: item.getElementsByTagName("guid")[0]?.textContent,
                    content: item.getElementsByTagName("description")[0]?.textContent || ""
                };
            });
        }
        // Check for Atom
        else if (xmlDoc.getElementsByTagName("feed").length) {
            var items = Array.from(xmlDoc.getElementsByTagName("entry")).map(entry => {
                const pubDateStr = entry.getElementsByTagName("published")[0]?.textContent || 
                                 entry.getElementsByTagName("updated")[0]?.textContent;
                return {
                    title: entry.getElementsByTagName("title")[0]?.textContent || "No Title",
                    link: entry.getElementsByTagName("link")[0]?.getAttribute("href"),
                    pubDate: parseDate(pubDateStr),
                    id: entry.getElementsByTagName("id")[0]?.textContent,
                    content: entry.getElementsByTagName("content")[0]?.textContent || ""
                };
            });
        } else {
            throw new Error("Unsupported feed format");
        }

        // Filter out items older than last_parsed and items with invalid dates
        if (lastParsed) {
            const lastParsedDate = new Date(lastParsed);
            items = items.filter(item => {
                return item.pubDate && item.pubDate > lastParsedDate;
            });
        }

        // Filter out items with no content
        items = items.filter(item => item.content && item.content.trim() !== "");

        // Limit to most recent items per feed
        items = items
            .sort((a, b) => (b.pubDate || new Date(0)) - (a.pubDate || new Date(0)))
            .slice(0, CONFIG.POSTS_PER_FEED);

        // Summarize each item's content
        items = await Promise.all(
            items.map(async item => {
                try {
                    item.summary = await getSummaryViaAi(item.content, env);
                } catch (error) {
                    console.error('Failed to get summary:', error);
                    item.summary = item.content.slice(0, 150) + '...'; // Fallback to content snippet
                }
                return item;
            })
        );

        return items;
    } catch (error) {
        console.error('Feed parsing error:', error);
        return []; // Return empty array instead of crashing
    }
}

async function getSummaryWithRetry(content, env, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
                messages: [
                    { role: 'system', content: 'Summarize the text in 30 words or fewer. Only provide the summary. No disclaimers, no references to the user or text, and no mention of word count. Output only the summary.' },
                    { role: 'user', content }
                ]
            });
            return response.response;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        }
    }
}

export async function getSummaryViaAi(content, env) {
    try {
        return await getSummaryWithRetry(content, env);
    } catch (error) {
        console.error('Failed to get AI summary:', error);
        return content.slice(0, 150) + '...';
    }
} 