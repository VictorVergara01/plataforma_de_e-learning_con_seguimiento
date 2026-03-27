const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const crypto = require('crypto');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { sendCertificateEmail } = require('./emailService');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const generateCertificate = async ({ enrollmentId }) => {
  const enrollment = await Enrollment.findById(enrollmentId).populate('student course');
  if (!enrollment) throw new Error('Matrícula no encontrada');

  const student = enrollment.student;
  const course = enrollment.course;
  
  // 1. Crear el PDF con pdf-lib
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Fondo degradado simulado con rectángulos
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.06, 0.09, 0.16) });

  // Franja decorativa superior
  page.drawRectangle({ x: 0, y: height - 12, width, height: 12, color: rgb(0.39, 0.4, 0.95) });
  page.drawRectangle({ x: 0, y: 0, width, height: 12, color: rgb(0.39, 0.4, 0.95) });

  // Marco interior elegante
  page.drawRectangle({ x: 32, y: 32, width: width - 64, height: height - 64, borderColor: rgb(0.39, 0.4, 0.95), borderWidth: 1.5 });
  page.drawRectangle({ x: 40, y: 40, width: width - 80, height: height - 80, borderColor: rgb(0.29, 0.30, 0.70), borderWidth: 0.5 });

  // Logo/Título superior
  page.drawText('NEXUS LMS', { x: width / 2 - 80, y: height - 90, size: 20, font: boldFont, color: rgb(0.63, 0.65, 0.98) });

  // Texto "Certificado de Finalización"
  page.drawText('Certificado de Finalización', { x: width / 2 - 170, y: height - 135, size: 28, font: boldFont, color: rgb(0.95, 0.95, 0.98) });

  // Línea divisora
  page.drawLine({ start: { x: width / 2 - 200, y: height - 155 }, end: { x: width / 2 + 200, y: height - 155 }, thickness: 1, color: rgb(0.39, 0.4, 0.95) });

  // Texto "Se certifica que"
  page.drawText('Se certifica que', { x: width / 2 - 58, y: height - 210, size: 15, font: regularFont, color: rgb(0.6, 0.65, 0.75) });

  // Nombre del estudiante
  page.drawText(student.name, { x: width / 2 - (student.name.length * 13), y: height - 270, size: 44, font: boldFont, color: rgb(0.99, 0.99, 1) });

  // "completó satisfactoriamente el curso"
  page.drawText('completó satisfactoriamente el curso:', { x: width / 2 - 155, y: height - 320, size: 15, font: regularFont, color: rgb(0.6, 0.65, 0.75) });

  // Nombre del curso
  const courseTitle = course.title.length > 45 ? course.title.substring(0, 45) + '...' : course.title;
  page.drawText(courseTitle, { x: width / 2 - (courseTitle.length * 7), y: height - 368, size: 22, font: boldFont, color: rgb(0.63, 0.65, 0.98) });

  // Fecha de emisión
  const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  page.drawText(`Fecha de emisión: ${today}`, { x: width / 2 - 120, y: height - 430, size: 12, font: regularFont, color: rgb(0.5, 0.55, 0.65) });

  // Hash de validación
  const certHash = crypto.randomBytes(16).toString('hex').toUpperCase();
  page.drawText(`ID de Verificación: ${certHash}`, { x: width / 2 - 130, y: 60, size: 10, font: regularFont, color: rgb(0.4, 0.45, 0.55) });

  const pdfBytes = await pdfDoc.save();

  // 2. Subir PDF a S3
  const key = `certificates/${certHash}.pdf`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME || 'elearning-bucket',
    Key: key,
    Body: Buffer.from(pdfBytes),
    ContentType: 'application/pdf',
  }));

  const pdfUrl = `https://${process.env.AWS_S3_BUCKET_NAME || 'elearning-bucket'}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

  // 3. Guardar en MongoDB
  const cert = new Certificate({
    student: student._id,
    course: course._id,
    enrollment: enrollmentId,
    pdfUrl,
    certificateHash: certHash,
  });
  await cert.save();

  // 4. Enviar notificación por email
  await sendCertificateEmail({ to: student.email, studentName: student.name, courseName: course.title, certificateUrl: pdfUrl });

  return cert;
};

module.exports = { generateCertificate };
