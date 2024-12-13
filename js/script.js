class Annotation {
    constructor(link, delay) {
        this.isHover = false;
        this.delay = delay * 1000;

        this.link = link;
        this.block = this.link.parentNode;
        this.text = this.block.querySelector('.annotation-text');

        this.isLeftChanged = false;
        this.isRightChanged = false;
        this.translateX = '-50%';
        this.translateY = '-100%';

        this.#addEventListeners();
    }

    #clearTimeouts() {
        let highestTimeoutId = setTimeout(";");
        for (let i = 0 ; i < highestTimeoutId ; i++) {
            clearTimeout(i); 
        }
    }

    #addClassActive() {
        this.text.classList.add('active');
    }

    #removeClassActive() {
        this.text.classList.remove('active');
    }

    #checkHoverOnLink() {
        if (this.isHover) {
            this.#addClassActive();
        } else {
            this.#removeClassActive();
        }
    }

    #checkAnnotationPosition() {
        let distanceLeft = this.text.getBoundingClientRect().left;

        if (distanceLeft < 0 && !this.isRightChanged && !this.isLeftChanged) {
            this.translateX = `-${(this.block.getBoundingClientRect().width / 2) + this.block.getBoundingClientRect().left - 20}px`;
            this.isLeftChanged = true;
        }

        let distanceRight = this.text.getBoundingClientRect().right;
        if (window.outerWidth - distanceRight < 0 && !this.isLeftChanged && !this.isRightChanged) {
            this.translateX = `-${this.text.offsetWidth - (window.outerWidth - this.block.getBoundingClientRect().right) - (this.block.getBoundingClientRect().width / 2) + 20}px`;
            this.isRightChanged = true;
        }

        let distanceTop = this.block.getBoundingClientRect().top + this.text.offsetTop - this.text.offsetHeight;

        if (distanceTop < 0) {
            this.translateY = `${this.block.offsetHeight + 40}px`;
        } else {
            this.translateY = `-${this.text.offsetHeight}px`;
        }

        this.text.style.transform = `translate(${this.translateX}, ${this.translateY})`;
    }

    #addEventListeners() {
        this.link.addEventListener('mouseenter', () => {
            this.#addClassActive();
            this.#checkAnnotationPosition();

            this.#clearTimeouts();
            setTimeout(() => {this.#checkHoverOnLink()}, this.delay);
        });

        this.text.addEventListener('mouseenter', () => {
            this.#checkAnnotationPosition();

            this.#clearTimeouts();
            this.isHover = true;
        });

        this.text.addEventListener('mouseleave', () => {
            this.#checkAnnotationPosition();

            this.#clearTimeouts();
            setTimeout(() => {
                this.#removeClassActive();
                this.isHover = false;
            }, this.delay);
        });

        window.addEventListener('scroll', () => {
            this.#checkAnnotationPosition();
        });
    }
}

document.querySelectorAll('.annotation-link').forEach(el => {
    let annotation = new Annotation(el, 2);
});