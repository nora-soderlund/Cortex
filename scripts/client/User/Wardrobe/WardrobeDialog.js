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

        this.events.create.push(async () => {
            this.tabs = new DialogTabs("100%");
        
            this.tabs.element.classList.add("inventory-tabs");
        
            this.tabs.add("body", "Body");
            this.tabs.add("head", "Head");
        
            this.tabs.add("top", "Top");
            this.tabs.add("bottom", "Bottom");
            this.tabs.add("shoes", "Shoes");
        
            this.tabs.click(async function(identifier, content) {
            });
        
            this.tabs.show("body");
        
            this.content.append(this.tabs.element);
        });
    }
};
