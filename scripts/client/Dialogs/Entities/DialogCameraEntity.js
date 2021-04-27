Client.dialogs.camera = function(settings = {}) {
    const entity = new Dialog(settings);

    entity.events.create.push(function() {
        entity.$element.addClass("dialog-camera");

        const $grid = $('<div class="dialog-camera-grid"></div>').appendTo(entity.$content);
    });

    return entity;
};
