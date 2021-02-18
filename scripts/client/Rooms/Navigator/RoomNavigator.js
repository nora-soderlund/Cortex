Client.rooms.navigator = new function() {
    const entity = new Client.dialogs.default({
        title: "Room Navigator",
        
        size: {
            width: 420,
            height: "auto"
        },

        offset: {
            type: "center",
            top: -250
        }
    });

    entity.events.create.push(function() {
        entity.header = new Client.dialogs.header();

        entity.header.$element.appendTo(entity.$content);

        entity.tabs = new Client.dialogs.tabs(400);

        entity.tabs.add("public", "Public", function($element) {
            entity.header.setTitle("Public Lounges!");
    
            entity.header.setDescription("");
    
            entity.header.setIcon($('<div class="room-navigator-public-sprite"></div>'));
        });

        entity.tabs.add("all_rooms", "All Rooms", function($element) {
            entity.header.setTitle("Explore a new room!");
    
            entity.header.setDescription("Explore a new culture with each and every room you enter and meet different kind of people!");
    
            entity.header.setIcon($('<div class="room-navigator-explore-sprite"></div>'));
        });

        entity.tabs.add("events", "Events", function($element) {
            entity.header.setTitle("Publish an event!");
    
            entity.header.setDescription("Public an event to advertise your room and gain interest!");
    
            entity.header.setIcon($('<div class="room-navigator-event-sprite"></div>'));
        });

        entity.tabs.add("my_rooms", "My Rooms", async function($element) {
            entity.header.setTitle("Create your own room!");
    
            entity.header.setDescription("Create and furnish your own room to just your likings and show it off to your friends!");
    
            entity.header.setIcon($('<div class="room-navigator-create-sprite"></div>'));
        });

        entity.tabs.click(async function(identifier, $element) {
            entity.pause();

            const rooms = await Client.socket.messages.sendCall({ "OnRoomNavigatorUpdate": identifier }, "OnRoomNavigatorUpdate");

            for(let key in rooms) {
                const list = new Client.rooms.navigator.list({ title: key, active: true });

                for(let index in rooms[key])
                    list.add(rooms[key][index]);
                
                list.$element.appendTo($element);
            }

            entity.unpause();
        });
        
        entity.$home = $('<div class="room-navigator-tab-icon room-navigator-tab-home"></div>').on("click", function() {
            Client.socket.messages.send({ OnRoomNavigatorEnter: Client.user.home });
        }).appendTo(entity.tabs.$header);
        
        entity.$create = $('<div class="room-navigator-tab-icon room-navigator-tab-create"></div>').on("click", function() {
            
        }).appendTo(entity.tabs.$header);

        entity.tabs.show("my_rooms");

        entity.tabs.$element.appendTo(entity.$content);
    });

    entity.events.show.push(function() {
        //if(Client.user.home == null)
            entity.$home.hide();
        //else
        //    entity.$home.show();
    });

    return entity;
};
