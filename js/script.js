
let distanceTKMap
let distanceLANMap
const maxAltitude = 8000;
const maxTemperature = 40;
const stepAltitude = 1000;
const stepTemperature = 10;

let factorTKMap
let factorLANMap

let takeOff;
let landing;

let theme
let color

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function checkCookie() {
    // let user = getCookie("username");
    // if (user != "") {
    //   alert("Welcome again " + user);
    // } else {
    //   user = prompt("Please enter your name:", "");
    //   if (user != "" && user != null) {
    //     setCookie("theme", theme, 365);
    //   }
    // }
  }

function changeTheme() {
    btn = document.getElementById("btn") ?? ""
    if (theme == "light") {
        color = "#085bff"
        theme = "dark"
        document.getElementById("theme-icon").setAttribute("class", "bi bi-brightness-high-fill")
        // alert("l: "+theme)
    } else {
        // alert("d: "+theme)
        color = "#1a8cff"
        theme = "light"
        document.getElementById("theme-icon").setAttribute("class", "bi bi-moon-stars-fill")
    }
    if(btn!=""){
        btn.setAttribute("class", "btn btn-lg btn-out-"+theme)
    }
    document.body.setAttribute("data-bs-theme", theme);
    document.getElementById("nav").style.backgroundColor = color
}

function setTheme(){
    checkCookie()
    // alert(theme)
    theme = theme ?? "light"
    document.body.setAttribute("data-bs-theme", theme);
    if (theme == "light") {
        document.getElementById("theme-icon").setAttribute("class", "bi bi-moon-stars-fill")
    } else {
        // alert("has: "+document.getElementsByTagName("html"))
        document.getElementById("theme-icon").setAttribute("class", "bi bi-brightness-high-fill")
        // alert(theme)
    }
}

class Pair {
    key;
    val;

    constructor(key, val) {
        this.key = key;
        this.val = val;
    }

    getKey() {
        return this.key;
    }

    getValue() {
        return this.val;
    }

    setKey(key) {
        this.key = key;
    }

    setVal(val) {
        this.val = val;
    }

    toString() {
        return "" + this.key + " " + this.val
    }
}

function init() {
    setTheme()

    distanceMap()
    factorMap()

    takeOff = new Pair(distanceTKMap, factorTKMap)
    landing = new Pair(distanceLANMap, factorLANMap)

}

function switchMFt(isMeter, value) {
if(isMeter){
return value/0,3048}
else { return value*0,3048}
}

function getDistance() {
    // alert("ciao")
    // d=calcDistance(0, 0, true, true, false)
    // alert("g: "+d.getKey()+" t: "+d.getValue())

    for (i = 0; i < 3; i++) {
        // switch (i) {
        //     case 0:
        //         str = "departure"
        //         break;
        //     case 1:
        //         str = "arrival"
        //         break;
        //     case 2:
        //         str = "arrival"
        //         break;
        // }
        // table = document.getElementById(str)
        rwy = document.getElementById("rwy" + i).value
        el = document.getElementById("elevation" + i).value
        qnh = document.getElementById("qnh" + i).value
        temp = document.getElementById("temp" + i).value
        w = document.getElementById("w" + i).value
        v = document.getElementById("v" + i).value
        factors = document.getElementById("btnPaved" + i).checked || document.getElementById("btnGrass" + i).checked

        isPaved = document.getElementById("btnPaved" + i).checked
        isDry = document.getElementById("btnDry" + i).checked

        isWindy = document.getElementById("btnWnd" + i).checked
        // alert(temp)


        try {
            if (rwy != "") {
                alt = getPA(el, qnh)
                isa = getIsa(temp)
                da = getDa(isa)
                xCWnd = xcWnd(w, v, rwy)
                lcWnd = lCWnd(w, v, rwy)
                resultTK = calcDistance(alt, temp, isPaved, isDry, isWindy, true)
                resultLAN = calcDistance(alt, temp, isPaved, isDry, isWindy, false)
                asdr = resultTK.getKey() + resultLAN.getKey()

                document.getElementById("result" + i).style.display = "flex"

                document.getElementById("pa" + i).value = alt
                document.getElementById("isa" + i).value = isa
                document.getElementById("da" + i).value = da
                document.getElementById("xWnd" + i).value = xCWnd
                document.getElementById("lblLCWnd" + i).innerHTML = lcWnd > 0 ? "T-WIND" : "H-WIND"
                document.getElementById("wnd" + i).value = lcWnd
                document.getElementById("gRollTK" + i).value = resultTK.getKey()
                document.getElementById("totTK" + i).value = resultTK.getValue()
                document.getElementById("gRollLan" + i).value = resultLAN.getKey()
                document.getElementById("totLan" + i).value = resultLAN.getValue()
                document.getElementById("asdr" + i).value = asdr
            }
        }
        catch (e) {
            alert(e)
        }
    }

}

