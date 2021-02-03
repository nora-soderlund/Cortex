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
        Client.assets.getSpritesheetOnly("HabboShopHeaders/" + header).then(function(spritesheet) {
            const context = entity.header.getContext("2d");

            context.imageSmoothingEnabled = false;

            context.drawImage(spritesheet,
                0, 0, spritesheet.width, spritesheet.height,
                -((spritesheet.width * 2) - 580) / 2, -((spritesheet.height * 2) - 95) / 2, spritesheet.width * 2, spritesheet.height * 2);
        });
    };

    entity.events.create.push(function() {
        entity.header = new Client.dialogs.header({ height: 95 });

        entity.header.$element.appendTo(entity.$content);

        entity.tabs = new Client.dialogs.tabs("auto");

        entity.$icon = $('<canvas width="60" height="60"></canvas>');

        entity.header.setIcon(entity.$icon);

        entity.tabs.add("frontpage", "Frontpage", function($element) {
            entity.header.setTitle("Frontpage!");
    
            entity.header.setDescription("");

            entity.setIcon(213);

            entity.setHeader("Shop");
        });

        entity.tabs.show("frontpage");

        entity.tabs.$element.appendTo(entity.$content);
    });

    entity.events.show.push(function() {
        
    });

    return entity;
};
