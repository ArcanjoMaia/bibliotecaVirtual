import mongoose from 'mongoose';

/* Cadastro de usuario do site */
const userSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    resetToken: { type: String },
    admin: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

const Usuario = mongoose.model('Usuario', userSchema);
export default Usuario;
