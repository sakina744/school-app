import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { query } from '../../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public/schoolImages'),
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Upload failed' });

      const { name, address, city, state, contact, email_id } = fields;

      if (!files.image) {
        return res.status(400).json({ error: 'Image is required' });
      }

      // Handle array or single object
      const fileObj = Array.isArray(files.image) ? files.image[0] : files.image;
      const fileName = path.basename(fileObj.filepath);
      const imagePath = `/schoolImages/${fileName}`;

      try {
        await query(
          `INSERT INTO schools (name, address, city, state, contact, image, email_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [name, address, city, state, contact, imagePath, email_id]
        );
        res.status(201).json({ message: 'School added successfully' });
      } catch (dbError) {
        console.error(dbError);
        res.status(500).json({ error: 'Database error' });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const schools = await query(
        'SELECT id, name, address, city, image FROM schools ORDER BY id DESC'
      );
      res.status(200).json(schools);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
