class DialogSelection {
    constructor(placeholder, options = []) {
        this.$element = $(
            '<div class="dialog-selection">' +
                '<div class="dialog-selection-placeholder">' + placeholder + '</div>' +
                
                '<div class="dialog-selection-options"></div>' +
            '</div>'
        );
    

        this.$placeholder = this.$element.find(".dialog-selection-placeholder");
    
        const $options = this.$element.find(".dialog-selection-options");
    
        this.$placeholder.on("click", function() {
            $options.toggle();
        });
    
        for(let index in options) {
            const $option = $('<div class="dialog-selection-option" value="' + options[index].value + '">' + options[index].text + '</div>').appendTo($options);
    
            $option.on("click", () => {
                $(this).parent().find(".dialog-selection-option.active").removeClass("active");
    
                $(this).addClass("active");
    
                this.$placeholder.text($(this).text()).attr("value", $(this).attr("value"));
    
                $options.hide();
            });
        }
    };

    value() {
        return this.$placeholder.attr("value");
    };
};
