import { AnimatedSprite, Container, Graphics, Rectangle, Sprite, Texture } from 'pixi.js';
import { ScrollBox, Slider } from '@pixi/ui';

import gsap from 'gsap';
import { ImageButton, SetStakeButton, ToggleButton } from '../ui/Common/Buttons';
import { GameInfoText } from '../ui/Common/GameInfoText';
import { Label } from '../ui/Common/Label';

import { gameState } from '../utils/gameState';
import { navigation } from '../utils/navigation';
import { getLocaleStrings } from '../utils/helpers';
import { sfx } from '../utils/audio';
import { BONUS, CURRENCY_SYMBOLS, REEL_SPEED, STAKE_MIN, STAKE_MULTI } from '../config';

/** GameScreen Popups */

/** Free Spin Popup */
export class FreeSpinBox extends Container {
    /** Free Spin Bakcground Effect */
    public freeSpinEffect: Sprite;

    /** Free Spin Background */
    public freeSpinBackground: Sprite;

    /** Free Spin ES Image */
    public freeSpinES: Sprite;

    /** Free Spin Rate Image */
    public freeSpinRate: Sprite;

    /** Free Spin Pointer */
    public freeSpinPointer: Sprite;

    constructor() {
        super();

        /** Add Free Spin Effect */
        const freeSpinEffectTexture = Texture.from('Popup/ExtraSpin/green_star_big');
        this.freeSpinEffect = new Sprite(freeSpinEffectTexture);
        this.freeSpinEffect.anchor.set(0.5);
        this.addChild(this.freeSpinEffect);

        /** Add Free Spin Background */
        const freeSpinBackgroundTexture = Texture.from('Popup/ExtraSpin/stator');
        this.freeSpinBackground = new Sprite(freeSpinBackgroundTexture);
        this.freeSpinBackground.anchor.set(0.5);
        this.addChild(this.freeSpinBackground);

        /** Add Free Spin Rate */
        const freeSpinRateTexture = Texture.from('Popup/ExtraSpin/spin_1');
        this.freeSpinRate = new Sprite(freeSpinRateTexture);
        this.freeSpinRate.anchor.set(0.5);
        this.freeSpinRate.blendMode = 'screen';
        this.addChild(this.freeSpinRate);

        /** Add Free Spin ES */
        const freeSpinESTexture = Texture.from('Popup/ExtraSpin/es_spin_1');
        this.freeSpinES = new Sprite(freeSpinESTexture);
        this.freeSpinES.anchor.set(0.5);
        this.addChild(this.freeSpinES);

        /** Add Free Spin Pointer */
        const freeSpinPointerTexture = Texture.from('Popup/ExtraSpin/point');
        this.freeSpinPointer = new Sprite(freeSpinPointerTexture);
        this.freeSpinPointer.anchor.set(0.5);
        this.freeSpinPointer.x = 0;
        this.freeSpinPointer.y = -this.freeSpinBackground.height / 2 + this.freeSpinPointer.height / 2 + 3;
        this.addChild(this.freeSpinPointer);

        this.visible = false;
    }

    /** Update Free Spin Type */
    public updateFreeSpinType(type: number) {
        /** Update Free Spin Rate */
        this.removeChild(this.freeSpinRate);
        const freeSpinRateTexture = Texture.from('Popup/ExtraSpin/spin_' + type);
        this.freeSpinRate = new Sprite(freeSpinRateTexture);
        this.freeSpinRate.anchor.set(0.5);
        this.freeSpinRate.blendMode = 'screen';
        this.addChild(this.freeSpinRate);

        /** Update Free Spin ES */
        this.removeChild(this.freeSpinES);
        const freeSpinESTexture = Texture.from(
            type <= 3 ? 'Popup/ExtraSpin/es_spin_1' : 'Popup/ExtraSpin/es_spin_' + type,
        );
        this.freeSpinES = new Sprite(freeSpinESTexture);
        this.freeSpinES.anchor.set(0.5);
        this.addChild(this.freeSpinES);
    }

    /** Show and Rotate Free Spin Box */
    public async show(type: number, state: boolean) {
        /** Show Free Spin Box */
        this.scale.x = 0;
        this.scale.y = 0;
        this.freeSpinEffect.rotation = 0;
        this.freeSpinES.rotation = 0;
        this.freeSpinRate.rotation = 0;
        this.freeSpinEffect.rotation = 0;
        this.visible = true;

        const prevAngle = [90, 45, 22.5, 11.25, 5.625];
        const stateAngle = state
            ? (Math.random() * 100) % (prevAngle[type - 1] * 2)
            : prevAngle[type - 1] * 2 + ((Math.random() * 1000) % (360 - prevAngle[type - 1] * 2));
        /** Show and Rotate Free Spin Box */
        const freeSpinTImeline = gsap.timeline();
        navigation?.currentScreen?.gate?.('updateGameBottomDescription', getLocaleStrings().extra_spin);
        setTimeout(() => {
            sfx.play('game/Audio/FreeSpinWheel.mp3', { loop: true });
        }, 2000);
        await freeSpinTImeline
            .to(this.scale, {
                duration: REEL_SPEED * 10,
                x: 1,
                y: 1,
                ease: 'back.out(1.7)',
            })
            .to(
                this.freeSpinEffect,
                {
                    duration: REEL_SPEED * 10,
                    ease: 'none',
                    rotation: 300 * (Math.PI / 180),
                },
                '<',
            )
            .to([this.freeSpinES, this.freeSpinRate], {
                duration: REEL_SPEED * 5,
                ease: 'power1.inOut',
                rotation: (1080 - prevAngle[type - 1] + stateAngle) * (Math.PI / 180),
            })
            .to(
                this.freeSpinEffect,
                {
                    duration: REEL_SPEED * 10,
                    ease: 'none',
                    rotation: 600 * (Math.PI / 180),
                    onComplete: () => {
                        this.hide();
                    },
                },
                '<',
            );
        sfx.stop('game/Audio/FreeSpinWheel.mp3');
    }

