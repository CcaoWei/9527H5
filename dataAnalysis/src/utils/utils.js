// const httpAjax = 'http://api.app.wantianx.com/'; //线上
const httpAjax = 'http://39.105.231.43:9001/' // 测试服
// const httpAjax = 'http://10.1.2.172:9001/'; //大瑶

const setAdaption = (baseFontsize) => {
  baseFontsize = baseFontsize || 16;
  let docEl = document.documentElement;
 
  let refresh = () => {
    let dpr = window.devicePixelRatio;
    let deviceWidth = window.screen.width;
    let deviceFontsize = deviceWidth / 375 * baseFontsize + 'px'; // 计算rem基准值
    docEl.setAttribute('data-dpr', dpr);
    docEl.style.fontSize = deviceFontsize;
  };

  window.addEventListener('pageshow', function(e) {
    if (!e.pretersised) {
       refresh();
    }
  }, false);
  window.addEventListener('resize', function() {
    refresh();
  }, false);
};
const calcFont = (baseFontsize) => {
    baseFontsize = baseFontsize || 16;
    let deviceWidth = window.screen.width;
    let deviceFontsize = deviceWidth / 375 * baseFontsize; // 计算rem基准值
    return deviceFontsize;
}
const setAdaptionBig = (fn,baseFontsize) => {
  baseFontsize = baseFontsize*10 || 16*10;
  let docEl = document.documentElement;
  let refresh = () => {
    let dpr = window.devicePixelRatio;
    // let deviceWidth = window.screen.width;
    let deviceWidth = window.innerWidth;
    let deviceFontsize = deviceWidth / 4428 * baseFontsize + 'px'; // 计算rem基准值
    docEl.setAttribute('data-dpr', dpr);
    docEl.style.fontSize = deviceFontsize;
    window.deviceFontsize = deviceFontsize;
    if(fn) {
      fn()
    }
  };

  window.addEventListener('pageshow', function(e) {
    if (!e.pretersised) {
      refresh();
    }
  }, false);
  window.addEventListener('resize', function(e) {
    refresh();
  }, false);
};
export default {
  setAdaption,
  setAdaptionBig,
  calcFont,
  httpAjax
}
