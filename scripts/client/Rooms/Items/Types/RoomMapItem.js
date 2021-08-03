class RoomMapItem extends RoomItem {
    index = -100000;

    async constructorAsync(room, map = "", door = {}, floor = {}, wall = {}) {
        await super.constructorAsync(room, map = "", door = {}, floor = {}, wall = {});

        this.map = new Client.rooms.map.entity(map, door, floor, wall);

        this.render = async () => {
            await this.map.render();

            this.parent.center = this.map.settings.wall.thickness + this.map.rows * 32;

            const floor = new Client.rooms.items.sprite(this, this.map.$floor[0]);

            floor.index = 0;
            
            floor.setOffset(-this.parent.center, -(this.map.depth * 16));

            floor.mouseover = (position, center) => {
                const context = this.parent.$canvas[0].getContext("2d");

                context.setTransform(1, .5, -1, .5, this.map.rows * 32 - center, 0);

                for(let path = this.map.floor.length - 1; path != -1; path--) {
                    if(!context.isPointInPath(this.map.floor[path].path, position[0], position[1]))
                        continue;

                    return this.map.floor[path];
                }

                return false;
            };

            this.sprites.push(floor);

            const $shadowCanvas = $('<canvas width="' + floor.image.width + '" height="' + (floor.image.height + 10) + '"></canvas>');
            const shadowCanvas = $shadowCanvas[0].getContext("2d");
            
            if(shadowCanvas.filter != undefined) {
                shadowCanvas.filter = "blur(10px) brightness(0%) opacity(50%)";
                shadowCanvas.drawImage(floor.image, 0, 10);

                shadowCanvas.filter = "blur(0) brightness(100%) opacity(100%)";
                shadowCanvas.drawImage(floor.image, 0, 0);

                const shadow = new Client.rooms.items.sprite(this, shadowCanvas.canvas);

                shadow.index = -1000;
                
                shadow.setOffset(-this.parent.center, -(this.map.depth * 16));

                shadow.mouseover = (position) => {
                    return false;
                };

                this.sprites.push(shadow);
            }

            

            const wall = new Client.rooms.items.sprite(this, this.map.$wall[0]);

            wall.index = -2000;
            
            wall.setOffset(-this.parent.center, this.map.offset);

            wall.mouseover = (position) => {
                return false;
            };

            this.sprites.push(wall);
        };
    };
};
