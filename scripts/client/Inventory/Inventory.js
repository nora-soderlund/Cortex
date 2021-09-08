Client.inventory = new function() {
    const entity = new Dialog({
        title: "Inventory",
        
        size: {
            width: 480,
            height: 280
        },

        offset: {
            type: "center"
        },

        resizable: true
    });

    entity.pages = {};

    entity.events.create.push(async function() {
        entity.tabs = new DialogTabs("100%");

        entity.tabs.$element.addClass("inventory-tabs");

        entity.tabs.add("furnitures", "Furnitures");
        entity.tabs.add("badges", "Badges");

        entity.tabs.add("pets", "Pets", undefined, true);
        entity.tabs.add("bots", "Bots", undefined, true);

        entity.tabs.click(async function(identifier, $content) {
            try {
                entity.$furnitures = {};
                
                entity.page = Client.inventory.pages[identifier]($content);
            }
            catch(exception) {
                $content.html(exception);
            }
        });

        entity.tabs.show("furnitures");

        entity.tabs.$element.appendTo(entity.$content);
    });

    entity.events.show.push(function() {
        if(Client.rooms.interface.furniture.place.enabled == true) {
            Client.rooms.interface.furniture.place.stop();
        }

        entity.tabs.show();
    });

    return entity;
};
