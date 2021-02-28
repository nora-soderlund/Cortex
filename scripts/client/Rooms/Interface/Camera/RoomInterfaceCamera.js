Client.rooms.interface.camera = new function() {
    const entity = new Client.dialogs.camera({
        title: "Room Camera",
        
        size: {
            width: 340,
            height: 462
        },

        offset: {
            type: "center"
        }
    });

    return entity;
};
