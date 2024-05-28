const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'rios.lisandro369@gmail.com',
      pass: 'Locur4_M4ntecol.'
    }
  });

  const mailOptions = {
    from: 'rios.lisandro369@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.send('Correo enviado: ' + info.response);
  });
});

app.listen(3000, () => {
  console.log('Servidor en funcionamiento en el puerto 4200');
});
