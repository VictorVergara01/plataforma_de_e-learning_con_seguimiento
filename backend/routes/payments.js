const express = require('express');
const Stripe = require('stripe');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const { sendEnrollmentEmail } = require('../services/emailService');

const router = express.Router();
// El STRIPE_SECRET_KEY se carga desde el .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Endpoint para crear la sesión de Checkout de Stripe
router.post('/create-checkout-session', async (req, res) => {
  const { courseId, userId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: course.currency || 'usd',
            product_data: {
              name: course.title,
              images: course.coverImage ? [course.coverImage] : [],
            },
            unit_amount: Math.round(course.price * 100), // Stripe procesa en centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${courseId}`,
      metadata: {
        courseId: course._id.toString(),
        userId: userId, // Necesario para la matriculación
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ message: 'Error interno conectando a Stripe' });
  }
});

// Webhook para confirmar el pago asincrónicamente
// Nota: 'req.body' aquí será un Buffer porque en index.js asignamos express.raw() para esta ruta.
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error de firma: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar el pago satisfactorio
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const courseId = session.metadata.courseId;
    const userId = session.metadata.userId;

    try {
      // Registrar matriculación (Enrollment)
      const newEnrollment = new Enrollment({
        student: userId,
        course: courseId,
        paymentId: session.id,
        amountPaid: session.amount_total / 100, // De centavos a decimal
        isActive: true,
      });

      await newEnrollment.save();
      console.log(`Usuario ${userId} matriculado en curso ${courseId}`);

      // Notificar al estudiante por email
      const [student, course] = await Promise.all([
        User.findById(userId),
        Course.findById(courseId)
      ]);
      if (student && course) {
        await sendEnrollmentEmail({ to: student.email, studentName: student.name, courseName: course.title, courseId });
      }
    } catch (error) {
      console.error('Error procesando matriculación post-pago:', error);
    }
  }

  res.json({ received: true });
});

module.exports = router;