function xcWnd(w, v, rwy) {
    result = v * Math.sin(w - rwy);
    return Math.round(result);

}

function lCWnd(w, v, rwy) {
    result = -v * Math.cos(w - rwy);
    return Math.round(result);
}

function getPA(el, qnh) {
    // System.out.println(el - ((qnh - 1013) * 30));
    return el - ((qnh - 1013) * 30);
}

function getIsa(temp) {
    result = temp - 15;
    return result > 0 ? "+" + result : result;
}

function getDa(isa) {
    result = alt + 120 * isa;
    return result;
}


function calcDistance(alt, temp, isPaved, isDry, isWindy, tk) {
    result = new Pair;
    keyDTable = new Pair(alt, temp) + "";
    // alert(keyDTable)

    distanceTable = tk ? takeOff.getKey() : landing.getKey()
    runwayFactors = tk ? takeOff.getValue() : landing.getValue()

    if (alt > maxAltitude || temp > maxTemperature) {
        throw "not valid values"
    }
    if (alt < 0) {
        alt = 0;
    }
    let gRoll = 0;
    let total = 0;
    // alert(distanceTable.has(keyDTable))
    if (distanceTable.has(keyDTable)) {
        // alert("if")
        gRoll = distanceTable.get(keyDTable).getKey();
        total = distanceTable.get(keyDTable).getValue();
    } else {
        // alert("else")
        if (temp % stepTemperature != 0 && alt % stepAltitude != 0) {
            // alert("if1")
            let stepT = temp % stepTemperature;
            let maxT = Number(temp) + stepTemperature - stepT;
            let minT = temp - stepT;

            let stepA = alt % stepAltitude;
            let maxA = alt + stepAltitude - stepA;
            let minA = alt - stepA;

            // alert(maxT)

            let gRoll_mA = ((distanceTable.get(new Pair(maxT, minA) + "").getKey() - distanceTable.get(new Pair(minT, minA) + "").getKey()) / stepTemperature) * stepT + distanceTable.get(new Pair(minT, minA) + "").getKey();
            let takeOff_mA = (distanceTable.get(new Pair(maxT, minA) + "").getValue() - distanceTable.get(new Pair(minT, minA) + "").getValue()) / stepTemperature * stepT + distanceTable.get(new Pair(minT, minA) + "").getValue();

            let gRoll_MA = (distanceTable.get(new Pair(maxT, maxA) + "").getKey() - distanceTable.get(new Pair(minT, maxA) + "").getKey()) / stepTemperature * stepT + distanceTable.get(new Pair(minT, maxA) + "").getKey();
            let takeOff_MA = (distanceTable.get(new Pair(maxT, maxA) + "").getValue() - distanceTable.get(new Pair(minT, maxA) + "").getValue()) / stepTemperature * stepT + distanceTable.get(new Pair(minT, maxA) + "").getValue();

            //                 System.out.println((gRoll_MA - gRoll_mA)/ stepAltitude* stepA );
            gRoll = (gRoll_MA - gRoll_mA) / stepAltitude * stepA + gRoll_mA;

            total = (takeOff_MA - takeOff_mA) / stepAltitude * stepA + takeOff_mA;

            //                 System.out.println("g: "+gRoll + " t: "+takeOf);
            //                result = new Pai(gRoll, takeOf);
        } else {
            // alert("else1")

            if (temp % stepTemperature != 0) {
                // alert("if2")
                let step = temp % stepTemperature;
                let max = stepTemperature + Number(temp) - step;
                let min = temp - step
                //                    System.out.println(distanceTable.get(new Pair(min, alt)+""));
                // alert(distanceTable.get(new Pair(alt, max) + ""))
                gRoll = ((distanceTable.get(new Pair(max, alt) + "").getKey() - distanceTable.get(new Pair(min, alt) + "").getKey()) / stepTemperature) * step + distanceTable.get(new Pair(min, alt) + "").getKey();
                total = (distanceTable.get(new Pair(max, alt) + "").getValue() - distanceTable.get(new Pair(min, alt) + "").getValue()) / stepTemperature * step + distanceTable.get(new Pair(min, alt) + "").getValue();

                //                    result = new Pai(gRoll, takeOf);
            }
            if (alt % stepAltitude != 0) {
                // alert("if3")
                let step = alt % stepAltitude;
                let max = alt + stepAltitude - step;
                let min = alt - step;

                gRoll = (distanceTable.get(new Pair(temp, max) + "").getKey() - distanceTable.get(new Pair(temp, min) + "").getKey()) * (step / stepAltitude) + distanceTable.get(new Pair(temp, min) + "").getKey();
                total = (distanceTable.get(new Pair(temp, max) + "").getValue() - distanceTable.get(new Pair(temp, min) + "").getValue()) * (step / stepAltitude) + distanceTable.get(new Pair(temp, min) + "").getValue();

                //                    result = new Pai(Math.round(gRoll), Math.round(takeOf));
            }
        }
    }
    // alert("gr: " + gRoll + " tot: " + total)
    if (factors) {
        keyRFactors = new Pair(isPaved, isDry) + "";
        if (!isPaved) {
            if (isDry) {
                //                System.out.println(keyRF);
                if (runwayFactors.get(keyRFactors).getValue()) {
                    total = total - gRoll + runwayFactors.get(keyRFactors).getKey() * gRoll;
                    gRoll *= runwayFactors.get(keyRFactors).getKey();
                } else {
                    total *= runwayFactors.get(keyRFactors).getKey();
                }
            } else {
                if (runwayFactors.get(keyRFactors).getValue()) {
                    total = total - gRoll + runwayFactors.get(keyRFactors).getKey();
                    gRoll *= runwayFactors.get(keyRFactors).getKey();
                } else {
                    total *= runwayFactors.get(keyRFactors).getKey();
                }
            }
        }
    }

    if (isWindy) {
        //            System.out.println("wind: "+ wind );

        gRoll = gRoll + (0.25 * gRoll);
        total = total + (0.25 * total);
    }


gRoll = switchMFt(false, gRoll)
total = switchMFt(false, total)
    result = new Pair(Math.trunc(gRoll), Math.trunc(total));
    // result = new Pair(Math.round(gRoll * 100) / 100.0, Math.round(total * 100) / 100.0);
    // distance = result;

    isMeter = false;

    return result;
}

