import { Application } from 'pixi.js';
import { sound } from '@pixi/sound';

import { isMobile } from './utils/helpers';
import { initAssets } from './utils/assets';
import { gameState } from './utils/gameState';
import { navigation } from './utils/navigation';

import { LoadScreen } from './screens/LoadScreen';

import { DESIGN_WIDTH, DESIGN_HEIGHT } from './config';

/** The PixiJS app Application instance, shared across the project */
export const app = new Application();

/** Set up a resize function for the app */
function resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let ratio = windowWidth / windowHeight;

    let width, height;
    const designRatio = DESIGN_WIDTH / DESIGN_HEIGHT;

    /**  Calculate renderer and canvas sizes based on current dimensions */
    // Landscape mode
    if (windowWidth > windowHeight || gameState.currentState.isDesktop) {
        if (ratio > designRatio) {
            width = windowHeight * designRatio;
            0;
            height = windowHeight;
        } else {
            width = windowWidth;
            height = windowWidth / designRatio;
        }
        app.renderer.resize(DESIGN_WIDTH, DESIGN_HEIGHT);
        navigation.resize(DESIGN_WIDTH, DESIGN_HEIGHT);
        // Portrait mode
    } else {
        ratio = windowHeight / windowWidth;
        if (ratio > designRatio) {
            width = windowWidth;
            height = windowWidth * designRatio;
        } else {
            width = windowHeight / designRatio;
            height = windowHeight;
        }
        app.renderer.resize(DESIGN_HEIGHT, DESIGN_WIDTH);
        navigation.resize(DESIGN_HEIGHT, DESIGN_WIDTH);
    }

    // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
    app.renderer.canvas.style.width = `${width}px`;
    app.renderer.canvas.style.height = `${height}px`;
    window.scrollTo(0, 0);
}

/** Fire when document visibility changes - lose or regain focus */
function visibilityChange() {
    if (document.hidden) {
        sound.pauseAll();
        navigation.blur();
    } else {
        sound.resumeAll();
        navigation.focus();
    }
}

function onFullscreenChange() {
    if (!!document.fullscreenElement) {
        gameState.setGameState({
            isFullScreen: true,
        });
    } else {
        gameState.setGameState({
            isFullScreen: false,
        });
    }
    navigation?.currentScreen?.gate?.('updateFullScreenToogleButton');
}

/** Setup app and initialise assets */
async function init() {
    // Initialize app
    await app.init({
        resolution: Math.max(window.devicePixelRatio, 2),
        backgroundColor: 0x000000,
    });

    // Add pixi canvas element (app.canvas) to the document's body
    gameState.currentState.wrapper = document.createElement('div');
    gameState.currentState.wrapper.appendChild(app.canvas);
    document.body.appendChild(gameState.currentState.wrapper);

    // Whenever the window resizes, call the 'resize' function
    window.addEventListener('resize', resize);
    window.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('keydown', (e) => {
        if (e.key == 'F11') {
            if (!document.fullscreenElement) {
                gameState.setGameState({
                    isFullScreen: true,
                });
            } else {
                gameState.setGameState({
                    isFullScreen: false,
                });
            }
            navigation?.currentScreen?.gate?.('updateFullScreenState');
            e.preventDefault();
        }
    });

    gameState.setGameState({
        isDesktop: !isMobile,
    });

    // Trigger the first resize
    resize();

    // Add a visibility listener, so the app can pause sounds and screens
    document.addEventListener('visibilitychange', visibilityChange);

    window.addEventListener('blur', () => {
        sound.resumeAll();
    });

    // Setup assets bundles (see assets.ts) and start up loading everything in background
    await initAssets();

    // Show initial loading screen
    await navigation.showScreen(LoadScreen);
}

// Init everything
init();
