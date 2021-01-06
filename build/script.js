"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function () {
  var View = /*#__PURE__*/function () {
    function View() {
      _classCallCheck(this, View);

      this.container = document.querySelector('.container');
      this.input = document.querySelector('input');
      this.widgets = document.createElement('div');
      this.currencyWidget = document.createElement('div');
      this.geoWidget = document.createElement('div');
    }

    _createClass(View, [{
      key: "buildCityBlock",
      value: function buildCityBlock(res, imagesrc, temp, id, currentBlock) {
        if (!currentBlock) {
          var cityBlock = document.createElement('div');
          cityBlock.id = id;
          cityBlock.classList.add('city');
          this.container.append(cityBlock);
          this.content2CityBlock(cityBlock, res, imagesrc, temp);
        } else {
          currentBlock.innerHTML = '';
          this.content2CityBlock(currentBlock, res, imagesrc, temp);
        }
      }
    }, {
      key: "content2CityBlock",
      value: function content2CityBlock(cityBlock, res, imagesrc, temp) {
        var cityCountry = document.createElement('h2');
        var button = document.createElement('button');
        var image = document.createElement('img');
        var tempreture = document.createElement('h3');
        var maxInfo = document.createElement('div');
        var skyState = document.createElement('h3');
        var windSpeed = document.createElement('h3');
        var humidity = document.createElement('h3');
        cityCountry.setAttribute('data-type', 'location');
        cityCountry.classList.add('city-country');
        button.classList.add('delete-button');
        button.classList.add('floating-button');
        button.innerHTML = 'DELETE';
        button.setAttribute('data-id', "delete");
        image.setAttribute('src', imagesrc);
        tempreture.innerHTML = "".concat(temp, " &deg C");
        maxInfo.classList.add('maxInfo');
        skyState.innerHTML = res.weather[0].description;
        windSpeed.innerHTML = "wind: ".concat(res.wind.speed, "mph");
        humidity.innerHTML = "humidity: ".concat(res.main.humidity, "%");
        cityCountry.innerText = "".concat(res.name, ", ").concat(res.sys.country);
        cityBlock.append(cityCountry, image, tempreture, maxInfo, button);
        maxInfo.append(skyState, windSpeed, humidity);
      }
    }, {
      key: "clearInput",
      value: function clearInput() {
        this.input.value = '';
      }
    }, {
      key: "removeCity",
      value: function removeCity(target) {
        target.parentNode.remove();
      }
    }, {
      key: "pictureRename",
      value: function pictureRename(target) {
        var div = target.parentNode;
        var input = document.createElement('input');
        var buttonSave = document.createElement('button');
        var buttonClose = document.createElement('button');
        buttonClose.setAttribute('data-type', 'close');
        buttonSave.setAttribute('data-type', 'save');
        input.classList.add('change-city-input');
        buttonClose.classList.add('close-change-button');
        buttonClose.classList.add('floating-button');
        buttonSave.classList.add('change-city-button');
        buttonSave.classList.add('floating-button');
        input.setAttribute('placeholder', 'Enter new city...');
        buttonSave.innerHTML = "save";
        buttonClose.innerHTML = "close";
        div.append(input, buttonSave, buttonClose);
      }
    }, {
      key: "cancelChange",
      value: function cancelChange(buttonClose) {
        buttonClose.previousSibling.remove();
        buttonClose.previousSibling.remove();
        buttonClose.remove();
      }
    }, {
      key: "pictureWidgetsBlock",
      value: function pictureWidgetsBlock() {
        this.widgets.classList.add('widgets');
        this.currencyWidget.classList.add('smallWidget');
        this.geoWidget.classList.add('smallWidget');
        var button = document.createElement('button');
        button.id = 'locationAllow';
        button.classList.add('floating-button');
        button.innerHTML = "Receive your weather";
        this.geoWidget.append(button);
        this.widgets.append(this.geoWidget, this.currencyWidget);
        document.body.append(this.widgets);
      }
    }, {
      key: "pictureCurrencyWidget",
      value: function pictureCurrencyWidget(curr) {
        var currency = document.createElement('p');
        currency.innerHTML = curr;
        this.currencyWidget.append(currency);
      }
    }, {
      key: "pictureGeoWidget",
      value: function pictureGeoWidget(cityName, temp, imgSrc) {
        this.geoWidget.innerHTML = '';
        var city = document.createElement('h2');
        var tempreture = document.createElement('h2');
        var img = document.createElement('img');
        city.innerHTML = cityName;
        tempreture.innerHTML = "".concat(temp, " &deg C");
        img.setAttribute('src', imgSrc);
        this.geoWidget.append(city, tempreture, img);
      }
    }, {
      key: "geoWidgetWait",
      value: function geoWidgetWait(text) {
        this.geoWidget.innerHTML = '';
        var h4 = document.createElement('h4');
        h4.innerText = text;
        this.geoWidget.append(h4);
      }
    }, {
      key: "clearCurrencyWidget",
      value: function clearCurrencyWidget() {
        this.currencyWidget.innerHTML = '';
      }
    }, {
      key: "alertMessage",
      value: function alertMessage(text) {
        var div = document.createElement('div');
        div.classList.add('alert');
        var h1 = document.createElement('h1');
        h1.innerHTML = text;
        div.style.top = window.pageYOffset + document.documentElement.clientHeight / 3 + 'px';
        div.append(h1);
        this.container.append(div);
        setTimeout(this.removeAlertMessage, 2000);
      }
    }, {
      key: "removeAlertMessage",
      value: function removeAlertMessage() {
        var div = document.querySelector('.alert');
        div.remove();
      }
    }]);

    return View;
  }();

  var Model = /*#__PURE__*/function () {
    function Model(view) {
      var _this = this;

      _classCallCheck(this, Model);

      _defineProperty(this, "initCurrencyWidget", function () {
        _this.view.clearCurrencyWidget();

        var promise = fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
        promise.then(function (res) {
          if (res.ok && res.status === 200) {
            return res.json();
          } else {
            return Promise.reject(res.status);
          }
        }).then(function (res) {
          return res.forEach(function (item) {
            _this.view.pictureCurrencyWidget("".concat(item.ccy, "/").concat(item.base_ccy, " : ").concat(item.buy, "/").concat(item.sale));
          });
        });
        setTimeout(_this.initCurrencyWidget, 3600000);
      });

      _defineProperty(this, "initGeoWidget", function () {
        var success = function success(position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          var promise = fetch("https://api.openweathermap.org/data/2.5/weather?lat=".concat(lat, "&lon=").concat(lon, "&appid=e50ec27dac6fac01c3d6889743f8b9d5"));
          promise.then(function (res) {
            if (res.ok && res.status === 200) {
              return res.json();
            } else {
              return Promise.reject(res.status);
            }
          }).then(function (res) {
            return _this.view.pictureGeoWidget(res.name, _this.calculateTempreture(res.main.temp), _this.getWeatherImage(res['weather'][0].icon));
          });
        };

        var error = function error() {
          _this.view.geoWidgetWait('Unable to retrieve your location');
        };

        if (!navigator.geolocation) {
          _this.view.geoWidgetWait('Geolocation is not supported by your browser');
        } else {
          _this.view.geoWidgetWait('Locating…');

          navigator.geolocation.getCurrentPosition(success, error);
        }
      });

      _defineProperty(this, "getNewCity", function (cityName) {
        var promise = fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=e50ec27dac6fac01c3d6889743f8b9d5');
        promise.then(function (res) {
          if (res.ok && res.status === 200) {
            return res.json();
          } else {
            return Promise.reject(res.status);
          }
        }).then(function (res) {
          return _this.saveToServer(res);
        })["catch"](function (err) {
          return _this.view.alertMessage('No such city!');
        });
      });

      _defineProperty(this, "saveToServer", function (responseFromWeather) {
        var city = {
          name: responseFromWeather['name']
        };
        var promise = fetch('http://localhost:3333/add', {
          method: "POST",
          headers: {
            'Content-type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(city)
        });
        promise.then(function (res) {
          if (res.ok && res.status === 200) {
            return res.json();
          } else {
            return Promise.reject(res.status);
          }
        }).then(function (res) {
          return _this.view.buildCityBlock(responseFromWeather, _this.getWeatherImage(responseFromWeather['weather'][0].icon), _this.calculateTempreture(responseFromWeather.main.temp), res);
        })["catch"](function (err) {
          return console.log(err);
        });
      });

      this.view = view;
    }

    _createClass(Model, [{
      key: "initCityList",
      value: function initCityList() {
        var _this2 = this;

        var promise = fetch('http://localhost:3333/cities');
        promise.then(function (res) {
          return res.json();
        }).then(function (res) {
          return res.forEach(function (item) {
            _this2.refreshData(item.name, item._id);
          });
        })["catch"](function (err) {
          return console.log(err);
        });
      }
    }, {
      key: "initWidgets",
      value: function initWidgets() {
        this.view.pictureWidgetsBlock();
        this.initCurrencyWidget();
      }
    }, {
      key: "refreshData",
      value: function refreshData(cityName, id) {
        var _this3 = this;

        var promise = fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=e50ec27dac6fac01c3d6889743f8b9d5');
        promise.then(function (res) {
          if (res.ok && res.status === 200) {
            return res.json();
          } else {
            return Promise.reject(res.status);
          }
        }).then(function (res) {
          _this3.view.buildCityBlock(res, _this3.getWeatherImage(res['weather'][0].icon), _this3.calculateTempreture(res.main.temp), id);
        })["catch"](function (err) {
          return _this3.view.alert(err);
        });
      }
    }, {
      key: "renameCity",
      value: function renameCity(cityName, parentNode) {
        var _this4 = this;

        var promise = fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=e50ec27dac6fac01c3d6889743f8b9d5');
        promise.then(function (res) {
          if (res.ok && res.status === 200) {
            return res.json();
          } else {
            return Promise.reject(res.status);
          }
        }).then(function (res) {
          return _this4.changeAtServer(cityName, parentNode.id, res, parentNode);
        })["catch"](function (err) {
          return err ? _this4.view.alertMessage('No such city!') : console.log('no error');
        });
      }
    }, {
      key: "getWeatherImage",
      value: function getWeatherImage(code) {
        return "http://openweathermap.org/img/wn/".concat(code, "@2x.png");
      }
    }, {
      key: "calculateTempreture",
      value: function calculateTempreture(kelvin) {
        return Math.ceil(Number(kelvin) - 273.15);
      }
    }, {
      key: "deleteFromServer",
      value: function deleteFromServer(id) {
        var _this5 = this;

        var promise = fetch('http://localhost:3333/' + id, {
          method: "DELETE"
        });
        promise.then(function (res) {
          if (res.ok && res.status === 200) {
            _this5.view.alertMessage('City has been deleted!');
          } else {
            return Promise.reject(res.status);
          }
        })["catch"](function (err) {
          return console.log(err);
        });
      }
    }, {
      key: "changeAtServer",
      value: function changeAtServer(cityName, id, freshData, parentNode) {
        var _this6 = this;

        var city = {
          name: cityName
        };
        var promise = fetch('http://localhost:3333/' + id, {
          method: "PUT",
          headers: {
            'Content-type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(city)
        });
        promise.then(function (res) {
          if (res.ok && res.status === 200) {
            _this6.view.alertMessage('City has been changed!');
          } else {
            return Promise.reject(res.status);
          }
        }).then(function (res) {
          return _this6.view.buildCityBlock(freshData, _this6.getWeatherImage(freshData['weather'][0].icon), _this6.calculateTempreture(freshData.main.temp), id, parentNode);
        })["catch"](function (err) {
          return console.log(err);
        });
      }
    }]);

    return Model;
  }();

  var Controller = /*#__PURE__*/function () {
    function Controller(model) {
      _classCallCheck(this, Controller);

      this.model = model;
    }

    _createClass(Controller, [{
      key: "_initApp",
      value: function _initApp() {
        var _this7 = this;

        this.model.initCityList();
        this.model.initWidgets();
        this.model.view.container.addEventListener('click', function (e) {
          if (e.target.id === "add") {
            _this7.model.getNewCity(_this7.model.view.input.value);

            _this7.model.view.clearInput();
          } else if (e.target.dataset.id === "delete") {
            _this7.model.deleteFromServer(e.target.parentNode.id);

            _this7.model.view.removeCity(e.target);
          } else if (e.target.dataset.type === "location") {
            _this7.model.view.pictureRename(e.target);
          } else if (e.target.dataset.type === "save") {
            _this7.model.renameCity(e.target.previousSibling.value, e.target.parentNode);
          } else if (e.target.dataset.type === "close") {
            _this7.model.view.cancelChange(e.target);
          }
        });
        this.model.view.widgets.addEventListener('click', function (e) {
          if (e.target.id === "locationAllow") {
            _this7.model.initGeoWidget();
          }
        });
      }
    }]);

    return Controller;
  }();

  var view = new View();
  var model = new Model(view);
  var controller = new Controller(model);

  controller._initApp();
});