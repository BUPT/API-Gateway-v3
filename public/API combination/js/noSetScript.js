var set_o = {
    "SDTTreeElements": [{ //元素配置
        "type": "CallControl", //值为字符串 表示元素类型
        "dropSwitch": true, //值为 true 或 false 当值为 true 时元素可直接放置于画布
        "foresideType": ["all"], //值为一个字符串 type 间由 "," 隔开 当值为空时，则任何元素都将不接受其的放置；当值为 all 时所有元素都接受其放置；当值为合法 type 串时，type 串中所代表的类型元素将接受其放置
        "leanRight": true //值为 true 或 false 当值为 true 时元素默认放置于右侧树
    }, {
        "type": "NumberChange",
        "dropSwitch": true,
        "foresideType": ["all"],
        "leanRight": true
    }, {
        "type": "OutBound",
        "dropSwitch": true,
        "foresideType": ["all"],
        "leanRight": true
    }, {
        "type": "MultiCall",
        "dropSwitch": true,
        "foresideType": ["all"],
        "leanRight": true
    }, {
        "type": "IVR",
        "dropSwitch": true,
        "foresideType": ["all"],
        "leanRight": true
    }, {
        "type": "QOS",
        "dropSwitch": true,
        "foresideType": ["all"],
        "leanRight": true
    }, {
        "type": "Message",
        "dropSwitch": true,
        "foresideType": ["all"],
        "leanRight": true
    }],
    "SDTTreeSet": { //目标画布配置
        "lineType": "bessel", //值为 "straight" 或 "bessel" 当值为 "straight" 时元素间连线方式为直线；当值为 "bessel" 时元素间连线方式为贝塞尔曲线；
        "lineColor": "#547D87", // 值为颜色色值字符串 连线颜色为此色值
        "treeCenterX": "0", //值为数字（不带单位，非字符串） 树的中心 X 坐标
        "treeCenterY": "150", //值为数字（不带单位，非字符串） 树的中心 Y 坐标
        "treeEleMargin": "15" //值为数字（不带单位，非字符串） 元素的上下边距
    }
};
SDT.SVGDragComponent(set_o); //对组件进行配置，参数为上方定义好的参数

//var intTree = '[{"id":"SDTTree","objHeight":0,"childEles":[{"id":"SDTTreeRight","objHeight":2,"childEles":[{"type":"HJKZ","dropSwitch":true,"foresideType":["all"],"id":"HJKZ1","name":"呼叫事件订阅","foresideObjId":"SDTTreeRight","objHeight":2,"childEles":[{"type":"HJKZ","dropSwitch":true,"foresideType":["all"],"id":"HJKZ2","name":"呼叫事件通知","foresideObjId":"HJKZ1","objHeight":1,"childEles":[{"type":"XX","dropSwitch":true,"foresideType":["all"],"id":"XX1","name":"发送消息","foresideObjId":"HJKZ2","objHeight":1,"childEles":[],"objRelativelyHeight":-0.5,"objcolumn":3,"leanRight":true,"url":"urlurlurlurlurlurlurl"}],"objRelativelyHeight":-0.5,"objcolumn":2,"leanRight":true,"url":"urlurlurlurlurlurlurl"},{"type":"QOS","dropSwitch":true,"foresideType":["all"],"id":"QOS1","name":"QOS资源申请","foresideObjId":"HJKZ1","objHeight":1,"childEles":[],"objRelativelyHeight":0.5,"objcolumn":2,"leanRight":true,"url":"urlurlurlurlurlurlurl"}],"objRelativelyHeight":0,"objcolumn":1,"leanRight":true,"url":"urlurlurlurlurlurlurl"}],"objRelativelyHeight":0,"objcolumn":0},{"id":"SDTTreeLeft","objHeight":0,"childEles":[],"objRelativelyHeight":0,"objcolumn":0}],"objRelativelyHeight":0,"objcolumn":0},["HJKZ1","HJKZ2","QOS1","XX1"],[{"countType":"HJKZ","countNumber":2},{"countType":"HMGB","countNumber":0},{"countType":"WH","countNumber":0},{"countType":"DFTH","countNumber":0},{"countType":"IVR","countNumber":0},{"countType":"QOS","countNumber":1},{"countType":"XX","countNumber":1}]]';

