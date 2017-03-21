var apiUrl = 'http://api.guagua365.net/apiv1/';
var imgUrl =  apiUrl + 'FastFiles/';

var toChangeLoadStatus = function(status, element) {
	switch(status) {
		case 0: element.html('<i class="icon-load"></i><span>加载中...</span>').attr('data-status', 1); break;
		case 1: element.html('点击加载更多数据').attr('data-status', 0); break;
		case 2: element.html('没有更多数据').attr('data-status', 2).addClass('unable'); break;
	}
};

var toGetCategory = function() {
	var settings = {
		url: apiUrl + 'Basis/Kb/Category',
		type: 'GET',
		cache: false,
		dataType: 'json'
	};
	$.ajax(settings).done(function(data){
		var categoryHtml = '';
		$.each(data, function(index, value) {
			categoryHtml += '<li data-id="' + value.kbCategoryId + '">' + value.title + '</li>'
		});
		$('#keyword').html(categoryHtml);
	});
};

var toGetArtical = function() {
	toChangeLoadStatus(0, $('#loadArtical'));
	var id = $('#articalList').attr('data-id');
	var details =  id != '0' ? id  : '0?opt=4';
	var pageSize = 10;
	var pageNo = Number($('#articalList').attr('data-page')) + 1;
	var pageSize = 10;
	var settings = {
		url: apiUrl + 'Basis/Kb/List/' + details,
		type: 'GET',
		cache: false,
		dataType: 'json',
		data: {
			pageNo: pageNo,
			pageSize: pageSize
		}
	};
	$.ajax(settings).done(function(data) {
		var articalHtml = '';
		$.each(data, function(index, value) {
			var imgHtml = value.pictureUrl ? '<div class="pic" style="background:url(' + value.pictureUrl + ') no-repeat center; background-size: cover;" class="image" alt=""></div>' : '';
			var postTime = new Date(value.postTime).Format('yyyy-MM-dd hh:mm:ss');
			articalHtml += '<li data-id="' + value.postId + '">'
                    	 + '    <h4 class="title">' + value.title + '</h4>'
                    	 + '    <p class="author clearfix"> '
                    	 + '        <span>作者：<i>' + value.author + '</i></span>'
                    	 + '        <em>发表时间：' + postTime + '</em>'
                    	 + '    </p>'
                    	 + '    <div class="description">'
                    	 + imgHtml
                    	 + value.digest
                    	 + '        <a href="javascript:;" class="show-on">显示全部</a>'
                    	 + '    </div>'
                    	 + '</li>'
		});
		$('#articalList').html(articalHtml);
		if (data.length < pageSize) {
	        toChangeLoadStatus(2, $('#loadArtical'));
        } else {
        	toChangeLoadStatus(1, $('#loadArtical'));
        }
	});
}

$('#keyword').on('click', 'li', function() {
	$('#articalList').attr('data-id', $(this).attr('data-id'))
		.attr('data-page', 0);
	$('#loadArtical').attr('data-status', 0);
	$(this).addClass('active').siblings().removeClass('active');
	toGetArtical();
});


$('#articalList').on('click', '.show-on', function() {
	var $li = $(this).parents('li');
	if(!$li.find('.complete').length) {
		var settings = {
			url: apiUrl + 'Basis/Kb/' + $li.attr('data-id'),
			type: 'GET',
			caehe: false,
			dataType: 'json'
		};
		$.ajax(settings).done(function(data) {
			var completeHtml = '<div class="complete clearfix">'
							 + data.content
                             + '    <div href="javascript:;" class="show-off"><i class="icon-top"></i>收起</div>'
                             + '</div>';
            $li.append(completeHtml);
			$li.addClass('expand');
		});
	} else {
		$li.addClass('expand');
	}
});

$('#articalList').on('click', '.show-off', function() {
	var $li = $(this).parents('li');
	$li.removeClass('expand');
});

$('#loadArtical').click(function() {
    var status = $(this).attr('data-status');
    if (status == '0') {
        toChangeLoadStatus(0, $(this));
        toGetArtical();
    }
});





