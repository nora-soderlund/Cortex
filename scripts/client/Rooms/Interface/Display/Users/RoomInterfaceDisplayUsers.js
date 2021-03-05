Client.rooms.interface.display.users = new function() {
    this.tabs = new function() {
        this.entity = undefined;

        this.$element = $('<div class="room-interface-user"></div>').appendTo(Client.rooms.interface.$element);

        this.click = function(entity) {
            this.$element.html(
                '<div class="room-interface-user-header">' + entity.entity.data.name + '</div>' +
                '<div class="room-interface-user-content"></div>' +
                '<div class="room-interface-user-footer"></div>' +
                
                '<div class="room-interface-user-arrow"></div>'
            );

            this.$content = this.$element.find(".room-interface-user-content");

            this.entity = entity;

            this.show("default");
        };

        this.show = async function(page, previous = "default") {
            this.$content.html("");

            switch(page) {
                case "default": {
                    this.add("Wave", function() {
                        Client.socket.messages.sendCall("OnRoomUserAction", "Wave");

                        this.hide();
                    });

                    if(Client.rooms.interface.data.rights.includes(Client.user.id) && Client.user.id != this.entity.entity.data.id) {
                        this.add("Moderate", function() {
                            Client.rooms.interface.display.users.tabs.show("moderate", "default");
                        });
                    }

                    break;
                }

                case "moderate": {
                    if(Client.user.id == Client.rooms.interface.data.user) {
                        Client.rooms.interface.data.rights = await Client.socket.messages.sendCall("OnRoomRightsUpdate", null);

                        this.add((Client.rooms.interface.data.rights.includes(this.entity.entity.data.id)?("Revoke"):("Grant")) + " Rights", async function() {
                            await Client.socket.messages.sendCall("OnRoomRightsUpdate", {
                                user: Client.rooms.interface.display.users.tabs.entity.entity.data.id
                            });

                            Client.rooms.interface.display.users.tabs.show("moderate", "default");
                        });
                    }

                    break;
                }
            }

            if(page != previous) {
                this.add("Back", function() {
                    Client.rooms.interface.display.users.tabs.show(previous, "default");
                });
            }
        };

        this.add = function(text, click) {
            const $element = $('<div class="room-interface-user-item">' + text + '</div>');
        
            $element.on("click", function() {
                click();
            });

            $element.appendTo(this.$content);
        };

        this.hide = function() {
            this.entity = undefined;

            this.$element.hide();
        };

        this.hover = function() {
            if(this.entity == undefined)
                return;
                
            const center = Client.rooms.interface.entity.center;
            const position = Client.rooms.interface.entity.offset;
    
            const offset = this.entity.sprite.getOffset();
    
            this.$element.css({
                "left": center + position[0] + offset[0],
                "bottom": Client.rooms.interface.$element.height() - (position[1] + offset[1])
            }).show();
        };

        Client.rooms.interface.cursor.events.click.push(function(entity) {
            if(entity == undefined) {
                Client.rooms.interface.display.users.tabs.hide();
                
                return;
            }
    
            Client.rooms.interface.display.users.tabs.click(entity);
        });
    
        Client.rooms.interface.entity.events.render.push(function() {
            Client.rooms.interface.display.users.tabs.hover();
        });
    };

    this.$name = $('<div class="room-interface-user"></div>').appendTo(Client.rooms.interface.$element);

    this.hover = function(entity) {
        if(entity == undefined || entity.entity.name != "figure") {
            this.$name.hide();

            return;
        }

        if(Client.rooms.interface.display.users.tabs.entity != undefined && entity.entity == Client.rooms.interface.display.users.tabs.entity.entity) {
            this.$name.hide();

            return;
        }

        this.$name.html(
            '<div class="room-interface-user-title">' + entity.entity.data.name + '</div>' +
            
            '<div class="room-interface-user-arrow"></div>'
        );

        const center = Client.rooms.interface.entity.center;
        const position = Client.rooms.interface.entity.offset;

        const offset = entity.sprite.getOffset();

        this.$name.css({
            "left": center + position[0] + offset[0],
            "bottom": Client.rooms.interface.$element.height() - (position[1] + offset[1])
        }).show();
    };

    Client.rooms.interface.entity.events.render.push(function() {
        const entity = Client.rooms.interface.entity.currentEntity;

        Client.rooms.interface.display.users.hover(entity);
    });
};
