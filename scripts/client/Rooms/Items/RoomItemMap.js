Client.rooms.items.map = function(parent, map = "", floorMaterial = "default", floorThickness = 8) {
    const entity = new Client.rooms.items.entity(parent, "map");

    entity.index = -4000;

    entity.map = new Client.rooms.map({ map, floorMaterial, floorThickness });

    entity.render = async function() {
        await entity.map.render();

        entity.sprites.length = 0;

        entity.parent.center = entity.map.floor.rows * 32;



        const floor = new Client.rooms.items.sprite(entity, entity.map.$floor[0]);
        
        floor.setOffset(-entity.parent.center, -(entity.map.floor.depth * 16));

        floor.mouseover = function(position) {
            const context = entity.parent.$canvas[0].getContext("2d");

            context.setTransform(1, .5, -1, .5, entity.map.floor.rows * 32, 0);

            for(let path in entity.map.floor.floorPaths) {
                if(!context.isPointInPath(entity.map.floor.floorPaths[path].path, position[0], position[1]))
                    continue;

                return entity.map.floor.floorPaths[path];
            }

            return false;
        };

        entity.sprites.push(floor);

        

        const wall = new Client.rooms.items.sprite(entity, entity.map.$wall[0]);
        
        wall.setOffset(-entity.parent.center, entity.map.wall.top);

        wall.mouseover = function(position) {
            return false;
        };

        entity.sprites.push(wall);
    };

    return entity;
};
