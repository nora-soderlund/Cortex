Client.rooms.categories = new function() {
    this.get = async function() {
        if(this.categories != undefined)
            return this.categories;

        this.categories = await Client.socket.messages.sendCall({ OnRoomCategoriesUpdate: null }, "OnRoomCategoriesUpdate");

        return this.categories;
    };
};
