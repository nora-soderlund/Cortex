Client.rooms.interface.cursor = new function() {
    this.down = false;
    this.downTimestamp = 0;

    this.position = null;

    this.events = {
        hover: [],
        unhover: []
    };

    Client.rooms.interface.entity.$canvas.on("mousedown", function(event) {
        Client.rooms.interface.cursor.down = true;

        Client.rooms.interface.cursor.downTimestamp = performance.now();
        
        Client.rooms.interface.cursor.position = [ event.offsetX, event.offsetY ];
    }).on("mouseup", function() {
        Client.rooms.interface.cursor.down = false;
    }).on("mousemove", function(event) {
        if(!Client.rooms.interface.cursor.down) {
            Client.rooms.interface.cursor.position = [ event.offsetX, event.offsetY ];

            return;
        }

        Client.rooms.interface.entity.offset[0] += (event.offsetX - Client.rooms.interface.cursor.position[0]);
        Client.rooms.interface.entity.offset[1] += (event.offsetY - Client.rooms.interface.cursor.position[1]);

        Client.rooms.interface.cursor.position = [ event.offsetX, event.offsetY ];
    }).on("click", function() {
        if(performance.now() - Client.rooms.interface.cursor.downTimestamp > 250)
            return;

        if(Client.rooms.interface.furniture.place.enabled) {
            Client.rooms.interface.furniture.place.click();
            
            return;
        }

        if(Client.rooms.interface.entity.currentEntity == undefined)
            return;
        
        if(Client.rooms.interface.entity.currentEntity.entity.name == "map")
            Client.socket.messages.send({ OnRoomMapClick: { row: Client.rooms.interface.entity.currentEntity.result.row, column: Client.rooms.interface.entity.currentEntity.result.column } });
    }).on("mouseout", function() {
        Client.rooms.interface.cursor.down = false;

        Client.rooms.interface.cursor.position = [ 0, 0 ];
    });

    const cursor = new Client.rooms.items.furniture(Client.rooms.interface.entity, "HabboRoomCursor", 0);

    cursor.render().then(function() {
        cursor.disable();

        Client.rooms.interface.events.start.push(function() {
            Client.rooms.interface.entity.addEntity(cursor);
        });

        Client.rooms.interface.entity.events.render.push(function() {
            Client.rooms.interface.entity.currentEntity = Client.rooms.interface.entity.getEntity(Client.rooms.interface.cursor.position);
            
            if(Client.rooms.interface.entity.currentEntity == undefined) {
                if(cursor.enabled) {
                    cursor.disable();

                    for(let index in Client.rooms.interface.cursor.events.unhover)
                        Client.rooms.interface.cursor.events.unhover[index]();
                }

                return;
            }
    
            if(Client.rooms.interface.entity.currentEntity.entity.name == "map") {
                const row = parseInt(Client.rooms.interface.entity.currentEntity.result.row), column = parseInt(Client.rooms.interface.entity.currentEntity.result.column), depth = parseInt(Client.rooms.interface.entity.currentEntity.result.depth);

                cursor.setCoordinates(row, column, depth, -2000);

                cursor.enable();

                for(let index in Client.rooms.interface.cursor.events.hover)
                    Client.rooms.interface.cursor.events.hover[index](Client.rooms.interface.entity.currentEntity.result);
            }
        });
    });
};
