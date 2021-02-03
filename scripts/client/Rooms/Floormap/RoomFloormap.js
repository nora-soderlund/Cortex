Client.rooms.floormap = function() {
    this.$canvas = $('<canvas></canvas>');

    this.floorDepth = 0;
    this.floorThickness = 8;
    this.floorPatterns = [];
    this.floorPaths = [];

    this.getCoordinate = function(row, column) {
        if(this.map[row] == undefined || this.map[row][column] == undefined)
            return 'X';

        return this.map[row][column];
    };

    this.getCanvasSize = function() {
        return [
            (this.rows * 32) + (this.columns * 32),
            (this.rows * 16) + (this.columns * 16) + this.floorThickness + (this.floorDepth * 16)
        ];
    };

    this.setMap = function(map) {
        map = map.split('|');

        this.rows = map.length;
        this.columns = map[0].length;

        this.map = {};

        for(let row in map) {
            this.map[row] = {};

            for(let column in map[row]) {
                this.map[row][column] = map[row][column];

                if(this.map[row][column] == 'X')
                    continue;

                if(!Client.utils.isLetter(this.map[row][column]))
                    this.map[row][column] = parseInt(this.map[row][column]);
                else
                    this.map[row][column] = Client.utils.fromCharCode(this.map[row][column]);

                if(this.map[row][column] > this.floorDepth)
                    this.floorDepth = this.map[row][column];
            }
        }

        const size = this.getCanvasSize();
   
        this.$canvas.attr({
            "width": size[0],
            "height": size[1]
        });
    };

    this.setFloor = async function(floor) {
        const index = Client.rooms.floormap.floor.getFloorIndex(floor);

        const sizes = Client.rooms.floormap.floor.getFloorSizes(index);

        const visualization = Client.rooms.floormap.floor.getFloorVisualization(sizes, 64);

        const material = Client.rooms.floormap.floor.getFloorMaterial(visualization.materialId);

        const texture = Client.rooms.floormap.floor.getFloorTexture(material.materialCell.textureId);

        let canvas, context;

        canvas = await Client.assets.getSpriteColor("HabboRoomContent", texture, visualization.color);

        context = canvas.getContext("2d");

        this.floorPatterns[0] = context.createPattern(canvas, "repeat");

        canvas = await Client.assets.getSpriteColor("HabboRoomContent", texture + "?color=" + visualization.color, "#666");

        context = canvas.getContext("2d");

        this.floorPatterns[1] = context.createPattern(canvas, "repeat");

        canvas = await Client.assets.getSpriteColor("HabboRoomContent", texture + "?color=" + visualization.color, "#BBB");

        context = canvas.getContext("2d");

        this.floorPatterns[2] = context.createPattern(canvas, "repeat");
    };

    this.setFloorThickness = function(floorThickness) {
        this.floorThickness = floorThickness;
    };

    this.render = function() {
        const timestamp = performance.now();

        const context = this.$canvas[0].getContext("2d");

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        this.renderTiles(context);

        console.warn("[RoomFloormap]%c Floormap render process took ~" + (Math.round((performance.now() - timestamp) * 100) / 100) + "ms!", "color: lightblue");
    };

    this.renderTiles = function(context) {
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

        this.renderTileEdges(context, rectangles);

        context.beginPath();

        context.setTransform(1, .5, -1, .5, this.rows * 32, this.floorDepth * 16);
                
        context.fillStyle = this.floorPatterns[0];

        const tiles = new Path2D();

        this.floorPaths = [];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            const left = rectangle.column * 32 - (rectangle.depth * 32);
            const top = rectangle.row * 32 - (rectangle.depth * 32);

            const path = new Path2D();

            path.rect(left, top, rectangle.width, rectangle.height);

            this.floorPaths.push({ row: rectangle.row, column: rectangle.column, depth: rectangle.depth, path });
            
            tiles.addPath(path);
        }

        context.fill(tiles);
    };

    this.renderTileEdges = function(context, rectangles) {
        context.beginPath();

        context.setTransform(1, .5, 0, 1, this.rows * 32, this.floorDepth * 16);
                
        context.fillStyle = this.floorPatterns[1];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            //const nextTile = this.getCoordinate(parseInt(rectangle.row) + 1, rectangle.column);

            //if(nextTile != 'X' && nextTile == rectangle.depth)
                //continue;

            if(rectangles.find(x => (parseInt(x.row) == parseInt(rectangle.row) + 1 && x.column == rectangle.column && x.depth == rectangle.depth)) != null)
                continue;

            const left = (rectangle.column * 32) - (rectangle.row * 32) - rectangle.height;
            const top = (rectangle.row * 32) - (rectangle.depth * 32) + rectangle.height;

            context.rect(left, top, rectangle.width, this.floorThickness);
        }

        context.fill();

        context.beginPath();

        context.setTransform(1, -.5, 0, 1, this.rows * 32, this.floorDepth * 16);
                
        context.fillStyle = this.floorPatterns[2];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            if(rectangles.find(x => (x.row == rectangle.row && parseInt(x.column) == parseInt(rectangle.column) + 1 && x.depth == rectangle.depth)) != null)
                continue;

            const row = parseFloat(rectangle.row);

            const column = parseFloat(rectangle.column);

            const left = -(row * 32) + (column * 32) + rectangle.width - rectangle.height;
            const top = (column * 32) - (rectangle.depth * 32) + rectangle.width;

            context.rect(left, top, rectangle.height, this.floorThickness);
        }

        context.fill();
    };
};
