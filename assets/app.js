const container = document.getElementById("container"),
contButton = document.getElementById("contButton"),
backButton = document.getElementById("backButton"),
datePicker = document.getElementById("datePicker"),
clock = document.getElementById("clock"),
alarmSound = document.getElementById("alarmSound");

var timer;

function setCookie(name, value) {
    var alarmDate = new Date(datePicker.value);
    document.cookie = name + "=" + value + ";" + alarmDate.toGMTString();
}

function getCookie(name) {
    name = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookies = decodedCookie.split(';');

    for (cookie of cookies) {
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }

        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return "";
}

function formatNumber(number) {
    return parseInt(number).toLocaleString("tr-TR", {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
}

function updateTime(isStart = false) {
    var now = new Date(Date.now());
    var sDt = new Date(datePicker.value);

    var dDt = (sDt - now) / 1000;

    var seconds = Math.floor(dDt % 60).toFixed(0);
    var minutes = Math.floor((dDt / 60) % 60).toFixed(0);
    var hours = Math.floor((dDt / 60) / 60).toFixed(0);

    if (!isStart) {
        if (parseInt(seconds) == 0 && parseInt(minutes) == 0 && parseInt(hours) == 0) {
            clearInterval(timer);
            alarmSound.play();
            alarmSound.loop = true;
        }
    }

    clock.innerHTML = formatNumber(hours) + ":" + formatNumber(minutes) + ":" + formatNumber(seconds);

    return parseInt(seconds);
}

function togglePages() {
    container.classList.toggle("page1");
    container.classList.toggle("page2");
}

contButton.addEventListener("click", function () {
    var second = updateTime(true);
    var value = datePicker.value;

    if (second <= 0) {
        alert("Geçmiş bir zamana kuramazsınız.");
    } else {
        if (value == "") {
            alert("Bir zaman seçiniz.");
        } else {
            timer = setInterval(updateTime, 1000);
            setCookie("alarmDate", value);
            togglePages();
        }
    }
});

backButton.addEventListener("click", function () {
    clearInterval(timer);
    alarmSound.pause();
    alarmSound.currentTime = 0;
    setCookie("alarmDate", "");
    togglePages();
});

var selectedDate = getCookie("alarmDate");

if (selectedDate != null && selectedDate != "") {
    datePicker.value = selectedDate;
    contButton.click();
}