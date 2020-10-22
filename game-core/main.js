module.exports.loop = function (game_state) {
    game_state.tick++;
}

module.exports.create = function (params) {
    return {tick: 0};
}
