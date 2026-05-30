# Brevo email setup

This site already sends contact requests through `POST /api/estimate` in `server.js`.  
To make it work with Brevo locally:

1. Create a Brevo account and add a sender in **Settings → Senders**.
2. Verify the sender email, and authenticate your domain if you have one.
3. Generate an **SMTP key** in Brevo’s SMTP/API settings.
4. Copy `.env.example` to `.env` and fill in your Brevo values:
   - `SMTP_HOST=smtp-relay.brevo.com`
   - `SMTP_PORT=587`
   - `SMTP_SECURE=false`
   - `SMTP_USER=your-brevo-login`
   - `SMTP_PASS=your-brevo-smtp-key`
   - `SMTP_FROM=brightviewwindows253@gmail.com`
   - `ESTIMATE_TO=brightviewwindows253@gmail.com`
5. Install dependencies with `npm install`.
6. Start the server with `npm start`.

Notes:
- `SMTP_PASS` must be the Brevo SMTP key, not your normal account password.
- Use one inbox for `ESTIMATE_TO` if you want one notification per request.
- If you host on a static-only platform, this Node server must run somewhere for email sending to work.

## Netlify deployment

If you deploy this site to Netlify, the form uses `netlify/functions/estimate.js` instead of `server.js`.

Add these same environment variables in Netlify:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `ESTIMATE_TO`

Netlify routes `/api/estimate` to the function through `netlify.toml`, so the form can stay the same.
