import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';

import User from './models/User.js';
import { myAge } from './utils/dateUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ---------- MONGODB ----------
await mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => {
    console.error('Erro MongoDB:', err.message);
    process.exit(1);
  });

// ---------- Função utilitária para garantir string ----------
function asString(value) {
  return Array.isArray(value) ? value[0] : value;
}

// ---------- FUNÇÃO PARA PARSE FORM ----------
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: 25 * 1024 * 1024, // 25MB
      keepExtensions: true,
      filter: ({ mimetype }) => mimetype && mimetype.includes('image')
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

// ---------- FUNÇÃO UPLOAD CLOUDINARY ----------
async function uploadToCloudinary(filePath, filename) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'usuarios',
      public_id: filename,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    fs.unlinkSync(filePath); // remove temporário
    return result;
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw err;
  }
}

// ---------- ROTA POST ----------
app.post('/api', async (req, res) => {
  const userId = uuidv4();

  try {
    const { fields, files } = await parseForm(req);

    // verifica se arquivo existe
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!imageFile || !imageFile.filepath) {
      return res.status(400).json({ success: false, message: 'Arquivo de imagem não enviado.' });
    }

    // gera nome único
    const fileExtension = imageFile.originalFilename.split('.').pop();
    const uniqueFilename = `user_${userId}.${fileExtension}`;

    // envia para Cloudinary
    const cloudinaryResult = await uploadToCloudinary(imageFile.filepath, uniqueFilename);

    // salva no Mongo
    const newUser = new User({
      id: userId,
      fullName: asString(fields.fullName),
      birthDate: asString(fields.birthDate), // converte para Date
      phone: asString(fields.phone),
      selectedVolunteerArea: asString(fields.selectedVolunteerArea),
      baptismDate: asString(fields.baptismDate), // opcional converter para Date
      selectedMemberDate: asString(fields.selectedMemberDate),
      fileNameUrl: cloudinaryResult.secure_url,
      cloudinaryId: cloudinaryResult.public_id
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso!',
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        fileNameUrl: newUser.fileNameUrl
      }
    });

  } catch (err) {
    console.error('Erro no POST /api:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/', async (req, res) => {
  try {
    const users = await User.find();

    const filtered = users.map(user => ({
      id: user.id,
      fullName: user.fullName,
      birthDate: myAge(user.birthDate),
      phone: user.phone,
      selectedVolunteerArea: user.selectedVolunteerArea,
      baptismDate: user.baptismDate,
      selectedMemberDate: user.selectedMemberDate,
      fileNameUrl: user.fileNameUrl
    }));

    res.status(200).json(filtered);

  } catch (err) {
    console.error('Erro no GET /api:', err);
    res.status(500).json({ success: false, message: 'Erro ao processar requisição', error: err.message });
  }
});

app.get('/api/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });

    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });

    const result = {
      id: user.id,
      fullName: user.fullName,
      birthDate: myAge(user.birthDate),
      phone: user.phone,
      selectedVolunteerArea: user.selectedVolunteerArea,
      baptismDate: user.baptismDate,
      selectedMemberDate: user.selectedMemberDate,
      fileNameUrl: user.fileNameUrl
    };

    res.status(200).json(result);

  } catch (err) {
    console.error('Erro no GET /api/:id:', err);
    res.status(500).json({ success: false, message: 'Erro ao processar requisição', error: err.message });
  }
});

// ---------- Inicia servidor ----------
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

export default app;
