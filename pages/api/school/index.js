import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import { query } from '../../../lib/db';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Upload failed' });

      if (!files.image) return res.status(400).json({ error: 'Image is required' });

      try {
        const result = await cloudinary.uploader.upload(files.image.filepath);
        const imageUrl = result.secure_url;

        await query(
          `INSERT INTO schools (name, address, city, state, contact, image, email_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            fields.name,
            fields.address,
            fields.city,
            fields.state,
            fields.contact,
            imageUrl,
            fields.email_id,
          ]
        );

        res.status(201).json({ message: 'School added successfully' });
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Upload or DB failed' });
      }
    });
  }
}
