import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Produto from '../models/produtoModelo.js';
import { autenticacao, admin } from '../utils.js';

const rotaProduto = express.Router();

rotaProduto.get('/', async (req, res) => {
  const produtos = await Produto.find();
  res.send(produtos);
});

rotaProduto.post(
  '/',
  autenticacao,
  admin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Produto({
      nome: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      imagem: '/images/p1.jpg',
      preco: 0,
      categoria: 'sample category',
      marca: 'sample brand',
      quantidadeEstoque: 0,
      rating: 0,
      numReviews: 0,
      descricao: 'sample description',
    });
    const produto = await newProduct.save();
    res.send({ message: 'Produto Criado', produto });
  })
);

rotaProduto.put(
  '/:id',
  autenticacao,
  admin,
  expressAsyncHandler(async (req, res) => {
    const produtoId = req.params.id;
    const produto = await Product.findById(produtoId);
    if (product) {
      produto.nome = req.body.name;
      produto.slug = req.body.slug;
      produto.preco = req.body.price;
      produto.imagem = req.body.image;
      produto.imagens = req.body.images;
      produto.categoria = req.body.category;
      produto.marca = req.body.brand;
      produto.quantidadeEstoque = req.body.countInStock;
      produto.descricao = req.body.description;
      await produto.save();
      res.send({ message: 'Produto Atualizado' });
    } else {
      res.status(404).send({ message: 'Produto Não Encontrado' });
    }
  })
);
/*Deletar um produto*/
rotaProduto.delete(
  '/:id',
  autenticacao,
  admin,
  expressAsyncHandler(async (req, res) => {
    const produto = await Produto.findById(req.params.id);
    if (produto) {
      await produto.remove();
      res.send({ message: 'Produto Deletado' });
    } else {
      res.status(404).send({ message: 'Produto Não Encontrado' });
    }
  })
);

rotaProduto.post(
  '/:id/reviews',
  autenticacao,
  expressAsyncHandler(async (req, res) => {
    const produtoId = req.params.id;
    const produto = await Produto.findById(produtoId);
    if (produto) {
      if (produto.reviews.find((x) => x.nome === req.usuario.nome)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

const PAGE_SIZE = 3;

rotaProduto.get(
  '/admin',
  autenticacao,
  admin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const produtos = await Produtos.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const contagemProdutos = await Produto.countDocuments();
    res.send({
      produtos,
      contagemProdutos,
      page,
      pages: Math.ceil(contagemProdutos / pageSize),
    });
  })
);

rotaProduto.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const categoria = query.categoria || '';
    const preco = query.preco || '';
    const rating = query.rating || '';
    const pedido = query.pedido || '';
    const busca = query.busca || '';

    const filtoQuery =
      busca && busca !== 'all'
        ? {
            nome: {
              $regex: busca,
              $opcores: 'i',
            },
          }
        : {};
    const categoriaFiltro = categoria && categoria !== 'all' ? { categoria } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const precoFiltro =
      preco && preco !== 'all'
        ? {
            // 1-50
            preco: {
              $gte: Number(preco.split('-')[0]),
              $lte: Number(preco.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      pedido === 'faturado'
        ? { featured: -1 }
        : pedido === 'baixo'
        ? { preco: 1 }
        : pedido === 'alto'
        ? { preco: -1 }
        : pedido === 'mais votado'
        ? { rating: -1 }
        : pedido === 'mais novo'
        ? { createdAt: -1 }
        : { _id: -1 };

    const produto = await Produto.find({
      ...queryFiltro,
      ...categoriaFiltro,
      ...precoFiltro,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFiltro,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      contagemProdutos,
      page,
      pages: Math.ceil(contagemProdutos / pageSize),
    });
  })
);

rotaProduto.get(
  '/categorias',
  expressAsyncHandler(async (req, res) => {
    const categorias = await Produto.find().distinct('Categoria');
    res.send(categorias);
  })
);

rotaProduto.get('/slug/:slug', async (req, res) => {
  const produto = await Produto.findOne({ slug: req.params.slug });
  if (produto) {
    res.send(produto);
  } else {
    res.status(404).send({ message: 'Produto Não Encontrado' });
  }
});
rotaProduto.get('/:id', async (req, res) => {
  const produto = await Produto.findById(req.params.id);
  if (produto) {
    res.send(produto);
  } else {
    res.status(404).send({ message: 'Produto Não Encontrado' });
  }
});

export default rotaProduto;