    /** Hide Free Spin Box */
    public hide() {
        this.visible = false;
        navigation?.currentScreen?.gate?.('updateGameBottomDescription', '');
    }
}

/** Option Container */
export class OptionContainer extends Container {
    /** Turbo Toggle Button */
    public turboToggleButton: ToggleButton;
    /** Sound Toggle Button */
    public soundToggleButton: ToggleButton;
    /** Music Toggle Button */
    public musicToggleButton: ToggleButton;
    /** Full Screen Toggle Button */
    public fullscreenToggleButton: ToggleButton;
    /** Turbo Toggle Button */
    public turboLabel: Label;
    /** Sound Toggle Button */
    public soundLabel: Label;
    /** Music Toggle Button */
    public musicLabel: Label;
    /** Full Screen Toggle Button */
    public fullscreenLabel: Label;

    constructor() {
        super();

        this.turboToggleButton = new ToggleButton(gameState.currentState.isTurbo);
        this.turboToggleButton.x = 108;
        this.turboToggleButton.y = 0;
        this.addChild(this.turboToggleButton);

        this.soundToggleButton = new ToggleButton(gameState.currentState.isSound);
        this.soundToggleButton.x = 108;
        this.soundToggleButton.y = this.turboToggleButton.height * 2;
        this.addChild(this.soundToggleButton);

        this.musicToggleButton = new ToggleButton(gameState.currentState.isMusic);
        this.musicToggleButton.x = 108;
        this.musicToggleButton.y = this.turboToggleButton.height * 4;
        this.addChild(this.musicToggleButton);

        this.fullscreenToggleButton = new ToggleButton(gameState.currentState.isFullScreen);
        this.fullscreenToggleButton.x = 108;
        this.fullscreenToggleButton.y = this.turboToggleButton.height * 6;
        this.addChild(this.fullscreenToggleButton);

        const commonTextStyle = {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '30px',
        };

        this.turboLabel = new Label(getLocaleStrings().turbo, commonTextStyle);
        this.turboLabel.anchor.set(0.5);
        this.turboLabel.x = -108;
        this.turboLabel.y = this.turboToggleButton.y - this.turboLabel.height / 2 + 4;
        this.addChild(this.turboLabel);

        this.soundLabel = new Label(getLocaleStrings().sound, commonTextStyle);
        this.soundLabel.x = -108;
        this.soundLabel.y = this.soundToggleButton.y - this.turboLabel.height / 2 + 4;
        this.addChild(this.soundLabel);

        this.musicLabel = new Label(getLocaleStrings().music, commonTextStyle);
        this.musicLabel.x = -108;
        this.musicLabel.y = this.musicToggleButton.y - this.turboLabel.height / 2 + 4;
        this.addChild(this.musicLabel);

        this.fullscreenLabel = new Label(getLocaleStrings().full_screen, commonTextStyle);
        this.fullscreenLabel.x = -108;
        this.fullscreenLabel.y = this.fullscreenToggleButton.y - this.turboLabel.height / 2 + 4;
        this.addChild(this.fullscreenLabel);

        this.turboToggleButton.on('pointertap', this.updateOption.bind(this, 1));
        this.soundToggleButton.on('pointertap', this.updateOption.bind(this, 2));
        this.musicToggleButton.on('pointertap', this.updateOption.bind(this, 3));
        this.fullscreenToggleButton.on('pointertap', this.updateOption.bind(this, 4));
    }

    public updateFullScreenState() {
        // gameState.currentState.wrapper.className = gameState.currentState.isFullScreen ? 'fullscreen' : '';
        this.fullscreenToggleButton.updateState(gameState.currentState.isFullScreen);
        if (gameState.currentState.isFullScreen) {
            gameState.currentState.wrapper.requestFullscreen().catch((err: { message: any }) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen().catch((err) => {
                console.error(`Error attempting to exit full-screen mode: ${err.message}`);
            });
        }
    }

    public updateOption(index: number) {
        if (index === 1) {
            gameState.setGameState({
                isTurbo: !gameState.currentState.isTurbo,
            });
            this.turboToggleButton.updateState(gameState.currentState.isTurbo);
        }
        if (index === 2) {
            gameState.setGameState({
                isSound: !gameState.currentState.isSound,
            });
            this.soundToggleButton.updateState(gameState.currentState.isSound);
            if (gameState.currentState.isSound) {
                gameState.unMuteSFX();
            } else {
                gameState.muteSFX();
            }
        }
        if (index === 3) {
            gameState.setGameState({
                isMusic: !gameState.currentState.isMusic,
            });
            this.musicToggleButton.updateState(gameState.currentState.isMusic);
            if (gameState.currentState.isMusic) {
                gameState.unMuteBGM();
            } else {
                gameState.muteBGM();
            }
        }
        if (index === 4) {
            gameState.setGameState({
                isFullScreen: !gameState.currentState.isFullScreen,
            });
            this.updateFullScreenState();
        }
    }
}

/** GameInfo Container */
export class GameInfoContainer extends Container {
    public payTableConatiner: Container;
    /** GameInfoText */
    public gameInfoText: GameInfoText;

