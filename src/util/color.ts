function eqSet(as: Set<Color>, bs: Set<Color>): boolean {
    if (as.size !== bs.size) return false;
    for (const a of as)
        if (!bs.has(a)) return false;
    return true;
}

export class Color {
    // RGB is actually sRGB
    // https://www.w3.org/TR/css-color-3/#hsl-color
    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    // https://en.wikipedia.org/wiki/HSL_and_HSV#Formal_derivation 
    static nameList = new Map();

    // Useful references
    // https://www.color-name.com/
    // https://htmlcolorcodes.com/color-names/
    static White = new Color("hex", "#FFFFFF").addName("White");
    static LightGray = new Color("hex", "#D3D3D3").addName("LightGray");
    static Gray = new Color("hex", "#969892").addName("Gray");
    static DarkGray = new Color("hex", "#696969").addName("DarkGray");
    static Black = new Color("hex", "#000000").addName("Black");

    static Red = new Color("hex", "#F44336").addName("Red");
    static Green = new Color("hex", "#4CAF50").addName("Green");
    static Blue = new Color("hex", "#2196F3").addName("Blue");

    static Yellow = new Color("hex", "#F7C475").addName("Yellow");
    static Magenta = new Color("hex", "#F5B2F6").addName("Magenta");
    static Cyan = new Color("hex", "#63DEF7").addName("Cyan");

    static random(): Color {
        const color = "#" + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, "0");
        return new Color("hex", color);
    }

    static add(colors: Array<Color>): Color {
        const colorsSet = new Set(colors);
        switch (colors.length) {
            case 0:
                return this.Black;
            case 1:
                return colors[0];
            case 2:
                if (eqSet(colorsSet, new Set([this.Red, this.Green]))) { return this.Yellow; }
                if (eqSet(colorsSet, new Set([this.Red, this.Blue]))) { return this.Magenta; }
                if (eqSet(colorsSet, new Set([this.Green, this.Blue]))) { return this.Cyan; }
                if (eqSet(colorsSet, new Set([this.Yellow, this.Blue]))) { return this.White; }
                if (eqSet(colorsSet, new Set([this.Magenta, this.Green]))) { return this.White; }
                if (eqSet(colorsSet, new Set([this.Cyan, this.Red]))) { return this.White; }
                break;
            case 3:
                if (eqSet(colorsSet, new Set([this.Red, this.Green, this.Blue]))) { return this.White; }
                break;
        }
        const r = colors.reduce((accumulator, currentValue) => accumulator + currentValue.rgb[0], 0) / colors.length;
        const g = colors.reduce((accumulator, currentValue) => accumulator + currentValue.rgb[1], 0) / colors.length;
        const b = colors.reduce((accumulator, currentValue) => accumulator + currentValue.rgb[2], 0) / colors.length;
        return new Color("rgb", r, g, b);
    }

    static isValidColor(string: string): boolean {
        const s = new Option().style;
        s.color = string;
        return s.color === string;
    }

    static RGBtoHSL(r: number, g: number, b: number): Array<number> {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b); // v
        const min = Math.min(r, g, b);
        const c = max - min;

        let hue: number;
        if (c === 0) {
            hue = 0;
        } else {
            switch (max) {
                case r: {
                    const segment = (g - b) / c;
                    let shift = 0 / 60; // R?? / (360?? / hex sides)
                    if (segment < 0) { // hue > 180, full rotation
                        shift = 360 / 60; // R?? / (360?? / hex sides)
                    }
                    hue = segment + shift;
                    break;
                }
                case g: {
                    const segment = (b - r) / c;
                    const shift = 120 / 60; // G?? / (360?? / hex sides)
                    hue = segment + shift;
                    break;
                }
                case b: {
                    const segment = (r - g) / c;
                    const shift = 240 / 60; // B?? / (360?? / hex sides)
                    hue = segment + shift;
                    break;
                }
            }
        }
        hue *= 60; // hue is in [0,6], scale it up
        const s = c / (1 - Math.abs(2 * max - c - 1));
        const l = (min + max) / 2;
        return [hue, s, l];
    }

    static HSLtoRGB(h: number, s: number, l: number): Array<number> {
        const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        const m1 = 2 * l - m2;
        const r = this.HUEtoRGB(m1, m2, h + 1 / 3);
        const g = this.HUEtoRGB(m1, m2, h);
        const b = this.HUEtoRGB(m1, m2, h - 1 / 3);
        return [r, g, b];
    }

    static HUEtoRGB(m1: number, m2: number, h: number): number {
        if (h < 0) { h++; }
        if (h > 1) { h -= 1; }
        if (h < 1 / 6) return m1 + (m2 - m1) * h * 6;
        if (h < 1 / 2) return m2;
        if (h < 2 / 3) return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        return m;
    }

    static RGBtoHEX(r: number, g: number, b: number): string {
        return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
    }

    static HEXtoRGB(hex: string): Array<number> {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result === null) {
            throw new Error("Fail to use regex to get RGB from HEX");
        } else {
            return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
        }
    }

    name: string;
    type: string;
    hsl: Array<number>;
    rgb: Array<number>;
    hex: string;
    alpha: number;

    constructor(type: string, ...color: any) {
        this.type = type;
        switch (type) {
            case "HSL":
            case "hsl":
                this.hsl = color.slice(0, 3);
                this.rgb = Color.HSLtoRGB(...this.hsl);
                this.hex = Color.RGBtoHEX(...this.rgb);
                this.alpha = color[3] || 1;
                break;
            case "RGB":
            case "rgb":
                this.rgb = color.slice(0, 3);
                this.hsl = Color.RGBtoHSL(...this.rgb);
                this.hex = Color.RGBtoHEX(...this.rgb);
                this.alpha = color[3] || 1;
                break;
            case "HEX":
            case "hex":
                this.hex = color[0].slice(0, 7);
                this.rgb = Color.HEXtoRGB(this.hex);
                this.hsl = Color.RGBtoHSL(...this.rgb);
                this.alpha = color[1] || 1;
                break;
        }
    }

    addName(name: string): Color {
        this.name = name;
        Color.nameList.set(name, this);
        return this;
    }

    static findName(name: string): Color {
        return this.nameList.has(name) ? this.nameList.get(name) : this.random();
    }

    setAlpha(alpha: number): Color {
        this.alpha = alpha;
        return this;
    }

    HSL(): string {
        return `hsl(${this.hsl[0]}, ${this.hsl[1] * 100}%, ${this.hsl[2] * 100}%)`;
    }

    HSLA(a: number): string {
        const alpha = a || this.alpha;
        return `hsla(${this.hsl[0]}, ${this.hsl[1] * 100}%, ${this.hsl[2] * 100}%, ${alpha})`;
    }

    RGB(): string {
        return `rgb(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]})`;
    }

    RGBA(a: number): string {
        const alpha = a || this.alpha;
        return `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, ${alpha})`;
    }

    HEX(): string {
        return this.hex;
    }

    HEXA(a: number): string {
        const alpha = a || this.alpha;
        return this.hex + Math.round(alpha * 255).toString(16).toUpperCase();
    }

}