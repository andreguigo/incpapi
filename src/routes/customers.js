const router = require('express').Router();
const Customer = require('../models/Customer');
const parseForm = require('../utils/parseForm');
const { uploadToCloudinary, authJwt, exportCustomers } = require('../middleware');
const asString = require('../utils/asString');

// exports all
router.get('/export', [authJwt.verifyToken], async (req, res) => {
  const customers = await Customer.find().lean();
  exportCustomers.exportCustomersExcel(req, res, customers);
});

// get all
router.get('/', [authJwt.verifyToken], async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

// get by id
router.get('/:id', [authJwt.verifyToken], async (req, res) => {
  const customer = await Customer.findOne({ id: req.params.id });
  if (!customer) return res.status(404).json({ error: 'Não encontrado' });
  res.json(customer);
});

// create customer
router.post('/', async (req, res) => {
  try {
    const { fields, files } = await parseForm(req);

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!imageFile || !imageFile.filepath)
      return res.status(400).json({ success: false, message: 'Arquivo de imagem não enviado' });

    const fileExtension = imageFile.originalFilename.split('.').pop();
    const uniqueFilename = `user_${crypto.randomUUID()}_${fields.fullName}.${fileExtension}`;
    const cloudinaryResult = await uploadToCloudinary(imageFile.filepath, uniqueFilename);

    const newCustomer = new Customer({ 
      fullName: asString(fields.fullName),
      birthDate: asString(fields.birthDate),
      phoneCustomer: asString(fields.phoneCustomer),
      selectedVolunteerArea: asString(fields.selectedVolunteerArea),
      baptismDate: asString(fields.baptismDate),
      selectedMemberDate: asString(fields.selectedMemberDate),
      fileNameUrl: cloudinaryResult.secure_url,
      cloudinaryId: cloudinaryResult.public_id
    });

    await newCustomer.save();
    res.status(201).json({
      success: true,
      message: 'Cliente registrado com sucesso',
      data: {
        id: newCustomer.id,
        fullName: newCustomer.fullName, 
        fileNameUrl: newCustomer.fileNameUrl
      }
    });
  } catch (err) {
    console.error('Erro ao criar cliente:', err);
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
  res.json({ message: 'Cliente removido com sucesso' });
});
*/
module.exports = router;