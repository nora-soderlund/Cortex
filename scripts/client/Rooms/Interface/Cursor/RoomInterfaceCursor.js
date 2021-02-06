Client.rooms.interface.cursor = new function() {
    this.down = false;
    this.downTimestamp = 0;

    this.position = null;

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

        if(Client.rooms.interface.entity.currentEntity == undefined)
            return;
        
        if(Client.rooms.interface.entity.currentEntity.entity.name == "floormap")
            Client.socket.messages.send({ OnRoomMapClick: { row: Client.rooms.interface.entity.currentEntity.result.row, column: Client.rooms.interface.entity.currentEntity.result.column } });
    });

    const cursor = Client.rooms.items.cursor(Client.rooms.interface.entity);

    cursor.render().then(function() {
        Client.rooms.interface.entity.events.render.push(function() {
            Client.rooms.interface.entity.removeEntity(cursor);
    
            Client.rooms.interface.entity.currentEntity = Client.rooms.interface.entity.getEntity(Client.rooms.interface.cursor.position);
            
            if(Client.rooms.interface.entity.currentEntity == undefined)
                return;
    
            if(Client.rooms.interface.entity.currentEntity.entity.name == "floormap") {
                cursor.setCoordinates(parseInt(Client.rooms.interface.entity.currentEntity.result.row), parseInt(Client.rooms.interface.entity.currentEntity.result.column), parseInt(Client.rooms.interface.entity.currentEntity.result.depth), -2000);
                
                Client.rooms.interface.entity.addEntity(cursor);
            }
        });
    });
};
