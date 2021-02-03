Client.development = new function() {
    this.$element = $("#client-development");

    this.$info = $(
        '<div class="client-development">' +
            'PROJECT CORTEX DEVELOPMENT' +
            '' +
        '</div>'
    ).appendTo(Client.$element);

    this.$debug = $('<p></p>').appendTo(this.$info);
};
