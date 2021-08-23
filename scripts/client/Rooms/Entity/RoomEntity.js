Client.rooms.entity = function($parent) {
    this.background = "#111";

    this.offset = [ 0, 0 ];

    this.center = 0;

    this.setOffset = function(left, top) {
        this.offset = [ left, top ];
    };

    this.entities = [];

    this.addEntity = function(entity) {
        this.entities.push(entity);

        return entity;
    };

    this.currentEntity = undefined;

    this.getEntity = function(position, type = null) {
        if(position == undefined)
            return undefined;

        const offset = [
            position[0] - this.offset[0] - this.center,
            position[1] - this.offset[1]
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

    this.removeEntity = function(entity) {
        const index = this.entities.indexOf(entity);

        if(index == -1)
            return;

        this.entities.splice(index, 1);
    };

    this.$canvas = $('<canvas></canvas>').appendTo($parent);

    this.updateCanvas = function() {
        const width = $parent.width();
        const height = $parent.height();

        this.$canvas.attr({
            "width": width,
            "height": height
        });

        /*.css({
            "width": Math.floor(width * window.devicePixelRatio),
            "height": Math.floor(height * window.devicePixelRatio)
        })*/
    };

    this.sprites = [];

    this.frame = 0;
    this.frameRate = 24;
    this.frameRates = [];
    this.frameStamp = performance.now();
    this.framePerformance = [];

    this.render = function() {
        let timestamp = performance.now();

        if((timestamp - this.frameStamp) > 1000 / this.frameRate) {
            this.frame++;

            if(this.frame > this.frameRate)
                this.frame = 0;

            this.frameStamp = timestamp;
        }

        for(let index = 0; index < this.entities.length; index++)
            this.entities[index].process(timestamp, this.frame);

        this.updateCanvas();

        for(let index = 0; index < this.events.beforeRender.length; index++)
            this.events.beforeRender[index]();
        
        const context = this.$canvas[0].getContext("2d");

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

        const offset = [ this.center + this.offset[0], this.offset[1] ];
        
        for(let index = 0; index < this.sprites.length; index++)
            this.sprites[index].render(context, offset);

        for(let index = 0; index < this.events.render.length; index++)
            this.events.render[index]();

        context.restore();

        if(this.framePerformance.length == this.frameRate)
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

        Client.development.$frames.text(this.frameRates.length + " FPS");

        return { median, milliseconds, frames: this.frameRates.length };
    };

    this.events = new function() {
        this.render = [];

        this.beforeRender = [];
    };

    this.setCursor = function(cursor) {
        this.$canvas.css("cursor", cursor);
    };
};
