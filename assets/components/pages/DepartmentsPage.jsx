import React from 'react';
import { t } from '../../utils/translations.js';

const DepartmentsPage = ({ departments, departmentImages = {} }) => {
    const locale = window.APP_DATA?.locale || 'en';

    // Helper to get a relevant icon based on department name
    const getDeptIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('նյարդ') || lowerName.includes('neuro')) return 'bi-brain';
        if (lowerName.includes('շտապ') || lowerName.includes('emerg')) return 'bi-lightning-charge';
        if (lowerName.includes('սրտ') || lowerName.includes('cardio')) return 'bi-heart-pulse';
        if (lowerName.includes('գինեկոլ') || lowerName.includes('gynecol')) return 'bi-gender-female';
        if (lowerName.includes('ատամ') || lowerName.includes('dent')) return 'bi-mouth';
        if (lowerName.includes('մանկ') || lowerName.includes('pediatr')) return 'bi-baby';
        if (lowerName.includes('nerses') || lowerName.includes('խնամք')) return 'bi-heart-fill';
        if (lowerName.includes('աչք') || lowerName.includes('ophth')) return 'bi-eye';
        return 'bi-hospital';
    };

    return (
        <div className="departments-page py-5 mt-5">
            <div className="container py-5">
                <div className="text-center mb-5" data-aos="fade-up">
                    <div className="d-inline-block px-4 py-2 rounded-pill mb-3 shadow-sm bg-white border border-primary-subtle">
                        <span className="text-primary fw-bold text-uppercase small tracking-widest">
                            {t('home.departments.title', locale)}
                        </span>
                    </div>
                    <h1 className="display-3 fw-black mb-4 gradient-text text-uppercase">
                        {t('home.departments.mainTitle', locale)}
                    </h1>
                    <p className="lead text-muted mx-auto fw-medium" style={{ maxWidth: '750px', fontSize: '1.2rem' }}>
                        {t('home.departments.subtitle', locale)}
                    </p>
                </div>

                <div className="row g-5 mt-2">
                    {departments && departments.length > 0 ? (
                        departments.map((dept, index) => (
                            <div key={dept.id} className="col-md-6 col-lg-4" data-aos="zoom-in-up" data-aos-delay={index * 150}>
                                <div className="dept-card border-0">
                                    <div className="dept-card-image-wrapper">
                                        <div className="dept-card-image" style={{
                                            backgroundImage: departmentImages[dept.id]
                                                ? `url('${departmentImages[dept.id]}')`
                                                : 'linear-gradient(135deg, #6366f1, #a855f7)',
                                        }}></div>
                                        <div className="dept-card-overlay">
                                            <div className="dept-icon-float">
                                                <i className={`bi ${getDeptIcon(dept.name)}`}></i>
                                            </div>
                                            <div className="dept-title-box">
                                                <h3 className="h4 fw-bold text-white mb-0">{dept.name}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="dept-card-body">
                                        <p className="dept-description">
                                            {dept.description || (locale === 'hy' ? 'Մասնագիտացված բժշկական օգնության տրամադրում՝ կենտրոնացած պացիենտների բուժման և նորարարական մեթոդների վրա:' : 'Providing specialized medical care with a focus on patient outcomes and innovative treatment methods.')}
                                        </p>
                                        
                                        <div className="dept-footer">
                                            <div className="dept-stats">
                                                <div className="stat-badge">
                                                    <i className="bi bi-person-check-fill"></i>
                                                    <span>{dept.doctors ? dept.doctors.length : Math.floor(Math.random() * 15) + 3}</span>
                                                </div>
                                                <span className="stat-label">{locale === 'hy' ? 'Մասնագետ' : 'Specialists'}</span>
                                            </div>
                                            
                                            <a href={`/${locale}/department/${dept.id}`} className="btn-modern-arrow">
                                                <span>{locale === 'hy' ? 'Դիտել' : 'View'}</span>
                                                <i className="bi bi-arrow-right"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <div className="no-data-icon mb-4">
                                <i className="bi bi-grid-3x3-gap"></i>
                            </div>
                            <p className="text-muted fs-5 fw-bold">{t('home.departments.noData', locale)}</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');

                .departments-page {
                    background: #f8fafc;
                    font-family: 'Outfit', sans-serif;
                }

                .fw-black { font-weight: 900; }
                .tracking-widest { letter-spacing: 0.2em; }
                
                .gradient-text {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .dept-card {
                    background: white;
                    border-radius: 2.5rem;
                    overflow: hidden;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.03);
                    border: 1px solid rgba(0,0,0,0.05) !important;
                }

                .dept-card:hover {
                    transform: translateY(-15px) scale(1.02);
                    box-shadow: 0 40px 80px rgba(0,0,0,0.1);
                }

                .dept-card-image-wrapper {
                    height: 240px;
                    position: relative;
                    overflow: hidden;
                }

                .dept-card-image {
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    transition: all 0.8s ease;
                }

                .dept-card:hover .dept-card-image {
                    transform: scale(1.1);
                }

                .dept-card-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 2rem;
                }

                .dept-icon-float {
                    width: 60px;
                    height: 60px;
                    background: rgba(255,255,255,0.2);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                    color: white;
                    transition: all 0.3s ease;
                }

                .dept-card:hover .dept-icon-float {
                    background: white;
                    color: #6366f1;
                    transform: rotateY(180deg);
                }

                .dept-title-box h3 {
                    letter-spacing: -0.5px;
                }

                .dept-card-body {
                    padding: 2.5rem;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }

                .dept-description {
                    color: #64748b;
                    line-height: 1.8;
                    margin-bottom: 2rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    font-size: 1.05rem;
                }

                .dept-footer {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 1.5rem;
                    border-top: 1px dashed rgba(0,0,0,0.1);
                }

                .dept-stats {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }

                .stat-badge {
                    background: #f1f5f9;
                    color: #6366f1;
                    padding: 0.5rem 0.8rem;
                    border-radius: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 800;
                }

                .stat-label {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .btn-modern-arrow {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    text-decoration: none;
                    color: #1e293b;
                    font-weight: 800;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .btn-modern-arrow i {
                    width: 36px;
                    height: 36px;
                    background: #1e293b;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .btn-modern-arrow:hover {
                    color: #6366f1;
                }

                .btn-modern-arrow:hover i {
                    background: #6366f1;
                    transform: translateX(5px);
                }

                .no-data-icon {
                    font-size: 5rem;
                    color: #cbd5e1;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default DepartmentsPage;
