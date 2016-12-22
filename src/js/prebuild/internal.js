/*
 * Blocks initialization
 */
$(document).ready(function(){
	var footer= document.querySelector(".footer");
	footer.addEventListener('click', function(event) {
	alert("I am a footer!");
	});
	var header= document.querySelector(".header");
	header.addEventListener('click', function(event) {
	alert("header");
	});
});
/*
 * Blocks
 */
(function(exports){
	var size =5;
	var price =10;
	exports.calculate = function(){return size*price;};
})(this.calculator={});