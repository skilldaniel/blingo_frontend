import { Container } from 'pixi.js';
import { gsap } from 'gsap/gsap-core';
import axios from 'axios';

import { Background } from '../ui/GameScreen/Background';
import { BonusInfo } from '../ui/GameScreen/BonusInfo/BonusInfo';
import { GameTable } from '../ui/GameScreen/GameTable/GameTable';
import { BonusSlot } from '../ui/GameScreen/BonusSlot/BonusSlot';
import { GameBottom } from '../ui/GameScreen/GameBottom';
import { ExtraSymbols } from '../ui/GameScreen/ExtraSymbols';

import { gameState } from '../utils/gameState';
import { getLocaleStrings, getWinLines } from '../utils/helpers';

import { INITIAL_BONUS_SLOT_TABLE, REEL_SPEED, SERVER_URL } from '../config';
import {
    AnimationPopUp,
    ErrorMessagePopUp,
    FreeSpinBox,
    ImagePopUp,
    MenuBox,
    ResultBox,
    StakeBox,
} from '../popups/GameScreen';
import { GameButtons } from '../ui/GameScreen/GameButtons';
import { bgm, sfx } from '../utils/audio';
import { DoorSymbol } from '../ui/GameScreen/DoorSymbol';
import { RotateAlert } from '../ui/Common/RotateAlert';

/**Game Screen*/
export class GameScreen extends Container {
    /** Assets bundles required by this screen */
    public static assetBundles = ['game'];

    /** GameScreen UI Component */

    /** RotateLabel Background */

    /** Rotate Label */
    public rotateAlert: RotateAlert;

    /** The game background */
    public background: Background;

    /** The game Bonus Info */
    public bonusInfo: BonusInfo;

    /** The game Table */
    public gameTable: GameTable;

    /** The extra Symbols */
    public gameButtons: GameButtons;

    /** The Extra Symbols */
    public extraSymbols: ExtraSymbols;

    /** The game Bottom */
    public gameBottom: GameBottom;

    /** The Bonus Slot */
    public bonusSlot: BonusSlot;

    /** The Free Spin Box */
    public freeSpinBox: FreeSpinBox;

    /** The Result Box */
    public resultBox: ResultBox;

    /** The Stake Box */
    public stakeBox: StakeBox;

    /** The Stake Box */
    public menuBox: MenuBox;

    /** The ImagePopUp */
    public imagePopUp: ImagePopUp;

    /** The Animation PopUp */
    public animationPopUp: AnimationPopUp;

    /** The Error Box */
    public errorBox: ErrorMessagePopUp;

    /** The Door Symbol */
    public doorSymbol: DoorSymbol;

    /**Time Counter */
    public timeCounter: number = 0;

    /**RecallNumber */
    public recallNumber: number = 0;

    public gameContainer: Container;

