import { BlurFilter, Container, Sprite, Texture } from 'pixi.js';
import { gsap } from 'gsap';

import { GameSpinSymbol } from './GameSpinSymbol';
import { gameState } from '../../../utils/gameState';
import { navigation } from '../../../utils/navigation';
import { REEL_SPEED } from '../../../config';
import { sfx } from '../../../utils/audio';
import { getLocaleStrings } from '../../../utils/helpers';

export class GameSpinReel extends Container {
    /** Background */
    public background: Sprite;

    /** Matched Symbol */
    public matchedSymbol: GameSpinSymbol | undefined;

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

    constructor(reelId: number) {
        super();

        this.repeatNumber = 0;
        this.loopNumber = 0;

        /** Add Background */
        const backgroundTexture = Texture.from('GameTable/Common/cell');
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

        this.initialize();
    }

    /** Add random Symbol for Spin */
    public addNewRandomSymbol() {
        const random = Math.floor((Math.random() * 100) % 60);
        const gameSpinSymbol = new GameSpinSymbol();
        gameSpinSymbol.updateSpinSymbol(random, 'number');
        gameSpinSymbol.x = 0;
        gameSpinSymbol.y = 0;

        const blurFilter = new BlurFilter();
        blurFilter.blur = 15;
        gameSpinSymbol.filters = [blurFilter];

        this.isNewReel ? this.newReel.addChild(gameSpinSymbol) : this.reel.addChild(gameSpinSymbol);
    }

    /** Move New Reel and reel */
    public move() {
        gsap.to(!this.isNewReel ? this.reel : this.newReel, {
            y: 0,
            duration: REEL_SPEED * 0.5,
            ease: 'none',
        });
        gsap.to(this.isNewReel ? this.reel : this.newReel, {
            y: 140,
            duration: REEL_SPEED * 0.5,
            ease: 'none',
            onComplete: () => {
                this.dolastAction();
            },
        });
    }

