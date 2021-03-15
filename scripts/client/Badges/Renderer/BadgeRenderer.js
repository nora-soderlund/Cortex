Client.badges.renderer = function(id) {
    const $element = $('<div></div>');

    const $canvas = $('<canvas></canvas>').appendTo($element);

    Client.assets.getSpritesheet("HabboBadges/" + id + ".gif", false).then(function(image) {
        const context = $canvas[0].getContext("2d");

        context.canvas.width = image.width;
        context.canvas.height = image.height;

        context.drawImage(image, 0, 0);
    });

    Client.badges.get(id).then(function() {

    });

    return $element;
};
