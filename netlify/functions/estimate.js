const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

function missingConfig() {
    return ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'ESTIMATE_TO'].filter(key => !process.env[key]);
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ok: false, message: 'Method not allowed.' })
        };
    }

    let payload = {};

    try {
        payload = JSON.parse(event.body || '{}');
    } catch {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ok: false, message: 'Invalid request body.' })
        };
    }

    const { name, email, phone, address, details } = payload;

    if (!name || !email || !phone || !address) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ok: false, message: 'Missing required fields.' })
        };
    }

    const configIssues = missingConfig();
    if (configIssues.length > 0) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ok: false,
                message: `Missing email config: ${configIssues.join(', ')}`
            })
        };
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: process.env.ESTIMATE_TO || 'brightviewwindows253@gmail.com',
            replyTo: email,
            subject: `New Estimate Request - ${name}`,
            text:
`Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

About Property:
${details || 'No extra details provided.'}`
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ok: true })
        };
    } catch (error) {
        console.error('Netlify estimate send failed:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ok: false,
                message: error?.message || 'Email failed to send.'
            })
        };
    }
};
