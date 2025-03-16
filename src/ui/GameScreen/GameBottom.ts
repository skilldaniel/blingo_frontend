import { Container, Sprite, Texture } from 'pixi.js';
import { Label } from '../Common/Label';

import { gameState } from '../../utils/gameState';
import { app } from '../../main';
import { getLocaleStrings } from '../../utils/helpers';
export class GameBottom extends Container {
    /** Background */
    public background: Sprite;

    /** Stake */
    public stakeLabel: Label;

    /** Stake Value */
    public stakeValueLabel: Label;

    /** Stake Currency Unit */
    public stakeUnit: Label;

    /** Description */
    public description: Label;

    /** Balance */
    public balanceLabel: Label;

    /** Balance Value */
    public balanceValueLabel: Label;

    /** Balance Unit */
    public balanceUnit: Label;

    constructor() {
        super();

        /** Add Background */
        const backgroundTexture = Texture.from('GameBottom/bottom_shadowbar');
        this.background = new Sprite(backgroundTexture);
        this.addChild(this.background);

        /** Add Stake Label */
        this.stakeLabel = new Label(getLocaleStrings().total_staked, {
            fill: '#ffd800',
            fontFamily: 'Roboto',
            fontSize: '22px',
            letterSpacing: 1.7,
        });
        this.addChild(this.stakeLabel);

        /** Add Stake Value Label */
        this.stakeValueLabel = new Label(gameState.currentState.stake.toFixed(2), {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '30px',
            fontWeight: 'bold',
        });
        this.addChild(this.stakeValueLabel);

        /** Add Stake Unit Label */
        this.stakeUnit = new Label(gameState.currentState.currency, {
            fill: '#ffd800',
            fontFamily: 'Roboto',
            fontSize: '22px',
            letterSpacing: 1,
        });
        this.addChild(this.stakeUnit);

        this.description = new Label('', {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '22px',
            letterSpacing: 1.5,
        });
        this.addChild(this.description);

        /** Add Balance Value */
        this.balanceLabel = new Label(getLocaleStrings().balance + ': ', {
            fill: '#ffd800',
            fontFamily: 'Roboto',
            fontSize: '23px',
            letterSpacing: 1.2,
        });
        this.addChild(this.balanceLabel);

        this.balanceValueLabel = new Label(gameState.currentState.balance, {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '30px',
            fontWeight: 'bold',
            letterSpacing: 1.5,
        });
        this.addChild(this.balanceValueLabel);

        this.balanceUnit = new Label(gameState.currentState.currency, {
            fill: '#ffd800',
            fontFamily: 'Roboto',
            fontSize: '22px',
            letterSpacing: 1,
        });
        this.addChild(this.balanceUnit);
    }

    /** Update Description */
    public updateDescription(description: string) {
        this.description.text = description;
        this.description.x = app.screen.width / 2;
        this.description.y = this.background.height / 2 + this.stakeUnit.height / 2 + 12;
    }

    /** Update Balance */
    public updateBalance(balance: number) {
        this.balanceValueLabel.text = balance.toFixed(2);
        this.resize(1920, 1080);
    }

    /** Resize the background, fired whenever window size changes */
    public resize(width: number, height: number) {
        if (width > height || gameState.currentState.isDesktop) {
            this.background.x = 0;
            this.background.y = 0;

            this.stakeLabel.x = this.stakeLabel.width / 2 + 9;
            this.stakeLabel.y = this.background.height / 2 + this.stakeLabel.height / 2 + 12;

            this.stakeValueLabel.x = this.stakeLabel.x + this.stakeLabel.width / 2 + this.stakeValueLabel.width / 2 + 2;
            this.stakeValueLabel.y = this.background.height / 2 + this.stakeValueLabel.height / 2 + 4;

            this.stakeUnit.x = this.stakeValueLabel.x + this.stakeValueLabel.width / 2 + this.stakeUnit.width / 2 + 1;
            this.stakeUnit.y = this.background.height / 2 + this.stakeUnit.height / 2 + 12;

            this.description.x = width / 2;
            this.description.y = this.background.height / 2 + this.stakeUnit.height / 2 + 12;

            this.balanceUnit.x = width - this.balanceUnit.width / 2 - 12;
            this.balanceUnit.y = this.background.height / 2 + this.stakeUnit.height / 2 + 12;

            this.balanceValueLabel.x =
                this.balanceUnit.x - this.balanceUnit.width / 2 - this.balanceValueLabel.width / 2 - 1;
            this.balanceValueLabel.y = this.background.height / 2 + this.balanceValueLabel.height / 2 + 4;

            this.balanceLabel.x =
                this.balanceValueLabel.x - this.balanceValueLabel.width / 2 - this.balanceLabel.width / 2 - 2;
            this.balanceLabel.y = this.background.height / 2 + this.balanceLabel.height / 2 + 12;

            this.visible = true;
        } else {
            this.visible = false;
        }
    }
}
