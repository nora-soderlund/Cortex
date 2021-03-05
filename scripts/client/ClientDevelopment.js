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
                width: 340,
                height: 80
            },

            offset: {
                type: "absolute",

                left: "12.5%",
                top: "12.5%"
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

            console.log(data);

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
