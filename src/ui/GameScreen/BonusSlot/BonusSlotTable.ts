import { Container, Graphics, TextStyleOptions } from 'pixi.js';
import { gsap } from 'gsap/gsap-core';
import { BonusSlotReel } from './BonusSlotReel';
import { gameState } from '../../../utils/gameState';
import { Label } from '../../Common/Label';
import { REEL_SPEED, STROKE_COLORS } from '../../../config';
import { navigation } from '../../../utils/navigation';

/** Bonus Slot Table Container*/
export class BonusSlotTable extends Container {
    /** Bonus Slot Table */
    public bonusSlotTable: BonusSlotReel[];

    /** public table mask */
    constructor(tablePattern: string[][]) {
        super();

        this.bonusSlotTable = new Array(5);
        /** Add Bonus Slot */
        this.bonusSlotTable = new Array(5);
        this.bonusSlotTable = tablePattern.map((reelPattern, index) => {
            const singleBonusSlotReel = new BonusSlotReel(index, reelPattern);
            singleBonusSlotReel.x = index * (singleBonusSlotReel.width + 12);
            this.bonusSlotTable[index] = singleBonusSlotReel;
            this.addChild(this.bonusSlotTable[index]);
            return this.bonusSlotTable[index];
        });

        /** Add Mask for Bonus Slot */
        const mask = new Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, (this.bonusSlotTable[0].width + 12) * 5, this.bonusSlotTable[0].height);
        mask.endFill();
        this.mask = mask;
        this.addChild(mask);
    }

    public initialize(tablePattern: string[][]) {
        this.bonusSlotTable.map((_, index) => {
            this.removeChild(this.bonusSlotTable[index]);
        });
        this.bonusSlotTable = tablePattern.map((reelPattern, index) => {
            const singleBonusSlotReel = new BonusSlotReel(index, reelPattern);
            singleBonusSlotReel.x = index * (singleBonusSlotReel.width + 12);
            this.bonusSlotTable[index] = singleBonusSlotReel;
            this.addChild(this.bonusSlotTable[index]);
            return this.bonusSlotTable[index];
        });
    }

    /**Event when spin button click */
    public spin() {
        this.bonusSlotTable.map((single) => {
            single.spin();
        });
    }

    /** Show Win Effect */
    public showWinEffectTable(loopNumber: number) {
        for (let loopIndex = 0; loopIndex < gameState.currentState.slotWins[loopNumber].length; loopIndex++) {
            setTimeout(() => {
                const winPattern = gameState.currentState.slotWins[loopNumber][loopIndex];
                const winFont = new Label(winPattern.amount.toFixed(2));
                winFont.updateStyle({
                    fill: '#ffffff',
                    fontFamily: 'Gang',
                    fontSize: '90px',
                    lineJoin: 'round',
                    stroke: STROKE_COLORS[winPattern.symbol as keyof typeof STROKE_COLORS],
                    strokeThickness: 2,
                } as Partial<TextStyleOptions>);
                winFont.visible = false;
                this.addChild(winFont);

                if (winPattern.direction === 'left') {
                    for (let index = 0; index < 5; index++) {
                        setTimeout(() => {
                            this.bonusSlotTable[index].showWinEffectReel(winPattern, index);
                            if (
                                index < 4 &&
                                winPattern.triggers[index].includes(1) &&
                                winPattern.triggers[index + 1].includes(1)
                            ) {
                                let nowIndex = winPattern.triggers[index].findIndex((value: number) => value == 1);
                                let nextIndex = winPattern.triggers[index + 1].findIndex((value: number) => value == 1);
                                winFont.visible = true;
                                winFont.x = 225 * 0.5 + (225 + 12) * index;
                                winFont.y = 8 + ((571 - 16) / 3) * (0.5 + nowIndex);
                                const fontTimeLine = gsap.timeline();
                                fontTimeLine.to(winFont, {
                                    duration: REEL_SPEED * 2.5,
                                    x: 225 * 0.5 + (225 + 12) * (index + 1),
                                    y: 8 + ((571 - 16) / 3) * (0.5 + nextIndex),
                                    ease: 'linear',
                                });
                            }
                            if (!winPattern.triggers[index].includes(1) || index === 4) {
                                setTimeout(() => {
                                    winFont.visible = false;
                                }, 500);
                            }
                        }, 500 * index);
                    }
                } else {
                    for (let index = 4; index >= 0; index--) {
                        setTimeout(
                            () => {
                                this.bonusSlotTable[index].showWinEffectReel(winPattern, index);
                                if (
                                    index > 0 &&
                                    winPattern.triggers[index].includes(1) &&
                                    winPattern.triggers[index - 1].includes(1)
                                ) {
                                    let nowIndex = winPattern.triggers[index].findIndex((value: number) => value == 1);
                                    let prevIndex = winPattern.triggers[index - 1].findIndex(
                                        (value: number) => value == 1,
                                    );
                                    winFont.visible = true;
                                    winFont.x = 225 * 0.5 + (225 + 12) * index;
                                    winFont.y = 8 + ((571 - 16) / 3) * (0.5 + nowIndex);
                                    const fontTimeLine = gsap.timeline();
                                    fontTimeLine.to(winFont, {
                                        duration: REEL_SPEED * 2.5,
                                        x: 225 * 0.5 + (225 + 12) * (index - 1),
                                        y: 8 + ((571 - 16) / 3) * (0.5 + prevIndex),
                                        ease: 'linear',
                                    });
                                }
                                if (index === 0) {
                                    setTimeout(() => {
                                        winFont.visible = false;
                                    }, 500);
                                }
                            },
                            500 * (4 - index),
                        );
                    }
                }
                navigation?.currentScreen?.gate?.('showBonusSlotWinAmount', {
                    loop: loopNumber,
                    index: loopIndex,
                });
            }, 3000 * loopIndex);
        }
    }
}
