Client.furnitures.assets = function(assets) {
    this.data = assets;
    
    this.getAsset = function(asset) {
        for(let index in this.data) {
            if(this.data[index].name != asset)
                continue;

            return this.getAssetData(JSON.parse(JSON.stringify(this.data[index])));
        }

        return undefined;
    };

    this.getAssetData = function(asset) {
        if(asset.source != undefined && asset.source != asset.name) {
            const sourceAsset = this.getAsset(asset.source);

            for(let key in sourceAsset) {
                if(asset[key] == undefined || key == "name")
                    asset[key] = sourceAsset[key];
            }
        }

        return JSON.parse(JSON.stringify(asset));
    };

    return this;
};
