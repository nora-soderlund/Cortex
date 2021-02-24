Client.rooms.map.floor = function() {
    this.patterns = [];

    this.setMap = function(map) {
        this.rows = map.length;
        this.columns = 0;
        this.depth = 0;

        for(let row in map) {
            if(map[row].length > this.columns)
                this.columns = map[row].length;
        }

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

                if(this.map[row][column] > this.depth)
                    this.depth = this.map[row][column];
            }
        }
    };

    this.setPatternAsync = async function(id) {
        const index         = Client.rooms.map.data.getIndex("floor", id);
        const sizes         = Client.rooms.map.data.getSizes("floor", index);
        const visualization = Client.rooms.map.data.getVisualization(sizes, 64);
        const material      = Client.rooms.map.data.getMaterial("floor", visualization.materialId);
        const texture       = Client.rooms.map.data.getTexture("floor", material.materialCell.textureId);

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

    this.getCoordinate = function(row, column) {
        if(this.map[row] == undefined || this.map[row][column] == undefined)
            return 'X';

        return this.map[row][column];
    };

    this.renderAsync = async function(context, settings) {
        for(let key in settings)
            this[key] = settings[key];

        this.setMap(settings.map);

        await this.setPatternAsync(this.material);
   
        context.canvas.width = (this.rows * 32) + (this.columns * 32);
        context.canvas.height = (this.rows * 16) + (this.columns * 16) + this.thickness + (this.depth * 16) + 10;

        this.drawTiles(context);
    };

    this.drawTiles = function(context) {
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

        this.drawEdges(context, rectangles);

        context.beginPath();

        context.setTransform(1, .5, -1, .5, this.rows * 32, this.depth * 16);
                
        context.fillStyle = this.patterns[0];

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

    this.drawEdges = function(context, rectangles) {
        context.beginPath();

        context.setTransform(1, .5, 0, 1, this.rows * 32, this.depth * 16);
                
        context.fillStyle = this.patterns[1];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            if(rectangles.find(x => (parseInt(x.row) == parseInt(rectangle.row) + 1 && x.column == rectangle.column && x.depth == rectangle.depth)) != null)
                continue;

            const left = (rectangle.column * 32) - (rectangle.row * 32) - rectangle.height;
            const top = (rectangle.row * 32) - (rectangle.depth * 32) + rectangle.height;

            context.rect(left, top, rectangle.width, this.thickness);
        }

        context.fill();

        context.beginPath();

        context.setTransform(1, -.5, 0, 1, this.rows * 32, this.depth * 16);
                
        context.fillStyle = this.patterns[2];

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            if(rectangles.find(x => (x.row == rectangle.row && parseInt(x.column) == parseInt(rectangle.column) + 1 && x.depth == rectangle.depth)) != null)
                continue;

            const row = parseFloat(rectangle.row);

            const column = parseFloat(rectangle.column);

            const left = -(row * 32) + (column * 32) + rectangle.width - rectangle.height;
            const top = (column * 32) - (rectangle.depth * 32) + rectangle.width;

            context.rect(left, top, rectangle.height, this.thickness);
        }

        context.fill();
    };
};