    constructor() {
        super();

        const width = 1920;
        const height = 1080;

        this.gameContainer = new Container();
        this.gameContainer.width = 1920;
        this.gameContainer.height = 1080;
        this.gameContainer.pivot.set(width / 2, height / 2);
        this.gameContainer.x = width / 2;
        this.gameContainer.y = height / 2;

        /** Add Rotate Label */
        this.rotateAlert = new RotateAlert();
        this.rotateAlert.zIndex = 50;
        this.addChild(this.rotateAlert);

        /** Add Background */
        this.background = new Background();
        this.addChild(this.background);

        /** Add Bonus */
        this.bonusInfo = new BonusInfo();
        this.gameContainer.addChild(this.bonusInfo);
        // this.bonusInfo.alpha = 0;

        /** Add Game Table */
        this.gameTable = new GameTable();
        this.gameContainer.addChild(this.gameTable);
        // this.gameTable.alpha = 0;

        /** Add Game Buttons */
        this.gameButtons = new GameButtons();
        this.gameContainer.addChild(this.gameButtons);
        // this.gameButtons.alpha = 0;

        /** Add Extra Symbols */
        this.extraSymbols = new ExtraSymbols();
        this.extraSymbols.zIndex = 10;
        this.gameContainer.addChild(this.extraSymbols);
        // this.extraSymbols.alpha = 0;

        /** Add Game Bottom */
        this.gameBottom = new GameBottom();
        this.gameBottom.zIndex = 10;
        this.addChild(this.gameBottom);
        this.gameBottom.alpha = 0;

        this.gameContainer.alpha = 0;
        this.addChild(this.gameContainer);

        /** Add Bonus Slot*/
        this.bonusSlot = new BonusSlot();
        this.addChild(this.bonusSlot);
        this.bonusSlot.visible = false;

        /** Add Stake Box */
        this.stakeBox = new StakeBox();
        this.stakeBox.x = 0;
        this.stakeBox.y = 0;
        this.addChild(this.stakeBox);

        /** Add Menu Buttons */
        this.menuBox = new MenuBox();
        this.menuBox.x = 0;
        this.menuBox.y = 0;
        this.addChild(this.menuBox);
        // this.menuBox.show();

        /** Add Result Box */
        this.resultBox = new ResultBox();
        this.resultBox.x = 0;
        this.resultBox.y = 0;
        this.addChild(this.resultBox);
        // this.resultBox.show();

        /** Addd Image Popup */
        this.imagePopUp = new ImagePopUp();
        this.imagePopUp.x = width / 2 - this.imagePopUp.width / 2;
        this.imagePopUp.y = height / 2 - this.imagePopUp.height / 2;
        this.addChild(this.imagePopUp);

        /** Add Animation PopUp */
        this.animationPopUp = new AnimationPopUp();
        this.animationPopUp.x = width / 2 - this.animationPopUp.width / 2;
        this.animationPopUp.y = height / 2 - this.animationPopUp.height / 2;
        this.addChild(this.animationPopUp);

        /** Add Free Spin Wheel */
        this.freeSpinBox = new FreeSpinBox();
        this.freeSpinBox.x = width / 2;
        this.freeSpinBox.y = height / 2;
        this.addChild(this.freeSpinBox);

        /** Add Error Box */
        this.errorBox = new ErrorMessagePopUp();
        this.errorBox.x = width / 2 - this.errorBox.width / 2;
        this.errorBox.y = height / 2 - this.errorBox.height / 2;
        this.addChild(this.errorBox);

        /** Add Door Symbol */
        this.doorSymbol = new DoorSymbol();
        this.doorSymbol.x = 0;
        this.doorSymbol.y = 0;
        this.doorSymbol.zIndex = 11;
        this.doorSymbol.interactive = false;
        this.addChild(this.doorSymbol);

        // this.bonusInfo, this.gameTable, this.gameButtons, this.gameBottom, this.extraSymbols

        // Event Listeners for Test Buttons
        document.getElementById('3_blingo')?.addEventListener('click', () => {
            this.testCheat('blingo3');
        });
        document.getElementById('4_blingo')?.addEventListener('click', () => {
            this.testCheat('blingo4');
        });
        document.getElementById('5_blingo')?.addEventListener('click', () => {
            this.testCheat('blingo5');
        });
        document.getElementById('6_blingo')?.addEventListener('click', () => {
            this.testCheat('blingo6');
        });
        document.getElementById('7_blingo')?.addEventListener('click', () => {
            this.testCheat('blingo7');
        });
        document.getElementById('8_blingo')?.addEventListener('click', () => {
            this.testCheat('blingo8');
        });
        document.getElementById('9_blingo')?.addEventListener('click', () => {
            this.testCheat('blingo9');
        });
        document.getElementById('10_blingo')?.addEventListener('click', () => {
            this.testCheat('blingo10');
        });
        document.getElementById('full_house')?.addEventListener('click', () => {
            this.testCheat('fullhouse');
        });
        document.getElementById('playMusic')?.addEventListener('click', () => {
            gameState.unMuteBGM();
            bgm.play('game/Audio/music_loop.mp3');
        });

        /** Game Screen Event */
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        this.gameButtons.spinButton.on('pointertap', this.startGame.bind(this));
        this.gameButtons.menuButton.on('pointertap', this.showMenuBox.bind(this));
        this.gameButtons.stakeButton.on('pointertap', this.showStakeBox.bind(this));
        this.gameTable.gameStopButton.on('pointertap', this.finishGame.bind(this));
        this.doorSymbol.on('pointerdown', this.showGame.bind(this));
        this.doorSymbol.on('touchstart', this.showGame.bind(this));
        console.log(`token from state is ${gameState.currentState.token}`);
    }

    public async testCheat(action: string) {
        const data = {
            action: action,
            stake: gameState.currentState.stake,
            token: gameState.currentState.token,
        };
        try {
            const response = await axios.post(SERVER_URL + '/api/gamestudio/rogue/starburst/testCheat', data);
            console.log(response);
        } catch {}
    }

    /** Show Game */
    public showGame() {
        this.doorSymbol.showGame();
        this.doorSymbol.interactive = false;
        const showGameTimeline = gsap.timeline();

        this.gameContainer.scale.x = 0.9;
        this.gameContainer.scale.y = 0.9;

        showGameTimeline
            .to(this, { duration: REEL_SPEED * 15, ease: 'none' })

            .to([this.gameContainer, this.gameBottom], {
                duration: REEL_SPEED * 5,
                alpha: 1,
                ease: 'none',
                onComplete: () => {
                    document.getElementById('playMusic')?.click();
                },
            })
            .to(
                this.gameContainer.scale,
                {
                    duration: REEL_SPEED * 5,
                    x: 1,
                    y: 1,
                    onComplete: () => {
                        this.gameButtons.spinButton.interactive = true;
                    },
                },
                '<',
            );
    }

    /** Show Menu Box */
    public showMenuBox() {
        this.menuBox.show();
    }

