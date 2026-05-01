import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Chart from 'chart.js/auto';
import { t } from '../utils/translations.js';

const DoctorDashboard = ({
    doctor,
    hospital,
    department,
    totalPatients,
    pendingConsultations,
    doctorPatients,
    recentConsultations,
    chartLabels,
    chartData,
    communications = [],
    urlPatterns
}) => {
    const [liveCommunications, setLiveCommunications] = useState(communications);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const locale = window.APP_DATA?.locale || 'en';

    useEffect(() => {
        const socketUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
        const socket = io(socketUrl);

        socket.on('connect', () => {
            console.log('Dashboard notification socket connected');
            socket.emit('join_notifications', { userId: doctor.identifier });
        });

        socket.on('new_notification', (notif) => {
            if (notif.type === 'chat_message') {
                const newComm = {
                    title: notif.sender === 'user' ? 'Patient Message' : notif.sender,
                    message: notif.text,
                    time: 'Just now',
                    link: notif.link || `/${locale}/profile/chat/${doctor.id}` // Default fallback
                };
                
                setLiveCommunications(prev => [newComm, ...prev].slice(0, 5));
            }
        });

        return () => socket.disconnect();
    }, [doctor.identifier, doctor.id, locale]);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartLabels || [],
                    datasets: [{
                        label: t('dashboard.trends', locale),
                        data: chartData || [],
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#0d6efd',
                        pointRadius: 6,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
                        }
                    }
                }
            });
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartLabels, chartData, locale]);

    return (
        <div className="container py-5 mt-5">
            <div className="row align-items-center mb-4">
                <div className="col">
                    <div className="d-flex align-items-center gap-3">
                        <img 
                            src={doctor?.user?.avatar || '/img/default-avatar.png'} 
                            alt="Avatar" 
                            className="rounded-circle shadow-sm border border-2 border-white"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div>
                            <h1 className="h3 fw-bold mb-0">
                                {doctor?.user?.firstName ? `${doctor.user.firstName} ${doctor.user.lastName || ''}` : t('dashboard.title', locale)}
                            </h1>
                            <p className="text-muted mb-0">
                                {t('dashboard.welcome', locale)} {doctor?.user?.firstName || (doctor?.user?.email ? doctor.user.email.split('@')[0] : 'Doctor')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-auto d-flex align-items-center gap-2">
                    <a href={urlPatterns.profileEdit || '/profile/edit'} className="btn btn-sm btn-outline-primary rounded-pill px-3 py-2 d-flex align-items-center gap-2 text-nowrap">
                        <i className="bi bi-pencil-square"></i>
                        <span className="fw-bold">{t('dashboard.editProfile', locale)}</span>
                    </a>
                    <span className="badge bg-primary rounded-pill px-3 py-2 d-flex align-items-center text-nowrap" style={{ fontSize: '13px' }}>{t('dashboard.active', locale)}</span>
                    <a href={urlPatterns.logout || '/logout'} className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 d-flex align-items-center gap-2 text-nowrap">
                        <i className="bi bi-box-arrow-right"></i>
                        <span className="fw-bold">{t('dashboard.logout', locale)}</span>
                    </a>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-5">
                {/* Hospital Info */}
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid var(--brand-color)' }}>
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-light rounded-circle p-3 me-3">
                                    <i className="bi bi-hospital fs-4 text-primary"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1">{t('dashboard.workspace', locale)}</h6>
                                    <h5 className="fw-bold mb-0">
                                        {hospital ? hospital.name : '-'}
                                    </h5>
                                </div>
                            </div>
                            <div className="small text-muted border-top pt-2 mt-2">
                                <i className="bi bi-geo-alt me-1"></i>
                                {department ? department.name : t('dashboard.generalDept', locale)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patients Count */}
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid var(--accent-color)' }}>
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-light rounded-circle p-3 me-3">
                                    <i className="bi bi-people fs-4 text-info"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1">{t('dashboard.totalPatients', locale)}</h6>
                                    <h5 className="fw-bold mb-0">{totalPatients}</h5>
                                </div>
                            </div>
                            <div className="small text-muted border-top pt-2 mt-2">
                                <i className="bi bi-graph-up me-1"></i> {t('dashboard.underCare', locale)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Actions */}
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #ffc107' }}>
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-light rounded-circle p-3 me-3">
                                    <i className="bi bi-calendar-check fs-4 text-warning"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1">{t('dashboard.pendingReq', locale)}</h6>
                                    <h5 className="fw-bold mb-0">{pendingConsultations}</h5>
                                </div>
                            </div>
                            <div className="small text-muted border-top pt-2 mt-2">
                                <a href={urlPatterns.doctorConsultations} className="text-decoration-none">
                                    {t('dashboard.viewAllReq', locale)} <i className="bi bi-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Main Content: Patient List */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">{t('dashboard.myPatients', locale)}</h5>
                            <a href={urlPatterns.doctorConsultations} className="btn-link rounded-pill">{t('dashboard.viewAll', locale)}</a>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light text-muted small">
                                        <tr>
                                            <th className="ps-4">{t('dashboard.patient', locale)}</th>
                                            <th>{t('dashboard.contact', locale)}</th>
                                            <th>{t('dashboard.lastVisit', locale)}</th>
                                            <th className="text-end pe-4">{t('dashboard.action', locale)}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doctorPatients && doctorPatients.length > 0 ? (
                                            doctorPatients.map((relation, index) => {
                                                const patient = relation.pacient;
                                                return (
                                                    <tr key={index}>
                                                        <td className="ps-4">
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                                                    <span className="fw-bold text-primary">{patient?.email?.charAt(0).toUpperCase() || '?'}</span>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold">
                                                                        {patient?.firstName ? `${patient.firstName} ${patient.lastName || ''}` : (patient?.email ? patient.email.split('@')[0].replace(/^\w/, c => c.toUpperCase()) : 'Patient')}
                                                                    </div>
                                                                    <small className="text-muted">ID: #{patient?.id || 'N/A'}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="small"><i className="bi bi-envelope me-1"></i> {patient?.email || 'N/A'}</div>
                                                        </td>
                                                        <td>
                                                            <span className="text-muted">-</span>
                                                        </td>
                                                        <td className="text-end pe-4">
                                                            <button className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center ms-auto transition-all" style={{ width: '36px', height: '36px', background: 'rgba(111, 0, 152, 0.08)', color: 'var(--brand-color)', border: 'none' }}>
                                                                <i className="bi bi-three-dots-vertical"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">
                                                    <i className="bi bi-people fs-1 d-block mb-3 opacity-25"></i>
                                                    {t('dashboard.noPatients', locale)}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Recent Appointment Requests */}
                    <div className="card border-0 shadow-sm rounded-4 mt-4">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="fw-bold mb-0">{t('dashboard.recentReq', locale)}</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light text-muted small">
                                        <tr>
                                            <th className="ps-4">{t('dashboard.patient', locale)}</th>
                                            <th>{t('dashboard.reqDate', locale)}</th>
                                            <th>{t('dashboard.status', locale)}</th>
                                            <th className="text-end pe-4">{t('dashboard.actions', locale)}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentConsultations && recentConsultations.length > 0 ? (
                                            recentConsultations.map((consultation, index) => {
                                                const date = new Date(consultation.requestedDate);
                                                return (
                                                    <tr key={index}>
                                                        <td className="ps-4">
                                                            <div className="fw-bold">{consultation.patientName}</div>
                                                        </td>
                                                        <td>
                                                            <div>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                            <small className="text-muted">{date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</small>
                                                        </td>
                                                        <td>
                                                            {consultation.status === 'pending' ? (
                                                                <span className="badge bg-warning-subtle text-warning rounded-pill">{t('dashboard.pending', locale)}</span>
                                                            ) : consultation.status === 'confirmed' ? (
                                                                <span className="badge bg-success-subtle text-success rounded-pill">{t('dashboard.confirmed', locale)}</span>
                                                            ) : (
                                                                <span className="badge bg-secondary-subtle text-secondary rounded-pill">
                                                                    {t(`dashboard.${consultation.status}`, locale) !== `dashboard.${consultation.status}`
                                                                        ? t(`dashboard.${consultation.status}`, locale)
                                                                        : consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="text-end pe-4">
                                                            {consultation.status === 'pending' ? (
                                                                <a href={urlPatterns.consultationProcess.replace('__ID__', consultation.id)} className="btn btn-sm btn-gradient-purple rounded-pill px-4 shadow-sm fw-bold transition-all">
                                                                    {t('dashboard.approve', locale)}
                                                                </a>
                                                            ) : (
                                                                <a href={urlPatterns.consultationDetails.replace('__ID__', consultation.id)} className="btn btn-sm rounded-pill px-4 shadow-sm text-white transition-all" style={{ background: 'var(--brand-color)', border: 'none', opacity: '0.9' }}>
                                                                    {t('dashboard.details', locale)}
                                                                </a>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-muted">
                                                    {t('dashboard.noRecent', locale)}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Strategy / Quick Stats */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="fw-bold mb-0">{t('dashboard.trends', locale)}</h5>
                        </div>
                        <div className="card-body">
                            <canvas ref={chartRef} height="200"></canvas>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 mt-4">
                        <div className="card-header bg-white border-0 py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                            <h5 className="fw-bold mb-0">{t('dashboard.communications', locale)}</h5>
                            <span className="badge bg-light text-primary rounded-pill small">{t('dashboard.chatsAndSms', locale)}</span>
                        </div>
                        <div className="card-body p-0">
                            <div className="list-group list-group-flush">
                                {liveCommunications && liveCommunications.length > 0 ? (
                                    liveCommunications.map((notif, idx) => (
                                        <a key={idx} href={notif.link || '#'} className="list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center gap-3">
                                            <div className="bg-primary-subtle rounded-circle p-2 text-primary">
                                                <i className="bi bi-chat-left-text"></i>
                                            </div>
                                            <div className="flex-grow-1 overflow-hidden">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className="fw-bold small text-dark">{notif.title}</span>
                                                    <span className="text-muted" style={{ fontSize: '0.65rem' }}>{notif.time && notif.time.includes(' ') ? notif.time.split(' ')[1] : notif.time}</span>
                                                </div>
                                                <div className="text-muted small text-truncate">{notif.message}</div>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-muted small">
                                        <i className="bi bi-chat-dots fs-3 d-block mb-2 opacity-25"></i>
                                        {t('dashboard.noCommunications', locale)}
                                    </div>
                                )}
                            </div>
                        </div>
                        {liveCommunications && liveCommunications.length > 0 && (
                             <div className="card-footer bg-white border-0 text-center pb-3">
                                <button className="btn btn-sm btn-light rounded-pill px-4 small w-100">{t('dashboard.viewAll', locale)}</button>
                             </div>
                        )}
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 mt-4 bg-light text-white" style={{ background: 'linear-gradient(135deg, var(--brand-color), var(--accent-color))' }}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3 text-white">{t('dashboard.strategy', locale)}</h5>
                            <p className="mb-4 opacity-75 text-white">{t('dashboard.strategyText', locale)}</p>
                            <button className="btn rounded-pill w-100 fw-bold transition-all shadow-sm text-white" style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                                {t('dashboard.viewGoals', locale)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;

