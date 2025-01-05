export function generateDummyHTML() {
    return `
        <html>
            <head>
                <title>Weekly Digest</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,100..1000:wght@500&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
           <style>
                    * { 
                        font-family: 'Inter', sans-serif;
                        font-weight: 400;
                    }
                    .digest-title {
                        font-family: 'DM Sans', sans-serif;
                        font-size: 1.5em;
                        font-weight: 500;
                    }
                    h4 {
                        font-weight: 500;
                    }
                    h5 {
                        font-weight: 600;
                    }
                    p {
                        font-size: 13px;
                    }
                </style>
            </head>
            <body style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 class="digest-title" style="text-align: center; color: #2c3e50;">
                    Weekly Digest - January 4, 2025
                </h1>
                <div style="margin-bottom: 20px;">
                    <h5 style="color: #2c3e50; border-bottom: 2px solid #ff4d4d; padding-bottom: 5px; margin: 5px 0 10px 0;">
                        Sam Altman's Blog
                    </h5>
                    <div style=" padding: 12px; border-bottom: 1px solid #eee;">
                        <h4 style="margin: 0 0 2px 0">
                            What I Wish Someone Had Told Me
                            <a href="#" style="color: #2c3e50; text-decoration: none;">&#128279;</a>
                        </h4>
                        <p style="color: #7f8c8d; margin: 2px 0;">1/4/2025</p>
                        <p style="color: #34495e; line-height: 1.4; margin: 10px 0 0 0;">Entrepreneurs should focus on optimism, hard work, and the right team, while avoiding bureaucracy, good process vs. bad results, and inaction, to achieve success.</p>
                    </div>
                    <div style=" padding: 12px; border-bottom: 1px solid #eee;">
                        <h4 style="margin: 0">
                            Productivity
                            <a href="#" style="color: #2c3e50; text-decoration: none;">&#128279;</a>
                        </h4>
                        <p style="color: #7f8c8d; margin: 2px 0;">1/4/2025</p>
                        <p style="color: #34495e; line-height: 1.4; margin: 10px 0 0 0;">Here is a summary of the text:</p>
                    </div>
                    <div style="padding: 12px; border-bottom: 1px solid #eee;">
                        <h4 style="margin: 0">
                            How To Be Successful
                            <a href="#" style="color: #2c3e50; text-decoration: none;">&#128279;</a>
                        </h4>
                        <p style="color: #7f8c8d; margin: 2px 0;">1/4/2025</p>
                        <p style="color: #34495e; line-height: 1.4; margin: 10px 0 0 0;">Make things compound and increase exponentially to achieve outlier success.</p>
                    </div>
                    <div style=" padding: 12px; border-bottom: 1px solid #eee;">
                        <h4 style="margin: 0">
                            Join the YC Software Team
                            <a href="#" style="color: #2c3e50; text-decoration: none;">&#128279;</a>
                        </h4>
                        <p style="color: #7f8c8d; margin: 2px 0;">1/4/2025</p>
                        <p style="color: #34495e; line-height: 1.4; margin: 10px 0 0 0;">Joining YC's software team offers a chance to learn YC's inner workings, meet top entrepreneurs, and gain startup experience to increase chances of getting funded in the future.</p>
                    </div>
                    <div style=" padding: 12px; border-bottom: 1px solid #eee;">
                        <h4 style="margin: 0">
                            Project Covalence
                            <a href="#" style="color: #2c3e50; text-decoration: none;">&#128279;</a>
                        </h4>
                        <p style="color: #7f8c8d; margin: 2px 0;">1/3/2025</p>
                        <p style="color: #34495e; line-height: 1.4; margin: 10px 0 0 0;">Companies working on COVID-19 vaccines, drugs, and diagnostics need support with clinical trials, as rapidly launching them is a major bottleneck.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
} 