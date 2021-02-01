Client.rooms.floormap.floor = new function() {
    this.getFloorData = function() {
        return Client.rooms.asset.manifest.room_visualization.visualizationData.floorData;
    };

    this.getFloorSizes = function(index) {
        const array = this.getFloorData().floors.floor;

        return array[index].visualization;
    };
    
    this.getFloorIndex = function(floor) {
        const array = this.getFloorData().floors.floor;

        let index = 0;

        for(index in array) {
            if(array[index].id != floor)
                continue;

            break;
        }

        return index;
    };

    this.getFloorVisualization = function(floor, size) {
        let index = 0;
        
        for(index in floor) {
            if(floor[index].size != size)
                continue;

            break;
        }

        return floor[index].visualizationLayer;
    };

    this.getFloorMaterial = function(material) {
        const materials = this.getFloorData().materials.material;

        let index = 0;

        for(index in materials) {
            if(materials[index].id != material)
                continue;

            break;
        }

        return materials[index].materialCellMatrix.materialCellColumn;
    };

    this.getFloorTexture = function(texture) {
        const textures = this.getFloorData().textures.texture;

        let index = 0;

        for(index in textures) {
            if(textures[index].id != texture)
                continue;

            break;
        }

        return textures[index].bitmap.assetName;
    };
};
