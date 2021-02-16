Client.furnitures.entity = function(settings = {}) {
    this.settings = {
        id: null,
        library: null,
        
        size: 64,

        direction: null
    };

    this.events = {
        render: []
    };

    this.render = async function() {
        const furniture = await Client.furnitures.get(this.settings.id);

        const library = (this.settings.library != null)?(this.settings.library):("HabboFurnitures/" + furniture.line + "/" + furniture.id);

        const manifest = await Client.assets.getManifest(library);

        if(this.settings.direction == null) {
            this.settings.direction = this.getDirectionIndex(manifest, 0);
        }
        else {
            this.settings.direction = this.getDirection(manifest, this.settings.direction);
        }

        const visualization = this.getVisualization(manifest, this.settings.size);

        const layers = this.getLayers(visualization);

        const type = manifest.visualization.visualizationData.type;

        const sprites = [];

        for(let index in layers) {
            const layer = layers[index];

            const name = this.getLayerName(type, this.settings.size, index, this.settings.direction, 0);

            layer.asset = this.getLayerAsset(manifest, name);

            if(layer.asset == null) {
                delete layers[index];

                continue;
            }

            layer.sprite = await Client.assets.getSprite(library, layer.asset.name);

            if(layer.sprite == null) {
                delete layers[index];

                continue;
            }

            layer.spriteData = await Client.assets.getSpriteData(library, layer.asset.name);
            
            layer.z = (layer.z == undefined)?(0):(parseInt(layer.z));

            layer.ink = (layer.ink == undefined)?("source-over"):(this.getLayerInk(layer.ink));

            layer.asset.x = (layer.asset.x == undefined)?(0):(parseInt(layer.asset.x));
            layer.asset.y = (layer.asset.y == undefined)?(0):(parseInt(layer.asset.y));

            sprites.push(layer);
        }

        sprites.sort(function(a, b) {
            return a.z - b.z;
        });

        for(let index in this.events.render)
            this.events.render[index](sprites);
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

            case "SUBTRACT": return "luminosity";

            //case "COPY": return "source-over";

            default: return ink;
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

                asset.name = sourceAsset.name;
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

        if(visualization.layers == undefined)
            return {};

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

    this.getDirection = function(manifest, direction) {
        if(manifest.logic.objectData.model.directions == undefined)
            return 0;

        const directions = manifest.logic.objectData.model.directions.direction;
        
        for(let index in directions) {
            if((Math.floor(directions[index].id) / 45) == direction)
                return direction;
        }

        return this.getDirectionIndex(manifest, 0);
    };

    this.getDirectionIndex = function(manifest, index) {
        if(manifest.logic.objectData.model.directions == undefined)
            return 0;

        if(manifest.logic.objectData.model.directions.direction.length == undefined)
            manifest.logic.objectData.model.directions.direction = [ manifest.logic.objectData.model.directions.direction ];

        const directions = manifest.logic.objectData.model.directions.direction;

        if(directions[index] == undefined)
            return 0;

        return Math.floor(parseInt(directions[index].id) / 45);
    };

    this.update = async function(settings) {
        if(settings.id != undefined && settings.id == "HabboRoomCursor")
            settings.library = settings.id;

        for(let key in settings)
            this.settings[key] = settings[key];
    };

    this.update(settings);
};
