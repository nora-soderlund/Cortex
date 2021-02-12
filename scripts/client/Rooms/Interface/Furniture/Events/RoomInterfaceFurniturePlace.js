Client.rooms.interface.furniture.place = new function() {
    this.enabled = false;

    this.$icon = $('<canvas></canvas>').css({ "position": "fixed", "pointer-events": "none" });

    this.start = async function(furniture) {
        this.enabled = true;

        this.entity = new Client.rooms.items.furniture(Client.rooms.interface.entity, "HabboFurnitures/" + furniture.line + "/" + furniture.id, 0);

        this.entity.disable();

        this.entity.alpha = 0.5;

        Client.assets.getSpritesheet("HabboLoadingIcon").then(function(icon) {
            const context = Client.rooms.interface.furniture.place.$icon[0].getContext("2d");

            context.canvas.width = icon.width;
            context.canvas.height = icon.height;

            context.drawImage(icon, 0, 0);

            Client.rooms.interface.furniture.place.$icon.css({
                "margin-left": -(Math.floor(icon.width / 2)),
                "margin-top": -(Math.floor(icon.height / 2))
            });

            Client.furnitures.icon(furniture.id).then(function(image) {
                context.canvas.width = image.width;
                context.canvas.height = image.height;

                context.drawImage(image, 0, 0);

                Client.rooms.interface.furniture.place.$icon.css({
                    "margin-left": -(Math.floor(image.width / 2)),
                    "margin-top": -(Math.floor(image.height / 2))
                });
            });
        });

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
            if(Client.rooms.interface.data.map.height[position.row + row] == undefined) {
                Client.rooms.interface.furniture.place.showIcon();

                return;
            }
                
            for(let column = 0; column < dimensions.column; column++) {
                if(Client.rooms.interface.data.map.height[position.row + row][position.column + column] == undefined) {
                    Client.rooms.interface.furniture.place.showIcon();

                    return;
                }
            }
        }
        
        Client.rooms.interface.furniture.place.hideIcon();

        Client.rooms.interface.furniture.place.entity.setCoordinates(position.row, position.column, position.depth, 0);

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
        if(Client.rooms.interface.furniture.place.entity.enabled == false) {
            Client.rooms.interface.furniture.place.stop();

            Client.inventory.show();

            return;
        }

        Client.rooms.interface.furniture.place.unbind();
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
       
        Client.rooms.interface.furniture.place.entity.furniture.nextDirection(1);

        await Client.rooms.interface.furniture.place.entity.furniture.render();
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
