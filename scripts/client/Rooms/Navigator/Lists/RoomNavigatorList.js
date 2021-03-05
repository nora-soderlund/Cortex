Client.rooms.navigator.list = function(settings) {
    this.$element = $(
        '<div class="room-navigator-list">' +
            '<div class="room-navigator-list-header">' +
                '<div class="room-navigator-list-toggle"></div>' +

                '<p class="room-navigator-list-title"></p>' +

                '<div class="room-navigator-list-expand"></div>' + 
            '</div>' +
        '</div>'
    );

    this.$table = $('<div class="room-navigator-list-table"></div>').appendTo(this.$element);

    this.settings = {
        active: false,
        title: "",

        count: 0,

        collapsed: false
    };

    this.set = function(settings) {
        if(settings.title != undefined)
            this.$element.find(".room-navigator-list-title").html(settings.title);

        if(settings.active != undefined) {
            if(settings.active)
                this.$element.attr("active", "");
            else
                this.$element.removeAttr("active");
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
        
        const $element = $(
            '<div class="room-navigator-list-item">' +
                '<div class="room-navigator-list-users" style="background: ' + color + '">' +
                    '<p class="room-navigator-list-users-count">' +
                        '<i></i>' + room.users +
                    '</p>' +
                '</div>' +
                room.title +
            '</div>'
        ).appendTo(this.$table);

        Client.game.getUser(room.user).then(function(user) {
            $('<div class="room-navigator-list-owner">By ' + user.name + '</div>').appendTo($element);
        });

        $element.click(async function() {
            Client.socket.messages.send({ OnRoomNavigatorEnter: room.id });
        });

        if(this.settings.count > 10) {
            this.$expandButton.show();

            $element.addClass("room-navigator-list-expanded");
        }
    };
    
    this.$expandButton = this.$element.find(".room-navigator-list-expand").on("click", { list: this }, function(event) {
        const list = event.data.list;

        if(list.settings.collapsed) {
            list.$table.find(".room-navigator-list-expanded").hide();

            $(this).removeAttr("active");
        }
        else {
            list.$table.find(".room-navigator-list-expanded").show();

            $(this).attr("active", "");
        }

        list.settings.collapsed = !list.settings.collapsed;
    });

    this.$element.find(".room-navigator-list-toggle").on("click", { list: this }, function(event) {
        const list = event.data.list;

        list.set({ active: !list.settings.active });
    });
};
