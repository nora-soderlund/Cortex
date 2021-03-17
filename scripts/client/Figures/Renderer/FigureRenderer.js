Client.figures.renderer = function(figure, settings, $canvas, color = undefined) {
    this.renderer = async function() {
        const entity = new Client.figures.entity(figure, settings);
    
        entity.events.render.push(function(sprites) {
            const context = $canvas[0].getContext("2d");

            if(color != undefined) {
                context.fillStyle = color;
             
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            }
    
            for(let index in sprites) {
                context.globalCompositeOperation = sprites[index].composite;
    
                context.drawImage(sprites[index].image, sprites[index].left, sprites[index].top);
            }
        });
    
        entity.process().then(function() {
            entity.render();
        });
    };

    this.renderer();
};