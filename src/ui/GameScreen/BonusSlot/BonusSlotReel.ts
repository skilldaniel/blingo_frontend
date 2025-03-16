import { Container, Sprite, Texture } from 'pixi.js';
import { gsap } from 'gsap';

import { REEL_SPEED, BONUS } from '../../../config';
import { BonusSlotSymbol } from './BonusSlotSymbol';
import { gameState } from '../../../utils/gameState';
import { navigation } from '../../../utils/navigation';

export class BonusSlotReel extends Container {
    /** Background Reel */
    public background: Sprite;

    /** Reel Symbols */
    public reel: Container;

    /** New Reel */
    public newReel: Container;

    /** is New Reel */
    public isNewReel: boolean = true;

    /** Reel Id */
    public reelId: number;

    /** Rpeated time */
    public repeatNumber: number;

    /** Loop Number */
    public loopNumber: number;

    constructor(reelId: number, reel: string[]) {
        super();

        this.repeatNumber = 0;
        this.loopNumber = 0;

        /** Set Background */
        const backgroundTexture = Texture.from('BonusSlot/reel');
        this.background = new Sprite(backgroundTexture);
        this.background.anchor.set(0.5);
        this.addChild(this.background);
        this.background.x = this.width / 2;
        this.background.y = this.height / 2;

        /**Set Reed ID */
        this.reelId = reelId;

        /**Initialize Reel*/
        this.reel = new Container();
        this.addChild(this.reel);

        /**Initialize new Reel*/
        this.newReel = new Container();
        this.addChild(this.newReel);

        this.initialize(reel);
    }

    /** Add random Symbol for Spin */
    public addNewRandomSymbol() {
        for (let i = 0; i < 3; i++) {
            const random = Math.floor((Math.random() * 10) % 6);
            const bonusSlotSymbol = new BonusSlotSymbol(BONUS[random]);
            bonusSlotSymbol.x = 0;
            bonusSlotSymbol.y = 8 + i * bonusSlotSymbol.height;
            this.isNewReel ? this.newReel.addChild(bonusSlotSymbol) : this.reel.addChild(bonusSlotSymbol);
        }
    }

    /** Move New Reel and reel */
    public move() {
        gsap.to(!this.isNewReel ? this.reel : this.newReel, {
            y: 0,
            duration: REEL_SPEED,
            ease: 'none',
        });
        gsap.to(this.isNewReel ? this.reel : this.newReel, {
            y: 571,
            duration: REEL_SPEED,
            ease: 'none',
            onComplete: () => {
                this.dolastAction();
            },
        });
    }

    /** Spin Last Action */
    public dolastAction() {
        if (this.repeatNumber < 3) {
            this.isNewReel = !this.isNewReel;
            this.generateNextSymbols();
            this.repeatNumber++;
        } else {
            this.repeatNumber = 0;
            if (this.isNewReel) {
                this.reel.removeChildren();
                this.reel.y = -571;
                this.newReel.y = 0;
            } else {
                this.newReel.removeChildren();
                this.newReel.y = -571;
                this.reel.y = 0;
            }
            for (let i = -1; i < 3; i++) {
                let reelTexutre =
                    i === -1
                        ? BONUS[Math.floor((Math.random() * 10) % 6)]
                        : gameState.currentState.slotSpins[this.loopNumber][this.reelId][i];
                const sprite = new BonusSlotSymbol(reelTexutre);
                sprite.x = 0;
                sprite.y = i * sprite.height + 8;
                this.isNewReel ? this.reel.addChild(sprite) : this.newReel.addChild(sprite);
            }
            gsap.to(this.isNewReel ? this.reel : this.newReel, {
                y: 0,
                duration: REEL_SPEED,
                ease: 'none ',
            });
            gsap.to(this.isNewReel ? this.newReel : this.reel, {
                y: 571,
                duration: REEL_SPEED,
                ease: 'none ',
                onComplete: () => {
                    /**Initilalize */
                    this.reel.removeChildren();
                    this.newReel.removeChildren();
                    this.reel.y = 0;
                    this.newReel.y = -571;
                    this.isNewReel = true;
                    this.initialize(gameState.currentState.slotSpins[this.loopNumber][this.reelId]);
                    this.loopNumber++;
                    if (
                        gameState.currentState.slotSpins[this.loopNumber - 1][this.reelId]
                            .slice(0, 3)
                            .every((symbol) => symbol === 'DRAGON')
                    ) {
                        const dragonTexture = Texture.from('BonusSlot/dragon_reel');
                        this.background.texture = dragonTexture;
                    }

                    if (this.reelId === 4) {
                        navigation?.currentScreen?.gate?.('showWinEffect', this.loopNumber - 1);
                        if (this.loopNumber < gameState.currentState.slotSpins.length) {
                            setTimeout(
                                () => {
                                    navigation?.currentScreen?.gate?.('bonusSlotSpin');
                                },
                                3000 * gameState.currentState.slotWins[this.loopNumber - 1].length,
                            );
                        } else {
                            setTimeout(
                                () => {
                                    navigation?.currentScreen?.gate?.('hideBonus');
                                    navigation?.currentScreen?.gate?.('updateBonusSlotButton', true);
                                },
                                500 + 3000 * gameState.currentState.slotWins[this.loopNumber - 1].length,
                            );
                        }
                    }
                },
            });
        }
    }

