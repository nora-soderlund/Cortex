SocketMessages.register("OnAchievementUnlocked", function(data) {
    const entity = new DisplayDialog({
        title: "Achievement Unlocked"
    });
    
    entity.show();

    (new BadgeRenderer(data.badge)).css("margin", "auto").appendTo(entity.$display);

    Badges.get(data.badge).then(function(data) {
        entity.$info.html(
            '<h1>Congratulations!</h1>' +
            '<p>You have received the badge <b>' + data.title + '</b></p>' +
            '<p>' + data.description + '</p>'
        );
    });
});
