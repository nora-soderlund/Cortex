Client.rooms.map.wall = function() {
    this.patterns = [];

    this.getCoordinate = function(row, column) {
        if(this.map[row] == undefined || this.map[row][column] == undefined)
            return 'X';

        return this.map[row][column];
    };

    this.setPatternAsync = async function(id) {
        const index         = Client.rooms.map.data.getIndex("wall", id);
        const sizes         = Client.rooms.map.data.getSizes("wall", index);
        const visualization = Client.rooms.map.data.getVisualization(sizes, 64);
        const material      = Client.rooms.map.data.getMaterial("wall", visualization.materialId);
        const texture       = Client.rooms.map.data.getTexture("wall", material.materialCell.textureId);

        let canvas, context;

        canvas = await Client.assets.getSpriteColor("HabboRoomContent", texture, visualization.color);
        context = canvas.getContext("2d");
        this.patterns[0] = context.createPattern(canvas, "repeat");

        canvas = await Client.assets.getSpriteColor("HabboRoomContent", texture + "?color=" + visualization.color, "#666");
        context = canvas.getContext("2d");
        this.patterns[1] = context.createPattern(canvas, "repeat");

        canvas = await Client.assets.getSpriteColor("HabboRoomContent", texture + "?color=" + visualization.color, "#BBB");
        context = canvas.getContext("2d");
        this.patterns[2] = context.createPattern(canvas, "repeat");
    };

    this.renderAsync = async function(context, settings) {
        for(let key in settings)
            this[key] = settings[key];

        await this.setPatternAsync(this.material);

        context.canvas.width = (this.rows * 32) + (this.columns * 32);
        context.canvas.height = (this.rows * 16) + (this.columns * 16) + (this.depth * 16);

        const rectangles = [];

        for(let row in this.map) {
            for(let column in this.map[row]) {
                const depth = this.getCoordinate(row, column);

                if(depth == 'X')
                    continue;

                let hasPrevious = false;

                for(let previousRow = row - 1; previousRow >= 0; previousRow--) {
                    if(this.getCoordinate(previousRow, column) == 'X') {
                        for(let previousColumn = column - 1; previousColumn >= 0; previousColumn--) {
                            if(this.getCoordinate(previousRow, previousColumn) == 'X')
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
                const depth = this.getCoordinate(row, column);

                if(depth == 'X')
                    continue;

                let hasPrevious = false;

                for(let previousColumn = column - 1; previousColumn >= 0; previousColumn--) {
                    if(this.getCoordinate(row, previousColumn) != 'X') {
                        hasPrevious = true;

                        break;
                    }
                }

                if(hasPrevious)
                    continue;

                rectangles.push({ row: parseInt(row), column: parseInt(column), depth, direction: 2 });
            }
        }

        this.draw(context, rectangles);
    };

    this.draw = function(context, rectangles) {
        this.top = -((this.depth + 3) * 32);

        this.drawLeft(context, rectangles);
        this.drawRight(context, rectangles);
    };

    this.drawLeft = function(context, rectangles) {
        context.beginPath();
        context.setTransform(1, -.5, 0, 1, this.rows * 32, this.depth * 16);
        context.fillStyle = this.patterns[1];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            let width = 32;
            let height = (this.depth + 3) * 32;

            let row = rectangle.row;
            let column = rectangle.column;

            if(rectangle.direction == 4) {
                column++;
                
                if(this.getCoordinate(row, column) != 'X')
                    continue;

                width = 8;
                height += this.floor;
            }
            else if(rectangle.direction == 2) {
                row++;
            }
            else
                continue;

            const left = -(row * 32) + (column * 32);
            const top = (column * 32) - (rectangle.depth * 32);
            
            context.rect(left, top, width, height);
        }

        context.fill();
        context.closePath();
    };

    this.drawRight = function(context, rectangles) {
        context.beginPath();
        context.setTransform(1, .5, 0, 1, this.rows * 32, this.depth * 16);        
        context.fillStyle = this.patterns[2];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            let row = rectangle.row;
            let column = rectangle.column;  

            let width = 32;
            let height = (this.depth + 3) * 32;

            if(rectangle.direction == 4) {

            }
            else if(rectangle.direction == 2) {
                row++;
                
                if(this.getCoordinate(row, column) != 'X')
                    continue;

                width = 8;
                height += this.floor;
            }
            else
                continue;

            let left = (column * 32) - (row * 32);
            let top = (row * 32) - (rectangle.depth * 32);
            
            context.rect(left - ((width == 32)?(0):(8)), top, width, height);
        }

        context.fill();
        context.closePath();
    };
};
