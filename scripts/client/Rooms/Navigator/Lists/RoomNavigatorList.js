Client.rooms.navigator.list = function(settings) {
    this.element = document.createElement("div");
    this.element.className = "room-navigator-list";
    this.element.innerHTML = `
        <div class="room-navigator-list-header">
            <div class="room-navigator-list-toggle"></div>

            <p class="room-navigator-list-title"></p>

            <div class="room-navigator-list-expand"></div> 
        </div>

        <div class="room-navigator-list-table"></div>
    `;

    this.table = this.element.querySelector(".room-navigator-list-table");

    this.settings = {
        active: false,
        title: "",

        count: 0,

        collapsed: false
    };

    this.set = function(settings) {
        if(settings.title != undefined)
            this.element.querySelector(".room-navigator-list-title").innerHTML = settings.title;

        if(settings.active != undefined) {
            if(settings.active)
                this.element.setAttribute("active", "");
            else
               this.element.removeAttribute("active");
        }

        for(let key in settings)
            this.settings[key] = settings[key];
    };

    this.set(settings);

    this.add = function(settings) {
        const room = {
            users: 0,
            title: "Unknown title..."
        };

        for(let key in settings)
            room[key] = settings[key];

        let color = "#CAC9C0";

        if(room.users > 0) {
            color = "#62B061";
        }

        this.settings.count++;
        
        const element = document.createElement("div");
        element.className = "room-navigator-list-item";
        element.innerHTML = `
            <div class="room-navigator-list-users" style="background: ${color}">
                <p class="room-navigator-list-users-count">
                    <i></i> ${room.users}
                </p>
            </div>
            ${room.title}
        `;
        this.table.append(element);

        Game.getUser(room.user).then(function(user) {
            const owner = document.createElement("div");
            owner.className = "room-navigator-list-owner";
            owner.innerHTML = `By ${user.name}`;
            element.append(owner);
        });

        element.addEventListener("click", async () => {
            SocketMessages.send({ OnRoomNavigatorEnter: room.id });
        });

        if(this.settings.count > 10) {
            this.expandButton.style.display = "block";

            element.classList.add("room-navigator-list-expanded");
        }
    };
    
    this.expandButton = this.element.querySelector(".room-navigator-list-expand");
    this.expandButton.addEventListener("click", (event) => {
        if(this.settings.collapsed) {
            this.table.querySelector(".room-navigator-list-expanded").style.display = "none";

            this.expandButton.removeAttribute("active");
        }
        else {
            this.table.querySelector(".room-navigator-list-expanded").style.display = "block";

            this.expandButton.setAttribute("active", "");
        }

        this.settings.collapsed = !this.settings.collapsed;
    });

    this.element.querySelector(".room-navigator-list-toggle").addEventListener("click", (event) => {
        this.set({ active: !this.settings.active });
    });
};
