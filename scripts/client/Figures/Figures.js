class Figures {
    static logging = {
        missingSprite: false
    };

    static parts = {
        "cc": "ch",
        "lc": "ls",
        "rc": "rs"
    };

    static getPartName(part) {

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

    static actionFrames = {
        "Move": 4,
        "Talk": 2,

        "Wave": 1
    };

    static async getLibrary(id, type) {
        const libraries = Figures.map.map.lib;

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

    static async getSetType(type) {
        const sets = Figures.data.figuredata.sets.settype;

        let index = 0;

        for(index in sets) {
            if(sets[index].type != type)
                continue;

            break;
        }

        return sets[index];
    };

    static async getSetData(set, id) {
        let index = 0;

        for(index in set.set) {
            if(set.set[index].id != id)
                continue;

            break;
        }

        return set.set[index];
    };

    static getSprite(asset, sprite) {
        const assets = asset.manifest.manifest.library.assets.asset;

        let index = 0;

        for(index in assets) {
            if(assets[index].name != sprite)
                continue;

            break;
        }

        return assets[index].param.value;
    }

    static async getPalette(palette) {
        const palettes = Figures.data.figuredata.colors.palette;

        let index = 0;

        for(index in palettes) {
            if(palettes[index].id != palette)
                continue;

            break;
        }

        return palettes[index].color;
    };

    static getPaletteColor(palette, id) {
        let index = 0;

        for(index in palette) {
            if(palette[index].id != id)
                continue;

            break;
        }

        return palette[index];
    };

    static async getAction(id) {
        let index = 0;

        for(index in Figures.actions.actions.action) {
            if(Figures.actions.actions.action[index].id != id)
                continue;

            break;
        }

        return Figures.actions.actions.action[index];
    };

    static getEffect(id) {
        for(let index in Figures.effects.map.effect) {
            if(Figures.effects.map.effect[index].id != id)
                continue;

            return Figures.effects.map.effect[index];
        }

        return null;
    };

    static getEffectAsset(manifest, sprite) {
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

                const alias = Figures.getEffectAsset(manifest, aliases[index].link);

                for(let key in alias) {
                    if(result[key] == undefined)
                        result[key] = alias;
                }

                break;
            }
        }*/
        
        return result;
    };

    static getEffectComposite(ink) {
        switch(ink) {
            case "33": return "lighter";
        }

        return "source-over";
    };

    static getEffectIndex(align) {
        switch(align) {
            case "behind": return -100;
            case "bottom": return -100;
            case "top": return 100;
        }

        return 0;
    };
};

Client.loader.addAsset(async function() {
    Figures.data = await Assets.getManifest("HabboFigureData");
    Figures.map = await Assets.getManifest("HabboFigureMap");
    Figures.actions = await Assets.getManifest("HabboFigureActions");
    Figures.effects = await Assets.getManifest("HabboFigureEffects");
});
