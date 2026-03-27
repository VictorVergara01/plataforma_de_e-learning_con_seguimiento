const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String }
});

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String }, // AWS S3 URL
  duration: { type: Number }, // En minutos o segundos
  resources: [{
    title: { type: String },
    fileUrl: { type: String } // AWS S3 URL para descargables
  }],
  quiz: [quizQuestionSchema],
  order: { type: Number, required: true }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  lessons: [lessonSchema],
  order: { type: Number, required: true }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  stripeProductId: { type: String },
  stripePriceId: { type: String },
  coverImage: { type: String }, // AWS S3 URL
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  category: { type: String, required: true },
  modules: [moduleSchema],
  isPublished: { type: Boolean, default: false },
  totalDuration: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
