RoomInterface.furniture.logics.furniture_video = new function() {
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
        entity.content.classList.add("room-interface-furniture-video");

        entity.frame = document.createElement("iframe");
        entity.frame.outerHTML = `
            <iframe frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
        entity.content.append(entity.frame);
    
        entity.controls = document.createElement("div");
        entity.controls.className = "room-interface-furniture-controls";
        entity.content.append(entity.controls);        

        const input = document.createElement("div");
        input.className = "room-interface-furniture-input";
        input.innerHTML = `
            <p class="room-interface-furniture-input-text">https://www.youtube.com/watch?v=</p>

            <input type="text" placeholder="dQw4w9WgXcQ">
        `;
        entity.controls.append(input);
        
        const link = input.querySelector("input");

        const plus = document.createElement("div");
        plus.className = "sprite-plus";
        plus.addEventListener("click", async () => {
            const value = link.value;

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

            link.value = "";

            if(result)
                SocketMessages.send({ OnRoomFurnitureUse: { id: entity.data.id } });
        });
        input.appendChild(plus);

        entity.videos = document.createElement("div");
        entity.videos.className = "room-interface-furniture-videos";
        entity.controls.append(entity.videos);

        entity.buttons = document.createElement("div");
        entity.buttons.className = "room-interface-furniture-buttons";
        entity.controls.append(entity.buttons);

        const previous = document.createElement("div");
        previous.className = "room-interface-furniture-player";
        previous.innerHTML = `<i class="sprite-player-previous"></i>`;
        previous.appendChild("click", async () => {
            entity.pause();

            await SocketMessages.sendCall({
                OnRoomFurnitureUse: {
                    id: entity.data.id,

                    action: "previous"
                }
            }, "OnRoomFurnitureUse");

            entity.unpause();
        });
        entity.buttons.append(previous);

        const stop = document.createElement("div");
        stop.className = "room-interface-furniture-player";
        stop.innerHTML = `<i class="sprite-player-stop"></i>`;
        stop.appendChild("click", async () => {
            entity.pause();

            await SocketMessages.sendCall({
                OnRoomFurnitureUse: {
                    id: entity.data.id,

                    action: "stop"
                }
            }, "OnRoomFurnitureUse");

            entity.unpause();
        });
        entity.buttons.append(stop);

        const pause = document.createElement("div");
        pause.className = "room-interface-furniture-player";
        pause.innerHTML = `<i class="sprite-player-pause"></i>`;
        pause.appendChild("click", async () => {
            entity.pause();

            await SocketMessages.sendCall({
                OnRoomFurnitureUse: {
                    id: entity.data.id,

                    action: "pause"
                }
            }, "OnRoomFurnitureUse");

            entity.unpause();
        });
        entity.buttons.append(pause);

        const next = document.createElement("div");
        next.className = "room-interface-furniture-player";
        next.innerHTML = `<i class="sprite-player-next"></i>`;
        next.appendChild("click", async () => {
            entity.pause();

            await SocketMessages.sendCall({
                OnRoomFurnitureUse: {
                    id: entity.data.id,

                    action: "next"
                }
            }, "OnRoomFurnitureUse");

            entity.unpause();
        });
        entity.buttons.append(next);
    });

    entity.events.show.push(function() {
        entity.videos.innerHTML = "";

        const furniture = RoomInterface.furnitures[entity.data.id];

        Furnitures.get(furniture.data.furniture).then(function(info) {
            //entity.setTitle(info.title);
        });

        for(let index in entity.data.videos) {
            const minutes = Math.floor(entity.data.videos[index].length / 60);
            const seconds = entity.data.videos[index].length - (minutes * 60);

            const video = document.createElement("div");
            video.className = "room-interface-furniture-video-item";
            video.innerHTML = `
                <div class="room-interface-furniture-video-item-title"><b>${entity.data.videos[index].title}</b></div>
                <p class="room-interface-furniture-video-item-user">By ${entity.data.videos[index].author}</p>

                <div class="room-interface-furniture-video-item-length">${minutes}:${((seconds < 10)?("0" + seconds):(seconds))}</div>
            `;
            entity.videos.append(video);

            const reference = document.createElement("div");
            reference.className = "sprite-reference";
            video.querySelector(".room-interface-furniture-video-item-title").append(reference);

            reference.addEventListener("click", () => {
                window.open("https://www.youtube.com/watch?v=" + entity.data.videos[index].id);
            });

            video.addEventListener("click", (e) => {
                if(!e.target.classList.contains("room-interface-furniture-video-item"))
                    return;

                video.parentElement.querySelector(".room-interface-furniture-video-item.active").classList.remove("active");

                video.classList.add("active");

                entity.frame.src = "https://www.youtube.com/embed/" + entity.data.videos[index].id;
            });

            const cross = document.createElement("div");
            cross.className = "sprite-cross";
            video.append(cross);

            cross.addEventListener("click", async () => {
                entity.pause();

                await SocketMessages.sendCall({
                    OnRoomFurnitureUse: {
                        id: entity.data.id,

                        video: entity.data.videos[index].id,

                        action: "remove"
                    }
                }, "OnRoomFurnitureUse");

                entity.frame.src = "";

                video.remove();

                entity.unpause();
            });
        }

        entity.videos.querySelector(".room-interface-furniture-video-item").click();
    });

    return entity;
};

SocketMessages.register("OnRoomFurnitureVideoUse", function(data) {
    RoomInterface.furniture.logics.furniture_video.data = data;

    RoomInterface.furniture.logics.furniture_video.show();
});
