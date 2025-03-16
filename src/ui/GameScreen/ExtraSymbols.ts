import { Container, Sprite, Texture } from 'pixi.js';
import { gameState } from '../../utils/gameState';
import { Label } from '../Common/Label';
import { getLocaleStrings } from '../../utils/helpers';

/** Extra Symbols */
export class ExtraSymbols extends Container {
    /** Logo Image */
    public logo: Sprite;
    /** Time Label */
    public timeLabel: Label;
    public meridiem: Label;

    constructor() {
        super();

        /** Add Logo Image */
        const logoTexture = Texture.from('Extra/dragon_logo');
        this.logo = new Sprite(logoTexture);
        this.logo.x = 75;
        this.logo.y = 864;
        this.addChild(this.logo);

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        /** Add Meridiem Label */
        this.meridiem = new Label(parseInt(hours) >= 12 ? getLocaleStrings().pm : getLocaleStrings().am, {
            fill: '#ffd800',
            fontFamily: 'Roboto',
            fontSize: '16px',
        });
        this.meridiem.x = 1899;
        this.meridiem.y = 20;
        this.addChild(this.meridiem);

        /** Add Time Label */
        this.timeLabel = new Label(`${hours}:${minutes}`, {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '20px',
            letterSpacing: 1.2,
        });
        this.timeLabel.x = this.meridiem.x - this.meridiem.width / 2 - this.timeLabel.width / 2;
        this.timeLabel.y = 18;
        this.addChild(this.timeLabel);
    }

    /** Update  */
    public updateState(isBonus: boolean) {
        if (isBonus) {
            this.logo.x = 960 - this.logo.width / 2;
            this.logo.y = 36;
        } else {
            this.logo.x = 75;
            this.logo.y = 864;
        }
    }

    /**Update Time Text*/
    public updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        this.timeLabel.updateLabel(`${hours}:${minutes}`);

        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        this.meridiem.updateLabel(ampm);
    }

    /** Resize the background, fired whenever window size changes */
    public resize(width: number, height: number) {
        if (width > height || gameState.currentState.isDesktop) {
        } else {
        }
    }
}