//SDT.drawInputTree(JSON.parse(intTree)); //重绘树，接受一个参数，参数类型为完整树 ，调用后会清空目标画布，并立即重绘



function findnode(oob) { //找到被点击的节点对象
    // alert(oob.attr('id'));
    // alert(JSON.stringify(SDT.returnTree()[0]));
    var Json = SDT.returnTree()[0];

    function json(jsontree) { //根据id找到相应树节点
        if ((typeof jsontree == 'object') && (jsontree.constructor == Object.prototype.constructor)) {
            var arrey = [];
            arrey.push(jsontree);
        } else arrey = jsontree;
        for (var i = 0; i < arrey.length; i++) {
            var node = arrey[i];
            if (node.id == oob.attr('id')) {
                showattr(node, oob);
                return;
            }
            if (node.childEles && node.childEles.length > 0) {
                json(node.childEles);
            }
        }
    }
    json(Json);
}

function showattr(node, oob) { //显示被点击节点对象属性
    if (node.isfirst == 1) {
        var tp = node.type;
        if (node.type == 'CallControl') {
            tp = "呼叫控制类";
        }
        if (node.type == 'NumberChange') {
            tp = "号码改变类";
        }
        if (node.type == 'OutBound') {
            tp = "外呼类";
        }
        if (node.type == 'MultiCall') {
            tp = "多方通话类";
        }
        if (node.type == 'IVR') {
            tp = "IVR类";
        }
        if (node.type == 'QOS') {
            tp = "QOS类";
        }
        if (node.type == 'Message') {
            tp = "消息类";
        }
        $("#tp").val(tp);
        $("#nodeid").val(node.id);

        $.ajax({
            type: "get",
            url: 'http://www.linyimin.club:8001/apis/getApiInfoByType',
            async: true,
            dataType: "json",
            data: { "APIType": tp },
            crossDomain: true,
            success: function (data) {
                if (data.result == true) {
                    var $select = $('#name');
                    $("#name").empty();
                    for (var i = 0, len = data.datum.length; i < len; i++) {
                        $select.append('<option value="' + data.datum[i].ID + '">' + data.datum[i].name + '</option>');
                    }
                    $("#condi").val("");
                    next(data.datum, oob);
                } else {
                    alert(data.reason);
                }
            },
            error: function (data) {
                console.log(JSON.stringify(data));
                alert(JSON.stringify(data));
            }
        });
    }
    else if(node.isfirst == 0){
        var blockid = oob.attr('id');
        $.ajax({
            type: "get",
            url: 'http://www.linyimin.club:8001/apis/getAtomApiInfo',
            async: true,
            dataType: "json",
            data: {
                "moduleId": blockid,
                "combinationUrl": ""
            },
            crossDomain: true,
            success: function (data) {
                if (data.result == true) {
                    $("#nodeid").val(data.datum.module_id);
                    $("#tp").val(data.datum.type);

                    $.ajax({
                        type: "get",
                        url: 'http://www.linyimin.club:8001/apis/getApiInfoByType',
                        async: true,
                        dataType: "json",
                        data: { "APIType": data.datum.type },
                        crossDomain: true,
                        success: function (data1) {
                            if (data1.result == true) {
                                var $select = $('#name');
                                $("#name").empty();
                                for (var i = 0, len = data1.datum.length; i < len; i++) {
                                    $select.append('<option value="' + data1.datum[i].ID + '">' + data1.datum[i].name + '</option>');
                                }
                                for (var j = 0, len1 = data1.datum.length; j < len1; j++) {
                                    if (data.datum.api_id == data1.datum[j].ID) {
                                        $("#name").val(data.datum.api_id);
                                    }
                                }
                                next(data1.datum, oob);
                            } else {
                                alert(data.reason);
                            }
                        },
                        error: function (data) {
                            console.log(JSON.stringify(data));
                            alert(JSON.stringify(data));
                        }
                    });

                    $("#idid").val(data.datum.api_id);
                    $("#inputt").val(data.datum.argument);
                    $("#output").val(data.datum.response);
                    $("#url").val(data.datum.URL);
                    $("#method").val(data.datum.method);
                    if (data.datum.is_async == "0") {
                        $("#asn").val("0");
                    }
                    if (data.datum.is_async == "1") {
                        $("#asn").val("1");
                    }
                    $("#condi").val(data.datum.condition);
                } else {
                    //alert(data.reason);
                }
            },
            error: function (data) {
                console.log(JSON.stringify(data));
                alert(JSON.stringify(data));
            }
        });
    }

}

