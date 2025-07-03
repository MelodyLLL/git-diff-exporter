const nodemailer = require('nodemailer');

async function sendEmail(filePath, config) {
  const transporter = nodemailer.createTransport({
    service: 'your_smtp_provider', // 如 'qq', '163'，或自定义 host/port
    auth: {
      user: 'your_email@example.com',
      pass: 'your_password_or_token',
    },
  });

  await transporter.sendMail({
    from: 'your_email@example.com',
    to: config.email,
    subject: `Git 差异报告 - ${config.projectName}`,
    text: '请查收附件中的 git 提交差异报告。',
    attachments: [{ path: filePath }],
  });
}

module.exports = { sendEmail };