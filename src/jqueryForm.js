(function ($) {
  function verifyConfigItem(item) {
    if (!item.name) {
      console.error('缺少name');
    }
    if (!item.id) {
      console.error('缺少id');
    }
  }

  function JqueryForm(config) {
    var inputMap = [];
    for (var i = 0; i < config.length; i++) {
      var configItem = config[i];
      verifyConfigItem(configItem);
      var inputItem = {
        name: configItem.name,
        id: configItem.id,
        $el: $('#' + configItem.id),
        defaultValue: configItem.defaultValue || ''
      };
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
        inputItem.$el.val(inputItem.defaultValue);
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
        }
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
