Client.rooms.map.entity = function(map, door = {}, floor = {}, wall = {}) {
    this.settings = {
        map: map,

        door: {
            row: null,
            column: null
        },
        
        floor: {
            material: "default",

            thickness: 8
        },
        
        wall: {
            material: "default",

            thickness: 8
        }
    };

    this.render = async function() {
        this.rows = this.settings.map.length;
        this.columns = 0;
        this.depth = 0;

        for(let row in this.settings.map)
            if(this.settings.map[row].length > this.columns)
                this.columns = this.settings.map[row].length;

        this.map = {};

        for(let row in this.settings.map) {
            this.map[row] = {};

            for(let column in this.settings.map[row]) {
                this.map[row][column] = this.settings.map[row][column];

                if(this.map[row][column] == 'X')
                    continue;

                if(!Client.utils.isLetter(this.map[row][column]))
                    this.map[row][column] = parseInt(this.map[row][column]);
                else
                    this.map[row][column] = Client.utils.fromCharCode(this.map[row][column]);

                if(this.map[row][column] > this.depth)
                    this.depth = this.map[row][column];
            }
        }

        if(this.getCoordinate(door.row + 1, door.column) == 'X' && this.getCoordinate(door.row - 1, door.column) == 'X')
            this.settings.door = door;

        await this.renderFloor();
        await this.renderWall();
    };

    this.renderPatterns = async function(type, id) {
        const index         = Client.rooms.map.getIndex(type, id);
        const sizes         = Client.rooms.map.getSizes(type, index);
        const visualization = Client.rooms.map.getVisualization(sizes, 64);
        const material      = Client.rooms.map.getMaterial(type, visualization.materialId);
        const texture       = Client.rooms.map.getTexture(type, material.materialCell.textureId);

        let canvas, context, patterns = [];

        canvas = await Client.assets.getSpriteColor("HabboRoomContent", texture, visualization.color);
        context = canvas.getContext("2d");
        patterns[0] = context.createPattern(canvas, "repeat");

        canvas = await Client.assets.getSpriteColor("HabboRoomContent", texture + "?color=" + visualization.color, "#666");
        context = canvas.getContext("2d");
        patterns[1] = context.createPattern(canvas, "repeat");

        canvas = await Client.assets.getSpriteColor("HabboRoomContent", texture + "?color=" + visualization.color, "#BBB");
        context = canvas.getContext("2d");
        patterns[2] = context.createPattern(canvas, "repeat");

        return patterns;
    };

    this.renderFloor = async function() {
        const patterns = await this.renderPatterns("floor", this.settings.floor.material);
        
        const context = this.$floor[0].getContext("2d");

        // TODO: check if the +10 is actually needed
        
        context.canvas.width = (this.rows * 32) + (this.columns * 32);
        context.canvas.height = (this.rows * 16) + (this.columns * 16) + this.settings.floor.thickness + (this.depth * 16) + 10;

        const rectangles = [];

        for(let row in this.map) {
            for(let column in this.map[row]) {
                const tile = this.getCoordinate(row, column);
    
                if(tile == 'X')
                    continue;

                if(this.getCoordinate(row, parseInt(column) - 1) == tile + 1) {
                    for(let step = 0; step < 4; step++) {
                        rectangles.push({
                            row,
                            column: parseInt(column) + (step * .25),
                            depth: tile + 0.75 - (step * .25),
        
                            width: 8, height: 32
                        });
                    }

                    continue;
                }

                if(this.getCoordinate(parseInt(row) - 1, column) == tile + 1) {
                    for(let step = 0; step < 4; step++) {
                        rectangles.push({
                            row: parseInt(row) + (step * .25),
                            column,
                            depth: tile + 0.75 - (step * .25),
        
                            width: 32, height: 8
                        });
                    }

                    continue;
                }

                rectangles.push({
                    row, column, depth: tile,

                    width: 32, height: 32
                });
            }
        }

        context.beginPath();

        context.setTransform(1, .5, 0, 1, this.rows * 32, this.depth * 16);
                
        context.fillStyle = patterns[1];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            if(rectangles.find(x => (parseInt(x.row) == parseInt(rectangle.row) + 1 && x.column == rectangle.column && x.depth == rectangle.depth)) != null)
                continue;

            const left = (rectangle.column * 32) - (rectangle.row * 32) - rectangle.height;
            const top = (rectangle.row * 32) - (rectangle.depth * 32) + rectangle.height;

            context.rect(left, top, rectangle.width, this.settings.floor.thickness);
        }

        context.fill();

        context.beginPath();

        context.setTransform(1, -.5, 0, 1, this.rows * 32, this.depth * 16);
                
        context.fillStyle = patterns[2];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            if(rectangles.find(x => (x.row == rectangle.row && parseInt(x.column) == parseInt(rectangle.column) + 1 && x.depth == rectangle.depth)) != null)
                continue;

            const row = parseFloat(rectangle.row);

            const column = parseFloat(rectangle.column);

            const left = -(row * 32) + (column * 32) + rectangle.width - rectangle.height;
            const top = (column * 32) - (rectangle.depth * 32) + rectangle.width;

            context.rect(left, top, rectangle.height, this.settings.floor.thickness);
        }

        context.fill();

        context.beginPath();

        context.setTransform(1, .5, -1, .5, this.rows * 32, this.depth * 16);
                
        context.fillStyle = patterns[0];

        const tiles = new Path2D();

        this.floor = [];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            const left = rectangle.column * 32 - (rectangle.depth * 32);
            const top = rectangle.row * 32 - (rectangle.depth * 32);

            const path = new Path2D();

            path.rect(left, top, rectangle.width, rectangle.height);

            this.floor.push({ row: rectangle.row, column: rectangle.column, depth: rectangle.depth, path });
            
            tiles.addPath(path);
        }

        context.fill(tiles);

        console.log(this);
    };

    this.renderWall = async function() {
        const patterns = await this.renderPatterns("wall", this.settings.wall.material);
        
        const context = this.$wall[0].getContext("2d");

        context.canvas.width = (this.rows * 32) + (this.columns * 32) + (2 * this.settings.floor.thickness);
        context.canvas.height = (this.rows * 16) + (this.columns * 16) + (this.depth * 16) + this.settings.floor.thickness;

        const rectangles = [];

        for(let row in this.map) {
            for(let column in this.map[row]) {
                const depth = this.getCoordinate(row, column, true);

                if(depth == 'X') 
                    continue;

                if(this.settings.door.row == row && this.settings.door.column == column)
                    continue;

                let hasPrevious = false;

                for(let previousRow = row - 1; previousRow >= 0; previousRow--) {
                    if(this.getCoordinate(previousRow, column, true) == 'X') {
                        for(let previousColumn = column - 1; previousColumn >= 0; previousColumn--) {
                            if(this.getCoordinate(previousRow, previousColumn, true) == 'X')
                                continue;
        
                            hasPrevious = true;
        
                            break;
                        }

                        if(hasPrevious)
                            break;

                        continue;
                    }

                    hasPrevious = true;

                    break;
                }

                if(hasPrevious)
                    continue;

                rectangles.push({ row: parseInt(row), column: parseInt(column), depth, direction: 4 });
            }
        }

        for(let row in this.map) {
            for(let column in this.map[row]) {
                const depth = this.getCoordinate(row, column, true);

                if(depth == 'X')
                    continue;

                let hasPrevious = false;

                for(let previousColumn = column - 1; previousColumn >= 0; previousColumn--) {
                    if(this.getCoordinate(row, previousColumn, true) != 'X') {
                        hasPrevious = true;

                        break;
                    }

                    for(let previousRow = row - 1; previousRow >= 0; previousRow--) {
                        if(this.getCoordinate(previousRow, previousColumn, true) != 'X') {
                            hasPrevious = true;
    
                            break;
                        }
                    }
                }

                if(hasPrevious)
                    continue;

                rectangles.push({ row: parseInt(row), column: parseInt(column), depth, direction: 2 });
            }
        }

        const rectanglesLeft = rectangles.filter(x => x.direction == 4);

        for(let index in rectanglesLeft) {
            const rectangle = rectanglesLeft[index];

            if(rectangles.find(x => (x.direction == 2 && x.row == rectangle.row && x.column == rectangle.column)) == null)
                continue;

            rectangles.push({ row: rectangle.row, column: rectangle.column, depth: rectangle.depth, direction: 1 });
        }

        this.offset = -((this.depth + 3.5) * 32);

        context.beginPath();
        context.setTransform(1, -.5, 0, 1, this.rows * 32, this.depth * 16);
        context.fillStyle = patterns[1];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            let width = 32;
            let height = ((3.5 + (this.depth - rectangle.depth)) * 32);

            let row = rectangle.row;
            let column = rectangle.column;

            if(rectangle.direction == 4) {
                column++;
                
                if(this.getCoordinate(row, column) != 'X')
                    continue;

                width = this.settings.wall.thickness;
                height += this.settings.floor.thickness;
            }
            else if(rectangle.direction == 2) {
                row++;
            }
            else
                continue;

            const left = -(row * 32) + (column * 32);
            const top = (column * 32) - (this.depth * 16);
            
            context.rect(left, top, width, height);
        }

        context.fill();
        context.closePath();

        context.beginPath();
        context.setTransform(1, .5, 0, 1, this.rows * 32, this.depth * 16);        
        context.fillStyle = patterns[2];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            let row = rectangle.row;
            let column = rectangle.column;  

            let width = 32;
            let height = ((3.5 + (this.depth - rectangle.depth)) * 32);

            if(rectangle.direction == 4) {

            }
            else if(rectangle.direction == 2) {
                row++;
                
                if(this.getCoordinate(row, column) != 'X')
                    continue;

                width = this.settings.wall.thickness;
                height += this.settings.floor.thickness;
            }
            else
                continue;

            let left = (column * 32) - (row * 32);
            let top = (row * 32) - (this.depth * 16);
            
            context.rect(left - ((width == 32)?(0):(this.settings.wall.thickness)), top, width, height);
        }

        context.fill();
        context.closePath();

        context.beginPath();
        context.setTransform(1, .5, -1, .5, this.rows * 32, this.depth * 16);     
        context.fillStyle = patterns[0];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            let row = rectangle.row;
            let column = rectangle.column;  

            let width = 32;
            let height = 32;

            let left = column * 32 - (this.depth * 16);
            let top = row * 32 - (this.depth * 16);
           
            if(rectangle.direction == 1) {
                width = this.settings.wall.thickness;
                height = this.settings.wall.thickness;

                left -= this.settings.wall.thickness;
                top -= this.settings.wall.thickness;
            }
            else if(rectangle.direction == 2) {
                width = this.settings.wall.thickness;

                left -= this.settings.wall.thickness;
            }
            else if(rectangle.direction == 4) {
                height = this.settings.wall.thickness;

                top -= this.settings.wall.thickness;
            }
            else
                continue;

            context.rect(left, top, width, height);
        }

        context.fill();
        context.closePath();

        if(this.settings.door.row != null && this.settings.door.column != null) {
            const mask = Client.rooms.map.getMask("door_64");

            const sprite = await Client.assets.getSprite("HabboRoomContent", "HabboRoomContent_" + mask.asset.name);

            context.globalCompositeOperation = "destination-out";

            context.setTransform(1, -.5, 0, 1, this.rows * 32, this.depth * 16);

            const left = -(this.settings.door.row * 32) + (this.settings.door.column * 32);
            const top = (this.settings.door.column * 32) - ((this.settings.door.depth - 3.5) * 16);
            
            context.drawImage(sprite, left, top);
        }
    };

    this.getCoordinate = function(row, column, door = false) {
        if(door && this.settings.door.row == row && this.settings.door.column == column) {
            if(this.getCoordinate(row + 1, column) == 'X')
                return 'X';
        }
            
        if(this.map[row] == undefined || this.map[row][column] == undefined)
            return 'X';

        return this.map[row][column];
    };

    for(let key in floor)
        this.settings.floor[key] = floor[key];

    this.$floor = $('<canvas></canvas>');

    for(let key in wall)
        this.settings.wall[key] = wall[key];

    this.$wall = $('<canvas></canvas>');
};
