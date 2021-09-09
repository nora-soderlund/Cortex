class DialogSelection {
    constructor(placeholder, options = []) {
        this.element = document.createElement("div");
        this.element.classList.add("dialog-selection");
        this.element.innerHTML = `
            <div class="dialog-selection-placeholder">${placeholder}</div>
                
            <div class="dialog-selection-options"></div>
        `;

        this.placeholder = this.element.querySelector(".dialog-selection-placeholder");
    
        const options = this.element.querySelector(".dialog-selection-options");
    
        this.placeholder.addEventListener("click", () => {
            options.style.display = (options.style.display == "none")?("block"):("none");
        });
    
        for(let index in options) {
            const option = document.createElement("div");
            option.className = "dialog-selection-option";
            option.value = options[index].value;
            option.innerText = options[index].text;
            options.appendChild(option);
    
            option.addEventListener("click", () => {
                options.querySelector(".dialog-selection-option.active").classList.remove("active");
    
                option.classList.add("active");
    
                this.placeholder.innerText = option.innerText;
                this.placeholder.value = option.value;
    
                options.style.display = "none";
            });
        }
    };

    value() {
        return this.placeholder.value;
    };
};
