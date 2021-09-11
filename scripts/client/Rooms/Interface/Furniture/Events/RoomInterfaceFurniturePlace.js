RoomInterface.furniture.place = new function() {
    this.enabled = false;

    this.icon = document.createElement("canvas");
    this.icon.style.position = "fixed";
    this.icon.style.pointerEvents = "none";

    this.start = async function(furniture, finished, direction = null) {
        furniture = await Furnitures.get(furniture);
        
        if(finished == undefined)
            console.trace("finished is missing");

        this.furniture = furniture;

        this.map = await SocketMessages.sendCall({ OnRoomMapStackUpdate: null }, "OnRoomMapStackUpdate");

        this.enabled = true;

        this.finished = finished;

        this.entity = new Client.rooms.items.furniture(RoomInterface.entity, furniture.id, direction);

        this.entity.furniture.events.render.push(function() {
            RoomInterface.furniture.place.direction = RoomInterface.furniture.place.entity.furniture.direction;
        });

        this.entity.disable();

        this.entity.alpha = 0.5;

        const renderer = new FurnitureRenderer({ id: furniture.id, size: 1 }, this.icon);

        await this.entity.render();

        RoomInterface.element.append(this.icon);

        RoomInterface.entity.addEntity(this.entity);

        this.showIcon();
    
        RoomInterface.cursor.events.hover.push(this.hover);
        RoomInterface.cursor.events.unhover.push(this.unhover);

        RoomInterface.entity.canvas.addEventListener("wheel", this.scroll);
    };

    this.hover = function(position) {
        const dimensions = RoomInterface.furniture.place.entity.furniture.getDimensions();

        for(let row = 0; row < dimensions.row; row++) {
            if(RoomInterface.furniture.place.map[position.row + row] == undefined) {
                RoomInterface.furniture.place.showIcon();

                return;
            }
                
            for(let column = 0; column < dimensions.column; column++) {
                if(RoomInterface.furniture.place.map[position.row + row][position.column + column] == undefined) {
                    RoomInterface.furniture.place.showIcon();

                    return;
                }
            }
        }
        
        RoomInterface.furniture.place.hideIcon();

        RoomInterface.furniture.place.position = position;

        RoomInterface.furniture.place.entity.setCoordinates(position.row, position.column, RoomInterface.furniture.place.map[position.row][position.column], 0);

        RoomInterface.furniture.place.entity.enable();
    };

    this.showIcon = function() {
        if(RoomInterface.furniture.place.iconShown == true)
            return;
        
            RoomInterface.furniture.place.entity.disable();

        RoomInterface.furniture.place.iconShown = true;

        RoomInterface.entity.canvas.addEventListener("mousemove", RoomInterface.furniture.place.move);
    };

    this.hideIcon = function() {
        if(RoomInterface.furniture.place.iconShown == false)
            return;

        RoomInterface.furniture.place.iconShown = false;

        RoomInterface.entity.canvas.removeEventListener("mousemove", RoomInterface.furniture.place.move);
        
        RoomInterface.furniture.place.icon.style.display = "none";
    };

    this.click = function() {
        RoomInterface.furniture.place.finished(RoomInterface.furniture.place);
    };

    this.move = function(event) {
        RoomInterface.furniture.place.icon.style.left = event.offsetX;
        RoomInterface.furniture.place.icon.style.top = event.offsetY;
        RoomInterface.furniture.place.icon.style.display = "block";
    };

    this.unhover = function() {
        RoomInterface.furniture.place.entity.disable();
        
        RoomInterface.furniture.place.showIcon();
    };

    this.scroll = async function(event) {
        const direction = (event.originalEvent.deltaY < 0)?(1):(0);

        RoomInterface.furniture.place.entity.furniture.settings.direction = RoomInterface.furniture.place.entity.furniture.getNextDirection();

        await RoomInterface.furniture.place.entity.furniture.render();
    };

    this.bind = function() {
        RoomInterface.furniture.place.showIcon();

        RoomInterface.cursor.events.hover.push(RoomInterface.furniture.place.hover);
        RoomInterface.cursor.events.unhover.push(RoomInterface.furniture.place.unhover);
   
        RoomInterface.entity.canvas.addEventListener("wheel", RoomInterface.furniture.place.scroll);

        RoomInterface.element.append(RoomInterface.furniture.place.icon);
    };

    this.unbind = function() {
        RoomInterface.furniture.place.hideIcon();

        RoomInterface.cursor.events.hover.splice(RoomInterface.cursor.events.hover.indexOf(RoomInterface.furniture.place.hover), 1);
        RoomInterface.cursor.events.unhover.splice(RoomInterface.cursor.events.unhover.indexOf(RoomInterface.furniture.place.unhover), 1);
   
        RoomInterface.entity.canvas.removeEventListener("wheel", RoomInterface.furniture.place.scroll);

        RoomInterface.furniture.place.icon.remove();
    };

    this.stop = function() {
        this.enabled = false;

        this.unbind();
        
        RoomInterface.entity.removeEntity(RoomInterface.furniture.place.entity);
    };
};
