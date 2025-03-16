import { Container, Sprite } from 'pixi.js';
import { gsap } from 'gsap/gsap-core';
import { gameState } from '../../utils/gameState';
import { REEL_SPEED } from '../../config';
import { sfx } from '../../utils/audio';
import { ProgressBar } from '../Common/ProgressBar';

export class DoorSymbol extends Container {
    /** Left and Right Background Image */
    public background_left: Sprite;
    public background_right: Sprite;

    /** Logo */
    public logo: Sprite;

    /** The Custom Progress Bar */
    public progressBar: ProgressBar;

    constructor() {
        super();

        /** Add Left Background */
        this.background_left = Sprite.from('preload/Background/background_left.png');
        this.background_left.anchor.set(0.5);
        this.background_left.width = 960;
        this.background_left.height = 1080;
        this.background_left.x = this.background_left.width / 2;
        this.background_left.y = this.background_left.height / 2;
        this.addChild(this.background_left);

        /** Add Right Background */
        this.background_right = Sprite.from('preload/Background/background_right.png');
        this.background_right.anchor.set(0.5);
        this.background_right.width = 960;
        this.background_right.height = 1080;
        this.background_right.x = 960 + this.background_right.width / 2;
        this.background_right.y = this.background_right.height / 2;
        this.addChild(this.background_right);

        /** Add Logo */
        this.logo = Sprite.from('preload/Extra/logo.png');
        this.logo.anchor.set(0.5);
        this.addChild(this.logo);

        /**Add Progress Bar in Load Screen */
        this.progressBar = new ProgressBar();
        this.addChild(this.progressBar);
    }

    public resize(width: number, height: number) {
        this.progressBar.resize(width, height);
        this.progressBar.x = width / 2 - this.progressBar.width / 2;
        this.progressBar.y = height / 2 + 433;

        /** Set Position Logo*/
        this.logo.x = width / 2;
        this.logo.y = height / 2 - 41;

        if (width > height || gameState.currentState.isDesktop) {
            /** Container Visible True */
        } else {
            /** Container Visible False */
        }
    }

    public showGame() {
        setTimeout(() => {
            sfx.play('game/Audio/MassiveDoorOpen.mp3');
        }, 0);
        const timeline = gsap.timeline();
        timeline
            .to([this.logo, this.progressBar], {
                duration: REEL_SPEED * 10,
                alpha: 0,
                ease: 'none',
            })
            .to(
                this.logo.scale,
                {
                    duration: REEL_SPEED * 10,
                    x: 1.2,
                    y: 1.2,
                    ease: 'none',
                },
                '<',
            )
            .to(
                [this.background_left.scale, this.background_right.scale],
                {
                    duration: REEL_SPEED * 10,
                    x: 1.2,
                    y: 1.2,
                    ease: 'none',
                },
                '<',
            )
            .to(
                this.background_left,
                {
                    duration: REEL_SPEED * 10,
                    x: -576,
                    ease: 'power1.in',
                },
                '<',
            )
            .to(
                this.background_right,
                {
                    duration: REEL_SPEED * 10,
                    x: 2496,
                    ease: 'power1.in',
                    onComplete: () => {},
                },
                '<',
            );
    }
}