    /** Spin Last Action */
    public async dolastAction() {
        if (!gameState.currentState.isServerDataRecieved[this.reelId]) {
            this.isNewReel = !this.isNewReel;
            this.generateNextSymbols();
        } else {
            if (this.reelId < 4) {
                setTimeout(() => {
                    gameState.currentState.isServerDataRecieved[this.reelId + 1] = true;
                }, 150);
            }
            if (this.isNewReel) {
                this.reel.removeChildren();
                this.reel.y = -140;
                this.newReel.y = 0;
            } else {
                this.newReel.removeChildren();
                this.newReel.y = -140;
                this.reel.y = 0;
            }

            for (let i = -1; i < 1; i++) {
                const symbol = new GameSpinSymbol();
                if (i === -1) {
                    symbol.updateSpinSymbol(Math.floor((Math.random() * 100) % 60), 'number');
                } else {
                    const spinValue = gameState.currentState.spinPattern[this.reelId];
                    if (
                        spinValue == 'FS' ||
                        spinValue == 'PG' ||
                        spinValue == 'D' ||
                        spinValue == 'J' ||
                        spinValue == 'SJ' ||
                        spinValue == 'RJ'
                    ) {
                        if (spinValue == 'D') {
                            symbol.updateSpinSymbol(spinValue, 'image');
                        } else {
                            symbol.updateSpinSymbol(spinValue, 'animation');
                        }
                    } else {
                        symbol.updateSpinSymbol(Number(spinValue), 'number');
                    }
                }
                symbol.x = 0;
                symbol.y = i * 140;
                this.isNewReel ? this.reel.addChild(symbol) : this.newReel.addChild(symbol);
            }
            gsap.to(this.isNewReel ? this.reel : this.newReel, {
                y: 0,
                duration: REEL_SPEED * 0.75,
                ease: 'none ',
            });
            gsap.to(this.isNewReel ? this.newReel : this.reel, {
                y: 140,
                duration: REEL_SPEED * 0.75,
                ease: 'none ',
                onComplete: () => {
                    /**Initilalize */
                    this.reel.removeChildren();
                    this.newReel.removeChildren();
                    this.reel.y = 0;
                    this.newReel.y = -140;
                    this.isNewReel = true;

                    const spinValue = gameState.currentState.spinPattern[this.reelId];
                    this.reel.removeChildren();
                    const gameSpinSymbol = new GameSpinSymbol();
                    if (
                        spinValue == 'FS' ||
                        spinValue == 'PG' ||
                        spinValue == 'D' ||
                        spinValue == 'J' ||
                        spinValue == 'SJ' ||
                        spinValue == 'RJ'
                    ) {
                        if (spinValue == 'D') {
                            gameSpinSymbol.updateSpinSymbol(spinValue, 'image');
                        } else {
                            gameSpinSymbol.updateSpinSymbol(spinValue, 'animation');

                            if (spinValue == 'J') {
                                sfx.play('game/Audio/SymbolWild.mp3');
                            }
                            if (spinValue == 'SJ') {
                                sfx.play('game/Audio/SymbolWild_V2.mp3');
                            }

                            const purpleGemIndexes = gameState.currentState.purpleGemIndexes;
                            if (purpleGemIndexes.includes(this.reelId) && purpleGemIndexes.length >= 3) {
                                setTimeout(
                                    () => {
                                        gameSpinSymbol.updatePurpleState();
                                    },
                                    purpleGemIndexes.findIndex((index) => index === this.reelId) * 500,
                                );
                            }
                        }
                    } else {
                        gameSpinSymbol.updateSpinSymbol(Number(spinValue), 'number');
                        if (gameState.currentState.matchedPattern.some((entry) => entry.number === Number(spinValue))) {
                            gameSpinSymbol.updateMatchedText();
                        }
                        navigation?.currentScreen?.gate?.('updateMatchedSingleSymbolTable', Number(spinValue));
                        navigation?.currentScreen?.gate?.('updateStake');
                    }
                    gameSpinSymbol.x = 0;
                    gameSpinSymbol.y = 0;
                    this.matchedSymbol = gameSpinSymbol;
                    this.reel.addChild(this.matchedSymbol);

                    sfx.play('game/Audio/ReelStop_V' + ((this.reelId % 3) + 1) + '.mp3');
                    this.loopNumber++;
                    if (this.reelId === 4) {
                        sfx.stop('game/Audio/ReelSpinLoop.mp3');
                        /** Remove Mask of Game Spin Reel */
                        navigation?.currentScreen?.gate?.('removeGameSpinMask');
                        // console.log("gameState.currentState.spinType",gameState.currentState.spinType, gameState.currentState.prevAction, gameState.currentState.action);
                        if (
                            gameState.currentState.prevAction === 'SPIN' ||
                            gameState.currentState.prevAction === 'NONE'
                        ) {
                            if (gameState.currentState.spinType === 'PURCHASE_SPIN') {
                                navigation?.currentScreen?.gate?.('updateSpinButtonType', {
                                    type: false,
                                    // value: gameState.currentState.spinPrice,
                                });
                            }

                            let delayTime = 0;

                            /** When Purple Gem exist*/
                            if (gameState.currentState.purpleGemIndexes.length >= 3) {
                                navigation?.currentScreen?.gate?.('showPurpleWinFont');
                                delayTime += 2000;
                                /** Show Matched Symbol Animation */
                                if (gameState.currentState.matchedPattern.length > 0) {
                                    setTimeout(() => {
                                        navigation?.currentScreen?.gate?.('updateMatchedTable');
                                    }, delayTime);
                                    delayTime += gameState.currentState.matchDelayTime;
                                }
                            } else {
                                /** Purple Gem Don't Exist */
                                /** Show Matched Symbol Animation */
                                if (gameState.currentState.matchedPattern.length > 0) {
                                    navigation?.currentScreen?.gate?.('updateMatchedTable');
                                    delayTime += gameState.currentState.matchDelayTime;
                                }
                            }

                            /** Action CHOOSE_CELL */
                            if (gameState.currentState.action === 'CHOOSE_CELL') {
                                /** Update Game Bottom Description */
                                navigation?.currentScreen?.gate?.(
                                    'updateGameBottomDescription',
                                    getLocaleStrings().select_number,
                                );
                                setTimeout(async () => {
                                    if (gameState.currentState.choosedPattern.length > 0) {
                                        navigation?.currentScreen?.gate?.('updateChoosedTable');
                                    } else {
                                        if (gameState.currentState.spinType === 'STANDARD_SPIN') {
                                            if (gameState.currentState.spinNumber >= 1)
                                                navigation?.currentScreen?.gate?.('gameSpinSlotSpin');
                                            navigation?.currentScreen?.gate?.('callAPI', { type: 2 });
                                        }
                                        if (gameState.currentState.spinType === 'PURCHASE_SPIN') {
                                            navigation?.currentScreen?.gate?.('updateSpinButtonType', {
                                                type: false,
                                                value: gameState.currentState.spinPrice,
                                            });
                                            navigation?.currentScreen?.gate?.('showStopButton');
                                        }
                                        if (gameState.currentState.spinType === 'COMPLETE') {
                                            navigation?.currentScreen?.gate?.(
                                                'setDataCollect',
                                                gameState.currentState.response,
                                            );
                                        }
                                    }
                                }, delayTime);
                            }
                            /** Action SPIN */
                            if (gameState.currentState.action === 'SPIN' || gameState.currentState.action === 'NONE') {
                                /** Update Game Bottom Description */
                                navigation?.currentScreen?.gate?.('updateGameBottomDescription', '');
                                setTimeout(async () => {                                    
                                    if (gameState.currentState.spinType === 'STANDARD_SPIN') {
                                        if (gameState.currentState.spinNumber >= 1)
                                            navigation?.currentScreen?.gate?.('gameSpinSlotSpin');
                                        navigation?.currentScreen?.gate?.('callAPI', { type: 2 });
                                    }
                                    if (gameState.currentState.spinType === 'PURCHASE_SPIN') {
                                        navigation?.currentScreen?.gate?.('updateSpinButtonType', {
                                            type: false,
                                            value: gameState.currentState.spinPrice,
                                        });
                                        navigation?.currentScreen?.gate?.('showStopButton');
                                    }
                                    if (gameState.currentState.spinType === 'COMPLETE') {
                                        navigation?.currentScreen?.gate?.(
                                            'setDataCollect',
                                            gameState.currentState.response,
                                        );
                                    }
                                }, delayTime);
                            }
                        }

                        /** This case performance in setDataSpin */
                        if (gameState.currentState.prevAction === 'CHOOSE_CELL') {
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
            this.newReel.y = -140;
        } else {
            this.reel.removeChildren();
            this.reel.y = -140;
        }

        /**Generate new Ramdom Symbols */
        this.addNewRandomSymbol();
        this.move();
    }

    /** Start Button Click Event */
    public spin() {
        this.addNewRandomSymbol();
        this.newReel.y = -140;
        gsap.to(this.newReel, {
            y: 0,
            duration: REEL_SPEED * 0.75 * 2,
            ease: 'back.in(1)',
        });
        gsap.to(this.reel, {
            y: 140,
            duration: REEL_SPEED * 0.75 * 2,
            ease: 'back.in(1)',
            onComplete: () => {
                this.isNewReel = !this.isNewReel;
                this.generateNextSymbols();
            },
        });
    }

    /** Initialize */
    public initialize() {
        this.reel.removeChildren();
        const gameSpinSymbol = new GameSpinSymbol();
        gameSpinSymbol.x = 0;
        gameSpinSymbol.y = 0;
        this.reel.addChild(gameSpinSymbol);
    }

    public update() {
        if (this.matchedSymbol) {
            this.matchedSymbol.update();
        }
    }
}
