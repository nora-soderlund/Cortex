Client.inventory.pages.furnitures = async function($element) {
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

                        if(Client.user.furnitures[furniture.id].inventory == 0) {
                            result.stop();

                            delete Client.user.furnitures[furniture.id].inventory;
                            
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

    for(let id in Client.user.furnitures) {
        if(Client.user.furnitures[id].inventory == undefined)
            continue;

        const $furniture = $('<div class="dialog-item inventory-furniture-icon"></div>').appendTo($content);

        const $canvas = $('<canvas class="inventory-furniture-icon-image"></canvas>').appendTo($furniture);

        if(Client.user.furnitures[id].inventory > 1)
            $('<div class="inventory-furniture-icon-quantity">' + Client.user.furnitures[id].inventory + '</div>').appendTo($furniture);

        Client.furnitures.get(id).then(function(furniture) {
            const renderer = new Client.furnitures.renderer({ id: furniture.id, size: 1 }, $canvas);
        
            $furniture.click(function() {
                $furniture.parent().find(".active").removeClass("active");

                $furniture.addClass("active");
                
                setDisplay(furniture);
            });
        });
    }
};
