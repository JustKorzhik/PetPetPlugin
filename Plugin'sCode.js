module.exports = class PetPetProfile {
    constructor() {
        this.button = null;
        this.observer = null;
        this.styleElement = null;
        this.imageUrl = "https://cdn.discordapp.com/attachments/1365393518482161685/1373659823333179403/262ae0a5d2b554f5.gif?ex=682b37e7&is=6829e667&hm=d7e461f51cf1829948bdcabbee40e10560fbfdb45712a960327076bdf2f7909b&";
        this.stateButton = 0;
    }

    start() {
        this.createButton();

        this.observer = new MutationObserver(() => {
            if (!this.button || !document.body.contains(this.button)) {
                this.createButton();
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    createImageSvg(avatarWrapper) {
        const imageSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        imageSvg.classList.add('svg-hand-plugin');
        imageSvg.setAttribute("viewBox", "0 0 80 80");
        imageSvg.setAttribute("preserveAspectRatio", "xMidYMid slice");
        imageSvg.style.cssText = `
            position: absolute;
            width: 80px;
            height: 80px;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.3s ease;
            overflow: hidden;
            border-radius: 50%;
            top: -20px;
        `;

        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("href", this.imageUrl);
        image.setAttribute("width", "100%");
        image.setAttribute("height", "100%");
        image.setAttribute("preserveAspectRatio", "xMidYMid slice");

        imageSvg.appendChild(image);
        avatarWrapper.appendChild(imageSvg);
        imageSvg.classList.add("hand-gif")

        return imageSvg;
    }

    resetGif(imageSvg) {
        const image = imageSvg.querySelector('image');
        if (!image) return;
        
        const src = image.getAttribute('href');
        image.setAttribute('href', '');
        setTimeout(() => {
            image.setAttribute('href', src);
        }, 10);
    }
   
    setButtonOpacity(opacity) {
        if (!this.button) return;
        this.button.style.opacity = opacity;
        this.button.style.transition = 'opacity 0.2s ease';
    }

    createButton() {
        if (this.button && this.button.parentNode) {
            this.button.parentNode.removeChild(this.button);
        }

        this.button = document.createElement("button");
        this.button.textContent = "Погладить";
        this.button.style.cssText = `
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            padding: 6px 12px;
            background-color: var(--user-profile-overlay-background);
            color: white;
            border: none;
            border-radius: 18px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            white-space: nowrap;
            transition: all 0.2s ease;
            opacity: 1;
        `;
        this.button.classList.add("button-petpet");

        if (!this.styleElement) {
            this.styleElement = document.createElement("style");
            this.styleElement.textContent = `
                @keyframes pressEffect {
                    0% {
                        transform: translateX(-50%) scale(1);
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    }
                    50% {
                        transform: translateX(-50%) scale(0.95);
                        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
                    }
                    100% {
                        transform: translateX(-50%) scale(1);
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    }
                }

                .press-animation {
                    animation: pressEffect 0.2s ease;
                }
            `;
            document.head.appendChild(this.styleElement);
        }

        this.button.addEventListener("mouseenter", () => {
            if (this.stateButton === 0) {
                this.button.style.transform = "translateX(-50%) scale(1.05)";
                this.button.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
            }
        });

        this.button.addEventListener("mouseleave", () => {
            this.button.style.transform = "translateX(-50%)";
            this.button.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
        });
        // Я всё время теряю эту часть кода с кнопкой. Как так?
        this.button.addEventListener("click", async () => {
            if (this.stateButton === 0) {
                this.stateButton = 1;
                this.setButtonOpacity(0.5);
                
                // Добавляем класс анимации
                this.button.classList.add("press-animation");
                this.button.addEventListener("animationend", () => {
                    this.button.classList.remove("press-animation");
                }, { once: true });

                const avatarWrapper = document.querySelector('.inner_c0bea0 .header__5be3e .avatar__75742:not(.clickable__75742)');
                if (!avatarWrapper) return;

                const svg = avatarWrapper.querySelector('svg');
                if (!svg) return;

                const foreignObject = svg.querySelector('foreignObject');
                if (!foreignObject) return;

                // Создаём SVG
                const imageSvg = this.createImageSvg(avatarWrapper);
                this.resetGif(imageSvg);

                foreignObject.style.transition = 'none';
                void foreignObject.offsetHeight;

                svg.style.width = '92px';
                svg.style.height = '82px';
                svg.style.top = '10px';
                svg.style.overflow = 'hidden';

                foreignObject.style.width = '80px';
                foreignObject.style.height = '80px';
                foreignObject.style.overflow = 'hidden';

                svg.style.transition = 'all 0.3s ease';

                await new Promise(resolve => setTimeout(resolve, 300));
                svg.style.height = '92px';
                svg.style.top = '0px';
                await new Promise(resolve => setTimeout(resolve, 300));
                
                this.stateButton = 0;
                this.setButtonOpacity(1);
                imageSvg.remove();
            }
        });

        const avatarWrapper = document.querySelector('.inner_c0bea0 .header__5be3e .avatar__75742:not(.clickable__75742)');
        if (avatarWrapper) {
            avatarWrapper.appendChild(this.button);
            const svg = avatarWrapper.querySelector('svg');
            if (svg) {
                svg.setAttribute('preserveAspectRatio', 'none');
                svg.style.top = '0px';
            }
        } else {
            console.error('Не удалось найти контейнер аватарки');
        }
    }

    stop() {
        if (this.button && this.button.parentNode) {
            this.button.parentNode.removeChild(this.button);
            this.button = null;
        }
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.styleElement) {
            this.styleElement.remove();
            this.styleElement = null;
        }
    }
};
