//Side bar
////////////
function openNav() {
    document.getElementById("menu").style.width = "230px";
    document.getElementById('open').style.opacity = 0;
    document.getElementById('open').style.cursor = 'default';
    document.getElementById('open').style.transition = '0.5s 0s';
    window['windyty'].setAttribute('onclick', 'closeNav()');
	document.getElementsByClassName('container-1')[0].style.opacity = 0;
	document.getElementsByClassName('container-1')[1].style.opacity = 0;
	document.getElementsByClassName('container-1')[0].style.transition = '0.5s 0s';
	document.getElementsByClassName('container-1')[1].style.transition = '0.5s 0s';
	document.getElementById('search_result').style.opacity = 0;
	document.getElementById('search_result').style.transition = '0.5s 0s';
}

function closeNav() {
    document.getElementById("menu").style.width = "0";
    document.getElementById('open').style.opacity = 1;
    document.getElementById('open').style.cursor = 'pointer';
    document.getElementById('open').style.transition = '0.5s 0.4s';
    window['windyty'].removeAttribute('onclick');
	document.getElementsByClassName('container-1')[0].style.opacity = 1;
	document.getElementsByClassName('container-1')[1].style.opacity = 1;
	document.getElementsByClassName('container-1')[0].style.transition = '0.5s 0.4s';
	document.getElementsByClassName('container-1')[1].style.transition = '0.5s 0.4s';
	document.getElementById('search_result').style.opacity = 1;
	document.getElementById('search_result').style.transition = '0.5s 0.4s';
}
var about_key = true;

function showabout() {

    if (about_key) {
        document.getElementsByClassName("logo_image")[0].style.left = '0px';
        about_key = false;
    } else {
        document.getElementsByClassName("logo_image")[0].style.left = '-230px';
        about_key = true;
    }
}

function bar_move(bar) {
    bar.classList.toggle("barchange");
}