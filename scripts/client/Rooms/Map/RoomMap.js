Client.rooms.map = function(settings = {}) {
    this.map = "";
    
    this.floorThickness = 8;
    this.floorMaterial  = "default";

    for(let key in settings)
        this[key] = settings[key];

    this.$canvas = $('<canvas></canvas>');

    this.floor = new Client.rooms.map.floor({
        map: this.map,
        thickness: this.floorThickness
    });

    this.render = async function() {
        const $canvas = $('<canvas></canvas>');
        let context = $canvas[0].getContext("2d");
        
        await this.floor.renderAsync(context, {
            map: this.map,
            thickness: this.floorThickness,
            material: this.floorMaterial
        });

        context = this.$canvas[0].getContext("2d");
        context.canvas.width = $canvas[0].width;
        context.canvas.height = $canvas[0].height;

        context.filter = "blur(5px) brightness(0%) opacity(50%)";
        context.drawImage($canvas[0], 0, 5);

        context.filter = "blur(0) brightness(100%) opacity(100%)";
        context.drawImage($canvas[0], 0, 0);
    };
};
