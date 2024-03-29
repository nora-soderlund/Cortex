Client.rooms.items.figure = function(parent, figure, direction) {
    const entity = new Client.rooms.items.entity(parent, "figure");

    entity.render = async function() {
        entity.figure = new FigureEntity(figure, { direction });

        entity.figure.events.render.push(function(sprites) {
            entity.sprites.length = 0;

            for(let index in sprites) {
                let sprite = new Client.rooms.items.sprite(entity, sprites[index].image);

                if(sprites[index].imageData != undefined) {
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
                }

                sprite.mouseclick = function(event) {
                    
                };

                sprite.setOffset(sprites[index].left - 64, sprites[index].top - (128 + 32) + 8);

                sprite.index = sprites[index].index;
                sprite.composite = (sprites[index].composite == undefined)?("source-over"):(sprites[index].composite);
                
                entity.sprites.push(sprite);
            }
        });


        entity.figure.process().then(function() {
            entity.figure.render();
        });
    };

    entity.events.path.start.push(async function() {
        if(!entity.data.walk)
            return;

        await entity.figure.setAction("Move");

        await entity.figure.render();
    });

    entity.events.path.frame.push(async function(frame) {
        /*if(!entity.data.walk)
            return;

        newFrame = Math.floor(frame / 2);

        if(entity.figure.frames["Move"] != newFrame) {
            entity.figure.frames["Move"] = newFrame;

            await entity.figure.render();
        }*/
    });

    entity.events.path.finish.push(async function() {
        if(!entity.data.walk)
            return;
            
        await entity.figure.removeAction("Move");

        await entity.figure.render();
    });
    
    entity.process = function(timestamp, frame) {
        entity.updatePath(frame);

        if(entity.figure.updateActions())
            entity.figure.render();
    };

    return entity;
};
