RoomInterface.display = new function() {
    this.$element = $(
        '<div class="room-interface-display">' +
            '<div class="room-interface-display-content"></div>' +

            '<div class="room-interface-display-buttons"></div>' + 
        '</div>'
    ).hide().appendTo(RoomInterface.$element);

    this.$content = this.$element.find(".room-interface-display-content");
    this.$buttons = this.$element.find(".room-interface-display-buttons");

    this.addButton = function(text, click) {
        const $element = $('<div class="room-interface-display-button">' + text + '</div>').appendTo(this.$buttons);
+
        $element.click(click);
    };

    this.figure = async function(entity) {
        this.entity = entity;

        this.$element.hide();

        this.$content.html("");
        this.$buttons.html("");

        const $header = $('<div class="room-interface-display-title">' + entity.data.name + '</div>').appendTo(this.$content);

        $('<div class="room-interface-display-break"></div>').appendTo(this.$content);

        const $grid = $('<div class="room-interface-display-grid"></div>').appendTo(this.$content);

        const $figure = $('<div class="room-interface-display-figure room-interface-display-bot"></div>').appendTo($grid);

        const $canvas = $('<canvas width="256" height="256"></canvas>').appendTo($figure);

        new FigureRenderer(entity.data.figure, { direction: 4 }, $canvas);

        const $badges = $('<div class="room-interface-display-badges"></div>').appendTo($grid);

        const $badge = [];

        $badge[0] = $('<div class="room-interface-display-badge"></div>').appendTo($badges);

        $('<div class="room-interface-display-group"></div>').appendTo($badges);

        for(let index = 1; index < 5; index++)
            $badge[index] = $('<div class="room-interface-display-badge"></div>').appendTo($badges);

        SocketMessages.sendCall({ OnUserBadgeRequest: entity.data.id }, "OnUserBadgeRequest").then(function(badges) {
            for(let index in badges)
                (new BadgeRenderer(badges[index].badge)).appendTo($badge[index]);
        });

        this.$element.show();
    };

    this.furniture = async function(entity) {
        this.entity = entity;

        this.$element.hide();

        this.$content.html("");
        this.$buttons.html("");

        const furniture = await Furnitures.get(entity.furniture.settings.id);

        const $header = $('<div class="room-interface-display-title">' + furniture.title + '</div>').appendTo(this.$content);

        $('<div class="room-interface-display-break"></div>').appendTo(this.$content);

        const $canvas = $('<canvas class="room-interface-display-canvas"></canvas>').appendTo(this.$content);

        if(furniture.description.length != 0) {
            $('<div class="room-interface-display-break"></div>').appendTo(this.$content);

            $('<div class="room-interface-display-description">' + furniture.description + '</div>').appendTo(this.$content);
        }

        new FurnitureRenderer({ id: furniture.id, direction: 4 }, $canvas, "rgb(28, 28, 26)");

        if(RoomInterface.data.rights.includes(Client.user.id) || entity.data.user == Client.user.id) {
            this.addButton("Pickup", function() {
                RoomInterface.furniture.pickup.start(entity);
            });
        }

        if(RoomInterface.data.rights.includes(Client.user.id)) {
            this.addButton("Rotate", function() {
                RoomInterface.furniture.rotate.start(entity);
            });
            
            this.addButton("Move", function() {
                RoomInterface.furniture.move.start(entity);
            });

            if(RoomInterface.furniture.logics[entity.furniture.types.logic] != undefined) {
                this.addButton("Use", function() {
                    RoomInterface.furniture.use.start(entity);
                });
            }
        }

        this.$element.show();
    };

    this.hide = function() {
        RoomInterface.display.entity = undefined;
        
        RoomInterface.display.$element.hide();
    };

    RoomInterface.cursor.events.click.push(function(entity) {
        if(entity == undefined) {
            RoomInterface.display.hide();
            
            return;
        }

        switch(entity.entity.name) {
            case "furniture":
                RoomInterface.display.furniture(entity.entity);

                break;

            case "figure":
                RoomInterface.display.figure(entity.entity);

                break;
        }
    });
};
