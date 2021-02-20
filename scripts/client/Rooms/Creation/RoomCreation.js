Client.rooms.creation = new function() {
    const entity = new Client.dialogs.default({
        title: "Room Creation",
        
        size: {
            width: 580,
            height: 310
        },

        offset: {
            type: "center"
        }
    });

    entity.events.create.push(function() {
        entity.$element.css("overflow", "initial");

        entity.$content.addClass("room-creation");
    });

    entity.showProperties = async function() {
        entity.settings.properties = {};

        entity.$content.html("");
        
        const $grid = $('<div class="room-creation-grid"></div>').appendTo(entity.$content);
        
        const $buttons = $('<div class="room-creation-buttons"></div>').appendTo(entity.$content);

        const $information = $('<div class="room-creation-information"></div>').appendTo($grid);

        $(
            '<div class="room-creation-property">' +
                '<p>' +
                    '<b>Room Name</b>' +
                    '<span>Give your room a fun and interesting title, this is what interests others!</span>' + 
                '</p>' +
                
                '<div class="input-pen">' +
                    '<input type="text" class="room-creation-name" placeholder="Enter a room name...">' +
                '</div>' + 
            '</div>'
        ).appendTo($information).find(".room-creation-name").on("change", function() {
            entity.settings.properties.name = $(this).val();
        });

        $(
            '<div class="room-creation-property">' +
                '<p>' +
                    '<b>Room Description</b>' +
                    '<span>Describe what your room is, what can others do in your room, let them know what it is!</span>' + 
                '</p>' +
                
                '<div class="textarea-pen">' +
                    '<textarea type="text" class="room-creation-description" placeholder="Enter a room name..."></textarea>' +
                '</div>' + 
            '</div>'
        ).appendTo($information).find(".room-creation-description").on("change", function() {
            entity.settings.properties.description = $(this).val();
        });

        const $category = $(
            '<div class="room-creation-property">' +
                '<p>' +
                    '<b>Room Category</b>' +
                    '<span>What category does your room fall into?</span>' + 
                '</p>' +
            '</div>'
        ).appendTo($information);

        const list = [];

        const categories = await Client.rooms.categories.get();

        for(let index in categories)
            list.push({ text: categories[index].name, value: categories[index].id });

        const selection = new Client.dialogs.selection("Select a room category...", list);

        $category.append(selection.$element);

        const $privacy = $('<div class="room-creation-privacy"></div>').appendTo($grid);

        const $locks = $(
            '<div class="room-creation-property">' +
                '<p>' +
                    '<b>Room Privacy</b>' +
                    '<span>Select whether you want a public, private, or passworded room!</span>' + 
                '</p>' +

                '<div class="input-lock">' +
                    '<input class="room-creation-password disabled" type="text" placeholder="Enter a room password...">' +
                '</div>' + 
                
                '<div class="room-creation-privacy-selection">' +
                    '<div class="room-creation-privacy-option active" value="0">' + 
                        '<div class="room-creation-privacy-public"></div>' +
                    '</div>' +
                    
                    '<div class="room-creation-privacy-option" value="1">' + 
                        '<div class="room-creation-privacy-private"></div>' +
                    '</div>' +

                    '<div class="room-creation-privacy-option" value="2">' + 
                        '<div class="room-creation-privacy-password"></div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo($privacy);


        const $password = $locks.find(".room-creation-password");

        $locks.find(".room-creation-privacy-option").on("click", function() {
            $locks.find(".room-creation-privacy-option.active").removeClass("active");

            $(this).addClass("active");

            if($(this).attr("value") != 2)
                $password.addClass("disabled");
            else
                $password.removeClass("disabled");
        });

        const $continue = $('<div class="dialog-button">Continue »</div>').appendTo($buttons);

        $continue.click(function() {
            Client.rooms.creation.showMap();
        });
    };

    entity.showMap = async function() {
        entity.$content.html("");

        entity.settings.map = {};
        
        const models = await Client.socket.messages.sendCall({ OnRoomModelsUpdate: null }, "OnRoomModelsUpdate");
        
        const tabs = new Client.dialogs.tabs(243);

        tabs.add("default", "Default Maps", function($element) {
            const $models = $('<div class="room-creation-models"></div>').appendTo($element);

            for(let index in models) {
                const map = models[index].map.split('|');

                let tiles = 0;

                for(let row in map)
                for(let column in map[row]) {
                    if(map[row][column] != 'X')
                        tiles++;
                }

                const $element = $(
                    '<div class="dialog-item room-creation-model">' +
                        '<p class="room-creation-model-tiles">' + tiles + ' tiles</div>' +
                    '</div>'
                ).appendTo($models);

                const $canvas = new Client.rooms.creation.map(map, models[index].door).prependTo($element);
            } 
        });

        tabs.add("editor", "Map Editor");

        tabs.show("default");

        tabs.$element.appendTo(entity.$content);

        const $buttons = $('<div class="room-creation-buttons"></div>').appendTo(entity.$content);
            
        $('<div class="dialog-button">« Back</div>').appendTo($buttons).on("click", function() {
            entity.showProperties();
        });

        const $continue = $('<div class="dialog-button">Continue »</div>').appendTo($buttons);
    };

    entity.events.show.push(function() {
        Client.rooms.navigator.hide();

        entity.settings = {};
        
        entity.showProperties();
    });

    return entity;
};
