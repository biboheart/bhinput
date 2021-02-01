import { punctuation } from '../common/definition';

export class InputArea {
    public readonly containerElement: HTMLElement;
    public readonly showElement: HTMLElement;
    private readonly preElement: HTMLElement;
    private readonly charWidth: number;
    private readonly textHeight: number;
    private textBytesCount: number = 0;

    constructor(el: HTMLElement, text: string) {
        this.containerElement = document.createElement('div');
        this.showElement = document.createElement('div');
        this.preElement = this.computePreElement();
        this.showElement.append(this.preElement);
        this.containerElement.append(this.showElement);
        el.append(this.containerElement);
        // container element style
        this.containerElement.style.position = 'relative';
        this.containerElement.style.width = '100%';
        this.containerElement.style.height = '100%';
        this.containerElement.style.padding = '5px 10px';
        this.containerElement.style.boxSizing = 'border-box';
        // show element style
        this.showElement.style.position = 'relative';
        this.showElement.style.lineHeight = '30px';
        this.showElement.style.minHeight = '30px';
        this.showElement.style.fontSize = '14px';
        this.textHeight = this.computeTextHeight();
        this.charWidth = this.computeCharWidth();
        if (text) {
            const splitArr: string[] = this.splitText(text);
            if (splitArr.length === 0) {
                this.updateText('');
            } else {
                this.updateText(this.connectText(splitArr));
            }
        }
    }

    public updateText(text: string) {
        this.preElement.innerHTML = text;
    }

    private connectText(splitArr: string[]): string {
        const rect = this.preElement.getBoundingClientRect();
        const viewWidth = rect.right - rect.left;
        const rowCharCount = viewWidth / this.charWidth;
        console.log('row width:' + viewWidth, 'count:' + rowCharCount);
        let result = '';
        let c = 0;
        let cChar: string;
        for (let i = 0; i < splitArr.length; i ++) {
            if (c >= rowCharCount) {
                break;
            }
            cChar = splitArr[i];
            if (cChar.length === 1) {
                c += this.charBytesCount(cChar);
            } else {
                for (let j = 0; j < cChar.length; j ++) {
                    c += this.charBytesCount(cChar[j]);
                }
            }
            result += '<span>' + cChar + '</span>';
        }
        return result;
        // return '<span>' + splitArr.join('</span><span>') + '</span>';
    }

    private charBytesCount(char: string): number {
        let c = char.charCodeAt(0);
        if ((c >= 0x0001 && c <= 0x007E) || (0xff60 <= c && c <= 0xFF9F)) {
            return 1;
        } else {
            return 2;
        }
    }

    private splitText(text: string): string[] {
        if (!text) {
            return [];
        }
        this.textBytesCount = 0;
        let splitArr:string[] = [];
        let closedLeft: {
            [key: string]: number|null
        } = {};
        for (let i = 0, n = text.length; i < n; i++) {
            let char = text.charAt(i);
            this.textBytesCount += this.charBytesCount(char);
            if (!punctuation.full.test(char)) {
                if (splitArr.length > 0 && splitArr[splitArr.length - 1].length === 1 && (punctuation.closedPunctuationCode.test(splitArr[splitArr.length - 1])
                || punctuation.firstPunctuationCode.test(splitArr[splitArr.length - 1]))) {
                    // 如果前面只保存了标点符号，则把文字与标点符号合起来
                    splitArr[splitArr.length - 1] += char;
                } else {
                    splitArr.push(char);
                }
                continue;
            }
            if (punctuation.firstPunctuationCode.test(char)) {
                splitArr.push(char);
            } else if (punctuation.tailPunctuationCode.test(char)) {
                if (splitArr.length > 0/*  && !punctuation.full.test(splitArr[splitArr.length - 1]) */) {
                    // 如果前面的记录不是标点符号，则把尾部标点箱号合到文字里
                    splitArr[splitArr.length - 1] += char;
                } else {
                    splitArr.push(char);
                }
            } else if (punctuation.closedPunctuationCode.test(char)) {
                if (!closedLeft[char]) {
                    closedLeft[char] = 1;
                    splitArr.push(char);
                } else if (splitArr.length === 0) {
                    closedLeft[char] = 1;
                    splitArr.push(char);
                } else {
                    closedLeft[char] = 0;
                    splitArr[splitArr.length - 1] += char;
                }
            } else {
                splitArr.push(char);
            }
        };
        console.log(this.textBytesCount);
        return splitArr;
    }

    private computePreElement(absolute?: boolean): HTMLElement {
        let el = document.createElement('pre');
        // pre element style
        el.style.padding = '0';
        el.style.margin = '0';
        el.style.whiteSpace = 'pre-wrap';
        el.style.wordWrap = 'break-word';
        if (absolute) {
            el.style.position = 'absolute';
            el.style.left = '0';
            el.style.top = '0';
            el.style.zIndex = '-1';
        }
        return el;
    }

    private computeTextHeight(): number {
        let measureText = this.computePreElement(true);
        for (let i = 0; i < 49; ++i) {
            measureText.appendChild(document.createTextNode("x"));
            measureText.appendChild(document.createElement("br"));
        }
        measureText.appendChild(document.createTextNode("x"));
        this.showElement.append(measureText);
        let height = measureText.offsetHeight / 50;
        measureText.remove();
        return height || 1;
    }

    private computeCharWidth(): number {
        let measureText = this.computePreElement(true);
        let anchor = document.createElement('span');
        anchor.append(document.createTextNode("xxxxxxxxxx"));
        measureText.append(anchor);
        this.showElement.append(measureText);
        let rect = anchor.getBoundingClientRect();
        let width = (rect.right - rect.left) / 10;
        measureText.remove();
        return width || 10;
    }
}
