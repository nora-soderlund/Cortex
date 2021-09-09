class Furnitures {
    static cache = {
        HabboRoomCursor: {}
    };

    static layers = {};

    static promises = {};

    static async get(id) {
        if(Furnitures.cache[id] != undefined)
            return Furnitures.cache[id];
            
        if(Furnitures.promises[id] != undefined) {
            return new Promise(function(resolve) {
                Furnitures.promises[id].push(function(data) {
                    resolve(data);
                });
            });
        }

        Furnitures.promises[id] = [];

        Furnitures.cache[id] = await SocketMessages.sendCall({ OnFurnitureRequest: id }, "OnFurnitureRequest", function(result) {
            if(result.id != id)
                return 0;

            return 1;
        });

        for(let index in Furnitures.promises[id])
            Furnitures.promises[id][index](Furnitures.cache[id]);

        return Furnitures.cache[id];
    };

    getComposite(ink) {
        switch(ink) {
            case "ADD": return "lighter";

            case "SUBTRACT": return "luminosity";

            case "COPY": return "source-over";

            case undefined: return "source-over";

            default: return ink;
        }
    };
};
