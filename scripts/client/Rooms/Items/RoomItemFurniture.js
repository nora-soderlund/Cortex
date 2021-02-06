Client.rooms.items.furniture = function(parent, name, direction) {
    const entity = new Client.rooms.items.entity(parent, "furniture");

    entity.render = async function() {
        const loading = await Client.assets.getManifest("HabboRoomFurniture");

        await Client.assets.getSprite("HabboRoomFurniture", "default").then(async function(data) {
            const boxSprite = new Client.rooms.items.sprite(entity, data);
                
            boxSprite.setOffset(loading.visualization["default"].offset.left, loading.visualization["default"].offset.top);
        
            entity.sprites.push(boxSprite);

            await Client.assets.get(name).then(async function(asset) {
                entity.furniture = new Client.furnitures.entity(name, asset);
            
                entity.furniture.events.render.push(function(sprites) {
                    entity.sprites.length = 0;

                    for(let index in sprites) {
                        let sprite = new Client.rooms.items.sprite(entity, sprites[index].image);
    
                        sprite.setOffset(64 + sprites[index].left, 16 + sprites[index].top);
    
                        sprite.index = parseInt(sprites[index].index);
                        
                        entity.sprites.push(sprite);
                    }
                });
            });

            entity.furniture.direction = direction;

            entity.furniture.render();
        }); 
    };

    return entity;
};
