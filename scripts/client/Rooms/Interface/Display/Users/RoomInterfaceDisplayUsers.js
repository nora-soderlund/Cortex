RoomInterface.display.users = new function() {
    this.tabs = new function() {
        this.entity = undefined;

        this.$element = $('<div class="room-interface-user"></div>').appendTo(RoomInterface.$element);

        this.click = function(entity) {
            this.$element.html(
                '<div class="room-interface-user-header">' + entity.entity.data.name + '</div>' +
                '<div class="room-interface-user-content"></div>' +
                '<div class="room-interface-user-footer"></div>' +
                
                '<div class="room-interface-user-arrow"></div>'
            );

            if(Client.theme.get("rooms/interface/tabs/figure", false) == true) {
                this.$canvas = $('<canvas class="room-interface-user-figure" width="256" height="256"></canvas>').appendTo(this.$element);

                entity.entity.figure.events.render.push(this.render);
            }

            this.$content = this.$element.find(".room-interface-user-content");

            this.entity = entity;

            this.show("default");
        };

        this.render = function(sprites) {
            const entity = RoomInterface.display.users.tabs;

            const context = entity.$canvas[0].getContext("2d");

            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            for(let index in sprites)
                context.drawImage(sprites[index].image, sprites[index].left, sprites[index].top);
        };

        this.show = async function(page, previous = "default") {
            this.$content.html("");

            switch(page) {
                case "default": {
                    if(Client.user.id == this.entity.entity.data.id) {
                        this.add("Actions", function() {
                            RoomInterface.display.users.tabs.show("actions", "default");
                        });
                    }
                    else {
                        this.add("Manage", function() {
                            RoomInterface.display.users.tabs.show("manage", "default");
                        });
                    }

                    if(RoomInterface.data.rights.includes(Client.user.id) && Client.user.id != this.entity.entity.data.id) {
                        this.add("Moderate", function() {
                            RoomInterface.display.users.tabs.show("moderate", "default");
                        });
                    }

                    break;
                }

                case "manage": {
                    const friend = Client.user.friends[this.entity.entity.data.id];

                    if(friend != undefined) {
                        if(friend.status == -1) {
                            this.add("Cancel Friend Invite", async function() {
                                await SocketMessages.sendCall({ OnUserFriendRemove: { user: RoomInterface.display.users.tabs.entity.entity.data.id } }, "OnUserFriendRemove");
    
                                RoomInterface.display.users.tabs.hide();
                            });
                        }
                        else if(friend.status == 0) {
                            this.add("Accept Friend Invite", async function() {
                                await SocketMessages.sendCall({ OnUserFriendAdd: { user: RoomInterface.display.users.tabs.entity.entity.data.id } }, "OnUserFriendAdd");
    
                                RoomInterface.display.users.tabs.hide();
                            });
                        }
                        else {
                            this.add("Remove Friend Invite", async function() {
                                await SocketMessages.sendCall({ OnUserFriendRemove: { user: RoomInterface.display.users.tabs.entity.entity.data.id } }, "OnUserFriendRemove");
    
                                RoomInterface.display.users.tabs.hide();
                            });
                        }
                    }
                    else {
                        this.add("Send Friend Invite", async function() {
                            await SocketMessages.sendCall({ OnUserFriendAdd: { user: RoomInterface.display.users.tabs.entity.entity.data.id } }, "OnUserFriendAdd");

                            RoomInterface.display.users.tabs.hide();
                        });
                    }

                    break;
                }

                case "actions": {
                    this.add("Wave", function() {
                        SocketMessages.sendCall({ OnRoomUserAction: "Wave" }, "OnRoomUserAction");

                        RoomInterface.display.users.tabs.hide();
                    });
                    
                    this.add("Blow", function() {
                        SocketMessages.sendCall({ OnRoomUserAction: "Blow" }, "OnRoomUserAction");

                        RoomInterface.display.users.tabs.hide();
                    });

                    this.add("Laugh", function() {
                        SocketMessages.sendCall({ OnRoomUserAction: "Laugh" }, "OnRoomUserAction");

                        RoomInterface.display.users.tabs.hide();
                    });

                    this.add("Idle", function() {
                        SocketMessages.sendCall({ OnRoomUserAction: "Idle" }, "OnRoomUserAction");

                        RoomInterface.display.users.tabs.hide();
                    });

                    break;
                }

                case "moderate": {
                    if(Client.user.id == RoomInterface.data.user) {
                        RoomInterface.data.rights = await SocketMessages.sendCall({ OnRoomRightsUpdate: null }, "OnRoomRightsUpdate");

                        this.add((RoomInterface.data.rights.includes(this.entity.entity.data.id)?("Revoke"):("Grant")) + " Rights", async function() {
                            await SocketMessages.sendCall({ OnRoomRightsUpdate: { user: RoomInterface.display.users.tabs.entity.entity.data.id } }, "OnRoomRightsUpdate");

                            RoomInterface.display.users.tabs.show("moderate", "default");
                        });
                    }

                    break;
                }
            }

            if(page != previous) {
                this.add("Back", function() {
                    RoomInterface.display.users.tabs.show(previous, "default");
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
            if(this.$canvas != undefined) {
                const index = this.entity.entity.figure.events.render.indexOf(this.render);

                this.entity.entity.figure.events.render.splice(index, 1);

                this.$canvas.remove();

                delete this.$canvas;
            }

            this.entity = undefined;

            this.$element.hide();
        };

        this.hover = function() {
            if(this.entity == undefined)
                return;
                
            const center = RoomInterface.entity.center;
            const position = RoomInterface.entity.offset;
    
            const offset = this.entity.entity.getOffset();
    
            this.$element.css({
                "left": center + position[0] + offset[0],
                "bottom": RoomInterface.$element.height() - (position[1] + offset[1])
            }).show();
        };

        RoomInterface.cursor.events.click.push(function(entity) {
            if(entity == undefined || entity.entity.name != "figure") {
                RoomInterface.display.users.tabs.hide();
                
                return;
            }
    
            RoomInterface.display.users.tabs.hide();
            RoomInterface.display.users.tabs.click(entity);
        });
    
        RoomInterface.entity.events.render.push(function() {
            RoomInterface.display.users.tabs.hover();
        });
    };

    this.request = function(entity) {
        const $element = $(
            '<div class="room-interface-user room-interface-user-request">' +
                '<div class="user-profile" data-user="' + entity.data.id + '"><i class="sprite-user-profile"></i> <b>Friend request from ' + entity.data.name + '</b></div>' +

                '<div class="room-interface-user-request-close"></div>' +

                '<div class="room-interface-user-request-buttons">' +
                    '<div class="room-interface-user-request-decline dialog-button">Decline</div>' +
                    '<div class="room-interface-user-request-accept dialog-button"><i class="sprite-success"></i> Accept</div>' +
                '</div>' +

                '<div class="room-interface-user-arrow"></div>' +
            '</div>').appendTo(RoomInterface.$element);

        $element.find(".room-interface-user-request-close").on("click", function() {
            destroy();
        });

        $element.find(".room-interface-user-request-decline").on("click", async function() {
            await SocketMessages.sendCall({ OnUserFriendRemove: { user: entity.data.id } }, "OnUserFriendRemove");

            destroy();
        });

        $element.find(".room-interface-user-request-accept").on("click", async function() {
            await SocketMessages.sendCall({ OnUserFriendAdd: { user: entity.data.id } }, "OnUserFriendUpdate");

            destroy();
        });

        function destroy() {
            const index = RoomInterface.entity.events.render.indexOf(hover);
            
            RoomInterface.entity.events.render.splice(index, 1);

            $element.remove();
        };

        this.destroy = destroy;

        function hover() {
            const center = RoomInterface.entity.center;
            const position = RoomInterface.entity.offset;
    
            const offset = entity.getOffset();
    
            $element.css({
                "left": center + position[0] + offset[0],
                "bottom": RoomInterface.$element.height() - (position[1] + offset[1])
            }).show();
        };
    
        RoomInterface.entity.events.render.push(hover);
    };

    this.$name = $('<div class="room-interface-user"></div>').appendTo(RoomInterface.$element);

    this.hover = function(entity) {
        if(entity == undefined || entity.entity.name != "figure") {
            this.$name.hide();

            return;
        }

        if(RoomInterface.display.users.tabs.entity != undefined && entity.entity == RoomInterface.display.users.tabs.entity.entity) {
            this.$name.hide();

            return;
        }

        this.$name.html(
            '<div class="room-interface-user-title">' + entity.entity.data.name + '</div>' +
            
            '<div class="room-interface-user-arrow"></div>'
        );

        const center = RoomInterface.entity.center;
        const position = RoomInterface.entity.offset;

        const offset = entity.entity.getOffset();

        this.$name.css({
            "left": center + position[0] + offset[0],
            "bottom": RoomInterface.$element.height() - (position[1] + offset[1])
        }).show();
    };

    RoomInterface.entity.events.render.push(function() {
        const entity = RoomInterface.entity.currentEntity;

        RoomInterface.display.users.hover(entity);
    });

    RoomInterface.events.stop.push(function() {
        RoomInterface.display.users.tabs.hide();

        for(let id in RoomInterface.users)
            if(RoomInterface.users[id].request != undefined)
                RoomInterface.users[id].request.destroy();
    });
};
