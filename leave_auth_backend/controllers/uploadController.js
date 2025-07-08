const { supabase } = require('../utils/supabaseClient');
const multer = require('multer');
const upload = multer();

const handleFileUpload = async (req, res) => {
  try {
    upload.array('documents')(req, res, async (err) => {
      if (err) return res.status(400).json({ message: 'Upload failed' });

      const uploadedUrls = [];

      for (const file of req.files) {
        const uniqueName = `${file.originalname.replace(/\s+/g, '_')}_${Date.now()}`;
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(uniqueName, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
          });

        if (error) throw error;

        const publicUrl = supabase.storage.from('documents').getPublicUrl(data.path).data.publicUrl;
        uploadedUrls.push(publicUrl);
      }

      return res.status(200).json({ message: 'Files uploaded', urls: uploadedUrls });
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { handleFileUpload };
