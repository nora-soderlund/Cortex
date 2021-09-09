const RoomCategories = new class {
    async get() {
        if(this.categories != undefined)
            return this.categories;

        this.categories = await SocketMessages.sendCall({ OnRoomCategoriesUpdate: null }, "OnRoomCategoriesUpdate");

        return this.categories;
    };
};
