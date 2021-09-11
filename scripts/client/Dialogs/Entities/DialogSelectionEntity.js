class DialogSelection {
    constructor(placeholder, options = []) {
        this.element = document.createElement("div");
        this.element.classList.add("dialog-selection");
        this.element.innerHTML = `
            <div class="dialog-selection-placeholder">${placeholder}</div>
                
            <div class="dialog-selection-options"></div>
        `;

        this.placeholder = this.element.querySelector(".dialog-selection-placeholder");
    
        const optionsElement = this.element.querySelector(".dialog-selection-options");
    
        this.placeholder.addEventListener("click", () => {
            optionsElement.style.display = (optionsElement.style.display == "none")?("block"):("none");
        });
    
        for(let index in options) {
            const option = document.createElement("div");
            option.className = "dialog-selection-option";
            option.value = options[index].value;
            option.innerText = options[index].text;
            optionsElement.appendChild(option);
    
            option.addEventListener("click", () => {
                optionsElement.querySelector(".dialog-selection-option.active").classList.remove("active");
    
                option.classList.add("active");
    
                this.placeholder.innerText = option.innerText;
                this.placeholder.value = option.value;
    
                optionsElement.style.display = "none";
            });
        }
    };

    value() {
        return this.placeholder.value;
    };
};