    /**Scroll Box and Scroll Bar */
    public scrollBox: ScrollBox;
    public scrollBar: Slider;
    constructor(width: number, height: number) {
        super();
        this.payTableConatiner = new Container();

        /** Add Game Info Text */
        this.gameInfoText = new GameInfoText();
        this.gameInfoText.x = 25;
        this.gameInfoText.y = 10;
        this.payTableConatiner.addChild(this.gameInfoText);

        /**Add ScrollBox and Use PayTableContainer */
        this.scrollBox = new ScrollBox({
            width: width,
            height: height,
            globalScroll: true,
        });
        this.addChild(this.scrollBox);

        this.scrollBox.addItem(this.payTableConatiner);

        /** Add Scroll Slider */
        const min = 0;
        const max = 100;
        const value = 0;
        let bgTexture = Texture.from('Popup/Setting/scroll_back');
        const bg = new Sprite(bgTexture);
        bg.alpha = 0;

        let fillTexture = Texture.from('Popup/Setting/dot');
        const fill = new Sprite(fillTexture);
        fill.scale.set(0.7);

        this.scrollBar = new Slider({
            bg: bg,
            fill: bg,
            slider: fill,
            min,
            max,
            value,
        });
        this.scrollBar.rotation = Math.PI / 2;
        this.scrollBar.x = width + 20;
        this.scrollBar.y = this.scrollBar.width * 0.04;

        this.addChild(this.scrollBar);

        const scrollMulti = this.payTableConatiner.height / this.scrollBox.height - 1 + 0.05;

        /** ScrollBox Events */
        this.scrollBar.onUpdate.connect((value) => {
            this.scrollBox.scrollToPosition({ y: ((this.scrollBox.height * scrollMulti) / 100) * value });
        });

        this.scrollBox.on('wheel', () => {
            let height = this.scrollBox.height * scrollMulti;
            this.scrollBar.value = Math.abs((this.scrollBox.scrollY / height) * 100);
        });

        let isDragging = false;

        this.scrollBox.on('pointerdown', () => {
            isDragging = true;
        });

        this.scrollBox.on('pointerup', () => {
            isDragging = false;
        });

        this.scrollBox.on('globalpointermove', () => {
            let height = this.scrollBox.height * scrollMulti;
            if (isDragging) {
                if (this.scrollBox.scrollY < 0 && this.scrollBox.scrollY > -height) {
                    this.scrollBar.value = Math.abs((this.scrollBox.scrollY / height) * 100);
                }
            }
        });
    }
}

/** SetBox Popup */
export class MenuBox extends Container {
    /** SetBox State */
    public menuBoxState: boolean;

    /** Gradient Box */
    public gradientBackground: Graphics;

    /** Background */
    public background: Sprite;

    /** The Close Button */
    public closeButton: Sprite;

    /** The gameInfo Button */
    public gameInfoButton: Label;

    /** The gameInfo Button */
    public optionButton: Label;

    /** The Option Container */
    public optionContainer: OptionContainer;

    /** The GameInfo Container */
    public gameInfoContainer: GameInfoContainer;

