Client.shop.categories.search = function(input) {
    const $element = $(
        '<div class="shop-pages">' +
            '<div class="shop-pages-left">' +
                '<div class="shop-pages-search input-pen">' +
                    '<input class="shop-pages-search-input" type="text" placeholder="Search..." value="' + input + '">' +
                '</div>' +
                
                '<div class="shop-pages-list dialog-container">' +
                    '<div class="shop-pages-list-container"></div>' +
                '</div>' +
            '</div>' +
            
            '<div class="shop-pages-right"></div>' +
        '</div>'
    );

    const $search = $element.find(".shop-pages-search-input");

    $search.on("change", function() {
        Client.shop.category = new Client.shop.categories.search($(this).val());
    });

    const $list = $element.find(".shop-pages-list-container");

    this.$content = $element.find(".shop-pages-right");

    const addPage = function(page, $parent) {
        const $element = $(
            '<div class="shop-pages-item">' +
                '<div class="shop-pages-item-button">' +
                    '<canvas class="shop-pages-item-icon" width="20" height="20"></canvas>' +

                    page.title +
                '</div>' +
            '</div>'
        ).appendTo($parent);

        const $button = $element.find(".shop-pages-item-button").on("click", function() {
            $parent.find(".shop-pages-item.active").removeClass("active");

            $element.addClass("active");

            Client.shop.setPage(page.id);
        });

        const $icon = $element.find(".shop-pages-item-icon");

        const context = $icon[0].getContext("2d");

        Assets.getSpritesheet("HabboShopIcons/icon_1", false).then(function(spritesheet) {
            context.drawImage(spritesheet, Math.floor((context.canvas.width - spritesheet.width) / 2), Math.floor((context.canvas.height - spritesheet.height) / 2));

            Assets.getSpritesheet("HabboShopIcons/icon_" + page.icon, false).then(function(spritesheet) {
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                
                context.drawImage(spritesheet, Math.floor((context.canvas.width - spritesheet.width) / 2), Math.floor((context.canvas.height - spritesheet.height) / 2));
            });
        });
    };

    Client.socket.messages.sendCall({ OnShopSearch: input }, "OnShopSearch").then(function(response) {
        for(let index in response.pages)
            addPage(response.pages[index], $list);

        Client.shop.page = Client.shop.types.default({
            id: null,
            furnitures: response.furnitures
        });
    });

    Client.shop.tabs.$content.html($element);
};
