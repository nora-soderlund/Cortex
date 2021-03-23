Client.rooms.interface = new function() {
    this.$element = $('<div class="room"></div>').prependTo(Client.$element);

    this.entity = new Client.rooms.entity(this.$element);

    this.users = {};
    this.furnitures = {};

    this.active = false;

    this.frameLimit = 60;
    this.frameLimitStamp = null;

    this.frameAdjust = 2;
    this.frameAdjustTimestamp = performance.now();
    this.frameAdjustCounts = [];    

    this.events = {
        start: [],
        stop: []
    };

    this.start = function() {
        if(this.active == true)
            return;

        this.active = true;

        for(let index in this.events.start)
            this.events.start[index]();

        this.frameLimitStamp = performance.now();

        window.requestAnimationFrame(this.render);
    };

    this.stop = async function() {
        Client.rooms.interface.active = false;
        
        for(let index in Client.rooms.interface.events.stop)
            Client.rooms.interface.events.stop[index]();

        return new Promise(function(resolve) {
            window.requestAnimationFrame(function() {
                window.requestAnimationFrame(function() {
                    resolve();
                });
            });
        });
    }

    this.render = function() {
        if(!Client.rooms.interface.active)
            return;

        window.requestAnimationFrame(Client.rooms.interface.render);

        if(Client.rooms.interface.frameLimit != 0) {
            let timestamp = performance.now();

            const delta = timestamp - Client.rooms.interface.frameLimitStamp;

            const interval = (1000 / Client.rooms.interface.frameLimit);

            if(delta > interval) {
                Client.rooms.interface.frameLimitStamp = timestamp - (delta % interval);

                timestamp = performance.now();

                const { median, milliseconds, frames } = Client.rooms.interface.entity.render();

                if(timestamp - Client.rooms.interface.frameAdjustTimestamp > 1000) {
                    Client.rooms.interface.frameAdjustTimestamp = timestamp;

                    Client.rooms.interface.frameAdjustCounts.push(frames);

                    if(Client.rooms.interface.frameAdjustCounts.length == 5) {
                        Client.rooms.interface.frameAdjustCounts.splice(0, 1);
                        
                        //console.log("median of frames per seconds in 5 seconds is " + Client.utils.getArrayMedian(Client.rooms.interface.frameAdjustCounts));
                    }

                    //console.log("we have rendered " + frames + " frames and we wanted " + Client.rooms.interface.frameLimit + ", render took " + Math.round(performance.now() - timestamp) + "ms, we can afford " + Math.floor(1000 / (performance.now() - timestamp)) + " frames");
                
                }

                /*if((Client.rooms.interface.frameLimit - frames) > 3) {
                    console.warn("[RoomInterface]%c We're detecting an urge for more frames (" + frames + "/" + Client.rooms.interface.frameLimit + ") than we can deliver, render took " + median + "/" + interval + "!", "color: lightblue");

                    if(Client.rooms.interface.frameLimit > 12) {
                        Client.rooms.interface.frameLimit -= 2;

                        if(Client.rooms.interface.frameLimit < 12)
                            Client.rooms.interface.frameLimit = 12;

                        console.warn("[RoomInterface]%c Lowered expected frame count down to " + Client.rooms.interface.frameLimit + "!", "color: lightblue");
                    }
                    
                }*/
            }
        }
        else
            Client.rooms.interface.entity.render();
    };

    this.clear = async function() {
        this.chat.clear();

        this.entity.entities.length = 0;
        
        if(this.active)
            await this.stop();
    };
};
