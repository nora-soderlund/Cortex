Client.rooms.interface = function($parent) {
    this.$element = $('<div class="room"></div>').prependTo($parent);

    this.setBackground = function(color) {
        this.$element.css("background", color);
    };

    this.addEntity = function(entity) {
        this.entity = entity;

        this.entity.$canvas.prependTo(this.$element);
    };

    this.addMouseEvents = async function() {
        if(this.entity == undefined) {
            console.error("[%cRoomInterface%c]%c Cannot register mouse events, there's no room entity!", "color: darkred", "color: inherit", "color: lightblue");

            return;
        }

        const entity = this.entity;

        let mousePosition = undefined;

        let mouseDragging = false;

        this.entity.$canvas.bind("mousedown", function(event) {
            if(mouseDragging == true)
                return;
            
            mousePosition = [ event.offsetX, event.offsetY ];

            mouseDragging = true;
        }).bind("mousemove", function(event) {
            if(mouseDragging == false) {
                mousePosition = [ event.offsetX, event.offsetY ];

                return;
            }

            entity.offset[0] += event.offsetX - mousePosition[0];
            entity.offset[1] += event.offsetY - mousePosition[1];
            
            mousePosition = [ event.offsetX, event.offsetY ];
        }).bind("mouseup", function(event) {
            if(mouseDragging == false)
                return;
            
            mouseDragging = false;
        }).bind("mouseout", function(event) {
            if(mouseDragging == false)
                return;
            
            mouseDragging = false;
        });

        const cursor = Client.rooms.items.cursor(entity);

        await cursor.render();

        this.entity.events.render.push(function() {
            entity.removeEntity(cursor);

            entity.currentEntity = entity.getEntity(mousePosition);
            
            if(entity.currentEntity == undefined)
                return;

            if(entity.currentEntity.entity.name == "floormap") {
                cursor.setCoordinates(parseInt(entity.currentEntity.result.row), parseInt(entity.currentEntity.result.column), parseInt(entity.currentEntity.result.depth), -2000);
                
                entity.addEntity(cursor);
            }
        });
    };

    this.addChat = function(chat) {
        if(this.entity == undefined) {
            console.error("[%cRoomInterface%c]%c Cannot register chat, there's already a chat entity!", "color: darkred", "color: inherit", "color: lightblue");

            return;
        }

        this.chat = chat;

        this.chat.$element.appendTo(this.$element);
    };
};
