var apiUrl = 'http://jfxd.losta.net/apiv1/';
var path = '';
var userId;
var accesskey;
var projectId = localStorage.projectId;
var projectName = localStorage.projectName;
var orgId = '';
const TIMEFORMATCOMPLETE = 'yyyy-MM-dd hh:mm:ss';
const TIMEFORMAT = 'yyyy-MM-dd';
const ALERTKIND = ['', '正常', '警报', '一般故障', '严重故障', '硬件失败'];
const WEEKKIND = ['日', '一', '二', '三', '四', '五', '六'];

toGetBasicInfo();

function toGetBasicInfo() {
    accessKey = toGetParameter('accesskey');
    userId = toGetParameter('userid');  
    if (!accessKey || !userId) {
        if (!localStorage.accessKey || !localStorage.userId) {
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2ef322e64147298f&redirect_uri='
                                 + encodeURI('http://jfxd.losta.net/apiv1/Auth/Wechat/Authorize')
                                 + '&response_type=code&scope=snsapi_base&state=home#wechat_redirect';
        } else {
            accessKey = localStorage.accessKey;
            userId= localStorage.userId;
        }
    } else {
        localStorage.accessKey = accessKey;
        localStorage.userId = userId;
    }
};

$('.icon-back').click(function() {
    history.back(-1);
});

$('.dropdown-list').on('click', '.title', function() {
    if ($(this).attr('data-status') == '0') {
        $(this).siblings('ul').slideDown(200);
        $(this).attr('data-status', '1');
    } else {
        $(this).siblings('ul').slideUp(200);
        $(this).attr('data-status', '0');
    }
});

var toGetProjectList = function() {
    var settings = {
        url: apiUrl + 'Basis/Project/List',
        type: 'GET',
        dataType: 'json',
        cache: false
    };
    $.ajax(settings).done(function(data) {
        var projectListHtml = '';
        $.each(data.rows, function(index, value) {
            var projectClass = value.projectId == projectId ? ' class="active"' : '';
            projectListHtml += '<li' + projectClass + ' data-projectid="' + value.projectId + '">'
                             + '    <a href="javascript:;"><b></b><em>' + value.projectName + '</em><i class="icon-next"></i></a>'
                             + '</li>'
        });
        $('#projectList').html(projectListHtml);
    });
};

$('#projectList').on('click', 'li', function() {
    localStorage.projectId = $(this).attr('data-projectid');
    localStorage.projectName = $(this).find('a em').html();
    $(this).addClass('active').siblings().removeClass('active');
    alertMsg('项目选择成功！');
    setTimeout(function() {
        window.location.href = '../index.html';
    }, 2000);
    // $('#projectList').slideUp();
});

var toGetFilterProjectList = function() {
    var settings = {
        url: apiUrl + 'Basis/Project/List',
        type: 'GET',
        dataType: 'json',
        cache: false
    };
    $.ajax(settings).done(function(data) {
        var projectListHtml = '';
        $.each(data.rows, function(index, value) {
            projectListHtml += '<option value="' + value.projectId + '">' + value.projectName + '</option>'
        });
        $('#chooseProject').html(projectListHtml).val(projectId);
    });
};

var toGetFilterLevel = function() {
    var levelHtml = '';
    console.log(ALERTKIND.length)
    for(var i = 1; i < ALERTKIND.length; i++) {
        levelHtml += '<option value="' + i + '">' + ALERTKIND[i] + '</option>';   
    }
    $('#chooseLevel').append(levelHtml);
};

var toGetfFilterDetails = function() {
    toGetFilterProjectList();
    toGetFilterLevel();
};

$('#showFilter').click(function() {
    if ($(this).attr('data-status') == '0') {
        $(this).attr('data-status', 1);
        $('.alert-filter').slideDown();
        showOverlay();
    } else {
        $(this).attr('data-status', 0);
        $('.alert-filter').slideUp();
        hideOverlay();
    }
});

var toGetFilterInfo = function() {
    var data = {};
    data.datefrom = $('#dateFrom').val();
    data.dateto = $('#dateTo').val();
    data.AlertKindNo = $('#chooseLevel').val();
    toGetAlertList(data, $('#chooseProject').val());
};

$('#filterBtn').click(function() {
    $('#currentProjectName').html($('#chooseProject option:selected').text());
    toGetFilterInfo();
});

