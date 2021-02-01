Client.furnitures.visualization = function(visualization) {
    this.data = visualization;
    
    this.type = visualization.type;
    
    this.getGraphicsSize = function(size) {
        for(let index in this.data.graphics.visualization) {
            if(this.data.graphics.visualization[index].size != size)
                continue;

            this.graphics = this.data.graphics.visualization[index];

            break;
        }

        this.size = size;

        this.layerCount = parseInt(this.graphics.layerCount);

        this.angle = parseInt(this.graphics.angle);

        this.layers = [ this.graphics.layers.layer ];

        this.directionLayers = this.graphics.directions.direction;

        /*for(let index in this.graphics.directions.direction) {
            const direction = parseInt(this.graphics.directions.direction[index].id);

            if(this.directionLayers[direction] == undefined)
                this.directionLayers[direction] = [];

            this.directionLayers[direction].push(this.graphics.directions.direction[index].layer);
        }*/
    };

    this.getGraphicsSize(64);
};
