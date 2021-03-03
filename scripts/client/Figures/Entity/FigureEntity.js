Client.figures.entity = function(figure) {
    this.events = new function() {
        this.render = [];
    };

    this.data = {};

    this.set = function(figure) {
        this.parts = {};

        // hr-100.hd-180-1.ch-210-66.lg-270-82.sh-290-91

        figure = figure.split('.');

        // hr-100   hd-180-1    ch-210-66  lg-270-82    sh-290-91

        for(let index = 0; index < figure.length; index++) {
            const parts = figure[index].split('-');

            // hd 180 1

            const part = parts[0];

            this.parts[part] = {};

            parts.shift();
            
            if(parts.length == 0)
                continue;

            this.parts[part].id = parseInt(parts[0]);

            parts.shift();
            
            if(parts.length == 0)
                continue;

            this.parts[part].color = parseInt(parts[0]);
        }
    };

    this.$canvas = $('<canvas width="256" height="256"></canvas>').appendTo(Client.development.$element);

    this.direction = 2;

    this.actions = [];

    this.setActions = async function(actions) {
        this.actions.length = 0;

        for(let key in actions)
            await this.addAction(actions[key]);
    }

    this.frames = {};

    this.addAction = async function(id) {
        if(this.actions.findIndex(x => x.id == id) != -1)
            return;

        const action = await Client.figures.getAction(id);

        this.actions.push(action);

        this.actions.sort(function(a, b) {
            return parseInt(a.precedence) - parseInt(b.precedence);
        });
    };

    this.hasAction = function(id) {
        if(this.actions.findIndex(x => x.id == id) != -1)
            return true;

        return false;
    }

    this.removeAction = function(id) {
        const index = this.actions.findIndex(x => x.id == id);

        if(index == -1)
            return;

        this.actions.splice(index, 1);
    }

    this.render = async function() {
        //let timestamp = performance.now();

        //const $canvas = $('<canvas width="256" height="256"></canvas>');

        const context = this.$canvas[0].getContext("2d");

        context.save();

        //context.canvas.width = context.canvas.width;

        const map = await Client.assets.getManifest("HabboFigureMap");

        const layers = {};

        await this.addAction("Default");
        //await this.addAction("GestureSmile");

        let direction = (this.direction > 3 && this.direction < 7)?(6 - this.direction):(this.direction);

        let priorities = map.priorities["std"][direction];

        if(map.priorities[this.stance] != undefined) {
            if(map.priorities[this.stance][direction] != undefined) {
                priorities = map.priorities[this.stance][direction];
            }
        }

        for(let type in priorities)
            layers[priorities[type]] = [];

        const shadow = await this.getSprite("hh_human_body", "sd", 1, 0, 0);

        if(shadow != null) {
            shadow.alpha = .25;

            layers["bd"].push(shadow);
        }

        for(let set in this.parts) {
            const setType = await Client.figures.getSetType(set);

            const setData = await Client.figures.getSetData(setType, this.parts[set].id);

            let palette = undefined, color = undefined;

            if(this.parts[set].color != undefined) {
                palette = await Client.figures.getPalette(setType.paletteid);

                color = Client.figures.getPaletteColor(palette, this.parts[set].color)["#text"];
            }

            if(setData.part.length == undefined)
                setData.part = [ setData.part ];

            for(let index in setData.part) {
                const id = parseInt(setData.part[index].id);

                const type = setData.part[index].type;

                if(layers[type] == undefined) {
                    console.warn("[FigureEntity]%c Unable to locate type " + type + " in current priority list!", "color: lightblue");

                    continue;
                }

                const library = await Client.figures.getLibrary(id, type);

                const sprite = await this.getSprite(library, type, id, direction, color);

                if(sprite == null)
                    continue;

                layers[type].push(sprite);
            }
        }

        let offset = map.offsets["std"], offsetName = "std";

        if(map.offsets[this.stance] != undefined) {
            offsetName = this.stance;

            if(map.offsets[this.stance].link != undefined)
                offset = map.offsets[map.offsets[this.stance].link];
            else
                offset = map.offsets[this.stance];
        }

        context.clearRect(0, 0, 256, 256);
        
        if(this.direction > 3 && this.direction < 7) {
            context.translate(context.canvas.width, 0);

            context.scale(-1, 1);
        }

        for(let type in layers) {
            for(let index in layers[type]) {
                context.globalAlpha = (layers[type][index].alpha == undefined)?(1.0):(layers[type][index].alpha);

                context.drawImage(layers[type][index].image, 128 + offset.left + layers[type][index].left, 128 + offset.top + layers[type][index].top);
            }
        }
        
        if(this.data[offsetName] == undefined)
            this.data[offsetName] = {};

        if(this.data[offsetName][this.direction] == undefined)
            this.data[offsetName][this.direction] = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

        const sprites = [];

        sprites.push({
            image: context.canvas, imageData: this.data[offsetName][this.direction],
            left: 0, top: 0,
            index: 0
        });

        context.restore();

        //Client.utils.warn("FigureEntity", "Render process took ~" + (Math.round((performance.now() - timestamp) * 100) / 100) + "ms to execute...");

        //timestamp = performance.now();
        
        for(let event in this.events.render)
            this.events.render[event](sprites);

        //Client.utils.warn("FigureEntity", "After math render processes took ~" + (Math.round((performance.now() - timestamp) * 100) / 100) + "ms to execute!");
    };

    this.getSprite = async function(library, type, id, direction, color) {
        const manifest = await Client.assets.getManifest("HabboFigures/" + library);

        let frame = 0;

        let sprite;

        for(let index in this.actions) {
            sprite = "h_" + this.actions[index].assetpartdefinition + "_" + type + "_" + id + "_" + direction +  "_" + frame;

            if(manifest.sprites[library + "_" + sprite] == undefined)
                continue;

            if(this.frames[this.actions[index].id] != undefined) {
                frame = this.frames[this.actions[index].id];
                
                sprite = "h_" + this.actions[index].assetpartdefinition + "_" + type + "_" + id + "_" + direction +  "_" + frame;

                if(manifest.sprites[library + "_" + sprite] == undefined) {
                    frame = 0;

                    sprite = "h_" + this.actions[index].assetpartdefinition + "_" + type + "_" + id + "_" + direction +  "_" + frame;
                }
            }

            break;
        }

        if(manifest.sprites[library + "_" + sprite] == undefined) {
            if(Client.figures.logging.missingSprite)
                console.warn("[FigureEntity]%c Unable to locate sprite " + sprite + " in library " + library + "!", "color: lightblue");

            return null;
        }

        let image = await Client.assets.getSprite("HabboFigures/" + library, library + "_" + sprite);

        if(color != undefined && type != "ey")
            image = await Client.assets.getSpriteColor("HabboFigures/" + library, library + "_" + sprite, "#" + color);

        const imageData = await Client.assets.getSpriteData("HabboFigures/" + library, library + "_" + sprite);

        const spriteData = Client.figures.getSprite(manifest, sprite).split(',');

        return {
            image, imageData,
            left: (parseInt(spriteData[0]) * -1),
            top: (parseInt(spriteData[1]) * -1)
        };
    };

    this.set(figure);
};
