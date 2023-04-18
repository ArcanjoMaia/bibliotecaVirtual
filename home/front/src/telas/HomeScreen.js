import { Link } from 'react-router-dom';
import data from '../produto';

function HomeScreen() {
  return (
    <div>
      <h1>Lista de Livros</h1>
      <div className="livros">
        {data.produtos.map((produtos) => (
          <div className="livro" key={produtos.slug}>
            <Link to={`/produto/${produtos.slug}`}>
              <img src={produtos.image} alt={produtos.name} height={400} />
            </Link>
            <div className="livro-info">
              <Link to={`/produto/${produtos.slug}`}>
                <p>{produtos.name}</p>
              </Link>
              <p>
                <strong> R$ {produtos.preco}</strong>
              </p>
              <button>Adicionar ao carrinho</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;
