document.addEventListener('DOMContentLoaded', () => {

class View {
    constructor () {
        this.container = document.querySelector('.container');
    }
    buildCityBlock(res, imagesrc, temp) {
        let cityBlock = document.createElement('div');
        cityBlock.classList.add('city');
        this.container.append(cityBlock);
        this.content2CityBlock(cityBlock, res, imagesrc, temp);
    }
    content2CityBlock(cityBlock, res, imagesrc, temp) {
        let cityCountry = document.createElement('h2');
        let button = document.createElement('button');
        let image = document.createElement('img');
        let tempreture = document.createElement('h3')
        let maxInfo = document.createElement('div');
        let skyState = document.createElement('h3');
        let windSpeed = document.createElement('h3');
        let humidity = document.createElement('h3');
        button.innerHTML = 'DELETE';
        image.setAttribute('src', imagesrc);
        tempreture.innerHTML = `${temp} &deg C`;
        maxInfo.classList.add('maxInfo');
        skyState.innerHTML = res.weather[0].description;
        windSpeed.innerHTML = `wind: ${res.wind.speed}mph`;
        humidity.innerHTML = `humidity: ${res.main.humidity}%`;
        cityCountry.innerText = `${res.name}, ${res.sys.country}`;
        cityBlock.append(cityCountry, image, tempreture, maxInfo, button);
        maxInfo.append(skyState, windSpeed, humidity);

    }
}
class Model {
    constructor (view) {
        this.view = view
    }
    // initCityList() {
    //     let promise = fetch('https://localhost:3333/cities');
    //     promise
    //         .then(res => res.json())
    //         .then(res => res.forEach(item => {
    //           this.view.buildCityBlock(item)
    //         }))
    //         .catch(err => console.log(err))
    // }
    getData(cityName) {
        // this.saveToServer(cityName);
        let promise = fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=e50ec27dac6fac01c3d6889743f8b9d5');
        promise
            .then(res => res.json())
            .then(res => {
                // console.log(res);
                this.view.buildCityBlock(res, this.getWeatherImage(res['weather'][0].icon), this.calculateTempreture(res.main.temp));

            })
            .catch(err => console.log(err))
    }
    getWeatherImage(code) {
        return `http://openweathermap.org/img/wn/${code}@2x.png`
    }
    calculateTempreture(kelvin) {
        return Math.ceil(Number(kelvin) - 273.15);
    }
    saveToServer(cityName) {
        let promise = fetch('https://localhost:3333/add', {
            method: "POST",
            body: `name : ${cityName}`
        });
        promise
            .then(res => alert(res))
            .catch(err => alert(err))
    }
    getCitiList() {
        let promise = fetch('http://localhost:3333/cities');
        promise
            .then(res => res.json())
            .then(res => console.log(res))
    }

}
class Controller {
    constructor (model) {
        this.model = model
    }
    listen() {
        // this.model.initCityList();
        this.model.view.container.addEventListener('click', (e) => {
            if (e.target.id === "add") {
                this.model.getData(e.target.previousElementSibling.value);
            }
            // this.model.saveToServer(e.target.previousElementSibling.value);
        })
        }
    }


let view = new View();
let model = new Model(view);
let controller = new Controller(model);
controller.listen();
// function getBase() {
//     let promise = fetch('https://localhost:3333/cities');
//     promise.then(res => console.log(res))
//         .catch(err => console.log(err))
// }
// getBase()
})