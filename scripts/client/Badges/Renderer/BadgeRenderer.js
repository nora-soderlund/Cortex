class BadgeRenderer {
    constructor(id) {
        const $element = $('<div class="badge"></div>');

        const $canvas = $('<img class="badge-image" src="assets/HabboBadges/' + id + '.gif">').appendTo($element);

        Badges.get(id).then(function() {

        });

        return $element;
    };
};
