const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Set Storage Engine
const storage = multer.diskStorage({
  destination: function(req, file, cb)
  {
    return cb(null, "./uploads/");  // Directory to save files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myFile');

// Check File Type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Set public folder
app.use(express.static('./public'));

// Home Route
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

// File Upload Route
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send('Error: ' + err);
    } else {
      if (req.file == undefined) {
        res.send('Error: No File Selected!');
      } else {
        res.send(`File Uploaded: ${req.file.filename}`);
      }
    }
  });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
