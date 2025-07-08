const multer = require('multer');
const supabase = require('../utils/supabaseClient');
const { v4: uuidv4 } = require('uuid');

// Use Multer for parsing files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToSupabase = async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const uploadedUrls = [];

  for (const file of files) {
    const uniqueName = `${uuidv4()}_${file.originalname}`;

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(uniqueName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ message: 'Upload failed', error });
    }

    const publicURL = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(uniqueName).data.publicUrl;

    uploadedUrls.push(publicURL);
  }

  res.status(200).json({ message: 'Files uploaded', urls: uploadedUrls });
};

module.exports = {
  upload,
  uploadToSupabase
};
