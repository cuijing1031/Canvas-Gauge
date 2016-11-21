/**
 * 绘制刻度盘
 * 配置参数
 *  tick_length: 80, // 短刻度长度
    large_tick_length: 110, // 长刻度长度
    tick_thickness: 6, //刻度条宽度
    tick_group_length: 9, //每组内的短刻度个数
    ticks_groups_begin: 0, //起始点
    total_degrees: 240, // 刻度的总角度
    tick_color: "#555962",  // 未达到的刻度颜色
    tick_on_color: "#527d98", // 已达到的刻度颜色
    bg_image: null,  // 刻度盘的背景图片
    gauge_scale: 1, // 缩放比例
    animation_duration: 550, //达到目标值的动画时间
    total_tick: 101, // 刻度总个数
    show_num: true, // 是否展示长刻度下的数字
    show_center_num: true, // 是否显示中间大的数字
    center_font_size: 200, //中间数字font-size
    center_num_font_family: ,//中间数字font-family
    center_offset: 0, // 中间数字上下位置的便宜
    num_gap: 1, // 每个刻度之间的间隔值，计算显示数字时需要
    num_begin: 0, // 起始刻度值
    num_font_size: 24, // 刻度值字体大小
    num_offset: 10 // 刻度值距离刻度的间隔, 单位px,
    num_font_family: 'HanHei SC,PingFang SC,Helvetica Neue Thin, Helvetica, STHeitiSC-Light, Arial, sans-serif' // 刻度数字font-family
    triangle_height: 24, // 刻度指示三角形的 高度+triangle_offset
    triangle_width: 16, // 刻度指示三角形的底部宽度
    triangle_offset: 8 // 刻度指示三角形距离刻度的空隙
 *@method [render]  绘制初始图形
 *@method [setTickOnColor] 设置tick_on_color颜色
 *@method [setAnimaDur] 设置动画总时间
 *@method [updatePercent] 示数动画开始
 *@example
 * 使用方法
 *  var my_canvas_obj= document.getElementById("my-canvas");
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
        "bg_image": null,
        "gauge_scale": 1,
        "animation_duration": 1000,
        "percent": 0,
        "canvas": my_canvas_obj
     });
     gauge.render(); //render the configured gauge
     gauge.updatePercent(60); //animate the gauge to 60%
 */
