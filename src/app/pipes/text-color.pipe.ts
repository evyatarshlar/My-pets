import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'textColor',
    standalone: true
})
export class TextColorPipe implements PipeTransform {

    transform(bgColor: string): unknown {
        let r!: number, g!: number, b!: number;
        if (bgColor.startsWith('#')) {
            const hex = bgColor.slice(1);
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else if (hex.length === 6) {
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            }
        } else if (bgColor.startsWith('rgb')) {
            [r, g, b] = bgColor.match(/\d+/g)!.map(Number);
        } else if (bgColor.startsWith('hsl')) {
            const [h, s, l] = bgColor.match(/\d+/g)!.map(Number);
            const rgb = this.hslToRgb(h, s, l);
            r = rgb[0];
            g = rgb[1];
            b = rgb[2];
        }
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155 ? '#191919' : '#fafafa';
    }

    hslToRgb(h: number, s: number, l: number): number[] {
        s /= 100;
        l /= 100;
        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
        return [255 * f(0), 255 * f(8), 255 * f(4)];
    }


}
