import { Container } from 'pixi.js';

import { BonusStartButton } from '../../Common/Buttons';
import { BonusSlotTable } from './BonusSlotTable';
import { INITIAL_BONUS_SLOT_TABLE } from '../../../config';
import { gameState } from '../../../utils/gameState';
import { sfx } from '../../../utils/audio';

/** Bonus Slot */
export class BonusSlot extends Container {
    /** Bonus Slot Table */
    public bonusSlotTable: BonusSlotTable;
    public bonusStartButton: BonusStartButton;

    constructor() {
        super();

        this.bonusSlotTable = new BonusSlotTable(INITIAL_BONUS_SLOT_TABLE);
        this.addChild(this.bonusSlotTable);

        this.bonusStartButton = new BonusStartButton();
        this.bonusStartButton.interactive = true;
        this.addChild(this.bonusStartButton);

        this.bonusStartButton.on('pointertap', this.spin.bind(this));
    }

    /**Event when spin button click */
    public spin() {
        sfx.play('game/Audio/BSReelStart.mp3');
        this.bonusStartButton.updateButtonType(false);
        this.bonusStartButton.updateWinValue();
        this.bonusSlotTable.spin();
    }

    public resize(width: number, height: number) {
        if (width > height || gameState.currentState.isDesktop) {
            this.bonusStartButton.x = this.width / 2 - this.bonusStartButton.width / 2;
            this.bonusStartButton.y = this.bonusSlotTable.height + 30;
        } else {
        }
    }
}
