Inventory.pages.furnitures = function($element) {
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
            '</div>'
        );

        if(Client.rooms.interface.active == true) {
            const $button = $('<div class="dialog-button">Place in room</div>').appendTo($display.find(".inventory-furniture-display-information"));

            $button.click(function() {
                Inventory.hide();
                
                Client.rooms.interface.furniture.place.start(furniture.id, function(result) {
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
                    }, "OnRoomFurniturePlace").then(function(response) {
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
        
        const $canvas = $element.find(".inventory-furniture-display-canvas");

        new FurnitureRenderer({ id: furniture.id, direction: 4 }, $canvas);
    };

    function setFurniture(id) {
        if(!(Client.user.furnitures[id].inventory > 0)) {
            if(Inventory.$furnitures[id] != undefined) {
                Inventory.$furnitures[id].$element.remove();

                Inventory.$furnitures[id] = undefined;
            }

            return;
        }

        if(Inventory.$furnitures[id] == undefined) {
            Inventory.$furnitures[id] = {
                $element: $('<div class="dialog-item inventory-furniture-icon"></div>').prependTo($content),

                $canvas: $('<canvas class="inventory-furniture-icon-image"></canvas>'),

                $quantity: $('<div class="inventory-furniture-icon-quantity">' + Client.user.furnitures[id].inventory + '</div>')
            };

            Inventory.$furnitures[id].$canvas.appendTo(Inventory.$furnitures[id].$element);
            Inventory.$furnitures[id].$quantity.appendTo(Inventory.$furnitures[id].$element);
        }

        Inventory.$furnitures[id].$quantity.html(Client.user.furnitures[id].inventory);
        
        if(Client.user.furnitures[id].inventory == 1)
            Inventory.$furnitures[id].$quantity.hide();
        else
            Inventory.$furnitures[id].$quantity.show();

        Furnitures.get(id).then(function(furniture) {
            const renderer = new FurnitureRenderer({ id: furniture.id, size: 1 }, Inventory.$furnitures[id].$canvas);
        
            Inventory.$furnitures[id].$element.click(function() {
                Inventory.$furnitures[id].$element.parent().find(".active").removeClass("active");

                Inventory.$furnitures[id].$element.addClass("active");
                
                setDisplay(furniture);
            });
        });
    };

    for(let id in Client.user.furnitures)
       setFurniture(id);
};
