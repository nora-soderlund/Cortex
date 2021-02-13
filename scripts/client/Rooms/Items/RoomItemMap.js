Client.rooms.items.map = function(parent, map = "", floorMaterial = "default", floorThickness = 8) {
    const entity = new Client.rooms.items.entity(parent, "map");

    entity.index = -4000;

    entity.map = new Client.rooms.map({ map, floorMaterial, floorThickness });

    entity.render = async function() {
        await entity.map.render();

        entity.sprites.length = 0;

        entity.parent.center = entity.map.floor.rows * 32;



        const floor = new Client.rooms.items.sprite(entity, entity.map.$floor[0]);

        floor.index = 2;
        
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

        const $shadowCanvas = $('<canvas width="' + floor.image.width + '" height="' + (floor.image.height + 10) + '"></canvas>');
        const shadowCanvas = $shadowCanvas[0].getContext("2d");

        shadowCanvas.filter = "blur(10px) brightness(0%) opacity(50%)";
        shadowCanvas.drawImage(floor.image, 0, 10);

        shadowCanvas.filter = "blur(0) brightness(100%) opacity(100%)";
        shadowCanvas.drawImage(floor.image, 0, 0);

        const shadow = new Client.rooms.items.sprite(entity, shadowCanvas.canvas);

        shadow.index = 0;
        
        shadow.setOffset(-entity.parent.center, -(entity.map.floor.depth * 16));

        shadow.mouseover = function(position) {
            return false;
        };

        entity.sprites.push(shadow);

        

        const wall = new Client.rooms.items.sprite(entity, entity.map.$wall[0]);

        wall.index = 1;
        
        wall.setOffset(-entity.parent.center, entity.map.wall.top);

        wall.mouseover = function(position) {
            return false;
        };

        entity.sprites.push(wall);
    };

    return entity;
};