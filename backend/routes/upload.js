const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const router = express.Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    // Estas credenciales se omitirán si se usan perfiles de IAM en un despliegue
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy'
  }
});

// Endpoint para obtener una URL prefirmada (Pre-signed URL) de subida
router.post('/presigned-url', async (req, res) => {
  // Nota: Deberíamos requerir que el usuario tenga rol de 'instructor'
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({ message: 'fileName y fileType son requeridos' });
  }

  // Sanitizar el nombre del archivo
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `courses/${Date.now()}_${sanitizedName}`;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || 'elearning-bucket',
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    res.json({
      uploadUrl: signedUrl,
      fileKey: key,
      fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME || 'elearning-bucket'}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
    });
  } catch (error) {
    console.error('Error generando Presigned URL:', error);
    res.status(500).json({ message: 'Error interno conectando a AWS S3' });
  }
});

module.exports = router;
