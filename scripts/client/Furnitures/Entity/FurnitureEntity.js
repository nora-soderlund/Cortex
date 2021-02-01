Client.furnitures.entity = function(name, asset) {
    this.name = name;

    this.asset = asset;

    this.visualizationData = new Client.furnitures.visualization(this.asset.manifest.visualization.visualizationData);

    this.logicData = new Client.furnitures.logic(this.asset.manifest.logic.objectData);

    this.assetsData = new Client.furnitures.assets(this.asset.manifest.assets.assets.asset);

    this.direction = 4;

    this.render = async function() {
        const sprites = [];

        let layers = {};

        for(let index = 0; index < this.visualizationData.layerCount; index++)
            layers[index] = 0;

        if(this.visualizationData.layers.length == undefined) {
            if(this.visualizationData.layers.z != undefined) {
                const layer = parseInt(this.visualizationData.layers.id);

                layers[layer] += parseInt(this.visualizationData.layers.z);
            }
        }
        else {
            for(let index in this.visualizationData.layers) {
                if(this.visualizationData.layers[index].z == undefined)
                    continue;

                const layer = parseInt(this.visualizationData.layers[index].id);
    
                layers[layer] += parseInt(this.visualizationData.layers[index].z);
            }
        }

        if(this.visualizationData.directionLayers.length == undefined) {
            if(this.visualizationData.directionLayers.z != undefined) {
                const layer = parseInt(this.visualizationData.directionLayers.id);

                layers[layer] += parseInt(this.visualizationData.directionLayers.z);
            }
        }
        else {
            for(let index in this.visualizationData.directionLayers) {
                if(this.visualizationData.directionLayers[index].z == undefined)
                    continue;

                const layer = parseInt(this.visualizationData.directionLayers[index].id);
    
                layers[layer] += parseInt(this.visualizationData.directionLayers[index].z);
            }
        }

        for(let index in layers) {
            const layer = Client.utils.charCode(parseInt(index));

            const priority = parseInt(layers[index]);

            const frame = 0;

            const sprite = this.visualizationData.type + "_" + this.visualizationData.size + "_" + layer + "_" + this.direction + "_" + frame;

            const spriteData = this.assetsData.getAsset(sprite);

            if(spriteData == undefined) {
                Client.utils.warn("FurnitureEntity", "Asset " + sprite + " is not valid and doesn't exist!");

                continue;
            }

            let canvas = await Client.assets.getSprite(this.name, spriteData.name);

            let left = -parseInt(spriteData.x);
            let top = -parseInt(spriteData.y);

            if(spriteData.flipH) {
                left = (left * -1) - canvas.width;

                const $canvas = $('<canvas width="' + canvas.width + '" height="' + canvas.height + '"></canvas>');

                const context = $canvas[0].getContext("2d");

                context.translate(canvas.width, 0);

                context.scale(-1, 1);

                context.drawImage(canvas, 0, 0);

                canvas = $canvas[0];
            }

            sprites.push({
                image: canvas,
                left, top,
                index: priority
            });
        }

        for(let event in this.events.render)
            this.events.render[event](sprites);
    };

    this.events = new function() {
        this.render = [];
    };

    return this;
};
