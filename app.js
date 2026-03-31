const express = require("express");
const twilio = require("twilio");

const app = express();

app.get("/call", async (req, res) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const to = req.query.to;
    const name = req.query.name || "User";

    const twimlUrl = `https://twilio-call-bot-production.up.railway.app/voice?name=${encodeURIComponent(name)}`;

    await client.calls.create({
      url: twimlUrl,
      to: `+${to}`, // 🔥 FIX
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    res.send("Call triggered");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// 🔥 Hindi female voice
app.get("/voice", (req, res) => {
  const name = req.query.name || "User";

  const response = `
    <Response>
      <Say voice="alice" language="hi-IN">
        Namaste ${name}, aapka swagat hai.
      </Say>
    </Response>
  `;

  res.type("text/xml");
  res.send(response);
});

// health check
app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(process.env.PORT || 3000);
