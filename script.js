const BASE_URL = 'http://localhost:3000';
var totalWords;
var limit;
var currentPage = 1;
var totalPages;
var engTrans;
var dutTrans;
var rusTrans;
var currentLang = 'rus';
var searchedWord;

function word(rus, eng, dut) {
    this.rus = rus;
    this.eng = eng;
    this.dut = dut;
};


function renderTable(words){
	$('.show-table').html('');
	for (var i = 0; i < words.length; i++){
		$('.show-table').append('<tr><td>' + words[i].rus + '</td><td>' + words[i].eng + '</td><td>' + words[i].dut +'</td></tr>');
	};
}

function getPaginatedTable(limit, page){
	$.get(BASE_URL + '/words?_limit=' + limit + '&_page=' + page, function(words, status, request){
		renderTable(words);
		totalWords = request.getResponseHeader('x-total-count');
		createPagination();		
	});
};

function createPagination(){
	$('.pagination').html('');
	totalPages = Math.ceil(totalWords / limit);
	$('.pagination').append('<a href="#" class="beginning">|<</a>');
	$('.pagination').append('<a href="#" class="prev"><</a>');
	for (var i = 1; i <= totalPages; i++){

		if (currentPage == i && i < 2){
			$('.pagination').append('<a class="number active" href="#">' + i + '</a> '); //для 1
			$('.pagination').append('<a class="number" href="#">' + (i + 1) + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i + 2) + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i + 3) + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i + 4) + '</a> ');
		} else if (currentPage == i && i == 2) {
			$('.pagination').append('<a class="number" href="#">' + (i - 1) + '</a> '); //для 2
			$('.pagination').append('<a class="number active" href="#">' + i + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i + 1) + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i + 2) + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i + 3) + '</a> ');
		} else if (currentPage == i && i > 2 && i < (totalPages - 1)) {
			$('.pagination').append('<a class="number" href="#">' + (i - 2) + '</a> '); //для всего остального
			$('.pagination').append('<a class="number" href="#">' + (i - 1) + '</a> ');
			$('.pagination').append('<a class="number active" href="#">' + i + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i + 1) + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i + 2) + '</a> ');
		} else if (currentPage == i && i > 2 && i == (totalPages-1)){
			$('.pagination').append('<a class="number" href="#">' + (i - 3) + '</a> '); //для предпоследнего значения
			$('.pagination').append('<a class="number" href="#">' + (i - 2) + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i - 1) + '</a> ');
			$('.pagination').append('<a class="number active" href="#">' + i + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i + 1) + '</a> ');
		} else if (currentPage == i && i > 2 && i == totalPages){
			$('.pagination').append('<a class="number" href="#">' + (i - 4) + '</a> '); //для последнего значения
			$('.pagination').append('<a class="number" href="#">' + (i - 3) + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i - 2) + '</a> ');
			$('.pagination').append('<a class="number" href="#">' + (i - 1) + '</a> ');
			$('.pagination').append('<a class="number active" href="#">' + i + '</a> ');
		}
	};
	$('.pagination').append('<a href="#" class="next">></a> ');
	$('.pagination').append('<a href="#" class="end">>|</a> ');
};

function getRandomWord(id){
	var randomWord = Math.floor(Math.random() * totalWords);
	$.get(BASE_URL + '/words?id=' + randomWord, function(words){
		getSingleWord(words);
	});
};

function getSingleWord(words){
	rusTrans = words[0].rus;
	engTrans = words[0].eng;
	dutTrans = words[0].dut;

	if (currentLang == 'rus'){
		$('input#tr-rus').html('');
		$('input#tr-rus').val(words[0].rus);
		console.log(engTrans, dutTrans);
	} else if (currentLang == 'eng'){
		$('input#tr-eng').html('');
		$('input#tr-eng').val(words[0].eng);
		console.log(rusTrans, dutTrans);
	} else {
		$('input#tr-dut').html('');
		$('input#tr-dut').val(words[0].dut);
		console.log(engTrans, rusTrans);
	};
};

function searchWord(words) {
	$.get(BASE_URL + '/words?', function(words) {
		$('.show-table').html('');
		var notFound = false;
		for (var i = 0; i < words.length; i++) {
			console.log(notFound);
			if ((searchedWord == words[i].rus) || (searchedWord == words[i].eng) || (searchedWord == words[i].dut)){
				$('.show-table').append('<tr><td>' + words[i].rus + '</td><td>' + words[i].eng + '</td><td>' + words[i].dut +'</td></tr>');
				notFound = true;
			};
		};
		if (!notFound) {
			$('.show-table').append('<tr><td colspan="3">Not found</td></tr>');
		};
	})
	$('.show-table').html('');
	if (searchedWord == ''){
		getPaginatedTable();
	}
};

$(document).ready(function(){
	limit = $('#showLimit').val();
	getPaginatedTable(10, 1);
});

