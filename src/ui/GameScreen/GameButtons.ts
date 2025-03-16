import { Container } from 'pixi.js';
import { gameState } from '../../utils/gameState';
import { ImageButton, SpinNumberButton, StartSpinButton } from '../Common/Buttons';

/** Extra Symbols */
export class GameButtons extends Container {
    /** Stake Button */
    public stakeButton: ImageButton;

    /** Menu Button */
    public menuButton: ImageButton;

    /** Spin Button */
    public spinButton: StartSpinButton;

    /** Spin Number Button */
    public spinNumberButton: SpinNumberButton;

    constructor() {
        super();

        /** Add Menu Button */
        this.menuButton = new ImageButton({
            image: 'GameButtons/menu',
            imageClick: 'GameButtons/menu_click',
            isCircle: true,
        });
        this.addChild(this.menuButton);

        /** Add Stake Button */
        this.stakeButton = new ImageButton({
            image: 'GameButtons/bet_set',
            imageClick: 'GameButtons/bet_set_click',
            isCircle: true,
        });
        this.addChild(this.stakeButton);

        /** Add Spin Button */
        this.spinButton = new StartSpinButton();
        this.spinButton.interactive = false;
        this.addChild(this.spinButton);

        /** Add Spin Number Button */
        this.spinNumberButton = new SpinNumberButton('SPINS', gameState.currentState.spinNumber);
        this.spinNumberButton.interactive = true;
        this.addChild(this.spinNumberButton);
    }

    /** Resize the background, fired whenever window size changes */
    public resize(width: number, height: number) {
        if (width > height || gameState.currentState.isDesktop) {
            this.menuButton.x = this.width / 2 - this.menuButton.width / 2 - 6;
            this.menuButton.y = 0;

            this.spinButton.x = this.width / 2 - this.spinButton.width / 2 - 6;
            this.spinButton.y = this.menuButton.height + 47;

            this.stakeButton.x = this.width / 2 - this.stakeButton.width / 2 - 6;
            this.stakeButton.y = this.spinButton.y + this.spinButton.height + 44;

            this.spinNumberButton.x = 0;
            this.spinNumberButton.y = this.stakeButton.y + this.stakeButton.height + 73;
        } else {
        }
    }
}
