Client.rooms.interface = new function() {
    this.$element = $('<div class="room"></div>').prependTo(Client.$element);

    this.entity = new Client.rooms.entity(this.$element);

    this.users = {};

    this.active = false;

    this.frameLimit = 60;
    this.frameLimitStamp = null;

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

        this.chat.addMessage("information", "Room interface renderer started!");

        this.frameLimitStamp = performance.now();

        window.requestAnimationFrame(this.render);
    };

    this.stop = async function() {
        Client.rooms.interface.active = false;

        return new Promise(function(resolve) {
            window.requestAnimationFrame(function() {
                window.requestAnimationFrame(function() {
                    for(let index in Client.rooms.interfac.events.stop)
                        Client.rooms.interfac.events.stop[index]();

                    Client.rooms.interface.chat.addMessage("information", "Room interface renderer stopped!");
    
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
            const timestamp = performance.now();

            const delta = timestamp - Client.rooms.interface.frameLimitStamp;

            const interval = (1000 / Client.rooms.interface.frameLimit);

            if(delta > interval) {
                Client.rooms.interface.frameLimitStamp = timestamp - (delta % interval);

                Client.rooms.interface.entity.render();
            }
        }
        else
            Client.rooms.interface.entity.render();
    };

    this.clear = async function() {
        this.entity.entities.length = 0;
        
        if(this.active)
            await this.stop();
    };
};
