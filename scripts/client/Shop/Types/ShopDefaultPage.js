Client.shop.types.default = async function(page) {
    const element = document.createElement("div");
    element.className = "shop-furnitures";
    element.innerHTML = `
        <div class="shop-furnitures-display"></div>

        <div class="shop-furnitures-items dialog-container">
            <div class="shop-furnitures-items-container"></div>
        </div>
    `;

    const display = element.querySelector(".shop-furnitures-display");

    const items = element.querySelector(".shop-furnitures-items-container");

    if(!page.furnitures)
        page.furnitures = await SocketMessages.sendCall({ OnShopFurnituresUpdate: page.id }, "OnShopFurnituresUpdate");

    for(let index in page.furnitures) {
        const furniture = page.furnitures[index].furniture;

        const item = document.createElement("div");
        item.className = "shop-furnitures-item";
        item.innerHTML = `
            <div class="shop-furnitures-item-icon"></div>
        `;        
        items.append(item);

        const icon = item.querySelector(".shop-furnitures-item-icon");

        const canvas = document.createElement("canvas");
        icon.append(canvas);

        const renderer = new FurnitureRenderer({ id: furniture.id, size: 1 }, canvas);

        item.addEventListener("click", async () => {
            display.innerHTML = "";

            const canvas = document.createElement("canvas");
            canvas.className = "shop-furnitures-display-canvas";
            display.append(canvas);

            new FurnitureRenderer({ id: furniture.id, direction: 4 }, canvas, "#e9e9e1");

            const information = document.createElement("div");
            information.className = "shop-furnitures-display-info";
            information.innerHTML = ` 
                <b>${furniture.title}</b>
                <p>${furniture.description}</p>
            `;            
            display.append(information);

            const button = document.createElement("div");
            button.className = "dialog-button shop-furnitures-display-button";
            button.innerHTML = `Add to inventory`;
            display.append(button);

            button.addEventListener("click", async () => {
                Client.shop.pause();

                await SocketMessages.sendCall({ OnShopFurniturePurchase: page.furnitures[index].id }, "OnShopFurniturePurchase");

                Client.shop.unpause();
            });
        });
    }

    Client.shop.category.content.append(element);
};
