// import './stimulus_bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import 'leaflet/dist/leaflet.css'
import './styles/app.scss';
import './styles/style.scss';
import './styles/beauty.scss';
import 'flag-icons/css/flag-icons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

// JS
import './js/main.js';
import 'leaflet/dist/leaflet.js'
import './js/map.js'
import './js/home_chart.js';

// React (Temporary imports for remaining pages)
import React from 'react';
import { createRoot } from 'react-dom/client';
import DoctorDashboard from './components/DoctorDashboard.jsx';
import HospitalPage from './components/pages/Hospital/HospitalPage.jsx';
import HowItWorksPage from './components/pages/HowItWorksPage.jsx';
import DepartmentsPage from './components/pages/DepartmentsPage.jsx';
import DepartmentDetailPage from './components/pages/DepartmentDetailPage.jsx';

document.addEventListener('DOMContentLoaded', () => {
    // React components still in transition
    // ...

    // Doctor Dashboard
    const doctorDashboardRoot = document.getElementById('doctor-dashboard-root');
    if (doctorDashboardRoot) {
        const root = createRoot(doctorDashboardRoot);
        const data = doctorDashboardRoot.dataset;
        root.render(
            <DoctorDashboard
                doctor={JSON.parse(data.doctor || '{}')}
                hospital={JSON.parse(data.hospital || '{}')}
                department={JSON.parse(data.department || '{}')}
                totalPatients={parseInt(data.totalPatients || '0')}
                pendingConsultations={parseInt(data.pendingConsultations || '0')}
                doctorPatients={JSON.parse(data.doctorPatients || '[]')}
                recentConsultations={JSON.parse(data.recentConsultations || '[]')}
                chartLabels={JSON.parse(data.chartLabels || '[]')}
                chartData={JSON.parse(data.chartData || '[]')}
                urlPatterns={JSON.parse(data.urlPatterns || '{}')}
            />
        );
    }

    // Other pages in transition...
    // Hospital Page
    const hospitalPageRoot = document.getElementById('hospital-page-root');
    if (hospitalPageRoot) {
        const root = createRoot(hospitalPageRoot);
        const data = JSON.parse(hospitalPageRoot.dataset.hospital || '{}');
        root.render(<HospitalPage hospitalData={data} />);
    }

    // How It Works Page
    const howItWorksRoot = document.getElementById('how-it-works-root');
    if (howItWorksRoot) {
        const root = createRoot(howItWorksRoot);
        root.render(<HowItWorksPage />);
    }

    // Departments Page
    const departmentsRoot = document.getElementById('departments-page-root');
    if (departmentsRoot) {
        const root = createRoot(departmentsRoot);
        const data = departmentsRoot.dataset;
        root.render(<DepartmentsPage departments={JSON.parse(data.departments || '[]')} />);
    }

    // Department Detail Page
    const departmentDetailRoot = document.getElementById('department-detail-page-root');
    if (departmentDetailRoot) {
        const root = createRoot(departmentDetailRoot);
        const data = departmentDetailRoot.dataset;
        root.render(<DepartmentDetailPage department={JSON.parse(data.department || '{}')} />);
    }
});

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');
