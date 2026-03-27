const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/elearning');
  console.log('✅ Conectado a MongoDB');

  await User.deleteMany({}); // Limpia usuarios anteriores

  const users = [
    { name: 'Admin Principal', email: 'admin@nexus.com', password: 'admin123', role: 'admin' },
    { name: 'Ana García', email: 'instructor@nexus.com', password: 'instructor123', role: 'instructor' },
    { name: 'Carlos López', email: 'estudiante@nexus.com', password: 'estudiante123', role: 'student' },
  ];

  for (const u of users) {
    await User.create(u); // El pre('save') de bcrypt hashea la contraseña automáticamente
    console.log(`👤 Creado: ${u.email} (${u.role})`);
  }

  console.log('\n🎉 Seed completado. Usuarios disponibles:');
  console.log('  Admin:      admin@nexus.com       / admin123');
  console.log('  Instructor: instructor@nexus.com  / instructor123');
  console.log('  Estudiante: estudiante@nexus.com  / estudiante123');

  await mongoose.disconnect();
  process.exit(0);
};

seedUsers().catch(err => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
