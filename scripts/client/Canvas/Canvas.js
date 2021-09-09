class Canvas {
    static list = [];

    static addCanvas(canvas, settings) {
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
                if(Keys.down["ShiftLeft"])
                    return;

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

        properties.destroy = function() {
            properties.enabled = false;
        };

        properties.stop = function() {
            properties.enabled = false;
        };

        Canvas.list.push(properties);

        return properties;
    };

    static render() {
        const timestamp = performance.now();

        for(let index in Canvas.list) {
            if(Canvas.list[index].enabled == false)
                continue;

            if(Canvas.list[index].render == undefined)
                continue;

            if((Canvas.list[index].draggableEnabled == false && Canvas.list[index].frameRate != 0) || (Canvas.list[index].draggableEnabled == true && Canvas.list[index].draggableRate != 0)) {
                const delta = timestamp - Canvas.list[index].frameStamp;

                const interval = (1000 / Canvas.list[index].frameRate);

                if(delta < interval)
                    continue;

                Canvas.list[index].frameStamp = timestamp - (delta % interval);
            }

            Canvas.list[index].frame++;

            if(Canvas.list[index].frame == Canvas.list[index].frameRate + 1)
                Canvas.list[index].frame = 1;

            for(let log in Canvas.list[index].frameLogs)
                if(timestamp - Canvas.list[index].frameLogs[log] >= 1000)
                    Canvas.list[index].frameLogs.splice(log, 1);
    
            Canvas.list[index].frameLogs.push(timestamp);

            Canvas.list[index].render(Canvas.list[index]);
            
            const context = Canvas.list[index].canvas.getContext("2d");

            context.resetTransform();

            context.font = "13px Ubuntu Regular";
            context.fillStyle = "rgba(255, 255, 255, .5)";
            context.textAlign = "right";

            context.fillText(Canvas.list[index].frameLogs.length + " FPS", context.canvas.width - 12, context.canvas.height - 12);
        }

        window.requestAnimationFrame(function() {
            Canvas.render();
        });
    };
};
    
window.requestAnimationFrame(function() {
    Canvas.render();
});
