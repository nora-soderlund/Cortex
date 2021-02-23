Client.rooms.interface.information = new function() {
    this.$element = $(
        '<div class="room-interface-information active">' +
            '<div class="room-interface-information-toggle"></div>' +

            '<div class="room-interface-information-content"></div>' +
        '</div>'
    ).appendTo(Client.rooms.interface.$element);

    this.$toggle = this.$element.find(".room-interface-information-toggle");

    this.$toggle.on("click", function() {
        $(this).parent().toggleClass("active");
    });

    this.$content = this.$element.find(".room-interface-information-content");

    this.link = function(identifier, title, click) {
        const $element = $('<div class="room-interface-information-link room-interface-information-' + identifier + '">' + title + '</div>').appendTo(this.$content);

        $element.on("click", function() {
            click();
        });
    };

    this.link("settings", "Settings", function() {

    });
};
