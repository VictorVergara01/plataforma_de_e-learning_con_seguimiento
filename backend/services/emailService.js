const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEnrollmentEmail = async ({ to, studentName, courseName, courseId }) => {
  await transporter.sendMail({
    from: `"Nexus LMS" <${process.env.EMAIL_USER}>`,
    to,
    subject: `¡Bienvenido al curso "${courseName}"!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); padding: 12px 24px; border-radius: 12px;">
            <span style="font-size: 20px; font-weight: 900; color: white; letter-spacing: -0.5px;">Nexus LMS</span>
          </div>
        </div>
        <h1 style="font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">¡Matrícula Exitosa, ${studentName}! 🎉</h1>
        <p style="font-size: 16px; color: #94a3b8; line-height: 1.6;">Ya tienes acceso completo al curso:</p>
        
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <h2 style="font-size: 20px; font-weight: 800; color: #818cf8; margin: 0 0 8px 0;">${courseName}</h2>
          <p style="font-size: 14px; color: #64748b; margin: 0;">Acceso vitalicio • Certificado incluido</p>
        </div>

        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${courseId}" 
           style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-weight: 700; font-size: 16px; padding: 14px 32px; border-radius: 12px; text-decoration: none; margin-top: 8px;">
          Comenzar Ahora →
        </a>

        <p style="font-size: 13px; color: #475569; margin-top: 32px; padding-top: 24px; border-top: 1px solid #1e293b;">
          Este email fue enviado por Nexus LMS. Si no realizaste esta compra, contáctanos a soporte@nexuslms.com
        </p>
      </div>
    `,
  });
};

const sendCertificateEmail = async ({ to, studentName, courseName, certificateUrl }) => {
  await transporter.sendMail({
    from: `"Nexus LMS" <${process.env.EMAIL_USER}>`,
    to,
    subject: `¡Obtuviste tu certificado de "${courseName}"!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 56px; margin-bottom: 16px;">🏆</div>
          <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); padding: 12px 24px; border-radius: 12px;">
            <span style="font-size: 20px; font-weight: 900; color: white;">Nexus LMS</span>
          </div>
        </div>
        <h1 style="font-size: 28px; font-weight: 900; color: #fff; text-align: center;">¡Lo lograste, ${studentName}!</h1>
        <p style="font-size: 16px; color: #94a3b8; line-height: 1.6; text-align: center; margin-top: 8px;">
          Completaste el 100% del curso <strong style="color:#818cf8">${courseName}</strong> y obtuviste tu certificado oficial.
        </p>
        <div style="text-align: center; margin-top: 32px;">
          <a href="${certificateUrl}" 
             style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: white; font-weight: 700; font-size: 16px; padding: 14px 32px; border-radius: 12px; text-decoration: none;">
            Descargar Certificado PDF →
          </a>
        </div>
      </div>
    `,
  });
};

module.exports = { sendEnrollmentEmail, sendCertificateEmail };
