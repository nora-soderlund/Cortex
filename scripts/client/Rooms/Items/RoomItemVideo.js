Client.rooms.items.video = function(parent, link, time) {
    const sprite = new Client.rooms.items.sprite(parent, new Image());

    sprite.image = $('<video muted="muted"></video>')[0];

    sprite.image.addEventListener("loadeddata", function() {
        Client.assets.getManifest("HabboFurnitureVideos").then(function(data) {
            sprite.visualization = data.visualization[parent.furniture.settings.id];

            if(sprite.visualization == undefined)
                return;

            sprite.image.currentTime = time;

            const $canvas = $('<canvas width="480" height="360"></canvas>');
            const canvas = $canvas[0].getContext("2d");

            sprite.width = 139;

            sprite.render = function(context, room) {
                if(sprite.image.paused)
                    return;

                const direction = sprite.visualization.directions[parent.furniture.settings.direction];

                if(direction == undefined)
                    return;

                canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
                
                if(parent.furniture.settings.direction == 4)
                    canvas.setTransform(1, .5, 0, 1, 0, 0);
                else if(parent.furniture.settings.direction == 2)
                    canvas.setTransform(1, -.5, 0, 1, 0, sprite.visualization.width / 16 * 9);

                canvas.drawImage(sprite.image,
                    0, 0, sprite.image.videoWidth, sprite.image.videoHeight,
                    0, 0, sprite.visualization.width, sprite.visualization.width / 16 * 9);

                context.globalAlpha = sprite.getAlpha();

                context.globalCompositeOperation = sprite.composite;

                const offset = sprite.getOffset();

                context.drawImage($canvas[0], Math.floor(room[0] + offset[0]) + direction.left, Math.floor(room[1] + offset[1]) + direction.top);
            };

            sprite.image.play();
        });
    });

    sprite.image.src = link;
    
    return sprite;
};
