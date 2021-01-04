document.addEventListener('DOMContentLoaded', () => {

class View {
    constructor () {
        this.container = document.querySelector('.container');
        this.input = document.querySelector('input');
    }
    buildCityBlock(res, imagesrc, temp, id, currentBlock) {
        if (!currentBlock) {
            let cityBlock = document.createElement('div');
            cityBlock.id = id;
            cityBlock.classList.add('city');
            this.container.append(cityBlock);
            this.content2CityBlock(cityBlock, res, imagesrc, temp);
        } else {
            currentBlock.innerHTML = '';
            this.content2CityBlock(currentBlock, res, imagesrc, temp);
        }


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
        cityCountry.setAttribute('data-type', 'location')
        button.classList.add('delete-button')
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
    clearInput() {
        this.input.value = '';
    }
    removeCity(target) {
        target.parentNode.remove();
    }
    reNameCity(target) {
        let div = target.parentNode;
        let input = document.createElement('input');
        let button = document.createElement('button');
        button.setAttribute('data-type', 'save')
        input.classList.add('change-city-input');
        button.classList.add('change-city-button')
        input.setAttribute('placeholder', 'Enter new city...')
        button.innerHTML = "save";
        div.replaceChild(input, target);
        div.append(button);

    }
    alertMessage(text) {
        let div = document.createElement('div');
        div.classList.add('alert');
        let h1 = document.createElement('h1');
        h1.innerHTML = text;
        div.append(h1);
        this.container.append(div);
        setTimeout(this.removeAlertMessage, 2000);

    }
    removeAlertMessage() {
        let div = document.querySelector('.alert');
        div.remove();
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
    getData(cityName, id, currentBlock) {
        this.cityList++;
        let promise = fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=e50ec27dac6fac01c3d6889743f8b9d5');
        promise
            .then(res => res.json())
            .then(res => {
                this.view.buildCityBlock(res, this.getWeatherImage(res['weather'][0].icon), this.calculateTempreture(res.main.temp), id, currentBlock);

            })
            .catch(err => this.view.alertMessage('No such city!'))

    }
    getWeatherImage(code) {
        return `http://openweathermap.org/img/wn/${code}@2x.png`
    }
    calculateTempreture(kelvin) {
        return Math.ceil(Number(kelvin) - 273.15);
    }
    saveToServer = (cityName) => {
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
            .then(res => res.json())
            .then(res => this.getData(cityName, res))
            .catch(err => console.log(err))
    }
    deleteFromServer (id) {
        this.cityList--;
        let promise = fetch('http://localhost:3333/' + id, {
            method: "DELETE"
        });
        promise
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }
    changeAtServer(cityName, id) {
        let city = {
            name: cityName
        }
        let promise = fetch('http://localhost:3333/' + id, {
            method: "PUT",
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(city)
        });
        promise
            .then(res => res.text())
            .then(res => this.view.alertMessage('City has been changed!'))
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
                this.model.saveToServer(this.model.view.input.value);
                this.model.view.clearInput();
            } else if (e.target.id === "add" && this.model.cityList === 5) {
                this.model.view.alertMessage('Maximum 5 cities!');
            } else if (e.target.dataset.id === "delete") {
                this.model.deleteFromServer(e.target.parentNode.id);
                this.model.view.removeCity(e.target);
            } else if (e.target.dataset.type === "location") {
                this.model.view.reNameCity(e.target);

            } else if (e.target.dataset.type === "save") {
                this.model.changeAtServer(e.target.parentNode.firstChild.value, e.target.parentNode.id)
                this.model.getData(e.target.parentNode.firstChild.value, e.target.parentNode.id, e.target.parentNode)
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