Client.dialogs.camera = function(settings = {}) {
    const entity = new Client.dialogs.default(settings);

    entity.$element.addClass("dialog-camera");

    entity.events.create.push(function() {
        const $grid = $('<div class="dialog-camera-grid"></div>').appendTo(entity.$content);
    });

    return entity;
};
