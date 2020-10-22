const socket = io();
const game_id = (new URLSearchParams(window.location.search)).get("id");
socket.emit("join", game_id);

socket.on("game_state", (game_data) => {
    console.log("Game state retrieved:", game_data);
});
