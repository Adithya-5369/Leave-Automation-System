const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../utils/supabaseClient');

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('files');

const handleFileUpload = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ message: 'File upload failed' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const urls = [];

    for (const file of req.files) {
      const uniqueName = `${uuidv4()}_${Date.now()}-${file.originalname}`;
      const { error } = await supabase.storage
        .from('documents') // your Supabase bucket
        .upload(uniqueName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return res.status(500).json({ message: 'Upload to Supabase failed' });
      }

      const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${uniqueName}`;
      urls.push(publicUrl);
    }

    res.status(200).json({ message: 'Files uploaded', urls });
  });
};

module.exports = { handleFileUpload };
