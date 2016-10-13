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