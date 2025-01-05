import { getEmailPreferences } from './dbService';

export async function sendEmailWithSendGrid(emailContent, userId, env) {
    console.log('Starting email send process for user:', userId);
    const prefs = await getEmailPreferences(env.DB, userId);
    console.log('Got email preferences:', { to: prefs.email_to, from: prefs.email_from });
    
    const payload = {
        personalizations: [{
            to: [{ email: prefs.email_to }],
            subject: prefs.email_subject,
        }],
        from: { email: prefs.email_from },
        content: [{ type: "text/html", value: emailContent }],
    };

    console.log('Sending email to SendGrid...');
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('SendGrid API error:', {
            status: response.status,
            body: errorBody
        });
        throw new Error(`Failed to send email: ${response.status}. Details: ${errorBody}`);
    }
    console.log('Email sent successfully!');
    return "Email sent successfully!";
} 