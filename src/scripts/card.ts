import { CardDetails } from "./models/card.model";

export class HoloCard {
    #isMoving = false;
    #card!: HTMLElement;
    #cardPreview!: HTMLElement;

    get isMoving() {
        return this.#isMoving;
    }

    get card() {
        return this.#card;
    }

    constructor(
        private _containerElement: HTMLElement,
        private _style: CSSStyleDeclaration,
        private _cardDetails: CardDetails
    ) {}

    initCard() {
        this.#card = document.createElement("div");
        this.#card.className = "card-wrapper";
        this.#card.innerHTML = `
        <div class="holo-card">
          <div class="card-shadow"></div>
          <div class="sparks"></div>
          <div class="gradient"></div>
        </div>`;
        this.#cardPreview = this.#card.children[0] as HTMLElement;
        this._containerElement.append(this.#card);

        this.#cardPreview.style.backgroundImage = `url(${this._cardDetails.imagePath})`;

        this.setShadowGradient();
        this.#cardPreview.addEventListener("mousemove", (e: MouseEvent) => {
            this.#isMoving = true;
            this.rotateCard(e);
            this.moveGradient(e);
            document.body.style.overflow = "hidden";
        });
        this.#cardPreview.addEventListener("touchmove", (e: TouchEvent) => {
            this.#isMoving = true;
            this.rotateCard(e);
            this.moveGradient(e);
            document.body.style.overflow = "hidden";
        });

        this.#cardPreview.addEventListener("mouseleave", () => {
            this.#isMoving = false;
            this.resetCardRotation();
            this.resetGradient();
            document.body.style.overflow = "";
        });
        this.#cardPreview.addEventListener("touchend", () => {
            this.#isMoving = false;
            this.resetCardRotation();
            this.resetGradient();
            document.body.style.overflow = "";
        });
        this.#cardPreview.addEventListener("touchcancel", () => {
            this.#isMoving = false;
            this.resetCardRotation();
            this.resetGradient();
            document.body.style.overflow = "";
        });
    }

    rotateCard(event: MouseEvent | TouchEvent) {
        const mouseX = (event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX;
        const mouseY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;

        const cardRect = this.#cardPreview.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        const factorDivision = 8;

        const dx = (mouseX - cardCenterX) / factorDivision;
        const dy = (mouseY - cardCenterY) / factorDivision / 2;

        this.#cardPreview.classList.remove("animate");
        this.#cardPreview.style.transition = `transform 50ms`;
        this.#cardPreview.style.transform = `rotateY(${dx}deg) rotateX(${-dy}deg)`;
    }

    resetCardRotation() {
        this.#cardPreview.style.transition = `transform ${this._style.getPropertyValue(
            "--transition-speed"
        )}`;
        this.#cardPreview.style.transform = `rotateX(${0}deg) rotateY(${0}deg) rotateZ(${0}deg)`;
    }

    moveGradient(event: MouseEvent | TouchEvent) {
        const gradient = this.#cardPreview.querySelector(
            ".gradient"
        ) as HTMLElement;

        const mouseX = (event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX;
        const mouseY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;

        const cardRect = this.#cardPreview.getBoundingClientRect();
        const cardEndX = cardRect.left + cardRect.width;
        const cardEndY = cardRect.top + cardRect.height;

        const dx = cardEndX - mouseX;
        const dY = cardEndY - mouseY;
        const percentageX = 100 - (dx / (cardEndX - cardRect.left)) * 100;
        const percentageY = 100 - (dY / (cardEndY - cardRect.top)) * 100;

        const percentage = (percentageX + percentageY) / 2;

        gradient.style.opacity = `${this._style.getPropertyValue(
            "--gradient-opacity"
        )}`;
        const transparentGradient = "rgba(255,255,255,0)";
        const gradientList = [`${transparentGradient} ${percentage - 100}%`];

        gradientList.push(
            ...this._cardDetails.holoGradient.map((gradient, i) => {
                const calculatePosition =
                    ((i + 1) / this._cardDetails.holoGradient.length / 2) * 100;
                const factorCompare =
                    i + 1 < this._cardDetails.holoGradient.length / 2 ? -1 : 1;
                return `${gradient.color} ${
                    percentage - 40 + calculatePosition * factorCompare
                }%`;
            })
        );

        gradientList.push(`${transparentGradient} ${percentage + 50}%`);
        gradient.style.background = `linear-gradient(128deg, ${gradientList.join(', ')})`;
    }

    resetGradient() {
        const gradient = this.#cardPreview.querySelector(
            ".gradient"
        ) as HTMLElement;
        gradient.style.opacity = `0`;
    }

    removeAnimation() {
        this.#cardPreview.classList.add("animate");
        setTimeout(() => {
            this.#cardPreview.classList.remove("animate");
        }, parseFloat(this._style.getPropertyValue("--animate-rotation")));
    }

    private setShadowGradient() {
        const cardShadow = this.#cardPreview.querySelector(
            ".card-shadow"
        ) as HTMLElement;
        const shadowGradient = this._cardDetails.shadowGradient
            .map((gradient) => `${gradient.color}`)
            .join(", ");
        cardShadow.style.background = `conic-gradient(from 90deg at 40% -25%, ${shadowGradient})`;
    }
}
