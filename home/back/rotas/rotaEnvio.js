import express from 'express';
import Produto from '../model/produtoModelo.js';
import data from '../data.js';
import Usuario from '../models/usuarioModelo.js';

const rotaEnvio = express.Router();

rotaEnvio.get('/', async (req, res) => {
  await Produto.remove({});
  const criacaoProduto = await Produto.insertMany(data.produtos);
  await Usuario.remove({});
  const criacaoUsuarios = await User.insertMany(data.usuarios);
  res.send({ criacaoProduto, criacaoUsuarios });
});
export default rotaEnvio;
