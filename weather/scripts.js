class Weather {
    constructor() {
        this.weather = "clear";
        this.time = "day";
        this.transition = "0";
        this.wind = "none";
    }

    setWeather(weather) {
        this.weather = weather;
        if (weather === 'clear') {
            $('#weather-background').attr('weather', 'clear');
        } else {
            $('#weather-background').attr('weather', 'cloudy');
        }

        if (weather === 'rain') {
            $('.weather').attr('type', 'rain');
            $('.weather').css('display', 'block');
        } else if (weather === 'snow') {
            $('.weather').attr('type', 'snow');
            $('.weather').css('display', 'block');
        } else {
            $('.weather').css('display', 'none');
        }
    }

    setWind(wind) {
        this.wind = wind;
        if (wind === 'wind') {
            $('.weather').attr('wind', 'wind');
        } else if (wind === 'no-wind') {
            $('.weather').attr('wind', 'none');
        }
    }

    setTime(time, transition) {
        this.time = time;
        this.transition = transition;
        $('#weather-background').attr('time', time);
        $('#weather-background').attr('transition', `transition-${transition}`);
    }
}

// ---- Settings ----
const TWILIGHT_MINUTES = 90;   // dawn = 30 min before to 30 min after sunrise (same for dusk/sunset)
const TRANSITION_MINUTES = 90; // the last 30 min of each phase blends into the next one
const TRANSITION_STEP = 10;    // transition-0, transition-10, ... transition-90

const PHASES = ["dawn", "day", "dusk", "night"];

// Open-Meteo times are in the city's local time; convert them to real timestamps
function cityTimeToTimestamp(isoString, utcOffsetSeconds) {
    return Date.parse(isoString + "Z") - utcOffsetSeconds * 1000;
}

function getDayPhase(weather, now = Date.now()) {
    const offset = weather.utc_offset_seconds;
    const twilight = TWILIGHT_MINUTES * 60000;

    // When each phase starts, today (0) and tomorrow (1)
    const phaseStarts = [];
    for (let i = 0; i < 2; i++) {
        const sunrise = cityTimeToTimestamp(weather.daily.sunrise[i], offset);
        const sunset  = cityTimeToTimestamp(weather.daily.sunset[i], offset);
        phaseStarts.push(
            { phase: "dawn",  start: sunrise - twilight },
            { phase: "day",   start: sunrise + twilight },
            { phase: "dusk",  start: sunset - twilight },
            { phase: "night", start: sunset + twilight }
        );
    }

    const nextIndex = phaseStarts.findIndex(p => p.start > now);
    if (nextIndex === -1) return { phase: "night", next: "dawn", transition: 0 };

    // Before today's dawn it's still night
    const phase = nextIndex === 0 ? "night" : phaseStarts[nextIndex - 1].phase;
    const next = phaseStarts[nextIndex];

    // How far into the blend toward the next phase are we?
    const msUntilNext = next.start - now;
    const transitionWindow = TRANSITION_MINUTES * 60000;
    let transition = 0;
    if (msUntilNext < transitionWindow) {
        const progress = 1 - msUntilNext / transitionWindow; // 0 → 1
        transition = Math.min(90, Math.floor((progress * 100) / TRANSITION_STEP) * TRANSITION_STEP);
    }

    return { phase, next: next.phase, transition };
}

function applyDayPhase(weather) {
    const { phase, transition } = getDayPhase(weather);

    $('#weather-background').attr('time', phase);
    $('#weather-background').attr('transition', `transition-${transition}`);
    const UIController = getWeatherUIController();
    UIController.setTime(phase, transition);
}

