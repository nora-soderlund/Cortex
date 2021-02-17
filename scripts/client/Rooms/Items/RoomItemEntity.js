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
        this.data.position = position;

        this.offset = [ Math.floor(-(position.row * 32) + (position.column * 32) - 64), Math.floor((position.column * 16) + (position.row * 16) - (position.depth * 32)) ];

        this.index = (position.row * 1250) + (position.column * 1250) + (position.depth * 500) + index;
    };

    this.setCoordinates = function(row, column, depth, index = 0) {
        this.data.position = { row, column, depth };

        //this.offset = [ Math.floor(-(row * 32) + (column * 32)), Math.floor((column * 16) + (row * 16) - (depth * 16)) ];

        this.offset = [ Math.floor(-(row * 32) + (column * 32) - 64), Math.floor((column * 16) + (row * 16) - (depth * 32)) ];

        //this.index = ((row + column + Math.trunc(index / 1250)) * 500) + depth;

        this.index = (row * 1250) + (column * 1250) + (depth * 500) + index;
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
