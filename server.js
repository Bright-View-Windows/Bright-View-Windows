const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

app.post('/api/estimate', async (req, res) => {
    const { name, email, phone, address, details } = req.body || {};

    if (!name || !email || !phone || !address) {
        return res.status(400).json({ ok: false, message: 'Missing required fields.' });
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

        return res.json({ ok: true });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Email failed to send.' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Website running at http://localhost:${port}`);
});