async function getWeather(city) {
    // 1. Turn the city name into coordinates
    const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    ).then(r => r.json());

    if (!geo.results) throw new Error("City not found");
    const { latitude, longitude, name } = geo.results[0];

    // 2. Get the current weather and a daily forecast
    const weather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
        `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
        `&daily=temperature_2m_max,temperature_2m_min,sunrise,weather_code,sunset&temperature_unit=fahrenheit&timezone=auto`
    ).then(r => r.json());

    return weather;
}

const appState = (function() {
    const weatherUIController = new Weather();
    const icons = {
        clear: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M451.5-771.5Q440-783 440-800v-80q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v80q0 17-11.5 28.5T480-760q-17 0-28.5-11.5ZM678-678q-11-11-11-27.5t11-28.5l56-57q12-12 28.5-12t28.5 12q11 11 11 28t-11 28l-57 57q-11 11-28 11t-28-11Zm122 238q-17 0-28.5-11.5T760-480q0-17 11.5-28.5T800-520h80q17 0 28.5 11.5T920-480q0 17-11.5 28.5T880-440h-80ZM451.5-51.5Q440-63 440-80v-80q0-17 11.5-28.5T480-200q17 0 28.5 11.5T520-160v80q0 17-11.5 28.5T480-40q-17 0-28.5-11.5ZM226-678l-57-56q-12-12-12-29t12-28q11-11 28-11t28 11l57 57q11 11 11 28t-11 28q-12 11-28 11t-28-11Zm508 509-56-57q-11-12-11-28.5t11-27.5q11-11 27.5-11t28.5 11l57 56q12 11 11.5 28T791-169q-12 12-29 12t-28-12ZM80-440q-17 0-28.5-11.5T40-480q0-17 11.5-28.5T80-520h80q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440H80Zm89 271q-11-11-11-28t11-28l57-57q11-11 27.5-11t28.5 11q12 12 12 28.5T282-225l-56 56q-12 12-29 12t-28-12Zm141-141q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47ZM480-480Z"/></svg>',
        partlyCloudy: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M451.5-771.5Q440-783 440-800v-80q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v80q0 17-11.5 28.5T480-760q-17 0-28.5-11.5ZM678-678q-11-11-11-28t11-28l56-57q12-12 28.5-12t28.5 12q11 11 11 28t-11 28l-57 57q-11 11-28 11t-28-11Zm122 238q-17 0-28.5-11.5T760-480q0-17 11.5-28.5T800-520h80q17 0 28.5 11.5T920-480q0 17-11.5 28.5T880-440h-80Zm-66 271-56-57q-11-11-11-28t11-28q11-11 28-11t28 11l57 56q12 12 12 28.5T791-169q-12 12-28.5 12T734-169ZM226-678l-57-57q-11-11-11-28t11-28q12-12 28.5-12t28.5 12l56 57q11 11 11 28t-11 28q-11 11-28 11t-28-11Zm14 478h180q25 0 42.5-17.5T480-260q0-25-17-42.5T421-320h-51l-20-48q-14-33-44-52.5T240-440q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T40-320q0-83 58.5-141.5T240-520q60 0 109.5 32.5T423-400q58 0 97.5 43T560-254q-2 57-42.5 95.5T420-120H240Zm320-134q-5-20-10-39t-10-39q45-19 72.5-59t27.5-89q0-66-47-113t-113-47q-60 0-105 39t-53 99q-20-5-41-9t-41-9q14-88 82.5-144T480-720q100 0 170 70t70 170q0 77-44 138.5T560-254Zm-79-226Z"/></svg>',
        cloudy: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z"/></svg>',
        fog: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M720-200q-17 0-28.5-11.5T680-240q0-17 11.5-28.5T720-280q17 0 28.5 11.5T760-240q0 17-11.5 28.5T720-200ZM280-80q-17 0-28.5-11.5T240-120q0-17 11.5-28.5T280-160q17 0 28.5 11.5T320-120q0 17-11.5 28.5T280-80Zm-40-120q-17 0-28.5-11.5T200-240q0-17 11.5-28.5T240-280h360q17 0 28.5 11.5T640-240q0 17-11.5 28.5T600-200H240ZM400-80q-17 0-28.5-11.5T360-120q0-17 11.5-28.5T400-160h280q17 0 28.5 11.5T720-120q0 17-11.5 28.5T680-80H400ZM300-320q-91 0-155.5-64.5T80-540q0-83 55-145t136-73q32-57 87.5-89.5T480-880q90 0 156.5 57.5T717-679q69 6 116 57t47 122q0 75-52.5 127.5T700-320H300Zm0-80h400q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-40q0-66-47-113t-113-47q-48 0-87.5 26T333-704l-10 24h-25q-57 2-97.5 42.5T160-540q0 58 41 99t99 41Zm180-200Z"/></svg>',
        rain: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M558-84q-15 8-30.5 2.5T504-102l-60-120q-8-15-2.5-30.5T462-276q15-8 30.5-2.5T516-258l60 120q8 15 2.5 30.5T558-84Zm240 0q-15 8-30.5 2.5T744-102l-60-120q-8-15-2.5-30.5T702-276q15-8 30.5-2.5T756-258l60 120q8 15 2.5 30.5T798-84Zm-480 0q-15 8-30.5 2.5T264-102l-60-120q-8-15-2.5-30.5T222-276q15-8 30.5-2.5T276-258l60 120q8 15 2.5 30.5T318-84Zm-18-236q-91 0-155.5-64.5T80-540q0-83 55-145t136-73q32-57 87.5-89.5T480-880q90 0 156.5 57.5T717-679q69 6 116 57t47 122q0 75-52.5 127.5T700-320H300Zm0-80h400q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-40q0-66-47-113t-113-47q-48 0-87.5 26T333-704l-10 24h-25q-57 2-97.5 42.5T160-540q0 58 41 99t99 41Zm180-200Z"/></svg>',
        hail: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m546-86-32 32q-6 6-14 6t-14-6l-32-32q-6-6-6-14t6-14l32-32q6-6 14-6t14 6l32 32q6 6 6 14t-6 14Zm-205-35q-9-9-9-21t9-21l76-76q9-9 21-9t21 9q9 9 9 21t-9 21l-76 76q-9 9-21 9t-21-9Zm325-85-32 32q-6 6-14 6t-14-6l-32-32q-6-6-6-14t6-14l32-32q6-6 14-6t14 6l32 32q6 6 6 14t-6 14Zm-360 0-32 32q-6 6-14 6t-14-6l-32-32q-6-6-6-14t6-14l32-32q6-6 14-6t14 6l32 32q6 6 6 14t-6 14Zm-6-114q-91 0-155.5-64.5T80-540q0-83 55-145t136-73q32-57 87.5-89.5T480-880q90 0 156.5 57.5T717-679q69 6 116 57t47 122q0 75-52.5 127.5T700-320H300Zm0-80h400q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-40q0-66-47-113t-113-47q-48 0-87.5 26T333-704l-10 24h-25q-57 2-97.5 42.5T160-540q0 58 41 99t99 41Zm180-200Z"/></svg>',
        snow: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M224.5-214.5Q210-229 210-250t14.5-35.5Q239-300 260-300t35.5 14.5Q310-271 310-250t-14.5 35.5Q281-200 260-200t-35.5-14.5Zm120 120Q330-109 330-130t14.5-35.5Q359-180 380-180t35.5 14.5Q430-151 430-130t-14.5 35.5Q401-80 380-80t-35.5-14.5Zm120-120Q450-229 450-250t14.5-35.5Q479-300 500-300t35.5 14.5Q550-271 550-250t-14.5 35.5Q521-200 500-200t-35.5-14.5Zm240 0Q690-229 690-250t14.5-35.5Q719-300 740-300t35.5 14.5Q790-271 790-250t-14.5 35.5Q761-200 740-200t-35.5-14.5Zm-120 120Q570-109 570-130t14.5-35.5Q599-180 620-180t35.5 14.5Q670-151 670-130t-14.5 35.5Q641-80 620-80t-35.5-14.5ZM300-360q-91 0-155.5-64.5T80-580q0-83 55-145t136-73q32-57 87.5-89.5T480-920q90 0 156.5 57.5T717-719q69 6 116 57t47 122q0 75-52.5 127.5T700-360H300Zm0-80h400q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-40q0-66-47-113t-113-47q-48 0-87.5 26T333-744l-10 24h-25q-57 2-97.5 42.5T160-580q0 58 41 99t99 41Zm180-100Z"/></svg>',
        mixed: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M457.5-57Q440-74 440-99q0-12 4.5-23t13.5-19l28-26q6-5 14-5t14 5l28 26q9 8 13.5 19t4.5 23q0 25-17.5 42T500-40q-25 0-42.5-17ZM341-121q-9-9-9-21t9-21l76-76q9-9 21-9t21 9q9 9 9 21t-9 21l-76 76q-9 9-21 9t-21-9Zm265-53-32-32q-6-6-6-14t6-14l32-32q6-6 14-6t14 6l32 32q6 6 6 14t-6 14l-32 32q-6 6-14 6t-14-6Zm-300-32-32 32q-6 6-14 6t-14-6l-32-32q-6-6-6-14t6-14l32-32q6-6 14-6t14 6l32 32q6 6 6 14t-6 14Zm-6-114q-91 0-155.5-64.5T80-540q0-83 55-145t136-73q32-57 87.5-89.5T480-880q90 0 156.5 57.5T717-679q69 6 116 57t47 122q0 75-52.5 127.5T700-320H300Zm0-80h400q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-40q0-66-47-113t-113-47q-48 0-87.5 26T333-704l-10 24h-25q-57 2-97.5 42.5T160-540q0 58 41 99t99 41Zm180-200Z"/></svg>',
        thunderstorm: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M327-40q-10 0-15.5-8T309-65l27-75h-62q-5 0-8-4t-1-9l38-107q3-9 10.5-14.5T331-280h49q11 0 17 9t1 19l-31 72h62q6 0 9 5.5t-1 10.5L346-47q-3 4-7 5.5T327-40Zm270-40q-10 0-15.5-8t-2.5-17l19-55h-64q-5 0-8-4t-1-9l31-87q3-9 10.5-14.5T584-280h48q11 0 17.5 9t1.5 19l-23 52h61q6 0 8.5 5.5T696-184l-80 97q-1 1-19 7ZM300-320q-91 0-155.5-64.5T80-540q0-83 55-145t136-73q32-57 87.5-89.5T480-880q90 0 156.5 57.5T717-679q69 6 116 57t47 122q0 75-52.5 127.5T700-320H300Zm0-80h400q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-40q0-66-47-113t-113-47q-48 0-87.5 26T333-704l-10 24h-25q-57 2-97.5 42.5T160-540q0 58 41 99t99 41Zm180-200Z"/></svg>',
    }
    const weatherConfig = {
        0: {
            name: 'Clear',
            icon: icons.clear,
            weather: 'clear'
        },
        1: {
            name: 'Mostly clear',
            icon: icons.clear,
            weather: 'clear'
        },
        2: {
            name: 'Partly cloudy',
            icon: icons.partlyCloudy,
            weather: 'clear'
        },
        3: {
            name: 'Overcast',
            icon: icons.cloudy,
            weather: 'cloudy'
        },
        45: {
            name: 'Foggy',
            icon: icons.fog,
            weather: 'cloudy'
        },
        48: {
            name: 'Foggy',
            icon: icons.fog,
            weather: 'cloudy'
        },
        51: {
            name: 'Drizzling',
            icon: icons.rain,
            weather: 'rain'
        },
        53: {
            name: 'Drizzling',
            icon: icons.rain,
            weather: 'rain'
        },
        55: {
            name: 'Drizzling',
            icon: icons.rain,
            weather: 'rain'
        },
        56: {
            name: 'Freezing rain',
            icon: icons.mixed,
            weather: 'rain'
        },
        57: {
            name: 'Freezing rain',
            icon: icons.mixed,
            weather: 'rain'
        },
        61: {
            name: 'Drizzling',
            icon: icons.rain,
            weather: 'rain'
        },
        63: {
            name: 'Rainy',
            icon: icons.rain,
            weather: 'rain'
        },
        65: {
            name: 'Heavy rain',
            icon: icons.rain,
            weather: 'rain'
        },
        66: {
            name: 'Freezing rain',
            icon: icons.mixed,
            weather: 'rain'
        },
        67: {
            name: 'Freezing rain',
            icon: icons.mixed,
            weather: 'rain'
        },
        71: {
            name: 'Light snow',
            icon: icons.snow,
            weather: 'snow'
        },
        73: {
            name: 'Snowing',
            icon: icons.snow,
            weather: 'snow'
        },
        75: {
            name: 'Snowing',
            icon: icons.snow,
            weather: 'snow'
        },
        77: {
            name: 'Light snow',
            icon: icons.snow,
            weather: 'snow'
        },
        80: {
            name: 'Rainy',
            icon: icons.rain,
            weather: 'rain'
        },
        81: {
            name: 'Rainy',
            icon: icons.rain,
            weather: 'rain'
        },
        82: {
            name: 'Rainy',
            icon: icons.rain,
            weather: 'rain'
        },
        85: {
            name: 'Light snow',
            icon: icons.snow,
            weather: 'snow'
        },
        86: {
            name: 'Snowing',
            icon: icons.snow,
            weather: 'snow'
        },
        95: {
            name: 'Thunderstorm',
            icon: icons.thunderstorm,
            weather: 'rain'
        },
        96: {
            name: 'Thunderstorm',
            icon: icons.thunderstorm,
            weather: 'rain'
        },
        97: {
            name: 'Thunderstorm',
            icon: icons.thunderstorm,
            weather: 'rain'
        },
        99: {
            name: 'Thunderstorm',
            icon: icons.thunderstorm,
            weather: 'rain'
        }
    };

    window.getWeatherUIController = function() {
        return weatherUIController;
    }

    window.getWeatherConfig = function() {
        return weatherConfig;
    }
})();

function buildDayTile(data) {
    const weatherConfig = getWeatherConfig();
    const icon = weatherConfig[data.code].icon;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    let dayString = days[new Date(data.time).getDay()];
    let dateString = new Date(data.time).getMonth() + '/' + new Date(data.time).getDate();

    if (new Date(data.time).getHours() === new Date(Date.now()).getHours()) {
        timeString = 'Today';
    }

    const tile = $(`<div class="tile"><p class="temp-max">${data.temperatureMax}°</p><p class="temp-min">${data.temperatureMin}°</p>${icon}<p class="time day">${dayString}</p><p class="time date">${dateString}</p></div>`);
    $('#daily-forecast').find('.tiles').append(tile);
}

function buildHourTile(data) {
    const weatherConfig = getWeatherConfig();
    const icon = weatherConfig[data.code].icon;
    let timeString = new Date(data.time).getHours() > 12 ? (new Date(data.time).getHours() - 12) + ' PM' : (new Date(data.time).getHours()) + ' AM';
    if (new Date(data.time).getHours() === new Date(Date.now()).getHours()) {
        timeString = 'Now';
    }
    const tile = $(`<div class="tile"><p class="temp">${data.temperature}°</p>${icon}<p class="time">${timeString}</p></div>`);
    $('#hourly-forecast').find('.tiles').append(tile);
}

function loadHourlyForecast(weather) {
    const offset = weather.utc_offset_seconds;

    for (let i = 0; i < 48; i++) {
        if (new Date(cityTimeToTimestamp(weather.hourly.time[i], offset)).getHours() < new Date(Date.now()).getHours()) {
            continue;
        } else {
            buildHourTile({time: cityTimeToTimestamp(weather.hourly.time[i], offset), code: weather.hourly.weather_code[i], temperature: Math.round(weather.hourly.temperature_2m[i])});
        }
    }
}

function loadDailyForecast(weather) {
    const offset = weather.utc_offset_seconds;
    for (let i = 0; i < 7; i++) {

        buildDayTile({time: cityTimeToTimestamp(weather.daily.time[i], offset), code: weather.daily.weather_code[i], temperatureMax: Math.round(weather.daily.temperature_2m_max[i]), temperatureMin: Math.round(weather.daily.temperature_2m_min[i])});
    }

}

async function loadWeather(cityName) {
    const weather = await getWeather(cityName);
    $('#city-name').text(cityName);
    $('#current-temp').text(Math.round(weather.current.temperature_2m) + "°F");
    applyDayPhase(weather);
    setInterval(() => applyDayPhase(weather), 60000);
    const UIController = getWeatherUIController();
    const config = getWeatherConfig();
    UIController.setWeather(config[weather.current.weather_code].weather);
    loadHourlyForecast(weather);
    loadDailyForecast(weather);
}

$(document).ready(async function () {
    let cityName = "Singapore";
    loadWeather(cityName);

    const weatherChangeTimeout = setInterval(() => {
        const cityNames = ['Kansas City', 'Melbourne', 'Monaco', 'Honolulu', 'Singapore'];
        cityName = cityNames[cityNames.indexOf(cityName) + 1 > cityNames.length - 1 ? 0 : cityNames.indexOf(cityName) + 1];
        loadWeather(cityName);
    }, 2000);
});
