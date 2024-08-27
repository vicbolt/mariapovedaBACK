const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "vicbolt.madrid@gmail.com",
    pass: "uspp ckel zrpb xoxm",
  }
});

app.post('/send-email', async (req, res) => {
  const { nombre, email, telefono, motivo, mensaje } = req.body;

  try {
    // Leer y compilar la plantilla para María
    const templatePath1 = path.join(__dirname, 'mail', 'master.html');
    const template1 = fs.readFileSync(templatePath1, 'utf8');
    const compiledTemplate1 = handlebars.compile(template1);
    const htmlToSend1 = compiledTemplate1({
      nombre,
      email,
      telefono,
      motivo,
      mensaje
    });

    // Configuración del correo para María
    const mailOptions1 = {
      from: 'vicbolt.madrid@gmail.com',
      to: 'vicbolt.madrid@gmail.com',
      subject: 'Formulario de Contacto',
      html: htmlToSend1
    };

    // Enviar correo a María
    await transporter.sendMail(mailOptions1);

    // Leer y compilar la plantilla para el usuario
    const templatePath2 = path.join(__dirname, 'mail', 'user.html');
    const template2 = fs.readFileSync(templatePath2, 'utf8');
    const compiledTemplate2 = handlebars.compile(template2);
    const htmlToSend2 = compiledTemplate2({
      nombre,
      email,
      telefono,
      motivo,
      mensaje
    });

    // Configuración del correo para el usuario
    const mailOptions2 = {
      from: 'vicbolt.madrid@gmail.com',
      to: email,
      subject: 'Gracias por contactar conmigo.',
      html: htmlToSend2
    };

    // Enviar correo al usuario
    await transporter.sendMail(mailOptions2);

    res.status(200).send('Correos enviados con éxito');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).send('Error al enviar los correos');
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
