Client.shop.types.pages = function() {
    this.$element = $(
        '<div class="shop-pages">' +
            '<div class="shop-pages-left">' +
                '<div class="shop-pages-search">' +
                    '<input type="text" placeholder="Search...">' +
                '</div>' +
                
                '<div class="shop-pages-list dialog-container"></div>' +
            '</div>' +
            
            '<div class="shop-pages-right"></div>' +
        '</div>'
    );

    Client.shop.tabs.$content.html(this.$element);
};
