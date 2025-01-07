// selecting elements
const temp = document.getElementById("temp")
const date = document.getElementById("date-time")
let condition=document.getElementById("condition")
let perc=document.getElementById("rain")
let curLocation=document.getElementById("location")
let mainIcon = document.getElementById("weather-image")
// let wIcon=document.getElementById("icon")
// let searchArea=document.getElementById("searchArea")
let searchLocation=document.getElementById("serLocat")
let searchButton=document.getElementById("searchButton")

let uvIndex = document.querySelector(".uv-index")
let uvText = document.querySelector(".uv-text")
let windSpeed = document.querySelector(".wind-speed")
let sunRice = document.querySelector(".sunrise")
let sunSet = document.querySelector(".sunset")
let humidity = document.querySelector(".humidity")
let humidityStatus = document.querySelector(".humidity-status")
let visibility = document.querySelector(".visibility")
let visibilityStatus = document.querySelector(".visibility-status")
let airQuality = document.querySelector(".air-quality")
let airQualityStatus = document.querySelector(".air-quality-status")
let weatherCards = document.querySelector("#weather-cards")


let currentCity = ''
let currentUnit = 'c'
let hourlyorWeek ='Week'
let today;
let city = ""

// update time & date

function updateDateTime(){
    let now = new Date(),
     hours = now.getHours(),
     minutes = now.getMinutes();

    let days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]

    // 12 hours format
    hours = hours % 12

    // add leading zero
    if(hours<10){
        hours = "0"+ hours
    }
    if(minutes<10){
        minutes = "0"+ minutes
    }

    let dayString = days[now.getDay()];
    return `${dayString}, ${hours}:${minutes}`

}
    date.textContent = updateDateTime();
// update time every second
setInterval(()=>{
    date.textContent = updateDateTime();
},1000)


// function to fetch data from api
 function geoLocation(){
        fetch("https://geolocation-db.com/json/")
        .then((response)=> response.json())
        .then((data)=>{
            currentCity = data.currentCity;
            console.log(data);
            getWeatherData(data.city, currentUnit, hourlyorWeek);
        })
        .catch((err)=>{
            console.log(err);    
        })
}
geoLocation();


searchLocation.addEventListener("keyup", (event) => {
    city = event.target.value;
    
});


