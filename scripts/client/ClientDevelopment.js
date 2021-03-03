Client.development = new function() {
    this.$element = $("#client-development");

    this.$info = $(
        '<div class="client-development">' +
            'PROJECT CORTEX DEVELOPMENT' +
            '' +
        '</div>'
    ).css({ "left": 0, "right": "initial" }).appendTo(Client.$element);

    this.$server = $('<p></p>').appendTo(this.$info);

    this.$uptime = $('<span></span>').appendTo(this.$server);

    this.$players = $('<span></span>').appendTo(this.$server).css({
        "margin-left": "6px",
        "float": "right"
    });
    

    this.$stats = $(
        '<div class="client-development">' +
            'PROJECT CORTEX HOBBA ACCESS' +
        '</div>'
    ).appendTo(Client.$element);

    this.$debug = $('<p></p>').appendTo(this.$stats);

    this.$frames = $('<span></span>').appendTo(this.$debug);

    this.$network = $('<span></span>').appendTo(this.$debug).css({
        "margin-left": "6px",
        "float": "right"
    });
};

Client.development.frames = new function() {
    $(window).on("wheel", function(event) {
        if(!event.shiftKey)
            return;
            
        const direction = (event.originalEvent.deltaY < 0)?(1):(-1);
        
        if(!Client.rooms.interface.active)
            return;

        Client.rooms.interface.frameLimit += direction;
    });
};
