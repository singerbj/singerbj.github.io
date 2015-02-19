var setBkrd = function(){
	var t = new Trianglify();
	var pattern = t.generate(1920, 1920);
	document.body.setAttribute('style', 'background-image: ' + pattern.dataUrl);
}

$(document).ready(function(){
	setBkrd();

	var c = $('.container');
    if (window.devicePixelRatio > 1) {
        var d =  $(document);
        c.width(c.width() * 2);
        c.height(c.height() * 2);
    }
    c.offset( {left: ($(document).width() / 2) - (c.width() / 2), top: ($(document).height() / 2) - (c.height() / 2)});
});
