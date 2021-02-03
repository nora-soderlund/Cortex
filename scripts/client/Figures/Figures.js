Client.figures = new function() {
    this.logging = {
        missingSprite: false
    };

    this.getLibrary = async function(id, type) {
        const map = await Client.assets.get("HabboFigureMap");

        const libraries = map.manifest.map.lib;

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
        const figures = await Client.assets.get("HabboFigures");

        const sets = figures.manifest.figuredata.sets.settype;

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
        const assets = asset.manifest.manifest.manifest.library.assets.asset;

        let index = 0;

        for(index in assets) {
            if(assets[index].name != sprite)
                continue;

            break;
        }

        return assets[index].param.value;
    }

    this.getPalette = async function(palette) {
        const figures = await Client.assets.get("HabboFigures");

        const palettes = figures.manifest.figuredata.colors.palette;

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
        const actions = await Client.assets.get("HabboFigureActions");

        let index = 0;

        for(index in actions.manifest.actions.action) {
            if(actions.manifest.actions.action[index].id != id)
                continue;

            break;
        }

        return actions.manifest.actions.action[index];
    };
};
