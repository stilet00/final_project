export default class View {
    constructor () {
        this.container = document.querySelector('.container');
        this.input = document.querySelector('input');
        this.widgets = document.createElement('div');
        this.currencyWidget = document.createElement('div');
        this.geoWidget = document.createElement('div');
    }
    buildCityBlock(res, imagesrc, temp, id, currentBlock) {
        if (!currentBlock) {
            let cityBlock = document.createElement('div');
            cityBlock.id = id;
            cityBlock.setAttribute('data-depth', '0.5')
            cityBlock.classList.add('city');
            cityBlock.style.opacity = 0;
            this.container.append(cityBlock);
            this.content2CityBlock(cityBlock, res, imagesrc, temp);
            let start = Date.now();
            let timer = setInterval(function () {
                // сколько времени прошло с начала анимации?
                let timePassed = Date.now() - start;

                if (timePassed >= 1000) {
                    clearInterval(timer); // закончить анимацию через 2 секунды
                    return;
                }

                // отрисовать анимацию на момент timePassed, прошедший с начала анимации
                draw(timePassed);

            }, 10);

            function draw(timePassed) {
                cityBlock.style.opacity = timePassed/1000;
            }






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
        cityCountry.classList.add('city-country');
        button.classList.add('delete-button');
        button.classList.add('floating-button')
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

            let start = Date.now();
            let timer = setInterval(function () {
                // сколько времени прошло с начала анимации?
                let timePassed = Date.now() - start;

                if (timePassed >= 1000) {
                    clearInterval(timer); // закончить анимацию через 2 секунды
                    target.parentNode.remove();
                    return;
                }

                // отрисовать анимацию на момент timePassed, прошедший с начала анимации
                draw(timePassed);

            }, 10);

            function draw(timePassed) {

                target.parentNode.style.opacity = 1 - timePassed/1000;
                // console.log()
            }


    }
    reNameCity(target) {
        let div = target.parentNode;
        let input = document.createElement('input');
        let buttonSave = document.createElement('button');
        let buttonClose = document.createElement('button');
        buttonClose.setAttribute('data-type', 'close');
        buttonSave.setAttribute('data-type', 'save');
        input.classList.add('change-city-input');
        buttonClose.classList.add('close-change-button');
        buttonClose.classList.add('floating-button');
        buttonSave.classList.add('change-city-button');
        buttonSave.classList.add('floating-button');
        input.setAttribute('placeholder', 'Enter new city...')
        buttonSave.innerHTML = "save";
        buttonClose.innerHTML = "close";
        div.append(input, buttonSave, buttonClose);

    }
    cancelChange(buttonClose) {
        buttonClose.previousSibling.remove();
        buttonClose.previousSibling.remove();
        buttonClose.remove();

    }
    pictureWidgetsBlock() {
        this.widgets.classList.add('widgets');
        this.currencyWidget.classList.add('smallWidget');
        this.geoWidget.classList.add('smallWidget');
        let button = document.createElement('button');
        button.id = 'locationAllow';
        button.classList.add('floating-button')
        button.innerHTML = "Receive your weather";
        this.geoWidget.append(button);
        this.widgets.append(this.geoWidget, this.currencyWidget);
        document.body.append(this.widgets);
    }
    pictureCurrencyWidget(curr) {
        let currency = document.createElement('p');
        currency.innerHTML = curr;
        this.currencyWidget.append(currency)
    }
    pictureGeoWidget(cityName, temp, imgSrc) {
        this.geoWidget.innerHTML = '';
        let city = document.createElement('h2');
        let tempreture = document.createElement('h2');
        let img = document.createElement('img');
        city.innerHTML = cityName;
        tempreture.innerHTML = `${temp} &deg C`;
        img.setAttribute('src', imgSrc);
        this.geoWidget.append(city,tempreture,img);

    }
    geoWidgetWait(text) {
        this.geoWidget.innerHTML = '';
        let h4 = document.createElement('h4')
        h4.innerText = text;
        this.geoWidget.append(h4);
    }
    clearCurrencyWidget() {
        this.currencyWidget.innerHTML = '';
    }

    alertMessage(text) {
        let div = document.createElement('div');
        div.classList.add('alert');
        let h1 = document.createElement('h1');
        h1.innerHTML = text;
        div.style.top = window.pageYOffset + document.documentElement.clientHeight / 3 + 'px';
        div.append(h1);
        this.container.append(div);
        setTimeout(this.removeAlertMessage, 2000);

    }
    removeAlertMessage() {
        let div = document.querySelector('.alert');
        div.remove();
    }
}