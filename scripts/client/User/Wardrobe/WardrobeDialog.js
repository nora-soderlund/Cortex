const WardrobeDialog = new class extends Dialog {
    constructor(settings = {}) {
        settings = {
            title: "User Wardrobe",
            
            size: {
                width: 580,
                height: 310
            }
        };

        super(settings);
    }
};
