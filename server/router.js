module.exports.configure = function (server) {
    server.get("/", (req, res) => {
        return res.render("intro");
    });
}