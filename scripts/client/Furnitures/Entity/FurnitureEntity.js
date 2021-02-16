Client.furnitures.entity = function(settings = {}) {
    this.settings = {
        id: null,
        library: null,
        
        size: 64,

        direction: null,

        animation: 1
    };

    this.events = {
        render: []
    };

    this.render = async function() {
        const furniture = await Client.furnitures.get(this.settings.id);

        const library = (this.settings.library != null)?(this.settings.library):("HabboFurnitures/" + furniture.line + "/" + furniture.id);

        if(this.manifest == undefined)
            this.manifest = await Client.assets.getManifest(library);

        // TODO: move this to an independant function

        if(this.settings.direction == null) {
            this.settings.direction = this.getDirectionIndex(this.manifest, 0);
        }
        else {
            this.settings.direction = this.getDirection(this.manifest, this.settings.direction);
        }

        const visualization = this.getVisualization(this.manifest, this.settings.size);

        const layers = this.getLayers(visualization);

        const type = this.manifest.visualization.visualizationData.type;

        if(this.manifest.index.object.visualization == "furniture_animated" && this.animations == undefined)
            this.animations = this.getVisualizationAnimation(visualization, this.settings.animation);

        const sprites = [];

        for(let index in layers) {
            const layer = layers[index];

            const frame = this.getVisualizationAnimationLayer(index);

            const name = this.getLayerName(type, this.settings.size, index, this.settings.direction, frame);

            layer.asset = this.getLayerAsset(this.manifest, name);

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
        if(size == 1)
            return id + "_icon_" + Client.utils.charCode(parseInt(layer));

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

    this.getVisualizationAnimation = function(visualization, animation) {
        if(visualization.animations == null || visualization.animations == undefined)
            return {};

        for(let index in visualization.animations.animation) {
            if(visualization.animations.animation[index].id != animation)
                continue;

            const animationLayers = visualization.animations.animation[index].animationLayer;

            const layers = {};

            for(let index in animationLayers) {
                const layer = animationLayers[index].id;

                if(animationLayers[index].frameSequence == undefined)
                    continue;

                if(animationLayers[index].frameSequence.frame == undefined)
                    continue;

                layers[layer] = {
                    frameSequence: [],
                    frameRepeat: (animationLayers[index].frameRepeat != undefined)?(parseInt(animationLayers[index].frameRepeat)):(0),
                    frameLoop: (animationLayers[index].loopCount != undefined)?(parseInt(animationLayers[index].loopCount)):(0),

                    timestamp: performance.now(),
                    frame: 0
                };

                if(animationLayers[index].frameSequence.frame.length == undefined)
                    animationLayers[index].frameSequence.frame = [ animationLayers[index].frameSequence.frame ];

                for(let frame in animationLayers[index].frameSequence.frame)
                    layers[layer].frameSequence.push(animationLayers[index].frameSequence.frame[frame].id);
            }

            return layers;
        }

        return {};
    };

    this.getVisualizationAnimationLayer = function(layer) {
        if(this.animations == undefined || this.animations[layer] == undefined)
            return 0;

        return this.animations[layer].frameSequence[this.animations[layer].frame];
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

    this.getDimensions = function() {
        const result = { row: 0, column: 0, depth: 0 };

        const data = this.manifest.logic.objectData.model.dimensions;

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

    this.update = async function(settings) {
        if(settings.id != undefined && settings.id == "HabboRoomCursor")
            settings.library = settings.id;

        for(let key in settings)
            this.settings[key] = settings[key];
    };

    this.updateAnimations = function(timestamp = performance.now()) {
        let updated = false;

        for(let index in this.animations) {
            if(!((timestamp - this.animations[index].timestamp) > (1000 / 12)))
                continue;

            this.animations[index].frame++;

            if(this.animations[index].frame >= this.animations[index].frameSequence.length)
                this.animations[index].frame = 0;

            this.animations[index].timestamp = timestamp;

            updated = true;
        }

        return updated;
    };

    this.update(settings);
};