    constructor() {
        super();

        this.menuBoxState = true;

        const width = 1920;
        const height = 1080;

        /** Add Gradient Background */
        this.gradientBackground = new Graphics();
        this.gradientBackground.rect(0, 0, width, height);
        this.gradientBackground.fill(0x180000, 0.7);
        this.gradientBackground.x = 0;
        this.gradientBackground.y = 0;
        this.gradientBackground.interactive = true;
        this.addChild(this.gradientBackground);

        /** Add Background */
        const backgroundTexture = Texture.from('Popup/Setting/info_menu');
        this.background = new Sprite(backgroundTexture);
        this.background.anchor.set(0.5);
        this.background.x = width / 2;
        this.background.y = height / 2;
        this.addChild(this.background);

        /** Add Close Button */
        let closeButtonTexture = Texture.from('Popup/Setting/close_button');
        this.closeButton = new Sprite(closeButtonTexture);
        this.closeButton.anchor.set(0.5);
        this.closeButton.interactive = true;
        this.closeButton.hitArea = new Rectangle(
            -1.5 * this.closeButton.width,
            -1.5 * this.closeButton.height,
            2.5 * this.closeButton.width,
            2.5 * this.closeButton.height,
        );
        this.closeButton.x = width / 2 + this.background.width / 2 - this.closeButton.width - 17;
        this.closeButton.y = height / 2 - this.background.height / 2 + this.closeButton.height + 8;
        this.addChild(this.closeButton);

        /** Add Game Info Button */
        this.gameInfoButton = new Label(getLocaleStrings().gameinfo, {
            fill: '#ff0054',
            fontFamily: 'Roboto',
            fontWeight: '400',
            fontSize: '21px',
            letterSpacing: 2.5,
        });
        this.gameInfoButton.interactive = true;
        this.gameInfoButton.hitArea = new Rectangle(
            -this.background.width * 0.225,
            -1.5 * this.gameInfoButton.height,
            this.background.width * 0.45,
            2.5 * this.gameInfoButton.height,
        );
        this.gameInfoButton.x = this.background.x - this.gameInfoButton.width / 4 - (this.background.width * 0.45) / 2;
        this.gameInfoButton.y = this.background.y - this.background.height / 2 + this.gameInfoButton.height / 2 + 20;
        this.addChild(this.gameInfoButton);

        /** Add Option Button */
        this.optionButton = new Label(getLocaleStrings().options, {
            fill: '#ff0054',
            fontFamily: 'Roboto',
            fontWeight: '400',
            fontSize: '21px',
            letterSpacing: 2.5,
        });
        this.optionButton.interactive = true;
        this.optionButton.hitArea = new Rectangle(
            -this.background.width * 0.225,
            -1.5 * this.optionButton.height,
            this.background.width * 0.45,
            2.5 * this.optionButton.height,
        );
        this.optionButton.x = this.background.x - this.optionButton.width / 4 + (this.background.width * 0.45) / 2;
        this.optionButton.y = this.background.y - this.background.height / 2 + this.gameInfoButton.height / 2 + 20;
        this.addChild(this.optionButton);

        this.background.interactive = true;

        this.optionContainer = new OptionContainer();
        this.optionContainer.x = width / 2;
        this.optionContainer.y = height / 2 - this.optionContainer.height / 2 + 30;
        this.addChild(this.optionContainer);
        this.optionContainer.alpha = 0;

        this.gameInfoContainer = new GameInfoContainer(this.background.width * 0.9, this.background.height * 0.8);
        this.gameInfoContainer.x = width / 2 - this.gameInfoContainer.width / 2;
        this.gameInfoContainer.y = height / 2 - this.gameInfoContainer.height / 2 + 30;
        this.addChild(this.gameInfoContainer);
        this.gameInfoContainer.alpha = 1;

        this.visible = false;

        this.gradientBackground.on('pointertap', this.hide.bind(this));
        this.closeButton.on('pointertap', this.hide.bind(this));
        this.gameInfoButton.on('pointertap', () => this.updateBackground(true));
        this.optionButton.on('pointertap', () => this.updateBackground(false));
    }

    public updateBackground(state: boolean) {
        if (state !== this.menuBoxState) {
            const backgroundTexture = state
                ? Texture.from('Popup/Setting/info_menu')
                : Texture.from('Popup/Setting/option_menu');
            this.background.texture = backgroundTexture;
            this.optionContainer.alpha = this.optionContainer.alpha ? 0 : 1;
            this.gameInfoContainer.alpha = this.gameInfoContainer.alpha ? 0 : 1;
            this.menuBoxState = state;
        }
    }

    public show() {
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }
}

/** Stake Popup */
export class StakeBox extends Container {
    /** Gradient Box */
    public gradientBackground: Graphics;

    /** Stake Array */
    public stakeBoxs: SetStakeButton[] = [];

    constructor() {
        super();

        const width = 1920;
        const height = 1080;

        /** Add Gradient Background */
        this.gradientBackground = new Graphics();
        this.gradientBackground.rect(0, 0, width, height);
        this.gradientBackground.fill(0x180000, 0.7);
        this.gradientBackground.x = 0;
        this.gradientBackground.y = 0;
        this.gradientBackground.interactive = true;
        this.addChild(this.gradientBackground);

        /** Add Stake Box */
        for (let index = 0; index < STAKE_MULTI.length; index++) {
            const currentStake = STAKE_MULTI[index] * STAKE_MIN[gameState.currentState.currency];
            this.stakeBoxs[index] = new SetStakeButton({
                image:
                    STAKE_MULTI[index] * STAKE_MIN[gameState.currentState.currency] === gameState.currentState.stake
                        ? 'GameButtons/bet_button_select'
                        : 'GameButtons/bet_button',
                imageClick: 'GameButtons/bet_button_click',
                label:
                    Math.round(currentStake) === currentStake
                        ? CURRENCY_SYMBOLS[gameState.currentState.currency] + currentStake.toString()
                        : CURRENCY_SYMBOLS[gameState.currentState.currency] + currentStake.toFixed(2).toString(),
                textStyle: {
                    fontFamily: 'Roboto',
                    fill:
                        STAKE_MULTI[index] * STAKE_MIN[gameState.currentState.currency] === gameState.currentState.stake
                            ? '#2d0000'
                            : '#ffffff',
                    fontWeight: 'bold',
                    fontSize: 40,
                },
            });
            this.stakeBoxs[index].x = index % 2 ? width / 2 + 44 : width / 2 - this.stakeBoxs[index].width - 41;
            this.stakeBoxs[index].y = Math.floor(index / 2) * (this.stakeBoxs[index].height - 6) + 151;
            this.stakeBoxs[index].interactive = true;
            this.addChild(this.stakeBoxs[index]);
            this.visible = false;

            this.stakeBoxs[index].on('pointertap', this.updateStake.bind(this, index));
        }
        this.gradientBackground.on('pointertap', () => {
            this.hide();
        });
    }

