var vars = {
	a1 : null,
	a2 : null,
	a3 : null,
	a4 : null,
	blockResponse : null,
	blockTop : null,
	blockTranslate : null,
	button : null
};

function init(){

	vars.a1 = document.getElementsByTagName('a')[0];
	vars.a2 = document.getElementsByTagName('a')[1];
	vars.a3 = document.getElementsByTagName('a')[2];
	vars.a4 = document.getElementsByTagName('a')[3];
	vars.blockResponse = document.getElementById('response');
	vars.blockTop = document.getElementById('top');
	vars.blockTranslate = document.getElementById('translate');
	vars.button = document.getElementsByTagName('input')[0];

	vars.button.addEventListener('click', translate );
	vars.a1.addEventListener('click', topShow );
	vars.a2.addEventListener('click', translateShow );
	vars.a3.addEventListener('click', ru );
	vars.a4.addEventListener('click', clear );

}
function ru(){
event.preventDefault();
event.target.style.backgroundColor = '#A3FF7D';
}

function translate(){
	var info = {
	api : 'https://translate.yandex.net/api/v1.5/tr.json/translate',
	key :'trnsl.1.1.20160501T155658Z.8b673c0790c60468.ca0b364473891481bb8315a6d703ed2d4068aa35',
	lang :'en-ru',
	};
	var textEn = document.getElementsByTagName('textarea')[0].value;
	var text = encodeURIComponent(textEn);
	if(text=='')return;

	response.innerHTML = 'Перевод...';

	var url = info.api+'?key='+info.key+'&lang='+info.lang;//+'&text='+text;
	var req = new XMLHttpRequest();

	req.open('POST', url, false);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	
	req.onreadystatechange = function () {
		if(req.readyState == 4) {
    		if (req.status != 200) {
  				alert( req.status + ': ' + req.statusText );
			}
			if (req.status == 200){
				text = JSON.parse(req.responseText);
				text = text.text[0];
  				obrab(textEn, text);
  			}
		}
	}
	req.send('text='+text);
}

function obrab(textEn, text){
	
	vars.blockResponse.innerHTML = text;

	if( /\s/.test(textEn))return;

	var word = {
		ru: text,
		en: textEn,
		kol: 1
	};

	var data = localStorage.getItem(textEn);
	if(data == null){
		data = JSON.stringify(word);
		localStorage.setItem(textEn, data);
	}
	else{
		data = JSON.parse(data);
		word.kol = data.kol+1;
		word = JSON.stringify(word);
		localStorage.setItem(textEn, word);
	}
}

function topShow(){
	event.preventDefault();
	vars.blockTranslate.style.display = 'none';
	vars.blockTop.style.display = 'block';
	var beli = document.getElementsByTagName('li').length;
	var lslen = localStorage.length;
	if( lslen == beli )return;
		var key;
		var result;
		var word =[];
		
		for ( var i=0; i<lslen; i++ ){
			key = localStorage.key(i);
			result = localStorage.getItem(key);
			result = JSON.parse(result);
			if ( Array.isArray(word[result.kol] )==false){
				word[result.kol] = new Array(result);
			}
			else {
				word[result.kol].push(result);
			}
		}
		var ul = document.getElementsByTagName('ul');
		//console.log(word);
		function compareNumeric(a, b) {
		  if (a > b) return 1;
		  if (a < b) return -1;
		}
		word = word.sort(compareNumeric);
		//console.log(word.length);//+1 ?
		for(var i=0; i < word.length-1; i++){

			for(var x=0; x < word[i].length; x++){
				var li = document.createElement('li');
				li.innerHTML = word[i][x].en+' ('+word[i][x].kol+') '+' - '+word[i][x].ru;
				ul[0].appendChild(li);
			}
		}
}

function translateShow(){
	event.preventDefault();
	vars.blockTop.style.display = 'none';
	vars.blockTranslate.style.display = 'block';
}

function clear(){
	event.preventDefault();
	var beli = document.getElementsByTagName('li');
	if( beli.length == 0 )return;
	localStorage.clear();
	var ul = document.getElementsByTagName('ul');
	ul[0].innerHTML = '';
}
document.addEventListener('DOMContentLoaded', init);
