Client.rooms.items.furniture = function(parent, name, direction) {
    const entity = new Client.rooms.items.entity(parent, "furniture");
    
    entity.furniture = new Client.furnitures.entity(name, {
        direction
    });

    entity.render = async function() {
        entity.furniture.events.render.push(function(sprites) {
            entity.sprites.length = 0;

            for(let index in sprites) {
                let sprite = new Client.rooms.items.sprite(entity, sprites[index].image);

                sprite.setOffset(64 + sprites[index].left, 16 + sprites[index].top);

                //sprite.index = parseInt(sprites[index].index);

                sprite.index = parseInt(sprites[index].index);
               
                console.log(sprite.index);

                entity.sprites.push(sprite);
            }
        });

        entity.furniture.render();
    };

    return entity;
};
