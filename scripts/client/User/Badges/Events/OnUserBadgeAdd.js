SocketMessages.register("OnUserBadgeAdd", function(data) {
    const entity = new DisplayDialog({
        title: "Badge Unlocked"
    });
    
    entity.show();

    BadgeRenderer(data.badge).css("margin", "auto").appendTo(entity.$display);

    Badges.get(data.badge).then(function(data) {
        entity.$info.html(
            '<h1>Congratulations!</h1>' +
            '<p>You have received the badge <b>' + data.title + '</b></p>' +
            '<p>' + data.description + '</p>'
        );
    });
});
