import { Container, Sprite, Texture } from 'pixi.js';
import { Label } from '../../Common/Label';
import { BONUS_INFO } from '../../../config';

/**Bonous Info Box */
export class BonusInfoBox extends Container {
    /** Background for Bonus Type */
    public bonusInfoBackground: Sprite;

    /** Cover Background for Bonus Type */
    public bonusInfoCoverBackground: Sprite;

    /** Label for Bonus Type*/
    public bonusInfoLabel: Sprite;

    /** Image for Bonus Type*/
    public bonusInfoImage: Sprite;

    /** Text for Bonus Type */
    public winSpinLabel: Label | undefined;

    constructor(index: number) {
        super();
        /**Add Bonus Background Image*/
        const bonusInfoBackgroundTexture = Texture.from('BonusInfo/bonus_info_box');
        this.bonusInfoBackground = new Sprite(bonusInfoBackgroundTexture);
        this.bonusInfoBackground.anchor.set(0.5);
        this.addChild(this.bonusInfoBackground);
        this.bonusInfoBackground.x = this.width / 2;
        this.bonusInfoBackground.y = this.height / 2;

        /**Add Bonus Label */
        let bonusInfoLabelTexture = Texture.from('BonusInfo/' + (11 - index) + '_blingo');
        this.bonusInfoLabel = new Sprite(bonusInfoLabelTexture);
        this.bonusInfoLabel.anchor.set(0.5);
        this.bonusInfoLabel.x = (this.width - 70) / 2;
        this.bonusInfoLabel.y = this.bonusInfoBackground.height / 2;
        this.addChild(this.bonusInfoLabel);

        /**Add Bonus Image*/
        let bonusInfoImageTexture = Texture.from('BonusInfo/' + BONUS_INFO[index]);
        this.bonusInfoImage = new Sprite(bonusInfoImageTexture);
        this.bonusInfoImage.anchor.set(0.5);
        this.bonusInfoImage.x =
            index < 3
                ? this.width - this.bonusInfoImage.width / 2 + 18
                : this.width - this.bonusInfoImage.width / 2 - 5;
        this.bonusInfoImage.y = this.height / 2;
        this.addChild(this.bonusInfoImage);

        if (index < 9) {
            this.winSpinLabel = new Label('WIN SPIN', {
                fill: '#FFFFFF',
                fontFamily: 'Gang',
                fontSize: '15px',
            });
            this.winSpinLabel.x = this.bonusInfoImage.x + 1;
            this.winSpinLabel.y = this.bonusInfoBackground.height / 2 + 18;
            this.addChild(this.winSpinLabel);
        }

        /**Add Bonus Cover Background Image*/
        const bonusInfoCoverBackgroundTexture = Texture.from('BonusInfo/bonus_info_cover');
        this.bonusInfoCoverBackground = new Sprite(bonusInfoCoverBackgroundTexture);
        this.bonusInfoCoverBackground.anchor.set(0.5);
        this.addChild(this.bonusInfoCoverBackground);
        this.bonusInfoCoverBackground.x = this.bonusInfoBackground.width / 2;
        this.bonusInfoCoverBackground.y = this.bonusInfoBackground.height / 2;
        this.bonusInfoCoverBackground.visible = false;
    }

    /** Update Win State */
    public updateWinState(isActive: boolean) {
        this.bonusInfoCoverBackground.visible = isActive;
    }

    /** Get Win State */
    public getWinState() {
        return this.bonusInfoBackground.visible;
    }
}
