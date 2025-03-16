import { AnimatedSprite, BitmapText, Sprite, Texture } from 'pixi.js';
import { FancyButton } from '@pixi/ui';
import { gsap } from 'gsap/gsap-core';
import { REEL_SPEED } from '../../../config';

/** Game Spin Symbol */
export class GameSpinSymbol extends FancyButton {
    /** Background for Game Table Symbol */
    public gameSpinSymbolBackground: Sprite;

    /** Background for Game Matched */
    public gameSpinSymbolMatchedBackground: Sprite;

    /** Yellow Star for Game Spin */
    public gameSpinSymbolMatchedEffect: Sprite;
    public gameSpinSymbolDoubleMatchedEffect: Sprite;

    /** Green Star for Game Spin */
    public gameSpinSymbolChoosedEffect: Sprite;
    public gameSpinSymbolDoubleChoosedEffect: Sprite;

    /** Win State Symbol */
    public gameSpinAnimation: AnimatedSprite;

    /** Text for Game Table Symbol */
    public gameSpinSymbol: any;

    /** Random Speed */
    public randomSpeed: number;

    constructor() {
        super();

        this.randomSpeed = Math.random() * 200;

        /** Add Symbol Background Image */
        const gameSpinSymbolBackgroundTexture = Texture.from('GameTable/Common/cell');
        this.gameSpinSymbolBackground = new Sprite(gameSpinSymbolBackgroundTexture);
        this.gameSpinSymbolBackground.anchor.set(0.5);
        this.addChild(this.gameSpinSymbolBackground);
        this.gameSpinSymbolBackground.x = this.width / 2;
        this.gameSpinSymbolBackground.y = this.height / 2;
        this.gameSpinSymbolBackground.alpha = 0;

        /** Add Symbol Matched Bakcground Image */
        const gameSpinSymbolMatchedBackgroundTexture = Texture.from('GameTable/Common/red_cell');
        this.gameSpinSymbolMatchedBackground = new Sprite(gameSpinSymbolMatchedBackgroundTexture);
        this.gameSpinSymbolMatchedBackground.anchor.set(0.5);
        this.addChild(this.gameSpinSymbolMatchedBackground);
        this.gameSpinSymbolMatchedBackground.x = this.gameSpinSymbolBackground.width / 2;
        this.gameSpinSymbolMatchedBackground.y = this.gameSpinSymbolBackground.height / 2;
        this.gameSpinSymbolMatchedBackground.visible = false;

        /** Yellow Star */
        const gameSpinSymbolMatchedEffectTexture = Texture.from('GameTable/Common/yellow_star');
        this.gameSpinSymbolMatchedEffect = new Sprite(gameSpinSymbolMatchedEffectTexture);
        this.gameSpinSymbolMatchedEffect.anchor.set(0.5);
        this.gameSpinSymbolMatchedEffect.alpha = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.gameSpinSymbolMatchedEffect.scale = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.addChild(this.gameSpinSymbolMatchedEffect);
        this.gameSpinSymbolMatchedEffect.x = this.gameSpinSymbolBackground.width / 2;
        this.gameSpinSymbolMatchedEffect.y = this.gameSpinSymbolBackground.height / 2;
        this.gameSpinSymbolMatchedEffect.visible = false;

        this.gameSpinSymbolDoubleMatchedEffect = new Sprite(gameSpinSymbolMatchedEffectTexture);
        this.gameSpinSymbolDoubleMatchedEffect.anchor.set(0.5);
        this.gameSpinSymbolDoubleMatchedEffect.alpha = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.gameSpinSymbolDoubleMatchedEffect.scale = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.addChild(this.gameSpinSymbolDoubleMatchedEffect);
        this.gameSpinSymbolDoubleMatchedEffect.x = this.gameSpinSymbolBackground.width / 2;
        this.gameSpinSymbolDoubleMatchedEffect.y = this.gameSpinSymbolBackground.height / 2;
        this.gameSpinSymbolDoubleMatchedEffect.visible = false;

        /** Green Star */
        const gameSpinSymbolChoosedEffectTexture = Texture.from('GameTable/Common/green_star');
        this.gameSpinSymbolChoosedEffect = new Sprite(gameSpinSymbolChoosedEffectTexture);
        this.gameSpinSymbolChoosedEffect.anchor.set(0.5);
        this.gameSpinSymbolChoosedEffect.alpha = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.gameSpinSymbolChoosedEffect.scale = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.addChild(this.gameSpinSymbolChoosedEffect);
        this.gameSpinSymbolChoosedEffect.x = this.gameSpinSymbolBackground.width / 2;
        this.gameSpinSymbolChoosedEffect.y = this.gameSpinSymbolBackground.height / 2;
        this.gameSpinSymbolChoosedEffect.visible = false;

        this.gameSpinSymbolDoubleChoosedEffect = new Sprite(gameSpinSymbolChoosedEffectTexture);
        this.gameSpinSymbolDoubleChoosedEffect.anchor.set(0.5);
        this.gameSpinSymbolDoubleChoosedEffect.alpha = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.gameSpinSymbolDoubleChoosedEffect.scale = 0.8 + ((Math.random() * 10) % 3) / 10;
        this.addChild(this.gameSpinSymbolDoubleChoosedEffect);
        this.gameSpinSymbolDoubleChoosedEffect.x = this.gameSpinSymbolBackground.width / 2;
        this.gameSpinSymbolDoubleChoosedEffect.y = this.gameSpinSymbolBackground.height / 2;
        this.gameSpinSymbolDoubleChoosedEffect.visible = false;

        /** Add Animation */
        let alienImages = new Array(16);
        let textureArray = [];
        for (let i = 0; i < 16; i++) {
            alienImages[i] = 'GameTable/Table/dragon_appear/appear_' + (i + 1);
            let texture = Texture.from(alienImages[i]);
            textureArray.push(texture);
        }
        this.gameSpinAnimation = new AnimatedSprite(textureArray);
        this.gameSpinAnimation.zIndex = 4;
        this.gameSpinAnimation.x =
            this.gameSpinSymbolMatchedBackground.width / 2 - this.gameSpinAnimation.width / 2 + 4;
        this.gameSpinAnimation.y = this.gameSpinSymbolBackground.height / 2 - this.gameSpinAnimation.height / 2;
        this.addChild(this.gameSpinAnimation);
        this.gameSpinAnimation.animationSpeed = 0.4;
        this.gameSpinAnimation.loop = false;
        this.gameSpinAnimation.visible = false;
    }