$('.pagination').on('click', 'a', function(){
	event.preventDefault();
	
	if ($(this).hasClass('number')){
		currentPage = $(this).html();
		getPaginatedTable(limit, currentPage);
	};
	if ($(this).hasClass('prev')){
		currentPage = (currentPage > 1) ? currentPage - 1 : 1;
		getPaginatedTable(limit, currentPage);
	};
	if ($(this).hasClass('next')){
		currentPage = (currentPage < totalPages) ? ++currentPage : currentPage;
		getPaginatedTable(limit, currentPage);
	};
	if ($(this).hasClass('beginning')){
		currentPage = 1;
		getPaginatedTable(limit, currentPage);
	};
	if ($(this).hasClass('end')){
		currentPage = totalPages;
		getPaginatedTable(limit, currentPage);
	};
});

$('form input').on('change', function(){
	if($('#rus').val() == '' || $('#eng').val() == '' || $('#dut').val() == '' ){
		$('.send').prop('disabled', true);
	} else {
		$('.send').prop('disabled', false);
	}
});


$('.send').on('click', function(){
	event.preventDefault();
	var rus = $('#rus').val();
	var eng = $('#eng').val();
	var dut = $('#dut').val();

	var addWord = {rus: rus, eng: eng, dut: dut};

	$.post('http://localhost:3000/words', addWord, function(data) {
		console.log(data);
	})
});

$('.show').on('click', function(){
	event.preventDefault();
	getPaginatedTable(10, 1);
});

$('#showLimit').on('change', function(){
	limit = $(this).val();
	currentPage = 1;
	getPaginatedTable(limit, 1);
});

$('#searcher').on('change', function(){
	if (parseInt($(this).val()) > totalPages){
		$(this).val(totalPages);
	};	
	if (parseInt($(this).val()) < 1) {
		$(this).val(1);
	};
	if ($(this).val() == ''){
		$(this).val(currentPage);
	};
	currentPage = $(this).val();
	getPaginatedTable(limit, currentPage);
});

$('.genWord').on('click', function(){
	getRandomWord();
	$('#tr-rus').val('');
	$('#tr-eng').val('');
	$('#tr-dut').val('');

	$('#tr-rus').removeClass('right');
	$('#tr-rus').removeClass('wrong');
	$('#tr-eng').removeClass('right');
	$('#tr-eng').removeClass('wrong');
	$('#tr-dut').removeClass('right');
	$('#tr-dut').removeClass('wrong');
});

$('.check').on('click', function(){
	// пустые или неверные
	if (($('#tr-rus').val() !== rusTrans) || ($('#tr-rus').val() == '')) {
		$('#tr-rus').addClass('wrong');
		console.log(rusTrans, $('#rus').val());
	};

	if (($('#tr-eng').val() !== engTrans) || ($('#tr-eng').val() == '')) {
		$('#tr-eng').addClass('wrong');
	};

	if (($('#tr-dut').val() !== dutTrans) || ($('#tr-dut').val() == '')){
		$('#tr-dut').addClass('wrong');
	};

	if (($('#tr-eng').val() !== engTrans) && ($('#tr-eng').hasClass('right'))){
		$('#tr-eng').removeClass('right');
		$('#tr-eng').addClass('wrong');
	};

	if (($('#tr-dut').val() !== engTrans) && ($('#tr-dut').hasClass('right'))){
		$('#tr-dut').removeClass('right');
		$('#tr-dut').addClass('wrong');
	};

	if ($('#tr-rus').val() == rusTrans) {
		$('#tr-rus').addClass('right');
	};

	if ($('#tr-eng').val() == engTrans) {
		$('#tr-eng').addClass('right');
	};

	if ($('#tr-dut').val() == dutTrans) {
		$('#tr-dut').addClass('right');
	};


	if (($('#tr-rus').val() == rusTrans) && ($('#tr-eng').val() == engTrans) && ($('#tr-dut').val() == dutTrans)) {
		$('.message').html('That\'s right');
	} else {
		$('.message').html('Try again');
		$('.message').addClass('message-wrong');
	}
});

$('#language').on('change', function() {
	currentLang = $(this).val();
	if ($(this).val() == 'eng'){
		$('i.arrow-left').removeClass('fa-angle-right');
		$('i.arrow-left').addClass('fa-angle-left')
	} else if ($(this).val() == 'dut'){
		$('i.arrow-left').removeClass('fa-angle-right');
		$('i.arrow-left').addClass('fa-angle-left')
		$('i.arrow-right').removeClass('fa-angle-right');
		$('i.arrow-right').addClass('fa-angle-left')
	} else {
		$('i.arrow-left').removeClass('fa-angle-left');
		$('i.arrow-left').addClass('fa-angle-right');
		$('i.arrow-right').removeClass('fa-angle-left');
		$('i.arrow-right').addClass('fa-angle-right')
	}
});

$('#search-word').on('change', function(){
	searchedWord = $('#search-word').val();
	searchWord();
});

