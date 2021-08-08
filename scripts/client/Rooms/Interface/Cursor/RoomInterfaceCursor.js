Client.rooms.interface.cursor = new function() {
    this.down = false;
    this.downTimestamp = 0;
    this.downFrame = 0;

    this.position = null;

    this.events = {
        hover: [],
        unhover: [],
        click: [],
        doubleclick: []
    };

    Client.rooms.interface.entity.$canvas.on("mousedown", function(event) {
        Client.rooms.interface.cursor.down = true;

        Client.rooms.interface.cursor.downTimestamp = performance.now();
        
        Client.rooms.interface.cursor.position = [ event.offsetX, event.offsetY ];

        if(Client.rooms.interface.frameLimit != 0) {
            Client.rooms.interface.cursor.downFrame = Client.rooms.interface.frameLimit;

            Client.rooms.interface.frameLimit = 0;
        }
    }).on("mouseup", function() {
        Client.rooms.interface.cursor.down = false;

        Client.rooms.interface.frameLimit = Client.rooms.interface.cursor.downFrame;
    }).on("mousemove", function(event) {
        if(Client.rooms.interface.entity.currentEntity != undefined && Client.rooms.interface.cursor.down)
            Client.rooms.interface.entity.currentEntity.sprite.mousedown(event);

        if(!Client.rooms.interface.cursor.down || (Client.keys.down["ControlLeft"] || Client.keys.down["ShiftLeft"] || Client.keys.down["AltLeft"])) {
            Client.rooms.interface.cursor.position = [ event.offsetX, event.offsetY ];

            return;
        }

        Client.rooms.interface.entity.offset[0] += (event.offsetX - Client.rooms.interface.cursor.position[0]);
        Client.rooms.interface.entity.offset[1] += (event.offsetY - Client.rooms.interface.cursor.position[1]);

        Client.rooms.interface.cursor.position = [ event.offsetX, event.offsetY ];
    }).on("touchstart", function(event) {
        Client.rooms.interface.cursor.position = [ event.touches[0].clientX, event.touches[0].clientY ];

        Client.rooms.interface.cursor.down = true;
    }).on("touchmove", function(event) {
        if(Client.rooms.interface.cursor.position == null)
            Client.rooms.interface.cursor.position = [ event.touches[0].clientX, event.touches[0].clientY ];

        if(!Client.rooms.interface.cursor.down)
            return;

        Client.rooms.interface.entity.offset[0] += (event.touches[0].clientX - Client.rooms.interface.cursor.position[0]);
        Client.rooms.interface.entity.offset[1] += (event.touches[0].clientY - Client.rooms.interface.cursor.position[1]);

        Client.rooms.interface.cursor.position = [ event.touches[0].clientX, event.touches[0].clientY ];
    }).on("touchend", function(event) {
        Client.rooms.interface.cursor.down = false;
    }).on("dblclick", function(event) {
        if(Client.rooms.interface.furniture.place.enabled)
            return;

        if(Client.rooms.interface.entity.currentEntity != undefined)
            Client.rooms.interface.entity.currentEntity.sprite.mousedoubleclick(event);
        
        for(let index in Client.rooms.interface.cursor.events.doubleclick)
            Client.rooms.interface.cursor.events.doubleclick[index](Client.rooms.interface.entity.currentEntity, event);
    }).on("click", function(event) {
        if(performance.now() - Client.rooms.interface.cursor.downTimestamp > 250)
            return;

        if(Client.rooms.interface.furniture.place.enabled) {
            Client.rooms.interface.furniture.place.click();
            
            return;
        }

        if(Client.rooms.interface.entity.currentMapEntity != undefined) {
            if(!(Client.keys.down["ControlLeft"] || Client.keys.down["ShiftLeft"] || Client.keys.down["AltLeft"]))
                Client.socket.messages.send({ OnRoomMapClick: { row: Client.rooms.interface.entity.currentMapEntity.result.row, column: Client.rooms.interface.entity.currentMapEntity.result.column } });
        }

        if(Client.rooms.interface.entity.currentEntity != undefined)
            Client.rooms.interface.entity.currentEntity.sprite.mouseclick(event);
        
        for(let index in Client.rooms.interface.cursor.events.click)
            Client.rooms.interface.cursor.events.click[index](Client.rooms.interface.entity.currentEntity, event);
    }).on("mouseout", function() {
        Client.rooms.interface.cursor.down = false;

        Client.rooms.interface.cursor.position = [ 0, 0 ];
    });

    const cursor = new Client.rooms.items.furniture(Client.rooms.interface.entity, "HabboRoomCursor", 0);
    cursor.name = "cursor";
    cursor.render();
    cursor.disable();

    Client.rooms.interface.events.start.push(function() {
        Client.rooms.interface.entity.addEntity(cursor);
    });

    Client.rooms.interface.entity.events.render.push(function() {
        Client.rooms.interface.entity.currentMapEntity = Client.rooms.interface.entity.getEntity(Client.rooms.interface.cursor.position, "map");
        
        if(Client.rooms.interface.entity.currentMapEntity == undefined) {
            if(cursor.enabled) {
                cursor.disable();

                for(let index in Client.rooms.interface.cursor.events.unhover)
                    Client.rooms.interface.cursor.events.unhover[index]();
            }
        }
        else {
            const row = parseInt(Client.rooms.interface.entity.currentMapEntity.result.row), column = parseInt(Client.rooms.interface.entity.currentMapEntity.result.column), depth = Math.round(Client.rooms.interface.entity.currentMapEntity.result.depth);

            cursor.setCoordinates(row, column, depth, -2000);
            cursor.enable();

            for(let index in Client.rooms.interface.cursor.events.hover)
                Client.rooms.interface.cursor.events.hover[index]({ row, column, depth });
        }

        Client.rooms.interface.entity.currentEntity = Client.rooms.interface.entity.getEntity(Client.rooms.interface.cursor.position);
    });
};
