import { Container, Sprite, Texture } from 'pixi.js';
import { gameState } from '../../utils/gameState';

export class Background extends Container {
    /** Background Down for Landscape and Portrait */
    private background: Sprite;

    constructor() {
        super();

        /** Background Down for Landscape */
        const backgroundTexture = Texture.from('game/Background/background.mp4');
        backgroundTexture.baseTexture.resource.loop = true;
        this.background = new Sprite(backgroundTexture);
        this.background.anchor.set(0.5);
        this.addChild(this.background);
    }

    /** Resize the background, fired whenever window size changes */
    public resize(width: number, height: number) {
        if (width > height || gameState.currentState.isDesktop) {
            this.background.width = width;
            this.background.height = height;
            this.background.x = 0;
            this.background.y = 0;
        } else {
        }
    }
}
