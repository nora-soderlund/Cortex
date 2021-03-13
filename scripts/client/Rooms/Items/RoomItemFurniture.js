Client.rooms.items.furniture = function(parent, id, direction) {
    const entity = new Client.rooms.items.entity(parent, "furniture");

    const loading = Client.assets.getSpritesheet("HabboLoading").then(function(image) {
        const sprite = new Client.rooms.items.sprite(entity, image);

        sprite.setOffset(32, -32);

        entity.sprites.push(sprite);
    });
    
    entity.furniture = new Client.furnitures.entity({ id, direction });

    entity.render = async function() {
        entity.furniture.events.render.push(function(sprites) {
            entity.sprites.length = 0;

            for(let index in sprites) {
                const layer = sprites[index];

                const sprite = new Client.rooms.items.sprite(entity, layer.sprite);

                sprite.composite = layer.ink;
                sprite.alpha = layer.alpha;

                sprite.tag = layer.tag;

                sprite.mouseover = function(position) {
                    if(layer.ignoreMouse == 1)
                        return false;
                        
                    const entityOffset = sprite.parent.getOffset();
                   
                    const offset = [
                        Math.floor(position[0] - (entityOffset[0] + sprite.offset[0])),
                        Math.floor(position[1] - (entityOffset[1] + sprite.offset[1]))
                    ];

                    if(offset[0] < 0 || offset[1] < 0)
                        return false;

                    if(offset[0] > layer.sprite.width || offset[1] > layer.sprite.height)
                        return false;

                    const pixel = ((offset[0] + offset[1] * layer.spriteData.width) * 4) + 3;

                    if(layer.spriteData.data[pixel] < 50)
                        return false;

                    return true;
                };

                sprite.mouseclick = function(event) {
                    if(Client.keys.down["ControlLeft"])
                        Client.rooms.interface.furniture.pickup.start(entity);
                    else if(Client.keys.down["AltLeft"])
                        Client.rooms.interface.furniture.move.start(entity);
                    else if(Client.keys.down["ShiftLeft"])
                        Client.rooms.interface.furniture.rotate.start(entity);
                };

                sprite.mousedown = function(event) {
                    if(Client.keys.down["ControlLeft"])
                        Client.rooms.interface.furniture.pickup.start(entity);
                };

                sprite.mousedoubleclick = function(event) {
                    Client.rooms.interface.furniture.use.start(entity, sprite);
                };

                sprite.setOffset(64 - sprites[index].asset.x, 16 - sprites[index].asset.y);

                //sprite.index = parseInt(sprites[index].index);

                sprite.index = parseInt(sprites[index].z);

                entity.sprites.push(sprite);
            }
        
            if(entity.video != undefined)
                entity.sprites.push(entity.video);
        });

        await entity.furniture.process();
        
        await entity.furniture.render();
    };

    entity.process = function(timestamp, frame) {
        entity.updatePath(frame);

        if(entity.furniture.updateAnimations(timestamp))
            entity.furniture.render();
    };

    return entity;
};
