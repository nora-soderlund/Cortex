Client.inventory.pages.furnitures = async function($element) {
    if(Client.inventory.furnitures == undefined) {
        Client.inventory.pause();

        Client.inventory.furnitures = await Client.socket.messages.sendCall({ OnInventoryFurnituresUpdate: null }, "OnInventoryFurnituresUpdate");
        
        Client.inventory.unpause();
    }

    $element.html(
        '<div class="inventory-furnitures">' +
            '<div class="inventory-furnitures-container">' +
                '<div class="inventory-furnitures-content"></div>' +
            '</div>' +

            '<div class="inventory-furniture-display"></div>' +
        '</div>'
    );

    const $content = $element.find(".inventory-furnitures-content");

    const $display = $element.find(".inventory-furniture-display");
    
    function setDisplay(furniture) {
        $display.html(
            '<canvas class="inventory-furniture-display-canvas"></canvas>' +
            
            '<div class="inventory-furniture-display-information">' +
                '<b>' + furniture.title + '</b>' +
                '<p>' + furniture.description + '</p>' +

                '<div class="dialog-button">Place in room</div>' +
            '</div>'
        );
        
        const $canvas = $element.find(".inventory-furniture-display-canvas");

        const sprite = new Client.furnitures.entity("HabboFurnitures/" + furniture.line + "/" + furniture.id, { direction: 4 });

        sprite.events.render.push(function(sprites, data) {
            const context = $canvas[0].getContext("2d");

            context.canvas.width = ((data.minLeft * -1) + data.maxWidth);
            context.canvas.height = ((data.minTop * -1) + data.maxHeight);

            for(let index in sprites) {
                context.globalCompositeOperation = sprites[index].composite;

                context.drawImage(sprites[index].image, (data.minLeft * -1) + sprites[index].left, (data.minTop * -1) + sprites[index].top);
            }
        });

        sprite.render();
    };

    for(let id in Client.inventory.furnitures) {
        Client.furnitures.get(id).then(function(furniture) {
            const $furniture = $('<div class="inventory-furniture-icon"></div>').appendTo($content);

            Client.assets.getSpritesheet("HabboLoadingIcon").then(function(icon) {
                const $canvas = $('<canvas class="inventory-furniture-icon-image" width="' + icon.width + '" height="' + icon.height + '">').appendTo($furniture);

                const context = $canvas[0].getContext("2d");

                context.drawImage(icon, 0, 0);

                Client.furnitures.icon(furniture.id).then(function(image) {
                    context.canvas.width = image.width;
                    context.canvas.height = image.height;

                    context.drawImage(image, 0, 0);
                });
            });
            
            $furniture.click(function() {
                setDisplay(furniture);
            });
        });
    }
};
