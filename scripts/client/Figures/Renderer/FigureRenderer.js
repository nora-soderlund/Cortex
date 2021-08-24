class FigureRenderer {
    constructor(figure, settings, $canvas, color = undefined) {
        const entity = new FigureEntity(figure, settings);
    
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
};
