Client.canvas = new function() {
    this.list = [];

    this.addCanvas = function(canvas, settings) {
        const properties = {
            canvas,

            frame: 0,
            frameRate: 24,
            frameStamp: performance.now(),
            frameLogs: [],

            enabled: true
        };

        for(let key in settings)
            properties[key] = settings[key];

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

            const delta = timestamp - this.list[index].frameStamp;

            const interval = (1000 / this.list[index].frameRate);

            if(delta > interval) {
                this.list[index].frameStamp = timestamp - (delta % interval);

                this.list[index].frame++;

                if(this.list[index].frame == this.list[index].frameRate + 1)
                    this.list[index].frame = 1;

                for(let log in this.list[index].frameLogs)
                    if(timestamp - this.list[index].frameLogs[log] >= 1000)
                        this.list[index].frameLogs.splice(log, 1);
        
                this.list[index].frameLogs.push(timestamp);

                this.list[index].render();
                
                const context = this.list[index].canvas.getContext("2d");

                context.resetTransform();

                context.font = "13px Ubuntu Regular";
                context.fillStyle = "rgba(255, 255, 255, .5)";
                context.textAlign = "right";

                context.fillText(this.list[index].frameLogs.length + " FPS", context.canvas.width - 12, context.canvas.height - 12);
            }
        }

        window.requestAnimationFrame(function() {
            Client.canvas.render();
        });
    };
    

    window.requestAnimationFrame(function() {
        Client.canvas.render();
    });
};
