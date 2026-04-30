import React from 'react';
import { t } from '../../utils/translations.js';
import logo from '../../img/header-logo.png';

const Footer = () => {
    const appData = window.APP_DATA || {};
    const { routes, locale = 'en' } = appData;

    return (
        <footer id="footer" className="footer position-relative overflow-hidden" style={{ background: '#0a0f1d', color: 'rgba(255,255,255,0.7)', padding: '100px 0 40px' }}>
            {/* Background Decorative Elements */}
            <div className="footer-glow" style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(133, 96, 205, 0.05)', borderRadius: '50%', filter: 'blur(100px)' }}></div>
            <div className="footer-glow" style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', background: 'rgba(146, 191, 231, 0.05)', borderRadius: '50%', filter: 'blur(80px)' }}></div>

            <div className="container position-relative">
                <div className="row gy-5">
                    
                    {/* Brand Section */}
                    <div className="col-lg-4 col-md-6">
                        <a href={routes?.home || '/'} className="logo d-flex align-items-center mb-4 text-decoration-none">
                            <img src={logo} alt="Logo" className="img-fluid" style={{ maxHeight: '60px' }} />
                        </a>
                        <p className="pe-lg-5 mb-4" style={{ lineHeight: '1.8', color: 'rgba(255,255,255,0.7)' }}>
                            {locale === 'hy' 
                                ? 'Համաշխարհային մակարդակի առողջապահություն՝ հասանելի բոլորին: Մենք համատեղում ենք բժշկական գիտությունը առաջադեմ տեխնոլոգիաների հետ:' 
                                : 'World-class healthcare accessible to everyone. We combine medical science with cutting-edge technology to provide the best patient experience.'}
                        </p>
                        <div className="social-links d-flex gap-3">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
                                <a key={social} href="#" className="social-icon d-flex align-items-center justify-content-center rounded-circle transition-all" 
                                   style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none' }}>
                                    <i className={`bi bi-${social}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <h5 className="text-white fw-bold mb-4">{t('footer.quickLinks', locale)}</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li><a href={`/${locale || 'hy'}`} className="footer-link text-decoration-none transition-all">{t('nav.home', locale)}</a></li>
                            <li><a href={`/${locale || 'hy'}/how-it-works`} className="footer-link text-decoration-none transition-all">{t('nav.howItWorks', locale)}</a></li>
                            <li><a href={`/${locale || 'hy'}/departments`} className="footer-link text-decoration-none transition-all">{t('nav.departments', locale)}</a></li>
                            <li><a href={`/${locale || 'hy'}/hospitals`} className="footer-link text-decoration-none transition-all">{t('nav.locations', locale)}</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="text-white fw-bold mb-4">{t('footer.ourServices', locale)}</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li className="d-flex align-items-center gap-2"><i className="bi bi-patch-check text-primary small"></i> {t('footer.diagnostics', locale)}</li>
                            <li className="d-flex align-items-center gap-2"><i className="bi bi-patch-check text-primary small"></i> {t('footer.treatment', locale)}</li>
                            <li className="d-flex align-items-center gap-2"><i className="bi bi-patch-check text-primary small"></i> {t('footer.preventive', locale)}</li>
                            <li className="d-flex align-items-center gap-2"><i className="bi bi-patch-check text-primary small"></i> {t('footer.laboratory', locale)}</li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="text-white fw-bold mb-4">{t('footer.stayHealthy', locale)}</h5>
                        <p className="small mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('footer.subscribeText', locale)}</p>
                        <div className="newsletter-form mb-4">
                            <div className="input-group p-1 rounded-pill transition-all" 
                                 style={{ 
                                     background: 'rgba(255,255,255,0.03)', 
                                     border: '1px solid rgba(255,255,255,0.1)',
                                     backdropFilter: 'blur(5px)'
                                 }}>
                                <input type="email" 
                                       className="form-control bg-transparent border-0 text-white px-4 py-2" 
                                       placeholder={t('footer.emailPlaceholder', locale)} 
                                       style={{ boxShadow: 'none', fontSize: '0.9rem' }} />
                                <button className="btn rounded-pill px-4 fw-bold text-white transition-all shadow-sm" 
                                        style={{ 
                                            background: 'linear-gradient(135deg, #6f0098 0%, #9260cd 100%)', 
                                            border: 'none',
                                            fontSize: '0.9rem'
                                        }}>
                                    {t('footer.joinBtn', locale)}
                                </button>
                            </div>
                        </div>
                        <div className="contact-info d-flex flex-column gap-2 small">
                            <div className="d-flex align-items-center gap-2"><i className="bi bi-telephone text-primary"></i> +1 234 567 8900</div>
                            <div className="d-flex align-items-center gap-2"><i className="bi bi-envelope text-primary"></i> info@eclinic.health</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="container">
                <div className="mt-5 pt-4 border-top border-secondary border-opacity-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <p className="mb-0 small">© {new Date().getFullYear()} <strong className="text-white">eclinic.</strong> All Rights Reserved.</p>
                    <div className="d-flex gap-4 small">
                        <a href="#" className="footer-link text-decoration-none">Privacy Policy</a>
                        <a href="#" className="footer-link text-decoration-none">Terms of Service</a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .footer-link {
                    color: rgba(255,255,255,0.7);
                }
                .footer-link:hover {
                    color: var(--brand-color);
                    padding-left: 5px;
                }
                .social-icon:hover {
                    background: var(--brand-color) !important;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(133, 96, 205, 0.3);
                }
                .bg-gradient-purple {
                    background: linear-gradient(135deg, var(--brand-color), #b196de);
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                .tracking-tight {
                    letter-spacing: -0.02em;
                }
                .input-group:focus-within {
                    border-color: var(--brand-color) !important;
                    box-shadow: 0 0 15px rgba(111, 0, 152, 0.2);
                    background: rgba(255,255,255,0.06) !important;
                }
                .newsletter-form button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 5px 15px rgba(111, 0, 152, 0.4);
                }
            `}</style>
        </footer>
    );
};

export default Footer;

