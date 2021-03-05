Client.rooms.items.map = function(parent, map = "", door = {}) {
    const entity = new Client.rooms.items.entity(parent, "map");

    entity.index = 0;

    entity.map = new Client.rooms.map.entity(map, door);

    entity.render = async function() {
        await entity.map.render();

        entity.parent.center = entity.map.rows * 32;

        const floor = new Client.rooms.items.sprite(entity, entity.map.$floor[0]);

        floor.index = 0;
        
        floor.setOffset(-entity.parent.center, -(entity.map.depth * 16));

        floor.mouseover = function(position, center) {
            const context = entity.parent.$canvas[0].getContext("2d");

            context.setTransform(1, .5, -1, .5, entity.map.rows * 32 - center, 0);

            for(let path = entity.map.floor.length - 1; path != -1; path--) {
                if(!context.isPointInPath(entity.map.floor[path].path, position[0], position[1]))
                    continue;

                return entity.map.floor[path];
            }

            return false;
        };

        entity.sprites.push(floor);

        const $shadowCanvas = $('<canvas width="' + floor.image.width + '" height="' + (floor.image.height + 10) + '"></canvas>');
        const shadowCanvas = $shadowCanvas[0].getContext("2d");
        
        if(shadowCanvas.filter != undefined) {
            shadowCanvas.filter = "blur(10px) brightness(0%) opacity(50%)";
            shadowCanvas.drawImage(floor.image, 0, 10);

            shadowCanvas.filter = "blur(0) brightness(100%) opacity(100%)";
            shadowCanvas.drawImage(floor.image, 0, 0);

            const shadow = new Client.rooms.items.sprite(entity, shadowCanvas.canvas);

            shadow.index = -1000;
            
            shadow.setOffset(-entity.parent.center, -(entity.map.depth * 16));

            shadow.mouseover = function(position) {
                return false;
            };

            entity.sprites.push(shadow);
        }

        

        const wall = new Client.rooms.items.sprite(entity, entity.map.$wall[0]);

        wall.index = -2000;
        
        wall.setOffset(-entity.parent.center, entity.map.offset);

        wall.mouseover = function(position) {
            return false;
        };

        entity.sprites.push(wall);
    };

    return entity;
};
