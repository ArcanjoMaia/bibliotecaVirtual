import data from './produto';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import TelaProduto from './telas/TelaProduto';
import HomeScreen from './telas/HomeScreen';

/* Pagina inicial */
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Link to="/">Judasteca</Link>
        </header>
        <main>
          <Routes>
            <Route path="/produtos/:slug" element={<TelaProduto />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
