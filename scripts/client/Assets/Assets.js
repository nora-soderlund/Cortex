class Assets {
    static cache = {};

    static promises = {};

    static async getManifest(asset, library = true) {
        if(Assets.cache[asset] == undefined)
            Assets.cache[asset] = {};
            
        if(Assets.cache[asset].manifest != undefined)
            return Assets.cache[asset].manifest;

        await Assets.downloadManifest(asset, library);

        return Assets.cache[asset].manifest;
    };

    static async downloadManifest(asset, library = true) {
        const name = asset.substring(asset.lastIndexOf('/') + 1);

        const path = Loader.settings.cdn + ((library)?("assets/" + asset + "/" + name + ".json"):("assets/" + asset + ".json"));

        if(Assets.promises[asset] == undefined)
            Assets.promises[asset] = {};
            
        if(Assets.promises[asset] == undefined)
            Assets.promises[asset] = {};

        if(Assets.promises[asset].manifest != undefined) {
            return new Promise(function(resolve) {
                Assets.promises[asset].manifest.push(function() {
                    resolve();
                });
            });
        }

        Assets.promises[asset].manifest = [];

        return new Promise(function(resolve) {
            fetch(path).then((response) => response.json().then((manifest) => {
                Assets.cache[asset].manifest = manifest;

                for(let index in Assets.promises[asset].manifest)
                    Assets.promises[asset].manifest[index]();

                resolve();
            })).catch(function() {
                Assets.cache[asset].manifest = {};

                for(let index in Assets.promises[asset].manifest)
                    Assets.promises[asset].manifest[index]();

                resolve();
            });
        });
    };

    static async getSpritesheet(asset, library = true) {
        if(Assets.cache[asset] == undefined)
            Assets.cache[asset] = {};
            
        if(Assets.cache[asset].spritesheet != undefined)
            return Assets.cache[asset].spritesheet;

        await Assets.downloadSpritesheet(asset, library);

        return Assets.cache[asset].spritesheet;
    };

    static async downloadSpritesheet(asset, library = true) {
        const name = asset.substring(asset.lastIndexOf('/') + 1);

        let path = Loader.settings.cdn + ((library)?("assets/" + asset + "/" + name):("assets/" + asset));

        if(library == true || asset.indexOf('.') == -1)
            path += ".png";

        if(Assets.promises[asset] == undefined)
            Assets.promises[asset] = [];

        if(Assets.promises[asset].spritesheet != undefined) {
            return new Promise(function(resolve) {
                Assets.promises[asset].spritesheet.push(function() {
                    resolve();
                });
            });
        }

        Assets.promises[asset].spritesheet = [];

        return new Promise(function(resolve) {
            const image = new Image();

            image.onload = function() {
                Assets.cache[asset].spritesheet = image;

                for(let index in Assets.promises[asset].spritesheet)
                    Assets.promises[asset].spritesheet[index]();

                resolve();
            };

            image.onerror = function() {
                Assets.cache[asset].spritesheet = image;

                for(let index in Assets.promises[asset].spritesheet)
                    Assets.promises[asset].spritesheet[index]();

                resolve();
            };

            image.src = path;
        });
    };

    static async getSprite(asset, sprite, flipped = false) {
        const manifest = await Assets.getManifest(asset);

        const spritesheet = await Assets.getSpritesheet(asset);

        if(Assets.cache[asset].sprites == undefined)
            Assets.cache[asset].sprites = {};

        if(Assets.cache[asset].spritesData == undefined)
            Assets.cache[asset].spritesData = {};

        if(Assets.cache[asset].sprites[sprite + ((flipped == true)?("?flipped=true"):(""))] != undefined)
            return Assets.cache[asset].sprites[sprite + ((flipped == true)?("?flipped=true"):(""))];

        const data = manifest.sprites[sprite];

        if(data == undefined) {
            console.warn("[Assets] " + sprite + " in library " + asset + " does not exist!");

            return null;
        }

        if(data.link != undefined) {
            for(let key in manifest.sprites[data.link])
                data[key] = manifest.sprites[data.link][key];

            delete data.link;
        }

        const canvas = document.createElement("canvas");
        canvas.width = data.width;
        canvas.height = data.height;

        const context = canvas.getContext("2d");

        context.drawImage(spritesheet, parseInt(data.left), parseInt(data.top), parseInt(data.width), parseInt(data.height), 0, 0, parseInt(data.width), parseInt(data.height));

        Assets.cache[asset].sprites[sprite] = canvas;

        if(flipped == true) {
            const flippedCanvas = document.createElement("canvas");
            flippedCanvas.width = data.width;
            flippedCanvas.height = data.height;

            const flippedContext = flippedCanvas.getContext("2d");

            flippedContext.translate(flippedContext.canvas.width, 0);

            flippedContext.scale(-1, 1);

            flippedContext.drawImage(canvas, 0, 0);
            
            Assets.cache[asset].sprites[sprite + "?flipped=true"] = flippedCanvas;

            return Assets.cache[asset].sprites[sprite + "?flipped=true"];
        }

        return Assets.cache[asset].sprites[sprite];
    };

    static async getSpriteData(asset, sprite) {
        const image = await Assets.getSprite(asset, sprite);

        if(Assets.cache[asset].spritesData[sprite] != undefined)
            return Assets.cache[asset].spritesData[sprite];

        Assets.cache[asset].spritesData[sprite] = image.getContext("2d").getImageData(0, 0, image.width, image.height);

        return Assets.cache[asset].spritesData[sprite];
    };

    static async getSpriteColor(asset, sprite, color) {
        const image = await Assets.getSprite(asset, sprite);

        if(Assets.cache[asset].sprites[sprite + "?color=" + color] != undefined)
            return Assets.cache[asset].sprites[sprite + "?color=" + color];

        const colorCanvas = document.createElement("canvas");
        colorCanvas.width = image.width;
        colorCanvas.height = image.height;
        const colorContext = colorCanvas.getContext("2d");
        colorContext.drawImage(image, 0, 0);
        colorContext.globalCompositeOperation = "multiply";
        colorContext.fillStyle = color.replace('0x', '#');
        colorContext.fillRect(0, 0, image.width, image.height);

        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        context.globalCompositeOperation = "source-in";
        context.drawImage(colorCanvas, 0, 0);

        Assets.cache[asset].sprites[sprite + "?color=" + color] = canvas;

        return Assets.cache[asset].sprites[sprite + "?color=" + color];
    };
};
