import { Container } from 'pixi.js';
import { BonusInfoBox } from './BonusInfoBox';
import { gameState } from '../../../utils/gameState';
import { sfx } from '../../../utils/audio';

/**Bonous Info*/
export class BonusInfo extends Container {
    /** Bonous Info Boxs */
    public bonusInfoBox: BonusInfoBox[];

    constructor() {
        super();

        /** Add Bonous Info Boxs */
        this.bonusInfoBox = new Array(11).fill(null).map((_, index) => {
            const single = new BonusInfoBox(index);
            single.x = 0;
            single.y = index * (single.bonusInfoBackground.height + 9);
            this.addChild(single);
            return single;
        });
    }

    /** Update by Win Number */
    public updateWinStateBonusInfo(winNumber: number) {
        for (let index = 0; index < 12; index++) {
            if (this.bonusInfoBox[10 - index]) this.bonusInfoBox[10 - index].updateWinState(false);
        }
        const bonusWinNumber = winNumber >= 12 ? 11 : winNumber;
        if (bonusWinNumber > 0) sfx.play('game/Audio/' + bonusWinNumber + 'Blingos.mp3');
        for (let index = 0; index < bonusWinNumber; index++) {
            if (this.bonusInfoBox[10 - index]) this.bonusInfoBox[10 - index].updateWinState(true);
        }
    }

    public resize(width: number, height: number) {
        if (width > height || gameState.currentState.isDesktop) {
        } else {
        }
    }
}
