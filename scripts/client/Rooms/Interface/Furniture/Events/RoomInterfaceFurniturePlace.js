Client.rooms.interface.furniture.place = new function() {
    this.enabled = false;

    this.$icon = $('<canvas></canvas>').css({ "position": "fixed", "pointer-events": "none" });

    this.start = async function(furniture, finished, direction = null) {
        furniture = await Client.furnitures.get(furniture);
        
        if(finished == undefined)
            console.trace("finished is missing");

        this.furniture = furniture;

        this.map = await Client.socket.messages.sendCall({ OnRoomMapStackUpdate: null }, "OnRoomMapStackUpdate");

        this.enabled = true;

        this.finished = finished;

        this.entity = new Client.rooms.items.furniture(Client.rooms.interface.entity, furniture.id, direction);

        this.entity.furniture.events.render.push(function() {
            Client.rooms.interface.furniture.place.direction = Client.rooms.interface.furniture.place.entity.furniture.direction;
        });

        this.entity.disable();

        this.entity.alpha = 0.5;

        const renderer = new Client.furnitures.renderer({ id: furniture.id, size: 1 }, this.$icon);

        await this.entity.render();

        this.$icon.appendTo(Client.rooms.interface.$element);

        Client.rooms.interface.entity.addEntity(this.entity);

        this.showIcon();
    
        Client.rooms.interface.cursor.events.hover.push(this.hover);
        Client.rooms.interface.cursor.events.unhover.push(this.unhover);

        Client.rooms.interface.entity.$canvas.bind("wheel", this.scroll);
    };

    this.hover = function(position) {
        const dimensions = Client.rooms.interface.furniture.place.entity.furniture.getDimensions();

        for(let row = 0; row < dimensions.row; row++) {
            if(Client.rooms.interface.furniture.place.map[position.row + row] == undefined) {
                Client.rooms.interface.furniture.place.showIcon();

                return;
            }
                
            for(let column = 0; column < dimensions.column; column++) {
                if(Client.rooms.interface.furniture.place.map[position.row + row][position.column + column] == undefined) {
                    Client.rooms.interface.furniture.place.showIcon();

                    return;
                }
            }
        }
        
        Client.rooms.interface.furniture.place.hideIcon();

        Client.rooms.interface.furniture.place.position = position;

        Client.rooms.interface.furniture.place.entity.setCoordinates(position.row, position.column, Client.rooms.interface.furniture.place.map[position.row][position.column], 0);

        Client.rooms.interface.furniture.place.entity.enable();
    };

    this.showIcon = function() {
        if(Client.rooms.interface.furniture.place.iconShown == true)
            return;
        
            Client.rooms.interface.furniture.place.entity.disable();

        Client.rooms.interface.furniture.place.iconShown = true;

        Client.rooms.interface.entity.$canvas.bind("mousemove", Client.rooms.interface.furniture.place.move);
    };

    this.hideIcon = function() {
        if(Client.rooms.interface.furniture.place.iconShown == false)
            return;

        Client.rooms.interface.furniture.place.iconShown = false;

        Client.rooms.interface.entity.$canvas.unbind("mousemove", Client.rooms.interface.furniture.place.move);
        
        Client.rooms.interface.furniture.place.$icon.hide();
    };

    this.click = function() {
        Client.rooms.interface.furniture.place.finished(Client.rooms.interface.furniture.place);
    };

    this.move = function(event) {
        Client.rooms.interface.furniture.place.$icon.css({
            "left": event.offsetX,
            "top": event.offsetY
        }).show();
    };

    this.unhover = function() {
        Client.rooms.interface.furniture.place.entity.disable();
        
        Client.rooms.interface.furniture.place.showIcon();
    };

    this.scroll = async function(event) {
        const direction = (event.originalEvent.deltaY < 0)?(1):(0);

        Client.rooms.interface.furniture.place.entity.furniture.settings.direction = Client.rooms.interface.furniture.place.entity.furniture.getNextDirection();

        await Client.rooms.interface.furniture.place.entity.furniture.render();
    };

    this.bind = function() {
        Client.rooms.interface.furniture.place.showIcon();

        Client.rooms.interface.cursor.events.hover.push(Client.rooms.interface.furniture.place.hover);
        Client.rooms.interface.cursor.events.unhover.push(Client.rooms.interface.furniture.place.unhover);
   
        Client.rooms.interface.entity.$canvas.bind("wheel", Client.rooms.interface.furniture.place.scroll);

        Client.rooms.interface.furniture.place.$icon.appendTo(Client.rooms.interface.$element);
    };

    this.unbind = function() {
        Client.rooms.interface.furniture.place.hideIcon();

        Client.rooms.interface.cursor.events.hover.splice(Client.rooms.interface.cursor.events.hover.indexOf(Client.rooms.interface.furniture.place.hover), 1);
        Client.rooms.interface.cursor.events.unhover.splice(Client.rooms.interface.cursor.events.unhover.indexOf(Client.rooms.interface.furniture.place.unhover), 1);
   
        Client.rooms.interface.entity.$canvas.unbind("wheel", Client.rooms.interface.furniture.place.scroll);

        Client.rooms.interface.furniture.place.$icon.remove();
    };

    this.stop = function() {
        this.enabled = false;

        this.unbind();
        
        Client.rooms.interface.entity.removeEntity(Client.rooms.interface.furniture.place.entity);
    };
};
