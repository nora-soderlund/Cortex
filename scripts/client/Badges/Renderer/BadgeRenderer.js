Client.badges.renderer = function(id) {
    const $element = $('<div class="badge"></div>');

    const $canvas = $('<img class="badge-image" src="assets/HabboBadges/' + id + '.gif">').appendTo($element);

    Client.badges.get(id).then(function() {

    });

    return $element;
};
