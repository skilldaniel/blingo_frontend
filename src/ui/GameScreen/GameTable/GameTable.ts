import { AnimatedSprite, Container, Graphics, Texture } from 'pixi.js';
import { gsap } from 'gsap/gsap-core';
import { GameSymbol } from './GameSymbol';
import { GameSpinTable } from './GameSpinTable';
import { CollectEndButton } from '../../Common/Buttons';
import { gameState } from '../../../utils/gameState';
import { REEL_SPEED } from '../../../config';
import { sfx } from '../../../utils/audio';

/** Game Table */
export class GameTable extends Container {
    /** Game Table */
    public gameTable: GameSymbol[];

    /** Game Table Win Animation */
    public gameTableWinAnimation: AnimatedSprite[] = [];

    /** Game Spin Reel */
    public gameSpinReel: GameSpinTable;

    /** Game End/Collect Button */
    public gameStopButton: CollectEndButton;

    /** Mask */
    public gameSpinTableMask: Graphics | undefined;

    /** Game Container */
    public gameContainer: Container;

    constructor() {
        super();

        /** Add Game Table */
        this.gameTable = new Array(25).fill(null).map((_, index) => {
            const singleSymbol = new GameSymbol(index);
            singleSymbol.x = (index % 5) * (singleSymbol.width + 9);
            singleSymbol.y = Math.floor(index / 5) * (singleSymbol.height + 8);
            this.addChild(singleSymbol);
            return singleSymbol;
        });

        /** Add Game Spin Reel */
        this.gameSpinReel = new GameSpinTable();
        this.gameSpinReel.x = 0;
        this.gameSpinReel.y = this.gameSpinReel.height * 5.5 - 4;
        this.addChild(this.gameSpinReel);

        /** Add Game End/Collect Button  */
        this.gameStopButton = new CollectEndButton();
        this.gameStopButton.x = this.width / 2 - this.gameStopButton.width / 2;
        this.gameStopButton.y = this.gameSpinReel.y - 3;
        this.gameStopButton.interactive = true;
        this.gameStopButton.visible = false;
        this.addChild(this.gameStopButton);

        this.gameContainer = new Container();
        this.addChild(this.gameContainer);

        this.gameSpinTableMask = new Graphics();
        this.gameSpinTableMask.beginFill(0xffffff);
        this.gameSpinTableMask.drawRect(
            0,
            0,
            (this.gameTable[0].width + 9) * 5 - 9,
            (this.gameTable[0].height + 9) * 5 - 9,
        );
        this.gameSpinTableMask.endFill();
        this.gameContainer.mask = this.gameSpinTableMask;
        this.gameContainer.addChild(this.gameSpinTableMask);
    }

    /** Show Stop Button */
    public showStopButton() {
        this.gameSpinReel.visible = false;
        this.gameStopButton.visible = true;
    }

    /** Hide Stop Button */
    public hideStopButton() {
        this.gameSpinReel.visible = true;
        this.gameStopButton.visible = false;
    }

    /** Update Game Stop Button Label  */
    public updateStopButtonState(winNumber: number) {
        this.gameStopButton.updateButtonType(winNumber > 2);
        if (winNumber > 2) this.gameStopButton.updateCollectButton(winNumber);
    }

    /** Update Table Value */
    public updateTableValue(tableValue: number[]) {
        this.gameTable.map((symbol, index) => {
            symbol.updateSymbolValue(tableValue[index]);
        });
    }

    /** Updated Matched Table Value */
    public updateMatchedTable(matchedPattern: any[]) {
        let delayTime = 0;
        matchedPattern.forEach((item) => {
            const number = item.number;
            const pattern = item.pattern;
            const index = this.gameTable.findIndex((symbol) => number === parseInt(symbol.gameSymbolLabel.text));
            if (index !== -1) {
                setTimeout(() => {
                    sfx.play('game/Audio/SymbolClick.mp3');
                    if (!this.gameTable[index].isMatched) {
                        this.gameTable[index].updatedMatchedSymbol(true);
                    }
                    this.showWinAnimation(pattern);
                }, delayTime);
                if (!this.gameTable[index].isMatched) {
                    delayTime += (pattern.length + 1) * 1000;
                } else {
                    delayTime += pattern.length * 1000;
                }
            }
        });
        gameState.setGameState({
            matchDelayTime: delayTime,
        });
    }

