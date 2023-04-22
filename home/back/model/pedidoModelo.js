import mongoose from 'mongoose';
/* cadastro de pedidos do site */ 
const orderSchema = new mongoose.Schema(
  {
    itensPedido: [
      {
        slug: { type: String, required: true },
        nome: { type: String, required: true },
        quantidade: { type: Number, required: true },
        imagem: { type: String, required: true },
        preco: { type: Number, required: true },
        produto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Produto',
          required: true,
        },
      },
    ],
    enderecoEntrega: {
      nomeCompleto: { type: String, required: true },
      endereco: { type: String, required: true },
      cidade: { type: String, required: true },
      cep: { type: String, required: true },
      pais: { type: String, required: true },
      location: {
        lat: Number,
        lng: Number,
        address: String,
        name: String,
        vicinity: String,
        googleAddressId: String,
      },
    },
    metodoPagamento: { type: String, required: true },
    resultadoPagamento: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    precoItem: { type: Number, required: true },
    entregaPreco: { type: Number, required: true },
    /*taxPrice: { type: Number, required: true },*/
    precoTotal: { type: Number, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Pedido = mongoose.model('Pedido', orderSchema);
export default Pedido;
