/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { CONFIG } from './config';
import { parseFeed } from './services/feedParser';
import { generateEmailHTML } from './templates/emailTemplate';
import { sendEmailWithSendGrid } from './services/emailService';
import { getFeedsForUser, getFeedCount, updateLastParsed } from './services/dbService';
import { generateDummyHTML } from './templates/emailTemplateDummy';

async function processUserDigest(userId, env) {
	console.log('Starting digest process for user:', userId);
	const { count } = await getFeedCount(env.DB, userId);
	console.log('Found feeds count:', count);
	
	let allFeedsData = [];
	for (let offset = 0; offset < count; offset += CONFIG.FEEDS_PER_BATCH) {
		console.log(`Processing batch at offset ${offset}`);
		const { results } = await getFeedsForUser(env.DB, userId, offset);
		const feedsData = await Promise.all(
			results.map(async row => {
				console.log('Processing feed:', row.url);
				const items = await parseFeed(row.url, row.last_parsed, env);
				if (items.length > 0) {
					console.log(`Found ${items.length} new items in feed:`, row.url);
					await updateLastParsed(env.DB, row.url);
					return {
						source: row.source,
						items
					};
				}
				console.log('No new items in feed:', row.url);
				return null;
			})
		);
		allFeedsData = allFeedsData.concat(feedsData.filter(Boolean));
	}

	if (allFeedsData.length === 0) {
		console.log('No new items found in any feeds');
		return "No new items to digest";
	}

	console.log(`Generating email with ${allFeedsData.length} feeds`);
	const emailContent = generateEmailHTML(allFeedsData);
	return await sendEmailWithSendGrid(emailContent, userId, env);
}

/**
 * Exports the default Worker logic
 */
export default {
	async fetch(request, env) {
		// Check if it's a preview request
		const url = new URL(request.url);
		const isPreview = url.searchParams.get('preview') === 'true';

		// If preview mode, return HTML directly
		if (isPreview) {
			return new Response(generateDummyHTML(), {
				headers: { 'Content-Type': 'text/html' }
			});
		}

		// For manual trigger while developing
		const response = await processUserDigest(1, env);
		return new Response(response);
	},

	// Handle scheduled cron trigger
	async scheduled(event, env, ctx) {
		ctx.waitUntil((async () => {
			console.log('Cron triggered at:', new Date().toISOString());
			try {
				const result = await processUserDigest(1, env);
				console.log('Digest processed successfully:', result);
			} catch (error) {
				console.error('Error processing digest:', error);
				throw error;
			}
		})());
	}
};