    /** Update Symbol of Game Spin Symbol */
    public updateSpinSymbol(data: any, type: string) {
        /** When number*/
        if (type == 'number') {
            /** Remove gameSymbolLabel */
            this.removeChild(this.gameSpinSymbol);
            /** Add Symbol Label */
            this.gameSpinSymbol = data;
            this.gameSpinSymbol = new BitmapText({
                text: data,
                style: {
                    fontFamily: 'Dragon Gold',
                    fontSize: 90,
                    align: 'center',
                },
            });
            this.gameSpinSymbol.anchor.set(0.5);
            this.gameSpinSymbol.x = this.width / 2;
            this.gameSpinSymbol.y = this.height / 2;
            this.addChild(this.gameSpinSymbol);
        }
        /** When Sprite*/
        if (type == 'image') {
            const gameSpinSymbolTexture = Texture.from('GameTable/Spin/' + data);
            this.gameSpinSymbol = new Sprite(gameSpinSymbolTexture);
            this.addChild(this.gameSpinSymbol);
            this.gameSpinSymbol.x = this.gameSpinSymbolBackground.width / 2 - this.gameSpinSymbol.width / 2;
            this.gameSpinSymbol.y = this.gameSpinSymbolBackground.height / 2 - this.gameSpinSymbol.height / 2;
        }
        /** When Animation Sprite*/
        if (type == 'animation') {
            if (data !== 'FS' && data !== 'PG') {
                this.gameSpinSymbolChoosedEffect.visible = true;
                this.gameSpinSymbolDoubleChoosedEffect.visible = true;
                this.gameSpinSymbolMatchedEffect.visible = false;
                this.gameSpinSymbolDoubleMatchedEffect.visible = false;
            }

            let alienImages = new Array(16);
            let textureArray = [];
            for (let i = 0; i < 16; i++) {
                alienImages[i] = 'GameTable/Spin/' + data + '/' + data + '_' + (i + 1);
                let texture = Texture.from(alienImages[i]);
                textureArray.push(texture);
            }

            this.gameSpinSymbol = new AnimatedSprite(textureArray);
            this.addChild(this.gameSpinSymbol);
            this.gameSpinSymbol.x = this.gameSpinSymbolBackground.width / 2 - this.gameSpinSymbol.width / 2;
            this.gameSpinSymbol.y = this.gameSpinSymbolBackground.height / 2 - this.gameSpinSymbol.height / 2;
            this.gameSpinSymbol.animationSpeed = 0.4;
            this.gameSpinSymbol.loop = true;
            this.gameSpinSymbol.play();
        }
    }

