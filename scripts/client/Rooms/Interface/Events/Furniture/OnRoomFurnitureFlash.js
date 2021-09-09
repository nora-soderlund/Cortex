SocketMessages.register("OnRoomFurnitureFlash", function(data) {
    const furnitures = [];

    for(let id in RoomInterface.furnitures) {
        const entity = RoomInterface.furnitures[id];

        if(entity.data.furniture != data.id)
            continue;
            
        furnitures.push(id);
    }

    function setAnimation(animation) {
        for(let index in furnitures)
            RoomInterface.furnitures[furnitures[index]].furniture.setAnimation(animation);
    };

    setAnimation(data.animation);

    setTimeout(function() {
        setAnimation(0);

        setTimeout(function() {
            setAnimation(data.animation);

            setTimeout(function() {
                setAnimation(0);
        
                setTimeout(function() {
                    setAnimation(data.animation);

                    setTimeout(function() {
                        setAnimation(0);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 500);
});
