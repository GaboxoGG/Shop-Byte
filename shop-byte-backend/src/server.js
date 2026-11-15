
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Shop&Byte escuchando en el puerto ${PORT}`);
});
