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
            this.promises[asset] = {};

        if(this.promises[asset].spritesheet != undefined) {
            return new Promise(function(resolve) {
                Client.assets.promises[asset].push(function() {
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

        const $canvas = $('<canvas width="' + data.width + '" height="' + data.height + '"></canvas>');

        const context = $canvas[0].getContext("2d");

        context.drawImage(spritesheet, parseInt(data.left) * -1, parseInt(data.top) * -1);

        this.cache[asset].sprites[sprite] = $canvas[0];

        return this.cache[asset].sprites[sprite];
    };
};