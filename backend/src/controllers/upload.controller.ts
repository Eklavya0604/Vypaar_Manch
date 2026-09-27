import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary SDK automatically detects process.env.CLOUDINARY_URL

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
    });

    res.status(200).json({ secure_url: result.secure_url });
  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'Image upload failed' });
  }
};
