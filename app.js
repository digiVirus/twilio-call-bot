const express = require("express");
const twilio = require("twilio");

const app = express();

app.get("/call", async (req, res) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const to = req.query.to;
  const name = req.query.name || "User";

  const twimlUrl = `https://twilio-call-bot-production.up.railway.app/voice?name=${encodeURIComponent(name)}`;

  await client.calls.create({
    url: twimlUrl,
    to: to,
    from: process.env.TWILIO_PHONE_NUMBER,
  });

  res.send("Call triggered");
});

// 🔥 Voice response (ladki voice)
app.get("/voice", (req, res) => {
  const name = req.query.name || "User";

  const response = `
    <Response>
      <Say voice="alice" language="en-IN">
        Hello ${name}, thank you for using our service.
      </Say>
    </Response>
  `;

  res.type("text/xml");
  res.send(response);
});

app.listen(process.env.PORT || 3000);
