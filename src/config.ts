/** Game design size */
export const DESIGN_WIDTH: number = 1920;
export const DESIGN_HEIGHT: number = 1080;

/** RTP values */
export const RTP = [96, 94, 92];

/** Auto Number Array */
export const AUTO_NUMBERS = [5, 10, 25, 50, 100];

/** Reel Speed */
export const REEL_SPEED = 0.2;

/** Initial Bonus Slot Table */
export const INITIAL_BONUS_SLOT_TABLE = [
    ['LOTUS', 'LOTUS', 'FAN'],
    ['FAN', 'LOTUS', 'BAR'],
    ['BAR', 'LOTUS', 'DRAGON'],
    ['DRAGON', 'EIGHT', 'PIG'],
    ['EIGHT', 'PIG', 'YINYANG'],
];

/** Win Table Value */
export const WIN_TABLE = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
];

/** Stake MULTI */
export const STAKE_MULTI: number[] = [1, 2, 5, 10, 20, 50, 100, 250, 500, 1000];

/** Stake Min Values */
export const STAKE_MIN: Record<string, number> = {
    USD: 0.2,
    CAD: 0.3,
    AUD: 0.3,
    PEN: 1,
    BRL: 1,
    CNY: 2,
    MYR: 1,
    VES: 10,
    BOB: 1,
    MXN: 4,
    ARS: 200,
    THB: 10,
    JPY: 30,
    INR: 10,
    VND: 5000,
    IDR: 3000,
    GBP: 0.2,
    EUR: 0.2,
    RUB: 1,
    KRW: 300,
    TRY: 10,
    BGN: 0.4,
    CHF: 0.2,
    CZK: 5,
    DKK: 2,
    HUF: 100,
    NOK: 2,
    NZD: 0.4,
    ZAR: 4,
    PLN: 1,
    RON: 1,
    SEK: 2,
    CLP: 200,
    MMK: 400,
    TWD: 10,
    AMD: 100,
    CRC: 100,
    KES: 30,
    UGX: 1000,
    NGN: 400,
    TZS: 500,
    LKR: 60,
    TMT: 1,
    SGD: 0.3,
    UAH: 10,
    BYN: 1,
    MBT: 0.2,
};

/** CURRENCY SYMBOLS */
export const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$',
    CAD: 'C$',
    AUD: 'A$',
    PEN: 'S/.',
    BRL: 'R$',
    CNY: '¥',
    MYR: 'RM',
    VES: 'Bs.S',
    BOB: 'Bs.',
    MXN: 'Mex$',
    ARS: 'AR$',
    THB: '฿',
    JPY: '¥',
    INR: '₹',
    VND: '₫',
    IDR: 'Rp',
    GBP: '£',
    EUR: '€',
    RUB: '₽',
    KRW: '₩',
    TRY: '₺',
    BGN: 'лв',
    CHF: 'CHF',
    CZK: 'Kč',
    DKK: 'kr',
    HUF: 'Ft',
    NOK: 'kr',
    NZD: 'NZ$',
    ZAR: 'R',
    PLN: 'zł',
    RON: 'lei',
    SEK: 'kr',
    CLP: 'CLP$',
    MMK: 'K',
    TWD: 'NT$',
    AMD: '֏',
    CRC: '₡',
    KES: 'KSh',
    UGX: 'USh',
    NGN: '₦',
    TZS: 'TSh',
    LKR: 'Rs',
    TMT: 'm',
    SGD: 'S$',
    UAH: '₴',
    BYN: 'Br',
    MBT: '฿',
};

/** URL param strings */
export const URL_PARAMS: { [key: string]: string } = {
    language: 'lang',
    currency: 'cur',
};

/** Default Currency Value */
export const DEFAULT_CURRENCY_VALUE: number = 2;

/** Default Currency Code */
export const DEFAULT_CURRENCY_CODE: string = 'EUR';

/** Default Language Code */
export const DEFAULT_LANGUAGE_CODE: string = 'en';

/** Bonus Symbol */
export const BONUS = ['FAN', 'LOTUS', 'BAR', 'YINYANG', 'PIG', 'EIGHT', 'DRAGON'];

/** Bonus Info Symbol */
export const BONUS_INFO = [
    'symbol_amulet_dragon',
    'symbol_amulet_eight',
    'symbol_amulet_pig',
    'symbol_eight',
    'symbol_pig',
    'symbol_yinyang',
    'symbol_bar',
    'symbol_lotus',
    'symbol_fan',
    'symbol_arrow',
    'symbol_arrow',
];

/** Stroke Color */

export const STROKE_COLORS = {
    FAN: '#4dff16',
    LOTUS: '#ff00ea',
    BAR: '#FFB600',
    YINYANG: '#fff21a',
    PIG: '#fff21a',
    EIGHT: '#ff0404',
    DRAGON: '#4dff16',
};

export const WIN_LINES = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
];

/** Server Url */
// export const SERVER_URL = 'http://103.31.13.186:8088';
export const SERVER_URL = 'http://localhost:8080';
