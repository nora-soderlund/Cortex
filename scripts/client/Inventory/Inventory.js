const Inventory = new Dialog({
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

Inventory.pages = {};

Inventory.events.create.push(async function() {
    Inventory.tabs = new DialogTabs("100%");

    Inventory.tabs.element.addClass("inventory-tabs");

    Inventory.tabs.add("furnitures", "Furnitures");
    Inventory.tabs.add("badges", "Badges");

    Inventory.tabs.add("pets", "Pets", undefined, true);
    Inventory.tabs.add("bots", "Bots", undefined, true);

    Inventory.tabs.click(async function(identifier, $content) {
        try {
            Inventory.$furnitures = {};
            
            Inventory.page = Inventory.pages[identifier]($content);
        }
        catch(exception) {
            $content.html(exception);
        }
    });

    Inventory.tabs.show("furnitures");

    Inventory.tabs.element.appendTo(Inventory.$content);
});

Inventory.events.show.push(function() {
    if(Client.rooms.interface.furniture.place.enabled == true) {
        Client.rooms.interface.furniture.place.stop();
    }

    Inventory.tabs.show();
});