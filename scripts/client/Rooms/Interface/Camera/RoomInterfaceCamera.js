RoomInterface.camera = new function() {
    const entity = new CameraDialog({
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
