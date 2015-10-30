$(function () {

    if ($(".stock_error") == void(0) || ($(".disable_cartin") == void(0) || $(".disable_quick") == void(0))) return;

    var form = $('[name=product_form]'),
        c_class = $(".stock_error"),
        dis_cart = $(".disable_cartin"),
        dis_qui = $(".disable_quick"),
        submit_flg;

    if (form.length > 1) {
        form.splice(1, form.length);
    }
    if (form.find("input[name=option]").length <= 0 && form.find("select").length <= 0) return;

    if (dis_cart.children().size() >= 1) {
        var dis_but = dis_cart.children();
    } else {
        var dis_but = dis_cart;
    }
    if (dis_qui.children().size() >= 1) {
        var dis_qbut = dis_qui.children();
    } else {
        var dis_qbut = dis_qui;
    }

    var a = function (ev) {

        var elem = $(this);

        form.find('select').each(function (i, v) {
            // skip checking for select tag of product_text
            if (v.name.indexOf("product_text") == 0) {
                return false;
            }

            if (this.value == 0) {
                if ($(this).parent().siblings().text() == "" || $(this).parent().siblings().length > 1) {
                    var str_err = "オプション";
                } else {
                    var str_err = $(this).parent().siblings().text();
                }
                c_class.text(str_err + "を選択してください").css("display", "block");
                return false;
            }
        })

        form.find('input[type=text][name],input[type=number][name]').trigger("change", ["click", elem]);

        return false;
    };

    dis_but.delegate($(this), 'click', a);
    dis_qbut.delegate($(this), 'click', a);

    var convertNumFullToHalf  = function (arg)
    {
        return arg.replace(/[０１２３４５６７８９]/g
            , function(arg){
                var num = "０１２３４５６７８９".indexOf(arg);
                return (num !== -1)? num:arg;
            }
        );
    }

    form.find('select,input[type=text][name],input[type=number][name]').change(function (ev, type, elem) {
        var $productNum = $("input[name=product_num]");
        var productNum = convertNumFullToHalf($productNum.val());
        $productNum.val(productNum); // 入力された数字を全角から半角へ変換
        if (!$.isNumeric(productNum) || productNum <= 0) return; // 自然数以外が入力されている場合、通信しない
        var changed = true,
            select_array = {};
        var param = location.search.split("?"),
            pid = param[1].match("pid=[0-9]*");
        if (form.find("select").length <= 0) {
            var checked_val = $("input[name=option]:checked").val();
            if (checked_val == void 0) return;
            var tmp = checked_val.split(",");
            tmp_cnt = tmp.length / 2;
            for (var i = 0, x = 0; i < tmp_cnt; i++, x += 2) {
                if (tmp[x] != "" && tmp[x + 1] != "") {
                    select_array['option[' + i + ']'] = tmp[x] + "," + tmp[x + 1];
                }
            }
        } else {
            form.find('select').each(function (i, v) {
                if (this.value == 0) return;
                select_array['option[' + i + ']'] = this.value;
            });
        }

        $.ajax({
            type: "POST",
            data: select_array,
            dataType: "json",
            url: "?" + pid + "&mode=option_get&preOrderNum=" + productNum,
            success: function (option_val, req) {
                submit_flg = true;

                if (option_val.stock_flg == 1 || (option_val.stock_num > 0 && option_val.stock_num >= parseInt(productNum))) {
                    c_class.css("display", "none");
                    var form_status = form.find("input[type=submit]"),
                        submit_name = form_status.attr("name");

                    if (submit_name == "submit") {
                        form_status.attr("name", "");
                        var clone_submit = form_status.clone();
                        $(this).replaceWith(clone_submit);
                    }

                    if (type == void 0) return;
                    if (elem.hasClass("disable_quick") || elem.parent().hasClass("disable_quick")) {
                        jf_easy_order();
                    } else {
                        if(typeof ga !== "undefined"){
                            ga(function(tracker) {
                                var linker = new window.gaplugins.Linker(tracker);
                                var output = linker.decorate(form.attr("action"));
                                form.attr("action", output);
                            });
                        }
                        form.unbind("submit").submit();
                    }
                    return false;
                }
                if (option_val.stock_num == -1) {
                    c_class.text("選択いただいた商品の在庫数が不足しています").css("display", "block");
                } else if (option_val.stock_num == 0) {
                    c_class.text("選択いただいた商品の在庫はありません").css("display", "block");
                } else if (option_val.stock_num < parseInt(productNum)) {
                    c_class.text("選択いただいた商品の在庫は残り" + option_val.stock_num + decodeURI(option_val.unit) + "です").css("display", "block");
                }
                return false;
            }
        });
    });
});

var parseUrl = function (str) {
    var keys = [ "source", "protocol",
            "authority", "userInfo", "user", "password",
            "host", "port", "relative", "path",
            "directory", "file",
            "queryString", "anchor"],
        queryRegexp = /(?:^|&)([^&=]*)=?([^&]*)/g,
        urlRegexp = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/; //loose

    var m = urlRegexp.exec(str),
        uri = {},
        i = keys.length;

    while (i--) uri[keys[i]] = m[i] || "";

    uri['query'] = {};
    uri['queryString'].replace(queryRegexp, function ($0, $1, $2) {
        if ($1) uri['query'][$1] = $2;
    });

    return uri;
};

