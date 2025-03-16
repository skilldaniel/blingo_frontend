import { Circle, Container, Sprite, Texture } from 'pixi.js';
import { FancyButton } from '@pixi/ui';
import { gsap } from 'gsap/gsap-core';

import { Label } from './Label';
import { getLocaleStrings } from '../../utils/helpers';
import { gameState } from '../../utils/gameState';
import { CURRENCY_SYMBOLS, BONUS_INFO } from '../../config';
import { sfx } from '../../utils/audio';

interface ImageButtonOption {
    image: string;
    imageClick: string;
    label: string;
    textStyle: object;
    isCircle: boolean;
}

const defaultImageButtonOption = {
    image: '',
    imageClick: '',
    label: '',
    textStyle: {
        fill: '#ffffff',
        fontFamily: 'Roboto',
        fontSize: '30px',
    },
    isCircle: false,
};

/** Common Button has Image and Label */
export class ImageButton extends FancyButton {
    /** ImageButton options */
    public opts: ImageButtonOption;

    /** Background for Spin Button */
    public imageButtonBackground: Sprite;

    /** Text for Spin Button */
    public imageButtonlLabel: Label;

    constructor(options: Partial<ImageButtonOption> = {}) {
        super();

        this.opts = { ...defaultImageButtonOption, ...options };

        /** Add Spin Button Background Image*/
        const imageButtonBackgroundTexture = Texture.from(this.opts.image);
        this.imageButtonBackground = new Sprite(imageButtonBackgroundTexture);
        this.imageButtonBackground.anchor.set(0.5);
        this.addChild(this.imageButtonBackground);
        this.imageButtonBackground.x = this.imageButtonBackground.width / 2;
        this.imageButtonBackground.y = this.imageButtonBackground.height / 2;

        /** Add Spin Button Label*/
        this.imageButtonlLabel = new Label(this.opts.label, this.opts.textStyle);
        this.imageButtonlLabel.x = this.imageButtonBackground.width / 2;
        this.imageButtonlLabel.y = this.imageButtonBackground.height / 2;
        this.addChild(this.imageButtonlLabel);

        /** Set Hit area */
        if (this.opts.isCircle) {
            this.hitArea = new Circle(this.width / 2, this.height / 2, this.width / 2);
        }

        this.sortableChildren = true;

        this.onDown.connect(this.handleDown.bind(this));
        this.onUp.connect(this.handleUp.bind(this));
    }

    /** Update Position */
    public updateLablePosition(x: number, y: number) {
        this.imageButtonlLabel.x += x;
        this.imageButtonlLabel.y += y;
    }

    /**Button Down Event */
    public handleDown() {
        sfx.play('game/Audio/Button_1.mp3');
        if (this.opts.imageClick !== '') {
            if (this.imageButtonBackground) this.removeChild(this.imageButtonBackground);
            this.imageButtonBackground = Sprite.from(this.opts.imageClick);
            this.imageButtonBackground.anchor.set(0.5);
            this.addChildAt(this.imageButtonBackground, 0);
            this.imageButtonBackground.x = this.imageButtonBackground.width / 2;
            this.imageButtonBackground.y = this.imageButtonBackground.height / 2;
        }
    }

    /**Button Up Event */
    private handleUp() {
        if (this.imageButtonBackground) this.removeChild(this.imageButtonBackground);
        this.imageButtonBackground = Sprite.from(this.opts.image);
        this.imageButtonBackground.anchor.set(0.5);
        this.addChildAt(this.imageButtonBackground, 0);
        this.imageButtonBackground.x = this.imageButtonBackground.width / 2;
        this.imageButtonBackground.y = this.imageButtonBackground.height / 2;
    }
}

interface SetStakeButtonOption {
    image: string;
    imageClick: string;
    label: string;
    textStyle: object;
}

const defaultSetStakeButtonOption = {
    image: '',
    imageClick: '',
    label: '',
    textStyle: {
        fill: '#ffffff',
        fontFamily: 'Roboto',
        fontSize: '30px',
    },
    isCircle: false,
};

export class SetStakeButton extends FancyButton {
    /** ImageButton options */
    public opts: ImageButtonOption;

