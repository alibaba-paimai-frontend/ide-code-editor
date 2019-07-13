
export function isNumeric(num: any) {
    return !isNaN(num)
}

export function convertIfNumberic(num: any) {
    return isNumeric(num) ? +num : num;
}

/**
 * 解决 monaco editor 被其他域引用导致无法被加载而出现 `Unexpected usage` 报错的问题
 * refer:
 * - [Getting "Unexpected usage" in console](https://github.com/microsoft/monaco-editor-webpack-plugin/issues/32)：主要是参考这个 issue 解决的
 * - [Web Workers 资源跨域问题](https://zhuanlan.zhihu.com/p/47878150)：worker 跨域的解决方法
 * 
 * 主要在入口文件调用以下 `injectMonacoEnvironment` 即可
 */
const DEFAULT_PATH = 'http://npmcdn.alibaba-inc.com/ide-code-editor/dist/';
function getWorkerUrl(publicPath: string, label: string) {
    switch (label) {
        case 'json':
            return publicPath + 'json.worker.js';
        case 'css':
        case 'less':
        case 'scss':
            return publicPath + 'css.worker.js';
        case 'html':
        case 'handlebars':
        case 'razor':
            return publicPath + 'html.worker.js';
        case 'javascript':
        case 'typescript':
            return publicPath + 'typescript.worker.js';
        default:
            return publicPath + 'editor.worker.js';
    }
}

// 解决引入 ide code editor 时造成 worker 跨域的问题
export function injectMonacoEnvironment(publicPath = DEFAULT_PATH) {
    (window as any).MonacoEnvironment = {
        getWorkerUrl: function (workerId: string, label: string) {
            const url = getWorkerUrl(publicPath, label);
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`                        
                    self.MonacoEnvironment = {
                      baseUrl: '${publicPath}'
                    };
                    importScripts('${url}');`)}`;
        }
    };
}
