import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Pedido from '../models/rotaPedido.js';
import Usuario from '../models/usuarioModelo.js';
import Produto from '../models/profdutoModelo.js';
import { autenticacao, admin, mailgun, payOrderEmailTemplate } from '../utils.js';
import Pedido from '../model/pedidoModel';

const rotaPedido = express.Router();

rotaPedido.get(
  '/',
  autenticacao,
  admin,
  expressAsyncHandler(async (req, res) => {
    const pedidos = await Pedido.find().populate('usuario', 'nome');
    res.send(pedidos);
  })
);

rotaPedido.post(
  '/',
  autenticacao,
  expressAsyncHandler(async (req, res) => {
    const novoPedido = new Pedido({
      itensPedido: req.body.itensPedido.map((x) => ({ ...x, product: x._id })),
      enderecoEntrega: req.body.enderecoEntrega,
      formaPagamento: req.body.formaPagamento,
      precoItens: req.body.precoItens,
      entregaPreco: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      precoTotal: req.body.totalPrice,
      usuario: req.user._id,
    });

    const pedido = await novoPedido.save();
    res.status(201).send({ message: 'Novo Pedido Criado', pedido });
  })
);

rotaPedido.get(
  '/summary',
  autenticacao,
  admin,
  expressAsyncHandler(async (req, res) => {
    const pedidos = await Pedido.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalVenda: { $sum: '$valorTotal' },
        },
      },
    ]);
    const usuario = await Usuario.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Pedido.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          pedido: { $sum: 1 },
          vendas: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const categoriaProduto = await Produto.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ usuario, pedidos, dailyOrders, categoriaProduto });
  })
);

rotaPedido.get(
  '/mine',
  autenticacao,
  expressAsyncHandler(async (req, res) => {
    const pedidos = await Pedido.find({ usuario: req.user._id });
    res.send(pedidos);
  })
);

rotaPedido.get(
  '/:id',
  autenticacao,
  expressAsyncHandler(async (req, res) => {
    const Pedido = await Pedido.findById(req.params.id);
    if (pedido) {
      res.send(pedido);
    } else {
      res.status(404).send({ message: 'Pedido Não Encontrado' });
    }
  })
);

rotaPedido.put(
  '/:id/deliver',
  autenticacao,
  expressAsyncHandler(async (req, res) => {
    const pedido = await Pedido.findById(req.params.id);
    if (Pedido) {
      pedodo.isDelivered = true;
      pedidp.deliveredAt = Date.now();
      await pedido.save();
      res.send({ message: 'Pedido Entregue' });
    } else {
      res.status(404).send({ message: 'Pedido Não Encontrado' });
    }
  })
);

rotaPedido.put(
  '/:id/pay',
  autenticacao,
  expressAsyncHandler(async (req, res) => {
    const pedido = await Pedido.findById(req.params.id).populate(
      'usuario',
      'email'
    );
    if (pedido) {
      pedido.isPaid = true;
      pedido.paidAt = Date.now();
      pedido.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email: req.body.email,
      };

      const updatedOrder = await pedido.save();
      mailgun()
        .messages()
        .send(
          {
            de: 'Biblioteca Virtual <bibliotecavirtual@livro.com.br>',
            para: `${order.user.name} <${order.user.email}>`,
            assunto: `New order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );

      res.send({ message: 'Pedido Pago', pedido: updatedOrder });
    } else {
      res.status(404).send({ message: 'Pedido Não Encontrado' });
    }
  })
);

rotaPedido.delete(
  '/:id',
  autenticacao,
  admin,
  expressAsyncHandler(async (req, res) => {
    const pedido = await Pedido.findById(req.params.id);
    if (pedido) {
      await pedido.remove();
      res.send({ message: 'Pedido Deletado' });
    } else {
      res.status(404).send({ message: 'Pedido Não Encontrado' });
    }
  })
);

export default rotaPedido;