    /** Background for Spin Button */
    public imageButtonBackground: Sprite;

    /** Text for Spin Button */
    public imageButtonlLabel: Label;
    constructor(options: Partial<SetStakeButtonOption> = {}) {
        super();
        this.opts = { ...defaultSetStakeButtonOption, ...options };

        /** Add Spin Button Background Image*/
        const imageButtonBackgroundTexture = Texture.from(this.opts.image);
        this.imageButtonBackground = new Sprite(imageButtonBackgroundTexture);
        this.imageButtonBackground.anchor.set(0.5);
        this.addChild(this.imageButtonBackground);
        this.imageButtonBackground.x = this.imageButtonBackground.width / 2;
        this.imageButtonBackground.y = this.imageButtonBackground.height / 2;

        /** Add Spin Button Label*/
        this.imageButtonlLabel = new Label(this.opts.label, this.opts.textStyle);
        this.imageButtonlLabel.x = this.imageButtonBackground.width / 2;
        this.imageButtonlLabel.y = this.imageButtonBackground.height / 2;
        this.addChild(this.imageButtonlLabel);

        this.onHover.connect(this.handleHover.bind(this));
        this.onDown.connect(this.handleDown.bind(this));
        this.onOut.connect(this.handleUp.bind(this));
        this.onUp.connect(this.handleUp.bind(this));
    }

    /** Update Label */
    public updateLabel(label: string, textStyle?: object) {
        this.imageButtonlLabel.text = label;
        if (textStyle) this.imageButtonlLabel.updateStyle(textStyle);
    }

    /** Update Image */
    public updateImage(image: string) {
        if (this.imageButtonBackground) this.removeChild(this.imageButtonBackground);
        this.opts.image = image;
        this.imageButtonBackground = Sprite.from(image);
        this.imageButtonBackground.anchor.set(0.5);
        this.addChildAt(this.imageButtonBackground, 0);
        this.imageButtonBackground.x = this.imageButtonBackground.width / 2;
        this.imageButtonBackground.y = this.imageButtonBackground.height / 2;
    }

    public handleClick() {
        if (this.opts.imageClick !== '' && this.opts.image === 'GameButtons/bet_button') {
            if (this.imageButtonBackground) this.removeChild(this.imageButtonBackground);
            this.imageButtonBackground = Sprite.from(this.opts.imageClick);
            this.imageButtonBackground.anchor.set(0.5);
            this.addChildAt(this.imageButtonBackground, 0);
            this.imageButtonBackground.x = this.imageButtonBackground.width / 2;
            this.imageButtonBackground.y = this.imageButtonBackground.height / 2;
        }
    }

    public handleHover() {
        this.handleClick();
    }

    public handleDown() {
        sfx.play('game/Audio/Button_1.mp3');
        this.handleClick();
    }

    public handleUp() {
        if (this.imageButtonBackground) this.removeChild(this.imageButtonBackground);
        this.imageButtonBackground = Sprite.from(this.opts.image);
        this.imageButtonBackground.anchor.set(0.5);
        this.addChildAt(this.imageButtonBackground, 0);
        this.imageButtonBackground.x = this.imageButtonBackground.width / 2;
        this.imageButtonBackground.y = this.imageButtonBackground.height / 2;
    }
}

/** Spin Button */
export class StartSpinButton extends FancyButton {
    /** Button Type */
    public buttonType: boolean;

    /** Background Image */
    public buttonBackground: Sprite;

    /** Label for Start Button */
    public startLabel: Label;
    public gameLabel: Label;

    /** Label for Extra Spin Value */
    public spinLabel: Label;
    public forLabel: Label;
    public spinValue: Label;

