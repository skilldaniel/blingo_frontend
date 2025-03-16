import { Assets } from 'pixi.js';
import { gameState } from '../utils/gameState';
import { DEFAULT_LANGUAGE_CODE } from '../config';

/** Detect whether the device is mobile or not */
export const isMobile: boolean =
    Math.min(window.screen.width, window.screen.height) < 768 || navigator.userAgent.indexOf('Mobi') > -1;

/** Get the string based on the current language */
export const getLocaleStrings = () =>
    Assets.get(`lang/${gameState.currentState.language}.json`) ?? Assets.get(`i18n/${DEFAULT_LANGUAGE_CODE}.json`);

/** Get Win Number */
export const getWinNumber = (table: boolean[], winTable: number[][]) => {
    let reusltNumber = 0;
    for (let winTableIndex = 0; winTableIndex < winTable.length; winTableIndex++) {
        let singletable = [];
        for (let index = 0; index < winTable[winTableIndex].length; index++) {
            singletable.push(table[winTable[winTableIndex][index]]);
        }
        const isAllTrue = singletable.every((item) => item === true);
        if (isAllTrue) {
            reusltNumber++;
        }
    }
    return reusltNumber;
};

/** Get Win Lines */
export const getWinLines = (matchedPattern: any[]) => {
    let winLines: number[] = [];
    matchedPattern.map((singlePattern: any) => {
        singlePattern.pattern.map((single: number) => {
            winLines.push(single);
        });
    });
    const uniquewinLines = [...new Set(winLines)];
    return uniquewinLines;
};

/**Filter Assets by Device Status*/
export function filterAssets(assetsManifest: { bundles: any[] }, isDesktop: boolean) {
    assetsManifest.bundles.forEach((bundle: { assets: any[] }) => {
        bundle.assets.forEach((asset: { src: any[] }) => {
            asset.src = asset.src.filter((src: string | string[]) => !src.includes(isDesktop ? '@0.5x' : '@1x'));
        });
    });
    return assetsManifest;
}

/** Sperate Text by maxLetters */
export function splitByTotalLetterCount(text: string, maxLetters: number, isSpecial: boolean) {
    if (!isSpecial) {
        const words = text.split(' '); // Split the text into individual words
        const result = [];
        let currentChunk = '';

        for (const word of words) {
            // Check if adding the word would exceed the max letter count
            if ((currentChunk + word).length > maxLetters) {
                result.push(currentChunk.trim()); // Push the current chunk and start a new one
                currentChunk = word + ' ';
            } else {
                currentChunk += word + ' ';
            }
        }

        // Add the last chunk if it exists
        if (currentChunk.trim()) {
            result.push(currentChunk.trim());
        }

        return result;
    }

    const result = [];
    let currentChunk = '';

    for (let i = 0; i < text.length; i++) {
        // Add the character to the current chunk
        currentChunk += text[i];

        // Check if the length of the current chunk exceeds the max letter count
        if (currentChunk.length > maxLetters) {
            result.push(currentChunk.slice(0, -1)); // Push the chunk excluding the last character
            currentChunk = text[i]; // Start a new chunk with the current character
        }
    }

    // Add the last chunk if it exists
    if (currentChunk.trim()) {
        result.push(currentChunk);
    }

    return result;
}
