export default class Controller {
    constructor (model) {
        this.model = model
    }
    _initApp() {
        this.model.initCityList();
        this.model.initWidgets();
        this.model.view.container.addEventListener('click', (e) => {
            if (e.target.id === "add") {
                this.model.getNewCity(this.model.view.input.value);
                this.model.view.clearInput();
            } else if (e.target.dataset.id === "delete") {
                this.model.deleteFromServer(e.target.parentNode.id);
                this.model.view.removeCity(e.target);
            } else if (e.target.dataset.type === "location") {
                this.model.view.reNameCity(e.target);
            } else if (e.target.dataset.type === "save") {
                this.model.renameCity(e.target.previousSibling.value, e.target.parentNode)
            } else if (e.target.dataset.type === "close") {
                this.model.view.cancelChange(e.target)

            }

        })
        this.model.view.widgets.addEventListener('click', (e) => {
            if (e.target.id === "locationAllow") {
                this.model.initGeoWidget();
            }
        })
    }
}
