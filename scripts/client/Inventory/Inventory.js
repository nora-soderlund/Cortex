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

    Inventory.tabs.element.classList.add("inventory-tabs");

    Inventory.tabs.add("furnitures", "Furnitures");
    Inventory.tabs.add("badges", "Badges");

    Inventory.tabs.add("pets", "Pets", undefined, true);
    Inventory.tabs.add("bots", "Bots", undefined, true);

    Inventory.tabs.click(async function(identifier, $content) {
        try {
            Inventory.furnitures = {};
            
            Inventory.page = Inventory.pages[identifier]($content);
        }
        catch(exception) {
            content.innerHTML = exception;
        }
    });

    Inventory.tabs.show("furnitures");

    Inventory.content.append(Inventory.tabs.element);
});

Inventory.events.show.push(function() {
    if(RoomInterface.furniture.place.enabled == true) {
        RoomInterface.furniture.place.stop();
    }

    Inventory.tabs.show();
});