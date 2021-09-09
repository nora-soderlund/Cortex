Inventory.pages.furnitures = function(element) {
    element.innerHTML = `
        <div class="inventory-furnitures">
            <div class="inventory-furnitures-container">
                <div class="inventory-furnitures-content"></div>
            </div>

            <div class="inventory-furniture-display"></div>
        </div>
    `;

    const content = element.querySelector(".inventory-furnitures-content");

    const display = element.querySelector(".inventory-furniture-display");
    
    function setDisplay(furniture) {
        display.innerHTML = `
            <canvas class="inventory-furniture-display-canvas"></canvas>
            
            <div class="inventory-furniture-display-information">
                <b>${furniture.title}</b>
                <p>${furniture.description}</p>
            </div>
        `;

        if(RoomInterface.active == true) {
            const button = document.createElement("div");
            button.className = "dialog-button";
            button.innerTExt = "Place in room";
            
            display.querySelector(".inventory-furniture-display-information").append(button);

            button.addEventListener("click", () => {
                Inventory.hide();
                
                RoomInterface.furniture.place.start(furniture.id, (result) => {
                    if(result.entity.enabled == false) {
                        result.stop();
            
                        Inventory.show();
            
                        return;
                    }
            
                    result.unbind();
            
                    SocketMessages.sendCall({
                        OnRoomFurniturePlace: {
                            id: result.furniture.id,
                            position: {
                                row: result.position.row,
                                column: result.position.column,
                                direction: result.entity.furniture.settings.direction
                            }
                        }
                    }, "OnRoomFurniturePlace").then((response) => {
                        if(response == null) {
                            result.stop();

                            Inventory.show();

                            return;
                        }

                        Client.user.furnitures[furniture.id].inventory--;
                        
                        if(Client.user.furnitures[furniture.id].rooms == undefined)
                            Client.user.furnitures[furniture.id].rooms = 0;

                        Client.user.furnitures[furniture.id].rooms++;

                        setFurniture(furniture.id);

                        if(Client.user.furnitures[furniture.id].inventory == 0) {
                            result.stop();
                            
                            Inventory.show();

                            return;
                        }

                        result.bind();
                    });
                });
            });
        }
        
        const canvas = element.querySelector(".inventory-furniture-display-canvas");

        new FurnitureRenderer({ id: furniture.id, direction: 4 }, canvas);
    };

    function setFurniture(id) {
        if(!(Client.user.furnitures[id].inventory > 0)) {
            if(Inventory.furnitures[id] != undefined) {
                Inventory.furnitures[id].element.remove();

                Inventory.furnitures[id] = undefined;
            }

            return;
        }

        if(Inventory.furnitures[id] == undefined) {
            const element = document.createElement("div");
            element.className = "dialog-item inventory-furniture-icon";
            content.append(element);

            const canvas = document.createElement("canvas");
            canvas.className = "inventory-furniture-icon-image";
            element.append(canvas);

            const quantity = document.createElement("div");
            quantity.className = "inventory-furniture-icon-quantity";
            quantity.innerText = Client.user.furnitures[id].inventory;
            element.append(quantity);

            Inventory.furnitures[id] = { element, canvas, quantity };
        }

        Inventory.furnitures[id].quantity.innerHTML = Client.user.furnitures[id].inventory;
        
        if(Client.user.furnitures[id].inventory == 1)
            Inventory.furnitures[id].quantity.style.dispaly = "none";
        else
            Inventory.furnitures[id].quantity.style.dispaly = "block";

        Furnitures.get(id).then(function(furniture) {
            const renderer = new FurnitureRenderer({ id: furniture.id, size: 1 }, Inventory.furnitures[id].canvas);
        
            Inventory.furnitures[id].element.addEventListener("click", () => {
                Inventory.furnitures[id].element.parentElement.querySelector(".active").classList.remove("active");

                Inventory.furnitures[id].element.classList.add("active");
                
                setDisplay(furniture);
            });
        });
    };

    for(let id in Client.user.furnitures)
       setFurniture(id);
};
