import View from './view';
import Model from './model';
import Controller from './controller'
import '../styles/style.css';
document.addEventListener('DOMContentLoaded', () => {
let view = new View();
let model = new Model(view);
let controller = new Controller(model);
controller._initApp();
})