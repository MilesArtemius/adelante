$("#start_button").click(() => {
    $.post("/game", {
        id: 0
    }).done(function() {
        window.location.href = "/game?id=0"
    }).fail(function(jqXHR) {
        $(this).html("Not started!");
        console.log(jqXHR.responseText);
    });
});
