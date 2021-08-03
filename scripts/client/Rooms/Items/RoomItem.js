class RoomItem extends Events {
    enabled = true;

    index = 0;

    alpha = 1.0;

    sprites = [];

    data = {};

    offset = { left: 0, top: 0 };

    //#region 

    constructor(room, ...args) {
        super();

        this.room = room;

        this.on("process", (timestamp, frame) => {
            this.updatePath(frame);
        });

        this.constructorAsync(room, ...args).then(() => {
            this.call("ready");
        });
    };

    async constructorAsync() {

    };

    //#endregion

    //#region 

    path = {
        enabled: false
    };

    setPath(from, to, ticks = 500) {
        this.path.enabled = true;

        this.path.frame = 0;
        this.path.frames = Math.floor((24 / 1000) * ticks);
        this.path.lastFrame = -1;

        this.path.tick = performance.now();
        this.path.ticks = ticks;

        this.path.from = from;
        this.path.to = to;

        this.path.difference = {
            row:    to.row      - from.row,
            column: to.column   - from.column,
            depth:  to.depth    - from.depth
        };
        
        this.call("path start");
    };

    updatePath(frame) {
        if(!this.path.enabled)
            return;

        const timestamp = performance.now();

        const tick = timestamp - this.path.tick;

        if(tick > this.path.ticks) {
            this.setCoordinates(this.path.to.row, this.path.to.column, this.path.to.depth);

            this.call("path finish");

            this.path = { enabled: false };

            return;
        }

        this.setCoordinates(
            this.path.from.row + ((this.path.difference.row / this.path.ticks) * tick),
            this.path.from.column + ((this.path.difference.column / this.path.ticks) * tick),
            this.path.from.depth + ((this.path.difference.depth / this.path.ticks) * tick)
        );

        if(frame != this.path.lastFrame) {
            this.path.lastFrame = frame;

            this.path.frame++;

            if(this.path.frame == this.path.frames)
                this.path.frame = 0;
                
            this.call("path", this.path.frame);
        }
    };

    stopPath(finish = true) {
        if(!this.path.enabled)
            return;

        if(finish)
            this.setCoordinates(this.path.to);
            
        this.call("path stop");
            
        this.path = { enabled: false };
    };

    //#endregion

    //#region 

    setPosition(position, index = 0) {
        this.setCoordinates(position.row, position.column, position.depth, index);
    };

    setCoordinates(row, column, depth, index = 0) {
        this.position = { row, column, depth };

        this.offset = {
            left: Math.floor(-(row * 32) + (column * 32) - 64),
            top: Math.floor((column * 16) + (row * 16) - (depth * 32))
        };

        this.index = (Math.round(row) * 1000) + (Math.round(column) * 1000) + (depth * 100) + index;

        if(this.room.door != undefined && this.room.door.row == Math.round(row) && this.room.door.column == Math.round(column))
            this.index = -102000 + index;
    };

    //#endregion
};
