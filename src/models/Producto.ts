import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor ingrese un nombre'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'Por favor ingrese una descripción'],
    trim: true,
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  precio: {
    type: Number,
    required: [true, 'Por favor ingrese un precio'],
    min: [0, 'El precio no puede ser negativo'],
    default: 0
  },
  stock: {
    type: Number,
    required: [true, 'Por favor ingrese el stock'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

// Si el modelo ya existe, usarlo; de lo contrario, crearlo
export default mongoose.models.Producto || mongoose.model('Producto', ProductoSchema);
