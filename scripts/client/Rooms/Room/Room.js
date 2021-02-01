Client.room = new function() {
    this.active = false;

    this.users = [];

    this.load = async function(data) {
        this.clear();

        Client.rooms.navigator.hide();
        
        this.interface = new Client.rooms.interface(Client.$element);

        this.entity = new Client.rooms.entity(Client.$element);

        this.interface.addEntity(this.entity);

        this.entity.updateCanvas();

        await this.addFloormap(data.map.floor);

        await this.interface.addMouseEvents();

        this.entity.render();

        this.active = true;

        this.clickFloormap();

        window.requestAnimationFrame(this.render);
    };

    this.addFloormap = async function(map) {
        if(this.floormap != undefined)
            this.entity.removeEntity(this.floormap);

        this.floormap = new Client.rooms.items.floormap(
            this.entity,
    
            map,
            "301", 8
        );
    
        await this.floormap.render();

        this.entity.addEntity(this.floormap);
    };

    this.clickFloormap = function() {
        this.entity.$canvas.on("click", function(event) {
            const hit = Client.room.entity.getEntity([ event.offsetX, event.offsetY ]);
            
            if(hit == undefined)
                return;

            if(hit.entity.name != "floormap")
                return;

            Client.socket.messages.send({ OnRoomMapClick: { row: hit.result.row, column: hit.result.column } });
        });
    };

    this.render = function() {
        if(!Client.room.active)
            return;

        Client.room.entity.render();

        window.requestAnimationFrame(Client.room.render);
    };

    this.clear = function() {
        this.users.length = 0;
    };
};