    constructor() {
        super();

        /* Add Background */
        const imageButtonBackgroundTexture = Texture.from('GameButtons/start');
        this.buttonBackground = new Sprite(imageButtonBackgroundTexture);
        this.buttonBackground.anchor.set(0.5);
        this.addChild(this.buttonBackground);
        this.buttonBackground.x = this.buttonBackground.width / 2;
        this.buttonBackground.y = this.buttonBackground.height / 2;

        /** Add Start Button Label */
        this.startLabel = new Label(getLocaleStrings().start, {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '30px',
            fontWeight: 'bold',
            letterSpacing: 3.5,
        });
        this.startLabel.anchor.set(0.5);
        this.startLabel.x = this.width / 2;
        this.startLabel.y = this.height / 2 - this.startLabel.width / 4 + 2;
        this.startLabel.visible = true;
        this.addChild(this.startLabel);

        this.gameLabel = new Label(getLocaleStrings().game, {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '30px',
            fontWeight: 'bold',
            letterSpacing: 3.5,
        });
        this.gameLabel.anchor.set(0.5);
        this.gameLabel.x = this.width / 2;
        this.gameLabel.y = this.height / 2 + this.gameLabel.width / 4 - 9;
        this.gameLabel.visible = true;
        this.addChild(this.gameLabel);

        /** Add Spin Button Label */

        this.spinLabel = new Label(getLocaleStrings().spin_for.split(' ')[0], {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '30px',
            fontWeight: 'bold',
            letterSpacing: 3,
        });
        this.spinLabel.anchor.set(0.5);
        this.spinLabel.x = this.width / 2 + 1;
        this.spinLabel.y = this.height / 2 - this.spinLabel.height - 3;
        this.spinLabel.visible = false;
        this.addChild(this.spinLabel);

        this.forLabel = new Label(getLocaleStrings().spin_for.split(' ')[1], {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '30px',
            fontWeight: 'bold',
            letterSpacing: 3,
        });
        this.forLabel.anchor.set(0.5);
        this.forLabel.x = this.width / 2 + 2;
        this.forLabel.y = this.height / 2 - 3;
        this.forLabel.visible = false;
        this.addChild(this.forLabel);

        this.spinValue = new Label(CURRENCY_SYMBOLS[gameState.currentState.currency] + gameState.currentState.stake, {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '30px',
            fontWeight: 'bold',
            letterSpacing: 3,
        });
        this.spinValue.anchor.set(0.5);
        this.spinValue.x = this.width / 2 - 5;
        this.spinValue.y = this.height / 2 + this.spinValue.height - 3;
        this.spinValue.visible = false;
        this.addChild(this.spinValue);

        /** Set Button Type */
        this.buttonType = true;

        /** Event List */
        this.onDown.connect(this.handleDown.bind(this));
        this.onUp.connect(this.handleUp.bind(this));
    }

    public updateButtonType(type: boolean, spinValue?: number) {
        this.buttonType = type;

        if (type) {
            /** Update Background */
            this.removeChild(this.buttonBackground);
            const imageButtonBackgroundTexture = Texture.from('GameButtons/start');
            this.buttonBackground = new Sprite(imageButtonBackgroundTexture);
            this.buttonBackground.anchor.set(0.5);
            this.addChildAt(this.buttonBackground, 0);
            this.buttonBackground.x = this.buttonBackground.width / 2;
            this.buttonBackground.y = this.buttonBackground.height / 2;

            /** Update Label Visble */
            this.startLabel.visible = true;
            this.gameLabel.visible = true;
            this.spinLabel.visible = false;
            this.forLabel.visible = false;
            this.spinValue.visible = false;

            this.alpha = 1;
            this.interactive = true;
        } else {
            this.removeChild(this.buttonBackground);
            const imageButtonBackgroundTexture = Texture.from('GameButtons/spin');
            this.buttonBackground = new Sprite(imageButtonBackgroundTexture);
            this.buttonBackground.anchor.set(0.5);
            this.addChildAt(this.buttonBackground, 0);
            this.buttonBackground.x = this.buttonBackground.width / 2;
            this.buttonBackground.y = this.buttonBackground.height / 2;
            if (spinValue) {
                this.startLabel.visible = false;
                this.gameLabel.visible = false;
                this.spinLabel.visible = true;
                this.forLabel.visible = true;
                this.spinValue.visible = true;

                this.spinValue.updateLabel(CURRENCY_SYMBOLS[gameState.currentState.currency] + spinValue);
                this.alpha = 1;
                this.interactive = true;
            } else {
                this.startLabel.visible = false;
                this.gameLabel.visible = false;
                this.spinLabel.visible = false;
                this.forLabel.visible = false;
                this.spinValue.visible = false;
                this.alpha = 0.5;
                this.interactive = false;
            }
        }
    }

