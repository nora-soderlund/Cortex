Client.furnitures.newEntity = function(settings = {}) {
    this.settings = {
        id: null,
        library: null,
        
        size: 64,

        direction: 0
    };

    this.$canvas = $('<canvas width="256" height="256"></canvas>').prependTo(Client.development.$element);

    this.render = async function() {
        const furniture = await Client.furnitures.get(this.settings.id);

        const library = (this.settings.library != null)?(this.settings.library):("HabboFurnitures/" + furniture.line + "/" + furniture.id);

        const manifest = await Client.assets.getManifest(library);

        const visualization = this.getVisualization(manifest, this.settings.size);

        const layers = this.getLayers(visualization);

        const type = manifest.visualization.visualizationData.type;

        const sprites = [];

        for(let index in layers) {
            const layer = layers[index];

            const name = this.getLayerName(type, this.settings.size, index, this.settings.direction, 0);

            layer.sprite = await Client.assets.getSprite(library, name);
            layer.spriteData = await Client.assets.getSpriteData(library, name);
            
            layer.z = (layer.z == undefined)?(0):(parseInt(layer.z));

            layer.ink = (layer.ink == undefined)?("source-over"):(this.getLayerInk(layer.ink));

            layer.asset = this.getLayerAsset(manifest, name);

            layer.asset.x = (layer.asset.x == undefined)?(0):(parseInt(layer.asset.x));
            layer.asset.y = (layer.asset.y == undefined)?(0):(parseInt(layer.asset.y));

            sprites.push(layer);
        }

        sprites.sort(function(a, b) {
            return a.z - b.z;
        });

        const context = this.$canvas[0].getContext("2d");

        for(let index in sprites) {
            const sprite = sprites[index];

            context.globalCompositeOperation = sprite.ink;

            context.drawImage(sprite.sprite, 128 - sprite.asset.x, 128 - sprite.asset.y);
        }
    };

    this.getLayers = function(visualization) {
        const layerCount = parseInt(visualization.layerCount);

        const layers = this.getVisualizationLayers(visualization);

        const directions = this.getVisualizationDirectionLayers(visualization, this.settings.direction);

        for(let key in directions) {
            if(layers[key] == undefined)
                layers[key] = {};

            for(let property in directions[key])
                layers[property] = directions[key][property];
        }
        
        for(let index = 0; index < layerCount; index++) {
            if(layers[index] == undefined)
                layers[index] = {};
        }

        return layers;
    };

    this.getLayerName = function(id, size, layer, direction, frame) {
        return id + "_" + size + "_" + Client.utils.charCode(parseInt(layer)) + "_" + direction + "_" + frame;
    };

    this.getLayerInk = function(ink) {
        switch(ink) {
            case "ADD": return "lighter";

            default: return "source-over";
        }
    };

    this.getLayerAsset = function(manifest, name) {
        for(let index in manifest.assets.assets.asset) {
            const asset = manifest.assets.assets.asset[index];

            if(asset.name != name)
                continue;

            if(asset.source != undefined) {
                const sourceAsset = this.getLayerAsset(manifest, asset.source);

                delete asset.source;

                for(let key in sourceAsset) {
                    if(asset[key] == undefined) 
                        asset[key] = sourceAsset[key];
                }
            }

            return asset;
        }

        return null;
    };

    this.getVisualization = function(manifest, size) {
        const data = manifest.visualization.visualizationData;

        const visualization = (data.graphics != undefined)?(data.graphics.visualization):(data.visualization);

        for(let index in visualization) {
            if(visualization[index].size == size)
                return visualization[index];
        }

        return null;
    };

    this.getVisualizationLayers = function(visualization) {
        const layers = {};

        if(visualization.layers.layer.length == undefined)
            visualization.layers.layer = [ visualization.layers.layer ];

        for(let index in visualization.layers.layer) {
            const layer = visualization.layers.layer[index];

            layers[layer.id] = {};

            for(let key in layer) {
                if(key == "id")
                    continue;

                layers[layer.id][key] = layer[key];
            }
        }

        return layers;
    };

    this.getVisualizationDirectionLayers = function(visualization, direction) {
        if(visualization.directions == undefined)
            return {};

        if(visualization.directions.direction.length == undefined)
            visualization.directions.direction = [ visualization.directions.direction ];

        for(let index in visualization.directions.direction) {
            if(visualization.directions.direction[index].id != direction)
                continue;

            const directions = visualization.directions.direction[index];

            if(directions.layer == undefined)
                return {};

            if(directions.layer.length == undefined)
                directions.layer = [ directions.layer ];

            const layers = {};

            for(let index in directions.layer) {
                const layer = directions.layer[index];

                layers[layer.id] = {};

                for(let key in layers) {
                    if(key == "id")
                        continue;

                    layers[layer.id][key] = layers[key];
                }
            }

            return layers;
        }

        return {};
    };

    this.update = function(settings) {
        for(let key in settings)
            this.settings[key] = settings[key];
    };

    this.update(settings);
};