    public updateMatchedSingleSymbolTable(single: number) {
        this.gameTable.map((symbol, index) => {
            if (single === parseInt(symbol.gameSymbolLabel.text) && !symbol.isMatched) {
                this.gameTable[index].updateMatchedSymbolText(true);
            }
        });
    }

    /** Remove All GameTable Matched */
    public removeAllMatched() {
        this.gameTable.map((symbol) => {
            symbol.updatedMatchedSymbol(false);
        });
    }

    /** Update Choose Table Value */
    public updateChoosedTable(choosedTable: number[]) {
        this.gameTable.map((symbol, index) => {
            if (choosedTable.includes(parseInt(symbol.gameSymbolLabel.text))) {
                this.gameTable[index].updateChoosedSymbol(true);
            }
        });
    }

    /** Remove All GameTable Choosed  */
    public removeAllChoosed() {
        this.gameTable.map((symbol) => {
            symbol.updateChoosedSymbol(false);
        });
    }

    /** Show Win Animation */
    public showWinAnimation(winLines: number[]) {
        this.gameTableWinAnimation = [];
        winLines.forEach((winline, index) => {
            setTimeout(
                () => {
                    let textureArray = [];
                    for (let i = 0; i < 13; i++) {
                        let texture = Texture.from('Popup/Winline/' + (i + 1));
                        textureArray.push(texture);
                    }
                    const newWinAnimation = new AnimatedSprite(textureArray);
                    newWinAnimation.anchor.set(0.5);
                    newWinAnimation.animationSpeed = 0.9;
                    newWinAnimation.loop = true;
                    this.gameTableWinAnimation.push(newWinAnimation);
                    this.gameContainer.addChild(this.gameTableWinAnimation[index]);

                    const winAnimationTimeline = gsap.timeline();
                    if (winline >= 0 && winline <= 4) {
                        this.gameTableWinAnimation[index].scale.x = -0.5;
                        this.gameTableWinAnimation[index].scale.y = 0.5;
                        this.gameTableWinAnimation[index].rotation = 0;
                        this.gameTableWinAnimation[index].x =
                            this.gameTable[0].x - this.gameTableWinAnimation[index].width / 4;
                        this.gameTableWinAnimation[index].y =
                            this.gameTable[0].y +
                            this.gameTable[0].gameSymbolBackground.height * 0.5 +
                            (this.gameTable[0].gameSymbolBackground.height + 8) * winline +
                            this.gameTableWinAnimation[index].height * 0;
                        this.gameTableWinAnimation[index].play();
                        winAnimationTimeline
                            .to(this.gameTableWinAnimation[index], {
                                duration: REEL_SPEED * 4,
                                x:
                                    this.gameTable[4].x +
                                    this.gameTable[0].gameSymbolBackground.width +
                                    this.gameTableWinAnimation[index].width / 2,
                                ease: 'none',
                            })
                            .to(this.gameTableWinAnimation[index], {
                                duration: REEL_SPEED * 0.5,
                                ease: 'none',
                                onComplete: () => {
                                    this.removeChild(this.gameTableWinAnimation[index]);
                                },
                            });
                    }
                    if (winline >= 5 && winline <= 9) {
                        this.gameTableWinAnimation[index].scale.x = -0.5;
                        this.gameTableWinAnimation[index].scale.y = 0.5;
                        this.gameTableWinAnimation[index].rotation = 90 * (Math.PI / 180);
                        this.gameTableWinAnimation[index].x =
                            this.gameTable[0].x +
                            this.gameTable[0].gameSymbolBackground.width * 0.5 +
                            (this.gameTable[0].gameSymbolBackground.width + 9) * (winline - 5);
                        this.gameTableWinAnimation[index].y =
                            this.gameTable[0].y - this.gameTableWinAnimation[index].width / 4;

                        this.gameTableWinAnimation[index].play();
                        winAnimationTimeline
                            .to(this.gameTableWinAnimation[index], {
                                duration: REEL_SPEED * 4,
                                y:
                                    this.gameTable[20].y +
                                    this.gameTable[0].gameSymbolBackground.height +
                                    this.gameTableWinAnimation[index].width / 2,
                                ease: 'none',
                            })
                            .to(this.gameTableWinAnimation[index], {
                                duration: REEL_SPEED * 0.5,
                                ease: 'none',
                                onComplete: () => {
                                    this.removeChild(this.gameTableWinAnimation[index]);
                                },
                            });
                    }
                    if (winline === 10) {
                        this.gameTableWinAnimation[index].scale.x = -0.5;
                        this.gameTableWinAnimation[index].scale.y = 0.5;
                        this.gameTableWinAnimation[index].rotation = 45 * (Math.PI / 180);
                        this.gameTableWinAnimation[index].x =
                            this.gameTable[0].x - (this.gameTable[0].width * Math.sqrt(2)) / 2;
                        this.gameTableWinAnimation[index].y =
                            this.gameTable[0].y - (this.gameTable[0].height * Math.sqrt(2)) / 2;
                        this.gameTableWinAnimation[index].play();
                        winAnimationTimeline
                            .to(this.gameTableWinAnimation[index], {
                                duration: REEL_SPEED * 4,
                                x:
                                    this.gameTable[24].x +
                                    this.gameTable[0].gameSymbolBackground.width +
                                    this.gameTable[0].width * Math.sqrt(2),
                                y:
                                    this.gameTable[24].y +
                                    this.gameTable[0].gameSymbolBackground.height +
                                    this.gameTable[0].height * Math.sqrt(2),
                                ease: 'none',
                            })
                            .to(this.gameTableWinAnimation[index], {
                                duration: REEL_SPEED * 0.5,
                                ease: 'none',
                                onComplete: () => {
                                    this.removeChild(this.gameTableWinAnimation[index]);
                                },
                            });
                    }
                    if (winline === 11) {
                        this.gameTableWinAnimation[index].scale.x = 0.5;
                        this.gameTableWinAnimation[index].scale.y = 0.5;
                        this.gameTableWinAnimation[index].rotation = -45 * (Math.PI / 180);
                        this.gameTableWinAnimation[index].x =
                            this.gameTable[4].x +
                            this.gameTable[4].width +
                            (this.gameTable[12].gameSymbolBackground.width * Math.sqrt(2)) / 2;
                        this.gameTableWinAnimation[index].y =
                            this.gameTable[4].y - (this.gameTable[12].gameSymbolBackground.height * Math.sqrt(2)) / 2;
                        this.gameTableWinAnimation[index].play();
                        winAnimationTimeline
                            .to(this.gameTableWinAnimation[index], {
                                duration: REEL_SPEED * 4,
                                x: this.gameTable[20].x - this.gameTable[12].gameSymbolBackground.width * Math.sqrt(2),
                                y:
                                    this.gameTable[20].y +
                                    this.gameTable[12].gameSymbolBackground.height +
                                    this.gameTable[12].gameSymbolBackground.height * Math.sqrt(2),
                                ease: 'none',
                            })
                            .to(this.gameTableWinAnimation[index], {
                                duration: REEL_SPEED * 0.5,
                                ease: 'none',
                                onComplete: () => {
                                    this.removeChild(this.gameTableWinAnimation[index]);
                                },
                            });
                    }
                },
                (index + 1) * 1000,
            );
        });
    }

    public resize(width: number, height: number) {
        if (width > height || gameState.currentState.isDesktop) {
        } else {
        }
    }

    public update() {
        this.gameTable.map((_, index) => {
            this.gameTable[index].update();
        });
        this.gameSpinReel.update();
    }
}
