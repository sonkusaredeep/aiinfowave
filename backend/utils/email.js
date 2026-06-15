/**
 * email.js (legacy wrapper)
 * ─────────────────────────────────────────────────────────────
 * Kept for backward compatibility.
 * All new email logic lives in services/emailService.js (Resend).
 * This module is no longer used internally, but kept in case
 * any external code references it.
 * ─────────────────────────────────────────────────────────────
 */

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generic send function — compatible with the old nodemailer signature.
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async (options) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'AI InfoWave <hrmanager@aiinfowave.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('❌ Resend error (legacy wrapper):', error);
    } else {
      console.log(`✅ Email sent to ${options.to} | id: ${data.id}`);
    }
  } catch (err) {
    console.error('❌ sendEmail (legacy wrapper) error:', err.message);
  }
};

module.exports = sendEmail;
