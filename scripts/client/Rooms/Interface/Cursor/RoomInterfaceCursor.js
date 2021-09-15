RoomInterface.cursor = new function() {
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

    RoomInterface.entity.canvas.canvas.addEventListener("mousedown", (event) => {
        RoomInterface.cursor.down = true;

        RoomInterface.cursor.downTimestamp = performance.now();
        
        RoomInterface.cursor.position = [ event.offsetX, event.offsetY ];

        if(RoomInterface.frameLimit != 0) {
            RoomInterface.cursor.downFrame = RoomInterface.frameLimit;

            RoomInterface.frameLimit = 0;
        }
    });

    RoomInterface.entity.canvas.canvas.addEventListener("mouseup", () => {
        RoomInterface.cursor.down = false;

        RoomInterface.frameLimit = RoomInterface.cursor.downFrame;
    });
    
    RoomInterface.entity.canvas.canvas.addEventListener("mousemove", (event) => {
        if(RoomInterface.entity.currentEntity != undefined && RoomInterface.cursor.down)
            RoomInterface.entity.currentEntity.sprite.mousedown(event);

        if(!RoomInterface.cursor.down || (Keys.down["ControlLeft"] || Keys.down["ShiftLeft"] || Keys.down["AltLeft"])) {
            RoomInterface.cursor.position = [ event.offsetX, event.offsetY ];

            return;
        }

        //RoomInterface.entity.offset[0] += (event.offsetX - RoomInterface.cursor.position[0]);
        //RoomInterface.entity.offset[1] += (event.offsetY - RoomInterface.cursor.position[1]);

        RoomInterface.cursor.position = [ event.offsetX, event.offsetY ];
    });
    
    RoomInterface.entity.canvas.canvas.addEventListener("touchstart", (event) => {
        RoomInterface.cursor.position = [ event.touches[0].clientX, event.touches[0].clientY ];

        RoomInterface.cursor.down = true;
    });
    
    RoomInterface.entity.canvas.canvas.addEventListener("touchmove", (event) => {
        if(RoomInterface.cursor.position == null)
            RoomInterface.cursor.position = [ event.touches[0].clientX, event.touches[0].clientY ];

        if(!RoomInterface.cursor.down)
            return;

        RoomInterface.entity.offset.left += (event.touches[0].clientX - RoomInterface.cursor.position[0]);
        RoomInterface.entity.offset.top += (event.touches[0].clientY - RoomInterface.cursor.position[1]);

        RoomInterface.cursor.position = [ event.touches[0].clientX, event.touches[0].clientY ];
    });
    
    RoomInterface.entity.canvas.canvas.addEventListener("touchend", (event) => {
        RoomInterface.cursor.down = false;
    });
    
    RoomInterface.entity.canvas.canvas.addEventListener("dblclick", (event) => {
        if(RoomInterface.furniture.place.enabled)
            return;

        if(RoomInterface.entity.currentEntity != undefined)
            RoomInterface.entity.currentEntity.sprite.mousedoubleclick(event);
        
        for(let index in RoomInterface.cursor.events.doubleclick)
            RoomInterface.cursor.events.doubleclick[index](RoomInterface.entity.currentEntity, event);
    });
    
    RoomInterface.entity.canvas.canvas.addEventListener("click", (event) => {
        if(performance.now() - RoomInterface.cursor.downTimestamp > 250)
            return;

        if(RoomInterface.furniture.place.enabled) {
            RoomInterface.furniture.place.click();
            
            return;
        }

        if(RoomInterface.entity.currentMapEntity != undefined) {
            if(!(Keys.down["ControlLeft"] || Keys.down["ShiftLeft"] || Keys.down["AltLeft"]))
                SocketMessages.send({ OnRoomMapClick: { row: RoomInterface.entity.currentMapEntity.result.row, column: RoomInterface.entity.currentMapEntity.result.column } });
        }

        if(RoomInterface.entity.currentEntity != undefined)
            RoomInterface.entity.currentEntity.sprite.mouseclick(event);
        
        for(let index in RoomInterface.cursor.events.click)
            RoomInterface.cursor.events.click[index](RoomInterface.entity.currentEntity, event);
    });
    
    RoomInterface.entity.canvas.canvas.addEventListener("mouseout", () => {
        RoomInterface.cursor.down = false;

        RoomInterface.cursor.position = [ 0, 0 ];
    });

    const cursor = new Client.rooms.items.furniture(RoomInterface.entity, "HabboRoomCursor", 0);
    cursor.name = "cursor";
    cursor.render();
    cursor.disable();

    RoomInterface.events.start.push(function() {
        RoomInterface.entity.addEntity(cursor);
    });

    RoomInterface.entity.events.render.push(function() {
        RoomInterface.entity.currentMapEntity = RoomInterface.entity.getEntity(RoomInterface.cursor.position, "map");
        
        if(RoomInterface.entity.currentMapEntity == undefined) {
            if(cursor.enabled) {
                cursor.disable();

                for(let index in RoomInterface.cursor.events.unhover)
                    RoomInterface.cursor.events.unhover[index]();
            }
        }
        else {
            const row = parseInt(RoomInterface.entity.currentMapEntity.result.row), column = parseInt(RoomInterface.entity.currentMapEntity.result.column), depth = Math.round(RoomInterface.entity.currentMapEntity.result.depth);

            cursor.setCoordinates(row, column, depth, -2000);
            cursor.enable();

            for(let index in RoomInterface.cursor.events.hover)
                RoomInterface.cursor.events.hover[index]({ row, column, depth });
        }

        RoomInterface.entity.currentEntity = RoomInterface.entity.getEntity(RoomInterface.cursor.position);
    });
};
