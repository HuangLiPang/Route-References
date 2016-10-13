// 初始相關變數值
var p = "";     //String variable for for the data path of the route
var geo = "";   //Variable for geojson data path
var gpx = "";   //Variable for gpx data path
var csv = "";   //Variable for csv data path

//Route geojson layergroup
var geolayerGroup = L.layerGroup();

function initial_line() {
    $(document).ready(function () {
        $("#line").empty().load("initial_line.txt");
        $("#route").empty().load("Catalogue/ADL.txt").prop("disabled", true);
    });
};

//Load lines
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
    p = lineOption[lineIndex].innerHTML;
    var lineTXT = "Catalogue/" + p + ".txt"
    $(document).ready(function(){
        $("#route").empty().load(lineTXT).prop("disabled", false);
    });
}