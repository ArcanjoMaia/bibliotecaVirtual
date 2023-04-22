import mongoose from 'mongoose';
/*Cadasto de produtos do site */
const reviewSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, unique: true },
    /*uma parte de um URL que identifica uma página específica em um site em um formato legível pelos usuários. */
    slug: { type: String, required: true, unique: true },
    imagem: { type: String, required: true },
    imagens: [String],
    autor: { type: String, required: true },
    categoria: { type: String, required: true },
    descricao: { type: String, required: true },
    preco: { type: Number, required: true },
    contagemEstoque: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Produto = mongoose.model('Produto', productSchema);
export default Produto;
