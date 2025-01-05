// selecting elements
const temp = document.getElementById("temp")
const date = document.getElementById("date-time")
let condition=document.getElementById("condition")
let perc=document.getElementById("rain")
let curLocation=document.getElementById("location")
// let mainIcon = document.getElementById("weather-image")
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
            // getWeatherData(data.city, currentUnit, hourlyorWeek);
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
        // wIcon.src=icons(today.icon)
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
           curLocation.innerText = data.address
           condition.innerText = today.conditions 
           perc.innerText="Perc -" + today.precip + "%";
        });
    }

    // convert cencius to fahrenheit
    function celciusToFahrenheit(temp){
        return ((temp*9)/5+ 32).toFixed(1);
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
// function icons(a)
// {
//     if(a=="partly-cloudy-day" || a=="cloudy")
//     {
//         return "https://i.ibb.co/PZQXH8V/27.png"
//     }
//     else if(a=="partly-cloudy-night")
//     {
//         return "https://i.ibb.co/Kzkk59k/15.png"
//     }
//     else if(a=="rain")
//     {  
//         return "https://i.ibb.co/kBd2NTS/39.png"
//     }
//     else if(a=="clear-day")
//     {
//         return "https://i.ibb.co/rb4rrJL/26.png"
//     }
//     else if(a=="clear-night")
//     {
//         return "https://i.ibb.co/1nxNGHL/10.png"
//     }
// }
    

