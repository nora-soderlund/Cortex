Client.inventory = new function() {
    const entity = new Client.dialogs.default({
        title: "Inventory",
        
        size: {
            width: 480,
            height: 300
        },

        offset: {
            type: "center"
        }
    });

    entity.events.create.push(async function() {
        entity.tabs = new Client.dialogs.tabs(280);

        entity.tabs.add("furnitures", "Furnitures");
        entity.tabs.add("pets", "Pets");
        entity.tabs.add("bots", "Bots");
        entity.tabs.add("badges", "Badges");

        entity.tabs.show("furnitures");

        entity.tabs.$element.appendTo(entity.$content);
    });

    entity.events.show.push(function() {
        
    });

    return entity;
};
