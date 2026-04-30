import React, { useEffect } from 'react';
import aboutImage from '../../../img/about.png';
import heroClinic from '../../../img/hero-clinic-new.png';
import cardiologyBg from '../../../img/cardiology_institute_bg.png';
import aiAssistant from '../../../img/ai-assistant.png';
import bookingArt from '../../../img/booking-art-new.png';
import AIChatModal from '../../AIChatModal.jsx';
import { t } from '../../../utils/translations.js';

const HomePage = ({ hospitals = [], departments = [], doctors = [], stats = {}, chartLabels = [], chartData = [], addresses = [], locale: propsLocale }) => {
    const locale = propsLocale || window.APP_DATA?.locale || 'en';
    const [isChatOpen, setIsChatOpen] = React.useState(false);

    return (
        <div className="main-wrapper" style={{ background: '#fdfdff' }}>

            {/* --- HERO SECTION --- */}
            <section id="hero" className="hero-modern d-flex align-items-center py-5" style={{ minHeight: '85vh', position: 'relative', overflow: 'hidden' }}>
                <div className="hero-blob hero-blob-1 pulse-subtle" style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', background: 'rgba(133, 96, 205, 0.08)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0 }}></div>
                <div className="hero-blob hero-blob-2 pulse-subtle" style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(146, 191, 231, 0.12)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }}></div>

                <div className="container position-relative py-5">
                    <div className="row align-items-center gy-5">
                        <div className="col-lg-5" data-aos="fade-right">
                            <h1 className="display-2 fw-bold mb-4" style={{ color: '#1a1a1a', letterSpacing: '-1.5px', lineHeight: '1.1' }}>
                                {t('home.hero.title1', locale)}<br />
                                <span style={{ background: 'linear-gradient(135deg, var(--brand-color), #b196de)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('home.hero.title2', locale)}</span>
                            </h1>
                            <p className="lead mb-5" style={{ color: '#555', fontSize: '1.2rem', maxWidth: '480px', lineHeight: '1.6' }}>
                                {t('home.hero.subtitle', locale)}
                            </p>

                            <div className="d-flex gap-3 flex-wrap">
                                <a href="#beauty-experience" className="btn btn-gradient-purple rounded-pill px-5 py-3 shadow-lg fw-bold" style={{ fontSize: '1rem' }}>
                                    {t('home.hero.cta', locale)}
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-7" data-aos="zoom-in" data-aos-delay="200">
                            <div className="hero-image-container ps-lg-5">
                                <div className="hero-image-card" style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        inset: '-20px',
                                        background: 'rgba(133, 96, 205, 0.03)',
                                        borderRadius: '40px',
                                        zIndex: -1
                                    }}></div>
                                    <img src={heroClinic} alt="Futuristic Medical Clinic" className="img-fluid" style={{ borderRadius: '32px', boxShadow: '0 40px 100px rgba(0,0,0,0.1)', width: '100%', height: 'auto', objectFit: 'cover' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THE FLOW (Connected Care Loop) --- */}

            {/* --- BEAUTY ART & CALL TO ACTION SECTION --- */}
            <section id="beauty-experience" className="section py-5 overflow-hidden" style={{ background: 'white' }}>
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0" data-aos="fade-right">
                            <div className="position-relative">
                                <div className="experience-badge mb-4">
                                    <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(133, 96, 205, 0.1)', color: 'var(--brand-color)', fontSize: '0.9rem' }}>
                                        {t('home.beautyArt.subtitle', locale)}
                                    </span>
                                </div>
                                <h2 className="display-4 fw-bold mb-4" style={{ color: '#1a1a1a', lineHeight: '1.2' }}>
                                    {t('home.beautyArt.title', locale)}
                                </h2>
                                <p className="lead text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                                    {t('home.beautyArt.desc', locale)}
                                </p>
                                <div className="features-list mb-5">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="flex-shrink-0 bg-success-subtle rounded-circle p-2 me-3" style={{ background: '#ecfdf5' }}>
                                            <i className="bi bi-calendar-check text-success"></i>
                                        </div>
                                        <span>{t('home.beautyArt.feature1', locale)}</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="flex-shrink-0 bg-primary-subtle rounded-circle p-2 me-3" style={{ background: '#eff6ff' }}>
                                            <i className="bi bi-people text-primary"></i>
                                        </div>
                                        <span>{t('home.beautyArt.feature2', locale)}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0 bg-info-subtle rounded-circle p-2 me-3" style={{ background: '#ecfeff' }}>
                                            <i className="bi bi-hospital text-info"></i>
                                        </div>
                                        <span>{t('home.beautyArt.feature3', locale)}</span>
                                    </div>
                                </div>
                                <div className="d-flex gap-3">
                                    <a 
                                        href={window.APP_DATA?.routes?.consultation_new || "/en/consultation/new"}
                                        className="btn btn-gradient-purple rounded-pill px-5 py-3 shadow-lg fw-bold"
                                        style={{ width: "auto", minWidth: "200px", textDecoration: "none" }}
                                    >
                                        {t('home.beautyArt.cta', locale)}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6" data-aos="fade-left">
                            <div className="image-stack position-relative ms-lg-5">
                                <div className="image-stack-bg" style={{ 
                                    position: 'absolute', 
                                    top: '10%', 
                                    left: '-10%', 
                                    width: '100%', 
                                    height: '100%', 
                                    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                                    borderRadius: '50px',
                                    zIndex: 0,
                                    transform: 'rotate(-3deg)'
                                }}></div>
                                <img 
                                    src={bookingArt} 
                                    alt="Medical Booking Experience" 
                                    className="img-fluid position-relative shadow-2xl" 
                                    style={{ borderRadius: '40px', zIndex: 1 }}
                                />
                                <div className="stats-badge position-absolute bottom-0 start-0 translate-middle-y translate-middle-x bg-white p-4 rounded-4 shadow-lg d-none d-md-block" style={{ zIndex: 2, marginLeft: '40px' }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-primary-subtle p-3 rounded-circle" style={{ background: '#eff6ff' }}>
                                            <i className="bi bi-people-fill text-primary fs-4"></i>
                                        </div>
                                        <div>
                                            <h4 className="fw-bold mb-0">10k+</h4>
                                            <p className="text-muted small mb-0">{t('home.beautyArt.happyClients', locale)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THE FLOW (Connected Care Loop) --- */}
            <section id="how-it-works" className="connected-loop-section text-center bg-white" data-aos="fade-up">
                <div className="container py-5">
                    <div className="mb-5">
                        <h6 className="text-uppercase fw-bold" style={{ color: 'var(--accent-color)' }}>{t('home.howItWorks.subtitle', locale)}</h6>
                        <h2 className="display-6 fw-bold" style={{ color: 'var(--heading-color)' }}>{t('home.howItWorks.title', locale)}</h2>
                        <p className="text-muted">{t('home.howItWorks.desc', locale)}</p>
                    </div>

                    <div className="position-relative py-5">
                        <div className="connected-line d-none d-lg-block"></div>

                        <div className="row justify-content-center align-items-center gy-5 position-relative" style={{ zIndex: 2 }}>

                            <div className="col-lg-4 col-md-6 d-flex justify-content-center">
                                <div className="connected-node">
                                    <i className="bi bi-phone mb-2 fs-1 text-primary"></i>
                                    <span className="fw-bold">{t('home.howItWorks.patient', locale)}</span>
                                    <span className="small opacity-75">{t('home.howItWorks.patientDesc', locale)}</span>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 d-flex justify-content-center">
                                <div 
                                    className="connected-node center-node" 
                                    onClick={() => setIsChatOpen(true)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="bi bi-cpu mb-2 fs-1"></i>
                                    <span className="fw-bold fs-5">{t('home.howItWorks.coreAI', locale)}</span>
                                    <span className="small opacity-75">{t('home.howItWorks.coreAIDesc', locale)}</span>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 d-flex justify-content-center">
                                <div className="connected-node">
                                    <i className="bi bi-person-badge mb-2 fs-1 text-info"></i>
                                    <span className="fw-bold">{t('home.howItWorks.specialist', locale)}</span>
                                    <span className="small opacity-75">{t('home.howItWorks.specialistDesc', locale)}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* --- AI ASSISTANT SECTION --- */}
            <section id="ai-assistant" className="section py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8faff 0%, #f1f5f9 100%)' }}>
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6 order-2 order-lg-1" data-aos="fade-right">
                            <div className="pe-lg-5">
                                <h6 className="text-uppercase fw-bold mb-3" style={{ color: 'var(--brand-color)', letterSpacing: '1px' }}>
                                    {t('home.aiChat.subtitle', locale)}
                                </h6>
                                <h2 className="display-5 fw-bold mb-4">
                                    {t('home.aiChat.title', locale)}
                                </h2>
                                <p className="lead text-muted mb-5">
                                    {t('home.aiChat.desc', locale)}
                                </p>
                                <button 
                                    onClick={() => setIsChatOpen(true)}
                                    className="btn btn-gradient-purple rounded-pill px-5 py-3 shadow-lg fw-bold d-flex align-items-center gap-2"
                                >
                                    <i className="bi bi-chat-dots-fill"></i>
                                    {t('home.aiChat.cta', locale)}
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-6 order-1 order-lg-2 mb-5 mb-lg-0" data-aos="zoom-in">
                            <div className="ai-visual-container position-relative">
                                <div className="ai-glow-bg"></div>
                                <img src={aiAssistant} alt="AI Assistant" className="img-fluid rounded-5 shadow-2xl position-relative" style={{ zIndex: 1, border: '1px solid rgba(255,255,255,0.3)' }} />
                                <div className="floating-card p-3 bg-white rounded-4 shadow-lg position-absolute top-0 end-0 translate-middle-y mt-5 me-n3 d-none d-md-block" style={{ zIndex: 2 }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="status-dot pulse-success"></div>
                                        <span className="small fw-bold">{t('home.aiChat.typing', locale)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CENTERS OF EXCELLENCE --- */}
            <section id="departments" className="section py-5" style={{ background: '#f8fbfe' }}>
                <div className="container py-5" data-aos="fade-up">
                    <div className="mb-5">
                        <h2 className="display-6 fw-bold mb-2">{t('home.departments.title', locale)}</h2>
                        <p className="text-muted mb-0">{t('home.departments.subtitle', locale)}</p>
                    </div>

                    <div className="bento-grid">
                        {departments.length > 0 ? departments.map((dept, index) => {
                            if (index === 0) {
                                return (
                                    <div key={dept.id} className="bento-item department-card-large" style={{
                                        gridColumn: 'span 6',
                                        gridRow: 'span 2',
                                        backgroundImage: (dept.name || '').toLowerCase().includes('cardiology')
                                            ? `linear-gradient(to top, rgba(0,0,0,0.9), transparent), url('${cardiologyBg}')`
                                            : 'linear-gradient(135deg, var(--brand-color), var(--accent-color))'
                                    }}>
                                        <div className="icon-box">
                                            <i className={`bi ${dept.icon || 'bi-hospital'} text-white`}></i>
                                        </div>
                                        <h4>{dept.name || t('hospital.unknownDept', locale)}</h4>
                                        <p>{dept.description || t('hospital.noDesc', locale)}</p>
                                    </div>
                                );
                            }

                            return (
                                <div key={dept.id} className={`bento-item department-card-small ${dept.theme || 'blue-theme'}`} style={{ gridColumn: 'span 3' }}>
                                    <div className="icon-box">
                                        <i className={`bi ${dept.icon || 'bi-hospital'}`}></i>
                                    </div>
                                    <h5>{dept.name || t('hospital.unknownDept', locale)}</h5>
                                    <p>{dept.description || t('hospital.noDesc', locale)}</p>
                                </div>
                            );
                        }) : (
                            <div className="col-12 text-center text-muted">
                                <p>{t('home.departments.noData', locale)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- OUR NETWORK --- */}
            <section id="network" className="section py-5 bg-white">
                <div className="container py-5" data-aos="fade-up">
                    <div className="d-flex justify-content-between align-items-end mb-5">
                        <div className="text-start">
                            <h2 className="display-6 fw-bold mb-2">{t('home.network.title', locale)}</h2>
                            <p className="text-muted mb-0">{t('home.network.subtitle', locale)}</p>
                        </div>
                        <div className="ms-auto">
                            <a href={`/${locale}/hospitals`} className="btn btn-primary btn-sm rounded-pill px-3 py-2" style={{ fontSize: '0.8rem', fontWeight: 400, whiteSpace: 'nowrap' }}>
                                {t('dashboard.viewAll', locale)} <i className="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>

                    <div className="row g-4">
                        {hospitals.slice(0, 3).map((hospital, idx) => (
                            <div key={hospital.id} className="col-lg-4 col-md-6">
                                <a href={`/${locale}/hospital/${hospital.id}`} className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-hover text-decoration-none">
                                    <div className="position-relative" style={{ height: '220px' }}>
                                        <div className="badge bg-success position-absolute top-0 end-0 m-3 rounded-pill px-3 py-2 fw-bold" style={{ zIndex: 5, fontSize: '0.7rem' }}>{t('home.network.open', locale)}</div>
                                        <img src={hospital.images && hospital.images.length > 0 ? hospital.images[0] : aboutImage} alt={hospital.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-1 text-dark">{hospital.name}</h5>
                                        <p className="text-muted small mb-4"><i className="bi bi-geo-alt me-1"></i> {hospital.address}</p>

                                        <div className="row g-2 pt-3 border-top">
                                            <div className="col-4">
                                                <div className="bg-light p-2 rounded text-center">
                                                    <div className="fw-bold mb-0 text-dark">1,200</div>
                                                    <small className="text-muted" style={{ fontSize: '0.65rem' }}>{t('home.network.beds', locale)}</small>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="bg-light p-2 rounded text-center">
                                                    <div className="fw-bold mb-0 text-dark">450</div>
                                                    <small className="text-muted" style={{ fontSize: '0.65rem' }}>{t('home.network.surgeons', locale)}</small>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="bg-light p-2 rounded text-center">
                                                    <div className="fw-bold mb-0 text-success">{t('home.network.yes', locale)}</div>
                                                    <small className="text-muted" style={{ fontSize: '0.65rem' }}>{t('home.network.emergency', locale)}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* AI Chat Modal */}
            <AIChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                locale={locale}
            />
        </div >
    );
};

export default HomePage;

