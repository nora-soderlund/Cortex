class Canvas extends Events {
    static list = [];

    static create(settings) {
        const canvas = {
            parent: settings.parent,
            element: document.createElement("canvas"),
            events: settings.events || new Events(),

            frames: {
                count: 0,
                limit: null,
                logs: []
            }
        };

        canvas.parent.appendChild(canvas.element);

        Canvas.list.push(canvas);

        return canvas;
    };

    static render() {
        for(let index = 0; index < Canvas.list.length; index++) {
            Canvas.list[index].element.width = Canvas.list[index].parent.width;
            Canvas.list[index].element.height = Canvas.list[index].parent.height;

            const timestamp = performance.now();

            for(let log in Canvas.list[index].frames.logs)
                if(timestamp - Canvas.list[index].frames.logs[log] >= 1000)
                    Canvas.list[index].frames.logs.splice(log, 1);

            Canvas.list[index].frames.count++;

            Canvas.list[index].frames.logs.push(timestamp);

            Canvas.list[index].events.call("render", timestamp, Canvas.list[index].frames.logs.length);
            
            const context = Canvas.list[index].element.getContext("2d");
            
            context.save();

            context.font        = "13px Ubuntu Regular";
            context.fillStyle   = "rgba(255, 255, 255, .5)";
            context.textAlign   = "right";

            context.fillText(Canvas.list[index].frames.logs.length + " FPS", context.canvas.width - 12, context.canvas.height - 12);
            
            context.restore();
        }

        window.requestAnimationFrame(Canvas.render);
    };
};

window.requestAnimationFrame(Canvas.render);
