const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const cors = require('cors'); // Importar el paquete cors

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'https://tudominio.netlify.app', // Reemplaza con la URL de tu frontend en Netlify
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type'
}));

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

app.post('/send-email', (req, res) => {
  const { nombre, email, telefono, motivo, mensaje } = req.body;

  // Leer y compilar la plantilla
  const templatePath1 = path.join(__dirname, 'mail', 'master.html');
  fs.readFile(templatePath1, 'utf8', (err, template) => {
    if (err) {
      return res.status(500).send('Error al leer la plantilla');
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
      to: `vicbolt.madrid@gmail.com`, // Enviar a María
      subject: 'Formulario de Contacto',
      html: htmlToSend
    };

    transporter.sendMail(mailOptions1, (error, info) => {
      if (error) {
        return res.status(500).send('Error al enviar el correo');
      }
      res.status(200).send('Correo enviado con éxito');
    });
  });

  const templatePath2 = path.join(__dirname, 'mail', 'user.html');
  fs.readFile(templatePath2, 'utf8', (err, template) => {
    if (err) {
      return res.status(500).send('Error al leer la plantilla');
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
      to: `${email}`, // Envio al usuario
      subject: 'Gracias por contactar conmigo.',
      html: htmlToSend
    };

    transporter.sendMail(mailOptions2, (error, info) => {
      if (error) {
        return res.status(500).send('Error al enviar el correo');
      }
      res.status(200).send('Correo enviado con éxito');
    });
  });
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
