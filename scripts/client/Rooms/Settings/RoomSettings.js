Client.rooms.settings = new function() {
    const entity = new Client.dialogs.default({
        title: "Room Settings",
        
        size: {
            width: 580,
            height: 310
        },

        offset: {
            type: "center"
        }
    });

    entity.events.create.push(function() {
        entity.$content.addClass("room-creation");

        const tabs = new Client.dialogs.tabs(231);

        tabs.add("map", "Map Editor", function($element) {
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

            const data = {
                map: Client.rooms.interface.data.map.floor,

                door: {
                    row: Client.rooms.interface.data.door.row,
                    column: Client.rooms.interface.data.door.column
                }
            };

            const editor = new Client.rooms.editor(data, function(map) {
                //entity.settings.map.map = map;

                //const $canvas = new Client.rooms.creation.map(map.split('|'), entity.settings.map.door);

                //$settings.html($canvas);
            });

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

        tabs.show("map");

        tabs.$element.appendTo(entity.$content);

        const $buttons = $('<div class="room-creation-buttons"></div>').appendTo(entity.$content);
            
        $('<div class="dialog-button">Save Map</div>').appendTo($buttons).on("click", function() {
            
        });
    });

    entity.events.show.push(function() {
        
    });

    return entity;
};
