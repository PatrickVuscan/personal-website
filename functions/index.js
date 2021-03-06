const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const gmailLogin = functions.config().gmail.login;
const gmailPassword = functions.config().gmail.pass;

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailLogin,
    pass: gmailPassword,
  },
});

exports.sendEmail = functions.database
  .ref('contacts/{contactId}')
  .onCreate((snap, context) => {
    const formattedMessage =
      `<strong>From:</strong> ${snap.val().email}\n` +
      `<strong>Phone Number:</strong> ${snap.val().phoneNumber || 'Not provided'}\n` +
      `<strong>Message:</strong>\n${snap.val().message}`;

    const mailOptions = {
      from: gmailLogin,
      to: gmailLogin,
      subject: 'Contact Form Submission from Personal Website', // Subject line
      text: `${snap.val().message}`, // plain text body
      html: `<p style="white-space: pre-wrap">${formattedMessage}</p>`, // html body
    };

    const getDeliveryStatus = (error, data) => {
      if (error) {
        return console.log(error);
      }
      return console.log('Message sent: %s', data.messageId);
    };

    return transporter.sendMail(mailOptions, getDeliveryStatus);
  });

exports.bugReport = functions.database
  .ref('bugs/{bugId}')
  .onCreate((snap) => {
    const formattedMessage =
      '<strong>A bug report from patrickvuscan.com has been sent!</strong>' +
      `<strong>From:</strong> ${snap.val().email || 'Not provided'}\n` +
      `<strong>Phone Number:</strong> ${snap.val().phoneNumber || 'Not provided'}\n` +
      `<strong>Page</strong> ${snap.val().page}\n` +
      `<strong>Message:</strong>\n${snap.val().message}`;

    const mailOptions = {
      from: gmailLogin,
      to: gmailLogin,
      subject: 'Bug Form Submission from Personal Website', // Subject line
      text: `${snap.val().message}`, // plain text body
      html: `<p style="white-space: pre-wrap">${formattedMessage}</p>`, // html body
    };

    const getDeliveryStatus = (error, data) => {
      if (error) {
        return console.log(error);
      }
      return console.log('Message sent: %s', data.messageId);
    };

    return transporter.sendMail(mailOptions, getDeliveryStatus);
  });
