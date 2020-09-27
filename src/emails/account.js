const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRIP_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'skytalawar@gmail.com',
    subject: 'Thanks for signup to Task API',
    text: `Welcome to the app, ${name}.`,
  });
};

const userCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'skytalawar@gmail.com',
    subject: 'Sorry to see you to go :( !',
    text: `Good Bye!, ${name} hope to see you back again soon`,
  });
};

module.exports = {
  sendWelcomeEmail,
  userCancelEmail,
};
