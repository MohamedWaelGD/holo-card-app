import "./style.scss";
import { CardsController } from "./scripts/cards-controller";

(() => {
    const styleSheet = getComputedStyle(document.body);
    const controller = new CardsController(styleSheet);
    controller.init();
})();
