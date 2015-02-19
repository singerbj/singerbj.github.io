var setBkrd = function(){
	var t = new Trianglify();
	var pattern = t.generate(1920, 1080);
	document.body.setAttribute('style', 'background-image: ' + pattern.dataUrl);
}

$('document').ready(setBkrd);
