import { HoloCard } from "./card";
import { cards } from "./cards.data";
import { CardDetails } from "./models/card.model";

export class CardsController {
    #countIntervalTime: number = 0;
    #cards: HoloCard[] = [];
    #containerWrapper!: HTMLElement;

    #images: CardDetails[] = cards

    constructor(private _styleSheet: CSSStyleDeclaration) {}

    init() {
        this.#containerWrapper = document.querySelector('.container-wrapper') as HTMLElement;

        this.#countIntervalTime = parseFloat(
            this._styleSheet.getPropertyValue("--animate-auto-rotation")
        );
        this.#cards = [];
        for (let i = 0; i < this.#images.length; i++) {
            const card = new HoloCard(
                this.#containerWrapper,
                this._styleSheet,
                this.#images[i]
            );
            card.initCard();
            this.#cards.push(card);
        }
        this.autoAnimateRandomCard();
    }

    private autoAnimateRandomCard() {
        return setInterval(() => {
            if (this.isAnyCardMoving()) return;
            const getRandomIndex = Math.floor(
                Math.random() * this.#cards.length
            );
            const card = this.#cards[getRandomIndex];
            card.removeAnimation();
        }, this.#countIntervalTime);
    }

    private isAnyCardMoving() {
        return this.#cards.filter((e) => e.isMoving).length > 0;
    }
}
