Client.assets = new function() {
    this.cache = {};

    this.promises = {};

    this.getManifest = async function(asset, library = true) {
        if(this.cache[asset] == undefined)
            this.cache[asset] = {};
            
        if(this.cache[asset].manifest != undefined)
            return this.cache[asset].manifest;

        await this.downloadManifest(asset, library);

        return this.cache[asset].manifest;
    };

    this.downloadManifest = async function(asset, library = true) {
        const name = asset.substring(asset.lastIndexOf('/') + 1);

        const path = (library)?("assets/" + asset + "/" + name + ".json"):("assets/" + asset + ".json");

        if(this.promises[asset] == undefined)
            this.promises[asset] = {};

        if(this.promises[asset].manifest != undefined) {
            return new Promise(function(resolve) {
                Client.assets.promises[asset].push(function() {
                    resolve();
                });
            });
        }

        this.promises[asset].manifest = [];

        return new Promise(function(resolve) {
            $.getJSON(path, function(manifest) {
                Client.assets.cache[asset].manifest = manifest;

                for(let index in Client.assets.promises[asset].manifest)
                    Client.assets.promises[asset].manifest[index]();

                resolve();
            }).fail(function() {
                Client.assets.cache[asset].manifest = {};

                for(let index in Client.assets.promises[asset].manifest)
                    Client.assets.promises[asset].manifest[index]();

                resolve();
            });
        });
    };

    this.getSpritesheet = async function(asset, library = true) {
        if(this.cache[asset] == undefined)
            this.cache[asset] = {};
            
        if(this.cache[asset].spritesheet != undefined)
            return this.cache[asset].spritesheet;

        await this.downloadSpritesheet(asset, library);

        return this.cache[asset].spritesheet;
    };

    this.downloadSpritesheet = async function(asset, library = true) {
        const name = asset.substring(asset.lastIndexOf('/') + 1);

        const path = (library)?("assets/" + asset + "/" + name + ".png"):("assets/" + asset + ".png");

        if(this.promises[asset] == undefined)
            this.promises[asset] = [];

        if(this.promises[asset].spritesheet != undefined) {
            return new Promise(function(resolve) {
                Client.assets.promises[asset].spritesheet.push(function() {
                    resolve();
                });
            });
        }

        this.promises[asset].spritesheet = [];

        return new Promise(function(resolve) {
            const image = new Image();

            image.onload = function() {
                Client.assets.cache[asset].spritesheet = image;

                for(let index in Client.assets.promises[asset].spritesheet)
                    Client.assets.promises[asset].spritesheet[index]();

                resolve();
            };

            image.onerror = function() {
                Client.assets.cache[asset].spritesheet = image;

                for(let index in Client.assets.promises[asset].spritesheet)
                    Client.assets.promises[asset].spritesheet[index]();

                resolve();
            };

            image.src = path;
        });
    };

    this.getSprite = async function(asset, sprite) {
        const manifest = await this.getManifest(asset);

        const spritesheet = await this.getSpritesheet(asset);

        if(this.cache[asset].sprites == undefined)
            this.cache[asset].sprites = {};

        if(this.cache[asset].sprites[sprite] != undefined)
            return this.cache[asset].sprites[sprite];

        const data = manifest.sprites[sprite];

        if(data.link != undefined) {
            for(let key in manifest.sprites[data.link])
                data[key] = manifest.sprites[data.link][key];

            delete data.link;
        }

        const $canvas = $('<canvas width="' + data.width + '" height="' + data.height + '"></canvas>');

        const context = $canvas[0].getContext("2d");

        context.drawImage(spritesheet, parseInt(data.left), parseInt(data.top), parseInt(data.width), parseInt(data.height), 0, 0, parseInt(data.width), parseInt(data.height));

        this.cache[asset].sprites[sprite] = $canvas[0];

        return this.cache[asset].sprites[sprite];
    };

    this.getSpriteColor = async function(asset, sprite, color) {
        const image = await this.getSprite(asset, sprite);

        if(this.cache[asset].sprites[sprite + "?color=" + color] != undefined)
            return this.cache[asset].sprites[sprite + "?color=" + color];

        const $colorCanvas = $('<canvas width="' + image.width + '" height="' + image.height + '"></canvas>');
        const colorContext = $colorCanvas[0].getContext("2d");
        colorContext.drawImage(image, 0, 0);
        colorContext.globalCompositeOperation = "multiply";
        colorContext.fillStyle = color.replace('0x', '#');
        colorContext.fillRect(0, 0, image.width, image.height);

        const $canvas = $('<canvas width="' + image.width + '" height="' + image.height + '"></canvas>');
        const context = $canvas[0].getContext("2d");
        context.drawImage(image, 0, 0);
        context.globalCompositeOperation = "source-in";
        context.drawImage($colorCanvas[0], 0, 0);

        this.cache[asset].sprites[sprite + "?color=" + color] = $canvas[0];

        return this.cache[asset].sprites[sprite + "?color=" + color];
    };
};
