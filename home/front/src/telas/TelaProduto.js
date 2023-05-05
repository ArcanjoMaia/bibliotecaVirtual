import { useParams } from 'react-router-dom';

function TelaProduto() {
  const params = useParams();
  const { slug } = params;
  return (
    <div>
      <h1>{slug}</h1>
    </div>
  );
}
export default TelaProduto;
