// Importando modulos no node com "require"
// Obs: tudo que for colocando sem um caminho, o node busca na pasta node_modules
const app = require("../src/app");
const http = require("http");
const debug = require("debug")("nodeapi:server");

const port = NormalizePort(process.env.PORT || "3000");
app.set("port", port);

// Criando o servidor
const server = http.createServer(app);

// Escutando a porta criada
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
console.log("API rodando na porta: " + port);

// Normalizando a porta para verificação
function NormalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }

  return false;
}

// Tratando erros no servidor
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Chamando o debug
function onListening() {
  const addr = server.address();
  const bind = typeof addr == "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
