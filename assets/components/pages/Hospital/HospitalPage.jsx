import React from 'react';
import { t } from '../../../utils/translations.js';

const HospitalPage = ({ hospitalData }) => {
    const hospital = hospitalData.hospital;
    const heroImage = hospitalData.images && hospitalData.images.length > 0 ? hospitalData.images[0] : '/assets/img/hero-bg.jpg';
    const locale = window.APP_DATA?.locale || 'en';
    debugger
    console.log(heroImage)
    return (
        <div className="hospital-page">
            {/* Hero Section */}
            <section className="hero-section position-relative d-flex align-items-center justify-content-center text-center text-white"
                style={{
                    background: `linear-gradient(rgba(13, 17, 23, 0.5), rgba(13, 17, 23, 0.8)), url('${heroImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '50vh',
                    paddingTop: '80px'
                }}>
                <div className="container position-relative" style={{ zIndex: 2 }} data-aos="fade-down" data-aos-duration="1000">
                    <span className="badge bg-primary mb-3 rounded-pill px-3 py-2 fw-bold text-uppercase tracking-wide">{t('hospital.badge', locale)}</span>
                    <h1 className="fw-bold display-4 mb-3 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>{hospital.name}</h1>
                    <p className="lead opacity-100 mb-4 mx-auto text-white" style={{ maxWidth: '600px', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                        <i className="bi bi-geo-alt-fill me-2 text-primary"></i>{hospital.address}
                    </p>
                </div>
            </section>

            <section className="section py-5" style={{ marginTop: '-60px', position: 'relative', zIndex: 3 }}>
                <div className="container">
                    {/* Info Card */}
                    <div className="card border-0 shadow-lg rounded-4 mb-5 overflow-hidden" data-aos="fade-up" data-aos-delay="200">
                        <div className="card-body p-4 p-lg-5 bg-white">
                            <div className="row g-4">
                                <div className="col-md-7">
                                    <h4 className="fw-bold text-primary mb-3">{t('hospital.about', locale)}</h4>
                                    <p className="lead text-muted mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                                        {hospital.about || t('hospital.noDesc', locale)}
                                    </p>
                                </div>
                                <div className="col-md-5 border-start-lg ps-lg-5">
                                    <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                                        <li className="d-flex align-items-center p-3 rounded-3 bg-light" data-aos="fade-left" data-aos-delay="400">
                                            <div className="bg-white rounded-circle p-2 me-3 text-primary shadow-sm"><i className="bi bi-telephone fs-5"></i></div>
                                            <div>
                                                <small className="text-muted d-block uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>{t('hospital.phone', locale)}</small>
                                                <span className="fw-bold">{hospital.phone || t('hospital.na', locale)}</span>
                                            </div>
                                        </li>
                                        <li className="d-flex align-items-center p-3 rounded-3 bg-light" data-aos="fade-left" data-aos-delay="500">
                                            <div className="bg-white rounded-circle p-2 me-3 text-primary shadow-sm"><i className="bi bi-envelope fs-5"></i></div>
                                            <div>
                                                <small className="text-muted d-block uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>{t('hospital.email', locale)}</small>
                                                <span className="fw-bold">{hospital.email || t('hospital.na', locale)}</span>
                                            </div>
                                        </li>
                                        <li className="d-flex align-items-center p-3 rounded-3 bg-light" data-aos="fade-left" data-aos-delay="600">
                                            <div className="bg-white rounded-circle p-2 me-3 text-primary shadow-sm"><i className="bi bi-clock fs-5"></i></div>
                                            <div>
                                                <small className="text-muted d-block uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>{t('hospital.workingHours', locale)}</small>
                                                <span className="fw-bold text-success">{hospital.workingHours || t('hospital.24_7', locale)}</span>
                                            </div>
                                        </li>
                                        <li className="d-flex align-items-center p-3 rounded-3 bg-light" data-aos="fade-left" data-aos-delay="700">
                                            <div className="bg-white rounded-circle p-2 me-3 text-primary shadow-sm"><i className="bi bi-door-open fs-5"></i></div>
                                            <div>
                                                <small className="text-muted d-block uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>{locale === 'hy' ? 'Մահճակալների քանակ' : (locale === 'ru' ? 'Количество коек' : 'Beds Count')}</small>
                                                <span className="fw-bold">{hospital.bedsCount || '0'}</span>
                                            </div>
                                        </li>
                                        <li className="d-flex align-items-center p-3 rounded-3 bg-light" data-aos="fade-left" data-aos-delay="800">
                                            <div className="bg-white rounded-circle p-2 me-3 text-primary shadow-sm"><i className="bi bi-truck fs-5"></i></div>
                                            <div>
                                                <small className="text-muted d-block uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>{locale === 'hy' ? 'Շտապօգնություն' : (locale === 'ru' ? 'Скорая помощь' : 'Ambulance')}</small>
                                                <span className={`fw-bold ${hospital.hasAmbulance ? 'text-success' : 'text-danger'}`}>
                                                    {hospital.hasAmbulance 
                                                        ? (locale === 'hy' ? 'Առկա է' : (locale === 'ru' ? 'Доступно' : 'Available'))
                                                        : (locale === 'hy' ? 'Առկա չէ' : (locale === 'ru' ? 'Недоступно' : 'N/A'))
                                                    }
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Departments List */}
                        <div className="col-lg-4 mb-4" data-aos="fade-right" data-aos-delay="700">
                            <div className="card border-0 shadow-sm rounded-4 h-100">
                                <div className="card-header bg-white border-0 py-3">
                                    <h5 className="fw-bold mb-0 text-primary">{t('hospital.departments', locale)}</h5>
                                </div>
                                <div className="list-group list-group-flush rounded-bottom-4">
                                    {hospital.hospitalDepartments && hospital.hospitalDepartments.length > 0 ? (
                                        hospital.hospitalDepartments.map((hd, index) => (
                                            <div key={index} className="list-group-item px-4 py-3 d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-heart-pulse me-3 text-muted"></i>
                                                    <span className="fw-semibold">{hd.department ? hd.department.name : t('hospital.unknownDept', locale)}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-muted">{t('hospital.noDepts', locale)}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Doctors Grid */}
                        <div className="col-lg-8" data-aos="fade-left" data-aos-delay="700">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold mb-0">{t('hospital.doctors', locale)}</h3>
                                <a href={`/${locale}/consultation/new?hospital=${hospital.id}`} className="btn btn-gradient-purple rounded-pill px-4 py-2 shadow-sm" style={{ width: '20%' }}>
                                    <i className="bi bi-calendar-check me-2"></i> <span className="small fw-bold">{t('hospital.bookAppt', locale)}</span>
                                </a>
                            </div>

                            <div className="row g-4">
                                {hospital.doctors && hospital.doctors.length > 0 ? (
                                    hospital.doctors.map((doctor, index) => (
                                        <div key={doctor.id} className="col-md-6" data-aos="zoom-in" data-aos-delay={800 + (index * 100)}>
                                            <div className="card border-0 shadow-sm h-100 rounded-4 transition-hover">
                                                <div className="card-body p-4">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '60px', height: '60px' }}>
                                                            <i className="bi bi-person-fill fs-3 text-secondary"></i>
                                                        </div>
                                                        <div>
                                                            <h5 className="fw-bold mb-1">{doctor.user && doctor.user.email ? doctor.user.email.split('@')[0] : 'Doctor'}</h5>
                                                            <span className="badge bg-info-subtle text-info-emphasis rounded-pill">{doctor.specialty || t('hospital.specialist', locale)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <small className="text-muted d-block mb-1"><i className="bi bi-hospital me-1"></i> {doctor.department ? doctor.department.name : t('hospital.general', locale)}</small>
                                                        <small className="text-muted"><i className="bi bi-star-fill text-warning me-1"></i> 4. Star Rating</small>
                                                    </div>

                                                    <div className="d-grid">
                                                        <a href={`/${locale}/consultation/new?hospital=${hospital.id}&doctor=${doctor.id}`} className="btn btn-outline-purple rounded-pill py-2">
                                                            {t('hospital.bookVisit', locale)}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 px-4 py-5 text-center text-muted bg-white rounded-4 shadow-sm">
                                        <i className="bi bi-person-x fs-1 mb-3 opacity-25 d-block"></i>
                                        {t('hospital.noDoctors', locale)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .transition-hover {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .transition-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
                }
                .btn-gradient-purple {
                    background: linear-gradient(45deg, var(--brand-color, #6a11cb) 0%, #2575fc 100%);
                    color: white;
                    border: none;
                }
                .btn-gradient-purple:hover {
                    color: white;
                    opacity: 0.9;
                }
                .btn-outline-purple {
                    background-color: var(--brand-color, #6a11cb);
                    color: #ffffff;
                    border: none;
                }
                .btn-outline-purple:hover {
                    background-color: #59359a;
                    color: #ffffff;
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default HospitalPage;

