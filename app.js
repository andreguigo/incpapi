import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

import { myAge } from './utils/dateUtils.js';
import { json } from 'stream/consumers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
    	const uploadPath = 'uploads/';
    	if (!fs.existsSync(uploadPath))
      		fs.mkdirSync(uploadPath);
    	cb(null, uploadPath);
	},

	filename: (req, file, cb) => {
		const identifierUser = req.userId;
		const fileRename = `${file.fieldname}-${identifierUser}${path.extname(file.originalname)}`;
    	cb(null, fileRename);
	}
});

const upload = multer({ 
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: (req, file, cb) => {
    	const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed'));
	}
}).single('image');

const filePath = 'users/users.json';

app.use('/public', express.static(path.join(__dirname, 'uploads')));

app.post('/api', (req, res) => {
	req.userId = uuidv4();

	try {
		upload(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				return res.status(500).json({ success: false, message: 'Upload error (Multer): ' + err.message });
			} else if (err) {
				return res.status(415).json({ success: false, message: 'Content type not supported' });
			}

			if (!req.file) 
				return res.status(400).json({ success: false, message: 'User photo is required' });
			
			let dataExisting = JSON.parse(fs.readFileSync(filePath, 'utf8'));
			
			dataExisting.count++;
			dataExisting.itens.push({ id: req.userId, ...req.body, fileName: req.file.filename });

			const jsonString = JSON.stringify(dataExisting, null, 4);
			fs.writeFileSync(filePath, jsonString, 'utf8');

			res.status(200).json({
				success: true,
				message: 'Content saved successfully:',
				id: req.userId,
				textData: req.body,
				file: req.file
			});
		});
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
});

app.get('/api', async (req, res) => {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		const jsonData = JSON.parse(data);

		const filtered = jsonData.itens.map(item => ({
			id: item.id,
			fullName: item.fullName,
			birthDate: myAge(item.birthDate),
			selectedVolunteerArea: item.selectedVolunteerArea,
			selectedMemberDate: item.selectedMemberDate,
			fileName: item.fileName
		}));

    	res.status(200).json( filtered );
	} catch (err) {
		console.error('Error processing request:', err);

		return res.status(500).json({ 
			sucess: false,
			message: 'Error processing request',
			error: err.message
		});
	}
});

app.get('/api/:id', async (req, res) => {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		const jsonData = JSON.parse(data);
		
		const user = jsonData.itens.find(item => item.id === req.params.id);
		user.birthDate = myAge(user.birthDate);
    	
		res.status(200).json( user );
	} catch (err) {
		console.error('Error processing request:', err);

		return res.status(500).json({ 
			sucess: false,
			message: 'Error processing request',
			error: err.message
		});
	}
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

export default app;