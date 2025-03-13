const express = require("express");
const nodemailer = require("nodemailer");
const cors=require('cors')
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON
app.use(express.json()); 
app.use(cors())

// Create a transporter using SMTP (Gmail example)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Route to send email
app.post("/", async (req, res) => {
    const { email, message,name} = req.body;

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
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
