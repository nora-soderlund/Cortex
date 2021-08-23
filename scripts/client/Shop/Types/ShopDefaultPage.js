Client.shop.types.default = async function(page) {
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
        page.furnitures = await SocketMessages.sendCall({ OnShopFurnituresUpdate: page.id }, "OnShopFurnituresUpdate");

    for(let index in page.furnitures) {
        const furniture = page.furnitures[index].furniture;

        const $item = $(
            '<div class="shop-furnitures-item">' +
                '<div class="shop-furnitures-item-icon"></div>' +
            '</div>'
        ).appendTo($items);

        const $icon = $item.find(".shop-furnitures-item-icon");

        const $canvas = $('<canvas></canvas>').appendTo($icon);

        const renderer = new Client.furnitures.renderer({ id: furniture.id, size: 1 }, $canvas);

        $item.click(async function() {
            $display.html("");

            const $canvas = $('<canvas class="shop-furnitures-display-canvas"></canvas>').appendTo($display);

            new Client.furnitures.renderer({ id: furniture.id, direction: 4 }, $canvas, "#e9e9e1");

            const $information = $(
                '<div class="shop-furnitures-display-info">' + 
                    '<b>' + furniture.title + '</b>' +
                    '<p>' + furniture.description + '</p>' +
                '</div>'
            ).appendTo($display);

            const $button = $('<div class="dialog-button shop-furnitures-display-button">Add to inventory</div>').appendTo($display);

            $button.click(async function() {
                Client.shop.pause();

                await SocketMessages.sendCall({ OnShopFurniturePurchase: page.furnitures[index].id }, "OnShopFurniturePurchase");

                Client.shop.unpause();
            });
        });
    }

    Client.shop.category.$content.html($element);
};
