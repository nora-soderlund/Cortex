Client.shop = new function() {
    const entity = new Client.dialogs.default({
        title: "Shop",
        
        size: {
            width: 580,
            height: 600
        },

        offset: {
            type: "center"
        }
    });

    entity.types = {};

    entity.setIcon = function(icon) {
        Client.assets.getSpritesheetOnly("HabboShopIcons/icon_" + icon).then(function(spritesheet) {
            const context = entity.$icon[0].getContext("2d");

            context.imageSmoothingEnabled = false;

            const width = spritesheet.width * 3, height = spritesheet.height * 3;

            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            context.drawImage(spritesheet,
                0, 0, spritesheet.width, spritesheet.height,
                (context.canvas.width - width) / 2, (context.canvas.height - height) / 2, width, height);
        });
    };

    entity.setHeader = function(header) {
        const context = entity.header.getContext("2d");

        if(header.length == 0) {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            return;
        }

        Client.assets.getSpritesheetOnly("HabboShopHeaders/" + header).then(function(spritesheet) {
            context.imageSmoothingEnabled = false;

            context.drawImage(spritesheet,
                0, 0, spritesheet.width, spritesheet.height,
                -((spritesheet.width * 2) - 580) / 2, -((spritesheet.height * 2) - 95) / 2, spritesheet.width * 2, spritesheet.height * 2);
        });
    };

    entity.setCategory = function(id) {
        const page = entity.pages.find(x => x.id == id);

        entity.header.setTitle(page.title);

        entity.header.setDescription("");

        entity.setIcon(page.icon);

        entity.setHeader("");

        entity.category = new Client.shop.types.pages();
    };

    entity.setPage = function(id) {
        const page = entity.pages.find(x => x.id == id);

        entity.header.setTitle(page.title);

        entity.header.setDescription("");

        entity.setIcon(page.icon);

        entity.setHeader("");
    };

    entity.events.create.push(async function() {
        if(!entity.pages)
            entity.pages = await Client.socket.messages.sendCall({ OnShopUpdate: null }, "OnShopUpdate");

        entity.header = new Client.dialogs.header({ height: 95 });

        entity.header.$element.appendTo(entity.$content);

        entity.tabs = new Client.dialogs.tabs("auto");

        entity.$icon = $('<canvas width="64" height="64"></canvas>');

        entity.header.setIcon(entity.$icon);

        const categories = entity.pages.filter(x => x.parent == 0);

        for(let index in categories)
            entity.tabs.add(categories[index].id, categories[index].title);

        entity.tabs.click(entity.setCategory);

        entity.tabs.show(categories[0].id);

        entity.tabs.$element.appendTo(entity.$content);
    });

    entity.events.show.push(function() {
        
    });

    return entity;
};
