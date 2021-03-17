Client.socket.messages.register("OnUserBadgeAdd", function(data) {
    const entity = new Client.dialogs.display({
        title: "Badge Unlocked"
    });
    
    entity.show();

    Client.badges.renderer(data.badge).css("margin", "auto").appendTo(entity.$display);

    Client.badges.get(data.badge).then(function(data) {
        entity.$info.html(
            '<h1>Congratulations!</h1>' +
            '<p>You have received the badge <b>' + data.title + '</b></p>' +
            '<p>' + data.description + '</p>'
        );
    });
});