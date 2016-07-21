function initial_line() {
    $(document).ready(function () {
        $("#line").empty().load("initial_line.txt");
        $("#route").empty().load("Catalogue/ADL.txt").prop("disabled", true);
    });
}

//Download GPX file
function downloadGPX() {
    window.open(gpx);
}

//Download CSV file
function downloadCSV() {
    window.open(csv);
}

//auto detect the display screen
function autosize() {
    //Detect the device, mobile or pc
    //If it's a mobile device, DetectTierIphone will send a True.
    var device = false,
        ios = false,
        android = false,
        win = $(window).height(),
        winwidth = $(window).width();
    
    device = MobileEsp.DetectTierIphone();
    ios = MobileEsp.DetectIphone();
    android = MobileEsp.DetectAndroidPhone();
    
    if (device || ios || android) {
        if (win > winwidth) {
            $("#css").attr("href", "main_mobile.css");
            mobileallsize();
        } else {
            $("#css").attr("href", "main_mobile_rotate.css");
            menusize();
        }
            
    } else {
        menusize();
    }

    //Minimize the menu bar's height in 30px
    function menusize() {
        var showmap = $("#showmap").height(),
            menu = $("#menu").height(),
            smallwin = win - 30,
            string = smallwin.toString() + "px";

        if (win * 0.035 < 30) {
            document.getElementById("showmap").style.top = "30px";
            document.getElementById("showmap").style.height = string;
        }
    }
    
    function mobileallsize() {
        var menuHeight = win * 0.18,
            mapHeight = win * 0.82,
            line = win * 0.06,
            buttonTop = win * 0.12,
            GPXwidth = winwidth * 0.35,
            CSVleft = winwidth * 0.35,
            CSVwidth = winwidth * 0.35,
            RESETleft = winwidth * 0.7,
            RESETwidth = winwidth * 0.3;
            
            //download = 2 * line,
            //downloadwidth = winwidth * 0.5;
        
        document.getElementById("menu").style.top = "0px";
        document.getElementById("menu").style.height = menuHeight.toString() + "px";
        document.getElementById("showmap").style.top = menuHeight.toString() + "px";
        document.getElementById("showmap").style.height = mapHeight.toString() + "px";
        document.getElementById("line").style.top = "0px";
        document.getElementById("line").style.height = line.toString() + "px";
        document.getElementById("route").style.top = line.toString() + "px";
        document.getElementById("route").style.height = line.toString() + "px";
        document.getElementById("GPX").style.top = buttonTop.toString() + "px";
        document.getElementById("GPX").style.height = line.toString() + "px";
        document.getElementById("GPX").style.left = "0px";
        document.getElementById("GPX").style.width = GPXwidth.toString() + "px";
        document.getElementById("CSV").style.top = buttonTop.toString() + "px";
        document.getElementById("CSV").style.height = line.toString() + "px";
        document.getElementById("CSV").style.left = CSVleft.toString() + "px";
        document.getElementById("CSV").style.width = CSVwidth.toString() + "px";
        document.getElementById("reset").style.top = buttonTop.toString() + "px";
        document.getElementById("reset").style.height = line.toString() + "px";
        document.getElementById("reset").style.left = RESETleft.toString() + "px";
        document.getElementById("reset").style.width = RESETwidth.toString() + "px";
    }
}

//Choose the line
function changeline() {
    var ar = document.getElementById("line");
    switch (Number(ar.value)) {
    case 1:
        ADL();
        p = "ADL";
        break;
    case 2:
        ADR();
        p = "ADR";
        break;
    case 3:
        AGI();
        p = "AGI";
        break;
    case 4:
        APG();
        p = "APG";
        break;
    case 5:
        ASA();
        p = "ASA";
        break;
    case 6:
        AUE();
        p = "AUE";
        break;
    case 7:
        AUE3();
        p = "AUE3";
        break;
    case 8:
        CAT();
        p = "CAT";
        break;
    case 9:
        CES();
        p = "CES";
        break;
    case 10:
        CPM();
        p = "CPM";
        break;
    case 11:
        CPS();
        p = "CPS";
        break;
    case 12:
        FAX();
        p = "FAX";
        break;
    case 13:
        FRS();
        p = "FRS";
        break;
    case 14:
        HBT();
        p = "HBT";
        break;
    case 15:
        HDT();
        p = "HDT";
        break;
    case 16:
        HKH();
        p = "HKH";
        break;
    case 17:
        HTW();
        p = "HTW";
        break;
    case 18:
        IBS();
        p = "IBS";
        break;
    case 19:
        IGS();
        p = "IGS";
        break;
    case 20:
        IMX();
        p = "IMX";
        break;
    case 21:
        JTH();
        p = "JTH";
        break;
    case 22:
        JTP();
        p = "JTP";
        break;
    case 23:
        KHP();
        p = "KHP";
        break;
    case 24:
        LKX();
        p = "LKX";
        break;
    case 25:
        NSA();
        p = "NSA";
        break;
    case 26:
        NSC();
        p = "NSC";
        break;
    case 27:
        NSD();
        p = "NSD";
        break;
    case 28:
        NUE();
        p = "NUE";
        break;
    case 29:
        NUE3();
        p = "NUE3";
        break;
    case 30:
        SCH();
        p = "SCH";
        break;
    case 31:
        STW();
        p = "STW";
        break;
    case 32:
        SYS();
        p = "SYS";
        break;
    case 33:
        TAE();
        p = "TAE";
        break;
    case 34:
        TBS();
        p = "TBS";
        break;
    case 35:
        TPI();
        p = "TPI";
        break;
    case 36:
        TPN();
        p = "TPN";
        break;
    case 37:
        TPS();
        p = "TPS";
        break;
    case 38:
        TWT();
        p = "TWT";
        break;
    case 39:
        VIM();
        p = "VIM";
        break;
    case 40:
        VSM();
        p = "VSM";
        break;
    case 41:
        WSA();
        p = "WSA";
        break;
    case 42:
        WSA2();
        p = "WSA2";
        break;
    };
}

function change_tile(){
                
                if(tile_switch){
                    tile_group.removeLayer(tile_satellite);
                    
                    tile_street.addTo(tile_group);
                    
                    document.getElementById("tile").innerHTML = "Satellite</br>Map";
                    
                    distanceline.setStyle({color: 'black'});
                    
                    tile_switch = tile_group.hasLayer(tile_satellite);
                }
                else{
                    tile_group.removeLayer(tile_street);
                    
                    tile_satellite.addTo(tile_group);
                    
                    document.getElementById("tile").innerHTML = "Streets</br>Map";
                    
                    distanceline.setStyle({color: 'white'});
                    
                    tile_switch = tile_group.hasLayer(tile_satellite);
                };
            };