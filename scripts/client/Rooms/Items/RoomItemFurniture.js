Client.rooms.items.furniture = function(parent, name, direction) {
    const entity = new Client.rooms.items.entity(parent, "furniture");

    const loading = Client.assets.getSpritesheet("HabboLoading").then(function(image) {
        const sprite = new Client.rooms.items.sprite(entity, image);

        sprite.setOffset(32, -32);

        entity.sprites.push(sprite);
    });
    
    entity.furniture = new Client.furnitures.entity(name, {
        direction
    });

    entity.render = async function() {
        entity.furniture.events.render.push(function(sprites) {
            entity.sprites.length = 0;

            for(let index in sprites) {
                const sprite = new Client.rooms.items.sprite(entity, sprites[index].image);

                const layer = sprites[index].layer;

                sprite.composite = sprites[index].composite;

                const spriteData = sprites[index].imageData;

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

                    if(offset[0] > sprite.image.width || offset[1] > sprite.image.height)
                        return false;

                    const pixel = ((offset[0] + offset[1] * spriteData.width) * 4) + 3;

                    if(spriteData.data[pixel] < 50)
                        return false;

                    return true;
                };

                sprite.mouseclick = function(event) {
                    if(Client.keys.down["ShiftLeft"])
                        Client.rooms.interface.chat.addMessage("info", entity.furniture.name + " was clicked on to rotate!");
                    else if(Client.keys.down["ControlLeft"])
                        Client.rooms.interface.chat.addMessage("info", entity.furniture.name + " was clicked on to pick up!");
                    else if(Client.keys.down["AltLeft"])
                        Client.rooms.interface.chat.addMessage("info", entity.furniture.name + " was clicked on to move!");
                };

                sprite.setOffset(64 + sprites[index].left, 16 + sprites[index].top);

                //sprite.index = parseInt(sprites[index].index);

                sprite.index = parseInt(sprites[index].index);

                entity.sprites.push(sprite);
            }
        });

        entity.furniture.render();
    };

    return entity;
};
