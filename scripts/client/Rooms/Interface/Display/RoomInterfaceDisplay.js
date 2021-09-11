RoomInterface.display = new function() {
    this.element = document.createElement("div");
    this.element.className = "room-interface-display";
    this.element.innerHTML = `
        <div class="room-interface-display-content"></div>

        <div class="room-interface-display-buttons"></div> 
    `;
    this.element.style.display = "none";
    RoomInterface.element.append(this.element);

    this.content = this.element.querySelector(".room-interface-display-content");
    this.buttons = this.element.querySelector(".room-interface-display-buttons");

    this.addButton = function(text, click) {
        const element = document.createElement("div");
        element.className = "room-interface-display-button";
        element.innerHTML = text;
        this.buttons.append(element);
+
        element.click(click);
    };

    this.figure = async function(entity) {
        this.entity = entity;

        this.element.style.display = "none";

        this.content.innerHTML = `
            <div class="room-interface-display-title">${entity.data.name}</div>

            <div class="room-interface-display-break"></div>

            <div class="room-interface-display-grid">
                <div class="room-interface-display-figure room-interface-display-bot">
                    <canvas width="256" height="256"></canvas>
                </div>

                <div class="room-interface-display-badges"></div>
            </div>
        `;
        this.buttons.innerHTML = "";

        const grid = this.content.querySelector(".room-interface-display-grid");

        const figure = grid.querySelector(".room-interface-display-figure");

        const canvas = figure.querySelector("canvas");

        new FigureRenderer(entity.data.figure, { direction: 4 }, canvas);

        const badges = grid.querySelector(".room-interface-display-badges");

        const badge = [];

        badge[0] = document.createElement("div");
        badge[0].className = "room-interface-display-badge";
        badges.append(badge[0]);

        const group = document.createElement("div");
        group.className = "room-interface-display-group";
        badges.append(group);

        for(let index = 1; index < 5; index++) {
            badge[index] = document.createElement("div");
            badge[index].className = "room-interface-display-badge";
            badges.append(badge[index]);
        }

        SocketMessages.sendCall({ OnUserBadgeRequest: entity.data.id }, "OnUserBadgeRequest").then(function(badges) {
            for(let index in badges)
            badge[index].append(new BadgeRenderer(badges[index].badge));
        });

        this.element.style.display = "block";
    };

    this.furniture = async function(entity) {
        this.entity = entity;

        this.element.style.display = "none";

        const furniture = await Furnitures.get(entity.furniture.settings.id);

        this.content.innerHTML = `
            <div class="room-interface-display-title">${furniture.title}</div>

            <div class="room-interface-display-break"></div>

            <canvas class="room-interface-display-canvas"></canvas>
        `;
        this.buttons.innerHTML = "";

        const canvas = this.content.querySelector(".room-interface-display-canvas");

        if(furniture.description.length != 0) {
            this.content.innerHTML += `
                <div class="room-interface-display-break"></div>

                <div class="room-interface-display-description">${furniture.description}</div>
            `;
        }

        new FurnitureRenderer({ id: furniture.id, direction: 4 }, canvas, "rgb(28, 28, 26)");

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

        this.element.style.display = "block";
    };

    this.hide = function() {
        RoomInterface.display.entity = undefined;
        
        RoomInterface.display.element.style.display = "none";
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
