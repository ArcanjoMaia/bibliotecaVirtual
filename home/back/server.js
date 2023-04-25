import data from "./produto";
import express from express;

const app = express();

app.get('/api/produtos', (rq, res) => {
    res.send(data.produtos);
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`serve at https://localhost:${port}`);
});