function next(data, oob) {
    //alert(111);
    $(document).ready(function () {
        var select = document.getElementById('name');

        select.onclick = function () {
            var s_id = $("#name").val();
            var namee = $("#name").find("option:selected").text();
            //alert(s_id);
            for (var j = 0; j < data.length; j++) {
                if (data[j].ID == s_id) {
                    $("#idid").val(data[j].ID);
                    $("#inputt").val(data[j].argument);
                    $("#output").val(data[j].event);
                    $("#url").val(data[j].URL);
                    $("#method").val(data[j].method);
                    // $("#nodeid").children('text').html(namee);
                    oob.children('text').html(namee);
                }
            }
            $("#condi").val("");
        }
    });
}


function shownodeattr1(node, oob, url) {
    var blockid = oob.attr('id');
    $.ajax({
        type: "get",
        url: 'http://www.linyimin.club:8001/apis/getAtomApiInfo',
        async: true,
        dataType: "json",
        data: {
            "moduleId": blockid,
            "combinationUrl": url
        },
        crossDomain: true,
        success: function (data) {
            if (data.result == true) {
                $("#nodeid").val(data.datum[0].module_id);
                $("#tp").val(data.datum[0].type);

                $.ajax({
                    type: "get",
                    url: 'http://www.linyimin.club:8001/apis/getApiInfoByType',
                    async: true,
                    dataType: "json",
                    data: { "APIType": data.datum[0].type },
                    crossDomain: true,
                    success: function (data1) {
                        if (data1.result == true) {
                            var $select = $('#name');
                            $("#name").empty();
                            for (var i = 0, len = data1.datum.length; i < len; i++) {
                                $select.append('<option value="' + data1.datum[i].ID + '">' + data1.datum[i].name + '</option>');
                            }
                            for (var j = 0, len1 = data1.datum.length; j < len1; j++) {
                                if (data.datum[0].api_id == data1.datum[j].ID) {
                                    $("#name").val(data.datum[0].api_id);
                                }
                            }
                            //next(data1.datum, oob);
                        } else {
                            alert(data1.reason);
                        }
                    },
                    error: function (data1) {
                        console.log(JSON.stringify(data1));
                        alert(JSON.stringify(data1));
                    }
                });

                $("#idid").val(data.datum[0].api_id);
                $("#inputt").val(data.datum[0].argument);
                $("#output").val(data.datum[0].response);
                $("#url").val(data.datum[0].URL);
                $("#method").val(data.datum[0].method);
                if (data.datum[0].is_async == "0") {
                    $("#asn").val("0");
                }
                if (data.datum[0].is_async == "1") {
                    $("#asn").val("1");
                }
                $("#condi").val(data.datum[0].condition);

                // 名称、是否异步、执行条件、保存键改为不可点击
                $("#name").attr("disabled", true);
                $("#asn").attr("disabled", true);
                $("#condi").attr("disabled", true);
                $("#savebutton").css({ "display": "none" });

            } else {
                alert(data.reason);
            }
        },
        error: function (data) {
            console.log(JSON.stringify(data));
            alert(JSON.stringify(data));
        }
    });
}


function isroot(){//判断是否为根节点并隐藏线
    var Json = SDT.returnTree()[0];
    function json(jsontree) { //根据id找到相应树节点
        if ((typeof jsontree == 'object') && (jsontree.constructor == Object.prototype.constructor)) {
            var arrey = [];
            arrey.push(jsontree);
        } else arrey = jsontree;
        for (var i = 0; i < arrey.length; i++) {
            var node = arrey[i];
            if (node.id == "SDTTreeRight") {
                if (node.childEles.length == 1) {
                    $("#sdtDropCanvasAll").find("path:last").attr("display","none");
                }
                return;
            }
            if (node.childEles && node.childEles.length > 0) {
                json(node.childEles);
            }
        }
    }
    json(Json);
}