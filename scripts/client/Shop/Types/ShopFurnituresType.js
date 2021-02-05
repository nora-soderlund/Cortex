Client.shop.types.furnitures = async function(page) {
    const $element = $(
        '<div class="shop-furnitures">' +
            '<div class="shop-furnitures-display"></div>' +

            '<div class="shop-furnitures-items dialog-container">' +
                '<div class="shop-furnitures-items-container"></div>' +
            '</div>' +
        '</div>'
    );

    const $items = $element.find(".shop-furnitures-items-container");

    if(!page.furnitures)
        page.furnitures = await Client.socket.messages.sendCall({ OnShopFurnituresUpdate: page.id }, "OnShopFurnituresUpdate");

    for(let index in page.furnitures) {
        const furniture = page.furnitures[index].furniture;

        /*const entity = new Client.furnitures.entity("HabboFurnitures/" + furniture.line + "/" + furniture.id);

        entity.render();*/

        const $canvas = $('<div></div>').appendTo($items);

        Client.furnitures.icon(furniture.id).then(function(image) {
            $canvas.append(image);
        });
    }

    Client.shop.category.$content.html($element);
};
