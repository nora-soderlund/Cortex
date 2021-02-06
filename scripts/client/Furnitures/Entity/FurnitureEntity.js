Client.furnitures.entity = function(name) {
    this.name = name;

    this.direction = 2;

    this.$canvas = $('<canvas width="256" height="256"></canvas>').appendTo(Client.development.$element);

    this.render = async function() {
        const data = { maxWidth: 0, maxHeight: 0, minLeft: 0, minTop: 0 };

        if(!this.asset) {
            this.asset = await Client.assets.getManifest(name);
            
            this.visualizationData = new Client.furnitures.visualization(this.asset.visualization.visualizationData);

            this.logicData = new Client.furnitures.logic(this.asset.logic.objectData);

            this.assetsData = new Client.furnitures.assets(this.asset.assets.assets.asset);
        }

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
            const layer = parseInt(this.visualizationData.directionLayers.id);

            if(layers[layer] == undefined) layers[layer] = 0;

            layers[layer] += (this.visualizationData.directionLayers.z != undefined)?(parseInt(this.visualizationData.directionLayers.z)):(0);
        }
        else {
            for(let index in this.visualizationData.directionLayers) {
                const layer = parseInt(this.visualizationData.directionLayers[index].id);

                if(layers[layer] == undefined) layers[layer] = 0;

                layers[layer] += (this.visualizationData.directionLayers[index].z != undefined)?(parseInt(this.visualizationData.directionLayers[index].z)):(0);
            }
        }

        for(let index in layers) {
            const layer = Client.utils.charCode(parseInt(index));

            const priority = parseInt(layers[index]);

            const frame = 0;

            const sprite = this.visualizationData.type + "_" + this.visualizationData.size + "_" + layer + "_" + this.direction + "_" + frame;

            const spriteData = this.assetsData.getAsset(sprite);

            if(spriteData == undefined) {
                console.warn("[FurnitureEntity]%c Asset " + sprite + " is not valid and doesn't exist!", "color: lightblue");

                continue;
            }

            let canvas = await Client.assets.getSprite(this.name, spriteData.name);

            let left = -parseInt(spriteData.x);
            let top = -parseInt(spriteData.y);

            if(spriteData.flipH) {
                left = (left * -1) - canvas.width;

                const $flipCanvas = $('<canvas width="' + canvas.width + '" height="' + canvas.height + '"></canvas>');

                const flipContext = $flipCanvas[0].getContext("2d");

                flipContext.translate(canvas.width, 0);

                flipContext.scale(-1, 1);

                flipContext.drawImage(canvas, 0, 0);

                canvas = $flipCanvas[0];
            }

            if(data.minLeft > left)
                data.minLeft = left;

            if(data.minTop > top)
                data.minTop = top;

            if((left + canvas.width) > data.maxWidth)
                data.maxWidth = left + canvas.width;

            if((top + canvas.height) > data.maxHeight)
                data.maxHeight = top + canvas.height;

            sprites.push({
                image: canvas,
                left, top,
                index: priority
            });
        }
        
        const context = this.$canvas[0].getContext("2d");

        sprites.sort(function(a, b) {
            return a.index - b.index;
        });

        for(let index in sprites)
           context.drawImage(sprites[index].image, 128 + sprites[index].left, 128 + sprites[index].top);

        for(let event in this.events.render)
            this.events.render[event](sprites, data);
    };

    this.events = new function() {
        this.render = [];
    };

    return this;
};
