import { Container, Sprite, Texture } from 'pixi.js';
import { Label } from '../../Common/Label';

/** Spin Button Box */
export class StartButton extends Container {
    /** Background for Spin Button */
    public SpinButtonBackground: Sprite;

    /** Text for Spin Button */
    public SpinButtonlLabel: Label;

    constructor() {
        super();
        /** Add Spin Button Background Image*/
        const spinButtonBackgroundTexture = Texture.from('bonus_box');
        this.SpinButtonBackground = new Sprite(spinButtonBackgroundTexture);
        this.SpinButtonBackground.anchor.set(0.5);
        this.addChild(this.SpinButtonBackground);
        this.SpinButtonBackground.x = this.width / 2;
        this.SpinButtonBackground.y = this.height / 2;

        /** Add Spin Button Label*/
        this.SpinButtonlLabel = new Label('Start', {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '30px',
        });
        this.SpinButtonlLabel.anchor.set(0.5);
        this.SpinButtonlLabel.x = this.width / 2;
        this.SpinButtonlLabel.y = this.height / 2;
        this.addChild(this.SpinButtonlLabel);
    }
}