    /** Show Stake Box*/
    public showStakeBox() {
        this.stakeBox.show();
    }

    /** Show Bonus */
    public showBonus() {
        sfx.play('game/Audio/BSOpen.mp3');
        this.gameButtons.spinButton.interactive = false;
        this.gameBottom.updateDescription(getLocaleStrings().start_bonus);
        this.bonusSlot.visible = true;
        this.gameTable.visible = false;
        this.bonusInfo.visible = false;
        this.gameButtons.visible = false;
        this.extraSymbols.updateState(true);
    }

    /** Hide Bonus */
    public hideBonus() {
        this.gameBottom.updateDescription('');
        this.bonusSlot.visible = false;
        this.gameTable.visible = true;
        this.bonusInfo.visible = true;
        this.gameButtons.visible = true;
        this.extraSymbols.updateState(false);
        this.gameBottom.updateBalance(gameState.currentState.balance);
        this.resultBox.updateSlotWinType(gameState.currentState.winNumber);
        if (gameState.currentState.totalSymbolWin === 0) {
            this.resultBox.updateState(1);
            this.resultBox.updateResult(gameState.currentState.totalPatternWin, 0, gameState.currentState.totalWin);
        } else {
            this.resultBox.updateState(0);
            this.resultBox.updateResult(
                gameState.currentState.totalPatternWin,
                gameState.currentState.totalSymbolWin,
                gameState.currentState.totalWin,
            );
        }
        sfx.play('game/Audio/BSClose.mp3');
        this.resultBox.show();
        sfx.play('game/Audio/dragon_2.mp3');
        this.animationPopUp.update(Array.from({ length: 65 }, (_, i) => `Popup/DragonWin/${i + 1}`));
        this.animationPopUp.width = 1920;
        this.animationPopUp.height = 1080;
        this.animationPopUp.x = 0;
        this.animationPopUp.y = 0;
        this.animationPopUp.show();

        this.initialize();
    }

    /** Set data after current state */
    public setDataCurrent(response: any) {
        /** Get tablePattern, ticketID and balance */
        const tablePattern = response.data.game.ticket.cells.split(',').map(Number);
        const ticketID = response.data.game.ticket.id;
        const balance = response.data.balance.cash;

        /** Set tablePattern, ticketID and balance to global state */
        gameState.setGameState({
            tablePattern: tablePattern,
            ticketID: ticketID,
            balance: balance,
        });

        /** Update TablePatter and Balance */
        this.gameTable.updateTableValue(gameState.currentState.tablePattern);
        this.gameBottom.updateBalance(balance);
    }

    /** Set data after start */
    public setDataStart(response: any) {
        /** Get Balance */
        const balance = response.data.balance.cash;

        /** Set Game State and Balance to global state */
        gameState.setGameState({
            gameState: 'start',
            balance: balance,
        });

        /** Upate Balance*/
        this.gameBottom.updateBalance(gameState.currentState.balance);

        /** Call Spin */
        this.callAPI(2);
    }

