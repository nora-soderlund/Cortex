Client.rooms.items.entity = function(parent, name) {
    this.events = new function() {
        this.path = {
            start: [],
            frame: [],
            finish: []
        };
    };

    this.parent = parent;

    this.name = name;
    
    this.index = 0;

    this.alpha = 1.0;

    this.sprites = [];

    this.data = {};

    this.offset = [ 0, 0 ];

    this.getOffset = function() {
        return [
            this.offset[0],
            this.offset[1]
        ];
    };

    this.path = false;

    this.setPath = function(from, to, ticks = 500) {
        this.path = true;

        this.pathFrame = 0;
        this.pathFrames = Math.floor((24 / 1000) * ticks);
        this.pathLastFrame = -1;

        this.pathTick = performance.now();
        this.pathTicks = ticks;

        this.pathFrom = from;
        this.pathTo = to;

        this.pathDifference = {
            row: to.row - from.row,
            column: to.column - from.column,
            depth: to.depth - from.depth
        };

        for(let index in this.events.path.start)
            this.events.path.start[index]();
    };

    this.stopPath = function(finish = true) {
        if(this.path == false)
            return;
            
        this.path = false;

        if(finish)
            this.setCoordinates(this.pathTo.row, this.pathTo.column, this.pathTo.depth);

        for(let index in this.events.path.finish)
            this.events.path.finish[index]();
    };

    this.updatePath = function(frame) {
        if(!this.path)
            return;

        const timestamp = performance.now();

        const tick = timestamp - this.pathTick;

        if(tick > this.pathTicks) {
            this.path = false;

            this.setCoordinates(this.pathTo.row, this.pathTo.column, this.pathTo.depth);

            for(let index in this.events.path.finish)
                this.events.path.finish[index]();

            return;
        }

        this.setCoordinates(
            this.pathFrom.row + ((this.pathDifference.row / this.pathTicks) * tick),
            this.pathFrom.column + ((this.pathDifference.column / this.pathTicks) * tick),
            this.pathFrom.depth + ((this.pathDifference.depth / this.pathTicks) * tick)
        );

        if(frame != this.pathLastFrame) {
            this.pathLastFrame = frame;

            this.pathFrame++;

            if(this.pathFrame == this.pathFrames)
                this.pathFrame = 0;

            for(let index in this.events.path.frame)
                this.events.path.frame[index](this.pathFrame);
        }
    };

    this.setPosition = function(position, index = 0) {
        this.setCoordinates(position.row, position.column, position.depth, index);
    };

    this.setCoordinates = function(row, column, depth, index = 0) {
        this.data.position = { row, column, depth };

        this.offset = [ Math.floor(-(row * 32) + (column * 32) - 64), Math.floor((column * 16) + (row * 16) - (depth * 32)) ];

        this.index = (Math.round(row) * 1000) + (Math.round(column) * 1000) + (depth * 100) + index;

        if(parent.door != undefined && parent.door.row == Math.round(row) && parent.door.column == Math.round(column))
            this.index = -102000 + index;
    };
    
    this.process = function(timestamp, frame) {
        this.updatePath(frame);
    };

    this.enabled = true;

    this.enable = function() {
        this.enabled = true;
    };

    this.disable = function() {
        this.enabled = false;
    };

    return this;
};
