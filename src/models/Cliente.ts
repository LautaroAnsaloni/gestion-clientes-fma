import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor ingrese un nombre'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  telefono: {
    type: String,
    required: [true, 'Por favor ingrese un teléfono'],
    trim: true,
    maxlength: [20, 'El teléfono no puede tener más de 20 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Por favor ingrese un email'],
    trim: true,
    maxlength: [100, 'El email no puede tener más de 100 caracteres'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Si el modelo ya existe, usarlo; de lo contrario, crearlo
export default mongoose.models.Cliente || mongoose.model('Cliente', ClienteSchema);