var toGetAlertList = function(data, proId) {
    proId = proId ? proId : projectId;
    // var date = new Date(Number(toGetParameter('date'))).Format(TIMEFORMAT);
	var settings = {
		url: apiUrl + 'Report/Alert/' + proId,
		type: 'GET',
		dataType: 'json',
		cache: false,
        data: data
	};
	$.ajax(settings).done(function(data) {
        $('.alert-filter').slideUp();
        hideOverlay();
        if (!data.rows.length) {
            $('#alertList').html('<p>没有更多记录</p>');
            return;
        }
		var alertListHtml = '';
		$.each(data.rows, function(index, value) {
			alertListHtml += '<li>'
                           + '    <div class="p01">'
                           + '        <div class="l01">'
                           + '            <h5>时间：' + new Date(value.logTime).Format('yyyy-MM-dd hh:mm:ss') + '</h5>'
                           + '            <h3>' + value.alertName + '</h3>'
                           + '            <hr class="dotted-line"/>'
                           + '        </div>'
                           + '        <div class="l02">'
                           + '            <p class="clearfix">'
                           + '                <em>设备信息：</em>'
                           + '                <span class="alert-info">' + value.equipmentName + '</span>'
                           + '            </p>'
                           + '            <p class="clearfix">'
                           + '                <em>警报类别：</em>'
                           + '                <span class="alert-main">' + value.alertKindName + '</span>'
                           + '            </p>'
                           + '            <p class="clearfix">'
                           + '                <em>具体描述：</em>'
                           + '                <span class="alert-detail">' +  value.alertText + '</span>'
                           + '            </p>'
                           + '        </div>'
                           + '    </div>'
                           + '    <div class="p02">'
                           + '        <a href="alertDetails.html?sequenceNo=' + value.sequenceNo + '">查看详情<i class="icon-next"></i></a>'
                           + '    </div>'
                           + '</li>'
		});
		$('#alertList').html(alertListHtml);
	});
};

var toGetAlertDetails = function() {
	if (toGetParameter('projectId')) {
		projectId = toGetParameter ('projectId');
	}
	var sequenceNo = '';
	if (toGetParameter('sequenceNo')) {
		sequenceNo = toGetParameter('sequenceNo');
	}
	var settings = {
		url: apiUrl + 'Report/Alert/' + projectId + '/' + sequenceNo,
		type: 'GET',
		dataType: 'json',
		cache: false
	};
	$.ajax(settings).done(function(data) {
		$('#currentEquipmentName').html(data.equipmentName);
		var channelHtml = data.channelNo != 0 ? '<p class="clearfix">'
            			+ '    <em>通道号：</em>'
            			+ '    <span>' + data.channelNo + '</span> '
            			+ '</p>' : '';
		var alertDetailHtml = '<p class="clearfix">'
            				+ '    <em>警报名称：</em>'
            				+ '    <span>' + data.alertName + '</span> '
            				+ '</p>'
            				+ '<p class="clearfix">'
            				+ '    <em>报警时间：</em>'
            				+ '    <span>' + new Date(data.logTime).Format('yyyy-MM-dd hh:mm:ss') + '</span> '
            				+ '</p>'
            				+ '<p class="clearfix">'
            				+ '    <em>设备号：</em>'
            				+ '    <span>' + data.equipmentNo + '</span> '
            				+ '</p>'
            				+ '<p class="clearfix">'
            				+ '    <em>设备名称：</em>'
            				+ '    <span>' + data.equipmentName + '</span> '
            				+ '</p>'
            				+ '<p class="clearfix">'
            				+ '    <em>警报类别：</em>'
            				+ '    <span>' + data.alertKindName + '</span> '
            				+ '</p>'
            				+ '<p class="clearfix">'
            				+ '    <em>警报信息：</em>'
            				+ '    <span>' + data.alertText + '</span> '
            				+ '</p>'
            				+ channelHtml
            				+ '<p class="clearfix">'
            				+ '    <em>备注：</em>'
            				+ '    <span>' + data.comment + '</span> '
            				+ '</p>'
		$('#alertDetails').html(alertDetailHtml);
		
	});
};

