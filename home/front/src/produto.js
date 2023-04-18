/* Pasta direcionada a criação de novos livros */
const data = {
  produtos: [
    {
      name: 'Game of Thrones',
      /* slug o que você verá na url será utilizado como único */
      slug: 'livro-game-of-thornes',
      categoria: 'medieval',
      image: '/dados/gameof.jpg',
      preco: 49.99,
      contagem: 10,
      nota: 5.0,
      avaliacoes: 12,
      autor: 'George R. R. Martin',
    },
    {
      name: 'A arte da guerra',
      slug: 'livro-arte-da-guerra',
      categoria: 'medieval',
      image: '/dados/arteDaGuerra.jpg',
      preco: 14.49,
      contagem: 14,
      nota: 4.2,
      avaliacoes: 5,
      autor: 'Sun Tzu',
    },
    {
      name: 'O Príncipe',
      slug: 'livro-o-principe',
      categoria: 'Classicos',
      image: '/dados/oPrincipe.jpg',
      preco: 21.59,
      contagem: 4,
      nota: 54.6,
      avaliacoes: 18,
      autor: 'Maquiavel',
    },
  ],
};

/* exportar os dados para outros repositórios */
export default data;
