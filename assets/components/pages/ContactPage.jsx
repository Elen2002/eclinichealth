import React from 'react';
import { t } from '../../utils/translations';

const ContactPage = () => {
    const appData = window.APP_DATA || {};
    const { locale = 'en' } = appData;

    return (
        <div className="contact-page pt-3 mt-4">
            <div className="container py-3">
                <div className="section-title text-center mb-4" data-aos="fade-up">
                    <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-2 fw-bold text-uppercase">
                        {t('nav.contact', locale)}
                    </span>
                    <h2 className="display-5 fw-bold mb-3">{t('nav.contact', locale)}</h2>
                    <p className="text-muted lead mx-auto mb-0" style={{ maxWidth: '700px' }}>
                        {t('contact.subtitle', locale)}
                    </p>
                </div>

                <div className="row g-4">
                    <div className="col-lg-4" data-aos="fade-right">
                        <div className="card h-100 border-0 shadow-sm p-4 rounded-4">
                            <div className="info-item d-flex mb-4">
                                <div className="icon-box bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                                    <i className="bi bi-geo-alt fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1">{t('contact.location', locale)}</h5>
                                    <p className="text-muted mb-0"> Yerevan, Armenia</p>
                                </div>
                            </div>

                            <div className="info-item d-flex mb-4">
                                <div className="icon-box bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                                    <i className="bi bi-envelope fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1">{t('contact.email', locale)}</h5>
                                    <p className="text-muted mb-0">info@eclinic.am</p>
                                </div>
                            </div>

                            <div className="info-item d-flex">
                                <div className="icon-box bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                                    <i className="bi bi-phone fs-4"></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1">{t('contact.call', locale)}</h5>
                                    <p className="text-muted mb-0">+374 10 000000</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-top">
                                <h6 className="fw-bold mb-3 text-uppercase small text-muted">{t('contact.workingHours', locale)}</h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-dark">{t('contact.monFri', locale)}</span>
                                    <span className="text-muted">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-dark">{t('contact.satSun', locale)}</span>
                                    <span className="text-muted">{t('contact.closed', locale)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8" data-aos="fade-left">
                        <div className="card border-0 shadow-sm p-4 h-100 rounded-4">
                            <form className="php-email-form">
                                <div className="row gy-4">
                                    <div className="col-md-6">
                                        <label htmlFor="name-field" className="pb-2 fw-semibold">{t('contact.yourName', locale)}</label>
                                        <input type="text" name="name" id="name-field" className="form-control rounded-3 py-2" required />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="email-field" className="pb-2 fw-semibold">{t('contact.yourEmail', locale)}</label>
                                        <input type="email" className="form-control rounded-3 py-2" name="email" id="email-field" required />
                                    </div>

                                    <div className="col-md-12">
                                        <label htmlFor="subject-field" className="pb-2 fw-semibold">{t('contact.subject', locale)}</label>
                                        <input type="text" className="form-control rounded-3 py-2" name="subject" id="subject-field" required />
                                    </div>

                                    <div className="col-md-12">
                                        <label htmlFor="message-field" className="pb-2 fw-semibold">{t('contact.message', locale)}</label>
                                        <textarea className="form-control rounded-3" name="message" rows="5" id="message-field" required></textarea>
                                    </div>

                                    <div className="col-md-12 text-center">
                                        <button type="submit" className="btn btn-primary px-5 py-2 rounded-pill fw-bold">{t('contact.send', locale)}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
