Client.rooms.items.map = function(parent, map = "", door = {}, floor = {}, wall = {}) {
    const entity = new Client.rooms.items.entity(parent, "map");

    entity.index = -100000;

    entity.map = new Client.rooms.map.entity(map, door, floor, wall);

    entity.render = async function() {
        await entity.map.render();

        entity.parent.center = entity.map.settings.wall.thickness + entity.map.rows * 32;

        const floor = new Client.rooms.items.sprite(entity, entity.map.floorCanvas);

        floor.index = 0;
        
        floor.setOffset(-entity.parent.center, -(entity.map.depth * 16));

        floor.mouseover = function(position, center) {
            const context = entity.parent.canvas.getContext("2d");

            context.setTransform(1, .5, -1, .5, entity.map.rows * 32 - center, 0);

            for(let path = entity.map.floor.length - 1; path != -1; path--) {
                if(!context.isPointInPath(entity.map.floor[path].path, position[0], position[1]))
                    continue;

                return entity.map.floor[path];
            }

            return false;
        };

        entity.sprites.push(floor);

        const shadowCanvas = document.createElement("canvas");
        shadowCanvas.width = floor.image.width;
        shadowCanvas.height = floor.image.height + 10;
        const shadowContext = shadowCanvas.getContext("2d");
        
        if(shadowContext.filter != undefined) {
            shadowContext.filter = "blur(10px) brightness(0%) opacity(50%)";
            shadowContext.drawImage(floor.image, 0, 10);

            shadowContext.filter = "blur(0) brightness(100%) opacity(100%)";
            shadowContext.drawImage(floor.image, 0, 0);

            const shadow = new Client.rooms.items.sprite(entity, shadowContext.canvas);

            shadow.index = -1000;
            
            shadow.setOffset(-entity.parent.center, -(entity.map.depth * 16));

            shadow.mouseover = function(position) {
                return false;
            };

            entity.sprites.push(shadow);
        }

        

        const wall = new Client.rooms.items.sprite(entity, entity.map.wallCanvas);

        wall.index = -2000;
        
        wall.setOffset(-entity.parent.center, entity.map.offset);

        wall.mouseover = function(position) {
            return false;
        };

        entity.sprites.push(wall);
    };

    return entity;
};
