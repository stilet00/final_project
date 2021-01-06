export default class Model {
    constructor (view) {
        this.view = view
    }
    initCityList() {
        let promise = fetch('http://localhost:3333/cities');
        promise
            .then(res => res.json())
            .then(res => res.forEach(item => {
                this.refreshData(item.name, item._id);
            }))
            .catch(err => console.log(err))
    }
    initWidgets() {
        this.view.pictureWidgetsBlock();
        this.initCurrencyWidget();
    }
    initCurrencyWidget = () => {
        this.view.clearCurrencyWidget()
        let promise = fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
        promise
            .then((res => {
                if (res.ok && res.status === 200) {
                    return res.json();
                } else {
                    return Promise.reject(res.status);
                }}))
            .then(res => res.forEach(item => {
                this.view.pictureCurrencyWidget(`${item.ccy}/${item.base_ccy} : ${item.buy}/${item.sale}`)
            }))
        setTimeout(this.initCurrencyWidget, 3600000)
    }
    initGeoWidget = () => {
        let success = (position) => {
            const lat  = position.coords.latitude;
            const lon = position.coords.longitude;
            let promise = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e50ec27dac6fac01c3d6889743f8b9d5`);
            promise
                .then((res => {
                    if (res.ok && res.status === 200) {
                        return res.json();
                    } else {
                        return Promise.reject(res.status);
                    }}))
                .then(res => this.view.pictureGeoWidget(res.name, this.calculateTempreture(res.main.temp), this.getWeatherImage(res['weather'][0].icon)))
        }

        let error = () => {
            this.view.geoWidgetWait('Unable to retrieve your location');
        }

        if(!navigator.geolocation) {
            this.view.geoWidgetWait('Geolocation is not supported by your browser');
        } else {
            this.view.geoWidgetWait('Locating…');
            navigator.geolocation.getCurrentPosition(success, error);
        }

    }
    refreshData(cityName, id) {
        let promise = fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=e50ec27dac6fac01c3d6889743f8b9d5');
        promise
            .then(res => {
                if (res.ok && res.status === 200) {
                    return res.json();
                } else {
                    return Promise.reject(res.status);
                }})
            .then(res => {
                this.view.buildCityBlock(res, this.getWeatherImage(res['weather'][0].icon), this.calculateTempreture(res.main.temp), id);

            })
            .catch(err => this.view.alert(err)
            )

    }
    getNewCity = (cityName) => {
        let promise = fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=e50ec27dac6fac01c3d6889743f8b9d5');
        promise
            .then(res => {
                if (res.ok && res.status === 200) {
                    return res.json();
                } else {
                    return Promise.reject(res.status);
                }})
            .then(res => this.saveToServer(res))
            .catch(err => this.view.alertMessage('No such city!'))

    }



    renameCity(cityName, parentNode) {
        let promise = fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=e50ec27dac6fac01c3d6889743f8b9d5');
        promise
            .then((res => {
                if (res.ok && res.status === 200) {
                    return res.json();
                } else {
                    return Promise.reject(res.status);
                }}))
            .then(res => this.changeAtServer(cityName, parentNode.id, res, parentNode))
            .catch(err => err?this.view.alertMessage('No such city!'):console.log('no error'))
    }
    getWeatherImage(code) {
        return `http://openweathermap.org/img/wn/${code}@2x.png`
    }
    calculateTempreture(kelvin) {
        return Math.ceil(Number(kelvin) - 273.15);
    }
    saveToServer = (responseFromWeather) => {
        let city = {
            name: responseFromWeather['name'],
        }
        let promise = fetch('http://localhost:3333/add', {
            method: "POST",
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(city)
        });
        promise
            .then((res => {
                if (res.ok && res.status === 200) {
                    return res.json();
                } else {
                    return Promise.reject(res.status);
                }}))
            .then(res => this.view.buildCityBlock(responseFromWeather, this.getWeatherImage(responseFromWeather['weather'][0].icon), this.calculateTempreture(responseFromWeather.main.temp), res))
            .catch(err => console.log(err))
    }
    deleteFromServer (id) {
        this.cityList--;
        let promise = fetch('http://localhost:3333/' + id, {
            method: "DELETE"
        });
        promise
            .then((res => {
                if (res.ok && res.status === 200) {
                    return res.json();
                } else {
                    return Promise.reject(res.status);
                }}))
            .catch(err => console.log(err))
    }
    changeAtServer(cityName, id, freshData, parentNode) {
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
            .then((res => {
                if (res.ok && res.status === 200) {
                    return res.text();
                } else {
                    return Promise.reject(res.status);
                }}))
            .then(res => this.view.buildCityBlock(freshData, this.getWeatherImage(freshData['weather'][0].icon), this.calculateTempreture(freshData.main.temp), id, parentNode))
            .then(res => this.view.alertMessage('City has been changed!'))
            .catch(err => console.log(err))
    }


}