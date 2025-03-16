import { Container, Graphics } from 'pixi.js';

import { Label } from './Label';
import { app } from '../../main';
import { getLocaleStrings } from '../../utils/helpers';

export class RotateAlert extends Container {
    /** Rotate Background */
    private rotateBackground: Graphics;
    /** Rotate Label */
    private rotateLabel: Label;

    constructor() {
        super();
        /** Add Background */
        this.rotateBackground = new Graphics();
        this.rotateBackground.beginFill(0x000000);
        this.rotateBackground.drawRect(0, 0, app.screen.width, app.screen.height);
        this.rotateBackground.endFill();
        this.rotateBackground.x = 0;
        this.rotateBackground.y = 0;
        this.addChild(this.rotateBackground);

        /** Add Label */
        this.rotateLabel = new Label(getLocaleStrings().rotate_message, {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '50px',
        });

        this.addChild(this.rotateLabel);
    }

    public resize(width: number, height: number) {
        this.rotateBackground.width = width;
        this.rotateBackground.height = height;
        this.rotateLabel.x = width / 2;
        this.rotateLabel.y = height / 2;
    }
}
