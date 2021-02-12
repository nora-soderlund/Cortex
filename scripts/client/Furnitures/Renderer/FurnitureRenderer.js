Client.furnitures.renderer = async function(id, settings, $canvas) {
    const loading = await Client.assets.getSpritesheet("HabboLoading").then(function(image) {
        const context = $canvas[0].getContext("2d");

        context.canvas.width = image.width;
        context.canvas.height = image.height;

        context.drawImage(image, 0, 0);
    });

    const furniture = await Client.furnitures.get(id);

    const entity = new Client.furnitures.entity("HabboFurnitures/" + furniture.line + "/" + furniture.id, settings);

    entity.events.render.push(function(sprites, data) {
        const context = $canvas[0].getContext("2d");

        context.canvas.width = ((data.minLeft * -1) + data.maxWidth);
        context.canvas.height = ((data.minTop * -1) + data.maxHeight);

        for(let index in sprites) {
            context.globalCompositeOperation = sprites[index].composite;

            context.drawImage(sprites[index].image, (data.minLeft * -1) + sprites[index].left, (data.minTop * -1) + sprites[index].top);
        }
    });

    entity.render();
};
