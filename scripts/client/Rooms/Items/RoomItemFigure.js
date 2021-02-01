Client.rooms.items.figure = function(parent, figure, direction) {
    const entity = new Client.rooms.items.entity(parent, "figure");

    entity.render = async function() {
        entity.figure = new Client.figures.entity(figure);

        entity.figure.direction = direction;

        entity.figure.events.render.push(function(sprites) {
            entity.sprites.length = 0;

            for(let index in sprites) {
                let sprite = new Client.rooms.items.sprite(entity, sprites[index].image);

                sprite.setOffset(sprites[index].left - 64, sprites[index].top - (128 + 32) + 8);

                sprite.index = sprites[index].index;
                
                entity.sprites.push(sprite);
            }
        });

        entity.figure.render();
    };

    entity.events.path.start.push(async function() {
        await entity.figure.addAction("Move");

        await entity.figure.render();
    });

    entity.events.path.frame.push(async function(frame) {
        //const newFrame = Math.floor((24 / 3) * frame);

        let newFrame = Math.floor(frame / 3);

        if(entity.figure.frames["Move"] != newFrame) {
            entity.figure.frames["Move"] = newFrame;

            await entity.figure.render();
        }
    });

    entity.events.path.finish.push(async function() {
        await entity.figure.removeAction("Move");

        await entity.figure.render();
    });

    return entity;
};