var totalRecordCenter = ['50%', '50%'];
var toDrawTotalRecord = function(data) {
    var myChart = echarts.init(document.getElementById('totalRecord'));

    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:[ALERTKIND[5], ALERTKIND[4], ALERTKIND[3], ALERTKIND[2], ALERTKIND[1]]
        },
        series: [
            {
                name:'访问来源',
                type:'pie',
                radius: ['60%', '80%'],
                center: totalRecordCenter,
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value: data.alertKind5_Count, name: ALERTKIND[5]},
                    {value: data.alertKind4_Count, name: ALERTKIND[4]},
                    {value: data.alertKind3_Count, name: ALERTKIND[3]},
                    {value: data.alertKind2_Count, name: ALERTKIND[2]},
                    {value: data.alertKind1_Count, name: ALERTKIND[1]}
                ]
            }
        ]
    };

    myChart.setOption(option);
};

var toDrawWeekRecord = function(data) {
    var yAxisData = [];
    var alertDetails = [];
    var weekRecordHtml = '';
    for(var j = 0; j < 5; j++) {
        alertDetails[j] = new Array();
    }
    $.each(data, function(index, value) {
        var date = new Date(value.date);
        var alertHtml = '';
        for(var i = 1; i < 6; i++) {
            alertHtml += '<td>' + value['alertKind' + i + '_Count'] + '</td>';
            alertDetails[i - 1].push(value['alertKind' + i + '_Count']);
        }
        weekRecordHtml += '<tr data-day="' + date.getTime() + '">'
                        + '    <th>' + WEEKKIND[date.getDay()] + '</th>'
                        + alertHtml
                        + '</tr>';
        yAxisData.push(WEEKKIND[date.getDay()]);
    });
    $('#weekRecordDetail').html(weekRecordHtml);
    var myChart = echarts.init(document.getElementById('weekRecord'));
    var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            // legend: {
            //     x : 'center',
            //     y : 'top',
            //     data:[ALERTKIND[5], ALERTKIND[4], ALERTKIND[3], ALERTKIND[2], ALERTKIND[1]]
            // },
            grid: {
                left: '3%',
                right: '4%',
                top: '0',
                bottom: '4%',
                containLabel: true
            },
            xAxis:  {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: yAxisData
            },
            series: [
                {
                    name: ALERTKIND[5],
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft'
                        }
                    },
                    data: alertDetails[4]
                },
                {
                    name: ALERTKIND[4],
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft'
                        }
                    },
                    data: alertDetails[3]
                },
                {
                    name: ALERTKIND[3],
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft'
                        }
                    },
                    data: alertDetails[2]
                },
                {
                    name: ALERTKIND[2],
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft'
                        }
                    },
                    data: alertDetails[1]
                },
                {
                    name: ALERTKIND[1],
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft'
                        }
                    },
                    data: alertDetails[0]
                }
            ]
    };
    myChart.setOption(option);
};

var toDrawMonthRecord = function(data) {
    var yAxisData = [];
    var alertDetails = [];
    var monthRecordHtml = '';
    for(var j = 0; j < data.length; j++) {
        alertDetails[j] = new Array();
    }
    $.each(data, function(index, value) {
        var date = new Date(value.date);
        var alertHtml = '';
        for(var i = 1; i < 6; i++) {
            alertHtml += '<td>' + value['alertKind' + i + '_Count'] + '</td>';
            alertDetails[i - 1].push(value['alertKind' + i + '_Count']);
        }
        monthRecordHtml += '<tr data-day="' + date.getTime() + '">'
                        + '    <th>' + (index + 1) + '</th>'
                        + alertHtml
                        + '</tr>';
        yAxisData.push(index + 1);
    });
    $('#monthRecordDetail').html(monthRecordHtml);
    var myChart = echarts.init(document.getElementById('monthRecord'));
    var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            // legend: {
            //     x : 'center',
            //     y : 'top',
            //     data:[ALERTKIND[5], ALERTKIND[4], ALERTKIND[3], ALERTKIND[2], ALERTKIND[1]]
            // },
            grid: {
                left: '3%',
                right: '4%',
                top: '0',
                bottom: '4%',
                containLabel: true
            },
            xAxis:  {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: yAxisData
            },
            series: [
                {
                    name: ALERTKIND[5],
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft'
                        }
                    },
                    data: alertDetails[4]
                },
                {
                    name: ALERTKIND[4],
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft'
                        }
                    },
                    data: alertDetails[3]
                },
                {
                    name: ALERTKIND[3],
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft'
                        }
                    },
                    data: alertDetails[2]
                },
                {
                    name: ALERTKIND[2],
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft'
                        }
                    },
                    data: alertDetails[1]
                },
                {
                    name: ALERTKIND[1],
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft'
                        }
                    },
                    data: alertDetails[0]
                }
            ]
    };
    myChart.setOption(option);
};

