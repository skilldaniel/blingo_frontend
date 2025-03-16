import { Container } from 'pixi.js';
import { GameInfoTextBox } from './GameInfoTextBox';
import { gameState } from '../../utils/gameState';
// import { RTP } from '../../config';
import { getLocaleStrings, splitByTotalLetterCount } from '../../utils/helpers';

const length = {
    bg: [60, 45],
    cs: [65, 50], //
    da: [65, 50],
    de: [65, 44],
    el: [60, 48], //
    es: [65, 48], //
    escl: [63, 45], //
    en: [66, 50],
    et: [65, 48],
    fi: [67, 50],
    fr: [63, 50],
    hu: [64, 50],
    it: [65, 60],
    ja: [33, 25],
    nl: [65, 50],
    no: [68, 48],
    pl: [62, 45],
    pt: [60, 48],
    ro: [65, 45],
    ru: [55, 40],
    sk: [65, 52],
    sv: [60, 48],
    th: [65, 55],
    tr: [65, 55],
    vi: [65, 48],
    zhhans: [33, 25],
    zhhant: [33, 25],
};

export class GameInfoText extends Container {
    public gameDescription: GameInfoTextBox;
    public bonusDescription: GameInfoTextBox[] = [];
    public winSpinDescription: GameInfoTextBox;
    public winSpinImage: GameInfoTextBox;
    public extraSpinWheelDescription: GameInfoTextBox;
    public extraSpinWheelImage: GameInfoTextBox;
    public extraSpinDescription: GameInfoTextBox;
    public blingoWinLineHeader: GameInfoTextBox;
    public blingoWinLineImage: GameInfoTextBox;
    public blingoWinLineDescription: GameInfoTextBox;
    public generalDescription: GameInfoTextBox;
    public freeGameDescription: GameInfoTextBox;
    public pendingGameDescription: GameInfoTextBox;

    public textmaxLengthOne: number;
    public textmaxLengthTwo: number;

