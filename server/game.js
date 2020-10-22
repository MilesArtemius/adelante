const game_core = require('../game-core/main');
let io;

const games = {};



function set_game_loop (game_id) {
    return setInterval(() => {
        game_core.loop(games[game_id].data);
        io.to(game_id).emit("game_state", JSON.stringify(games[game_id], (key, value) => {
            if (key === "interval") return undefined;
            else return value;
        }));
    }, 1000);
}

module.exports.configure = function (server) {
    server.post("/game", (req, res) => {
        console.log("Game", req.body.id, "created");
        games[req.body.id] = {data: game_core.create(req.body.params)};
        return res.end();
    });

    server.get("/game", (req, res) => {
        const id = req.query.id;
        if (!games[id]) return res.status(404).end();
        else if (!games[id].host) {
            games[id].host = "host_id"; // user id;
            console.log("Host entered room", id);
        } else if (!!games[id].host && !games[id].guest) {
            games[id].guest = "guest_id"; // user id;
            console.log("Guest entered room", id);
            games[id].interval = set_game_loop(id);
            console.log("Game", id, "started!");
        }
        return res.render("game");
    });
}

module.exports.set_socket = function (app) {
    io = require('socket.io')(app);

    io.on("connection", (socket) => {
        socket.on("join", (game_id) => {
            socket.join(game_id);
            socket.game = game_id;
            if (!games[game_id].viewers) games[game_id].viewers = 1;
            else games[game_id].viewers++;
            console.log(socket.id, "entered room", game_id, "and now there are", games[game_id].viewers, "viewers");
        });

        socket.on("disconnect", (reason) => {
            games[socket.game].viewers--;
            console.log(socket.id, "left room", socket.game, "because of", reason, "and viewers left:", games[socket.game].viewers);
            if (games[socket.game].viewers === 0) {
                clearInterval(games[socket.game].interval);
                console.log("Game", socket.game, "stopped");
                delete games[socket.game];
                console.log("Game", socket.game, "deleted");
            }
        });
    });
}

module.exports.close_all = function () {
    Object.values(io.of("/").connected).forEach((socket) => socket.disconnect(true));
}
