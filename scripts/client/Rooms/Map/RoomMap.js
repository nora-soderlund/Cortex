Client.rooms.map = new function() {
    this.getIndex = function(data, id) {
        const array = Client.rooms.asset.room_visualization.visualizationData[data + "Data"][data + "s"][data];

        let index = 0;

        for(index in array) {
            if(array[index].id != id)
                continue;

            break;
        }

        return index;
    };

    this.getSizes = function(data, index) {
        const array = Client.rooms.asset.room_visualization.visualizationData[data + "Data"][data + "s"][data];

        return array[index].visualization;
    };

    this.getVisualization = function(data, size) {
        let index = 0;
        
        for(index in data) {
            if(data[index].size != size)
                continue;

            break;
        }

        return data[index].visualizationLayer;
    };

    this.getMaterial = function(data, material) {
        const materials = Client.rooms.asset.room_visualization.visualizationData[data + "Data"].materials.material;

        let index = 0;

        for(index in materials) {
            if(materials[index].id != material)
                continue;

            break;
        }

        return materials[index].materialCellMatrix.materialCellColumn;
    };

    this.getTexture = function(data, texture) {
        const textures = Client.rooms.asset.room_visualization.visualizationData[data + "Data"].textures.texture;

        let index = 0;

        for(index in textures) {
            if(textures[index].id != texture)
                continue;

            break;
        }

        return "HabboRoomContent_" + textures[index].bitmap.assetName;
    };

    this.getAsset = function(name) {
        const assets = Client.rooms.asset.room_assets.assets.asset;

        let index = 0;

        for(index in assets) {
            if(assets[index].name == name)
                break;
        }

        const asset = JSON.parse(JSON.stringify(assets[index]));

        if(asset.source != undefined) {
            const source = this.getAsset(asset.source);

            for(let key in source)
                if(asset[key] == undefined)
                    asset[key] = source[key];
        }

        return asset;
    };

    this.getMask = function(name) {
        const asset = this.getAsset(name);

        return { asset };
    };
};