    constructor() {
        super();

        if (length[gameState.currentState.language as keyof typeof length]) {
            this.textmaxLengthOne = length[gameState.currentState.language as keyof typeof length][0];
            this.textmaxLengthTwo = length[gameState.currentState.language as keyof typeof length][1];
        } else {
            this.textmaxLengthOne = length['en' as keyof typeof length][0];
            this.textmaxLengthTwo = length['en' as keyof typeof length][1];
        }

        const isSpecial =
            gameState.currentState.language === 'ja' ||
            gameState.currentState.language === 'zhhans' ||
            gameState.currentState.language === 'zhhant' ||
            gameState.currentState.language === 'th';

        const gameDescription = splitByTotalLetterCount(
            getLocaleStrings().dragon_blingo_description_1,
            this.textmaxLengthOne,
            isSpecial,
        ).concat(
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_2, this.textmaxLengthOne, isSpecial),
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_3, this.textmaxLengthOne, isSpecial),
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_4, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_5, this.textmaxLengthOne, isSpecial),
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_6, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_7, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_8, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_9, this.textmaxLengthOne, isSpecial),
            [''],

            ['—------------------------------------'],
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_10, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_11, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_12, this.textmaxLengthOne, isSpecial),
            [''],

            ['—------------------------------------'],
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_13, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_14, this.textmaxLengthOne, isSpecial),
            [''],

            ['—------------------------------------'],
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_15, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_16, this.textmaxLengthOne, isSpecial),
            [''],

            ['—------------------------------------'],
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_17, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_18, this.textmaxLengthOne, isSpecial),
            [''],

            ['—------------------------------------'],
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_19, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_20, this.textmaxLengthOne, isSpecial),
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_21, this.textmaxLengthOne, isSpecial),
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_22, this.textmaxLengthOne, isSpecial),
            [''],

            ['—------------------------------------'],
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_23, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_24, this.textmaxLengthOne, isSpecial),
            [''],
            ['—------------------------------------'],
        );
        this.gameDescription = new GameInfoTextBox(getLocaleStrings().dragon_blingo_title, gameDescription);
        this.gameDescription.x = 0;
        this.gameDescription.y = 0;
        this.addChild(this.gameDescription);

        for (let i = 11; i >= 3; i--) {
            const bonusDescription = splitByTotalLetterCount(
                getLocaleStrings().dragon_blingo_description_25,
                this.textmaxLengthTwo,
                isSpecial,
            );
            this.bonusDescription.push(new GameInfoTextBox('', bonusDescription, ['Popup/Setting/' + i]));
            this.bonusDescription[this.bonusDescription.length - 1].x = 0;
            this.bonusDescription[this.bonusDescription.length - 1].y =
                this.gameDescription.y +
                this.gameDescription.height +
                this.bonusDescription[this.bonusDescription.length - 1].height * Math.abs(i - 11);
            this.addChild(this.bonusDescription[this.bonusDescription.length - 1]);
        }

        const winSpinDescription = ['—------------------------------------'].concat(
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_27, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_28, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_29, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_30, this.textmaxLengthOne, isSpecial),
            [''],
            ['—------------------------------------'],
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_31, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_32, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_33, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_34, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_35, this.textmaxLengthOne, isSpecial),
            [''],
            ['—------------------------------------'],
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_36, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_37, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().dragon_blingo_description_38, this.textmaxLengthOne, isSpecial),
            [''],
        );
        this.winSpinDescription = new GameInfoTextBox('', winSpinDescription);
        this.winSpinDescription.x = 0;
        this.winSpinDescription.y = this.bonusDescription[this.bonusDescription.length - 1].y + 90;
        this.addChild(this.winSpinDescription);

        this.winSpinImage = new GameInfoTextBox('', [], ['Popup/Setting/winlines']);
        this.winSpinImage.x = 0;
        this.winSpinImage.y = this.winSpinDescription.y + this.winSpinDescription.height;
        this.addChild(this.winSpinImage);

        const extraSpinWheelDescription = splitByTotalLetterCount(
            getLocaleStrings().extra_spin_wheel_description_1,
            this.textmaxLengthOne,
            isSpecial,
        ).concat(
            [''],
            splitByTotalLetterCount(
                getLocaleStrings().extra_spin_wheel_description_2,
                this.textmaxLengthOne,
                isSpecial,
            ),
            [''],
            splitByTotalLetterCount(
                getLocaleStrings().extra_spin_wheel_description_3,
                this.textmaxLengthOne,
                isSpecial,
            ),
            [''],
            splitByTotalLetterCount(
                getLocaleStrings().extra_spin_wheel_description_4,
                this.textmaxLengthOne,
                isSpecial,
            ),
            [''],
        );

        this.extraSpinWheelDescription = new GameInfoTextBox(
            getLocaleStrings().extra_spin_wheel_title,
            extraSpinWheelDescription,
        );
        this.extraSpinWheelDescription.x = 0;
        this.extraSpinWheelDescription.y = this.winSpinImage.y + this.winSpinImage.height + 30;
        this.addChild(this.extraSpinWheelDescription);

        this.extraSpinWheelImage = new GameInfoTextBox('', [], ['Popup/Setting/extra_spin_wheel']);
        this.extraSpinWheelImage.x = 0;
        this.extraSpinWheelImage.y = this.extraSpinWheelDescription.y + this.extraSpinWheelDescription.height - 80;
        this.addChild(this.extraSpinWheelImage);

        const extraSpinDescription = splitByTotalLetterCount(
            getLocaleStrings().extra_spin_wheel_description_5,
            this.textmaxLengthOne,
            isSpecial,
        ).concat(
            [''],
            splitByTotalLetterCount(
                getLocaleStrings().extra_spin_wheel_description_6,
                this.textmaxLengthOne,
                isSpecial,
            ),
            [''],
            splitByTotalLetterCount(
                getLocaleStrings().extra_spin_wheel_description_7,
                this.textmaxLengthOne,
                isSpecial,
            ),
            [''],
            splitByTotalLetterCount(
                getLocaleStrings().extra_spin_wheel_description_8,
                this.textmaxLengthOne,
                isSpecial,
            ),
            [''],
            splitByTotalLetterCount(
                getLocaleStrings().extra_spin_wheel_description_9,
                this.textmaxLengthOne,
                isSpecial,
            ),
            [''],
            splitByTotalLetterCount(
                getLocaleStrings().extra_spin_wheel_description_10,
                this.textmaxLengthOne,
                isSpecial,
            ),
            [''],
        );

        this.extraSpinDescription = new GameInfoTextBox('', extraSpinDescription);
        this.extraSpinDescription.x = 0;
        this.extraSpinDescription.y = this.extraSpinWheelImage.y + this.extraSpinWheelImage.height - 60;
        this.addChild(this.extraSpinDescription);

        this.blingoWinLineHeader = new GameInfoTextBox(getLocaleStrings().blingo_winlines_title, []);
        this.blingoWinLineHeader.x = 0;
        this.blingoWinLineHeader.y = this.extraSpinDescription.y + this.extraSpinDescription.height + 10;
        this.addChild(this.blingoWinLineHeader);

        this.blingoWinLineImage = new GameInfoTextBox('', [], ['Popup/Setting/winline_blingo']);
        this.blingoWinLineImage.x = 0;
        this.blingoWinLineImage.y = this.blingoWinLineHeader.y + this.blingoWinLineHeader.height - 10;
        this.addChild(this.blingoWinLineImage);

        const blingoWinLineDescription = splitByTotalLetterCount(
            getLocaleStrings().blingo_winlines_description,
            this.textmaxLengthOne,
            isSpecial,
        ).concat(['']);

        this.blingoWinLineDescription = new GameInfoTextBox('', blingoWinLineDescription);
        this.blingoWinLineDescription.x = 0;
        this.blingoWinLineDescription.y = this.blingoWinLineImage.y + this.blingoWinLineImage.height;
        this.addChild(this.blingoWinLineDescription);

        const generalDescription = splitByTotalLetterCount(
            getLocaleStrings().general_description1,
            this.textmaxLengthOne,
            isSpecial,
        ).concat(
            splitByTotalLetterCount(getLocaleStrings().general_description2, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().general_description3, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().general_description4, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().general_description5, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().general_description6, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().general_description7, this.textmaxLengthOne, isSpecial),
            [''],
        );

        this.generalDescription = new GameInfoTextBox(getLocaleStrings().general_title, generalDescription);
        this.generalDescription.x = 0;
        this.generalDescription.y = this.blingoWinLineDescription.y + this.blingoWinLineDescription.height;
        this.addChild(this.generalDescription);

        const freeGameDescription = splitByTotalLetterCount(
            getLocaleStrings().free_games_description1,
            this.textmaxLengthOne,
            isSpecial,
        ).concat(
            [''],
            splitByTotalLetterCount(getLocaleStrings().free_games_description2, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().free_games_description3, this.textmaxLengthOne, isSpecial),
            [''],
        );

        this.freeGameDescription = new GameInfoTextBox(getLocaleStrings().free_games_title, freeGameDescription);
        this.freeGameDescription.x = 0;
        this.freeGameDescription.y = this.generalDescription.y + this.generalDescription.height;
        this.addChild(this.freeGameDescription);

        const pendingGameDescription = splitByTotalLetterCount(
            getLocaleStrings().pending_games_description1,
            this.textmaxLengthOne,
            isSpecial,
        ).concat(
            [''],
            splitByTotalLetterCount(getLocaleStrings().pending_games_description2, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().pending_games_description3, this.textmaxLengthOne, isSpecial),
            [''],
        );

        this.pendingGameDescription = new GameInfoTextBox(
            getLocaleStrings().pending_games_title,
            pendingGameDescription,
        );
        this.pendingGameDescription.x = 0;
        this.pendingGameDescription.y = this.freeGameDescription.y + this.freeGameDescription.height;
        this.addChild(this.pendingGameDescription);
    }

    public updateRTP() {
        const isSpecial =
            gameState.currentState.language === 'ja' ||
            gameState.currentState.language === 'zhhans' ||
            gameState.currentState.language === 'zhhant';

        this.removeChild(this.generalDescription);

        const generalDescription = splitByTotalLetterCount(
            getLocaleStrings().general_description1,
            this.textmaxLengthOne,
            isSpecial,
        ).concat(
            splitByTotalLetterCount(getLocaleStrings().general_description2, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().general_description3, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().general_description4, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().general_description5, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().general_description6, this.textmaxLengthOne, isSpecial),
            [''],
            splitByTotalLetterCount(getLocaleStrings().general_description7, this.textmaxLengthOne, isSpecial),
            [''],
        );

        this.generalDescription = new GameInfoTextBox(getLocaleStrings().general_title, generalDescription);
        this.generalDescription.x = 0;
        this.generalDescription.y = this.blingoWinLineDescription.y + this.blingoWinLineDescription.height;
        this.addChild(this.generalDescription);
    }
}