    public updateLabel(value: string) {
        this.spinValue.updateLabel(CURRENCY_SYMBOLS[gameState.currentState.currency] + value);
    }

    public handleDown() {
        sfx.play('game/Audio/Button_1.mp3');
        if (this.buttonType) {
            this.removeChild(this.buttonBackground);
            const imageButtonBackgroundTexture = Texture.from('GameButtons/start_click');
            this.buttonBackground = new Sprite(imageButtonBackgroundTexture);
            this.buttonBackground.anchor.set(0.5);
            this.addChildAt(this.buttonBackground, 0);
            this.buttonBackground.x = this.buttonBackground.width / 2;
            this.buttonBackground.y = this.buttonBackground.height / 2;
        } else {
            this.removeChild(this.buttonBackground);
            const imageButtonBackgroundTexture = Texture.from('GameButtons/spin_click');
            this.buttonBackground = new Sprite(imageButtonBackgroundTexture);
            this.buttonBackground.anchor.set(0.5);
            this.addChildAt(this.buttonBackground, 0);
            this.buttonBackground.x = this.buttonBackground.width / 2;
            this.buttonBackground.y = this.buttonBackground.height / 2;
        }
    }

    public handleUp() {
        if (this.buttonType) {
            this.removeChild(this.buttonBackground);
            const imageButtonBackgroundTexture = Texture.from('GameButtons/start');
            this.buttonBackground = new Sprite(imageButtonBackgroundTexture);
            this.buttonBackground.anchor.set(0.5);
            this.addChildAt(this.buttonBackground, 0);
            this.buttonBackground.x = this.buttonBackground.width / 2;
            this.buttonBackground.y = this.buttonBackground.height / 2;
        } else {
            this.removeChild(this.buttonBackground);
            const imageButtonBackgroundTexture = Texture.from('GameButtons/spin');
            this.buttonBackground = new Sprite(imageButtonBackgroundTexture);
            this.buttonBackground.anchor.set(0.5);
            this.addChild(this.buttonBackground);
            this.buttonBackground.x = this.buttonBackground.width / 2;
            this.buttonBackground.y = this.buttonBackground.height / 2;
        }
    }
}

/** Spin Number Button */
export class SpinNumberButton extends Container {
    /** Cover Background for Spin Number Button */
    public spinCoverBackground: Sprite;

    /** Background for Spin Number Button */
    public spinBackground: Sprite;

    /** Text Spin Type */
    public spinType: Label;

    /** Number of Remain Spin */
    public spinNumber: Label;

    constructor(type: string, remain: number) {
        super();
        /** Add Background Image*/
        const spinBackgroundTexture = Texture.from('GameButtons/spin_box');
        this.spinBackground = new Sprite(spinBackgroundTexture);
        this.spinBackground.anchor.set(0.5);
        this.addChild(this.spinBackground);
        this.spinBackground.x = this.width / 2;
        this.spinBackground.y = this.height / 2;

        /** Add Spin Type Label*/
        this.spinType = new Label(type, {
            fill: '#ffd800',
            fontFamily: 'Roboto',
            fontSize: '30px',
            letterSpacing: 2,
        });
        this.spinType.anchor.set(0.5);
        this.spinType.x = this.width / 2;
        this.spinType.y = this.height / 4;
        this.addChild(this.spinType);

        /** Add Spin Number Label*/
        this.spinNumber = new Label(remain, {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '45px',
        });
        this.spinNumber.anchor.set(0.5);
        this.spinNumber.x = this.width / 2;
        this.spinNumber.y = (this.height / 4) * 3 - 10;
        this.addChild(this.spinNumber);

        /** Add Cover Background Image */
        const spinCoverBackgroundTexture = Texture.from('GameButtons/spin_cover');
        this.spinCoverBackground = new Sprite(spinCoverBackgroundTexture);
        this.spinCoverBackground.anchor.set(0.5);
        this.spinCoverBackground.alpha = 0;
        this.addChild(this.spinCoverBackground);
        this.spinCoverBackground.x = this.spinBackground.width / 2;
        this.spinCoverBackground.y = this.spinBackground.height / 2;
    }

