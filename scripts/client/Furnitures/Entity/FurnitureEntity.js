class FurnitureEntity {
    constructor(settings = {}) {
        this.update(settings);
        console.error(settings);
    };

    settings = {
        id: null,
        library: null,
        
        size: 64,

        direction: null,

        animation: 0
    };

    events = {
        render: []
    };

    async render() {
       // const layerName = this.types.type + "_" + this.settings.size + "_" + this.settings.animation + "_" + this.settings.direction + "_" + JSON.stringify(this.animations);
        //console.error(layerName);

        //if(Furnitures.layers[layerName] == undefined) {
        const layers = this.getLayers();

        const sprites = [];

        for(let index in layers) {
            const layer = layers[index];

            const frame = this.getVisualizationAnimationLayer(index);

            const name = this.getLayerName(this.types.type, this.settings.size, index, this.settings.direction, frame);

            if(Furnitures.layers[name] == undefined) {
                layer.asset = this.getLayerAsset(name);

                if(layer.asset == null) {
                    delete layers[index];

                    continue;
                }

                layer.sprite = await Assets.getSprite(this.library, layer.asset.name, (layer.asset.flipH == 1)?(true):(false));

                if(layer.sprite == null) {
                    delete layers[index];

                    continue;
                }

                layer.spriteData = await Assets.getSpriteData(this.library, layer.asset.name + ((layer.asset.flipH == 1)?("?flipped=true"):("")));
                
                layer.z = (layer.z == undefined)?(0):(parseInt(layer.z));

                layer.ink = (layer.ink == undefined)?("source-over"):(this.getLayerInk(layer.ink));

                layer.alpha = (layer.alpha == undefined)?(1.0):(parseInt(layer.alpha) / 100);

                layer.asset.x = (layer.asset.x == undefined)?(0):(parseInt(layer.asset.x));
                layer.asset.y = (layer.asset.y == undefined)?(0):(parseInt(layer.asset.y));
                
                if(layer.asset.flipH == 1)
                    layer.asset.x = (layer.asset.x * -1) + layer.sprite.width;

                Furnitures.layers[name] = layer;
            }

            sprites.push(Furnitures.layers[name]);
        }

        sprites.sort(function(a, b) {
            return a.z - b.z;
        });
            
            //Furnitures.layers[layerName] = sprites;
        //}

        for(let index in this.events.render)
            this.events.render[index](sprites);
    };

    getLayers() {
        const layerCount = parseInt(this.visualization.layerCount);

        const layers = this.getVisualizationLayers();

        const directions = this.getVisualizationDirectionLayers(this.settings.direction);

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

    getLayerName(id, size, layer, direction, frame) {
        if(size == 1)
            return id + "_icon_" + Client.utils.charCode(parseInt(layer));

        return id + "_" + size + "_" + Client.utils.charCode(parseInt(layer)) + "_" + direction + "_" + frame;
    };

    getLayerInk(ink) {
        switch(ink) {
            case "ADD": return "lighter";

            case "SUBTRACT": return "luminosity";

            //case "COPY": return "source-over";

            default: return ink;
        }
    };

    getLayerAsset(name) {
        for(let index in this.manifest.assets.assets.asset) {
            const asset = JSON.parse(JSON.stringify(this.manifest.assets.assets.asset[index]));

            if(asset.name != name)
                continue;

            if(asset.source != undefined && asset.source != asset.name) {
                const sourceAsset = this.getLayerAsset(asset.source);

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

    getVisualization() {
        const data = this.manifest.visualization.visualizationData;

        const visualization = (data.graphics != undefined)?(data.graphics.visualization):(data.visualization);

        for(let index in visualization) {
            if(visualization[index].size == this.settings.size)
                return visualization[index];
        }

        return null;
    };

    getVisualizationLayers() {
        const layers = {};

        if(this.visualization.layers == undefined)
            return {};

        if(this.visualization.layers.layer.length == undefined)
            this.visualization.layers.layer = [ this.visualization.layers.layer ];

        for(let index in this.visualization.layers.layer) {
            const layer = this.visualization.layers.layer[index];

            layers[layer.id] = {};

            for(let key in layer) {
                if(key == "id")
                    continue;

                layers[layer.id][key] = layer[key];
            }
        }

        return layers;
    };

    getVisualizationDirectionLayers() {
        if(this.visualization.directions == undefined)
            return {};

        if(this.visualization.directions.direction.length == undefined)
            this.visualization.directions.direction = [ this.visualization.directions.direction ];

        for(let index in this.visualization.directions.direction) {
            if(this.visualization.directions.direction[index].id != this.settings.direction)
                continue;

            const directions = this.visualization.directions.direction[index];

            if(directions.layer == undefined)
                return {};

            if(directions.layer.length == undefined)
                directions.layer = [ directions.layer ];

            const layers = {};

            for(let index in directions.layer) {
                const layer = directions.layer[index];

                layers[layer.id] = {};

                for(let key in layer) {
                    if(key == "id")
                        continue;

                    layers[layer.id][key] = layer[key];
                }
            }

            return layers;
        }

        return {};
    };

    getVisualizationAnimation() {
        if(this.visualization.animations == null || this.visualization.animations == undefined)
            return undefined;

        if(this.settings.animation != 0) {
            if(this.types.logic == "furniture_score") {
                const layers = {};

                let layer = 2;
                
                for(let index = 1; index <= 100; index *= 10) {
                    layers["" + layer] = {
                        frameSequence: [ Math.floor((this.settings.animation / index) % 10) ],
                        
                        frameRepeat: 0,
                        frameRepeatSequence: 0,

                        frameLoop: 0,
                        frameTransition: undefined,

                        frame: 0
                    };
                    
                    layer++;
                }

                return layers;
            }
            else if(this.types.logic == "furniture_counter_clock") {
                const layers = {};
                
                const minutes = Math.floor(this.settings.animation / 60);

                const seconds = this.settings.animation - (minutes * 60);

                layers["" + 6] = {
                    frameSequence: [ Math.floor((seconds / 1) % 10) ],
                    
                    frameRepeat: 0,
                    frameRepeatSequence: 0,

                    frameLoop: 0,
                    frameTransition: undefined,

                    frame: 0
                };

                layers["" + 7] = {
                    frameSequence: [ Math.floor((seconds / 10) % 10) ],
                    
                    frameRepeat: 0,
                    frameRepeatSequence: 0,

                    frameLoop: 0,
                    frameTransition: undefined,

                    frame: 0
                };

                layers["" + 8] = {
                    frameSequence: [ Math.floor((minutes / 1) % 10) ],
                    
                    frameRepeat: 0,
                    frameRepeatSequence: 0,

                    frameLoop: 0,
                    frameTransition: undefined,

                    frame: 0
                };

                layers["" + 9] = {
                    frameSequence: [ Math.floor((minutes / 10) % 10) ],
                    
                    frameRepeat: 0,
                    frameRepeatSequence: 0,

                    frameLoop: 0,
                    frameTransition: undefined,

                    frame: 0
                };

                return layers;
            }
        }

        for(let index in this.visualization.animations.animation) {
            if(this.visualization.animations.animation[index].id != this.settings.animation)
                continue;

            const animationProperties = this.visualization.animations.animation[index];

            let animationLayers = this.visualization.animations.animation[index].animationLayer;

            if(animationLayers == undefined)
                return undefined;

            if(animationLayers.length == undefined)
                animationLayers = [ animationLayers ];

            const layers = {};
            let layerCount = 0;

            for(let index in animationLayers) {
                const layer = animationLayers[index].id;

                if(animationLayers[index].frameSequence == undefined)
                    continue;

                if(animationLayers[index].frameSequence.frame == undefined)
                    continue;

                layers[layer] = {
                    frameSequence: [],
                    
                    frameRepeat: (animationLayers[index].frameRepeat != undefined)?(parseInt(animationLayers[index].frameRepeat)):(0),
                    frameRepeatSequence: 0,

                    frameLoop: (animationLayers[index].loopCount != undefined)?(parseInt(animationLayers[index].loopCount)):(0),
                    frameTransition: (animationProperties.transitionTo != undefined)?(parseInt(animationProperties.transitionTo)):(undefined),

                    frame: 0
                };

                if(animationLayers[index].frameSequence.frame.length == undefined)
                    animationLayers[index].frameSequence.frame = [ animationLayers[index].frameSequence.frame ];

                for(let frame in animationLayers[index].frameSequence.frame)
                    layers[layer].frameSequence.push(animationLayers[index].frameSequence.frame[frame].id);

                layerCount++;
            }

            if(layerCount == 0)
                return undefined;

            return layers;
        }

        if(this.settings.animation >= 100) {
            this.settings.animation -= 100;

            this.animations = this.getVisualizationAnimation();

            return this.animations;
        }

        return undefined;
    };

    getVisualizationAnimationLayer(layer) {
        if(this.animations == undefined || this.animations[layer] == undefined)
            return 0;

        return this.animations[layer].frameSequence[this.animations[layer].frame];
    };

    getDimensions() {
        const result = { row: 0, column: 0, depth: 0 };

        const data = this.manifest.logic.objectData.model.dimensions;

        if(data.x != undefined) result.row = parseFloat(data.x);
        if(data.y != undefined) result.column = parseFloat(data.y);
        if(data.z != undefined) result.depth = parseFloat(data.z);

        if(this.settings.direction == 0 || this.settings.direction == 4) {
            const spare = result.row;
         
            result.row = result.column;
            result.column = spare;
        }

        return result;
    };

    getDirection(direction = this.settings.direction) {
        const directions = this.manifest.logic.objectData.model.directions;

        if(directions == undefined)
            return 0;

        if(directions.direction.length == undefined)
            directions.direction = [ directions.direction ];

        for(let index in directions.direction) {
            if(this.getDirectionAngle(directions.direction[index].id) != direction)
                continue;

            return direction;
        }

        return this.getDirectionAngle(directions.direction[0].id);
    };

    getNextDirection(direction = this.settings.direction) {
        const directions = this.manifest.logic.objectData.model.directions;

        if(directions == undefined)
            return direction;

        if(directions.direction.length == undefined)
            directions.direction = [ directions.direction ];

        for(let index in directions.direction) {
            if(this.getDirectionAngle(directions.direction[index].id) != direction)
                continue;

            if(directions.direction[parseInt(index) + 1] == undefined)
                return this.getDirectionAngle(directions.direction[0].id);

            return this.getDirectionAngle(directions.direction[parseInt(index) + 1].id);
        }

        return this.getDirectionAngle(directions.direction[0].id);
    };

    getDirectionAngle(angle) {
        return Math.floor(parseInt(angle) / 45);
    };

    async update(settings) {
        if(settings.id != undefined && settings.id == "HabboRoomCursor")
            settings.library = settings.id;

        for(let key in settings)
            this.settings[key] = settings[key];
    };

    getNextAnimation(animation = this.settings.animation) {
        const animations = this.visualization.animations;

        if(animations == undefined)
            return 0;

        if(animations.animation.length == undefined)
            animations.animation = [ animations.animation ];

        for(let index in animations.animation) {
            if(animations.animation[index].id != animation)
                continue;

            if(animations.animation[parseInt(index) + 1] == undefined)
                return parseInt(animations.animation[0].id);
                
            return parseInt(animations.animation[parseInt(index) + 1].id);
        }

        return parseInt(animations.animation[0].id);
    };

    updateAnimations(timestamp = performance.now()) {
        let updated = false;
        
        if(this.animations == undefined)
            return false;

        for(let index in this.animations) {
            if(!((timestamp - this.animationTimestamps[index]) > (1000 / 12)))
                continue;

            if(this.animations[index].frameRepeatSequence != this.animations[index].frameRepeat) {
                this.animations[index].frameRepeatSequence++;

                continue;
            }

            this.animations[index].frameRepeatSequence = 0;

            const previousFrame = this.animations[index].frame;

            this.animations[index].frame++;

            if(this.animations[index].frame >= this.animations[index].frameSequence.length) {
                this.animations[index].frame = 0;

                if(this.animations[index].frameTransition != undefined) {
                    this.setAnimation(this.animations[index].frameTransition);

                    return true;
                }
            }

            this.animationTimestamps[index] = timestamp;

            if(this.animations[index].frameSequence[previousFrame] != this.animations[index].frameSequence[this.animations[index].frame])
                updated = true;
        }

        return updated;
    };

    setAnimation(animation) {
        this.settings.animation = animation;

        if(this.types.logic == "furniture_score") {


        }

        this.animations = this.getVisualizationAnimation();

        this.animationTimestamps = {};

        for(let index in this.animations)
            this.animationTimestamps[index] = 0;

        this.render();
    };

    setDirection(direction) {
        this.settings.direction = this.getDirection(direction);
    };

    async process() {
        this.furniture = await Furnitures.get(this.settings.id);

        this.library = (this.settings.library != null)?(this.settings.library):("HabboFurnitures/" + this.furniture.line + "/" + this.furniture.id);

        this.manifest = await Assets.getManifest(this.library);
        
        this.visualization = this.getVisualization();

        this.types = this.manifest.index.object;
        
        if(this.settings.animation != undefined)
            this.setAnimation(this.settings.animation);

        this.settings.direction = this.getDirection();
    };
};
