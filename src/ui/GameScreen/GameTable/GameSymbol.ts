import { FancyButton } from '@pixi/ui';
import { gsap } from 'gsap/gsap-core';
import { AnimatedSprite, BitmapText, Rectangle, Sprite, Texture } from 'pixi.js';
import { navigation } from '../../../utils/navigation';
import { REEL_SPEED } from '../../../config';
import { sfx } from '../../../utils/audio';

/** Game Table Symbol */
export class GameSymbol extends FancyButton {
    /** SymbolId */
    public symbolID: number;

    /** SymbolValue */
    public symbolValue: any;

    /** Check is Matched*/
    public isMatched: boolean;

    /** Check can Choose */
    public isChoosed: boolean;

    /** Background for Game Table Symbol */
    public gameSymbolBackground: Sprite;

    /** Background for Game Table Matched Symbol */
    public gameSymbolMatchedBackground: Sprite;

    /** Star for Game Table Choose */
    public gameSymbolChoosed: Sprite;
    public gameSymbolDoubleChoosed: Sprite;

    /** Star for Game Table Matched */
    public gameSymbolMatchedEffect: Sprite;
    public gameSymbolDoubleMatchedEffect: Sprite;

    /** Text for Game Table Symbol */
    public gameSymbolLabel: BitmapText;

    /** Animation for Game Table Matched */
    public gameSymbolMatchedAnimation: AnimatedSprite;

    /** Random Speed */
    public randomSpeed: number;
    public randomDoubleSpeed: number;

