var vars = {
	a1 : null,
	a2 : null,
	blockResponse : null,
	blockTop : null,
	blockTranslate : null,
	button : null
};

function init(){

	vars.a1 = document.getElementsByTagName('a')[0];
	vars.a2 = document.getElementsByTagName('a')[1];
	vars.blockResponse = document.getElementById('response');
	vars.blockTop = document.getElementById('top');
	vars.blockTranslate = document.getElementById('translate');
	vars.button = document.getElementsByTagName('input')[0];

	vars.button.addEventListener('click', translate );
	vars.a1.addEventListener('click', topShow );
	vars.a2.addEventListener('click', translateShow );

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
  				obrab(textEn, text); // responseText -- текст ответа.
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
		console.log(word);
		localStorage.setItem(textEn, word);
	}

}

function topShow(){
	event.preventDefault();
	//blockTop
	vars.blockTranslate.style.display = 'none';
	vars.blockTop.style.display = 'block';
	console.log('a1');
	var lslen = localStorage.length;
	if(lslen > 0){
		var key;
		var result;
		var word =[];

		for(var i=0; i<lslen; i++){
			key = localStorage.key(i);
			result = localStorage.getItem(key);
			result = JSON.parse(result);
			word[i] = result;
			//console.log(result.kol);
		}
		function compareNumeric(a, b) {
		  if (a > b) return 1;
		  if (a < b) return -1;
		}
		//word.sort(compareNumeric);
		console.log(word);
	}
}

function translateShow(){
	event.preventDefault();
	//blockTranslate
	vars.blockTop.style.display = 'none';
	vars.blockTranslate.style.display = 'block';
	console.log('a2');
}
document.addEventListener('DOMContentLoaded', init);
