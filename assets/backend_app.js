import './styles/app.scss';
import 'leaflet/dist/leaflet.css'
import './styles/style_backend.scss';
import 'flag-icons/css/flag-icons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

// Reorganized Layout & Page Logic
import './js/layout/dashboard.js';
// import './js/layout/header.js';
import './js/pages/profile.js';
import './js/pages/notifications.js';

//JS
import './js/main';
import L from 'leaflet';
window.L = L;
import './js/map'