    /** Update Game Stake */
    public updateStake(index: number) {
        gameState.setGameState({
            stake: STAKE_MULTI[index] * STAKE_MIN[gameState.currentState.currency],
        });
        for (let i = 0; i < STAKE_MULTI.length; i++) {
            const currentStake = STAKE_MULTI[i] * STAKE_MIN[gameState.currentState.currency];

            this.stakeBoxs[i].updateImage(
                currentStake === gameState.currentState.stake
                    ? 'GameButtons/bet_button_select'
                    : 'GameButtons/bet_button',
            );

            this.stakeBoxs[i].updateLabel(
                Math.round(currentStake) === currentStake
                    ? CURRENCY_SYMBOLS[gameState.currentState.currency] + currentStake.toString()
                    : CURRENCY_SYMBOLS[gameState.currentState.currency] + currentStake.toFixed(2).toString(),
                {
                    fontFamily: 'Roboto',
                    fill:
                        STAKE_MULTI[i] * STAKE_MIN[gameState.currentState.currency] === gameState.currentState.stake
                            ? '#2d0000'
                            : '#ffffff',
                    fontWeight: 'bold',
                    fontSize: 40,
                },
            );
        }
        navigation?.currentScreen?.gate?.('updateStake');
        this.hide();
    }

    /** Show Stake Box */
    public show() {
        this.visible = true;
        navigation?.currentScreen?.gate?.('updateGameBottomDescription', getLocaleStrings().complete_cash);
    }

    /** Hide Stake Box */
    public hide() {
        this.visible = false;
        navigation?.currentScreen?.gate?.('updateGameBottomDescription', '');
    }
}

/** Result Box */
export class ResultBox extends Container {
    /** Gradient Background */
    public gradientBackground: Graphics;

    /** Reuslt Box Container */
    public resultBoxContainer: Container;
    /** Result Box Background */
    public background: Sprite;

    /** Text Result Label */
    public resultLabel: Label;

    /** Slot Win */
    public slotWinType: Sprite;
    public slotWinTypeLabel: Label;
    public slotWinAmount: Label;
    public slotWinCurrency: Label;

    /** Coin Win */
    public coinWin: Sprite;
    public coinWinLabel: Label;
    public coinWinAmount: Label;
    public coinWinCurrency: Label;

    /** Total Win */
    public totalWinLabel: Label;
    public totalWinAmount: Label;
    public totalWinCurrency: Label;
    constructor() {
        super();

        /** Add Gradient Background */
        this.gradientBackground = new Graphics();
        this.gradientBackground.rect(0, 0, 1920, 1080);
        this.gradientBackground.fill(0x180000, 0.7);
        this.gradientBackground.x = 0;
        this.gradientBackground.y = 0;
        this.gradientBackground.interactive = true;
        this.addChild(this.gradientBackground);

        this.resultBoxContainer = new Container();
        this.addChild(this.resultBoxContainer);

        const backgroundTexture = Texture.from('Popup/result_panel');
        this.background = new Sprite(backgroundTexture);
        this.background.anchor.set(0.5);
        this.background.x = this.background.width / 2;
        this.background.y = this.background.height / 2;
        this.resultBoxContainer.addChild(this.background);

        this.resultLabel = new Label(getLocaleStrings().result, {
            fill: '#ffffff',
            fontFamily: 'Gang',
            fontSize: '48px',
            letterSpacing: 0,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 4,
            },
        });
        this.resultLabel.x = this.background.width / 2 + 2;
        this.resultLabel.y = 86;
        this.resultBoxContainer.addChild(this.resultLabel);

        const slotWinTypeTexture = Texture.from('BonusSlot/Symbols/LOTUS');
        this.slotWinType = new Sprite(slotWinTypeTexture);
        this.slotWinType.anchor.set(0.5);
        this.slotWinType.scale = 0.7;
        this.slotWinType.x = 259;
        this.slotWinType.y = 300;
        this.resultBoxContainer.addChild(this.slotWinType);

        this.slotWinTypeLabel = new Label(4 + ' ' + getLocaleStrings().blingos, {
            fill: '#ffffff',
            fontFamily: 'Gang',
            fontSize: '32px',
            letterSpacing: 0,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 5,
            },
        });
        this.slotWinTypeLabel.x = this.slotWinType.x + (this.slotWinType.width + this.slotWinTypeLabel.width) / 2 + 6;
        this.slotWinTypeLabel.y = 300;
        this.resultBoxContainer.addChild(this.slotWinTypeLabel);

