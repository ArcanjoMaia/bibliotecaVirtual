import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';

export const baseUrl = () =>
  process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https://yourdomain.com';

export const generateToken = (usuario) => {
  return jwt.sign(
    {
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      admin: usuario.admin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const autent = (req, res, next) => {
  const autorizacao = req.headers.autorizacao;
  if (autorizacao) {
    const token = autorizacao.slice(7, autorizacao.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token Invalido' });
      } else {
        req.usuario = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Token Não Encontrado' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.admin) {
    next();
  } else {
    res.status(401).send({ message: 'Token do Administrador Inválido' });
  }
};

export const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMIAN,
  });

export const payOrderEmailTemplate = (pedido) => {
  return `<h1>Obrigado por comprar com a gente!</h1>
  <p>
  Hi ${pedido.usuario.nome},</p>
  <p>Estamos finalizando sua compra.</p>
  <h2>[Pedido ${pedido._id}] (${pedido.createdAt.toString().substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Produto</strong></td>
  <td><strong>Quantidade</strong></td>
  <td><strong align="right">Valor</strong></td>
  </thead>
  <tbody>
  ${pedido.itensPedido
    .map(
      (item) => `
    <tr>
    <td>${item.nome}</td>
    <td align="center">${item.quantidade}</td>
    <td align="right"> $${item.preco.toFixed(2)}</td>
    </tr>
  `
    )
    .join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Valor Itens:</td>
  <td align="right"> $${pedido.itensPedido.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Valor Entrega:</td>
  <td align="right"> $${pedido.precoEntrega.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2"><strong>Valor Total:</strong></td>
  <td align="right"><strong> $${pedido.totalPrice.toFixed(2)}</strong></td>
  </tr>
  <tr>
  <td colspan="2">Payment Method:</td>
  <td align="right">${pedido.formaPagamento}</td>
  </tr>
  </table>

  <h2>Endereço de Entrega</h2>
  <p>
  ${pedido.enderecoEntrega.nomeCompleto},<br/>
  ${pedido.enderecoEntrega.endereco},<br/>
  ${pedido.enderecoEntrega.cidade},<br/>
  ${pedido.enderecoEntrega.pais},<br/>
  ${pedido.enderecoEntrega.cep}<br/>
  </p>
  <hr/>
  <p>
  Obrigado Pela Compra!.
  </p>
  `;
};