    /** Set data after spin */
    public async setDataSpin(response: any) {
        const spinPattern = response.data?.game.spin.symbols;
        const choosedPattern =
            response.data?.game.spin.superJokerIndexes.length != 0
                ? response.data?.game.spin.superJokerCells
                : response.data?.game.spin.jokerCells;
        const matchedPattern = response.data?.game.spin.matches;
        const action = response.data?.game.action;
        const spinNumber = response.data?.game.spinsRemaining;
        const purchaseSpinNumber = response.data?.game.purchaseSpinsRemaining;
        const freeNumber = response.data?.game.freePurchaseSpinsRemaining;
        const winNumber = response.data?.game.matchedPatterns;
        const spinType = response.data?.game.state;
        const spinPrice = response.data?.game.spinPrice;
        const prevSpinType = gameState.currentState.spinType;
        const prevAction = gameState.currentState.action;
        const purpleGemIndexes = response.data?.game.spin.purpleGemIndexes;
        const winLines = getWinLines(response.data?.game.spin.matches);
        const newWinNumber = !!(winNumber !== gameState.currentState.winNumber);

        if (spinPattern.includes('FS')) {
            this.gameButtons.spinNumberButton.updateCover(true);
        } else {
            this.gameButtons.spinNumberButton.updateCover(false);
        }

        gameState.setGameState({
            response: response,
            spinPattern: spinPattern,
            choosedPattern: choosedPattern,
            matchedPattern: matchedPattern,
            spinNumber: spinNumber,
            purchaseSpinNumber: purchaseSpinNumber,
            freeNumber: freeNumber,
            winNumber: winNumber,
            action: action,
            spinType: spinType,
            spinPrice: spinPrice,
            purpleGemIndexes: purpleGemIndexes,
            winLines: winLines,
            prevAction: prevAction,
        });

        console.log(`--------------> ${action} <--------------`);
        console.log('prevAction :: ', prevAction);
        console.log('spinType :: ', spinType);
        // console.log('spinPrice', spinPrice);
        // console.log('spinPattern', spinPattern);
        // console.log('matchedPattern', matchedPattern);
        // console.log('choosedPattern', choosedPattern);
        // console.log('winNumber', winNumber);
        // console.log('winLines', winLines);

        if (gameState.currentState.isTurbo) {
            gameState.currentState.isServerDataRecieved = new Array(5).fill(true);
        } else {
            gameState.currentState.isServerDataRecieved = new Array(5).fill(false);
            setTimeout(() => {
                gameState.currentState.isServerDataRecieved[0] = true;
            }, 150);
        }

        /** Change label of stopbutton by winNumber END/Collect */
        this.gameTable.updateStopButtonState(gameState.currentState.winNumber);
        /** Update Bonus Info by win number */
        if (newWinNumber) this.bonusInfo.updateWinStateBonusInfo(gameState.currentState.winNumber);
        /** Update remain spin number */
        this.gameButtons.spinNumberButton.updateSpinNumber(gameState.currentState.spinNumber);
        if (spinType === 'FREE_PURCHASE_SPIN') {
            console.log(`---- spinType === 'FREE_PURCHASE_SPIN' case ::`);
            /** Show Free Spin Wheel */
            if (freeNumber === 4) {
                this.imagePopUp.updateImage('Popup/Text/es_chance');
                this.freeSpinBox.updateFreeSpinType(5 - freeNumber);
                await this.imagePopUp.show();
            } else {
                this.imagePopUp.showBackground();
            }

            this.freeSpinBox.updateFreeSpinType(5 - freeNumber);
            await this.freeSpinBox.show(5 - freeNumber, spinPattern.length !== 0);
            this.imagePopUp.hide();

            /** When Get Extra Free Spin */
            if (spinPattern.length !== 0) {
                this.gameButtons.spinNumberButton.alpha = 0;

                /** The Game Table Reel Spin */
                this.gameTable.gameSpinReel.spin();
                /** Set Stop Time */
                if (gameState.currentState.isTurbo) {
                    gameState.currentState.isServerDataRecieved = new Array(5).fill(true);
                } else {
                    gameState.currentState.isServerDataRecieved = new Array(5).fill(false);
                    setTimeout(() => {
                        gameState.currentState.isServerDataRecieved[0] = true;
                    }, 150);
                }

                let delayTime = 2000;
                if (purpleGemIndexes.length >= 3) {
                    setTimeout(() => {
                        this.gameTable.gameSpinReel.showPurpleWinFont();
                    }, delayTime);
                    delayTime += 2000;
                    /** Show Matched Symbol Animation */
                    if (matchedPattern.length > 0) {
                        setTimeout(() => {
                            this.gameTable.updateMatchedTable(matchedPattern);
                        }, delayTime);
                        delayTime += gameState.currentState.matchDelayTime;
                    }
                } else {
                    /** Purple Gem Don't Exist */
                    /** Show Matched Symbol Animation */
                    if (matchedPattern.length > 0) {
                        setTimeout(() => {
                            this.gameTable.updateMatchedTable(matchedPattern);
                        }, delayTime);
                        delayTime += gameState.currentState.matchDelayTime;
                    }
                }
                setTimeout(() => {
                    this.callAPI(2);
                }, delayTime);
            } else {
                /** When End Extra Free Spin */
                /** Update Spin Number Button */
                this.gameButtons.spinNumberButton.alpha = 1;
                this.gameButtons.spinNumberButton.updateSpinType('EXTRA SPINS');
                this.gameButtons.spinNumberButton.updateSpinNumber(gameState.currentState.purchaseSpinNumber);

                /** Update GameState to Purchase */
                gameState.setGameState({
                    gameState: 'purchase',
                });

                /** Update Spin Button */
                this.gameButtons.spinButton.updateButtonType(false, gameState.currentState.spinPrice);

                /** Show Stop Button */
                this.gameTable.showStopButton();
            }
        }

        if (spinType === 'PURCHASE_SPIN') {
            /** When first purchase_spin */
            console.log(`spinType === 'PURCHASE_SPIN' case :: prevSpinType=${prevSpinType}, action=${action}`);
            console.log(`balance1=${gameState.currentState.balance}`);

            /** Update Balance */
            if (prevAction !== 'CHOOSE_CELL') {
                gameState.setGameState({
                    gameState: 'purchase',
                    balance: response.data?.balance.cash,
                });
                console.log(`balance2=${gameState.currentState.balance}`);
                this.gameBottom.updateBalance(gameState.currentState.balance);
            }

            /** Update Spin Button State */
            console.log(`action=${action}`);
            switch (action) {
                case 'CHOOSE_CELL':
                    this.gameButtons.spinButton.updateButtonType(false, gameState.currentState.spinPrice);
                    break;
                case 'SPIN':
                    console.log(`here?`);
                    this.gameButtons.spinButton.updateButtonType(false, gameState.currentState.spinPrice);
                    break;
            }
            /** Update Spin Number Button */
            this.gameButtons.spinNumberButton.alpha = 1;
            this.gameButtons.spinNumberButton.updateSpinType('EXTRA SPINS');
            this.gameButtons.spinNumberButton.updateSpinNumber(gameState.currentState.purchaseSpinNumber);

            // if(prevSpinType === "FREE_PURCHASE_SPIN") {
            //     /** Show Stop Button */
            //     this.gameTable.showStopButton();
            // }
        }

        if (spinType === 'FREE_SPIN') {
            console.log(`---- spinType === 'FREE_SPIN' case ::`);
            this.gameTable.gameSpinReel.spin();
            this.callAPI(2);
        }

        if (prevAction === 'CHOOSE_CELL') {
            /** When Choose State */
            console.log(`---- your prevAction is ${prevAction}`);
            let delayTime = 0;

            /** When Purple Gem exist*/
            if (purpleGemIndexes.length >= 3) {
                this.gameTable.gameSpinReel.showPurpleWinFont();
                delayTime += 2000;
                /** Show Matched Symbol Animation */
                if (matchedPattern.length > 0) {
                    setTimeout(() => {
                        this.gameTable.updateMatchedTable(matchedPattern);
                    }, 2000);
                    // matchedPattern.map((item: any) => {
                    //     const number = item.number;
                    //     const pattern = item.pattern;
                    //     const index = this.gameTable.gameTable.findIndex(
                    //         (symbol) => number === parseInt(symbol.gameSymbolLabel.text) && !symbol.isMatched,
                    //     );
                    //     if (index !== -1) {
                    //         delayTime += (pattern.length + 1) * 1000;
                    //     }
                    // });
                    delayTime += gameState.currentState.matchDelayTime;
                }
            } else {
                /** Purple Gem Don't Exist */
                /** Show Matched Symbol Animation */
                if (matchedPattern.length > 0) {
                    this.gameTable.updateMatchedTable(matchedPattern);
                    delayTime += gameState.currentState.matchDelayTime;
                }
            }
            console.log('matchDelayTime', delayTime);
            if (action === 'CHOOSE_CELL') {
                /** Update Game Bottom Description */
                this.gameBottom.updateDescription(getLocaleStrings().select_number);

                setTimeout(async () => {
                    if (gameState.currentState.choosedPattern.length > 0) {
                        this.gameTable.updateChoosedTable(gameState.currentState.choosedPattern);
                    } else {
                        if (spinType === 'STANDARD_SPIN') {
                            if (spinNumber >= 1) this.gameTable.gameSpinReel.spin();
                            this.callAPI(2);
                        }
                        if (spinType === 'FREE_SPIN') {
                            console.log(`here1?`);
                            this.gameTable.gameSpinReel.spin();
                            this.callAPI(2);
                        }
                        if (spinType === 'PURCHASE_SPIN') {
                            this.gameButtons.spinButton.updateButtonType(false, gameState.currentState.spinPrice);
                            this.gameTable.showStopButton();
                        }
                        if (spinType === 'COMPLETE') {
                            this.setDataCollect(response);
                        }
                    }
                }, delayTime);
            }
            /** When Spin State */
            console.log(`step2 ? action=${action}, spinType=${spinType}`);

            if (action === 'SPIN' || action === 'NONE') {
                /** Update Game Bottom Description */
                this.gameBottom.updateDescription('');

                setTimeout(async () => {
                    if (spinType === 'STANDARD_SPIN') {
                        if (spinNumber >= 1) this.gameTable.gameSpinReel.spin();
                        this.callAPI(2);
                    }
                    if (spinType === 'FREE_SPIN') {
                        console.log(`here2?`);
                        this.gameTable.gameSpinReel.spin();
                        this.callAPI(2);
                    }
                    if (spinType === 'PURCHASE_SPIN') {
                        this.gameButtons.spinButton.updateButtonType(false, gameState.currentState.spinPrice);
                        this.gameTable.showStopButton();
                    }
                    if (spinType === 'COMPLETE') {
                        this.setDataCollect(response);
                    }
                }, delayTime);
            }
        }
        /** This case peformance doLastAction function */
        if (prevAction === 'SPIN' || prevAction === 'NONE') {
            console.log(`---- here prevAction is ${prevAction}`);
        }
    }

