Client.furnitures.visualization = function(visualization, size = 64) {
    this.data = visualization;

    this.graphics = (this.data.graphics == undefined)?(this.data):(this.data.graphics);
    
    this.type = visualization.type;

    this.layers = [];
    
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
            this.layers = [ this.graphics.layers.layer ];

        this.directionLayers = (this.graphics.directions)?(this.graphics.directions.direction):(0);

        /*for(let index in this.graphics.directions.direction) {
            const direction = parseInt(this.graphics.directions.direction[index].id);

            if(this.directionLayers[direction] == undefined)
                this.directionLayers[direction] = [];

            this.directionLayers[direction].push(this.graphics.directions.direction[index].layer);
        }*/
    };

    this.getGraphicsSize(size);
};
