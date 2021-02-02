import { InputArea } from './input/inputArea';
// import { changeStringToCode } from './common/definition';

export class Editor {
    public readonly inputArea: InputArea;

    constructor(el: HTMLElement) {
        // console.log(el);
        // changeStringToCode();
        const content = '昨昨晚昨晚打篮球，被同事肘击了下巴，开口，血如柱下，缝了3针。' +
                            '其实这点皮外伤没什么的，重要的也是麻烦的是，媳妇知道了，勒令2个' + 
                            '月不准打篮球，这次抱大腿都没用了，队友也让我好好服刑。';
        // const content = '予藤黄健骨片1盒，每日2次，每次2g，接骨七厘胶囊1盒，每日2次，每次0.52g，饭后口服。';
        this.inputArea = new InputArea(el, content);
    }
}

function bhEditor(el: HTMLElement) {
    return new Editor(el);
}

export default bhEditor;
