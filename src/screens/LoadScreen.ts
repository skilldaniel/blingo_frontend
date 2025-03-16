import { Container } from 'pixi.js';
import gsap from 'gsap';

import { GameScreen } from './GameScreen';

import { Background } from '../ui/LoadScreen/Background';
import { ProgressBar } from '../ui/Common/ProgressBar';

import { navigation } from '../utils/navigation';
import { getAllBundles, loadBundles } from '../utils/assets';
import { gameState } from '../utils/gameState';

import { RotateAlert } from '../ui/Common/RotateAlert';

/** Screen shown while loading assets */
export class LoadScreen extends Container {
    /** Assets bundles required by this screen */
    public static assetBundles = ['preload'];

    /** LoadScreen UI Component */

    /** Rotate Label */
    public rotateAlert: RotateAlert;

    /** Background for Load Screen*/
    public background: Background;

    /** The Custom Progress Bar */
    public progressBar: ProgressBar;

    constructor() {
        super();

        // Set the alpha with 0 for fade in animation
        this.alpha = 0;

        /** Add Background for Load Screen */
        this.background = new Background();
        this.addChild(this.background);

        /**Add Progress Bar in Load Screen */
        this.progressBar = new ProgressBar();
        this.addChild(this.progressBar);

        /** Add Rotate Alert */
        this.rotateAlert = new RotateAlert();
        this.addChild(this.rotateAlert);
    }

    // Fired when the assets loding is in progress, update the progressbar
    private onProgress = (progress: number) => {
        this.progressBar.updateProgress(progress);
    };

    /** Show screen with animations */
    public async show() {
        const loadingElement = document.getElementsByClassName('loader');
        // Loop through all elements and cast them to HTMLElement
        for (let i = 0; i < loadingElement.length; i++) {
            const element = loadingElement[i] as HTMLElement; // Cast to HTMLElement
            element.style.zIndex = '0'; // Make unvisible
        }

        gsap.killTweensOf(this);
        await gsap.to(this, {
            alpha: 1,
            duration: 1,
            ease: 'linear',
        });
        // Get all bundles from the manifest
        const bundles = getAllBundles();
        // Load all bundles
        await loadBundles(bundles, this.onProgress);
        // And show the main screen
        navigation.showScreen(GameScreen);
    }

    /** Hide screen with animations */
    public async hide() {
        // gsap.killTweensOf(this);
        // await gsap.to([this.rotateLabel, this.background.logo], {
        //     alpha: 0,
        //     duration: 1,
        //     ease: 'linear',
        // });
    }

    /** Resize the screen, fired whenever window size changes  */
    public resize(width: number, height: number) {
        this.rotateAlert.resize(width, height);
        this.background.resize(width, height);
        this.progressBar.resize(width, height);

        this.progressBar.x = width / 2 - this.progressBar.width / 2;
        this.progressBar.y = height / 2 + 433;

        if (width > height || gameState.currentState.isDesktop) {
            this.rotateAlert.alpha = 0;
        } else {
            this.rotateAlert.alpha = 1;
            this.rotateAlert.zIndex = 3;
        }
    }
}
