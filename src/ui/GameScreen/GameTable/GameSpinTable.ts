import { Container, Graphics, TextStyleOptions } from 'pixi.js';
import { gsap } from 'gsap/gsap-core';
import { GameSpinReel } from './GameSpinReel';
import { gameState } from '../../../utils/gameState';
import { Label } from '../../Common/Label';
import { REEL_SPEED } from '../../../config';
import { navigation } from '../../../utils/navigation';
import { sfx } from '../../../utils/audio';

/** Game Spin Table Container*/
export class GameSpinTable extends Container {
    /** Game Spin Table */
    public gameSpinTable: GameSpinReel[];

    /** Game Spin Table Mask */
    public gameSpinTableMask: Graphics | undefined;

    constructor() {
        super();

        this.gameSpinTable = new Array(5);

        this.gameSpinTable = new Array(5).fill(null).map((_, index) => {
            const singleBonusSlotReel = new GameSpinReel(index);
            singleBonusSlotReel.x = index * (singleBonusSlotReel.width + 9);
            this.gameSpinTable[index] = singleBonusSlotReel;
            this.addChild(this.gameSpinTable[index]);
            return this.gameSpinTable[index];
        });

        this.addMask();
    }

    public show() {
        new Array(5).fill(null).map((_, index) => {
            this.gameSpinTable[index].reel.alpha = 1;
            this.gameSpinTable[index].newReel.alpha = 1;
        });
    }

    public hide() {
        new Array(5).fill(null).map((_, index) => {
            this.gameSpinTable[index].reel.alpha = 0;
            this.gameSpinTable[index].newReel.alpha = 0;
        });
    }

    /** Add Table Mask */
    public addMask() {
        this.show();
        if (!this.mask) {
            this.gameSpinTableMask = new Graphics();
            this.gameSpinTableMask.beginFill(0xffffff);
            this.gameSpinTableMask.drawRect(0, 0, (this.gameSpinTable[0].width + 9) * 5, 140);
            this.gameSpinTableMask.endFill();
            this.mask = this.gameSpinTableMask;
            this.addChild(this.gameSpinTableMask);
        }
    }

    /** Remove Table Mask */
    public removeMask() {
        if (this.gameSpinTableMask) {
            // Remove the mask
            this.mask = null;
            this.removeChild(this.gameSpinTableMask);
            this.gameSpinTableMask.destroy();
        }
    }

    /**Event when spin button click */
    public spin() {
        sfx.play('game/Audio/ReelSpinLoop.mp3', { loop: true });
        navigation?.currentScreen?.gate?.('addGameSpinMask');
        gameState.setGameState({
            isServerDataRecieved: new Array(5).fill(false),
        });
        this.gameSpinTable.map((single) => {
            single.spin();
        });
    }

    /** Show Purple Win */
    public showPurpleWinFont() {
        /** Add Storke Font for Purple Win Amount */
        const purpleLabel = new Label((gameState.currentState.stake / 2).toFixed(2));
        purpleLabel.updateStyle({
            fill: '#ffffff',
            fontFamily: 'Gang',
            fontSize: '90px',
            lineJoin: 'round',
            stroke: '#2b811c',
            strokeThickness: 2,
        } as Partial<TextStyleOptions>);
        purpleLabel.x =
            (this.gameSpinTable[0].background.width + 9) * gameState.currentState.purpleGemIndexes[0] +
            this.gameSpinTable[0].background.width / 2;
        purpleLabel.y = this.gameSpinTable[0].background.height / 2;
        this.addChild(purpleLabel);

        /** Move Font */
        const purpleTimeLine = gsap.timeline();
        purpleTimeLine
            .to(purpleLabel, {
                duration: REEL_SPEED * 2.5,
                x:
                    (this.gameSpinTable[0].background.width + 9) * gameState.currentState.purpleGemIndexes[0] +
                    this.gameSpinTable[0].background.width / 2,
                ease: 'none',
            })
            .to(purpleLabel, {
                duration: REEL_SPEED * 5,
                x:
                    gameState.currentState.purpleGemIndexes[2] * (this.gameSpinTable[0].background.width + 9) +
                    this.gameSpinTable[0].background.width / 2,
                ease: 'none',
            })
            .to(purpleLabel, {
                duration: REEL_SPEED * 2.5,
                x:
                    gameState.currentState.purpleGemIndexes[2] * (this.gameSpinTable[0].background.width + 9) +
                    this.gameSpinTable[0].background.width / 2,
                ease: 'none',
                onComplete: () => {
                    this.removeChild(purpleLabel);
                },
            });
    }

    public update() {
        this.gameSpinTable.map((_, index) => {
            this.gameSpinTable[index].update();
        });
    }
}