    public updateCover(state: boolean) {
        // if (state) {
        //     if (isFreeSpin) {
        //         this.spinBackground.texture = Texture.from('GameButtons/spin_shine');
        //     } else {
        //         this.spinBackground.texture = Texture.from('GameButtons/spin_box');
        //     }
        //     this.spinCoverBackground.alpha = 1;
        // } else {
        //     this.spinCoverBackground.alpha = 0;
        // }
        if (state) {
            this.spinBackground.texture = Texture.from('GameButtons/spin_shine');
        } else {
            this.spinBackground.texture = Texture.from('GameButtons/spin_box');
        }
    }

    /** Update Spin Type */
    public updateSpinType(spinType: string) {
        this.spinType.text = spinType;
    }

    /** Update Spin Number */
    public updateSpinNumber(spinNumber: number) {
        this.spinNumber.text = spinNumber;
    }
}

/** Collect/End Button */
export class CollectEndButton extends FancyButton {
    /** Background */
    public background: Sprite;

    /** Collect Symbol */
    public collectSymbol: Sprite;

    /** Text Spin Type */
    public buttonType: Label;

    /** Win Spin Label */
    public winSpinLabel: Label;

    constructor() {
        super();
        /** Add Background Image*/
        const backgroundTexture = Texture.from('GameTable/Spin/green_button');
        this.background = new Sprite(backgroundTexture);
        this.background.anchor.set(0.5);
        this.addChild(this.background);
        this.background.x = this.width / 2;
        this.background.y = this.height / 2;

        /** Add Button Type Label*/
        this.buttonType = new Label(getLocaleStrings().collect, {
            fill: '#ffffff',
            fontFamily: 'Gang',
            fontSize: '49px',
            letterSpacing: 0.5,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 5,
            },
        });
        this.addChild(this.buttonType);

        /** Add Collect Symbol */
        const collectSymbolTexture = Texture.from('BonusInfo/' + BONUS_INFO[8]);
        this.collectSymbol = new Sprite(collectSymbolTexture);
        this.collectSymbol.anchor.set(0.5);
        this.addChild(this.collectSymbol);

        /** Add Win Spin Label */
        this.winSpinLabel = new Label('WIN SPIN', {
            fill: '#FFFFFF',
            fontFamily: 'Gang',
            fontSize: '15px',
        });
        this.addChild(this.winSpinLabel);

        this.buttonType.x = this.background.width / 2 - this.buttonType.width / 2 + 65 - 8;
        this.buttonType.y = (this.background.height - 10) / 2;
        this.collectSymbol.x = this.buttonType.x + this.buttonType.width / 2 + 12 + 65 / 2;
        this.collectSymbol.y = (this.background.height - 10) / 2;
        this.winSpinLabel.x = this.collectSymbol.x + 1;
        this.winSpinLabel.y = this.collectSymbol.y + 18;

        this.updateButtonType(false);

