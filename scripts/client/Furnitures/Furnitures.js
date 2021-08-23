Client.furnitures = new function() {
    this.cache = {
        HabboRoomCursor: {}
    };

    this.layers = {};

    this.promises = {};

    this.get = async function(id) {
        if(this.cache[id] != undefined)
            return this.cache[id];
            
        if(this.promises[id] != undefined) {
            return new Promise(function(resolve) {
                Client.furnitures.promises[id].push(function(data) {
                    resolve(data);
                });
            });
        }

        this.promises[id] = [];

        this.cache[id] = await SocketMessages.sendCall({ OnFurnitureRequest: id }, "OnFurnitureRequest", function(result) {
            if(result.id != id)
                return 0;

            return 1;
        });

        for(let index in this.promises[id])
            this.promises[id][index](this.cache[id]);

        return this.cache[id];
    };

    this.getComposite = function(ink) {
        switch(ink) {
            case "ADD": return "lighter";

            case "SUBTRACT": return "luminosity";

            case "COPY": return "source-over";

            case undefined: return "source-over";

            default: return ink;
        }
    }
};
