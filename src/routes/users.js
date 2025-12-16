const router = require('express').Router();
const User = require('../models/User');
const parseForm = require('../utils/parseForm');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const asString = require('../utils/asString');

// get all
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// get by id
router.get('/:id', async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  if (!user) return res.status(404).json({ error: 'Não encontrado' });
  res.json(user);
});

router.post('/', async (req, res) => {
  try {
    const { fields, files } = await parseForm(req);

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!imageFile || !imageFile.filepath)
      return res.status(400).json({ success: false, message: 'Arquivo de imagem não enviado.' });

    const fileExtension = imageFile.originalFilename.split('.').pop();
    const uniqueFilename = `user_${crypto.randomUUID()}_${fields.fullName}.${fileExtension}`;
    const cloudinaryResult = await uploadToCloudinary(imageFile.filepath, uniqueFilename);

    const newUser = new User({ 
      fullName: asString(fields.fullName),
      birthDate: asString(fields.birthDate),
      phoneUser: asString(fields.phoneUser),
      selectedVolunteerArea: asString(fields.selectedVolunteerArea),
      baptismDate: asString(fields.baptismDate),
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
    console.error('Erro ao criar usuário:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});
/*
router.put('/:id', async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Removido com sucesso' });
});
*/
module.exports = router;