    public updateMatchedText() {
        if (this.gameSpinSymbol instanceof BitmapText) {
            this.gameSpinSymbol.style.fontFamily = 'Dragon Deep';

            /** Update Effect */
            this.gameSpinSymbolMatchedEffect.scale = 0;
            this.gameSpinSymbolMatchedEffect.visible = true;
            // this.gameSpinSymbolMatchedEffect.zIndex = 2;

            const effecttimeline = gsap.timeline();
            effecttimeline.to(this.gameSpinSymbolMatchedEffect.scale, {
                duration: REEL_SPEED * 2.5,
                x: 1,
                y: 1,
                ease: 'none',
            });
        }
    }

    public updateMatchedState() {
        /** Show Mathced Background */
        this.gameSpinSymbolMatchedBackground.alpha = 0;
        this.gameSpinSymbolMatchedBackground.visible = true;

        /** Update Effect */
        this.gameSpinSymbolMatchedEffect.scale = 0;
        this.gameSpinSymbolMatchedEffect.visible = true;
        this.gameSpinSymbolDoubleMatchedEffect.visible = true;
        this.gameSpinSymbolChoosedEffect.visible = false;
        this.gameSpinSymbolDoubleChoosedEffect.visible = false;

        /** Update Label */
        this.gameSpinSymbol.style.fontFamily = 'Dragon Deep';
        this.gameSpinSymbol.zIndex = 5;

        const effecttimeline = gsap.timeline();
        effecttimeline
            .to(this.gameSpinSymbolMatchedEffect.scale, {
                duration: REEL_SPEED * 2.5,
                x: 1,
                y: 1,
                ease: 'none',
                onComplete: () => {
                    /** Show Animation and Play */
                    this.gameSpinAnimation.visible = true;
                    this.gameSpinAnimation.zIndex = 3;
                    this.gameSpinAnimation.animationSpeed = 0.4;
                    this.gameSpinAnimation.gotoAndPlay(0);
                },
            })
            .to(this.gameSpinSymbol, {
                duration: REEL_SPEED * 2.5,
                alpha: 0,
                ease: 'none',
                onComplete: () => {
                    /** Hide Label */
                    this.gameSpinSymbol.visible = false;

                    /** Hide Yellow Effect */
                    this.gameSpinSymbolMatchedEffect.visible = false;
                },
            })
            .to(
                this.gameSpinSymbolMatchedBackground,
                {
                    duration: REEL_SPEED * 2.5,
                    alpha: 1,
                    ease: 'none',
                },
                '<',
            );
    }

    public updatePurpleState() {
        /** Update Effect */
        const pgTexture = Texture.from('GameTable/Common/green_star');
        const pgSprite = new Sprite(pgTexture);
        pgSprite.anchor.set(0.5);
        pgSprite.x = this.gameSpinSymbolBackground.width / 2;
        pgSprite.y = this.gameSpinSymbolBackground.height / 2;
        pgSprite.zIndex = 5;
        pgSprite.alpha = 0;
        this.addChild(pgSprite);

        const pgEffecttimeline = gsap.timeline();
        pgEffecttimeline
            .to(pgSprite, {
                duration: 0.5,
                alpha: 1,
                ease: 'none',
            })
            .to(pgSprite, {
                duration: 0.5,
                alpha: 0,
                ease: 'none',
            });
    }

    public update() {
        this.gameSpinSymbolMatchedEffect.rotation += Math.PI / (500 + this.randomSpeed);
        this.gameSpinSymbolChoosedEffect.rotation += Math.PI / (500 + this.randomSpeed);
        this.gameSpinSymbolDoubleMatchedEffect.rotation += Math.PI / (250 + this.randomSpeed);
        this.gameSpinSymbolDoubleChoosedEffect.rotation += Math.PI / (250 + this.randomSpeed);
    }
}
