Client.furnitures = new function() {
    this.cache = {};

    this.get = async function(id) {
        if(this.cache[id] != undefined)
            return this.cache[id];

        this.cache[id] = await Client.socket.messages.sendCall({ OnFurnitureRequest: id }, "OnFurnitureRequest", function(result) {
            if(result.id != id)
                return 0;

            return 1;
        });

        return this.cache[id];
    };
};
