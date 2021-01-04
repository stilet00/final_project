document.addEventListener('DOMContentLoaded', () => {

class View {
    constructor () {
        this.container = document.querySelector('.container');
        this.input = document.querySelector('input');
    }
    buildCityBlock(res, imagesrc, temp, id) {
        let cityBlock = document.createElement('div');
        cityBlock.id = id;
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
        button.setAttribute('data-id', "delete");
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
    // clearCityList() {
    //     this.cityBlock.innerHTML = '';
    // }
    clearInput() {
        this.input.innerHTML = '';
    }
    removeCity(target) {
        target.parentNode.remove();
    }
}
class Model {
    constructor (view) {
            this.view = view,
            this.cityList = 0
    }
    initCityList() {
        let promise = fetch('http://localhost:3333/cities');
        promise
            .then(res => res.json())
            .then(res => res.forEach(item => {
              this.getData(item.name, item._id);
            }))
            .catch(err => console.log(err))
    }
    getData(cityName, id) {
        this.cityList++;
        let promise = fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=e50ec27dac6fac01c3d6889743f8b9d5');
        promise
            .then(res => res.json())
            .then(res => {
                this.view.buildCityBlock(res, this.getWeatherImage(res['weather'][0].icon), this.calculateTempreture(res.main.temp), id);

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
        let city = {
            name: cityName
        }
        let promise = fetch('http://localhost:3333/add', {
            method: "POST",
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(city)
        });
        promise
            .then(res => res.text())
            .then(res => console.log('done'))
            .catch(err => console.log('not done'))
    }
    deleteFromServer (id) {
        let promise = fetch('http://localhost:3333/' + id, {
            method: "DELETE"
        });
        promise
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

}
class Controller {
    constructor (model) {
        this.model = model
    }
    listen() {
        this.model.initCityList();
        this.model.view.container.addEventListener('click', (e) => {
            if (e.target.id === "add" && this.model.cityList !== 5) {
                this.model.getData(this.model.view.input.value);
                this.model.saveToServer(this.model.view.input.value);
                this.model.view.clearInput();
                console.log(this.model.cityList)
            } else if (e.target.id === "add" && this.model.cityList === 5) {
                alert('Maximum 5 cities!');
            } else if (e.target.dataset.id === "delete") {
                this.model.deleteFromServer(e.target.parentNode.id);
                this.model.view.removeCity(e.target);
            }

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