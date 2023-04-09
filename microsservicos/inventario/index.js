const express = require ('express');
const app = express();
const axios = require ('axios')
app.use(express.json())
const inventario = {};


//Requisição Get de Inventário
app.get ('/inventario', (req, res) => {
    res.send(inventario);
 });

 //Requisição Post de Inventário
 const bodyParser = require('body-parser');
 app.use(bodyParser.json());
 inventario = {};
 contador = 0;
 

app.post ('/inventario', (req, res) => {
    contador++;
    const { texto } = req.body;
    inventario[contador] = {
        contador, texto
    }
    res.status(201).send(inventario[contador]);
});

app.listen(5000, () => {
    console.log('inventario. Porta 5000');
});