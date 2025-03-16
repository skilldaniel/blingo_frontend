import { Container, Graphics, Sprite } from 'pixi.js';

import { Label } from './Label';

import { gameState } from '../../utils/gameState';

export class ProgressBar extends Container {
    /** ProgressBar */
    private progressBar: Sprite;
    /** Progress Label */
    private progressLabel: Label;
    /** Progress Colored Label */
    private progressColoredLabel: Label;
    /** Progress Mask*/
    private progressMask: Graphics;

    constructor() {
        super();

        /** Add Progress Bar */
        this.progressBar = Sprite.from('preload/Extra/loading.png');
        this.addChild(this.progressBar);

        /* *Add Progress Label */
        const labelStyle = {
            fill: '#ffffff',
            fontFamily: 'Gang',
            fontSize: '35px',
        };
        this.progressLabel = new Label('LOADING...', labelStyle);
        this.addChild(this.progressLabel);

        /** Add Progress Colored Label */
        const coloredLabelStyle = { ...labelStyle, fill: '#fb0058', stroke: '#fb0058', strokeThickness: 1 };
        this.progressColoredLabel = new Label('LOADING...', coloredLabelStyle);
        this.addChild(this.progressColoredLabel);

        /** Add Progress Mask */
        this.progressMask = new Graphics();
        this.progressMask.beginFill(0xfb0058);
        this.progressMask.drawRect(
            this.progressBar.width / 2 - this.progressLabel.width / 2,
            this.progressBar.height / 2 - this.progressLabel.height / 2,
            0,
            this.progressLabel.height,
        );
        this.progressMask.endFill();
        this.addChild(this.progressMask);

        this.progressColoredLabel.mask = this.progressMask;
        this.updateProgress(100);
    }

    /** Update Progress Status */
    public updateProgress(progressStatus: number) {
        this.progressMask.clear();
        this.progressMask.beginFill(0xfb0058);
        this.progressMask.drawRect(
            this.progressBar.width / 2 - this.progressLabel.width / 2,
            this.progressBar.height / 2 - this.progressLabel.height / 2,
            this.progressLabel.width * progressStatus,
            this.progressLabel.height,
        );
        this.progressMask.endFill();
    }

    /** Update Label */
    public updateStartLabel() {
        this.progressLabel.text = 'CLICK TO START';
        this.progressColoredLabel.text = 'CLICK TO START';
        this.updateProgress(100);
        this.progressLabel.x = this.progressBar.width / 2;
        this.progressLabel.y = this.progressBar.height / 2;
        this.progressColoredLabel.x = this.progressBar.width / 2;
        this.progressColoredLabel.y = this.progressBar.height / 2;
        this.progressLabel.visible = false;
    }

    public resize(width: number, height: number) {
        if (width > height || gameState.currentState.isDesktop) {
            this.progressLabel.x = this.progressBar.width / 2;
            this.progressLabel.y = this.progressBar.height / 2;
            this.progressColoredLabel.x = this.progressBar.width / 2;
            this.progressColoredLabel.y = this.progressBar.height / 2;

            this.visible = true;
        } else {
            this.visible = false;
        }
    }
}