var toShowDayRecord = function(data) {
    if (data) {
        for (var i = 1; i < 6; i++) {
            $('#level0' + i).html(data.rows[0]['alertKind' + i + '_Count']);
        }
        toDrawTotalRecord(data.rows[0]);
    } else {
        $('[id^=level0]').html(0);
        toDrawTotalRecord(data);
    }
};

var toShowWeekRecord = function(data) {
    if (data) {
        toDrawWeekRecord(data.rows);
    }
}

var toShowMonthRecord = function(data) {
    if (data) {
        toDrawMonthRecord(data.rows);
    }
}

var toGetRecordSuccess = function(data, callbackData) {
    switch(Number(callbackData.status)) {
        case 1: toShowDayRecord(data); break;
        case 2: toShowWeekRecord(data); break;
        case 3: toShowMonthRecord(data); break;
    }
};

var toGetTotalRecordSuccess = function(data, callbackData) {
    data = data ? data.rows[0] : '';
    toDrawTotalRecord(data);
};

var toGetRecord = function(dateFrom, dateTo, callbackData) {
    toDoAjax(null, 'GET', apiUrl + 'Report/DailyAlert/' + projectId + '/Lite?datefrom=' + dateFrom + '&dateto=' + dateTo, toGetRecordSuccess, callbackData);
};

var toGetTotalRecord = function(dateFrom, dateTo) {
    toDoAjax(null, 'GET', apiUrl + 'Report/TotalAlert/' + projectId + '/Equipment?datefrom=' + dateFrom + '&dateto=' + dateTo, toGetTotalRecordSuccess);
};

var toGetDayRecord = function(date) {
    var callbackData = {
        status: 1
    };
    date = new Date(date).Format(TIMEFORMAT);
    toGetRecord(date, date, callbackData);
};
var toGetWeekRecord = function(date, drawTotal) {
    var callbackData = {
        status: 2
    };
    date = new Date(date);
    var dateFrom = new Date(date.getTime() - 1000 * 60 * 60 * 24 * 6).Format(TIMEFORMAT);
    if (drawTotal) {
        toGetTotalRecord(dateFrom, date.Format(TIMEFORMAT));
    }
    toGetRecord(dateFrom, date.Format(TIMEFORMAT), callbackData);
};
var toGetMonthRecord = function(date, drawTotal) {
    var callbackData = {
        status: 3
    };
    date = new Date(date);
    var dateFrom = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + '01';
    if (drawTotal) {
        toGetTotalRecord(dateFrom, date.Format(TIMEFORMAT));
    }
    toGetRecord(dateFrom, date.Format(TIMEFORMAT), callbackData);
};

$('#search').on('click', function() {
    switch(Number($(this).attr('data-status'))) {
        case 1: toGetDayRecord($('#calendar').val()); break;
        case 2: toGetWeekRecord($('#calendar').val()); break;
        case 3: toGetMonthRecord($('#calendar').val()); break;
    }
    
});

$('.dayrecord-content .record-line').on('click', '.line', function() {
    if (Number($(this).find('span').html())) {
        var date = new Date($('#calendar').val()).getTime();
        window.location.href = path + 'alertList.html?level=' + $(this).attr('data-level') + '&date=' + date;
    } else {
        alertMsg('该等级没有记录！');
    }
});

$('#monthRecordDetail').on('click', 'tr', function() {
    window.location.href = 'alertList.html?date=' + $(this).attr('data-day');
});

$('#weekRecordDetail').on('click', 'tr', function() {
    window.location.href = 'alertList.html?date=' + $(this).attr('data-day');
});

var isPersonal = false;
$(function() {
	if (isPersonal) { return false; }
	if (localStorage.projectId && localStorage.projectName) {
		projectId = localStorage.projectId;
		projectName = localStorage.projectName;
		$('#currentProjectName').html(projectName);
	} else {
		window.location.href = path + 'my.html';
	}

	if ($('#calendar').length) {
		$('#calendar').date();
		var today = new Date().Format(TIMEFORMAT);
		$('#calendar').val(today).attr('placeholder', today);
	}
});
