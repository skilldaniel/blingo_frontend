import { Container, Sprite } from 'pixi.js';

import { gameState } from '../../utils/gameState';

export class Background extends Container {
    /** Left and Right Background Image */
    public background_left: Sprite;
    public background_right: Sprite;

    /** Logo */
    public logo: Sprite;

    constructor() {
        super();

        /** Add Left Background */
        this.background_left = Sprite.from('preload/Background/background_left.png');
        this.addChild(this.background_left);

        /** Add Right Background */
        this.background_right = Sprite.from('preload/Background/background_right.png');
        this.addChild(this.background_right);

        /** Add Logo */
        this.logo = Sprite.from('preload/Extra/logo.png');
        this.addChild(this.logo);
    }

    public resize(width: number, height: number) {
        if (width > height || gameState.currentState.isDesktop) {
            /** Set Position left background*/
            this.background_left.width = width / 2;
            this.background_left.x = 0;

            /** Set Position right background*/
            this.background_right.width = width / 2;
            this.background_right.x = width / 2;

            /** Set Position Logo*/
            this.logo.x = width / 2 - this.logo.width / 2;
            this.logo.y = height / 2 - this.logo.height / 2 - 41;

            /** Container Visible True */
            this.visible = true;
        } else {
            /** Container Visible False */
            this.visible = false;
        }
    }
}
