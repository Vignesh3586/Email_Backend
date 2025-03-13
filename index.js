const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Must match the environment variable name
      pass: process.env.EMAIL_PASS, // Ensure this is an app password (not normal password)
    },
  });

app.post("/", async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }
    
      const { email,message,name } = req.body;
      
      if (!email || !message || !name) {
        return res.status(400).json({ message: "Email and message are required" });
    }
    
    try {
        let info = await transporter.sendMail({
            from: `"${name}" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
