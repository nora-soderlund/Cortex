Client.inventory = new function() {
    const entity = new Client.dialogs.default({
        title: "Inventory",
        
        size: {
            width: 480,
            height: "inherit"
        },

        offset: {
            type: "center",
            top: -130
        }
    });

    entity.events.create.push(async function() {
        entity.tabs = new Client.dialogs.tabs(260);

        entity.tabs.add("furnitures", "Furnitures", async function($element) {
            if(entity.furnitures == undefined) {
                entity.pause();

                entity.furnitures = await Client.socket.messages.sendCall({ OnInventoryFurnituresUpdate: null }, "OnInventoryFurnituresUpdate");
                
                entity.unpause();
            }

            $element.html(
                '<div class="inventory-furnitures">' +
                    '<div class="inventory-furnitures-container">' +
                        '<div class="inventory-furnitures-content"></div>' +
                    '</div>' +

                    '<div class="inventory-furniture-display">' +
                        '<canvas class="inventory-furniture-display-canvas"></canvas>' +
                        
                        '<div class="inventory-furniture-display-information">' +
                            '<b>Furniture Title</b>' +
                            '<p>Furniture Description</p>' +

                            '<div class="dialog-button">Place in room</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );

            const $content = $element.find(".inventory-furnitures-content");

            for(let id in entity.furnitures) {
                Client.furnitures.get(id).then(function(furniture) {
                    const $furniture = $(
                        '<div class="inventory-furniture-icon">' +
                            '<div class="inventory-furniture-icon-image"></div>' +
                        '</div>'
                    ).appendTo($content);

                    const $icon = $furniture.find(".inventory-furniture-icon-image");

                    Client.assets.getSpritesheet("HabboLoadingIcon").then(function(icon) {
                        const $canvas = $('<canvas width="' + icon.width + '" height="' + icon.height + '">').appendTo($icon);

                        const context = $canvas[0].getContext("2d");

                        context.drawImage(icon, 0, 0);

                        Client.furnitures.icon(furniture.id).then(function(image) {
                            $icon.html(image);
                        });
                    });
                    //const $furniture = $('<p>' + result.line + '/' + result.id + ' (' + entity.furnitures[result.id] + ')</p>').appendTo($content);
                });
            }

            const $canvas = $element.find(".inventory-furniture-display-canvas");

            const furniture = new Client.furnitures.entity("HabboFurnitures/lodge/table_armas", { direction: 4 });

            furniture.events.render.push(function(sprites, data) {
                const context = $canvas[0].getContext("2d");

                context.canvas.width = ((data.minLeft * -1) + data.maxWidth);
                context.canvas.height = ((data.minTop * -1) + data.maxHeight);

                for(let index in sprites) {
                    context.globalCompositeOperation = sprites[index].composite;

                    context.drawImage(sprites[index].image, (data.minLeft * -1) + sprites[index].left, (data.minTop * -1) + sprites[index].top);
                }
            });

            furniture.render();
        });

        entity.tabs.add("pets", "Pets", undefined, true);
        entity.tabs.add("bots", "Bots", undefined, true);
        entity.tabs.add("badges", "Badges", undefined, true);

        entity.tabs.show("furnitures");

        entity.tabs.$element.appendTo(entity.$content);
    });

    entity.events.show.push(function() {
        
    });

    return entity;
};
