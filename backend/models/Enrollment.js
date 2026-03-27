const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
  isCompleted: { type: Boolean, default: false },
  timeSpent: { type: Number, default: 0 }, // En segundos
  lastPosition: { type: Number, default: 0 } // En segundos (para retomar video)
});

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  paymentId: { type: String }, // Stripe Session ID o Payment Intent ID
  amountPaid: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  progress: {
    completedLessons: [lessonProgressSchema],
    percentageCompleted: { type: Number, default: 0 },
    lastLessonViewed: { type: mongoose.Schema.Types.ObjectId },
    totalTimeSpent: { type: Number, default: 0 } // Tiempo total dedicado al curso
  },
  completedAt: { type: Date }
}, { timestamps: true });

// Prevenir matrícula duplicada del mismo estudiante al mismo curso
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
