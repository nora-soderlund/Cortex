Client.badges.renderer = function(id) {
    const $element = $('<div></div>');

    const $canvas = $('<img src="assets/HabboBadges/' + id + '.gif">').appendTo($element);

    Client.badges.get(id).then(function() {

    });

    return $element;
};
