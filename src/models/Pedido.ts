import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: [true, 'Por favor seleccione un cliente']
  },
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: [true, 'Por favor seleccione un producto']
  },
  cantidad: {
    type: Number,
    required: [true, 'Por favor ingrese una cantidad'],
    min: [1, 'La cantidad debe ser al menos 1'],
    default: 1
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['pendiente', 'disponible', 'entregado'],
    default: 'pendiente'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Agregar un índice para las búsquedas por estado
PedidoSchema.index({ estado: 1 });

// Método para poblar cliente y producto
PedidoSchema.methods.withDetails = async function() {
  await this.populate('clienteId').populate('productoId');
  return this;
};

// Si el modelo ya existe, usarlo; de lo contrario, crearlo
export default mongoose.models.Pedido || mongoose.model('Pedido', PedidoSchema);