    /** Set data after collect */
    public async setDataCollect(response: any) {
        const winNumber = response.data?.game.matchedPatterns;
        const symbolWins = response.data?.game.symbolWins;
        const balance = response.data.balance.cash;

        if (winNumber > 2) {
            const spins = response.data.bonus.spins;
            const totalPatternWin = response.data?.bonus.totalWin;
            const totalSymbolWin = response.data?.game.totalSymbolWin;
            const totalWin = response.data?.game.totalWin;

            let slotSpins: string[][][] = [];
            let slotTotalWins: number[] = [];
            let slotWins: any[] = [];

            for (let index = 0; index < spins.length; index++) {
                slotSpins.push([]);
                slotTotalWins.push(spins[index].totalWin);
                if (response.data.bonus.spins[index].expansionIndexes.length > 0) {
                    for (let subindex = 0; subindex < spins[index].expandedReels.length; subindex++) {
                        slotSpins[slotSpins.length - 1].push(spins[index].expandedReels[subindex].symbols);
                    }
                } else {
                    for (let subindex = 0; subindex < spins[index].reels.length; subindex++) {
                        slotSpins[slotSpins.length - 1].push(spins[index].reels[subindex].symbols);
                    }
                }
                let singleSlotWin: any = [];
                spins[index].wins.forEach((element: any) => {
                    const symbol = element.symbol;
                    const amount = element.amount;
                    const direction = element.direction === 'LEFT_TO_RIGHT' ? 'left' : 'right';
                    const triggers = element.triggers.map((trigger: string) => {
                        return trigger.split(',').map(Number);
                    });
                    singleSlotWin.push({
                        amount,
                        direction,
                        symbol,
                        triggers,
                    });
                });
                slotWins.push(singleSlotWin);
            }

            gameState.setGameState({
                balance: balance,
                slotSpins: slotSpins,
                slotTotalWins: slotTotalWins,
                slotWins: slotWins,
                symbolWins: symbolWins,
                totalPatternWin: totalPatternWin,
                totalSymbolWin: totalSymbolWin,
                totalWin: totalWin,
            });
            sfx.play('game/Audio/OneWinSpin.mp3');
            this.gameBottom.updateDescription('1' + getLocaleStrings().win_spin);
            this.imagePopUp.updateImage('Popup/Text/1_win_spin');
            await this.imagePopUp.show();
            this.imagePopUp.image.scale.x = 1;
            this.imagePopUp.image.scale.y = 1;
            sfx.play('game/Audio/dragon_1.mp3');
            this.animationPopUp.update(Array.from({ length: 87 }, (_, i) => `Popup/DragonSlot/${i + 1}`));
            this.animationPopUp.width = 1920;
            this.animationPopUp.height = 1080;
            this.animationPopUp.x = 0;
            this.animationPopUp.y = 0;
            this.animationPopUp.show();

            setTimeout(() => {
                this.imagePopUp.hide();
                this.showBonus();
            }, 6000);
        } else {
            const totalPatternWin = response.data?.game.totalPatternWin;
            const totalSymbolWin = response.data?.game.totalSymbolWin;
            const totalWin = response.data?.game.totalWin;

            gameState.setGameState({
                balance: balance,
                symbolWins: symbolWins,
                totalPatternWin: totalPatternWin,
                totalSymbolWin: totalSymbolWin,
                totalWin: totalWin,
            });
            if (gameState.currentState.totalSymbolWin === 0) {
                sfx.play('game/Audio/GameOverFS.mp3');
                this.gameBottom.updateDescription(getLocaleStrings().game_over);
                this.imagePopUp.updateImage('Popup/Text/game_over');
                await this.imagePopUp.show();
                this.imagePopUp.hide();
                this.gameBottom.updateDescription('');
                this.initialize();
            } else {
                this.resultBox.updateState(2);
                this.resultBox.updateResult(0, gameState.currentState.totalSymbolWin, gameState.currentState.totalWin);
                this.resultBox.show();
                this.animationPopUp.update(Array.from({ length: 65 }, (_, i) => `Popup/DragonWin/${i + 1}`));
                this.animationPopUp.width = 1920;
                this.animationPopUp.height = 1080;
                this.animationPopUp.x = 0;
                this.animationPopUp.y = 0;
                this.animationPopUp.show();

                setTimeout(() => {
                    this.resultBox.hide();
                    this.initialize();
                }, 6000);
            }
        }
    }

