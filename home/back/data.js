import bcrypt from 'bcryptjs';

const data = {
  usuario: [
    {
      nome: 'Ana Paula',
      email: 'admin@example.com',
      senha: bcrypt.hashSync('123456'),
      admin: true,
    },
    {
      nome: 'Joao Silva',
      email: 'user@example.com',
      senha: bcrypt.hashSync('123456'),
      admin: false,
    },
  ],
  produtos: [
    {
      // _id: '1',
      nome: 'Carie a Estranha',
      /*uma parte de um URL que identifica uma página específica em um site em um formato legível pelos usuários. */
      slug: 'carie-stiphenking-shirt',
      autor: 'Stiphen King',
      imagem: '/images/p1.jpg', // 679px × 829px
      preco: 120,
      quantidadeEstoque: 10,
      marca: 'Editora Suma das Letras',
      rating: 7.5,
      numReviews: 10,
      descricao: 'Livro de terror',
    },
    {
      // _id: '2',
      nome: 'Carie a Estranha',
      /*uma parte de um URL que identifica uma página específica em um site em um formato legível pelos usuários. */
      slug: 'carie-stiphenking-shirt',
      autor: 'Stiphen King',
      imagem: '/images/p1.jpg', // 679px × 829px
      preco: 120,
      quantidadeEstoque: 10,
      marca: 'Editora Suma das Letras',
      rating: 7.5,
      numReviews: 10,
      descricao: 'Livro de terror',
    },
    {
      // _id: '3',
      nome: '',
      /*uma parte de um URL que identifica uma página específica em um site em um formato legível pelos usuários. */
      slug: '',
      autor: '',
      imagem: '/images/p1.jpg', // 679px × 829px
      preco: 120,
      quantidadeEstoque: 10,
      marca: 'Editora Suma das Letras',
      rating: 7.5,
      numReviews: 10,
      descricao: 'Livro de terror',
    },
    {
      // _id: '4',
      nome: '',
      /*uma parte de um URL que identifica uma página específica em um site em um formato legível pelos usuários. */
      slug: '',
      autor: 'S',
      imagem: '/images/p1.jpg', // 679px × 829px
      preco: 120,
      quantidadeEstoque: 10,
      marca: 'Editora Suma das Letras',
      rating: 7.5,
      numReviews: 10,
      descricao: 'Livro de terror',
    },
  ],
};
export default data;
