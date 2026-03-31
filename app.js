const express = require("express");
const twilio = require("twilio");

const app = express();

// 🔥 call trigger
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
      to: `+${to}`, // 🔥 IMPORTANT FIX
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    res.send("Call triggered");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err.message);
  }
});

// 🔥 voice response
app.get("/voice", (req, res) => {
  const name = req.query.name || "User";

  const twiml = `
    <Response>
      <Say voice="alice" language="en-IN">
        Hello ${name}, thank you for using our service.
      </Say>
    </Response>
  `;

  res.type("text/xml");
  res.send(twiml);
});

// 🔥 health check (important for Railway)
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(process.env.PORT || 3000);