    /**Call Service API */
    public async callAPI(callSpinType: number, callSpinParam?: number) {
        // this.gameTable.showStopButton();
        /**Data for API */
        try {
            let data;
            let response;
            const gameId = 'slingo-starburst';
            switch (callSpinType) {
                case 0:
                    data = {
                        firstGame: callSpinParam === 1 ? true : false,
                        gameId: gameId,
                        token: gameState.currentState.token,
                        userId: gameState.currentState.userId,
                    };
                    response = await axios.post(SERVER_URL + '/api/gamestudio/rogue/starburst/currentGame', data);
                    // console.log('currentResponse', response);
                    this.setDataCurrent(response);
                    break;
                case 1:
                    data = {
                        currencyCode: gameState.currentState.currency,
                        gameId: gameId,
                        stake: gameState.currentState.stake,
                        ticketId: gameState.currentState.ticketID,
                        token: gameState.currentState.token,
                        gameInstanceId: gameState.currentState.gameId,
                        userId: gameState.currentState.userId,
                    };
                    response = await axios.post(SERVER_URL + '/api/gamestudio/rogue/starburst/startGame', data);
                    // console.log('startResponse', response);
                    this.setDataStart(response);
                    break;
                case 2:
                    data = {
                        gameId: gameId,
                        gameInstanceId: gameState.currentState.gameId,
                        token: gameState.currentState.token,
                        userId: gameState.currentState.userId,
                    };
                    response = await axios.post(SERVER_URL + '/api/gamestudio/rogue/starburst/spin', data);
                    // console.log('spinResponse', response);
                    this.setDataSpin(response);
                    break;
                case 3:
                    data = {
                        cellNumber: callSpinParam,
                        gameId: gameId,
                        gameInstanceId: gameState.currentState.gameId,
                        token: gameState.currentState.token,
                        userId: gameState.currentState.userId,
                    };
                    response = await axios.post(SERVER_URL + '/api/gamestudio/rogue/starburst/chooseCell', data);
                    // console.log('chooseResponse', response);
                    this.setDataSpin(response);
                    break;
                case 4:
                    data = {
                        gameId: gameId,
                        gameInstanceId: gameState.currentState.gameId,
                        token: gameState.currentState.token,
                        userId: gameState.currentState.userId,
                    };
                    response = await axios.post(SERVER_URL + '/api/gamestudio/rogue/starburst/collect', data);
                    console.log('collectResponse', response);
                    this.setDataCollect(response);
                    break;
            }
        } catch (error) {
            this.recallNumber++;
            if (this.recallNumber >= 5) {
                console.log('error', error);

                this.errorBox.show(getLocaleStrings().server_error);
                this.recallNumber = 0;
            } else {
                this.callAPI(callSpinType, callSpinParam);
            }
        }
    }

