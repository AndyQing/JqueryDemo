var Table = function Table() {
    var TClass = {};
    var Tool = {};
    Tool.createHeader = function (htmls, data, model, checked) {
        var checkedHtml = '';
        if (checked) {
            checkedHtml = '<th style="width:50px">序号</th>';
        }
        htmls.push('<thead><tr>' + checkedHtml);
        for (var i in data) {
            var width = model[i].width + 'px';
            htmls.push('<th style="width:' + width + '">' + data[i] + '</th>');
        }
        htmls.push('</thead></tr>');
    };

    Tool.createRow = function (htmls, data, model, checked, index) {
        var rowData = data;
        var trHtml = '<tr>';
        var isTdEdit = false;
        if (!(data instanceof Array)) {
            rowData = data.list;
            isTdEdit = data.isEdit;
            trHtml = '<tr data-id="' + data.id + '">';
        }
        htmls.push(trHtml);
        var checkedHtml = '';
        if (checked) {
            if (index < 1) {//前1行不能选中
                checkedHtml = '<td style="width:40px"><input type="checkbox" value="' + index + '" name="" disabled></td>';
            } else {
                checkedHtml = '<td style="width:40px"><input type="checkbox" value="' + index + '" name="check"></td>';
            }
        }
        htmls.push(checkedHtml);
        for (var i in rowData) {
            var width = 'width:' + model[i].width + 'px;';
            var color = model[i].color ? 'color:' + model[i].color + ';' : '';
            var bgColor = model[i].isEdit ? 'background-color: #fff;' : '';
            var textBox = '<div class="textBox" contenteditable="true">' + rowData[i] + '</div>';
            var numBox = '<input class="numBox" type="text" value=' + rowData[i] + ' name="报价（元）">';
            // var tdHtml = model[i].isEdit || isTdEdit ? '<div class="textBox" contenteditable="true">' + rowData[i] + '</div>' : rowData[i];//根据isEdit判断是否可以编辑
            var tdHtml = model[i].isNum ? numBox : textBox;//项目中都可以编辑，要判断哪个是数字输入框
            // var paddingLeft = model[i].isEdit || isTdEdit ? 'padding-left: 0;' : 'padding-left: 15px;';
            var itemHtml = '<td style="' + width + color + bgColor + '">' + tdHtml + '</td>';

            htmls.push(itemHtml);
        }
        htmls.push('</tr>');
    };
    Tool.render = function (id, tag, option) {
        var htmls = [];
        htmls.push('<table class="simple-table">');
        Tool.createHeader(htmls, option['header'], option['colModel'], option['checked']);
        htmls.push('<tbody>');
        for (var i in option['data']) {
            Tool.createRow(htmls, option['data'][i], option['colModel'], option['checked'], i);
        }
        htmls.push('</tbody></table>');
        tag.empty().append(htmls.join(''));
    };

    Tool.getValue = function (value, defaultValue) {
        if (typeof value == 'undefined') {
            return defaultValue;
        } else {
            return value;
        }
    };

    // 表格初始化
    TClass.init = function (option) {
        var id = option['id'];
        var tag = $('#' + id);
        Tool.render(id, tag, option);
    };

    // 新增行
    TClass.addRow = function (id, checked) {
        var $ele = $('#' + id + ' .simple-table');
        var order = $ele.find('tr').length;//序号
        var checkedHtml = '<tr class="new"><td>';
        // if (checked) {
        //     checkedHtml = '<tr class="new"><td style="width:40px"><input type="checkbox" value="new" name="check"></td><td>';
        // }
        // var tdHtml = checkedHtml + order +
        //     '</td><td><div class="textBox description" contenteditable="true"></div>' +
        //     '</td><td><div class="textBox" contenteditable="true"></div></td>';

        var tdHtml = '<tr class="new"><td style="width:40px"><input type="checkbox" value="new" name="check"></td>' +
            '<td><div class="textBox" contenteditable="true"></div>' +
            '</td><td><input class="numBox" type="text" name="报价（元）">' +
            '</td><td><div class="textBox" contenteditable="true"></div></td>';
        $ele.find('tbody').append(tdHtml);
    };

    // 删除行
    TClass.deleteRow = function (id) {
        var $checkBox = $('#' + id + ' .simple-table tbody').find("input[name='check']");
        $.each($checkBox, function (index, item) {
            var isChecked = $(item).prop('checked');
            if (isChecked) {
                $(item).parents('tr').remove();
            }
        });
        var $trList = $('#' + id + ' .simple-table tbody').find("tr");
        var $trNewList = $('#' + id + ' .simple-table tbody').find(".new");
        var diff = $trList.length - $trNewList.length;
        $.each($trNewList, function (index, item) {
            $(item).find('td:eq(1)').text(index + diff + 1)
        });
    };

    return TClass;
}();