Client.furnitures.icon = async function(id) {
    const furniture = await Client.furnitures.get(id);

    const library = "HabboFurnitures/" + furniture.line + "/" + furniture.id;

    const assets = await Client.assets.get(library);

    const visualization = new Client.furnitures.visualization(assets.manifest.visualization.visualizationData, 1);

    const assetsData = new Client.furnitures.assets(assets.manifest.assets.assets.asset);

    const layers = [];

    const data = { maxWidth: 0, maxHeight: 0, maxLeft: 0, maxTop: 0 };

    for(let index = 0; index < visualization.layerCount; index++) {
        const layer = Client.utils.charCode(parseInt(index));

        const name = furniture.id + "_icon_" + layer;

        const sprite = assetsData.getAsset(name);

        if(sprite == undefined)
            continue;
        
        const layerData = {
            image: await Client.assets.getSprite(library, name),
            left: parseInt(sprite.x),
            top: parseInt(sprite.y)
        };

        layers.push(layerData);

        if((layerData.left + layerData.image.width) > data.maxWidth)
            data.maxWidth = (layerData.left + layerData.image.width);

        if((layerData.top + layerData.image.height) > data.maxHeight)
            data.maxHeight = (layerData.top + layerData.image.height);

        if(layerData.top > data.maxTop)
            data.maxTop = layerData.top;
            
        if(layerData.left > data.maxLeft)
            data.maxLeft = layerData.left;
    }

    const $canvas = $('<canvas width="' + (data.maxWidth - data.maxLeft) + '" height="' + (data.maxHeight - data.maxTop) + '"></div>');

    const context = $canvas[0].getContext("2d");

    for(let index in layers)
        context.drawImage(layers[index].image, data.maxLeft + -layers[index].left, data.maxTop + -layers[index].top);

    return $canvas[0];
};
