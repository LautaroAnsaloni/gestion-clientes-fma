import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor ingrese un nombre'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Por favor ingrese un email'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [100, 'El email no puede tener más de 100 caracteres'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  password: {
    type: String,
    required: [true, 'Por favor ingrese una contraseña'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No se incluirá en las consultas por defecto
  },
  rol: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Middleware para hashear la contraseña antes de guardar
UsuarioSchema.pre('save', async function(next) {
  // Solo hash la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();

  try {
    // Generar un salt
    const salt = await bcrypt.genSalt(10);
    // Hash la contraseña con el salt generado
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
UsuarioSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Si el modelo ya existe, usarlo; de lo contrario, crearlo
export default mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);
