(function ($) {
  //input事件用这个限制，blur事件后再判断是不是以.结尾
  function formatMoney (money) {
    var rawMoney = money
    if (!money) {
      return false
    }
    let info = {
      should: true,
      text: ''
    }
    var notNumberReg = /[^\d.]/g
    //移除非数字和.
    if (notNumberReg.test(money)) {
      money = money.replace(notNumberReg, '')
    }
    //不能有012这种
    if ((money.indexOf('0') === 0) && (money.indexOf('.') !== 1)) {
      money = money.substr(0, 1)
    }
    //不能是.开头
    if (money.indexOf('.') === 0) {
      money = ''
    }
    //防止多.
    if (money.split('.').length > 2) {
      money = money.split('.').slice(0, 2).join('.')
    }
    //需要限制在两位
    var LimitReg = /^\d+\.\d{3,}$/
    if (money && LimitReg.test(money)) {
      money = (Math.floor(money * 100) / 100).toFixed(2).toString()
    }
    if (rawMoney === money) {
      return false
    } else {
      info.text = money
      return info
    }
  }

  function verifyConfigItem(item) {
    if (!item.name) {
      console.error('缺少name');
    }
    if (!item.id) {
      console.error('缺少id');
    }
  }

  function initInput(inputItem) {
    inputItem.$el.val(inputItem.defaultValue);
    if (inputItem.$bindTextEl) {
      inputItem.$bindTextEl.text(inputItem.defaultValue);
    }
    inputItem.$el.on('input', function (e) {
      if (inputItem.$bindTextEl) {
        inputItem.$bindTextEl.text(e.target.value);
      }
      if (inputItem.onChange) {
        inputItem.onChange(e.target.value);
      }
    });
  }

  function JqueryForm(config) {
    var inputMap = [];
    for (var i = 0; i < config.length; i++) {
      var configItem = config[i];
      verifyConfigItem(configItem);
      var $el = $('#' + configItem.id);
      var inputItem = {
        name: configItem.name,
        id: configItem.id,
        $el: $el,
        defaultValue: configItem.defaultValue || ''
      };
      if (configItem.bindTextId) {
        inputItem.bindTextId = configItem.bindTextId;
        inputItem.$bindTextEl = $('#' + configItem.bindTextId);
      }
      if (configItem.onChange) {
        inputItem.onChange = configItem.onChange;
      }
      if (configItem.rule) {
        inputItem.rule = configItem.rule;
      }
      inputMap[configItem.name] = inputItem;
    }
    this.inputMap = inputMap;
    this.init();
  }

  JqueryForm.prototype = {
    init: function () {
      var inputMap = this.inputMap;
      for (var key in inputMap) {
        var inputItem = inputMap[key];
        initInput(inputItem);
      }
    },
    getFormData: function () {
      var data = {};
      var inputMap = this.inputMap;
      for (var key in inputMap) {
        var inputItem = inputMap[key];
        data[key] = inputItem.$el.val();
      }
      return data;
    },
    setFormData: function (data) {
      var inputMap = this.inputMap;
      for (var key in data) {
        var inputItem = inputMap[key];
        //字段存在
        if (inputItem) {
          inputItem.$el.val(data[key]);
          if (inputItem.$bindTextEl) {
            inputItem.$bindTextEl.text(data[key]);
          }
          if (inputItem.onChange) {
            inputItem.onChange(data[key]);
          }
        }
      }
    },
    find: function(name) {
      if (this.inputMap[name]) {
        return this.inputMap[name].$el;
      }
    },
    verify: function (data) {
      var inputMap = this.inputMap;
      for (var key in data) {
        var inputItem = inputMap[key];
        //字段存在
        if (inputItem && inputItem.rule) {
          var result = inputItem.rule(data[key]);
          if (result !== true) {
            return {
              success: false,
              errorMessage: result
            };
          }
        }
      }
      return {
        success: true
      };
    }
  };
  window.JqueryForm = JqueryForm;
})(jQuery);
