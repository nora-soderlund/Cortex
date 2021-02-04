Client.shop.types.pages = function(page) {
    this.$element = $(
        '<div class="shop-pages">' +
            '<div class="shop-pages-left">' +
                '<div class="shop-pages-search">' +
                    '<input type="text" placeholder="Search...">' +
                '</div>' +
                
                '<div class="shop-pages-list dialog-container">' +
                    '<div class="shop-pages-list-container"></div>' +
                '</div>' +
            '</div>' +
            
            '<div class="shop-pages-right"></div>' +
        '</div>'
    );

    this.$list = this.$element.find(".shop-pages-list-container");

    this.addPage = function(page, $parent) {
        const $element = $(
            '<div class="shop-pages-item">' +
                '<div class="shop-pages-item-button">' +
                    '<canvas class="shop-pages-item-icon" width="20" height="20"></canvas>' +

                    page.title +
                '</div>' +
            '</div>'
        ).appendTo($parent);

        const $button = $element.find(".shop-pages-item-button");

        const $icon = $element.find(".shop-pages-item-icon");

        const context = $icon[0].getContext("2d");

        Client.assets.getSpritesheetOnly("HabboShopIcons/icon_1").then(function(purse) {
            context.drawImage(purse, Math.floor((context.canvas.width - purse.width) / 2), Math.floor((context.canvas.height - purse.height) / 2));

            Client.assets.getSpritesheetOnly("HabboShopIcons/icon_" + page.icon).then(function(icon) {
                context.drawImage(icon, Math.floor((context.canvas.width - icon.width) / 2), Math.floor((context.canvas.height - icon.height) / 2));
            });
        });

        const subPages = Client.shop.pages.filter(x => x.parent == page.id);

        if(subPages.length == 0)
            return;

        const $list = $('<div class="shop-pages-item-list"></div>').appendTo($element);

        $button.addClass("shop-pages-item-drop").on("click", function() {
            $element.toggleClass("active");
        });

        for(let index in subPages)
            this.addPage(subPages[index], $list);
    };

    const subPages = Client.shop.pages.filter(x => x.parent == page.id);

    for(let index in subPages)
        this.addPage(subPages[index], this.$list);

    Client.shop.tabs.$content.html(this.$element);
};
