// 初始相關變數值
var p = "",     //String variable for for the data path of the route
    geo = "",   //Variable for geojson data path
    gpx = "",   //Variable for gpx data path
    csv = "",   //Variable for csv data path

//Route geojson layergroup
    geolayerGroup = L.layerGroup(),
//Load lines
    initial_line = function () {
                            $(document).ready(function () {
                                $("#line").empty().load("initial_line.txt");
                                $("#route").empty().load("Catalogue/ADL.txt").prop("disabled", true);
                            });
                    }; 
initial_line();

//Download GPX file
function downloadGPX() {
    window.open(gpx);
}

//Download CSV file
function downloadCSV() {
    window.open(csv);
}

//Choose the line
function changeline() {
    var lineIndex = document.getElementById("line").selectedIndex,
        lineOption = document.getElementById("line").options;
    p = lineOption[lineIndex].text;
    var lineTXT = "Catalogue/" + p + ".txt"
    $(document).ready(function(){
        $("#route").empty().load(lineTXT).prop("disabled", false);
    });
}

//Side bar
////////////
function openNav() {
    document.getElementById("menu").style.width = "230px";
    document.getElementById('open').style.opacity = 0;
}

function closeNav() {
    document.getElementById("menu").style.width = "0";
    document.getElementById('open').style.opacity = 1;
}
var about_key = true;
function showabout(){

    if(about_key){
        document.getElementsByClassName("logo_image")[0].style.left = '0px';
        about_key = false;
    }
    else{
        document.getElementsByClassName("logo_image")[0].style.left = '-230px';
        about_key = true;
    }
}