    constructor(symbolID: number) {
        super();

        /** Set Random Speed */
        this.randomSpeed = Math.random() * 200;
        this.randomDoubleSpeed = Math.random() * 200;

        /** Initialize Symbol ID */
        this.symbolID = symbolID;

        /** Initialize matched state */
        this.isMatched = false;

        /** Initialize choose state */
        this.isChoosed = false;

        /** Add Symbol Background Image */
        const gameSymbolBackgroundTexture = Texture.from('GameTable/Common/cell');
        this.gameSymbolBackground = new Sprite(gameSymbolBackgroundTexture);
        this.gameSymbolBackground.anchor.set(0.5);
        this.addChild(this.gameSymbolBackground);
        this.gameSymbolBackground.x = this.width / 2;
        this.gameSymbolBackground.y = this.height / 2;

        /** Add Symbol Matched Background */
        const gameSymbolMatchedBackgroundTexture = Texture.from('GameTable/Common/red_cell');
        this.gameSymbolMatchedBackground = new Sprite(gameSymbolMatchedBackgroundTexture);
        this.gameSymbolMatchedBackground.anchor.set(0.5);
        this.addChild(this.gameSymbolMatchedBackground);
        this.gameSymbolMatchedBackground.x = this.gameSymbolBackground.width / 2;
        this.gameSymbolMatchedBackground.y = this.gameSymbolBackground.height / 2;
        this.gameSymbolMatchedBackground.visible = this.isMatched;

        /** Add Symbol Choose */
        const symbolChoosedTexture = Texture.from('GameTable/Common/green_star');
        this.gameSymbolChoosed = new Sprite(symbolChoosedTexture);
        this.gameSymbolChoosed.anchor.set(0.5);
        this.gameSymbolChoosed.x = this.gameSymbolBackground.width / 2;
        this.gameSymbolChoosed.y = this.gameSymbolBackground.height / 2;
        this.gameSymbolChoosed.alpha = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.gameSymbolChoosed.scale = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.addChild(this.gameSymbolChoosed);
        this.gameSymbolChoosed.visible = this.isChoosed;

        this.gameSymbolDoubleChoosed = new Sprite(symbolChoosedTexture);
        this.gameSymbolDoubleChoosed.anchor.set(0.5);
        this.gameSymbolDoubleChoosed.x = this.gameSymbolBackground.width / 2;
        this.gameSymbolDoubleChoosed.y = this.gameSymbolBackground.height / 2;
        this.gameSymbolDoubleChoosed.alpha = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.gameSymbolDoubleChoosed.scale = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.addChild(this.gameSymbolDoubleChoosed);
        this.gameSymbolDoubleChoosed.visible = this.isChoosed;

        /** Add Star for Matched */
        const symbolMatchedTexture = Texture.from('GameTable/Common/yellow_star');
        this.gameSymbolMatchedEffect = new Sprite(symbolMatchedTexture);
        this.gameSymbolMatchedEffect.anchor.set(0.5);
        this.gameSymbolMatchedEffect.x = this.gameSymbolBackground.width / 2;
        this.gameSymbolMatchedEffect.y = this.gameSymbolBackground.height / 2;
        this.gameSymbolMatchedEffect.alpha = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.gameSymbolMatchedEffect.scale = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.addChild(this.gameSymbolMatchedEffect);
        this.gameSymbolMatchedEffect.visible = this.isMatched;

        this.gameSymbolDoubleMatchedEffect = new Sprite(symbolMatchedTexture);
        this.gameSymbolDoubleMatchedEffect.anchor.set(0.5);
        this.gameSymbolDoubleMatchedEffect.x = this.gameSymbolBackground.width / 2;
        this.gameSymbolDoubleMatchedEffect.y = this.gameSymbolBackground.height / 2;
        this.gameSymbolDoubleMatchedEffect.alpha = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.gameSymbolDoubleMatchedEffect.scale = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.addChild(this.gameSymbolDoubleMatchedEffect);
        this.gameSymbolDoubleMatchedEffect.visible = this.isMatched;

        /** Add Animation for Matched */
        let alienImages = new Array(16);
        let textureArray = [];
        for (let i = 0; i < 16; i++) {
            alienImages[i] = 'GameTable/Table/dragon_appear/appear_' + (i + 1);
            let texture = Texture.from(alienImages[i]);
            textureArray.push(texture);
        }
        this.gameSymbolMatchedAnimation = new AnimatedSprite(textureArray);
        this.addChild(this.gameSymbolMatchedAnimation);
        this.gameSymbolMatchedAnimation.x =
            this.gameSymbolBackground.width / 2 - this.gameSymbolMatchedAnimation.width / 2;
        this.gameSymbolMatchedAnimation.y =
            this.gameSymbolBackground.height / 2 - this.gameSymbolMatchedAnimation.height / 2;
        this.gameSymbolMatchedAnimation.animationSpeed = 1;
        this.gameSymbolMatchedAnimation.loop = false;
        this.gameSymbolMatchedAnimation.visible = this.isMatched;

        /** Add Label for Game Table */
        this.gameSymbolLabel = new BitmapText({
            text: '',
            style: {
                fontFamily: 'Dragon Gold',
                fontSize: 90,
                align: 'center',
            },
        });
        this.gameSymbolLabel.anchor.set(0.5);
        this.gameSymbolLabel.x = this.width / 2;
        this.gameSymbolLabel.y = this.height / 2;
        this.addChild(this.gameSymbolLabel);

        /** Event of Game Symbol */
        this.interactive = false;
        this.hitArea = new Rectangle(0, 0, this.gameSymbolBackground.width, this.gameSymbolBackground.height);

        // if (this.hitArea instanceof Rectangle) {
        //     const { x, y, width, height } = this.hitArea; // Destructure for clarity

        //     const hitAreaGraphics = new Graphics();
        //     hitAreaGraphics.beginFill(0xff0000, 0.3); // Red fill with 30% opacity
        //     hitAreaGraphics.drawRect(x, y, width, height);
        //     hitAreaGraphics.endFill();

        //     // Align visualization with the game symbol's position
        //     hitAreaGraphics.x = this.x;
        //     hitAreaGraphics.y = this.y;

        //     this.addChild(hitAreaGraphics);
        // }

        this.on('pointertap', this.setSymbolMatched.bind(this));
    }

    /** Update Symbol Text */
    public updateSymbolValue(value: any) {
        /** Remove gameSymbolLabel */
        this.symbolValue = value;
        this.gameSymbolLabel.text = value;
    }

    /** Set Choosed State When Click */
    public setSymbolMatched() {
        if (this.isChoosed) {
            sfx.play('game/Audio/SymbolClick.mp3');

            /** Remove all Choosed */
            navigation?.currentScreen?.gate?.('removeAllChoosed', this.symbolValue);

            /** Set Matched Symbol */
            this.updatedMatchedSymbol(true);
            /** Set Matched annd Call API */
            navigation?.currentScreen?.gate?.('callAPI', { type: 3, value: this.symbolValue });
        }
    }

