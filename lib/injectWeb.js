/**
* mix 颜色混合 规则符合 sass - mix
* @param color_1 颜色1
* @param color_2 颜色2
* @param weight 比例 （80% 传80）
* @returns {string}
*/

const mix = function(color_1, color_2, weight) {
    let c1 = color_1.replace(/#/g, ""),
        c2 = color_2.replace(/#/g, "");

    // 将十进制值转换为十六进制
    function d2h(d) {
        return d.toString(16);
    }

    // 将十六进制值转换为十进制
    function h2d(h) {
        return parseInt(h, 16);
    }

    // 如果省略该参数，则将权重设置为50%
    weight = typeof weight !== "undefined" ? weight : 50;

    var color = "#";
    // 循环-红，绿，蓝
    for (var i = 0; i <= 5; i += 2) {
        var v1 = h2d(c1.substr(i, 2)),
            v2 = h2d(c2.substr(i, 2)),
            // 根据指定的权重将来自每个源颜色的当前对组合起来,四舍五入
            val = d2h(Math.round(v2 + (v1 - v2) * (weight / 100.0)));

        // 如果val结果是单个数字，则在前面加上一个'0'
        while (val.length < 2) {
            val = "0" + val;
        }

        color += val;
    }

    return color;
};
const varToColor = function(varStr, varConfig) {
    if(!varStr) return  ''
    // 通过主题工具生成的变量 以'_' 连接
    let arr = varStr.split('_')
    if(arr.length == 1) return varConfig[arr[0]]
    arr = arr.map(v => {
        v = v.replace('--YS','#')
        if(v.startsWith('--')) {
            return varConfig[v]
        }
        return v
    })
    return mix(...arr)
}

/**
* 创建根路径变量 
* @param varConfig {'--customize-theme': '#409EFF'}
**/
export const createRootTheme = function(varConfig = {}) {
    keys.forEach( v => {
        let color = varToColor(v,varConfig)
        let h = document.documentElement;
		h.style.setProperty(v, color)
    })
}