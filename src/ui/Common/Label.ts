import { TextStyleOptions, Text, TextStyle } from 'pixi.js';

const defaultLabelStyle: Partial<TextStyleOptions> = {
    fontFamily: 'Roboto',
    align: 'center',
};

export type LabelOptions = typeof defaultLabelStyle;

/**
 * A Text extension pre-formatted for this app, starting centered by default,
 * because it is the most common use in the app.
 */
export class Label extends Text {
    constructor(text?: string | number, style?: Partial<TextStyleOptions> | TextStyle) {
        style = { ...defaultLabelStyle, ...style };
        super({ text, style });
        // Label is always centered, but this can be changed in instance afterwards
        this.anchor.set(0.5);
    }

    public updateLabel(text: string | number) {
        this.text = text;
        this.anchor.set(0.5);
    }

    public updateStyle(style: Partial<TextStyleOptions> | TextStyle) {
        this.style = { ...defaultLabelStyle, ...style };
        this.anchor.set(0.5);
    }
}