        /** Event List */
        this.onDown.connect(this.handleDown.bind(this));
        this.onUp.connect(this.handleUp.bind(this));
    }

    public updateButtonType(type: boolean) {
        if (type) {
            this.buttonType.text = getLocaleStrings().collect;
            this.collectSymbol.visible = true;
            this.winSpinLabel.visible = true;

            this.buttonType.x = this.background.width / 2 - this.buttonType.width / 2 + 65 - 8;
            this.buttonType.y = (this.background.height - 10) / 2;
        } else {
            this.buttonType.text = getLocaleStrings().end;
            this.collectSymbol.visible = false;
            this.winSpinLabel.visible = false;
            this.buttonType.x = this.width / 2;
            this.buttonType.y = (this.height - 10) / 2;
        }
    }

    public updateCollectButton(winNumber: number) {
        this.removeChild(this.collectSymbol);
        const collectSymbolTexture = Texture.from('BonusInfo/' + BONUS_INFO[winNumber >= 12 ? 0 : 11 - winNumber]);
        this.collectSymbol = new Sprite(collectSymbolTexture);
        this.collectSymbol.anchor.set(0.5);
        this.addChild(this.collectSymbol);
        this.winSpinLabel.zIndex = this.collectSymbol.zIndex + 1;
        this.collectSymbol.x = this.buttonType.x + this.buttonType.width / 2 + 12 + 65 / 2;
        this.collectSymbol.y = (this.background.height - 10) / 2;
        this.winSpinLabel.x = this.collectSymbol.x + 1;
        this.winSpinLabel.y = this.collectSymbol.y + 18;
    }

    public handleDown() {
        sfx.play('game/Audio/Button_1.mp3');
        this.removeChild(this.background);
        const backgroundTexture = Texture.from('GameTable/Spin/green_button_click');
        this.background = new Sprite(backgroundTexture);
        this.background.anchor.set(0.5);
        this.addChildAt(this.background, 0);
        this.background.x = this.background.width / 2;
        this.background.y = this.background.height / 2;
    }

    public handleUp() {
        this.removeChild(this.background);
        const backgroundTexture = Texture.from('GameTable/Spin/green_button');
        this.background = new Sprite(backgroundTexture);
        this.background.anchor.set(0.5);
        this.addChildAt(this.background, 0);
        this.background.x = this.background.width / 2;
        this.background.y = this.background.height / 2;
    }
}

/** Bonus Start Button */
export class BonusStartButton extends FancyButton {
    /** Background */
    public background: Sprite;

    /** Button Type */
    public buttonType: boolean;

    /** Start Label */
    public startLabel: Label;

    /** Win Label */
    public winLabel: Label;

    /** Win Value Label */
    public winValueLabel: Label;

    constructor() {
        super();
        /** Add Background Image*/
        const backgroundTexture = Texture.from('GameTable/Spin/green_button');
        this.background = new Sprite(backgroundTexture);
        this.background.anchor.set(0.5);
        this.addChild(this.background);
        this.background.x = this.width / 2;
        this.background.y = this.height / 2;

        /** Set Button Type */
        this.buttonType = true;

        /** Start Label */
        this.startLabel = new Label(getLocaleStrings().start + ' ' + getLocaleStrings().bonus, {
            fill: '#ffffff',
            fontFamily: 'Gang',
            fontSize: '48px',
            fontWeight: 'bold',
            letterSpacing: 0.5,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 5,
            },
        });
        this.startLabel.visible = false;
        this.addChild(this.startLabel);

        /** Win Label */
        this.winLabel = new Label(getLocaleStrings().win, {
            fill: '#fdd803',
            fontFamily: 'Gang',
            fontSize: '50px',
            fontWeight: 'bold',
            letterSpacing: 0.5,
        });
        this.winLabel.visible = false;
        this.addChild(this.winLabel);

        /** Win Value Label */
        this.winValueLabel = new Label('0.00', {
            fill: '#ffffff',
            fontFamily: 'Gang',
            fontSize: '60px',
            fontWeight: 'bold',
            letterSpacing: 0.5,
        });
        this.winValueLabel.visible = false;
        this.addChild(this.winValueLabel);

        this.updateButtonType(this.buttonType);

