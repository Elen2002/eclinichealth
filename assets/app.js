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
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'select2/dist/css/select2.min.css';
import $ from 'jquery';
import 'select2';

window.$ = window.jQuery = $;

// Initialize Select2 for all multiselects
document.addEventListener('DOMContentLoaded', () => {
    $('.medical-input[multiple], .select2-enable').select2({
        width: '100%',
        placeholder: 'Select options...',
        allowClear: true
    });
});

// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
});

// React (Temporary imports for remaining pages)
import React from 'react';
import { createRoot } from 'react-dom/client';
import DoctorDashboard from './components/DoctorDashboard.jsx';
import HospitalPage from './components/pages/Hospital/HospitalPage.jsx';
import HowItWorksPage from './components/pages/HowItWorksPage.jsx';
import DepartmentsPage from './components/pages/DepartmentsPage.jsx';
import DepartmentDetailPage from './components/pages/DepartmentDetailPage.jsx';
import AIChatModal from './components/AIChatModal.jsx';
import SupportChatWidget from './components/SupportChatWidget.jsx';
import AdminChatManager from './components/AdminChatManager.jsx';
import DoctorPatientChatPage from './components/DoctorPatientChatPage.jsx';
import NotificationBadge from './components/NotificationBadge.jsx';

const ChatContainer = () => {
    const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);
    const locale = window.APP_DATA?.locale || 'en';
    
    React.useEffect(() => {
        // Allow opening the AI Modal from external triggers (like Home page buttons)
        window.openChat = () => setIsAiModalOpen(true);
    }, []);
    
    return (
        <>
            <SupportChatWidget locale={locale} user={window.APP_DATA?.user} />
            <AIChatModal 
                isOpen={isAiModalOpen} 
                onClose={() => setIsAiModalOpen(false)} 
                locale={locale} 
            />
        </>
    );
};

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
        root.render(<DepartmentsPage
            departments={JSON.parse(data.departments || '[]')}
            departmentImages={JSON.parse(data.departmentImages || '{}')}
        />);
    }

    // Department Detail Page
    const departmentDetailRoot = document.getElementById('department-detail-page-root');
    if (departmentDetailRoot) {
        const root = createRoot(departmentDetailRoot);
        const data = departmentDetailRoot.dataset;
        root.render(<DepartmentDetailPage 
            department={JSON.parse(data.department || '{}')} 
            image={data.image}
        />);
    }

    // Chat (AI + Support)
    const aiChatRoot = document.getElementById('ai-chat-root');
    if (aiChatRoot) {
        const root = createRoot(aiChatRoot);
        root.render(<ChatContainer />);
    }

    // Admin Support Manager
    const adminChatRoot = document.getElementById('admin-chat-root');
    if (adminChatRoot) {
        const root = createRoot(adminChatRoot);
        root.render(<AdminChatManager locale={adminChatRoot.dataset.locale} />);
    }

    // Doctor-Patient Live Chat Page
    const chatPageRoot = document.getElementById('doctor-patient-chat-root');
    if (chatPageRoot) {
        const root = createRoot(chatPageRoot);
        const data = chatPageRoot.dataset;
        root.render(
            <DoctorPatientChatPage 
                doctor={JSON.parse(data.doctor || '{}')}
                patient={JSON.parse(data.patient || '{}')}
                user={JSON.parse(data.user || '{}')}
                locale={data.locale}
            />
        );
    }

    // Global Notification Badge
    const notificationRoot = document.getElementById('notification-badge-root');
    if (notificationRoot) {
        const root = createRoot(notificationRoot);
        root.render(
            <NotificationBadge 
                user={window.APP_DATA?.user}
                locale={window.APP_DATA?.locale}
            />
        );
    }
});

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');
