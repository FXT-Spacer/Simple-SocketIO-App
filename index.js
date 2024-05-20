const express = require('express');
const http = require('http');
const { initIo } = require('./config/socket_io_config');
const ejsConfig = require('./config/ejs_config');
const routeConfig = require('./config/route_config');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);

const io = initIo(server);
ejsConfig(app);
routeConfig(app);


server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});