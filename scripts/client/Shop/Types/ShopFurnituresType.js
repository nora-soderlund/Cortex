Client.shop.types.furnitures = async function(page) {
    const $element = $(
        '<div class="shop-furnitures">' +
            '<div class="shop-furnitures-display"></div>' +

            '<div class="shop-furnitures-items dialog-container">' +
                '<div class="shop-furnitures-items-container"></div>' +
            '</div>' +
        '</div>'
    );

    const $display = $element.find(".shop-furnitures-display");

    const $items = $element.find(".shop-furnitures-items-container");

    if(!page.furnitures)
        page.furnitures = await Client.socket.messages.sendCall({ OnShopFurnituresUpdate: page.id }, "OnShopFurnituresUpdate");

    for(let index in page.furnitures) {
        const furniture = page.furnitures[index].furniture;

        const $item = $(
            '<div class="shop-furnitures-item">' +
                '<div class="shop-furnitures-item-icon"></div>' +
            '</div>'
        ).appendTo($items);

        const $icon = $item.find(".shop-furnitures-item-icon");

        Client.assets.getSpritesheetOnly("HabboLoadingIcon/HabboLoadingIcon").then(function(icon) {
            const $canvas = $('<canvas width="' + icon.width + '" height="' + icon.height + '">').appendTo($icon);

            const context = $canvas[0].getContext("2d");

            context.drawImage(icon, 0, 0);

            Client.furnitures.icon(furniture.id).then(function(image) {
                $icon.html(image);
            });
        });

        $item.click(async function() {
            $display.html("");

            const entity = new Client.furnitures.entity("HabboFurnitures/" + furniture.line + "/" + furniture.id);

            entity.events.render.push(function(sprites, data) {
                console.log(data);

                const $canvas = $('<canvas class="shop-furnitures-display-canvas" width="' + ((data.minLeft * -1) + data.maxWidth) + '" height="' + ((data.minTop * -1) + data.maxHeight) + '">').appendTo($display);
    
                const context = $canvas[0].getContext("2d");

                for(let index in sprites) {
                    context.drawImage(sprites[index].image, (data.minLeft * -1) + sprites[index].left, (data.minTop * -1) + sprites[index].top);
                }
            });

            entity.render();
        });
    }

    Client.shop.category.$content.html($element);
};