const RoomInterfaceMenu = new class {
    constructor() {
        this.element = document.createElement("div");
        this.element.className = "room-interface-menu active";
        this.element.innerHTML = `
            <div class="room-interface-menu-toggle"></div>

            <div class="room-interface-menu-content"></div>
        `;
        RoomInterface.element.append(this.element);

        this.toggle = this.element.querySelector(".room-interface-menu-toggle");

        this.toggle.addEventListener("click", () => {
            this.element.classList.toggle("active");
        });

        this.content = this.element.querySelector(".room-interface-menu-content");
    
        this.link("information", "Information", function() {
            RoomInterface.information.toggle();
        });
        
        const settings = this.link("settings", "Settings", function() {
            Client.rooms.settings.toggle();
        });
    
        RoomInterface.events.start.push(function() {
            if(RoomInterface.data.user == Client.user.id)
                settings.style.display = "block";
            else
                settings.style.display = "none";
        });
    };

    link(identifier, title, click) {
        const element = document.createElement("div");
        element.className = `room-interface-menu-link room-interface-menu-${identifier}`;
        element.innerHTML = title;        
        this.content.append(element);

        element.addEventListener("click", () => {
            click();
        });

        return element;
    };
}();
