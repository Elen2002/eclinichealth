import React, { useState, useEffect } from 'react';
import logo from '../../img/header-logo.png';
import { t } from '../../utils/translations.js';

const Header = () => {
    const appData = window.APP_DATA || {};
    const { user, routes, locale = 'en' } = appData;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: 'gb' },
        { code: 'hy', name: 'Հայերեն', flag: 'am' },
        { code: 'ru', name: 'Русский', flag: 'ru' }
    ];

    const currentLang = languages.find(l => l.code === locale) || languages[0];

    const handleLanguageChange = (newLocale) => {
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/');
        
        // Check if path starts with a locale
        if (['en', 'hy', 'ru'].includes(pathSegments[1])) {
            pathSegments[1] = newLocale;
        } else {
            pathSegments.splice(1, 0, newLocale);
        }
        
        window.location.href = pathSegments.join('/') + window.location.search + window.location.hash;
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('nav.home', locale), href: `/${locale}` },
        { name: t('nav.howItWorks', locale), href: `/${locale}/how-it-works` },
        { name: t('nav.departments', locale), href: `/${locale}/departments` },
        { name: t('nav.locations', locale), href: `/${locale}/hospitals` },
        { name: t('nav.contact', locale), href: `/${locale}/contact` }
    ];

    return (
        <header
            id="header"
            className={`header fixed-top transition-all ${isScrolled ? 'bg-white shadow-sm py-2' : 'py-3'}`}
            style={{ 
                transition: 'all 0.3s ease',
                backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(10px)' : 'none'
            }}
        >
            <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
                <a href={routes.home} className="logo d-flex align-items-center me-auto me-xl-0 text-decoration-none">
                    <img src={logo} alt="Logo" className="img-fluid" style={{ maxHeight: '55px' }} />
                </a>

                <nav id="navmenu" className="navmenu d-none d-xl-block mx-auto">
                    <ul className="d-flex align-items-center mb-0 list-unstyled gap-4">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a href={link.href} className="nav-link position-relative py-2" style={{ color: 'var(--nav-color)', fontWeight: 600, fontSize: '0.9rem' }}>
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="d-flex align-items-center gap-3">
                    <div className="position-relative d-none d-md-block">
                        <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-white border cursor-pointer hover-bg-gray transition-all shadow-sm" onClick={() => setIsLangOpen(!isLangOpen)}>
                            <span className={`fi fi-${currentLang.flag} rounded-circle`}></span>
                            <span className="fw-semibold small">{currentLang.name}</span>
                            <i className={`bi bi-chevron-${isLangOpen ? 'up' : 'down'} small opacity-50`}></i>
                        </div>
                        {isLangOpen && (
                            <div className="position-absolute mt-2 end-0 bg-white shadow-lg rounded-4 p-2 animate-fade-in" style={{ zIndex: 1000, minWidth: '160px', border: '1px solid #edf2f7' }}>
                                {languages.map((lang) => (
                                    <div key={lang.code} className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 cursor-pointer transition-all ${lang.code === locale ? 'bg-primary-subtle text-primary fw-bold' : 'hover-bg-light text-dark'}`} onClick={() => handleLanguageChange(lang.code)}>
                                        <span className={`fi fi-${lang.flag} rounded-circle`}></span>
                                        <span className="small">{lang.name}</span>
                                        {lang.code === locale && <i className="bi bi-check2 ms-auto"></i>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <a href={user ? user.dashboard_url : routes.login} 
                       className="btn rounded-pill px-4 py-2 d-none d-md-flex align-items-center gap-2 transition-all shadow-sm border-0 text-white"
                       style={{
                           background: 'linear-gradient(135deg, #1977cc 0%, #3b82f6 100%)',
                           boxShadow: '0 4px 15px rgba(25, 119, 204, 0.2)',
                           fontWeight: '600',
                           letterSpacing: '0.01em'
                       }}>
                        <span className="small">{user ? t('nav.myProfile', locale) : t('nav.login', locale)}</span>
                        <div className="d-flex align-items-center justify-content-center rounded-circle" 
                             style={{ 
                                 width: '32px', 
                                 height: '32px', 
                                 background: 'rgba(255, 255, 255, 0.2)',
                                 border: '1px solid rgba(255, 255, 255, 0.1)'
                             }}>
                            <i className={`bi ${user ? 'bi-grid-fill' : 'bi-arrow-right-short'} text-white`} style={{ fontSize: '1.1rem' }}></i>
                        </div>
                    </a>
                    <button className="btn btn-link p-0 border-0 d-xl-none ms-2" onClick={() => setIsMenuOpen(true)}>
                        <i className="bi bi-list fs-1 text-dark"></i>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .nav-link {
                    transition: color 0.3s ease;
                }
                .nav-link::before {
                    display: none !important;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: 0;
                    left: 0;
                    background: #1977cc;
                    transition: width 0.3s ease;
                }
                .nav-link:hover::after {
                    width: 100%;
                }
                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(25, 119, 204, 0.3) !important;
                    filter: brightness(1.1);
                }
                .hover-bg-gray:hover {
                    background-color: #f8f9fa !important;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>

            {isMenuOpen && (
                <div className="mobile-nav-overlay position-fixed top-0 start-0 w-100 h-100 bg-white d-xl-none" style={{ zIndex: 2000, paddingTop: '80px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '120px', overflowY: 'auto' }}>
                    <ul className="list-unstyled">
                        {navLinks.map((link) => (
                            <li key={link.name} className="mb-4">
                                <a href={link.href} className="fs-3 fw-bold text-dark text-decoration-none" onClick={() => setIsMenuOpen(false)}>
                                    {link.name}
                                </a>
                            </li>
                        ))}
                        <li className="mt-5">
                            <a href={user ? user.dashboard_url : routes.login} className="btn btn-primary btn-lg w-100 rounded-pill mb-4">
                                {user ? t('nav.goToPortal', locale) : t('nav.login', locale)}
                            </a>
                        </li>
                    </ul>
                    <button onClick={() => setIsMenuOpen(false)} className="position-absolute top-0 end-0 m-4 btn-close fs-3"></button>
                </div>
            )}
        </header>
    );
};

export default Header;
