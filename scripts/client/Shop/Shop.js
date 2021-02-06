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
        Client.assets.getSpritesheet("HabboShopIcons/icon_" + icon, false).then(function(spritesheet) {
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

        Client.assets.getSpritesheet("HabboShopHeaders/" + header, false).then(function(spritesheet) {
            context.imageSmoothingEnabled = false;

            context.drawImage(spritesheet,
                0, 0, spritesheet.width, spritesheet.height,
                -((spritesheet.width * 2) - 580) / 2, -((spritesheet.height * 2) - 95) / 2, spritesheet.width * 2, spritesheet.height * 2);
        });
    };

    entity.setPage = async function(id) {
        const page = entity.pages.find(x => x.id == id);

        if(!page.data)
            page.data = await Client.socket.messages.sendCall({ OnShopPageUpdate: id }, "OnShopPageUpdate");

        entity.header.setTitle(page.title);

        entity.header.setDescription((page.data.description)?(page.data.description):(""));

        entity.setIcon(page.icon);

        entity.setHeader((page.data.header)?(page.data.header):(""));
    
        if(page.parent == 0) {
            try {
                entity.category = new Client.shop.types[page.data.type](page);
            }
            catch(exception) {
                entity.tabs.$content.html(exception);
            }
        }
        else {
            try {
                entity.page = await Client.shop.types[page.data.type](page);
            }
            catch(exception) {
                entity.category.$content.html(exception);
            }
        }
    };

    entity.events.create.push(async function() {
        if(!entity.pages)
            entity.pages = await Client.socket.messages.sendCall({ OnShopUpdate: null }, "OnShopUpdate");

        entity.header = new Client.dialogs.header({ height: 95 });

        entity.header.$element.appendTo(entity.$content);

        entity.tabs = new Client.dialogs.tabs(500);

        entity.$icon = $('<canvas width="64" height="64"></canvas>');

        entity.header.setIcon(entity.$icon);

        const categories = entity.pages.filter(x => x.parent == 0);

        for(let index in categories)
            entity.tabs.add(categories[index].id, categories[index].title);

        entity.tabs.click(entity.setPage);

        entity.tabs.show(categories[0].id);

        entity.tabs.$element.appendTo(entity.$content);
    });

    entity.events.show.push(function() {
        
    });

    return entity;
};