        this.slotWinAmount = new Label('20.00', {
            fill: '#ffffff',
            fontFamily: 'Gang',
            fontSize: '60px',
            letterSpacing: 1,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 5,
            },
        });
        this.slotWinAmount.x = 679;
        this.resultBoxContainer.addChild(this.slotWinAmount);

        this.slotWinCurrency = new Label(gameState.currentState.currency, {
            fill: '#ffd200',
            fontFamily: 'Gang',
            fontSize: '32px',
            letterSpacing: 1,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 5,
            },
        });
        this.slotWinCurrency.x =
            this.slotWinAmount.x + this.slotWinAmount.width / 2 + this.slotWinCurrency.width / 2 - 4;
        this.slotWinCurrency.y = 300;
        this.slotWinAmount.y =
            this.slotWinCurrency.y - this.slotWinAmount.height / 2 + this.slotWinCurrency.height / 2 + 4;
        this.resultBoxContainer.addChild(this.slotWinCurrency);

        const coinTexture = Texture.from('GameTable/Spin/PG/PG_1');
        this.coinWin = new Sprite(coinTexture);
        this.coinWin.anchor.set(0.5);
        this.coinWin.x = 259;
        this.coinWin.y = 459;
        this.resultBoxContainer.addChild(this.coinWin);

        this.coinWinLabel = new Label(getLocaleStrings().coin, {
            fill: '#ffffff',
            fontFamily: 'Gang',
            fontSize: '32px',
            letterSpacing: 1,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 5,
            },
        });
        this.coinWinLabel.x = this.coinWin.x + (this.coinWin.width + this.coinWinLabel.width) / 2;
        this.coinWinLabel.y = 459;
        this.resultBoxContainer.addChild(this.coinWinLabel);

        this.coinWinAmount = new Label('5.00', {
            fill: '#ffffff',
            fontFamily: 'Gang',
            fontSize: '60px',
            letterSpacing: 1,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 5,
            },
        });
        this.coinWinAmount.x = 693;
        this.resultBoxContainer.addChild(this.coinWinAmount);

        this.coinWinCurrency = new Label(gameState.currentState.currency, {
            fill: '#ffd200',
            fontFamily: 'Gang',
            fontSize: '32px',
            letterSpacing: 1,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 5,
            },
        });
        this.coinWinCurrency.x =
            this.coinWinAmount.x + this.coinWinAmount.width / 2 + this.coinWinCurrency.width / 2 - 4;
        this.coinWinCurrency.y = 459;
        this.coinWinAmount.y =
            this.coinWinCurrency.y - this.coinWinAmount.height / 2 + this.coinWinCurrency.height / 2 + 4;
        this.resultBoxContainer.addChild(this.coinWinCurrency);

        /** Total Win */
        this.totalWinLabel = new Label(getLocaleStrings().win, {
            fill: '#ffd200',
            fontFamily: 'Gang',
            fontSize: '60px',
            letterSpacing: 1,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 5,
            },
        });
        this.totalWinLabel.x = this.background.width / 2 + 4;
        this.totalWinLabel.y = 606;
        this.resultBoxContainer.addChild(this.totalWinLabel);

        this.totalWinAmount = new Label('25.00', {
            fill: '#ffffff',
            fontFamily: 'Gang',
            fontSize: '75px',
            letterSpacing: 1,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 5,
            },
        });
        this.totalWinAmount.x = this.background.width / 2 + 2;
        this.totalWinAmount.y = 675;
        this.resultBoxContainer.addChild(this.totalWinAmount);

        this.totalWinCurrency = new Label(gameState.currentState.currency, {
            fill: '#ffd200',
            fontFamily: 'Gang',
            fontSize: '40px',
            letterSpacing: 0,
            dropShadow: {
                angle: 90,
                color: '#000000',
                distance: 5,
            },
        });
        this.totalWinCurrency.x =
            this.totalWinAmount.x + (this.totalWinAmount.width + this.totalWinCurrency.width) / 2 - 4;
        this.totalWinCurrency.y = 688;
        this.resultBoxContainer.addChild(this.totalWinCurrency);

        this.resultBoxContainer.x = this.width / 2 - this.resultBoxContainer.width / 2;
        this.resultBoxContainer.y = 1080 / 2 - this.resultBoxContainer.height / 2 - 73.5;

        this.resultBoxContainer.interactive = true;
        this.gradientBackground.interactive = true;
        this.visible = false;

        this.gradientBackground.on('pointertap', () => {
            this.hide();
        });
    }

    public updateState(type: number) {
        if (type === 0 || type === 1) {
            this.slotWinType.x = 259;
            this.slotWinType.y = 300;
            this.slotWinTypeLabel.x =
                this.slotWinType.x + (this.slotWinType.width + this.slotWinTypeLabel.width) / 2 + 6;
            this.slotWinTypeLabel.y = 300;
            this.slotWinAmount.x = 679;
            this.slotWinCurrency.x =
                this.slotWinAmount.x + this.slotWinAmount.width / 2 + this.slotWinCurrency.width / 2 - 4;
            this.slotWinCurrency.y = 300;
            this.slotWinAmount.y =
                this.slotWinCurrency.y - this.slotWinAmount.height / 2 + this.slotWinCurrency.height / 2 + 4;
            this.coinWin.x = 259;
            this.coinWin.y = 459;
            this.coinWinLabel.x = this.coinWin.x + (this.coinWin.width + this.coinWinLabel.width) / 2;
            this.coinWinLabel.y = 459;
            this.coinWinAmount.x = 693;
            this.coinWinCurrency.x =
                this.coinWinAmount.x + this.coinWinAmount.width / 2 + this.coinWinCurrency.width / 2 - 4;
            this.coinWinCurrency.y = 459;
            this.coinWinAmount.y =
                this.coinWinCurrency.y - this.coinWinAmount.height / 2 + this.coinWinCurrency.height / 2 + 4;

            this.slotWinType.visible = true;
            this.slotWinTypeLabel.visible = true;
            this.slotWinAmount.visible = true;
            this.slotWinCurrency.visible = true;

            this.coinWin.visible = !!(type === 0);
            this.coinWinLabel.visible = !!(type === 0);
            this.coinWinAmount.visible = !!(type === 0);
            this.coinWinCurrency.visible = !!(type === 0);
        }
        if (type === 2) {
            this.slotWinType.x = 259;
            this.slotWinType.y = 459;
            this.slotWinTypeLabel.x =
                this.slotWinType.x + (this.slotWinType.width + this.slotWinTypeLabel.width) / 2 + 6;
            this.slotWinTypeLabel.y = 459;
            this.slotWinAmount.x = 679;
            this.slotWinCurrency.x =
                this.slotWinAmount.x + this.slotWinAmount.width / 2 + this.slotWinCurrency.width / 2 - 4;
            this.slotWinCurrency.y = 459;
            this.slotWinAmount.y =
                this.slotWinCurrency.y - this.slotWinAmount.height / 2 + this.slotWinCurrency.height / 2 + 4;
            this.coinWin.x = 259;
            this.coinWin.y = 300;
            this.coinWinLabel.x = this.coinWin.x + (this.coinWin.width + this.coinWinLabel.width) / 2;
            this.coinWinLabel.y = 300;
            this.coinWinAmount.x = 693;
            this.coinWinCurrency.x =
                this.coinWinAmount.x + this.coinWinAmount.width / 2 + this.coinWinCurrency.width / 2 - 4;
            this.coinWinCurrency.y = 300;
            this.coinWinAmount.y =
                this.coinWinCurrency.y - this.coinWinAmount.height / 2 + this.coinWinCurrency.height / 2 + 4;

            this.slotWinType.visible = false;
            this.slotWinTypeLabel.visible = false;
            this.slotWinAmount.visible = false;
            this.slotWinCurrency.visible = false;

            this.coinWin.visible = true;
            this.coinWinLabel.visible = true;
            this.coinWinAmount.visible = true;
            this.coinWinCurrency.visible = true;
        }
    }

    public updateSlotWinType(winNumber: number) {
        let slotWinSymbol: string;
        if (winNumber > 8) {
            const amulet = ['PIG_AMULET', 'EIGHT_AMULET', 'DRAGON', 'DRAGON'];
            slotWinSymbol = amulet[winNumber - 9];
        } else {
            slotWinSymbol = BONUS[winNumber - 3];
        }

        this.resultBoxContainer.removeChild(this.slotWinType);
        const slotWinTypeTexture = Texture.from('BonusSlot/Symbols/' + slotWinSymbol);
        this.slotWinType = new Sprite(slotWinTypeTexture);
        this.slotWinType.anchor.set(0.5);
        this.slotWinType.scale = 0.7;
        this.slotWinType.x = 259;
        this.slotWinType.y = 300;
        this.resultBoxContainer.addChild(this.slotWinType);

        this.slotWinTypeLabel.text = winNumber + ' ' + getLocaleStrings().blingos;
    }

    public updateResult(slotWin: number, coinWin: number, totalWin: number) {
        this.slotWinAmount.text = slotWin.toFixed(2);
        this.coinWinAmount.text = coinWin.toFixed(2);
        this.totalWinAmount.text = totalWin.toFixed(2);

        this.slotWinAmount.x = 679;
        this.slotWinCurrency.x =
            this.slotWinAmount.x + this.slotWinAmount.width / 2 + this.slotWinCurrency.width / 2 - 4;

        this.coinWinAmount.x = 693;
        this.coinWinCurrency.x =
            this.coinWinAmount.x + this.coinWinAmount.width / 2 + this.coinWinCurrency.width / 2 - 4;

        this.totalWinAmount.x = this.background.width / 2 + 2;
        this.totalWinCurrency.x =
            this.totalWinAmount.x + (this.totalWinAmount.width + this.totalWinCurrency.width) / 2 - 4;
    }

    public show() {
        this.visible = true;
        navigation?.currentScreen?.gate?.('updateGameBottomDescription', getLocaleStrings().result);
    }

    public hide() {
        this.visible = false;
        navigation?.currentScreen?.gate?.('updateGameBottomDescription', '');
    }
}

