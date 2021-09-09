SocketMessages.register("OnAchievementUnlocked", function(data) {
    const entity = new DisplayDialog({
        title: "Achievement Unlocked"
    });
    
    entity.show();

    const element = (new BadgeRenderer(data.badge));
    element.style.margin = "auto";
    entity.display.appendChild(element);

    Badges.get(data.badge).then(function(data) {
        entity.info.innerHTML = `
            <h1>Congratulations!</h1>
            <p>You have received the badge <b>${data.title}</b></p>
            <p>${data.description}</p>
        `;
    });
});
