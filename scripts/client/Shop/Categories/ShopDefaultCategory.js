Client.shop.categories.default = function(page) {
    this.element = document.createElement("div");
    this.element.className = "shop-pages";
    this.element.innerHTML = `
        <div class="shop-pages-left">
            <div class="shop-pages-search input-pen">
                <input class="shop-pages-search-input" type="text" placeholder="Search...">
            </div>
            
            <div class="shop-pages-list dialog-container">
                <div class="shop-pages-list-container"></div>
            </div>
        </div>
        
        <div class="shop-pages-right"></div>
    `;

    this.search = this.element.querySelector(".shop-pages-search-input");

    this.search.addEventListener("change", () => {
        Client.shop.category = new Client.shop.categories.search(this.search.value);
    });

    this.list = this.element.querySelector(".shop-pages-list-container");

    this.content = this.element.querySelector(".shop-pages-right");

    this.addPage = function(page, parent) {
        const element = document.createElement("div");
        element.className = "shop-pages-item";
        element.innerHTML = `
            <div class="shop-pages-item-button">
                <canvas class="shop-pages-item-icon" width="20" height="20"></canvas>

                ${page.title}
            </div>
        `;
        parent.append(element);

        const button = element.querySelector(".shop-pages-item-button");
        button.addEventListener("click", () => {
            const active = parent.querySelector(".shop-pages-item.active");
            
            if(active != null)
                active.classList.remove("active");

            element.classList.add("active");

            Client.shop.setPage(page.id);
        });

        const icon = element.querySelector(".shop-pages-item-icon");

        const context = icon.getContext("2d");

        Assets.getSpritesheet("HabboShopIcons/icon_1", false).then(function(spritesheet) {
            context.drawImage(spritesheet, Math.floor((context.canvas.width - spritesheet.width) / 2), Math.floor((context.canvas.height - spritesheet.height) / 2));

            Assets.getSpritesheet("HabboShopIcons/icon_" + page.icon, false).then(function(spritesheet) {
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                
                context.drawImage(spritesheet, Math.floor((context.canvas.width - spritesheet.width) / 2), Math.floor((context.canvas.height - spritesheet.height) / 2));
            });
        });

        const subPages = Client.shop.pages.filter(x => x.parent == page.id);

        if(subPages.length == 0)
            return;

        const list = document.createElement("div");
        list.className = "shop-pages-item-list";
        element.append(list);

        button.classList.add("shop-pages-item-drop");
        button.addEventListener("click", () => {
            element.classList.toggle("active");
        });

        for(let index in subPages)
            this.addPage(subPages[index], list);
    };

    const subPages = Client.shop.pages.filter(x => x.parent == page.id);

    for(let index in subPages)
        this.addPage(subPages[index], this.list);

    Client.shop.tabs.content.append(this.element);
};
