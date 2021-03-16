Client.inventory.pages.furnitures = function($element) {
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
                Client.inventory.hide();
                
                Client.rooms.interface.furniture.place.start(furniture.id, function(result) {
                    if(result.entity.enabled == false) {
                        result.stop();
            
                        Client.inventory.show();
            
                        return;
                    }
            
                    result.unbind();
            
                    Client.socket.messages.sendCall({
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

                            Client.inventory.show();

                            return;
                        }

                        Client.user.furnitures[furniture.id].inventory--;
                        
                        if(Client.user.furnitures[furniture.id].rooms == undefined)
                            Client.user.furnitures[furniture.id].rooms = 0;

                        Client.user.furnitures[furniture.id].rooms++;

                        Client.inventory.page.setFurniture(furniture.id);

                        if(Client.user.furnitures[furniture.id].inventory == 0) {
                            result.stop();
                            
                            Client.inventory.show();

                            return;
                        }

                        result.bind();
                    });
                });
            });
        }
        
        const $canvas = $element.find(".inventory-furniture-display-canvas");

        new Client.furnitures.renderer({ id: furniture.id, direction: 4 }, $canvas);
    };

    function setFurniture(id) {
        if(!(Client.user.furnitures[id].inventory > 0)) {
            if(Client.inventory.$furnitures[id] != undefined) {
                Client.inventory.$furnitures[id].$element.remove();

                Client.inventory.$furnitures[id] = undefined;
            }

            return;
        }

        if(Client.inventory.$furnitures[id] == undefined) {
            Client.inventory.$furnitures[id] = {
                $element: $('<div class="dialog-item inventory-furniture-icon"></div>').prependTo($content),

                $canvas: $('<canvas class="inventory-furniture-icon-image"></canvas>'),

                $quantity: $('<div class="inventory-furniture-icon-quantity">' + Client.user.furnitures[id].inventory + '</div>')
            };

            Client.inventory.$furnitures[id].$canvas.appendTo(Client.inventory.$furnitures[id].$element);
            Client.inventory.$furnitures[id].$quantity.appendTo(Client.inventory.$furnitures[id].$element);
        }

        Client.inventory.$furnitures[id].$quantity.html(Client.user.furnitures[id].inventory);
        
        if(Client.user.furnitures[id].inventory == 1)
            Client.inventory.$furnitures[id].$quantity.hide();
        else
            Client.inventory.$furnitures[id].$quantity.show();

        Client.furnitures.get(id).then(function(furniture) {
            const renderer = new Client.furnitures.renderer({ id: furniture.id, size: 1 }, Client.inventory.$furnitures[id].$canvas);
        
            Client.inventory.$furnitures[id].$element.click(function() {
                Client.inventory.$furnitures[id].$element.parent().find(".active").removeClass("active");

                Client.inventory.$furnitures[id].$element.addClass("active");
                
                setDisplay(furniture);
            });
        });
    };

    for(let id in Client.user.furnitures)
       setFurniture(id);
};
