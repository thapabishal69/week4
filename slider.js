
class ImageSlider {
    constructor(slider) {
        this.slider = slider;
        this.viewport = slider.querySelector(".slider-viewport");
        this.track = slider.querySelector(".slider-track");
        this.dotsContainer = slider.querySelector(".slider-dots");
        this.prevButton = slider.querySelector(".prev");
        this.nextButton = slider.querySelector(".next");
        this.counter = document.querySelector(".slide-counter");

        this.originalSlides = Array.from(
            this.track.querySelectorAll(".slide")
        );

        this.totalSlides = this.originalSlides.length;
        this.currentIndex = 1;
        this.isAnimating = false;

        if (this.totalSlides === 0) {
            return;
        }

        this.setupSlider();
    }

    setupSlider() {
        // Clone the last and first slides for infinite looping.
        const firstClone = this.originalSlides[0].cloneNode(true);
        const lastClone = this.originalSlides[
            this.totalSlides - 1
        ].cloneNode(true);

        firstClone.setAttribute("aria-hidden", "true");
        lastClone.setAttribute("aria-hidden", "true");

        this.track.appendChild(firstClone);
        this.track.insertBefore(lastClone, this.track.firstChild);

        this.slides = Array.from(
            this.track.querySelectorAll(".slide")
        );

        // Create one clickable dot for each original slide.
        this.createDots();

        // Start at the first real image.
        this.updatePosition(false);
        this.updateDots();
        this.updateCounter();

        // Navigation button events.
        this.nextButton.addEventListener("click", () => {
            this.next();
        });

        this.prevButton.addEventListener("click", () => {
            this.previous();
        });

        // Run after each sliding animation.
        this.track.addEventListener("transitionend", (event) => {
            if (event.target !== this.track) {
                return;
            }

            this.handleTransitionEnd();
        });

        // Recalculate the position if the viewport changes size.
        window.addEventListener("resize", () => {
            this.updatePosition(false);
        });
    }

    createDots() {
        this.dotsContainer.innerHTML = "";

        this.dots = [];

        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.classList.add("dot");
            dot.setAttribute(
                "aria-label",
                `Go to image ${i + 1}`
            );

            dot.addEventListener("click", () => {
                this.goToSlide(i + 1);
            });

            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        }
    }

    next() {
        if (this.isAnimating || this.totalSlides < 2) {
            return;
        }

        this.isAnimating = true;
        this.currentIndex++;

        this.updatePosition(true);
        this.updateDots();
        this.updateCounter();
    }

    previous() {
        if (this.isAnimating || this.totalSlides < 2) {
            return;
        }

        this.isAnimating = true;
        this.currentIndex--;

        this.updatePosition(true);
        this.updateDots();
        this.updateCounter();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) {
            return;
        }

        this.isAnimating = true;
        this.currentIndex = index;

        this.updatePosition(true);
        this.updateDots();
        this.updateCounter();
    }

    updatePosition(animate) {
        this.track.style.transition = animate
            ? ""
            : "none";

        const slideWidth = this.viewport.clientWidth;
        const offset = -this.currentIndex * slideWidth;

        this.track.style.transform =
            `translateX(${offset}px)`;
    }

    handleTransitionEnd() {
        // Move silently from a clone to its matching real slide.
        if (this.currentIndex === 0) {
            this.currentIndex = this.totalSlides;
            this.updatePosition(false);
        } else if (
            this.currentIndex === this.totalSlides + 1
        ) {
            this.currentIndex = 1;
            this.updatePosition(false);
        }

        this.updateDots();
        this.updateCounter();
        this.isAnimating = false;
    }

    updateDots() {
        const activeIndex =
            (this.currentIndex - 1 + this.totalSlides) %
            this.totalSlides;

        this.dots.forEach((dot, index) => {
            const isActive = index === activeIndex;

            dot.classList.toggle("active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    updateCounter() {
        const activeIndex =
            (this.currentIndex - 1 + this.totalSlides) %
            this.totalSlides;

        if (this.counter) {
            this.counter.textContent =
                `Image ${activeIndex + 1} of ${this.totalSlides}`;
        }
    }
}

// Initialize the slider after the HTML has loaded.
document.querySelectorAll(".slider").forEach((slider) => {
    new ImageSlider(slider);
});
