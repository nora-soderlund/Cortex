const CanvasManager = new class {
    list = [];

    constructor() {
        this.render();
    };

    render() {
        window.requestAnimationFrame(() => {
            const timestamp = performance.now();

            for(let index = 0; index < this.list.length; index++) {
                try {
                    if(this.list[index].enabled == false)
                        continue;

                    if(this.list[index].render == undefined)
                        continue;

                    if((this.list[index].draggableEnabled == false && this.list[index].frameRate != 0) || (this.list[index].draggableEnabled == true && this.list[index].draggableRate != 0)) {
                        const delta = timestamp - this.list[index].frameTimestamp;

                        const interval = (1000 / this.list[index].frameRate);

                        if(delta < interval)
                            continue;

                        this.list[index].frameTimestamp = timestamp - (delta % interval);
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

                    context.fillText(`Canvas ${index}: ${this.list[index].frameLogs.length} FPS`, context.canvas.width - 12, context.canvas.height - 100);
                }
                catch {

                }
            }

            this.render();
        });
    };
};
