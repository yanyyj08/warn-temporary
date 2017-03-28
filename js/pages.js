var apiUrl = 'http://jfxd.losta.net/apiv1/';
var path = '';
var userId;
var accesskey;
var projectId = localStorage.projectId;
var projectName = localStorage.projectName;
var orgId = '';
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
			projectListHtml += '<li data-projectid="' + value.projectId + '">'
                             + '    <a href="javascript:;"><em>' + value.projectName + '</em><i class="icon-next"></i></a>'
                             + '</li>'
		});
		$('#projectList').html(projectListHtml);
	});
};

$('#projectList').on('click', 'li', function() {
	localStorage.projectId = $(this).attr('data-projectid');
	localStorage.projectName = $(this).find('a em').html();
});


var toGetAlertList = function() {
	var settings = {
		url: apiUrl + 'Report/Alert/' + projectId,
		type: 'GET',
		dataType: 'json',
		cache: false
	};
	$.ajax(settings).done(function(data) {
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
		$('#alertList').append(alertListHtml);
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

var isPersonal = false;
$(function() {
	if (isPersonal) { return false; }
	if (localStorage.projectId && localStorage.projectName) {
		projectId = localStorage.projectId;
		projectName = localStorage.projectName;
		$('#currentProjectName').html(projectName);
	} else {
		window.location.href = path + 'personalInfo.html';
	}

	// if ($('#calendar').length) {
	// 	$('#calendar').date();
	// 	var today = timeFormat(new Date(), false);
	// 	$('#calendar').val(today).attr('placeholder', today);
	// }
});
