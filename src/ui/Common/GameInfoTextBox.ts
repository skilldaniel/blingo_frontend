import { Container, Sprite, Texture } from 'pixi.js';
import { Label } from './Label';

export class GameInfoTextBox extends Container {
    public titleLabel: Label;
    public descriptionLabel: Label[] = [];
    public symbols: any;
    constructor(title: string, description: string[], image?: string[]) {
        super();
        let height = 0;
        if (image) {
            if (image.length == 1) {
                const imageTexture = Texture.from(image[0]);
                this.symbols = [];
                this.symbols[0] = new Sprite(imageTexture);
                if (this.symbols[0].width > 750) {
                    this.symbols[0].scale = 750 / this.symbols[0].width;
                }
                this.symbols[0].y = 20;
                height = this.symbols[0].height;
                this.addChild(this.symbols[0]);
            } else {
                for (let i = 0; i < image.length; i++) {
                    const imageTexture = Texture.from(image[i]);
                    this.symbols = [];
                    this.symbols[i] = new Sprite(imageTexture);
                    this.symbols[i].x = i * this.symbols[i].width;
                    this.symbols[i].y = 30;
                    height = this.symbols[i].height;
                    this.addChild(this.symbols[i]);
                }
            }
        }
        const singleLabel = new Label(title, {
            fill: '#ff0054',
            fontFamily: 'Roboto',
            fontSize: '25px',
            fontWeight: 'bold',
            letterSpacing: 2,
        });
        singleLabel.x = singleLabel.width / 2;
        singleLabel.y = 0;

        this.titleLabel = singleLabel;
        this.addChild(this.titleLabel);

        for (let i = 0; i < description.length; i++) {
            const loopLabel = new Label(description[i], {
                fill: '#ffffff',
                fontFamily: 'Roboto',
                fontSize: '20px',
                fontWeight: '400',
                letterSpacing: 2,
            });
            if (image) {
                if (image.length == 1) {
                    loopLabel.x = loopLabel.width / 2 + this.symbols[0].width + 20;
                    loopLabel.y = i * loopLabel.height + this.titleLabel.y + this.titleLabel.height + height * 0.1;
                } else {
                    loopLabel.x = loopLabel.width / 2;
                    loopLabel.y = i * loopLabel.height + this.titleLabel.y + this.titleLabel.height + height + 20;
                }
            } else {
                loopLabel.x = loopLabel.width / 2;
                loopLabel.y = i * loopLabel.height + this.titleLabel.y + this.titleLabel.height;
            }
            this.descriptionLabel.push(loopLabel);
            this.addChild(this.descriptionLabel[this.descriptionLabel.length - 1]);
        }
    }
}
