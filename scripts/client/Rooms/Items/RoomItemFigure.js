Client.rooms.items.figure = function(parent, figure, direction) {
    const entity = new Client.rooms.items.entity(parent, "figure");

    entity.render = async function() {
        entity.figure = new Client.figures.entity(figure, { direction });

        entity.figure.events.render.push(function(sprites) {
            entity.sprites.length = 0;

            for(let index in sprites) {
                let sprite = new Client.rooms.items.sprite(entity, sprites[index].image);

                sprite.mouseover = function(position) {
                    const entityOffset = sprite.parent.getOffset();
                   
                    const offset = [
                        Math.floor(position[0] - (entityOffset[0] + sprite.offset[0])),
                        Math.floor(position[1] - (entityOffset[1] + sprite.offset[1]))
                    ];

                    if(offset[0] < 0 || offset[1] < 0)
                        return false;

                    if(offset[0] > sprites[index].image.width || offset[1] > sprites[index].image.height)
                        return false;

                    const pixel = ((offset[0] + offset[1] * sprites[index].imageData.width) * 4) + 3;

                    if(sprites[index].imageData.data[pixel] < 50)
                        return false;

                    return true;
                };

                sprite.mouseclick = function(event) {
                    Client.rooms.interface.chat.addMessage("info", entity.data.name + " (" + entity.data.id + ") was clicked on!");
                };

                sprite.setOffset(sprites[index].left - 64, sprites[index].top - (128 + 32) + 8);

                sprite.index = sprites[index].index;
                
                entity.sprites.push(sprite);
            }
        });


        entity.figure.process().then(function() {
            entity.figure.render();
        });
    };

    entity.events.path.start.push(async function() {
        await entity.figure.setAction("Move");

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
