Client.figures = new function() {
    this.logging = {
        missingSprite: false
    };

    this.parts = {
        "cc": "ch",
        "lc": "ls",
        "rc": "rs"
    };

    this.getPartName = function(part) {

        // "bd","sh","lg","ch","wa","ca","hd","fc","ey","hr","hrb","fa","ea","ha","he"

        switch(part) {
            case "li":
            case "lh":
            case "ls":
                return "LeftArm";

            case "ri":
            case "rh":
            case "rs":
                return "RightArm";

            case "bd":
            case "lg":
                return "Torso";
        }

        return "Body";
    };

    this.actionFrames = {
        "Move": 4,
        "Talk": 2,

        "Wave": 1
    };

    this.getLibrary = async function(id, type) {
        const libraries = this.map.map.lib;

        let index = 0;

        for(index in libraries) {
            if(libraries[index].part.length == undefined)
                libraries[index].part = [ libraries[index].part ];

            for(let part in libraries[index].part) {
                if(libraries[index].part[part].id == id && 
                    (libraries[index].part[part].type[0] == type[0]) &&
                    (libraries[index].part[part].type[1] == type[1])) {

                    return libraries[index].id;
                }
            }
        }

        return libraries[index].id;
    };

    this.getSetType = async function(type) {
        const sets = this.data.figuredata.sets.settype;

        let index = 0;

        for(index in sets) {
            if(sets[index].type != type)
                continue;

            break;
        }

        return sets[index];
    };

    this.getSetData = async function(set, id) {
        let index = 0;

        for(index in set.set) {
            if(set.set[index].id != id)
                continue;

            break;
        }

        return set.set[index];
    };

    this.getSprite = function(asset, sprite) {
        const assets = asset.manifest.manifest.library.assets.asset;

        let index = 0;

        for(index in assets) {
            if(assets[index].name != sprite)
                continue;

            break;
        }

        return assets[index].param.value;
    }

    this.getPalette = async function(palette) {
        const palettes = this.data.figuredata.colors.palette;

        let index = 0;

        for(index in palettes) {
            if(palettes[index].id != palette)
                continue;

            break;
        }

        return palettes[index].color;
    };

    this.getPaletteColor = function(palette, id) {
        let index = 0;

        for(index in palette) {
            if(palette[index].id != id)
                continue;

            break;
        }

        return palette[index];
    };

    this.getAction = async function(id) {
        let index = 0;

        for(index in this.actions.actions.action) {
            if(this.actions.actions.action[index].id != id)
                continue;

            break;
        }

        return this.actions.actions.action[index];
    };

    this.getEffect = function(id) {
        for(let index in this.effects.map.effect) {
            if(this.effects.map.effect[index].id != id)
                continue;

            return this.effects.map.effect[index];
        }

        return null;
    };

    this.getEffectAsset = function(manifest, sprite) {
        let result = null;

        const assets = manifest.manifest.manifest.library.assets.asset;

        for(let index in assets) {
            if(assets[index].name != sprite)
                continue;

            const offsets = assets[index].param.value.split(',');

            result = {
                offset: {
                    left: parseInt(offsets[0]),
                    top: parseInt(offsets[1])
                }
            };

            break;
        }

        /*if(manifest.manifest.manifest.library.aliases != null) {
            const aliases = manifest.manifest.manifest.library.aliases.alias;

            for(let index in aliases) {
                if(aliases[index].name != sprite)
                    continue;

                const alias = this.getEffectAsset(manifest, aliases[index].link);

                for(let key in alias) {
                    if(result[key] == undefined)
                        result[key] = alias;
                }

                break;
            }
        }*/
        
        return result;
    };

    this.getEffectComposite = function(ink) {
        switch(ink) {
            case "33": return "lighter";
        }

        return "source-over";
    };

    this.getEffectIndex = function(align) {
        switch(align) {
            case "bottom": return -1;
            case "top": return 1;
        }

        return 0;
    };
};

Client.loader.addAsset(async function() {
    Client.figures.data = await Client.assets.getManifest("HabboFigureData");
    Client.figures.map = await Client.assets.getManifest("HabboFigureMap");
    Client.figures.actions = await Client.assets.getManifest("HabboFigureActions");
    Client.figures.effects = await Client.assets.getManifest("HabboFigureEffects");
});
