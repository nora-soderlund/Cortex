class Canvas {
    constructor(canvas, settings = {}) {
        this.canvas = canvas;

        this.enabled = settings.enabled ?? true;

        this.offset = settings.offset ?? { left: 0, top: 0 };

        this.draggable = settings.draggable ?? true;
        this.draggableEnabled = settings.draggableEnabled ?? false;
        this.draggableRate = settings.draggableRate ?? 0;
        this.draggableTimestamp = settings.draggableTimestamp ?? 0;

        this.frame = settings.frame ?? 0;
        this.frameRate = settings.frameRate ?? 24;
        this.frameTimestamp = settings.frameTimestamp ?? 0;
        this.frameLogs = settings.frameLogs ?? [];

        if(this.draggable) {
            let position = null;

            this.canvas.addEventListener("mouseenter", (event) => {
                this.frameRate = 0;
            });

            this.canvas.addEventListener("mouseleave", (event) => {
                this.frameRate = 24;
            });

            this.canvas.addEventListener("mousedown", (event) => {
                if(Keys.down["ShiftLeft"])
                    return;

                this.draggableEnabled = true;

                this.draggableTimestamp = performance.now();
                
                position = { left: event.offsetX, top: event.offsetY };
            });
            
            this.canvas.addEventListener("mouseup", () => {
                this.draggableEnabled = false;
            });
            
            this.canvas.addEventListener("mousemove", (event) => {
                if(this.draggableEnabled == false)
                    return;
        
                this.offset.left += (event.offsetX - position.left);
                this.offset.top += (event.offsetY - position.top);
        
                position = { left: event.offsetX, top: event.offsetY };
            });
        }

        CanvasManager.list.push(this);
    };

    getContext(context) {
        return this.canvas.getContext(context);
    }

    start() {
        this.enabled = true;
    };

    destroy() {
        this.enabled = false;
    };

    stop() {
        this.enabled = false;
    };
};
