const express = require("express");
const twilio = require("twilio");

const app = express();

app.get("/call", async (req, res) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const to = req.query.to;

  await client.calls.create({
    url: "http://demo.twilio.com/docs/voice.xml",
    to: to,
    from: process.env.TWILIO_PHONE_NUMBER,
  });

  res.send("Call triggered");
});

app.listen(process.env.PORT || 3000);