    /** Prepare the screen just before showing */
    public async prepare() {
        // this.bonusInfo.alpha = 1;
        // this.gameTable.alpha = 1;
        // this.gameButtons.alpha = 1;
        // this.gameBottom.alpha = 1;
        // this.extraSymbols.alpha = 1;

        /** Init API */
        const data = {
            mode: 'fun',
            game: 'blingo_1',
            lang: 'en',
            currency: 'EUR',
            token: '66fbba65b6ff885fc7bf05cf',
            user: '660c0fd740ba300cdafba763',
        };
        try {
            await axios.post(SERVER_URL + '/api/gamestudio/rogue/starburst/get_launcher_url', data);
            this.doorSymbol.interactive = true;
            this.doorSymbol.progressBar.updateStartLabel();
            this.callAPI(0);
        } catch (error) {
            this.recallNumber++;
            if (this.recallNumber >= 5) {
                this.doorSymbol.interactive = true;
                this.doorSymbol.progressBar.updateStartLabel();
                this.errorBox.show(getLocaleStrings().server_error);
                this.recallNumber = 0;
                console.log('error', error);
            } else {
                this.prepare();
            }
        }
    }

    /** Initialize Game state */
    public initialize() {
        /** Set Game state Stop */
        gameState.setGameState({
            gameState: 'stop',
        });

        this.bonusInfo.updateWinStateBonusInfo(0);

        this.gameTable.hideStopButton();
        this.gameTable.removeAllChoosed();
        this.gameTable.removeAllMatched();
        this.gameTable.gameSpinReel.hide();

        this.gameButtons.spinButton.updateButtonType(true);
        this.gameButtons.spinNumberButton.updateSpinType('SPINS');
        this.gameButtons.spinNumberButton.updateSpinNumber(10);

        this.bonusSlot.bonusSlotTable.initialize(INITIAL_BONUS_SLOT_TABLE);
        /** Call Current Game */
        this.callAPI(0);
    }

    /** Start the game when a user click Spin button */
    public async startGame() {
        if (gameState.currentState.gameState === 'stop') {
            this.gameTable.gameSpinReel.spin();
            this.gameButtons.spinButton.updateButtonType(false);
            this.callAPI(1);
        }
        if (gameState.currentState.gameState === 'purchase') {
            this.gameTable.hideStopButton();
            this.gameTable.gameSpinReel.spin();
            this.gameButtons.spinButton.updateButtonType(false);
            this.callAPI(2);
        }
    }
    /** Auto Start when a user click Auto Start Button */
    public async autoStartGame() {
        this.startGame();
    }

    /** Finsh the game */
    public async finishGame() {
        this.callAPI(4);
    }

    public onKeyDown(event: { code: string }) {
        // Check if the pressed key is the spacebar
        if (event.code === 'Space' && this.gameButtons.spinButton.interactive) {
            this.startGame();
        }
    }

