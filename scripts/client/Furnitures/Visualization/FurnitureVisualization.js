Client.furnitures.visualization = function(visualization, size = 64) {
    this.data = visualization;

    this.graphics = (this.data.graphics == undefined)?(this.data):(this.data.graphics);
    
    this.type = visualization.type;

    this.layers = [];

    this.directionLayers = {};
    
    this.getGraphicsSize = function(size) {
        for(let index in this.graphics.visualization) {
            if(this.graphics.visualization[index].size != size)
                continue;

            this.graphics = this.graphics.visualization[index];

            break;
        }

        this.size = size;

        this.layerCount = parseInt(this.graphics.layerCount);

        this.angle = parseInt(this.graphics.angle);

        if(this.graphics.layers != null)
            this.layers = (this.graphics.layers.layer.id != undefined)?([ this.graphics.layers.layer ]):(this.graphics.layers.layer);

        if(this.graphics.directions != undefined) {
            const directions = this.graphics.directions.direction;

            for(let index in directions) {
                if(directions[index].layer == undefined)
                    continue;

                this.directionLayers[directions[index].id] = (directions[index].layer.length == undefined)?([ directions[index].layer ]):(directions[index].layer);
            }
        }
    };

    this.getGraphicsSize(size);
};