    /** Generate Next Symbol */
    public generateNextSymbols() {
        /**Remove */
        if (this.isNewReel) {
            this.newReel.removeChildren();
            this.newReel.y = -571;
        } else {
            this.reel.removeChildren();
            this.reel.y = -571;
        }

        /**Generate new Ramdom Symbols */
        this.addNewRandomSymbol();
        this.move();
    }

    /** Start Button Click Event */
    public spin() {
        let isALlWild = true;
        if (this.loopNumber == 0) {
            isALlWild = false;
        } else {
            for (let index = 0; index < 3; index++) {
                if (gameState.currentState.slotSpins[this.loopNumber - 1][this.reelId][index] !== 'DRAGON')
                    isALlWild = false;
            }
        }
        if (!isALlWild) {
            this.addNewRandomSymbol();
            this.newReel.y = -571;
            gsap.to(this.newReel, {
                y: 0,
                duration: REEL_SPEED * 2,
                ease: 'back.in(1)',
            });
            gsap.to(this.reel, {
                y: 571,
                duration: REEL_SPEED * 2,
                ease: 'back.in(1)',
                onComplete: () => {
                    this.isNewReel = !this.isNewReel;
                    this.generateNextSymbols();
                },
            });
        } else {
            for (let index = 0; index < 3; index++) {
                (this.reel.children[index] as BonusSlotSymbol).removeShowEffect();
            }
        }
    }

    /** Initialize */
    public initialize(reel: string[]) {
        this.reel.removeChildren();
        for (let index = 0; index < 3; index++) {
            const bonusSlotSymbol = new BonusSlotSymbol(reel[index]);
            bonusSlotSymbol.x = 0;
            bonusSlotSymbol.y = 8 + index * bonusSlotSymbol.height;
            bonusSlotSymbol.zIndex = index;
            this.reel.addChild(bonusSlotSymbol);
        }
    }

    /** Show Win Effect */
    public showWinEffectReel(effectData: any, reelId: number) {
        const effectSymbol = effectData.symbol;
        const effectTriggers = effectData.triggers[reelId];
        effectTriggers.map((trigger: number, index: number) => {
            if (reelId !== 4) {
                if (trigger === 1) {
                    let nextIndex = effectData.triggers[reelId + 1].findIndex((value: number) => value == 1);
                    if (nextIndex === -1) {
                        (this.reel.children[index] as BonusSlotSymbol).showEffectSymbol(effectSymbol);
                    } else {
                        (this.reel.children[index] as BonusSlotSymbol).showEffectSymbol(
                            effectSymbol,
                            nextIndex === index ? 0 : nextIndex > index ? 1 : 2,
                        );
                    }
                }
            } else {
                if (trigger === 1) {
                    (this.reel.children[index] as BonusSlotSymbol).showEffectSymbol(effectSymbol);
                }
            }
        });
    }
}
