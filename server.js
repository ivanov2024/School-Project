const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Статични ресурси
app.use('/SchoolCompany', express.static(path.join(__dirname, 'SchoolCompany')));
app.use('/uploads', express.static(uploadPath));

// Рут за качване на снимка
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Няма качен файл.' });

  const filename = req.file.filename;
  const caption = req.body.caption || '';
  const date = new Date().toISOString();
  const galleryId = req.body.galleryId || '';

  const newImage = { filename, caption, date, galleryId };
  const imagesFile = path.join(__dirname, 'images.json');

  let images = [];
  if (fs.existsSync(imagesFile)) {
    images = JSON.parse(fs.readFileSync(imagesFile));
  }
  images.push(newImage);
  fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2));

  res.json({ success: true, filename, caption, date, galleryId });
});


// Рут за извличане на качените снимки
app.get('/get-images', (req, res) => {
  const imagesFile = path.join(__dirname, 'images.json');
  if (!fs.existsSync(imagesFile)) {
    return res.json([]);
  }
  const images = JSON.parse(fs.readFileSync(imagesFile));
  res.json(images);
});

// Рут за запис на мнение
app.post('/feedback', (req, res) => {
  const feedback = req.body.feedback;
  if (!feedback) return res.status(400).json({ success: false, error: 'Няма съдържание.' });

  const feedbackFile = path.join(__dirname, 'feedback.json');
  let feedbacks = [];
  if (fs.existsSync(feedbackFile)) {
    feedbacks = JSON.parse(fs.readFileSync(feedbackFile));
  }
  feedbacks.push({ feedback, date: new Date().toISOString() });
  fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2));

  res.json({ success: true });
});

// Стартиране на сървъра
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Сървърът работи на: http://localhost:${PORT}`);
});