/** Spirte PopUp */
export class ImagePopUp extends Container {
    /** Image Background */
    public image: Sprite;

    /** Gradient Background*/
    public gradientBackground: Graphics;

    constructor() {
        super();
        const width = 1920;
        const height = 1080;

        this.gradientBackground = new Graphics();
        this.gradientBackground.beginFill(0x000000, 0.7);
        this.gradientBackground.drawRect(0, 0, width, height);
        this.gradientBackground.endFill();
        this.addChild(this.gradientBackground);

        const imageTexture = Texture.from('Popup/Text/es_chance');
        this.image = new Sprite(imageTexture);
        this.image.anchor.set(0.5);
        this.image.x = width / 2;
        this.image.y = height / 2;
        this.addChild(this.image);

        this.visible = false;
    }

    public updateImage(image: string) {
        this.removeChild(this.image);
        const imageTexture = Texture.from(image);
        this.image = new Sprite(imageTexture);
        this.image.anchor.set(0.5);
        this.image.x = 1920 / 2;
        this.image.y = 1080 / 2;
        this.addChild(this.image);
    }

    public async show() {
        /** Show Gradient Background **/
        this.image.scale.x = 0;
        this.image.scale.y = 0;
        this.visible = true;

        const imageTimeline = gsap.timeline();

        await imageTimeline
            .to(this.image.scale, {
                duration: REEL_SPEED * 5,
                x: 1,
                y: 1,
                ease: 'back.out(1.7)',
            })
            .to(this.image, {
                duration: REEL_SPEED * 5,
                ease: 'none',
                onComplete: () => {
                    this.image.scale.x = 0;
                    this.image.scale.y = 0;
                },
            });
    }

