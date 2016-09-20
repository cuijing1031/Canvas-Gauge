# Canvas Gauge v0.1

基于canvas的仪表盘和动画。 根据 http://www.fabledweb.com/html5-canvas-gauge.html. 的代码进行了适当修改，在此基础上增加了仪表盘刻度示数和中间总示数

## 使用方法

```javascript
var my_canvas_obj= document.getElementById("my-canvas");
    var gauge= new SOFAGauge({
            "tick_length": 20,
            "large_tick_length": 30,
            "tick_thickness": 1,
            "tick_group_length": 9,
            "ticks_groups_begin": 0,
            "total_degrees": 240,
            "total_tick": 101,
            "tick_color": "#a6a6ad",
            "tick_on_color": "#527d98",
            "tick_on_glow": 0,
            "bg_image": null,
            "gauge_scale": 1,
            "animation_duration": 1000,
            "percent": 0,
            "canvas": my_canvas_obj
    });
    gauge.render(); //render the configured gauge
    gauge.updatePercent(61); //animate the gauge to 61%
```
