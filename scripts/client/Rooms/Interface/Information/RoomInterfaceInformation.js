const RoomInterfaceInformation = new class extends Dialog {
    constructor(settings = {}) {
        settings = {
            title: "Room Information",
            
            size: {
                width: 240
            },
    
            offset: {
                type: "center",
    
                top: -120
            }
        };

        super(settings);

        this.events.create.push(() => {
            this.content.classList.add("room-interface-information");
            
            this.title = document.createElement("p");
            this.title.className = "room-interface-information-title";
            this.content.append(this.title);
            
            this.owner = document.createElement("p");
            this.owner.className = "room-interface-information-owner";
            this.content.append(this.owner);
            
            this.description = document.createElement("p");
            this.description.className = "room-interface-information-description";
            this.content.append(this.description);
            
            this.thumbnail = document.createElement("div");
            this.thumbnail.className = "room-interface-information-thumbnail";
            this.content.append(this.thumbnail);
        });
    
        this.events.show.push(() => {
            this.title.innerText = RoomInterface.data.title;
            this.owner.innerText = "";
            this.description.innerText = ((RoomInterface.data.description == undefined)?(""):(RoomInterface.data.description));
    
            Game.getUser(RoomInterface.data.user).then((user) => {
                this.owner.innerText = "By " + user.name;
            });
        });
    
        RoomInterface.events.stop.push(() => {
            if(this.active)
                this.hide();
        });
    };
}();
