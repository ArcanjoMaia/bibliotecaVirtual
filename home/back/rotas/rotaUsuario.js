import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuarioModelo.js';
import { autenticao, admin, generateToken, baseUrl, mailgun } from '../utils.js';

const userRouter = express.Router();

rotaUsuario.get(
  '/',
  autenticao,
  admin,
  expressAsyncHandler(async (req, res) => {
    const usuario = await Usuario.find({});
    res.send(usuarios);
  })
);

rotaUsuario.get(
  '/:id',
  autenticao,
  admin,
  expressAsyncHandler(async (req, res) => {
    const usuario = await Usuario.findById(req.params.id);
    if (usuario) {
      res.send(usuario);
    } else {
      res.status(404).send({ message: 'Usuario Não Encontrado' });
    }
  })
);

rotaUsuario.put(
  '/profile',
  autenticao,
  expressAsyncHandler(async (req, res) => {
    const usuario = await Usuario.findById(req.usuario._id);
    if (usuario) {
      user.nome = req.body.nome || user.nome;
      user.email = req.body.email || user.email;
      if (req.body.senha) {
        user.senha = bcrypt.hashSync(req.body.senha, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        nome: updatedUser.name,
        email: updatedUser.email,
        admin: updatedUser.admin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'Usuario não encontrado' });
    }
  })
);

rotaUsuario.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const usuario = await Usuario.findOne({ email: req.body.email });

    if (usuario) {
      const token = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
        expiresIn: '3h',
      });
      usuario.resetToken = token;

      //reset link
      console.log(`${baseUrl()}/reset-password/${token}`);

      mailgun()
        .messages()
        .send(
          {
            de: 'Biblioteca Virtual <me@mg.yourdomain.com>',
            para: `${usuario.nome} <${usuario.email}>`,
            assunto: 'Resetar senha',
            html: ` 
             <p>Clique no link para alterar a senha:</p> 
             <a href="${baseUrl()}/reset-password/${token}"}>Resetar Senha</a>
             `,
          },
          (error, body) => {
            console.log(error);
            console.log(body);
          }
        );
      res.send({ message: 'Enviamos o link para resetar a senha para o seu email.' });
    } else {
      res.status(404).send({ message: 'Usuario não encontrado' });
    }
  })
);

rotaUsuario.post(
  '/reset-senha',
  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token Invalido' });
      } else {
        const usuario = await Usuario.findOne({ resetToken: req.body.token });
        if (usuario) {
          if (req.body.senha) {
            usuario.senha = bcrypt.hashSync(req.body.senha, 8);
            await usuario.save();
            res.send({
              message: 'Nova senha criada com sucesso',
            });
          }
        } else {
          res.status(404).send({ message: 'Usuario não encontrado' });
        }
      }
    });
  })
);

rotaUsuario.put(
  '/:id',
  autenticao,
  admin,
  expressAsyncHandler(async (req, res) => {
    const usuario = await Usuario.findById(req.params.id);
    if (usuario) {
      usuario.nome = req.body.nome || usuario.nome;
      usuario.email = req.body.email || usuario.email;
      usuario.admin = Boolean(req.body.admin);
      const updatedUser = await usuario.save();
      res.send({ message: 'Usuário Atualizado', usuario: updatedUser });
    } else {
      res.status(404).send({ message: 'Usuario não encontrado' });
    }
  })
);

userRouter.delete(
  '/:id',
  autenticao,
  admin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

export default rotaUsuario;
