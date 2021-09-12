const RoomInterface = new class {
    constructor() {
        this.element = document.createElement("div");
        this.element.className = "room";
        Client.element.prepend(this.element);
    
        this.entity = new RoomEntity(this.element);
    };

    users = {};
    furnitures = {};

    active = false;

    frameLimit = 60;
    frameLimitStamp = null;

    frameAdjust = 2;
    frameAdjustTimestamp = performance.now();
    frameAdjustCounts = [];    

    events = {
        start: [],
        stop: []
    };

    start() {
        if(this.active == true)
            return;

        this.active = true;

        for(let index in this.events.start)
            this.events.start[index]();

        this.frameLimitStamp = performance.now();

        window.requestAnimationFrame(this.render);
    };

    async stop() {
        RoomInterface.active = false;
        
        for(let index in RoomInterface.events.stop)
            RoomInterface.events.stop[index]();

        return new Promise(function(resolve) {
            window.requestAnimationFrame(function() {
                window.requestAnimationFrame(function() {
                    resolve();
                });
            });
        });
    }

    render() {
        if(!RoomInterface.active)
            return;

        window.requestAnimationFrame(RoomInterface.render);

        if(RoomInterface.frameLimit != 0) {
            let timestamp = performance.now();

            const delta = timestamp - RoomInterface.frameLimitStamp;

            const interval = (1000 / RoomInterface.frameLimit);

            if(delta > interval) {
                RoomInterface.frameLimitStamp = timestamp - (delta % interval);

                timestamp = performance.now();

                const { median, milliseconds, frames } = RoomInterface.entity.render();

                if(timestamp - RoomInterface.frameAdjustTimestamp > 1000) {
                    RoomInterface.frameAdjustTimestamp = timestamp;

                    RoomInterface.frameAdjustCounts.push(frames);

                    if(RoomInterface.frameAdjustCounts.length == 5) {
                        RoomInterface.frameAdjustCounts.splice(0, 1);
                        
                        //console.log("median of frames per seconds in 5 seconds is " + Client.utils.getArrayMedian(RoomInterface.frameAdjustCounts));
                    }

                    //console.log("we have rendered " + frames + " frames and we wanted " + RoomInterface.frameLimit + ", render took " + Math.round(performance.now() - timestamp) + "ms, we can afford " + Math.floor(1000 / (performance.now() - timestamp)) + " frames");
                
                }

                /*if((RoomInterface.frameLimit - frames) > 3) {
                    console.warn("[RoomInterface]%c We're detecting an urge for more frames (" + frames + "/" + RoomInterface.frameLimit + ") than we can deliver, render took " + median + "/" + interval + "!", "color: lightblue");

                    if(RoomInterface.frameLimit > 12) {
                        RoomInterface.frameLimit -= 2;

                        if(RoomInterface.frameLimit < 12)
                            RoomInterface.frameLimit = 12;

                        console.warn("[RoomInterface]%c Lowered expected frame count down to " + RoomInterface.frameLimit + "!", "color: lightblue");
                    }
                    
                }*/
            }
        }
        else
            RoomInterface.entity.render();
    };

    async clear() {
        this.chat.clear();

        this.entity.entities.length = 0;
        
        if(this.active)
            await this.stop();
    };
};
