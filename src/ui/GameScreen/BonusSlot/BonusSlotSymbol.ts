import { FancyButton } from '@pixi/ui';
import { Sprite, Texture } from 'pixi.js';
import { gsap } from 'gsap/gsap-core';
import { Label } from '../../Common/Label';
import { REEL_SPEED } from '../../../config';
import { sfx } from '../../../utils/audio';

/** Bonus Slot Symbol */
export class BonusSlotSymbol extends FancyButton {
    /** Background for Bonus Table Symbol */
    public bonuSymbolBackground: Sprite;

    /** Text for Bonus Table Symbol */
    public bonusSymbol: Sprite;

    /** Effect for Bonus Table Symbol */
    public bonusSymbolEffect: Sprite | undefined;

    /** Effect line for Bonus Table Symbol */
    public bonusSymbolLine: Sprite | undefined;

    /** Bonus Label */
    public bonusLabel: Label | undefined;

    constructor(symbol: string) {
        super();
        /** Add Bonus Background Image */
        const bonusTypeBackgroundTexture = Texture.from('BonusSlot/reel');
        this.bonuSymbolBackground = new Sprite(bonusTypeBackgroundTexture);
        this.bonuSymbolBackground.height = (this.bonuSymbolBackground.height - 16) / 3;
        this.bonuSymbolBackground.anchor.set(0.5);
        this.addChild(this.bonuSymbolBackground);
        this.bonuSymbolBackground.x = this.width / 2;
        this.bonuSymbolBackground.y = this.height / 2;
        this.bonuSymbolBackground.alpha = 0;

        /** Add Bonus Label */
        const bonusSymbolTexture = Texture.from('BonusSlot/Symbols/' + symbol);
        this.bonusSymbol = new Sprite(bonusSymbolTexture);
        this.bonusSymbol.anchor.set(0.5);
        this.addChild(this.bonusSymbol);
        this.bonusSymbol.x = this.bonuSymbolBackground.width / 2;
        this.bonusSymbol.y = this.bonuSymbolBackground.height / 2;
        this.bonusSymbol.zIndex = 10;
    }

    /** Show Effect Symbol */
    public showEffectSymbol(symbol: string, type?: number) {
        sfx.play('game/Audio/BSWin.mp3');
        const bonusSymbolTexture = Texture.from('BonusSlot/Star/star_' + symbol.toLowerCase());
        this.bonusSymbolEffect = Sprite.from(bonusSymbolTexture);
        this.bonusSymbolEffect.scale.x = 0;
        this.bonusSymbolEffect.scale.y = 0;
        this.bonusSymbolEffect.anchor.set(0.5);
        this.bonusSymbolEffect.x = this.bonuSymbolBackground.width / 2;
        this.bonusSymbolEffect.y = this.bonuSymbolBackground.height / 2;
        this.bonusSymbolEffect.zIndex = this.bonusSymbol.zIndex + 1;
        this.addChild(this.bonusSymbolEffect);

        if (type !== undefined) {
            const lineTexture =
                type === 0
                    ? Texture.from('BonusSlot/Line/winline_' + symbol.toLowerCase() + '_horizontal')
                    : type === 1
                      ? Texture.from('BonusSlot/Line/winline_' + symbol.toLowerCase() + '_diagonal')
                      : Texture.from('BonusSlot/Line/winline_' + symbol.toLowerCase() + '_rotate');
            this.bonusSymbolLine = Sprite.from(lineTexture);
            this.bonusSymbolLine.alpha = 0;
            this.bonusSymbolLine.anchor.set(0.5);
            this.bonusSymbolLine.x = this.bonuSymbolBackground.width / 2 + this.bonusSymbolLine.width / 2;
            this.bonusSymbolLine.y =
                type === 0
                    ? this.bonuSymbolBackground.height / 2
                    : type === 1
                      ? this.bonuSymbolBackground.height / 2 + this.bonusSymbolLine.height / 2
                      : this.bonuSymbolBackground.height / 2 - this.bonusSymbolLine.height / 2;
            this.bonusSymbolLine.zIndex = this.bonusSymbol.zIndex - 1;

            this.addChild(this.bonusSymbolLine);
        }

        const timeline = gsap.timeline();

        if (this.bonusSymbolLine) {
            gsap.to(this.bonusSymbolLine, {
                duration: REEL_SPEED * 2.5,
                alpha: 1,
                ease: 'none',
            });
        }

        timeline
            .to(this.bonusSymbolEffect.scale, {
                duration: REEL_SPEED * 2.5,
                x: 1,
                y: 1,
                ease: 'none',
            })
            .to(this.bonusSymbolEffect.scale, {
                duration: REEL_SPEED * 2.5,
                x: 0,
                y: 0,
                ease: 'none',
                onComplete: () => {
                    if (this.bonusSymbolEffect) {
                        this.removeChild(this.bonusSymbolEffect);
                    }
                },
            });
    }

    /** Remove Show Effect */
    public removeShowEffect() {
        if (this.bonusSymbolLine) {
            this.removeChild(this.bonusSymbolLine);
        }
    }
}
