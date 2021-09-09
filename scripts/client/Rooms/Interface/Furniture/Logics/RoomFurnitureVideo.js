Client.rooms.interface.furniture.logics.furniture_video = new function() {
    const entity = new Dialog({
        title: "Room Furniture Video",
        
        size: {
            width: 800,
            height: 256
        },

        offset: {
            type: "center"
        },

        resizable: true
    });

    entity.events.create.push(function() {
        entity.$content.addClass("room-interface-furniture-video");

        entity.$frame = $('<iframe frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>').appendTo(entity.$content);
    
        entity.$controls = $('<div class="room-interface-furniture-controls"></div>').appendTo(entity.$content);
        

        const $input = $(
            '<div class="room-interface-furniture-input">' +
                '<p class="room-interface-furniture-input-text">https://www.youtube.com/watch?v=</p>' +
            '</div>'
        ).appendTo(entity.$controls);
        
        const $link = $('<input type="text" placeholder="dQw4w9WgXcQ">').appendTo($input);

        $('<div class="sprite-plus"></div>').appendTo($input).on("click", async function() {
            const value = $link.val();

            if(value.length == 0)
                return;

            entity.pause();

            const result = await SocketMessages.sendCall({
                OnRoomFurnitureUse: {
                    id: entity.data.id,

                    video: value,

                    action: "add"
                }
            }, "OnRoomFurnitureUse");

            entity.unpause();

            $link.val("");

            if(result)
                SocketMessages.send({ OnRoomFurnitureUse: { id: entity.data.id } });
        });

        entity.$videos = $('<div class="room-interface-furniture-videos"></div>').appendTo(entity.$controls);

        entity.$buttons = $('<div class="room-interface-furniture-buttons"></div>').appendTo(entity.$controls);

        $('<div class="room-interface-furniture-player"><i class="sprite-player-previous"></i></div>').appendTo(entity.$buttons).on("click", async function() {
            entity.pause();

            await SocketMessages.sendCall({
                OnRoomFurnitureUse: {
                    id: entity.data.id,

                    action: "previous"
                }
            }, "OnRoomFurnitureUse");

            entity.unpause();
        });

        $('<div class="room-interface-furniture-player"><i class="sprite-player-stop"></i></div>').appendTo(entity.$buttons).on("click", async function() {
            entity.pause();

            await SocketMessages.sendCall({
                OnRoomFurnitureUse: {
                    id: entity.data.id,

                    action: "stop"
                }
            }, "OnRoomFurnitureUse");

            entity.unpause();
        });

        $('<div class="room-interface-furniture-player"><i class="sprite-player-pause"></i></div>').appendTo(entity.$buttons).on("click", async function() {
            entity.pause();

            await SocketMessages.sendCall({
                OnRoomFurnitureUse: {
                    id: entity.data.id,

                    action: "pause"
                }
            }, "OnRoomFurnitureUse");

            entity.unpause();
        });

        $('<div class="room-interface-furniture-player"><i class="sprite-player-next"></i></div>').appendTo(entity.$buttons).on("click", async function() {
            entity.pause();

            await SocketMessages.sendCall({
                OnRoomFurnitureUse: {
                    id: entity.data.id,

                    action: "next"
                }
            }, "OnRoomFurnitureUse");

            entity.unpause();
        });
    });

    entity.events.show.push(function() {
        entity.$videos.html("");

        const furniture = Client.rooms.interface.furnitures[entity.data.id];

        Furnitures.get(furniture.data.furniture).then(function(info) {
            //entity.setTitle(info.title);
        });

        for(let index in entity.data.videos) {
            const minutes = Math.floor(entity.data.videos[index].length / 60);
            const seconds = entity.data.videos[index].length - (minutes * 60);

            const $video = $(
                '<div class="room-interface-furniture-video-item">' +
                    '<div class="room-interface-furniture-video-item-title"><b>' + entity.data.videos[index].title + '</b></div>' +
                    '<p class="room-interface-furniture-video-item-user">By ' + entity.data.videos[index].author + '</p>' +

                    '<div class="room-interface-furniture-video-item-length">' + minutes + ':' + ((seconds < 10)?("0" + seconds):(seconds)) + '</div>' +
                '</div>'
            ).appendTo(entity.$videos);

            const $reference = $('<div class="sprite-reference"></div>').appendTo($video.find(".room-interface-furniture-video-item-title"));

            $reference.on("click", function() {
                window.open("https://www.youtube.com/watch?v=" + entity.data.videos[index].id);
            });

            $video.on("click", function(e) {
                if(!$(e.target).hasClass("room-interface-furniture-video-item"))
                    return;

                $video.parent().find(".room-interface-furniture-video-item.active").removeClass("active");

                $video.addClass("active");

                entity.$frame[0].src = "https://www.youtube.com/embed/" + entity.data.videos[index].id;
            });

            const $cross = $('<div class="sprite-cross"></div>').appendTo($video);

            $cross.on("click", async function() {
                entity.pause();

                await SocketMessages.sendCall({
                    OnRoomFurnitureUse: {
                        id: entity.data.id,

                        video: entity.data.videos[index].id,

                        action: "remove"
                    }
                }, "OnRoomFurnitureUse");

                entity.$frame[0].src = "";

                $video.remove();

                entity.unpause();
            });
        }

        entity.$videos.find(".room-interface-furniture-video-item").first().click();
    });

    return entity;
};

SocketMessages.register("OnRoomFurnitureVideoUse", function(data) {
    Client.rooms.interface.furniture.logics.furniture_video.data = data;

    Client.rooms.interface.furniture.logics.furniture_video.show();
});
