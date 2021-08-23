Client.furnitures.renderer = function(settings, $canvas, color = undefined) {
    this.renderer = async function() {
        const loading = await Assets.getSpritesheet((settings.size == 1)?("HabboLoadingIcon"):("HabboLoading")).then(function(image) {
            const context = $canvas[0].getContext("2d");
    
            context.canvas.width = image.width;
            context.canvas.height = image.height;
    
            context.drawImage(image, 0, 0);
        });

        const entity = new Client.furnitures.entity(settings);
    
        entity.events.render.push(function(sprites) {
            const context = $canvas[0].getContext("2d");

            let minLeft = 0, minTop = 0, maxWidth = 0, maxHeight = 0;

            for(let index in sprites) {
                if(minLeft > (sprites[index].asset.x * -1))
                    minLeft = (sprites[index].asset.x * -1);
                    
                if(minTop > (sprites[index].asset.y * -1))
                    minTop = (sprites[index].asset.y * -1);

                if(((sprites[index].asset.x * -1) + sprites[index].sprite.width) > maxWidth)
                    maxWidth = (sprites[index].asset.x * -1) + sprites[index].sprite.width;

                if(((sprites[index].asset.y * -1) + sprites[index].sprite.height) > maxHeight)
                    maxHeight = (sprites[index].asset.y * -1) + sprites[index].sprite.height;
            }
    
            context.canvas.width = ((minLeft * -1) + maxWidth);
            context.canvas.height = ((minTop * -1) + maxHeight);

            if(color != undefined) {
                context.fillStyle = color;
             
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            }
    
            for(let index in sprites) {
                context.globalCompositeOperation = sprites[index].ink;
    
                context.drawImage(sprites[index].sprite, (minLeft * -1) - sprites[index].asset.x, (minTop * -1) - sprites[index].asset.y);
            }
        });
    
        entity.process().then(async function() {
            await entity.render();

            if(entity.types.visualization == "furniture_animated") {
                setInterval(function() {
                    const timestamp = performance.now();
    
                    if(!entity.updateAnimations(timestamp))
                        return;
    
                    entity.render();
                }, 1000 / 12);

                $canvas.on("click", function() {
                    entity.setAnimation(entity.getNextAnimation());
                });
            }
        });
    };

    this.renderer();
};