    public async hide() {
        this.image.visible = true;
        this.visible = false;
    }

    public showBackground() {
        this.visible = true;
        this.image.visible = false;
    }
}

/** Animation Sprite PopUp */
export class AnimationPopUp extends Container {
    /**Animation Sprite */
    public animation: AnimatedSprite;

    constructor() {
        super();

        /** Add Win Line Animation as default */
        let textureArray = [];
        for (let i = 0; i < 13; i++) {
            let texture = Texture.from('Popup/Winline/' + (i + 1));
            textureArray.push(texture);
        }
        this.animation = new AnimatedSprite(textureArray);
        this.addChild(this.animation);
        this.animation.animationSpeed = 0.5;
        this.animation.loop = false;
        this.animation.visible = false;
    }

    public update(texture: string[]) {
        if (this.animation) this.removeChild(this.animation);

        let textureArray = [];
        for (let i = 0; i < texture.length; i++) {
            let frameTexture = Texture.from(texture[i]);
            textureArray.push(frameTexture);
        }
        this.animation = new AnimatedSprite(textureArray);
        this.addChild(this.animation);
        this.animation.animationSpeed = 0.25;
        this.animation.loop = false;
    }

    public show(repeatNumber?: number) {
        let countValue = 0;
        let repeatNumberValue = repeatNumber ? repeatNumber : 1;
        this.animation.visible = true;
        this.animation.play();
        this.animation.onComplete = () => {
            countValue++;
            if (countValue < repeatNumberValue) {
                this.animation.gotoAndPlay(0);
            } else {
                this.hide();
            }
        };
    }

    public hide() {
        this.animation.visible = false;
    }
}

/** Error Message PopUp */
export class ErrorMessagePopUp extends Container {
    /**ErrorBox Background*/
    private boxBackgroundInfo: Sprite;

    /**The Prefix Error Label */
    private errorLabelPrefix: Label;

    /**The Reason Error Label */
    private errorLabelReason: Label;

    /**The Close Button */
    private okButton: ImageButton;

    constructor() {
        super();

        /**Add Background */
        let boxBackgroundInfoTexture = Texture.from('Popup/ErrorBox/auto_menu');
        this.boxBackgroundInfo = new Sprite(boxBackgroundInfoTexture);
        this.boxBackgroundInfo.scale.x = 0.6;
        this.boxBackgroundInfo.scale.y = 0.4;
        this.addChild(this.boxBackgroundInfo);

        /**Add Prefix Label */
        this.errorLabelPrefix = new Label('', {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '25px',
        });
        this.errorLabelPrefix.anchor.set(0.5);
        this.addChild(this.errorLabelPrefix);

        /**Add Reason Label */
        this.errorLabelReason = new Label('', {
            fill: '#ffffff',
            fontFamily: 'Roboto',
            fontSize: '25px',
        });
        this.errorLabelReason.anchor.set(0.5);
        this.addChild(this.errorLabelReason);

        /**Add Ok Button */
        this.okButton = new ImageButton({
            image: 'Popup/ErrorBox/base_button',
            label: 'OK',
            textStyle: {
                fill: '#ffffff',
                fontFamily: 'Roboto',
                fontSize: '35px',
            },
        });
        this.okButton.scale = 0.5;
        this.okButton.x = this.boxBackgroundInfo.width / 2 - this.okButton.width / 2;
        this.okButton.y = this.boxBackgroundInfo.height - this.okButton.height - 10;
        this.addChild(this.okButton);

        this.visible = false;

        /**Event OK BUtton Click */
        this.okButton.on('pointertap', this.hide.bind(this));
    }

    /** Resize the popup, fired whenever window size changes */
    public resize(width: number, height: number) {
        if (width > height || gameState.currentState.isDesktop) {
        } else {
        }
    }

    /**Error Box Show*/
    public async show(errorMessage: string) {
        const [prefix, reason] = errorMessage.split(':');

        this.errorLabelPrefix.updateLabel(prefix);
        if (reason) {
            this.errorLabelPrefix.updateLabel(prefix);
            this.errorLabelReason.updateLabel(reason);
            this.errorLabelPrefix.x = this.boxBackgroundInfo.width / 2;
            this.errorLabelPrefix.y =
                this.boxBackgroundInfo.height / 2 - this.okButton.height / 2 - this.errorLabelPrefix.height;
            this.errorLabelReason.x = this.boxBackgroundInfo.width / 2;
            this.errorLabelReason.y =
                this.boxBackgroundInfo.height / 2 - this.okButton.height / 2 + this.errorLabelPrefix.height;
        } else {
            this.errorLabelPrefix.updateLabel(prefix);
            this.errorLabelReason.updateLabel('');
            this.errorLabelPrefix.x = this.boxBackgroundInfo.width / 2;
            this.errorLabelPrefix.y = this.boxBackgroundInfo.height / 2 - this.okButton.height / 2;
        }

        this.visible = true;
    }

    public hideOKButton() {
        this.okButton.visible = false;
    }

    /**Error Box hide*/
    public async hide() {
        // sfx.play('game/Audio/ui_click.mp3');
        this.visible = false;
    }
}
