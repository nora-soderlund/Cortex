Client.rooms.settings = new function() {
    const entity = new Dialog({
        title: "Room Settings",
        
        size: {
            width: 580,
            height: 310
        },

        offset: {
            type: "center"
        },

        resizable: true
    });

    entity.events.create.push(function() {
        entity.$content.addClass("room-creation");

        const tabs = new DialogTabs("100%");

        tabs.$element.addClass("room-creation-tabs");

        tabs.add("information", "Information", async function($element) {
            const $grid = $('<div class="room-creation-grid"></div>').appendTo($element);

            const $information = $('<div class="room-creation-information"></div>').appendTo($grid);

            $(
                '<div class="room-creation-property">' +
                    '<p>' +
                        '<b>Room Name</b>' +
                        '<span>Give your room a fun and interesting title, this is what interests others!</span>' + 
                    '</p>' +
                    
                    '<div class="input-pen">' +
                        '<input type="text" class="room-creation-name" placeholder="Enter a room name..." value="' + RoomInterface.data.title + '">' +
                    '</div>' + 
                '</div>'
            ).appendTo($information).find(".room-creation-name").on("change", function() {
                SocketMessages.send({
                    OnRoomSettingsUpdate: {
                        title: $(this).val()
                    }
                });
            });

            $(
                '<div class="room-creation-property">' +
                    '<p>' +
                        '<b>Room Description</b>' +
                        '<span>Describe what your room is, what can others do in your room, let them know what it is!</span>' + 
                    '</p>' +
                    
                    '<div class="textarea-pen">' +
                        '<textarea type="text" class="room-creation-description" placeholder="Enter a room description...">' + RoomInterface.data.description + '</textarea>' +
                    '</div>' + 
                '</div>'
            ).appendTo($information).find(".room-creation-description").on("change", function() {
                SocketMessages.send({
                    OnRoomSettingsUpdate: {
                        description: $(this).val()
                    }
                });
            });
        });

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
                map: [],

                door: {
                    row: RoomInterface.data.map.door.row,
                    column: RoomInterface.data.map.door.column
                }
            };

            for(let row in RoomInterface.data.map.floor)
                data.map[row] = RoomInterface.data.map.floor[row];

            entity.editor = new Client.rooms.editor(data, async function(map, extra) {
                //entity.settings.map.map = map;

                //const $canvas = new RoomCreationMap(map.split('|'), entity.settings.map.door);

                //$settings.html($canvas);

                SocketMessages.send({
                    OnRoomSettingsUpdate: {
                        map: { floor: map, extra }
                    }
                });
            });

            entity.editor.tiles.$element.css({
                "width": "auto",
                "height": "230px"
            });
    
            entity.editor.tiles.$element.prependTo($grid);

            entity.editor.depth.$element.css({
                "width": "280px",
                "height": "24px"
            });

            entity.editor.depth.$element.appendTo(entity.editor.tiles.$element);

            entity.editor.depth.render();

            const $add = $('<div class="dialog-item" value="0"></div>').appendTo($tools).append(entity.editor.tools.$add);
            const $remove = $('<div class="dialog-item" value="1"></div>').appendTo($tools).append(entity.editor.tools.$remove);
            const $up = $('<div class="dialog-item" value="2"></div>').appendTo($tools).append(entity.editor.tools.$up);
            const $down = $('<div class="dialog-item" value="3"></div>').appendTo($tools).append(entity.editor.tools.$down);
            const $door = $('<div class="dialog-item" value="4"></div>').appendTo($tools).append(entity.editor.tools.$door);

            $tools.on("click", ".dialog-item", function() {
                $tools.find(".dialog-item.active").removeClass("active");

                $(this).addClass("active");

                entity.editor.tools.setTool($(this).attr("value"));
            });

            $add.click();
        });

        tabs.add("walls", "Walls", function($element) {
            const walls = Client.rooms.asset.room_visualization.visualizationData.wallData.walls.wall;

            const $container = $('<div class="room-creation-items"></div>').appendTo($element);

            const $content = $('<div class="room-creation-items-container"></div>').appendTo($container);
            const $items = $('<div class="room-creation-items-content"></div>').appendTo($content);

            const $preview = $('<div class="room-creation-items-preview"></div>').appendTo($container);

            const $canvas = $('<canvas width="200" height="200"></canvas>').appendTo($preview);
            const context = $canvas[0].getContext("2d");

            for(let index = 0; index < walls.length; index++) {
                const $item = $('<div class="dialog-item room-creation-item"></div>').appendTo($items);

                Assets.getSpritesheet("HabboRoomContentIcons/th_wall_" + walls[index].id, false).then(function(image) {
                    $(image).appendTo($item);
                });

                $item.on("click", function() {
                    $items.find(".room-creation-item.active").removeClass("active");

                    $item.addClass("active");

                    const map = new Client.rooms.map.entity([ "XXXXXXX", "X000000", "X000000", "X000000", "X000000", "X000000", "X000000" ], {}, { material: RoomInterface.data.floor_material }, { material: walls[index].id });

                    map.render().then(function() {
                        context.canvas.width = $preview.width();
                        context.canvas.height = $preview.height();

                        context.drawImage(map.$floor[0], -(8 * 16), ((6 * 16)) + -(map.depth * 16));
                        context.drawImage(map.$wall[0], -(8 * 16), ((6 * 16)) + map.offset);
                    });

                    if(RoomInterface.data.wall_material != walls[index].id) {
                        SocketMessages.send({
                            OnRoomSettingsUpdate: {
                                wall: { material: walls[index].id }
                            }
                        });
                    }
                });

                if(RoomInterface.data.wall_material == walls[index].id)
                    $item.click();
            }
        });

        tabs.add("floors", "Floors", function($element) {
            const floors = Client.rooms.asset.room_visualization.visualizationData.floorData.floors.floor;

            const $container = $('<div class="room-creation-items"></div>').appendTo($element);

            const $content = $('<div class="room-creation-items-container"></div>').appendTo($container);
            const $items = $('<div class="room-creation-items-content"></div>').appendTo($content);

            const $preview = $('<div class="room-creation-items-preview"></div>').appendTo($container);

            const $canvas = $('<canvas width="200" height="200"></canvas>').appendTo($preview);
            const context = $canvas[0].getContext("2d");

            for(let index = 0; index < floors.length; index++) {
                const $item = $('<div class="dialog-item room-creation-item"></div>').appendTo($items);

                Assets.getSpritesheet("HabboRoomContentIcons/th_floor_" + floors[index].id, false).then(function(image) {
                    $(image).appendTo($item);
                });

                $item.on("click", function() {
                    $items.find(".room-creation-item.active").removeClass("active");

                    $item.addClass("active");

                    const map = new Client.rooms.map.entity([ "XXXXXXX", "X000000", "X000000", "X000000", "X000000", "X000000", "X000000" ], {}, { material: floors[index].id }, { material: RoomInterface.data.wall_material });

                    map.render().then(function() {
                        context.canvas.width = $preview.width();
                        context.canvas.height = $preview.height();

                        context.drawImage(map.$floor[0], -(8 * 16), ((6 * 16)) + -(map.depth * 16));
                        context.drawImage(map.$wall[0], -(8 * 16), ((6 * 16)) + map.offset);
                    });

                    if(RoomInterface.data.floor_material != floors[index].id) {
                        SocketMessages.send({
                            OnRoomSettingsUpdate: {
                                floor: { material: floors[index].id }
                            }
                        });
                    }
                });

                if(RoomInterface.data.floor_material == floors[index].id)
                    $item.click();
            }
        });

        tabs.click(function(identifier, $element) {
            if(entity.editor != undefined)
                entity.editor.destroy();

            $element.parent().css("overflow", "");
        }); 

        tabs.show("information");

        tabs.$element.appendTo(entity.$content);
    });

    entity.events.show.push(function() {
        
    });

    entity.events.destroy.push(function() {
        if(entity.editor != undefined)
            entity.editor.destroy();
    });

    return entity;
};

RoomInterface.events.stop.push(function() {
    Client.rooms.settings.destroy();
});
