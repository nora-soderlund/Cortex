class RoomEntity {
    constructor(parent) {
        this.parent = parent;

        const canvas = document.createElement("canvas");
        parent.append(canvas);

        this.canvas = new Canvas(canvas, { enabled: false });

        this.canvas.render = () => this.render();
    };
    
    background = "#111";

    center = 0;

    setOffset(left, top) {
        this.canvas.offset = { left, top };
    };

    entities = [];

    addEntity(entity) {
        this.entities.push(entity);

        return entity;
    };

    currentEntity = undefined;

    getEntity(position, type = null) {
        if(position == undefined)
            return undefined;

        const offset = [
            position[0] - this.canvas.offset.left - this.center,
            position[1] - this.canvas.offset.top
        ];

        const sprites = (type == null)?(this.sprites):(this.sprites.filter(x => x.parent.name == type));

        for(let index = sprites.length - 1; index != -1; index--) {
            const mouseover = sprites[index].mouseover(offset, this.center);
            
            if(mouseover == false)
                continue;

            return { entity: sprites[index].parent, sprite: sprites[index], result: mouseover };
        }

        return undefined;
    };

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);

        if(index == -1)
            return;

        this.entities.splice(index, 1);
    };

    updateCanvas() {
        const width = this.parent.clientWidth;
        const height = this.parent.clientHeight;

        this.canvas.canvas.width = width;
        this.canvas.canvas.height = height;

        /*.css({
            "width": Math.floor(width * window.devicePixelRatio),
            "height": Math.floor(height * window.devicePixelRatio)
        })*/
    };

    sprites = [];

    render() {
        let timestamp = performance.now();

        for(let index = 0; index < this.entities.length; index++)
            this.entities[index].process(timestamp, this.canvas.frame);

        this.updateCanvas();

        for(let index = 0; index < this.events.beforeRender.length; index++)
            this.events.beforeRender[index]();
        
        const context = this.canvas.canvas.getContext("2d");

        context.fillStyle = this.background;

        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.save();

        //context.imageSmoothingEnabled = false;

        //context.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.sprites = [];

        for(let index = 0; index < this.entities.length; index++) {
            if(this.entities[index].enabled == false)
                continue;

            this.sprites = this.sprites.concat(this.entities[index].sprites);
        }

        this.sprites.sort(function(a, b) {
            return a.getIndex() - b.getIndex();
        });

        const offset = [ this.center + this.canvas.offset.left, this.canvas.offset.top ];
        
        for(let index = 0; index < this.sprites.length; index++)
            this.sprites[index].render(context, offset);

        for(let index = 0; index < this.events.render.length; index++)
            this.events.render[index]();

        context.restore();

        /*if(this.framePerformance.length == this.frameRate)
            this.framePerformance.shift();

        const milliseconds = (Math.round((performance.now() - timestamp) * 100) / 100);

        this.framePerformance.push(milliseconds);

        const median = Client.utils.getArrayMedian(this.framePerformance);
        
        if(median > 6) {
            //console.warn("[RoomEntity]%c Execution for last " + this.framePerformance.length + " frames took ~" + (Math.round(median * 100) / 100) + "ms; last took ~" + milliseconds + "ms!", "color: lightblue");

            //this.framePerformance.length = 0;
        }

        timestamp = performance.now();

        for(let index in this.frameRates) {
            if(timestamp - this.frameRates[index] >= 1000) {
                this.frameRates.splice(index, 1);
            }
        }

        this.frameRates.push(timestamp);

        ClientDevelopment.frames.innerText = `, ${this.frameRates.length} FPS`;*/

        return { median: 0, milliseconds: 0, frames: 0 };
    };

    events = {
        render: [],
        beforeRender: []
    };

    setCursor(cursor) {
        this.canvas.style.cursor = cursor;
    };
};
