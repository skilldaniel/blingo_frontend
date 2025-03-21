import { DEFAULT_CURRENCY_CODE, DEFAULT_CURRENCY_VALUE, DEFAULT_LANGUAGE_CODE, STAKE_MIN, URL_PARAMS } from '../config';
import { getUrlParam } from './getUrlParams';
import { bgm, sfx } from './audio';
interface IGameState {
    /** Game State */
    token: string;
    userId: string;
    gameId: string;
    rtp: number;
    language: string;
    currency: string;
    gameState: string;
    ticketID: number;
    response: any;
    stake: number;
    balance: number;
    tablePattern: number[];
    spinPattern: string[];
    choosedPattern: number[];
    matchedPattern: any[];
    spinNumber: number;
    purchaseSpinNumber: number;
    winNumber: number;
    freeNumber: number;
    prevAction: string;
    action: string;
    spinType: string;
    spinPrice: number;
    slotSpins: string[][][];
    slotTotalWins: number[][];
    slotWins: any[];
    isServerDataRecieved: boolean[];
    purpleGemIndexes: number[];
    symbolWins: any[];
    winLines: number[];
    totalPatternWin: number;
    totalSymbolWin: number;
    totalWin: number;
    isTurbo: boolean;
    isSound: boolean;
    isMusic: boolean;
    isFullScreen: boolean;
    isDesktop: boolean;
    matchDelayTime: number;
    wrapper: any;

    isAuto: boolean;
    autoNumber: number;
    autoTotalWin: number;
    lossLimit: number;
    singleLimit: number;
    isFree: boolean;
    fsMul: number;
    counter: number;
    index: number;
    matchedTablePattern: number[][];
    matchedTruckPattern: number[];
    tumbleWin: number;
    singleWin: number;
    isNextSpin: string;
    lasMatchedReeltIndex: number;
    nextState: any;
    isQuick: boolean;
    isStop: boolean;
    ultrawayValue: number;
    isFreeSpinStart: boolean;
}

/**
 * Persistent user settings of volumes and game mode.
 */
class GameState {
    private state: IGameState = {
        token: '',
        userId: '',
        gameId: '',
        rtp: 0,
        language: getUrlParam(URL_PARAMS.language) || DEFAULT_LANGUAGE_CODE,
        currency: getUrlParam(URL_PARAMS.currency) || DEFAULT_CURRENCY_CODE,
        gameState: 'stop',
        ticketID: 0,
        response: undefined,
        stake: STAKE_MIN[getUrlParam(URL_PARAMS.currency) || DEFAULT_CURRENCY_CODE] * 10 || DEFAULT_CURRENCY_VALUE,
        balance: 0,
        tablePattern: [],
        spinPattern: [],
        choosedPattern: [],
        matchedPattern: [],
        spinNumber: 10,
        purchaseSpinNumber: 40,
        winNumber: 0,
        freeNumber: 0,
        prevAction: '',
        action: 'SPIN',
        spinType: '',
        spinPrice: 0,
        slotSpins: [],
        slotTotalWins: [],
        slotWins: [],
        isServerDataRecieved: new Array(5).fill(false),
        purpleGemIndexes: [],
        symbolWins: [],
        winLines: [],
        totalPatternWin: 0,
        totalSymbolWin: 0,
        totalWin: 0,
        isTurbo: false,
        isSound: true,
        isMusic: true,
        isFullScreen: false,
        isDesktop: true,
        matchDelayTime: 0,
        wrapper: undefined,

        isAuto: false,
        autoNumber: 10,
        autoTotalWin: 0,
        lossLimit: 2,
        singleLimit: 20,
        isFree: false,
        fsMul: 1,
        counter: 0,
        index: 0,
        matchedTablePattern: [],
        matchedTruckPattern: [],
        tumbleWin: 0,
        singleWin: 0,
        isNextSpin: 's',
        lasMatchedReeltIndex: 0,
        nextState: {},
        isQuick: false,
        isStop: false,
        ultrawayValue: 1,
        isFreeSpinStart: false,
    };

    constructor() {
        bgm.setVolume(0);
        sfx.setVolume(0.5);
    }

    /** Mute SFX */
    public muteBGM() {
        bgm.setVolume(0);
        this.state.isMusic = false;
    }
    /** Unmute SFX */
    public unMuteBGM() {
        bgm.setVolume(0.5);
        this.state.isMusic = true;
    }

    /** Mute SFX */
    public muteSFX() {
        sfx.setVolume(0);
        this.state.isSound = false;
    }
    /** Unmute SFX */
    public unMuteSFX() {
        sfx.setVolume(0.5);
        this.state.isSound = true;
    }

    /** Get game state value */
    public get currentState(): IGameState {
        return this.state;
    }

    /** Set game state value */
    public setGameState(state: any) {
        this.state = { ...this.state, ...state };
    }
}

/** SHared user settings instance */
export const gameState = new GameState();
