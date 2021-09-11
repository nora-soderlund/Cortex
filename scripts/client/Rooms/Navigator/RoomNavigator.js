Client.rooms.navigator = new function() {
    const entity = new Dialog({
        title: "Room Navigator",
        
        size: {
            width: 420,
            height: "auto"
        },

        offset: {
            type: "center",
            top: -250
        },

        resizable: true
    });

    entity.events.create.push(function() {
        entity.header = new DialogHeader();
        
        entity.content.append(entity.header.element);

        entity.tabs = new DialogTabs(400);

        entity.tabs.add("public", "Public", function(element) {
            entity.header.setTitle("Public Lounges!");
    
            entity.header.setDescription("");

            const icon = document.createElement("div");
            icon.className = "room-navigator-public-sprite";
            entity.header.setIcon(icon);
        });

        entity.tabs.add("all_rooms", "All Rooms", function(element) {
            entity.header.setTitle("Explore a new room!");
    
            entity.header.setDescription("Explore a new culture with each and every room you enter and meet different kind of people!");
    
            const icon = document.createElement("div");
            icon.className = "room-navigator-explore-sprite";
            entity.header.setIcon(icon);
        });

        entity.tabs.add("events", "Events", function(element) {
            entity.header.setTitle("Publish an event!");
    
            entity.header.setDescription("Public an event to advertise your room and gain interest!");
    
            const icon = document.createElement("div");
            icon.className = "room-navigator-event-sprite";
            entity.header.setIcon(icon);
        });

        entity.tabs.add("my_rooms", "My Rooms", async function(element) {
            entity.header.setTitle("Create your own room!");
    
            entity.header.setDescription("Create and furnish your own room to just your likings and show it off to your friends!");
    
            const icon = document.createElement("div");
            icon.className = "room-navigator-create-sprite";
            entity.header.setIcon(icon);
        });

        entity.tabs.click(async function(identifier, element) {
            entity.pause();

            const rooms = await SocketMessages.sendCall({ "OnRoomNavigatorUpdate": identifier }, "OnRoomNavigatorUpdate");

            for(let key in rooms) {
                const list = new Client.rooms.navigator.list({ title: key, active: true });

                rooms[key] = rooms[key].sort(function(a, b) { if(a.users == undefined) return 1; if(b.users == undefined) return -1; return b.users - a.users; });

                for(let index in rooms[key])
                    list.add(rooms[key][index]);

                element.append(list.element);
            }

            entity.unpause();
        });
        
        entity.home = document.createElement("div");
        entity.home.className = "room-navigator-tab-icon room-navigator-tab-home";
        entity.home.addEventListener("click", () => {
            SocketMessages.send({ OnRoomNavigatorEnter: Client.user.home });
        });
        entity.tabs.header.append(entity.home);
        
        entity.create = document.createElement("div");
        entity.create.className = "room-navigator-tab-icon room-navigator-tab-create";
        entity.create.addEventListener("click", () => {
            RoomCreation.toggle();
        });
        entity.tabs.header.append(entity.home);

        entity.tabs.show("my_rooms");

        entity.content.append(entity.tabs.element);
    });

    entity.events.show.push(function() {
        //if(Client.user.home == null)
            entity.home.style.display = "none";
        //else
        //    entity.$home.show();

        entity.tabs.show();
    });

    return entity;
};
