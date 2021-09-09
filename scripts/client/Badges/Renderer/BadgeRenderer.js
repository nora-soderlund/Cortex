class BadgeRenderer {
    constructor(id) {
        const element = document.createElement("div");
        element.classList.add("badge")

        const image = document.createElement("img");
        image.classList.add("badge-image");
        image.src = `assets/HabboBadges/${id}.gif`;
        
        element.appendChild(image);

        Badges.get(id).then(function() {

        });

        return element;
    };
};