    /** Resize the screen, fired whenever window size changes */
    public resize(width: number, height: number) {
        this.background.resize(width, height);
        this.bonusInfo.resize(width, height);
        this.gameTable.resize(width, height);
        this.gameButtons.resize(width, height);
        this.extraSymbols.resize(width, height);
        this.gameBottom.resize(width, height);
        this.bonusSlot.resize(width, height);
        this.doorSymbol.resize(width, height);
        this.rotateAlert.resize(width, height);

        if (width > height || gameState.currentState.isDesktop) {
            this.background.x = width / 2;
            this.background.y = height / 2;

            this.bonusInfo.x = 283;
            this.bonusInfo.y = 31;

            this.gameTable.x = width * 0.5 - 365.5;
            this.gameTable.y = height * 0.5 - 453 + 7;

            this.gameButtons.x = 1359;
            this.gameButtons.y = height * 0.5 - this.gameButtons.height * 0.5 + 109;

            this.extraSymbols.x = 0;
            this.extraSymbols.y = 0;

            this.gameBottom.x = 0;
            this.gameBottom.y = height - this.gameBottom.height;

            this.bonusSlot.x = width / 2 - this.bonusSlot.width / 2;
            this.bonusSlot.y = height / 2 - this.bonusSlot.height / 2 + 78;
            this.rotateAlert.alpha = 0;
        } else {
            this.rotateAlert.alpha = 1;
        }
    }

    public update() {
        this.timeCounter++;
        if (this.timeCounter >= 360) {
            this.timeCounter = 0;
            this.extraSymbols.updateTime();
        }

        this.gameTable.update();
    }

    /**Gate GameScreen */
    public async gate(flag: string, payload: any) {
        switch (flag) {
            case 'callAPI':
                if (payload.value) {
                    this.callAPI(payload.type, payload.value);
                } else {
                    this.callAPI(payload.type);
                }
                break;
            case 'setDataCollect':
                this.setDataCollect(payload);
                break;
            /** Bonus Slot */
            case 'bonusSlotSpin':
                this.bonusSlot.spin();
                break;
            case 'hideBonus':
                this.hideBonus();
                break;
            case 'showWinEffect':
                this.bonusSlot.bonusSlotTable.showWinEffectTable(payload);
                break;
            case 'updateBonusSlotButton':
                this.bonusSlot.bonusStartButton.updateButtonType(payload);
                break;
            case 'showBonusSlotWinAmount':
                this.bonusSlot.bonusStartButton.updateWinValue(
                    gameState.currentState.slotWins[payload.loop][payload.index].amount,
                );
                break;
            /** Game Table */
            /** Table */
            case 'removeAllChoosed':
                this.gameTable.removeAllChoosed();
                break;
            case 'updateStake':
                this.gameBottom.stakeValueLabel.updateLabel(Number(gameState.currentState.stake).toFixed(2));
                this.gameBottom.resize(1920, 1080);
                break;
            case 'updateMatchedTable':
                this.gameTable.updateMatchedTable(gameState.currentState.matchedPattern);
                break;
            case 'updateMatchedSingleSymbolTable':
                this.gameTable.updateMatchedSingleSymbolTable(payload);
                break;
            case 'updateChoosedTable':
                this.gameTable.updateChoosedTable(gameState.currentState.choosedPattern);
                break;
            case 'showWinAnimation':
                this.gameTable.showWinAnimation(gameState.currentState.winLines);
                break;
            /** Mask */
            case 'addGameSpinMask':
                this.gameTable.gameSpinReel.addMask();
                break;
            case 'removeGameSpinMask':
                this.gameTable.gameSpinReel.removeMask();
                break;
            /** Spin */
            case 'gameSpinSlotSpin':
                this.gameTable.gameSpinReel.spin();
                break;
            /** Button */
            case 'showStopButton':
                this.gameTable.showStopButton();
                break;
            case 'showPurpleWinFont':
                this.gameTable.gameSpinReel.showPurpleWinFont();
                break;
            /** Game Button */
            case 'updateSpinButtonType':
                if (payload.value) {
                    this.gameButtons.spinButton.updateButtonType(payload.type, payload.value);
                } else {
                    this.gameButtons.spinButton.updateButtonType(payload.type);
                }
                break;
            /** Game Bottom */
            case 'updateGameBottomDescription':
                this.gameBottom.updateDescription(payload);
                break;
            /** PopUp */
            /** Free Spin */
            case 'showFreeSpinWheel':
                this.imagePopUp.updateImage('Popup/Text/es_chance');
                await this.imagePopUp.show();
                await this.freeSpinBox.show(payload.type, payload.state);
                this.imagePopUp.hide();
                this.gameTable.showStopButton();
                break;
            case 'showImagePopUp':
                await this.imagePopUp.show();
                break;
            case 'hideImagePopUp':
                this.imagePopUp.hide();
                break;
            case 'showAnimationPopUp':
                this.animationPopUp.show();
                break;
            case 'updateFullScreenToogleButton':
                this.menuBox.optionContainer.fullscreenToggleButton.updateState(gameState.currentState.isFullScreen);
                break;
            case 'updateFullScreenState':
                this.menuBox.optionContainer.updateFullScreenState();
                break;
        }
    }
}
