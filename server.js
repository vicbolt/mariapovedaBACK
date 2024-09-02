require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const cors = require('cors'); 

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'https://mariapovedapsicologa.netlify.app', // URL de tu frontend en Netlify
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

app.post('/send-email', (req, res) => {
  const { nombre, email, telefono, motivo, mensaje } = req.body;

  // Leer y compilar la plantilla
  const templatePath1 = path.join(__dirname, 'mail', 'master.html');
  fs.readFile(templatePath1, 'utf8', (err, template) => {
    if (err) {
      console.error('Error al leer la plantilla master.html:', err);
      return res.status(500).json('Error al leer la plantilla master.html');
    }

    const compiledTemplate = handlebars.compile(template);
    const htmlToSend = compiledTemplate({
      nombre,
      email,
      telefono,
      motivo,
      mensaje
    });

    // Configuración del correo
    const mailOptions1 = {
      from: 'vicbolt.madrid@gmail.com',
      to: 'vicbolt.madrid@gmail.com', // Enviar a María
      subject: 'Formulario de Contacto',
      html: htmlToSend
    };

    transporter.sendMail(mailOptions1, (error, info) => {
      if (error) {
        console.error('Error al enviar correo a María:', error);
        return res.status(500).json('Error al enviar el correo a María');
      }
      console.log('Correo enviado a María con éxito:', info.response);
      
      // Enviar correo al usuario
      const templatePath2 = path.join(__dirname, 'mail', 'user.html');
      fs.readFile(templatePath2, 'utf8', (err, template) => {
        if (err) {
          console.error('Error al leer la plantilla user.html:', err);
          return res.status(500).json('Error al leer la plantilla user.html');
        }

        const compiledTemplate = handlebars.compile(template);
        const htmlToSend = compiledTemplate({
          nombre,
          email,
          telefono,
          motivo,
          mensaje
        });

        // Configuración del correo
        const mailOptions2 = {
          from: 'vicbolt.madrid@gmail.com',
          to: email, // Enviar al usuario
          subject: 'Gracias por contactar conmigo.',
          html: htmlToSend
        };

        transporter.sendMail(mailOptions2, (error, info) => {
          if (error) {
            console.error('Error al enviar correo al usuario:', error);
            return res.status(500).json('Error al enviar el correo al usuario');
          }
          console.log('Correo enviado al usuario con éxito:', info.response);
          res.status(200).json('Correo enviado con éxito');
        });
      });
    });
  });
});

// Usar el puerto asignado por Heroku o el puerto 3000 si no está definido
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
