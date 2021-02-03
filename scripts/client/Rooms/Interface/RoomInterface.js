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

    this.stop = function() {
        this.active = false;
        
        this.chat.addMessage("information", "Room interface renderer stopped!");
    }

    this.render = function() {
        if(!Client.rooms.interface.active)
            return;

        Client.rooms.interface.entity.render();

        window.requestAnimationFrame(Client.rooms.interface.render);
    };

    this.clear = function() {
        if(this.active)
            this.stop();

        this.entity.entities.length = 0;
    };
};
