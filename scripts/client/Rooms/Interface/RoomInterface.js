Client.rooms.interface = new function() {
    this.$element = $('<div class="room"></div>').prependTo(Client.$element);

    this.entity = new Client.rooms.entity(this.$element);

    this.users = {};

    this.active = false;

    this.start = function() {
        if(this.active == true)
            return;

        this.active = true;

        this.chat.addMessage("information", "Room interface renderer started!");

        window.requestAnimationFrame(this.render);
    };

    this.stop = async function() {
        Client.rooms.interface.active = false;

        return new Promise(function(resolve) {
            window.requestAnimationFrame(function() {
                window.requestAnimationFrame(function() {
                    Client.rooms.interface.chat.addMessage("information", "Room interface renderer stopped!");
    
                    resolve();
                });
            });
        });
    }

    this.render = function() {
        if(!Client.rooms.interface.active)
            return;

        Client.rooms.interface.entity.render();

        if(Client.rooms.interface.active)
            window.requestAnimationFrame(Client.rooms.interface.render);
    };

    this.clear = async function() {
        this.entity.entities.length = 0;
        
        if(this.active)
            await this.stop();
    };
};
