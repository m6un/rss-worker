import { CONFIG } from '../config';

export async function getFeedsForUser(db, userId, offset) {
    return await db
        .prepare("SELECT url, last_parsed, blog_name as source FROM feeds WHERE user_id=? LIMIT ? OFFSET ?")
        .bind(userId, CONFIG.FEEDS_PER_BATCH, offset)
        .all();
}

export async function getFeedCount(db, userId) {
    return await db
        .prepare("SELECT COUNT(*) as count FROM feeds WHERE user_id=?")
        .bind(userId)
        .first();
}

export async function updateLastParsed(db, url) {
    return await db
        .prepare("UPDATE feeds SET last_parsed = datetime('now') WHERE url = ?")
        .bind(url)
        .run();
}

export async function getEmailPreferences(db, userId) {
    return await db
        .prepare("SELECT email_to, email_from, email_subject FROM user_preferences WHERE user_id = ?")
        .bind(userId)
        .first();
} 