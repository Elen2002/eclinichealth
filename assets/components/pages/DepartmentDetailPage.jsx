import React from 'react';
import { t } from '../../utils/translations.js';

const DepartmentDetailPage = ({ department, image }) => {
    const locale = window.APP_DATA?.locale || 'en';

    if (!department) return <div className="py-5 mt-5 text-center">Loading...</div>;

    // Helper to get a relevant high-quality image based on department name
    const getDeptImage = (name) => {
        const lowerName = name?.toLowerCase() || '';
        if (lowerName.includes('նյարդ') || lowerName.includes('neuro')) return 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200';
        if (lowerName.includes('սրտ') || lowerName.includes('cardio')) return 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=1200';
        if (lowerName.includes('ատամ') || lowerName.includes('dent')) return 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200';
        if (lowerName.includes('մանկ') || lowerName.includes('pediatr')) return 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200';
        if (lowerName.includes('օրթո') || lowerName.includes('ortho')) return 'https://images.unsplash.com/photo-1579154235602-3c2c2aa59ace?auto=format&fit=crop&q=80&w=1200';
        if (lowerName.includes('թերապ') || lowerName.includes('therap')) return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200';
        if (lowerName.includes('դիագ') || lowerName.includes('diagn')) return 'https://images.unsplash.com/photo-1579154236605-e325091726a5?auto=format&fit=crop&q=80&w=1200';
        return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200';
    };

    return (
        <div className="department-detail-page">
            {/* Premium Hero Section */}
            <div className="hero-section text-center py-5 mt-5 position-relative overflow-hidden" style={{ 
                background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${image || getDeptImage(department.name)})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white', 
                minHeight: '450px', 
                display: 'flex', 
                alignItems: 'center' 
            }}>
                {image && <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8))' }}></div>}
                <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
                    <nav aria-label="breadcrumb" className="mb-4" data-aos="fade-down">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item"><a href={`/${locale}/departments`} className="text-white-50 text-decoration-none">{locale === 'hy' ? 'Բաժանմունքներ' : 'Departments'}</a></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">{department.name}</li>
                        </ol>
                    </nav>
                    <h1 className="display-1 fw-bold mb-3 text-white" data-aos="zoom-in">{department.name}</h1>
                    <p className="lead opacity-100 mx-auto fs-4 text-white" style={{ maxWidth: '800px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }} data-aos="fade-up" data-aos-delay="100">
                        {locale === 'hy' ? 'Բարձրակարգ բժշկական սպասարկում և մասնագիտացված խնամք:' : 'World-class medical services and specialized care tailored to your needs.'}
                    </p>
                </div>
            </div>

            <section className="py-5 bg-white">
                <div className="container py-5">
                    <div className="row g-5">
                        {/* Main Content */}
                        <div className="col-lg-8" data-aos="fade-right">
                            <div className="description-card p-5 rounded-4 shadow-sm bg-light mb-5 border-start border-4 border-primary">
                                <h2 className="fw-bold mb-4" style={{ color: 'var(--heading-color)' }}>
                                    {locale === 'hy' ? 'Բաժանմունքի մասին' : 'About the Department'}
                                </h2>
                                <div className="fs-5 text-muted leading-relaxed">
                                    {department.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: department.description.replace(/\n/g, '<br/>') }} />
                                    ) : (
                                        locale === 'hy' ? 'Այս բաժանմունքը ապահովում է համալիր բժշկական մոտեցում՝ օգտագործելով նորագույն տեխնոլոգիաները և լավագույն բժշկական փորձը:' : 'This department provides a comprehensive medical approach using the latest technologies and best medical practices.'
                                    )}
                                </div>
                            </div>

                            <div className="doctors-section mt-5 pt-4">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <h3 className="fw-bold mb-0">{locale === 'hy' ? 'Մեր մասնագետները' : 'Our Specialists'}</h3>
                                    <span className="badge bg-primary rounded-pill px-3">{department.doctors?.length || 0} {locale === 'hy' ? 'Բժիշկ' : 'Doctors'}</span>
                                </div>
                                <div className="row g-4">
                                    {department.doctors && department.doctors.length > 0 ? (
                                        department.doctors.map((doctor, i) => (
                                            <div key={doctor.id || `doctor-${i}`} className="col-md-6" data-aos="fade-up" data-aos-delay={i * 100}>
                                                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-lift transition-all border-bottom border-3 border-transparent hover-border-primary">
                                                    <div className="card-body p-4">
                                                        <div className="d-flex align-items-center gap-4">
                                                            <div className="avatar-wrapper flex-shrink-0" style={{ width: '90px', height: '90px' }}>
                                                                <img 
                                                                    src={doctor.user?.avatar && doctor.user.avatar !== '' && !doctor.user.avatar.includes('demo/')
                                                                        ? (doctor.user.avatar.startsWith('http') || doctor.user.avatar.startsWith('/') 
                                                                            ? doctor.user.avatar 
                                                                            : `/uploads/avatars/${doctor.user.avatar}`) 
                                                                        : '/img/default-doctor.png'} 
                                                                    className="rounded-circle w-100 h-100 object-fit-cover shadow-sm border border-2 border-white"
                                                                    alt={doctor.user?.firstName}
                                                                    onError={(e) => {
                                                                        if (e.target.src !== '/img/default-doctor.png') {
                                                                            e.target.src = '/img/default-doctor.png';
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <h5 className="fw-bold mb-1">Dr. {doctor.user?.firstName} {doctor.user?.lastName}</h5>
                                                                <div className="badge bg-primary-subtle text-primary mb-2 px-2 py-1 small">{doctor.specialty}</div>
                                                                <p className="text-muted small mb-0"><i className="bi bi-briefcase me-2"></i>{doctor.roleType}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                                                            <div className="small text-muted">
                                                                <i className="bi bi-star-fill text-warning me-1"></i>
                                                                <span className="fw-bold text-dark">4.9</span> (120+ reviews)
                                                            </div>
                                                            <a href={`/${locale}/consultation/new`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                                                                {locale === 'hy' ? 'Ամրագրել' : 'Book'}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center py-5 bg-light rounded-4">
                                            <i className="bi bi-people fs-1 text-muted opacity-25 mb-3 d-block"></i>
                                            <p className="text-muted mb-0">{locale === 'hy' ? 'Այս բաժանմունքում դեռ բժիշկներ չկան:' : 'No doctors listed for this department yet.'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="col-lg-4" data-aos="fade-left">
                            <div className="sticky-top" style={{ top: '100px' }}>
                                <div className="card border-0 shadow-lg rounded-4 p-5 text-white mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--brand-color), #4f46e5)' }}>
                                    <div className="position-absolute top-0 end-0 p-3 opacity-10">
                                        <i className="bi bi-calendar-check" style={{ fontSize: '6rem' }}></i>
                                    </div>
                                    <h4 className="fw-bold mb-4 position-relative text-white">{locale === 'hy' ? 'Ամրագրում' : 'Book Appointment'}</h4>
                                    <p className="opacity-100 mb-4 position-relative text-white">
                                        {locale === 'hy' ? 'Պլանավորեք ձեր այցը այս բաժանմունքի մասնագետի մոտ:' : 'Schedule your visit with a specialist in this department.'}
                                    </p>
                                    <a href={`/${locale}/consultation/new`} className="btn btn-white btn-lg rounded-pill fw-bold w-100 shadow-sm py-3 transition-all hover-scale position-relative" style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid white', color: 'white' }}>
                                        {locale === 'hy' ? 'Ամրագրել հիմա' : 'Book Now'}
                                    </a>
                                </div>

                                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white border">
                                    <h5 className="fw-bold mb-4 border-bottom pb-2">{locale === 'hy' ? 'Կապ մեզ հետ' : 'Contact Details'}</h5>
                                    <div className="info-list d-flex flex-column gap-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                                                <i className="bi bi-telephone fs-5"></i>
                                            </div>
                                            <div>
                                                <div className="small text-muted">{locale === 'hy' ? 'Հեռախոս' : 'Phone'}</div>
                                                <div className="fw-bold">+374 10 00 00 00</div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                                                <i className="bi bi-envelope fs-5"></i>
                                            </div>
                                            <div>
                                                <div className="small text-muted">{locale === 'hy' ? 'Էլ. հասցե' : 'Email'}</div>
                                                <div className="fw-bold text-truncate" style={{ maxWidth: '180px' }}>{department.name.toLowerCase().replace(/\s/g, '')}@eclinic.am</div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                                                <i className="bi bi-clock fs-5"></i>
                                            </div>
                                            <div>
                                                <div className="small text-muted">{locale === 'hy' ? 'Աշխատանքային ժամեր' : 'Working Hours'}</div>
                                                <div className="fw-bold">24/7 {locale === 'hy' ? 'Սպասարկում' : 'Emergency'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .leading-relaxed { line-height: 1.8; }
                .hover-bg-light:hover { background-color: #f8fafc; }
                .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-scale:hover { transform: translateY(-3px); }
                .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; }
                .hover-border-primary:hover { border-bottom-color: var(--brand-color) !important; }
                .bg-primary-subtle { background-color: rgba(99, 102, 241, 0.1); }
            `}</style>
        </div>
    );
};

export default DepartmentDetailPage;
