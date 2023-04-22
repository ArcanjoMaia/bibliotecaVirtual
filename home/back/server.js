import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rotaEnvio from "./routes/rotaEnvio.js";
import rotaProduto from "./routes/rotaProduto.js";
import rotaUsuario from "./routes/rotaUsuario.js";
import rotaPedido from "./routes/rotaPedido.js";
import uploadRota from "./routes/uploadRota.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("conectado ao banco de dados");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
app.get("/api/keys/google", (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || "" });
});
*/

app.use("/api/upload", uploadRota);
app.use("/api/envio", rotaEnvio);
app.use("/api/produtos", rotaProduto);
app.use("/api/usuarios", rotaUsuario);
app.use("/api/pedidos", rotaPedido);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('serve at http://localhost:${port}');
});
