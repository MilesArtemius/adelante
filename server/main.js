const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');

const game = require('./game');
const router = require('./router');

const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../resources/templates"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const server = express.Router();

server.use((req, res, next) => {
    console.log("Called", req.url, "with method", req.method, "at", (new Date()).toLocaleString("ru"), "processing...");
    return next();
});

game.configure(server);
router.configure(server);

app.use("/", server);

const privateKey = fs.readFileSync(path.join(__dirname, "../keys/server.key"));
const certificate = fs.readFileSync(path.join(__dirname, "../keys/server.crt"));
const httpsServer = https.createServer({key: privateKey, cert: certificate}, app);
game.set_socket(httpsServer);
httpsServer.listen(8080, () => {
    console.log("Server started at: https://localhost:" +  httpsServer.address().port + "/");
});

process.on("SIGINT", () => {
    game.close_all();
    process.exit();
});