    /** Updae Symbol when Matched before animation */
    public updateMatchedSymbolText(isMatched: boolean) {
        if (isMatched) {
            /** Update Effect Symbol */
            this.gameSymbolChoosed.visible = false;
            this.gameSymbolDoubleChoosed.visible = false;

            /** Update Background */
            this.gameSymbolMatchedBackground.alpha = 0;
            this.gameSymbolMatchedBackground.visible = true;

            /** Update Label */
            this.gameSymbolLabel.style.fontFamily = 'Dragon Deep';
        } else {
            /** Hide Red Cell Background */
            this.gameSymbolMatchedBackground.visible = false;

            /** Hide Matched Star */
            this.gameSymbolMatchedEffect.visible = false;
            this.gameSymbolDoubleMatchedEffect.visible = false;

            /** Hide Animation */
            this.gameSymbolMatchedAnimation.visible = false;

            /** Update Label Style */
            this.gameSymbolLabel.style.fontFamily = 'Dragon Gold';
        }
    }

    /** Update Symbol when Matched */
    public updatedMatchedSymbol(isMatched: boolean) {
        if (isMatched) {
            this.gameSymbolChoosed.visible = false;
            this.gameSymbolDoubleChoosed.visible = false;

            /** Update Background */
            this.gameSymbolMatchedBackground.alpha = 0;
            this.gameSymbolMatchedBackground.visible = true;

            /** Show Matched Star */
            this.gameSymbolMatchedEffect.scale = 0;
            this.gameSymbolMatchedEffect.visible = true;

            this.gameSymbolDoubleMatchedEffect.scale = 0;
            this.gameSymbolDoubleMatchedEffect.visible = true;

            /** Update Label */
            this.gameSymbolLabel.style.fontFamily = 'Dragon Deep';

            const effecttimeline = gsap.timeline();
            effecttimeline
                .to([this.gameSymbolMatchedEffect.scale, this.gameSymbolDoubleMatchedEffect], {
                    duration: 0.5,
                    x: 1,
                    y: 1,
                    ease: 'none',
                    onComplete: () => {
                        /** Show Animation and Play */
                        this.gameSymbolMatchedAnimation.visible = true;
                        this.gameSymbolMatchedAnimation.animationSpeed = 0.4;
                        this.gameSymbolMatchedAnimation.gotoAndPlay(0);
                    },
                })
                .to(this.gameSymbolLabel, {
                    duration: REEL_SPEED * 2.5,
                    alpha: 0,
                    ease: 'none',
                    onComplete: () => {
                        /** Hide Label */
                        this.gameSymbolLabel.visible = false;

                        /** Hide Yellow Effect */
                        this.gameSymbolMatchedEffect.visible = false;
                        this.gameSymbolDoubleMatchedEffect.visible = false;
                    },
                })
                .to(
                    this.gameSymbolMatchedBackground,
                    {
                        duration: REEL_SPEED * 2.5,
                        alpha: 1,
                        ease: 'none',
                    },
                    '<',
                );

            /** Set isMatched true */
            this.isMatched = true;
        } else {
            /** Hide Red Cell Background */
            this.gameSymbolMatchedBackground.visible = false;

            /** Hide Matched Star */
            this.gameSymbolMatchedEffect.visible = false;
            this.gameSymbolDoubleMatchedEffect.visible = false;

            /** Hide Animation */
            this.gameSymbolMatchedAnimation.visible = false;

            /** Update Label Style */
            this.gameSymbolLabel.visible = true;
            this.gameSymbolLabel.alpha = 1;
            this.gameSymbolLabel.style.fontFamily = 'Dragon Gold';

            /** Set isMatched false */
            this.isMatched = false;
        }
    }

    /** Set Symbol canSelectState */
    public updateChoosedSymbol(isChoosed: boolean) {
        if (!this.isMatched) {
            this.gameSymbolChoosed.visible = isChoosed;
            this.gameSymbolDoubleChoosed.visible = isChoosed;
            this.isChoosed = isChoosed;

            if (isChoosed) {
                this.gameSymbolLabel.style.fontFamily = 'Dragon Deep';
                this.interactive = true;
            } else {
                this.gameSymbolLabel.style.fontFamily = 'Dragon Gold';
                this.interactive = false;
            }
        } else {
            this.gameSymbolChoosed.visible = false;
            this.gameSymbolDoubleChoosed.visible = false;
            this.isChoosed = false;
            this.gameSymbolLabel.style.fontFamily = 'Dragon Gold';
            this.interactive = false;
        }
    }

    public update() {
        this.gameSymbolChoosed.rotation += Math.PI / (400 + this.randomSpeed);
        this.gameSymbolDoubleChoosed.rotation += Math.PI / (200 + this.randomDoubleSpeed);
        this.gameSymbolMatchedEffect.rotation += Math.PI / (400 + this.randomSpeed);
        this.gameSymbolDoubleMatchedEffect.rotation += Math.PI / (200 + this.randomDoubleSpeed);
    }
}
