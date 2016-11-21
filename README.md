# Canvas Gauge v0.1

基于canvas的仪表盘和动画。 根据 http://www.fabledweb.com/html5-canvas-gauge.html. 的代码进行了适当修改，在此基础上增加了仪表盘刻度示数和中间总示数

## 配置
|名称|类型|默认值|作用|
|:----|:-------|:--------|:---------|
|tick_length|Int|80|短刻度长度|
|large_tick_length|Int|110|长刻度长度|
|tick_thickness|Int|6|刻度条宽度|
|tick_group_length|Int|9|每组内的短刻度个数|
|ticks_groups_begin|Int|0|起始点|
|total_degrees|Int|240|刻度的总角度|
|tick_color|String|'#555962'|未达到的刻度颜色|
|tick_on_color|String|'#527d98'|已达到的刻度颜色|
|bg_image|String|null|刻度盘的背景图片|
|gauge_scale|Int|1|缩放比例|
|animation_duration|Int|550|达到目标值的动画时间|
|total_tick|Int|101|刻度总个数|
|show_num|Boolean|true|是否展示长刻度下的数字|
|show_center_num|Boolean|true|是否显示中间大的数字|
|center_font_size|Int|200|中间数字font-size|
|center_num_font_family|String|''|中间数字font-family|
|center_offset|Int|0|中间数字上下位置的便宜|
|num_gap|Int|1|每个刻度之间的间隔值，计算显示数字时需要|
|num_begin|Int|0|起始刻度值|
|num_font_size|Int|24|刻度值字体大小|
|num_offset|Int|10|刻度值距离刻度的间隔, 单位px|
|num_font_family|String| 'HanHei SC,PingFang SC,Helvetica Neue Thin, Helvetica, STHeitiSC-Light, Arial, sans-serif'|刻度数字font-family|
|triangle_height|Int|24|刻度指示三角形的 高度+triangle_offset|
|triangle_width|Int|16|刻度指示三角形的底部宽度|
|triangle_offset|Int|8|刻度指示三角形距离刻度的空隙|
## 使用方法

```javascript
var my_canvas_obj= document.getElementById("my-canvas");
var gauge= new SOFAGauge({
        "tick_length": 20, // 短刻度长度
        "large_tick_length": 30, // 长刻度长度
        "tick_thickness": 1, //刻度条宽度
        "tick_group_length": 9, //每组内的短刻度个数
        "ticks_groups_begin": 0, //起始点
        "total_degrees": 240, // 刻度的总角度
        "total_tick": 101,  // 刻度总个数
        "tick_color": "#a6a6ad", // 未达到的刻度颜色
        "tick_on_color": "#527d98", // 已达到的刻度颜色
        "bg_image": null,
        "gauge_scale": 1, // 缩放比例
        "animation_duration": 1000, //达到目标值的动画时间
        "percent": 0, // 起始百分比
        "canvas": my_canvas_obj // canvas元素
    });
gauge.render(); //render the configured gauge
gauge.updatePercent(60); //animate the gauge to 60%
```
## demo

[仪表盘demo](https://cuijing1031.github.io/demo/gauge/)
