import React from 'react';
import { t } from '../../utils/translations.js';

const HowItWorksPage = () => {
    const locale = window.APP_DATA?.locale || 'en';

    const steps = [
        {
            title: t('home.howItWorks.patient', locale),
            desc: t('home.howItWorks.patientDesc', locale),
            icon: 'bi-phone',
            color: 'var(--brand-color)'
        },
        {
            title: t('home.howItWorks.coreAI', locale),
            desc: t('home.howItWorks.coreAIDesc', locale),
            icon: 'bi-cpu',
            color: '#10b981'
        },
        {
            title: t('home.howItWorks.analysis', locale),
            desc: t('home.howItWorks.analysisDesc', locale),
            icon: 'bi-graph-up-arrow',
            color: 'var(--accent-color)'
        },
        {
            title: t('home.howItWorks.specialist', locale),
            desc: t('home.howItWorks.specialistDesc', locale),
            icon: 'bi-person-badge',
            color: '#f59e0b'
        }
    ];

    return (
        <div className="how-it-works-page py-5 mt-5">
            <div className="container py-5">
                <div className="text-center mb-5" data-aos="fade-up">
                    <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2 mb-3 fw-bold">
                        {t('home.howItWorks.subtitle', locale)}
                    </span>
                    <h1 className="display-4 fw-bold mb-4">{t('home.howItWorks.title', locale)}</h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                        {t('home.howItWorks.desc', locale)}
                    </p>
                </div>

                <div className="row g-4 mt-4">
                    {steps.map((step, index) => (
                        <div key={index} className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay={index * 100}>
                            <div className="card h-100 border-0 shadow-sm rounded-4 p-4 transition-all hover-translate-y">
                                <div 
                                    className="icon-box rounded-4 d-flex align-items-center justify-content-center mb-4"
                                    style={{ width: '70px', height: '70px', background: `${step.color}15`, color: step.color }}
                                >
                                    <i className={`bi ${step.icon} fs-2`}></i>
                                </div>
                                <h4 className="fw-bold mb-3">{step.title}</h4>
                                <p className="text-muted mb-0">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Details Section */}
                <div className="row mt-5 pt-5 align-items-center">
                    <div className="col-lg-6" data-aos="fade-right">
                        <div className="pe-lg-5">
                            <h2 className="fw-bold mb-4" style={{ color: 'var(--heading-color)' }}>
                                {locale === 'hy' ? 'Անխափան Առողջապահական Փորձ' : (locale === 'ru' ? 'Бесшовный Опыт Здравоохранения' : 'A Seamless Healthcare Experience')}
                            </h2>
                            <p className="text-muted mb-4">
                                {locale === 'hy' 
                                    ? 'Մեր հարթակը ինտեգրում է վերջին բժշկական տեխնոլոգիաները՝ ապահովելու համար, որ դուք ստանաք հնարավոր լավագույն խնամքը: Ամրագրման պահից մինչև վերջնական վերլուծություն, ամեն ինչ կառավարվում է մեկ վայրում:' 
                                    : (locale === 'ru' 
                                        ? 'Наша платформа объединяет последние медицинские технологии, чтобы вы получали лучший уход. От момента записи до финального анализа — все в одном месте.' 
                                        : 'Our platform integrates the latest medical technologies to ensure you receive the best care possible. From the moment you book an appointment to your follow-up analysis, everything is managed in one place.')}
                            </p>
                            {[
                                { en: 'Real-time collaboration between doctors', hy: 'Իրական ժամանակում համագործակցություն բժիշկների միջև', ru: 'Сотрудничество врачей в реальном времени' },
                                { en: 'AI-driven symptoms checker', hy: 'ԱԲ-ով աշխատող ախտանիշների ստուգիչ', ru: 'ИИ-проверка симптомов' },
                                { en: 'Secure cloud storage for medical records', hy: 'Անվտանգ ամպային պահեստ բժշկական գրառումների համար', ru: 'Безопасное облачное хранилище для медкарты' }
                            ].map((item, i) => (
                                <div key={i} className="d-flex align-items-center gap-3 mb-3">
                                    <div className="rounded-circle bg-success-subtle p-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                        <i className="bi bi-check2 text-success fw-bold"></i>
                                    </div>
                                    <span className="fw-semibold text-dark">{item[locale] || item.en}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-6 mt-5 mt-lg-0" data-aos="fade-left">
                        <div className="position-relative">
                            <div className="rounded-4 shadow-lg p-5 text-white overflow-hidden position-relative" style={{ background: 'linear-gradient(135deg, #6f42c1, var(--brand-color))' }}>
                                <div className="position-absolute top-0 end-0 p-4 opacity-10">
                                    <i className="bi bi-rocket-takeoff display-1"></i>
                                </div>
                                <div className="position-relative z-1 text-white">
                                    <h3 className="fw-bold mb-4 text-white">{locale === 'hy' ? 'Պատրա՞ստ եք սկսել' : (locale === 'ru' ? 'Готовы начать?' : 'Ready to start?')}</h3>
                                    <p className="mb-4 opacity-90 fs-5 text-white">
                                        {locale === 'hy' ? 'Միացեք մեր ցանցին այսօր և զգացեք առողջապահության նոր ստանդարտը:' : (locale === 'ru' ? 'Присоединяйтесь к нашей сети сегодня и почувствуйте новый стандарт здравоохранения.' : 'Join our network today and experience a new standard of healthcare.')}
                                    </p>
                                    <a href={`/${locale}/consultation/new`} className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold shadow-sm transition-all hover-scale">
                                        {locale === 'hy' ? 'Սկսել հիմա' : (locale === 'ru' ? 'Начать сейчас' : 'Get Started')} <i className="bi bi-arrow-right ms-2"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-translate-y:hover {
                    transform: translateY(-10px);
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default HowItWorksPage;