function distanceMap() {
    distanceTKMap = new Map([
        [new Pair(0, 0) + "", new Pair(640, 1190)],
        [new Pair(0, 1000) + "", new Pair(705, 1310)],
        [new Pair(0, 2000) + "", new Pair(775, 1445)],
        [new Pair(0, 3000) + "", new Pair(855, 1600)],
        [new Pair(0, 4000) + "", new Pair(940, 1775)],
        [new Pair(0, 5000) + "", new Pair(1040, 1970)],
        [new Pair(0, 6000) + "", new Pair(1145, 2200)],
        [new Pair(0, 7000) + "", new Pair(1270, 2470)],
        [new Pair(0, 8000) + "", new Pair(1405, 2800)],
        [new Pair(10, 0) + "", new Pair(695, 1290)],
        [new Pair(10, 1000) + "", new Pair(765, 1420)],
        [new Pair(10, 2000) + "", new Pair(840, 1565)],
        [new Pair(10, 3000) + "", new Pair(925, 1730)],
        [new Pair(10, 4000) + "", new Pair(1020, 1920)],
        [new Pair(10, 5000) + "", new Pair(1125, 2140)],
        [new Pair(10, 6000) + "", new Pair(1245, 2395)],
        [new Pair(10, 7000) + "", new Pair(1375, 2705)],
        [new Pair(10, 8000) + "", new Pair(1525, 3080)],
        [new Pair(20, 0) + "", new Pair(755, 1390)],
        [new Pair(20, 1000) + "", new Pair(825, 1530)],
        [new Pair(20, 2000) + "", new Pair(910, 1690)],
        [new Pair(20, 3000) + "", new Pair(1000, 1870)],
        [new Pair(20, 4000) + "", new Pair(1100, 2080)],
        [new Pair(20, 5000) + "", new Pair(1215, 2320)],
        [new Pair(20, 6000) + "", new Pair(1345, 2610)],
        [new Pair(20, 7000) + "", new Pair(1490, 2960)],
        [new Pair(20, 8000) + "", new Pair(1655, 3395)],
        [new Pair(30, 0) + "", new Pair(810, 1495)],
        [new Pair(30, 1000) + "", new Pair(890, 1645)],
        [new Pair(30, 2000) + "", new Pair(980, 1820)],
        [new Pair(30, 3000) + "", new Pair(1080, 2020)],
        [new Pair(30, 4000) + "", new Pair(1190, 2250)],
        [new Pair(30, 5000) + "", new Pair(1315, 2525)],
        [new Pair(30, 6000) + "", new Pair(1455, 2855)],
        [new Pair(30, 7000) + "", new Pair(1615, 3255)],
        [new Pair(30, 8000) + "", new Pair(1795, 3765)],
        [new Pair(40, 0) + "", new Pair(875, 1605)],
        [new Pair(40, 1000) + "", new Pair(960, 1770)],
        [new Pair(40, 2000) + "", new Pair(1055, 1960)],
        [new Pair(40, 3000) + "", new Pair(1165, 2185)],
        [new Pair(40, 4000) + "", new Pair(1285, 2440)],
        [new Pair(40, 5000) + "", new Pair(1420, 2750)],
        [new Pair(40, 6000) + "", new Pair(1570, 3125)],
        [new Pair(40, 7000) + "", new Pair(1745, 3590)],
        [new Pair(40, 8000) + "", new Pair(1940, 4195)]
    ]);

    distanceLANMap = new Map([
        [new Pair(0, 0) + "", new Pair(450, 1160)],
        [new Pair(0, 1000) + "", new Pair(465, 1185)],
        [new Pair(0, 2000) + "", new Pair(485, 1215)],
        [new Pair(0, 3000) + "", new Pair(500, 1240)],
        [new Pair(0, 4000) + "", new Pair(520, 1275)],
        [new Pair(0, 5000) + "", new Pair(540, 1305)],
        [new Pair(0, 6000) + "", new Pair(560, 1340)],
        [new Pair(0, 7000) + "", new Pair(585, 1375)],
        [new Pair(0, 8000) + "", new Pair(605, 1410)],
        [new Pair(10, 0) + "", new Pair(465, 1185)],
        [new Pair(10, 1000) + "", new Pair(485, 1215)],
        [new Pair(10, 2000) + "", new Pair(500, 1240)],
        [new Pair(10, 3000) + "", new Pair(520, 1275)],
        [new Pair(10, 4000) + "", new Pair(540, 1305)],
        [new Pair(10, 5000) + "", new Pair(560, 1335)],
        [new Pair(10, 6000) + "", new Pair(580, 1370)],
        [new Pair(10, 7000) + "", new Pair(605, 1410)],
        [new Pair(10, 8000) + "", new Pair(630, 1450)],
        [new Pair(20, 0) + "", new Pair(485, 1215)],
        [new Pair(20, 1000) + "", new Pair(500, 1240)],
        [new Pair(20, 2000) + "", new Pair(520, 1270)],
        [new Pair(20, 3000) + "", new Pair(540, 1305)],
        [new Pair(20, 4000) + "", new Pair(560, 1335)],
        [new Pair(20, 5000) + "", new Pair(580, 1370)],
        [new Pair(20, 6000) + "", new Pair(605, 1410)],
        [new Pair(20, 7000) + "", new Pair(625, 1440)],
        [new Pair(20, 8000) + "", new Pair(650, 1480)],
        [new Pair(30, 0) + "", new Pair(500, 1240)],
        [new Pair(30, 1000) + "", new Pair(520, 1270)],
        [new Pair(30, 2000) + "", new Pair(535, 1300)],
        [new Pair(30, 3000) + "", new Pair(560, 1335)],
        [new Pair(30, 4000) + "", new Pair(580, 1370)],
        [new Pair(30, 5000) + "", new Pair(600, 1400)],
        [new Pair(30, 6000) + "", new Pair(625, 1440)],
        [new Pair(30, 7000) + "", new Pair(650, 1480)],
        [new Pair(30, 8000) + "", new Pair(675, 1520)],
        [new Pair(40, 0) + "", new Pair(515, 1565)],
        [new Pair(40, 1000) + "", new Pair(535, 1295)],
        [new Pair(40, 2000) + "", new Pair(555, 1330)],
        [new Pair(40, 3000) + "", new Pair(575, 1360)],
        [new Pair(40, 4000) + "", new Pair(600, 1400)],
        [new Pair(40, 5000) + "", new Pair(620, 1435)],
        [new Pair(40, 6000) + "", new Pair(645, 1475)],
        [new Pair(40, 7000) + "", new Pair(670, 1515)],
        [new Pair(40, 8000) + "", new Pair(695, 1555)]
    ]);
}

function factorMap() {
    factorTKMap = new Map([
        [new Pair(true, true) + "", new Pair(1, false)],
        [new Pair(true, false) + "", new Pair(1.15, false)],
        [new Pair(false, true) + "", new Pair(1.45, true)],
        [new Pair(false, false) + "", new Pair(1.6, false)],
    ])

    factorLANMap = new Map([
        [new Pair(true, true) + "", new Pair(1, false)],
        [new Pair(true, false) + "", new Pair(1, false)],
        [new Pair(false, true) + "", new Pair(1.15, true)],
        [new Pair(false, false) + "", new Pair(1.3, false)],
    ])
}