import React from 'react';
import { createRoot } from 'react-dom/client';
import ContactPage from './components/pages/ContactPage';
import MainLayout from './components/Layout/MainLayout';

const rootElement = document.getElementById('contact-root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <MainLayout>
            <ContactPage />
        </MainLayout>
    );
}
