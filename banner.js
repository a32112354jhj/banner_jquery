/****************
Banner縮放(banner)
****************/

(function ($) {
    'use strict';
    var ModuleName = 'banner';

    var Module = function (ele, options) {
        this.ele = ele;
        this.$ele = $(ele);
        this.option = options;
    };

    var openStatus = true; //開啟狀態

    Module.DEFAULTS = {
        openAtStart: false,
        autoToggle: true,
        button: {
            closeText: '收合', // [string]
            openText: '展開', // [string]
            class: 'btn' // [string]
        },
        class: {
            closed: 'closed', // [string]
            closing: 'closing', // [string]
            opened: 'opened', // [string]
            opening: 'opening' // [string]
        },
        transition: true,
        whenTransition: function () {
            console.log('whenTransition');
        }
    };

    // 改變class名稱
    Module.prototype.ClassNameChange = function (className) {
        this.$ele.removeClass(this.option.class.closed);
        this.$ele.removeClass(this.option.class.closing);
        this.$ele.removeClass(this.option.class.opened);
        this.$ele.removeClass(this.option.class.opening);
        this.$ele.addClass(className);
    }


    // 展開
    Module.prototype.open = function () {
        $('.banner').css({ "height": "300px" });
        $('.wrap').css({ "top": "0px" });
        $('.' + this.option.button.class).html(this.option.button.closeText);
        this.ClassNameChange(this.option.class.opened);
        openStatus = true;
        return;
    };

    // 關閉
    Module.prototype.close = function () {
        $('.banner').css({ "height": "80px" });
        $('.wrap').css({ "top": "-300px" });
        $('.' + this.option.button.class).html(this.option.button.openText);
        this.ClassNameChange(this.option.class.closed);
        openStatus = false;
        return;
    };

    //展開中
    Module.prototype.opening = function () {
        var elem = this;

        $('.wrap').animate({ "top": "0px" }, 0);
        $('.banner').animate({ height: '300px' }, 1500);
        $('.' + this.option.button.class).html(this.option.button.closeText);
        this.ClassNameChange(this.option.class.opening);
        setTimeout(function () { elem.ClassNameChange(elem.option.class.opened); }, 1500);
        openStatus = true;
        this.WhenTransition();
        return;
    };

    // 關閉中
    Module.prototype.closing = function () {
        var elem = this;
        $('.banner').animate({ height: '80px' }, 1500);
        $('.wrap').delay(1500).animate({ top: '-300px' }, 0);
        $('.' + this.option.button.class).html(this.option.button.openText);
        this.ClassNameChange(this.option.class.closing);
        setTimeout(function () { elem.ClassNameChange(elem.option.class.closed); }, 1500);
        openStatus = false;
        this.WhenTransition();
        return;
    };

    //Toggle
    Module.prototype.toggle = function () {
        if (openStatus == false) {
            this.option.transition == true ? this.opening() : this.open();
        }
        else {
            this.option.transition == true ? this.closing() : this.close();
        }
    }

    // transition動作
    Module.prototype.WhenTransition = function () {
        var whenTransition;
        var elem = this;
        whenTransition = setInterval(this.option.whenTransition, 50);
        setTimeout(function () { clearInterval(whenTransition); }, 1500);
    }

    $.fn[ModuleName] = function (methods, options) {
        return this.each(function () {
            var $this = $(this);
            var module = $this.data(ModuleName);
            var opts = null;

            if (!!module) {
                if (typeof methods === 'string' && typeof options === 'undefined') {
                    module[methods]();
                } else if (typeof methods === 'string' && typeof options === 'object') {
                    module[methods](options);
                } else {
                    console.log('unsupported options!');
                    throw 'unsupported options!';
                }
            } else {
                opts = $.extend({}, Module.DEFAULTS, (typeof methods === 'object' && methods), (typeof options === 'object' && options));
                module = new Module(this, opts);
                $this.data(ModuleName, module);

                $this.append('<a href="javascript:;" class="' + opts.button.class + ' btn_sty"></a>');

                // 開始狀態
                opts.openAtStart?module.open():module.close();
                
                // 按鈕操控
                $('.' + opts.button.class).click(function () {
                    if (opts.transition == false) {
                        openStatus ? module.close() : module.open();
                    }
                    else if (opts.transition == true) {
                        openStatus ? module.closing() : module.opening();
                    }
                });

                // 自動收合
                if (opts.autoToggle == true) {
                    openStatus ? module.closing() : module.opening();
                }
                else if (typeof opts.autoToggle != 'bool') {
                    // 延遲自動展開
                    setTimeout(function () {
                        openStatus ? module.closing() : module.opening();
                    }, opts.autoToggle);
                }

            }
        });
    };

})(jQuery);
