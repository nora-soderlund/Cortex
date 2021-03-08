Client.development = new function() {
    this.$element = $("#client-development");

    this.$info = $(
        '<div class="client-development">' +
            'PROJECT CORTEX DEVELOPMENT' +
            '' +
        '</div>'
    ).css({ "left": 0, "right": "initial" }).appendTo(Client.$element);

    this.$server = $('<p></p>').appendTo(this.$info);

    this.$uptime = $('<span></span>').appendTo(this.$server);

    this.$players = $('<span></span>').appendTo(this.$server).css({
        "margin-left": "6px",
        "float": "right"
    });
    

    this.$stats = $(
        '<div class="client-development">' +
            'PROJECT CORTEX HOBBA ACCESS' +
        '</div>'
    ).appendTo(Client.$element);

    this.$debug = $('<p></p>').appendTo(this.$stats);

    this.$frames = $('<span></span>').appendTo(this.$debug);

    this.$network = $('<span></span>').appendTo(this.$debug).css({
        "margin-left": "6px",
        "float": "right"
    });
};

Client.development.frames = new function() {
    $(window).on("wheel", function(event) {
        if(!event.shiftKey)
            return;
            
        const direction = (event.originalEvent.deltaY < 0)?(1):(-1);
        
        if(!Client.rooms.interface.active)
            return;

        Client.rooms.interface.frameLimit += direction;
    });
};

Client.loader.ready(function() {
    Client.development.furni = new function() {
        const entity = new Client.dialogs.default({
            title: "Loading",
            
            size: {
                width: 400,
                height: 160
            },

            offset: {
                type: "absolute",

                left: "10px",
                top: "50px"
            }
        });

        entity.events.create.push(function() {
        });

        entity.set = async function(furniture) {
            entity.$content.html("");

            const data = await Client.furnitures.get(furniture.data.furniture);

            const depth = await Client.socket.messages.sendCall({ OnFurnitureDepthRequest: data.id }, "OnFurnitureDepthRequest");
            
            $(
                '<div class="dialog-property">' +
                    '<p>' +
                        '<b>Furniture Depth</b>' +
                        '<span>How high the furniture is in units!</span>' + 
                    '</p>' +
                    
                    '<div class="input-pen">' +
                        '<input class="furniture-depth" type="text" placeholder="Enter a furniture depth..." value="' + depth + '">' +
                    '</div>' + 
                '</div>'
            ).appendTo(entity.$content).find(".furniture-depth").on("change", async function() {
                await Client.socket.messages.sendCall({ Temp_DevFurniUpdate: { id: data.id, depth: parseFloat($(this).val()) } }, "Temp_DevFurniUpdate");
            });

            const logic = await Client.socket.messages.sendCall({ OnFurnitureLogicRequest: data.id }, "OnFurnitureLogicRequest");
            
            $(
                '<div class="dialog-property">' +
                    '<p>' +
                        '<b>Furniture Logic</b>' +
                        '<span>What logic does the use on the server?</span><br>' + 
                        '<i>Changing this can cause unwanted alterations!</i>' + 
                    '</p>' +
                    
                    '<div class="input-pen">' +
                        '<input class="furniture-logic" type="text" placeholder="Enter a furniture logic..." value="' + logic + '">' +
                    '</div>' + 
                '</div>'
            ).appendTo(entity.$content).find(".furniture-logic").on("change", async function() {
                await Client.socket.messages.sendCall({ Temp_DevFurniUpdate: { id: data.id, logic: $(this).val() } }, "Temp_DevFurniUpdate");
            });

            Client.development.furni.unpause();

            entity.setTitle('HabboFurnitures/' + data.line + '/' + data.id);
        };

        entity.show();
        
        entity.pause();

        return entity;
    };

    Client.rooms.interface.cursor.events.click.push(function(entity) {
        if(entity == undefined || entity.entity.name != "furniture") {
            Client.development.furni.pause();
            
            return;
        }
        
        Client.development.furni.set(entity.entity);
    });
});

Client.loader.ready(function() {
    Client.development.shop = new function() {
        const entity = new Client.dialogs.default({
            title: "Loading",
            
            size: {
                width: 400,
                height: 80
            },

            offset: {
                type: "absolute",

                left: "10px",
                top: "250px"
            }
        });

        entity.events.create.push(function() {
        });

        entity.set = async function(page) {
            entity.$content.html("");

            $(
                '<div class="dialog-property">' +
                    '<p>' +
                        '<b>Shop Icon</b>' +
                        '<span>What icon identifier the page uses!</span>' + 
                    '</p>' +
                    
                    '<div class="input-pen">' +
                        '<input class="page-icon" type="text" placeholder="Enter a page icon..." value="' + page.icon + '">' +
                    '</div>' + 
                '</div>'
            ).appendTo(entity.$content).find(".page-icon").on("change", async function() {
                const icon = parseInt($(this).val());

                await Client.socket.messages.sendCall({ Temp_DevShopUpdate: { id: page.id, icon: icon } }, "Temp_DevShopUpdate");

                page.icon = icon;

                Client.shop.setPage(page.parent);
                Client.shop.setPage(page.id);
            });

            Client.development.shop.unpause();

            entity.setTitle('HabboShopPages/' + page.title);
        };

        entity.show();
        
        entity.pause();

        return entity;
    };
});
