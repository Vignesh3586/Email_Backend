const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, message,name } = req.body;
  
  if (!email || !message || !name) {
    return res.status(400).json({ message: "Email and message are required" });
}

try {
    let info = await transporter.sendMail({
        from: `"${name}" <${process.env.EMAIL}>`,
        to: process.env.EMAIL,
        subject: `Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:${message}`,
        replyTo:email
    });

    console.log("Email sent:", info.messageId);
    res.status(200).json({ message: "Message sent successfully" });
} catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
}
};