(function (window) {
  function Gauge (options) {
    //set defaults
    var properties= {
      tick_length: 80,
      large_tick_length: 110,
      tick_thickness: 6,
      tick_group_length: 9,
      ticks_groups_begin: 0,
      total_degrees: 240,
      tick_color: "#555962",
      tick_on_color: "#527d98",
      bg_image: null, 
      gauge_scale: 1,
      animation_duration: 550,
      total_tick: 101,
      show_num: true,
      show_center_num: true,
      center_font_size: 200,
      center_offset: 0,
      center_num_font_family: 'HanHei SC,PingFang SC,Helvetica Neue Thin, Helvetica, STHeitiSC-Light, Arial, sans-serif',
      num_gap: 1,
      num_begin: 0,
      num_font_size: 16,
      num_offset: 0,
      num_font_family: 'HanHei SC,PingFang SC,Helvetica Neue Thin, Helvetica, STHeitiSC-Light, Arial, sans-serif',
      triangle_height: 24,
      triangle_width: 16,
      triangle_offset: 8
    };
    // naive Object.keys shim, but I know what the object looks like (it's right above here)
    var objectKeys = Object.keys || function(o) {var result = [];for (var name in o) {result.push(name);}return result;};
    this._property_list = objectKeys(properties);
    // set object properties based on options and defaults
    for(var k in properties) {
      this[k] = options[k] || properties[k];
    }
    this.canvas = options.canvas;
    this.delatLength = this.large_tick_length - this.tick_length;
    this.context = this.canvas.getContext("2d");
    this._percent = options.percent || 0;
    this._target_percent = this._percent;
    this.num_offset = this.num_offset + this.triangle_height / 2;
    return this;
  }

  Gauge.prototype._requestAnimFrame = function (f) {
    var anim = window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.oRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function (callback, element) {
        window.setTimeout(function () {
          callback(+new Date);
        }, 1000 / 60);
      };
    anim(f);
  };

  Gauge.prototype.getCurrentState = function() {
    var state= {};
    for (var i in this._property_list) {
      var prop = this._property_list[i];
      state[prop] = this[prop];
    }
    state.percent = this._target_percent;
    return state;
  };
  Gauge.prototype._applyBG = function () {
    var canvas = this.canvas;
    var context = this.context;
    if (this.bg_color) {
      context.save();
      context.fillStyle = this.bg_color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();
    }
    if (this.bg_image) {
      if(!this.bg_image_obj) { //only load the image once
        this.bg_image_obj = new Image();
        var _this = this;
        this.bg_image_obj.onload  = function () {
          _this.bg_image_loaded = true;
          context.drawImage(_this.bg_image_obj, canvas.width/2-_this.bg_image.width/2+_this.bg_image.xoffset, canvas.height-_this.bg_image.height-_this.bg_image.yoffset, _this.bg_image.width,_this.bg_image.height);
        };
        this.bg_image_obj.src = this.bg_image.url;
      }
      else {
        if (this.bg_image_loaded) {
          context.drawImage(this.bg_image_obj, canvas.width/2-this.bg_image.width/2+this.bg_image.xoffset, canvas.height-this.bg_image.height-this.bg_image.yoffset);
        }
      }
    }
  };
  Gauge.prototype._prepareStage = function() {
    var canvas = this.canvas;
    var context = this.context;
    //clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //set background
    this._applyBG();
    //set the center of rotation to the bottom/center of the canvas
    context.translate(canvas.width / 2, canvas.height / 2 - this.tick_thickness / 2);
    //set the scale of the gauge (will naturally fill the width of the canvas
    context.scale(this.gauge_scale, this.gauge_scale);
    //draw center big num
    if (this.show_center_num) {
      this.drawCenterNum();
    }
  };
  Gauge.prototype.isLargeTick = function(currentNum) {
    return (currentNum + this.ticks_groups_begin - 1) % (this.tick_group_length + 1) === 0
  };
  Gauge.prototype.drawTriangle = function (beginX, beginY) {
    var context = this.context;
    context.save();
    context.fillStyle = this._percent < 0.1 ? this.tick_color : this.tick_on_color;
    context.rotate(this._percent * this.total_degrees / 100 * Math.PI / 180);
    context.beginPath();
    context.moveTo(-beginX, -beginY - this.triangle_width / 2);
    context.lineTo(-beginX, -beginY + this.triangle_width / 2);
    context.lineTo(-beginX + this.triangle_height - this.triangle_offset, -beginY);
    context.fill();
    context.restore();
  };
  Gauge.prototype.drawCenterNum = function () {
    var context = this.context;
    var canvas = this.canvas;
    context.save();
    context.fillStyle = this.tick_on_color;
    context.font = this.center_font_size + 'px ' + this.center_num_font_family;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    var centerText = Math.floor(this._percent * ((this.total_tick - 1) * this.num_gap + this.num_begin) / 100)
    context.fillText(centerText, 0, this.center_offset);
    context.restore();
  }
  Gauge.prototype.drawGaugeNum = function (tick_length, tickIndex) {
    var canvas = this.canvas;
    var context = this.context;
    var text = this.num_begin + this.num_gap*tickIndex - 1;
    var textWidth = context.measureText(text).width;
    context.save();
    //set the center of rotation to the text middle
    context.translate(-1 * (canvas.width / 2) + tick_length + this.triangle_height + this.num_font_size / 2, -this.tick_thickness / 2);
    context.rotate(-90 * Math.PI / 180);
    context.font = this.num_font_size + 'px ' + this.num_font_family;
    context.textAlign ='center';
    context.textBaseline ='middle';
    context.fillText(text , 0, this.num_offset);
    context.restore();
  }
  Gauge.prototype.render = function () {
    var canvas = this.canvas;
    var context = this.context;
    context.save(); //save original state of context to that it can be restore after rendering
    this._prepareStage();
    //figure out how many degrees between each tick
    var num_ticks = this.total_tick;
    var rotation_deg = this.total_degrees / (num_ticks - 1);
    //adjust for smaller than 180 degree gauges
    var starting_deg = (180 - this.total_degrees) / 2;
    context.rotate(starting_deg * Math.PI / 180);
    this.drawTriangle(canvas.width/2, this.tick_thickness/2, 0);
    //draw all of the ticks
    for(var i = 1; i <= num_ticks; i++) {
      //should this tick be on or off?
      var is_on = (((i - 1) / num_ticks) * 100 < this._percent);
      //scale the ticks at group split
      var isLargeTick = this.isLargeTick(i)
      var rect_scale = isLargeTick ? this.large_tick_scale : 1;
      var tick_length = isLargeTick ? this.large_tick_length : this.tick_length;
      //draw tick
      var color = is_on ? this.tick_on_color : this.tick_color;
      context.fillStyle = color;
      if (isLargeTick) {
        context.fillRect(-1*(canvas.width/2) + this.triangle_height, -this.tick_thickness/2, tick_length, this.tick_thickness);
        if (this.show_num) {
          this.drawGaugeNum(tick_length, i);
        }
      } else {
        context.fillRect(-1*(canvas.width/2) + this.triangle_height + this.delatLength, -this.tick_thickness/2, tick_length, this.tick_thickness);
      }
      //rotate for next tick to be placed
      context.rotate(rotation_deg*Math.PI/180);
    }
    context.restore(); //set back to original state
    return true;
  };
  Gauge.prototype.setTickOnColor = function (colorStr) {
    this.tick_on_color = colorStr;
  }
  Gauge.prototype.setAnimaDur = function (duration) {
    this.animation_duration = duration;
  }
  Gauge.prototype.updatePercent = function(percent, options) {
    if (percent - 0.1 < 0) {
      return;
    }
    var _this = this;
    this._target_percent = percent;
    options = options || {};
    var duration = ('animation_duration' in options) ? options.animation_duration : _this.animation_duration;
    if(duration) {
      var lastUpdate = new Date().getTime();
      var start = this._percent;
      var end = this._target_percent;
      var change_per_ms = (end - start)/duration;
      var increasing = change_per_ms > 0 ? 1 : 0;
      var update = function () {
        var now = new Date().getTime();
        var elapsed = now - lastUpdate;
        _this._percent += elapsed*change_per_ms;
        lastUpdate= now;
        //check if we've made it to our stopping point
        if ((increasing && _this._percent < _this._target_percent) 
          || (!increasing && _this._percent > _this._target_percent)) {
          _this.render();
          _this._requestAnimFrame(update);
        }
        else {
          _this._percent = _this._target_percent;
          _this.render();
        }
      };
      _this._requestAnimFrame(update);
    }
    else {
      _this._percent = percent;
      _this.render();
    }
  };
  window.SOFAGauge= Gauge;
}
)(window);
