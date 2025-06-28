const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const uploadFile = async (file, folder) => {
  try {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(__dirname, '..', 'uploads', folder, fileName);

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/${folder}/${fileName}`;
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};

module.exports = { uploadFile };