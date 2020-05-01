$(document).ready(function() {
    var controller = new ScrollMagic.Controller();


    function pathPrepare ($el) {
		var lineLength = $el[0].getTotalLength();
		$el.css("stroke-dasharray", lineLength);
		$el.css("stroke-dashoffset", lineLength);
	}

	var $annim = $("#annim");

	// prepare SVG
	pathPrepare($annim);

	// build tween
	var tween = new TimelineMax()
		.add(TweenMax.to($annim, 1, {strokeDashoffset: 0, ease:Linear.easeNone}))
		.add(TweenMax.to("path#annim", 1, {stroke: "#33629c", ease:Linear.easeNone}), 0);
	// build scene
	var scene = new ScrollMagic.Scene({triggerElement: "#intro", duration: 100, tweenChanges: true})
					.setTween(tween)

    var scene1 = new ScrollMagic.Scene({
        triggerElement: '#project01'
    }).setClassToggle('#project01', 'fade-in');

    var scene2 = new ScrollMagic.Scene({
        triggerElement: '#project02'
    }).setClassToggle('#project02', 'fade-in');

    var scene3 = new ScrollMagic.Scene({
        triggerElement: '#project03'
    }).setClassToggle('#project03', 'fade-in');

    var scene4 = new ScrollMagic.Scene({
        triggerElement: '#project04'
    }).setClassToggle('#project04', 'fade-in');

    var scene5 = new ScrollMagic.Scene({
        triggerElement: '#project05'
    }).setClassToggle('#project05', 'fade-in');

    // Add Scene to ScrollMagic Controller
    controller.addScene([
        scene,
        scene1,
        scene2,
        scene3,
        scene4,
        scene5
    ]);
});