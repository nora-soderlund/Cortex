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
            entity.settings.properties.title = $(this).val();
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
        
        const tabs = new Client.dialogs.tabs(231);

        tabs.add("default", "Default Maps", function($element) {
            if(Client.rooms.creation.editor != undefined) {
                Client.rooms.creation.editor.destroy();

                Client.rooms.creation.editor = undefined;
            }

            $element.parent().css("overflow", "auto");

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

                $element.on("click", function() {
                    $models.find(".room-creation-model.active").removeClass("active");

                    $element.addClass("active");

                    entity.settings.map = models[index];
                });

                if(entity.settings.map.id == undefined || entity.settings.map.id == models[index].id)
                    $element.click();
            }
        });

        tabs.add("editor", "Map Editor", function($element) {
            $element.parent().css("overflow", "visible");

            const $grid = $('<div class="room-creation-map"></div>').appendTo($element);

            const $settings = $('<div class="room-creation-properties"></div>').css({
                "display": "grid",

                "padding-bottom": "12px"
            }).appendTo($grid);

            $(
                '<div class="room-creation-property">' +
                    '<p>' +
                        '<b>Map Editor</b>' +
                        '<span>Use your mouse on the renderer to the left!</span><br><br>' +
                        '<span>Hold shift and left click to use the current selected tool on the editor.</span><br><br>' +
                        '<span>Press right click to copy the depth of an existing tile on the editor.</span>' + 
                    '</p>' +
                '</div>'
            ).appendTo($settings);

            const $toolsProperty = $(
                '<div class="room-creation-property">' +
                    '<p>' +
                        '<b>Map Tools</b>' +
                        '<span>Select what tool you want to use on the editor:</span>' + 
                    '</p>' +

                    '<div class="room-creation-editor-tools"></div>' +
                '</div>'
            ).css("margin", "auto 0 0").appendTo($settings);

            const $tools = $toolsProperty.find(".room-creation-editor-tools");

            console.log(entity.settings.map);

            const data = {
                map: entity.settings.map.map.split('|'),

                door: {
                    row: entity.settings.map.door.row,
                    column: entity.settings.map.door.column
                }
            };

            const editor = new Client.rooms.editor(data, function(map) {
                entity.settings.map.map = map;

                //const $canvas = new Client.rooms.creation.map(map.split('|'), entity.settings.map.door);

                //$settings.html($canvas);
            });

            Client.rooms.creation.editor = editor;

            editor.tiles.$element.css({
                "width": "280px",
                "height": "230px"
            });
    
            editor.tiles.$element.prependTo($grid);

            editor.depth.$element.css({
                "width": "280px",
                "height": "24px"
            });

            editor.depth.$element.appendTo(editor.tiles.$element);

            editor.depth.render();

            const $add = $('<div class="dialog-item" value="0"></div>').appendTo($tools).append(editor.tools.$add);
            const $remove = $('<div class="dialog-item" value="1"></div>').appendTo($tools).append(editor.tools.$remove);
            const $up = $('<div class="dialog-item" value="2"></div>').appendTo($tools).append(editor.tools.$up);
            const $down = $('<div class="dialog-item" value="3"></div>').appendTo($tools).append(editor.tools.$down);
            const $door = $('<div class="dialog-item" value="4"></div>').appendTo($tools).append(editor.tools.$door);

            $tools.on("click", ".dialog-item", function() {
                $tools.find(".dialog-item.active").removeClass("active");

                $(this).addClass("active");

                editor.tools.setTool($(this).attr("value"));
            });

            $add.click();
        });

        tabs.show("default");

        tabs.$element.appendTo(entity.$content);

        const $buttons = $('<div class="room-creation-buttons"></div>').appendTo(entity.$content);
            
        $('<div class="dialog-button">« Back</div>').appendTo($buttons).on("click", function() {
            entity.showProperties();
        });

        const $continue = $('<div class="dialog-button">Continue »</div>').appendTo($buttons);

        $continue.on("click", async function() {
            await Client.socket.messages.sendCall({ OnRoomModelCreate: entity.settings }, "OnRoomModelCreate");

            entity.hide();
        });
    };

    entity.events.show.push(function() {
        Client.rooms.navigator.hide();

        entity.settings = {};
        
        entity.showProperties();
    });

    entity.events.destroy.push(function() {
        if(Client.rooms.creation.editor != undefined) {
            Client.rooms.creation.editor.destroy();

            Client.rooms.creation.editor = undefined;
        }
    });

    return entity;
};