//Weather data
    searchButton.addEventListener("click",()=>{
        
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`)
    .then((res)=>{return res.json()})
    .then((data)=>{
        console.log(data);
        
         today=data.currentConditions;
        temp.innerText=today.temp;
        curLocation.innerHTML=data.resolvedAddress;
        condition.innerText=today.conditions;
        perc.innerText="perc-" + today.precip + "%";
        visibility.textContent = today.visibility
        humidity.textContent = today.humidity
        uvIndex.textContent = today.uvindex
     
    })
})

    ////////////////////////////////////////////////////////////////////////////////////////////
    function getWeatherData(city, unit, hourlyorWeek){
        fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`)
        .then(response => response.json())
        .then((data)=>{
            console.log(data);
            let today = data.currentConditions
            if(unit === "c"){
                temp.innerText = today.temp
            }
            else{
                temp.innerText = celciusToFahrenheit(today.temp);
            }
           curLocation.innerText = data.address;
           condition.innerText = today.conditions; 
           perc.innerText="Perc -" + today.precip + "%";
           uvIndex.innerText = today.uvindex;
           windSpeed.innerText = today.windspeed;
           humidity.innerText = today.humidity + "%"
           visibility.innerText = today.visibility;
           airQuality.innerText = today.winddir;
           measureUvIndex(today.uvindex);
           updateHumidityStatus(today.humidity);
           updateVisibilityStatus(today.visibility);
           updateAirQualityStatus(today.winddir);
           sunRice.innerText = convertTimeTo12HourFormat(today.sunrise);
           sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
           mainIcon.src = getWeatherImg(today.icon);

           if(hourlyorWeek === "hourly"){
                updateForecast(data.days[0].hours, unit, "day")
           }
           else{
                updateForecast(data.days, unit, "week")
           }
           
        })
        .catch((err)=>{
            console.log(err);
            
        })
    }

    // convert cencius to fahrenheit
    function celciusToFahrenheit(temp){
        return ((temp*9)/5+ 32).toFixed(1);
    }


    // function to get uv index status

    function measureUvIndex(uvIndex){

        if(uvIndex <= 2){
            uvText.innerText = "Low";
        }
        else if(uvIndex <= 5){
            uvText.innerText = "Moderate";
        }else if(uvIndex <= 7){
            uvText.innerText = "High";
        }else if(uvIndex <= 5){
            uvText.innerText = "Very High";
        }
        else{
             uvText.innerText = "Extreme";
        }
    }

     // function to get Humidity Status

    function updateHumidityStatus(humidity){
        if(humidity <=30){
            humidityStatus.innerText = "Low";
        }
        else if(humidity <=60){
             humidityStatus.innerText = "Moderate";
        }
        else{
             humidityStatus.innerText = "High";
        }
    }

     // function to get Visibility Status

    function updateVisibilityStatus(visibility){
        if(visibility <= 0.3){
            visibilityStatus.innerText = "Dense Fog";
        }else if(visibility <= 0.16){
            visibilityStatus.innerText = "Moderate Fog";
        }else if(visibility <= 0.35){
            visibilityStatus.innerText = "Very Light Fog";
        }else if(visibility <= 2.16){
            visibilityStatus.innerText = "Light Mist";
        }else if(visibility <= 5.4){
            visibilityStatus.innerText = "Very Light Mist";
        }else if(visibility <= 10.8){
            visibilityStatus.innerText = "Clear Air";
        }else{
             visibilityStatus.innerText = "Very Clear Air";
        }
    }

     // function to get AirQuality Status

    function updateAirQualityStatus(airQuality){
        if(airQuality <= 50){
            airQualityStatus.innerText = "Good";
        }
        else if(airQuality <= 100){
            airQualityStatus.innerText = "Moderate";
       } else if(airQuality <= 150){
            airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
       } else if(airQuality <= 200){
            airQualityStatus.innerText = "Unhealthy";
       } else if(airQuality <= 250){
            airQualityStatus.innerText = "Very Unhealthy";
       }else{
             airQualityStatus.innerText = "Hazardous";
       }
   }


   function convertTimeTo12HourFormat(time){
        let hours = parseInt(time.split(":")[0]);
        let minutes = parseInt(time.split(":")[1]);
        let ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours ? hours : 12;
            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
        let strTime = hours + ":" + minutes + " " + ampm;
        return strTime;
   }

    // wather-image   
   function getWeatherImg(condition)
   {
       if(condition === "partly-cloudy-day")
       {
           return "https://i.ibb.co/PZQXH8V/27.png"
       }
       else if(condition === "partly-cloudy-night")
       {
           return "https://i.ibb.co/Kzkk59k/15.png"
       }
       else if(condition === "rain")
       {  
           return "https://i.ibb.co/kBd2NTS/39.png"
       }
       else if(condition === "clear-day")
       {
           return "https://i.ibb.co/rb4rrJL/26.png"
       }
       else if(condition === "clear-night")
       {
           return "https://i.ibb.co/1nxNGHL/10.png"
       }
       else{
           return "https://i.ibb.co/rb4rrJL/26.png"
       }
   }

    function getDayName(date){
        let day = new Date(date);
        let days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
        return days[day.getDay()]
    }

    function getHour(time){
        let hour = time.split(":")[0];
        let min = time.split(":")[1];
        if(hour < 12){
            hour = hour - 12;
            return `${hour}:${min} PM`
        }else{
             return `${hour}:${min} PM`
        }
    }

   function updateForecast(data, unit, type){
        weatherCards.innerHTML = ""

        let day = 0
        let numberCards = 0

        if(type == "day"){
            numberCards = 24;
        }
        else{
            numberCards = 7;
        }
        for(let i=0;i<numberCards;i++){
            let card = document.createElement("div");
            card.classList.add("card");
            // hour if hourly time and day name if weekly
            let dayName = getHour(data[day].datetime);
            if(type === "week"){
                dayName = getDayName(data[day].datetime);
            }
            let dayTemp = data[day].temp
            if(unit === "f"){
                dayTemp = celciusToFahrenheit(data[day].temp);
            }
            let iconCondition = data[day].icon;
                let iconSrc = getWeatherImg(iconCondition);
                let tempUnit = "°C"
                if(unit === "f"){
                    tempUnit = "°F"
                }
                card.innerHTML = `
                 <h2 class="day-name">${dayName}</h2>
                    <div class="card-icon">
                        <img src="${iconSrc}" alt="">
                    </div>
                    <div class="day-temp">
                        <h2 class="temp">${dayTemp}</h2>
                        <span class="temp-unit">${tempUnit}</span>
                    </div>`;
            
            weatherCards.appendChild(card);
            day++;
        }
   }

  




    /////////////////////////////////////////////////////////////////////////////////////////////

// function currentLocation(){
//     fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/bangalore?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`)
//     .then((res)=>{return res.json()})
//     .then((curData)=>{
//         console.log(curData);
        
//          today=curData.currentConditions;
//         temp.innerText=today.temp;
//         curLocation.innerHTML=curData.resolvedAddress;
//         condition.innerText=today.conditions;
//         perc.innerText="perc-"+today.precip+"%";
//         visib.textContent = today.visibility
//         humidity.textContent = today.humidity
//         uvIndex.textContent = today.uvindex
//     })
// }
// currentLocation()





//weather Icons
    

