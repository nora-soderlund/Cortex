Client.furnitures.entity = function(name, settings = {}) {
    this.name = name;

    this.direction = 2;

    for(let key in settings)
        this[key] = settings[key];

    this.$canvas = $('<canvas width="256" height="256"></canvas>').appendTo(Client.development.$element);

    this.render = async function() {
        const data = { maxWidth: 0, maxHeight: 0, minLeft: 0, minTop: 0 };

        if(!this.asset) {
            this.asset = await Client.assets.getManifest(name);
            
            this.visualizationData = new Client.furnitures.visualization(this.asset.visualization.visualizationData);

            this.logicData = new Client.furnitures.logic(this.asset.logic.objectData);

            this.direction = this.logicData.fixDirection(this.direction);

            this.assetsData = new Client.furnitures.assets(this.asset.assets.assets.asset);
        }

        const sprites = [];

        let layers = {};

        for(let index = 0; index < this.visualizationData.layerCount; index++)
            layers[index] = { index: 0 };

        for(let index in this.visualizationData.layers) {
            const layer = parseInt(this.visualizationData.layers[index].id);

            if(layers[layer] == undefined)
                layers[layer] = { index: 0 };

            if(this.visualizationData.layers[index].z != undefined)
                layers[layer].index += parseInt(this.visualizationData.layers[index].z);

            for(let key in this.visualizationData.layers[index]) {
                if(key == "z")
                    continue;

                layers[layer][key] = this.visualizationData.layers[index][key];
            }
        }

        if(this.visualizationData.directionLayers[this.direction] != undefined) {
            for(let index in this.visualizationData.directionLayers[this.direction]) {
                const layer = parseInt(this.visualizationData.directionLayers[this.direction][index].id);

                if(layers[layer] == undefined)
                    layers[layer] = { index: 0 };

                if(this.visualizationData.directionLayers[this.direction][index].z != undefined)
                    layers[layer].index += parseInt(this.visualizationData.directionLayers[this.direction][index].z);
                
                for(let key in this.visualizationData.directionLayers[this.direction][index]) {
                    if(key == "z")
                        continue;

                    layers[layer][key] = this.visualizationData.directionLayers[this.direction][index][key];
                }
            }
        }

        for(let index in layers) {
            const layer = Client.utils.charCode(parseInt(index));

            const priority = parseInt(layers[index].index);

            const frame = 0;

            const sprite = this.visualizationData.type + "_" + this.visualizationData.size + "_" + layer + "_" + this.direction + "_" + frame;

            const spriteData = this.assetsData.getAsset(sprite);

            if(layers[index].x != undefined)
                spriteData.x = parseInt(spriteData.x) - parseInt(layers[index].x);

            if(layers[index].y != undefined)
                spriteData.y = parseInt(spriteData.y) - parseInt(layers[index].y);

            if(spriteData == undefined) {
                console.warn("[FurnitureEntity]%c Asset " + sprite + " is not valid and doesn't exist!", "color: lightblue");

                continue;
            }

            let canvas = await Client.assets.getSprite(this.name, spriteData.name);

            const canvasData = await Client.assets.getSpriteData(this.name, spriteData.name);

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

            const result = {
                image: canvas,
                imageData: canvasData,
                left, top,
                index: priority,
                composite: Client.furnitures.getComposite(layers[index].ink),
                layer: layers[index]
            };

            sprites.push(result);
        }

        sprites.sort(function(a, b) {
            return a.index - b.index;
        });
        
        const context = this.$canvas[0].getContext("2d");

        context.fillStyle = "#242424";

        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        for(let index in sprites) {
            context.globalCompositeOperation = sprites[index].composite;
            
            context.drawImage(sprites[index].image, 128 + sprites[index].left, 128 + sprites[index].top);
        }

        for(let event in this.events.render)
            this.events.render[event](sprites, data);
    };

    this.events = new function() {
        this.render = [];
    };

    this.nextDirection = function(step) {
        this.direction = this.logicData.closestDirection(this.direction, step);
    };

    this.getDimensions = function() {
        const result = { row: 0, column: 0, depth: 0 };

        const data = this.logicData.data.model.dimensions;

        if(data.x != undefined) result.row = parseFloat(data.x);
        if(data.y != undefined) result.column = parseFloat(data.y);
        if(data.z != undefined) result.depth = parseFloat(data.z);

        if(this.direction == 0 || this.direction == 4) {
            const spare = result.row;

            result.row = result.column;
            result.column = spare;
        }

        return result;
    };

    return this;
};
