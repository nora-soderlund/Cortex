SocketMessages.register("OnUserBadgeAdd", function(data) {
    const entity = new DisplayDialog({
        title: "Badge Unlocked"
    });
    
    entity.show();

    const renderer = BadgeRenderer(data.badge);    
    renderer.style.margin = "auto";
    entity.display.append(renderer);

    Badges.get(data.badge).then(function(data) {
        entity.info.innerHTML = `
            <h1>Congratulations!</h1>
            <p>You have received the badge <b>${data.title}</b></p>
            <p>${data.description}</p>'
        `;
    });
});
