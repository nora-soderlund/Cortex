Client.rooms.items.floormap = function(parent, map = "", floor = "default", floorThickness = 8) {
    const entity = new Client.rooms.items.entity(parent, "floormap");

    entity.index = -4000;

    entity.floormap = new Client.rooms.floormap();

    entity.render = async function() {
        await entity.floormap.setFloor(floor);

        entity.floormap.setFloorThickness(floorThickness);

        entity.floormap.setMap(map);

        await entity.floormap.render();

        entity.sprites.length = 0;

        entity.parent.center = entity.floormap.rows * 32;

        entity.parent.setOffset((entity.parent.$canvas.width() / 2) + -(entity.floormap.rows * 16) + -(entity.floormap.columns * 16), (entity.parent.$canvas.height() / 2) - (entity.floormap.floorDepth * 16) - (entity.floormap.rows * 8));

        const sprite = new Client.rooms.items.sprite(entity, entity.floormap.$canvas[0]);
        
        sprite.setOffset(-entity.parent.center, -(entity.floormap.floorDepth * 16));

        sprite.mouseover = function(position) {
            const context = entity.parent.$canvas[0].getContext("2d");

            context.setTransform(1, .5, -1, .5, entity.floormap.rows * 32, 0);

            for(let path in entity.floormap.floorPaths) {
                if(!context.isPointInPath(entity.floormap.floorPaths[path].path, position[0], position[1]))
                    continue;

                return entity.floormap.floorPaths[path];
            }

            return false;
        };

        entity.sprites.push(sprite);
    };

    return entity;
};
