Client.canvas = new function() {
    this.list = [];

    this.addCanvas = function(canvas, settings) {
        const properties = {
            canvas,

            offset: { left: 0, top: 0 },

            draggable: true,
            draggableEnabled: false,
            draggableRate: 0,
            draggableTimestamp: 0,

            frame: 0,
            frameRate: 24,
            frameStamp: performance.now(),
            frameLogs: [],

            enabled: true
        };

        for(let key in settings)
            properties[key] = settings[key];

        if(properties.draggable) {
            let position = null;

            $(properties.canvas).on("mousedown", function(event) {
                properties.draggableEnabled = true;

                properties.draggableTimestamp = performance.now();
                
                position = { left: event.offsetX, top: event.offsetY };
            }).on("mouseup", function() {
                properties.draggableEnabled = false;
            }).on("mousemove", function(event) {
                if(properties.draggableEnabled == false)
                    return;
        
                properties.offset.left += (event.offsetX - position.left);
                properties.offset.top += (event.offsetY - position.top);
        
                position = { left: event.offsetX, top: event.offsetY };
            });
        }

        properties.start = function() {
            properties.enabled = true;
        };

        properties.stop = function() {
            properties.enabled = false;
        };

        this.list.push(properties);

        return properties;
    };

    this.render = function() {
        const timestamp = performance.now();

        for(let index in this.list) {
            if(this.list[index].enabled == false)
                continue;

            if(this.list[index].render == undefined)
                continue;

            if((this.list[index].draggableEnabled == false && this.list[index].frameRate != 0) || (this.list[index].draggableEnabled == true && this.list[index].draggableRate != 0)) {
                const delta = timestamp - this.list[index].frameStamp;

                const interval = (1000 / this.list[index].frameRate);

                if(delta < interval)
                    continue;

                this.list[index].frameStamp = timestamp - (delta % interval);
            }

            this.list[index].frame++;

            if(this.list[index].frame == this.list[index].frameRate + 1)
                this.list[index].frame = 1;

            for(let log in this.list[index].frameLogs)
                if(timestamp - this.list[index].frameLogs[log] >= 1000)
                    this.list[index].frameLogs.splice(log, 1);
    
            this.list[index].frameLogs.push(timestamp);

            this.list[index].render(this.list[index]);
            
            const context = this.list[index].canvas.getContext("2d");

            context.resetTransform();

            context.font = "13px Ubuntu Regular";
            context.fillStyle = "rgba(255, 255, 255, .5)";
            context.textAlign = "right";

            context.fillText(this.list[index].frameLogs.length + " FPS", context.canvas.width - 12, context.canvas.height - 12);
        }

        window.requestAnimationFrame(function() {
            Client.canvas.render();
        });
    };
    

    window.requestAnimationFrame(function() {
        Client.canvas.render();
    });
};