        /** Event List */
        this.onDown.connect(this.handleDown.bind(this));
        this.onUp.connect(this.handleUp.bind(this));
    }

    public updateButtonType(type: boolean) {
        this.buttonType = type;
        if (type) {
            this.startLabel.visible = false;
            this.winLabel.visible = false;
            this.winValueLabel.visible = false;

            /** Update Background */
            this.removeChild(this.background);
            const backgroundTexture = Texture.from('GameTable/Spin/green_button');
            this.background = new Sprite(backgroundTexture);
            this.background.anchor.set(0.5);
            this.addChildAt(this.background, 0);
            this.background.x = this.width / 2;
            this.background.y = this.height / 2;

            /** Update Label State */
            this.startLabel.visible = true;
            this.startLabel.x = this.background.width / 2 + 5;
            this.startLabel.y = this.background.height / 2 - 5;
            this.winLabel.visible = false;
            this.winValueLabel.visible = false;

            this.interactive = true;
        } else {
            this.startLabel.visible = false;
            this.winLabel.visible = false;
            this.winValueLabel.visible = false;

            /** Update Background */
            this.removeChild(this.background);
            const backgroundTexture = Texture.from('BonusSlot/win_box');
            this.background = new Sprite(backgroundTexture);
            this.background.anchor.set(0.5);
            this.addChildAt(this.background, 0);
            this.background.x = this.width / 2 + 13;
            this.background.y = this.height / 2 - 3;

            /** Update Label State */
            this.startLabel.visible = false;
            this.winLabel.visible = true;
            this.winLabel.x = this.background.width / 2 + 18;
            this.winLabel.y = this.background.height / 2 - this.winLabel.height / 2 - 12;
            this.winValueLabel.visible = true;
            this.winValueLabel.x = this.background.width / 2 + 13;
            this.winValueLabel.y = this.background.height / 2 + this.winValueLabel.height / 2 - 17;

            this.interactive = false;
        }
    }

    public updateWinValue(winNumber?: number) {
        if (winNumber) {
            this.winValueLabel.text = (parseFloat(this.winValueLabel.text) + winNumber).toFixed(2);
        } else {
            this.winValueLabel.text = '0.00';
        }
    }

    public handleDown() {
        sfx.play('game/Audio/Button_1.mp3');
        this.removeChild(this.background);
        const backgroundTexture = Texture.from('GameTable/Spin/green_button_click');
        this.background = new Sprite(backgroundTexture);
        this.background.anchor.set(0.5);
        this.addChildAt(this.background, 0);
        this.background.x = this.background.width / 2;
        this.background.y = this.background.height / 2;
    }

    public handleUp() {
        this.removeChild(this.background);
        const backgroundTexture = Texture.from('GameTable/Spin/green_button');
        this.background = new Sprite(backgroundTexture);
        this.background.anchor.set(0.5);
        this.addChildAt(this.background, 0);
        this.background.x = this.background.width / 2;
        this.background.y = this.background.height / 2;
    }
}

/** Toggle Button */
export class ToggleButton extends FancyButton {
    /** Toggle State */
    public toogleState: boolean;

    /** Toggle Button Background */
    public toggleBackground: Sprite;

    /**Toggle Slider */
    private toggleSlider: Sprite;

    constructor(state: boolean) {
        super();

        this.toogleState = state;

        const toggleBackgroundTexture = this.toogleState
            ? Texture.from('Popup/Setting/on')
            : Texture.from('Popup/Setting/off');
        this.toggleBackground = new Sprite(toggleBackgroundTexture);
        this.toggleBackground.anchor.set(0.5);
        this.toggleBackground.x = 0;
        this.toggleBackground.y = -this.toggleBackground.height / 2;
        this.addChild(this.toggleBackground);

        let toggleSliderTexutre = Texture.from('Popup/Setting/dot');
        this.toggleSlider = new Sprite(toggleSliderTexutre);
        this.toggleSlider.anchor.set(0.5);
        this.toggleSlider.x = this.toogleState
            ? this.toggleBackground.x + this.toggleBackground.width / 2 - 12
            : this.toggleBackground.x - this.toggleBackground.width / 2 + 12;

        this.toggleSlider.y = this.toggleBackground.y + 4;
        this.toggleSlider.zIndex = 2;
        this.addChild(this.toggleSlider);
    }

    public updateState(state: boolean) {
        this.toogleState = state;
        this.removeChild(this.toggleBackground);
        const toggleBackgroundTexture = this.toogleState
            ? Texture.from('Popup/Setting/on')
            : Texture.from('Popup/Setting/off');
        this.toggleBackground = new Sprite(toggleBackgroundTexture);
        this.toggleBackground.anchor.set(0.5);
        this.toggleBackground.x = 0;
        this.toggleBackground.y = -this.toggleBackground.height / 2;
        this.addChild(this.toggleBackground);
        this.toggleBackground.zIndex = 1;

        // Update the slider position
        const newPosition = this.toogleState
            ? this.toggleBackground.x + this.toggleBackground.width / 2 - 12
            : this.toggleBackground.x - this.toggleBackground.width / 2 + 12;

        // Animate the slider to the new position
        gsap.to(this.toggleSlider, { x: newPosition, duration: 0.2 });
    }
}
