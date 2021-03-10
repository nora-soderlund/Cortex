Client.rooms.items.video = function(parent, link) {
    const sprite = new Client.rooms.items.sprite(parent, new Image());

    sprite.image = $('<video muted="muted"></video>').css("display", "none").appendTo(Client.rooms.interface.$element)[0];

    sprite.image.addEventListener("loadeddata", function() {
        sprite.image.play();
    });

    sprite.image.src = link;

    const $canvas = $('<canvas width="480" height="360"></canvas>');
    const canvas = $canvas[0].getContext("2d");

    sprite.width = 139;

    canvas.setTransform(1, .5, 0, 1, 0, 0);

    sprite.render = function(context, room) {
        canvas.drawImage(sprite.image,
            0, 0, sprite.image.videoWidth, sprite.image.videoHeight,
            0, 0, sprite.width, sprite.width / 16 * 9);

        context.globalAlpha = sprite.getAlpha();

        context.globalCompositeOperation = sprite.composite;

        const offset = sprite.getOffset();

        context.drawImage($canvas[0], Math.floor(room[0] + offset[0]) - 4, Math.floor(room[1] + offset[1]) - 55);
    };
    
    return sprite;
};
