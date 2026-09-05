import React from 'react';
import { 
  Compass, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Sparkles, 
  MapPin, 
  HeartHandshake, 
  FileText
} from 'lucide-react';

/**
 * About Page Component
 * Structured sections: About the Platform, Our Mission, How It Works,
 * Report Lost Items, Report Found Items, Reconnect With Your Belongings, and Campus Support.
 * Browse Directory is completely excluded from this page per requirements.
 */
export default function About() {
  return (
    <main className="about-page" style={{ padding: '2.5rem 0 4.5rem' }}>
      <div className="app-container">
        {/* 1. Page Header / About the Platform Intro */}
        <header className="page-header" style={{ marginBottom: '2.5rem' }}>
          <div>
            <div className="hero-badge" style={{ marginBottom: '0.75rem' }}>
              <Sparkles size={15} className="badge-sparkle" />
              <span>Campus Community Portal</span>
            </div>
            <h1 className="page-title">About the Platform</h1>
            <p className="page-subtitle">
              Trovio is the centralized Lost &amp; Found network built exclusively for university students, faculty, and campus security.
            </p>
          </div>
        </header>

        {/* 2. Our Mission */}
        <section className="about-mission-card" style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '840px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-icon-wrapper" style={{ width: '38px', height: '38px' }}>
                <Compass size={22} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Our Mission
              </h2>
            </div>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Misplacing essential belongings on campus—whether it’s a laptop loaded with semester project code, a student ID card before exams, room keys, or expensive earphones—can cause immense stress and disrupt academic life.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Our mission is to eliminate chaotic WhatsApp group forwards, paper notice board pins, and lost property boxes. <strong>Trovio</strong> provides a transparent, accountable, and instant peer-to-peer network so every lost item on campus has the best chance of finding its way back home.
            </p>
          </div>
        </section>

        {/* 3. How It Works */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 className="section-heading" style={{ fontSize: '1.6rem' }}>How It Works</h2>
            <p className="section-subheading">Three coordinated steps to resolve lost and found inquiries quickly</p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon-box step-icon-1">
                <FileText size={26} />
              </div>
              <h3 className="step-title">1. Post a Report</h3>
              <p className="step-desc">
                Submit an item description with distinguishing marks, campus location, date, and contact details in under a minute.
              </p>
            </article>

            <article className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon-box step-icon-2">
                <Search size={26} />
              </div>
              <h3 className="step-title">2. Peer Discovery</h3>
              <p className="step-desc">
                Finders post what they’ve discovered and claimants browse live categorized listings filtered by campus zones.
              </p>
            </article>

            <article className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon-box step-icon-3">
                <ShieldCheck size={26} />
              </div>
              <h3 className="step-title">3. Safe Handover</h3>
              <p className="step-desc">
                Parties verify ownership details directly, meet safely at a campus landmark, and mark the report as resolved.
              </p>
            </article>
          </div>
        </section>

        {/* 4 & 5. Report Lost Items & Report Found Items (2-Column Grid) */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          marginBottom: '3rem'
        }}>
          {/* Report Lost Items */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            borderTop: '4px solid var(--color-lost)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <AlertCircle size={22} color="var(--color-lost)" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Report Lost Items</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              When you've misplaced an item anywhere on campus grounds, acting quickly maximizes your chances of recovery:
            </p>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.92rem' }}>
              <li><strong>Provide Details:</strong> State brand, colors, case markings, stickers, or unique scratches.</li>
              <li><strong>Specify Location:</strong> Mention the lecture hall, lab, library floor, or canteen area.</li>
              <li><strong>Add Reachable Contact:</strong> Share your campus email and phone/WhatsApp for fast alerts.</li>
              <li><strong>Track &amp; Manage:</strong> Access and update your listings at any time through <em>My Reports</em>.</li>
            </ul>
          </div>

          {/* Report Found Items */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            borderTop: '4px solid var(--color-found)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={22} color="var(--color-found)" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Report Found Items</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Help your fellow batchmates by publishing found notices immediately upon discovering unattended belongings:
            </p>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.92rem' }}>
              <li><strong>Post Promptly:</strong> Anxious owners search the platform within minutes of misplacement.</li>
              <li><strong>Protect Verification Secrets:</strong> Keep a subtle feature private (e.g. lock screen image, inside initials).</li>
              <li><strong>High-Value Custody:</strong> For wallets, laptops, and cash, deposit with Campus Security.</li>
              <li><strong>Coordinate Safely:</strong> Receive claims and arrange handovers at public campus checkpoints.</li>
            </ul>
          </div>
        </section>

        {/* 6. Reconnect With Your Belongings */}
        <section style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <HeartHandshake size={22} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Reconnect With Your Belongings
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            lineHeight: 1.65
          }}>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.4rem' }}>
                1. The Claim Verification Flow
              </h4>
              <p>
                When a student spots their lost possession listed in Found Items, they can click <strong>Claim Item</strong> directly on the item details view. This prompts them to describe verifying details that only the genuine owner would know.
              </p>
            </div>

            <div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.4rem' }}>
                2. Direct Campus Communication
              </h4>
              <p>
                Trovio provides verified university email and phone channels so finders and reporters can communicate with peace of mind, without exposing personal data to unauthorized third parties.
              </p>
            </div>

            <div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.4rem' }}>
                3. Marking as Resolved
              </h4>
              <p>
                Once an item is safely handed over, the listing owner marks it as <strong>Resolved</strong>. Resolved stories appear on our Home page to showcase the positive community impact of Trovio.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Campus Support & Helpdesk */}
        <section style={{
          backgroundColor: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-primary-border)',
          padding: '2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-active)', marginBottom: '0.5rem' }}>
              Campus Security &amp; Help Desk
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '720px', lineHeight: 1.6 }}>
              Campus Security maintains 24/7 physical lockers for high-value items retrieved on campus. Visit the Central Security Control Room during operating hours.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.75rem', marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <Phone size={16} color="var(--color-primary)" />
                <strong>Helpline:</strong> +91 98765 43210
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <Mail size={16} color="var(--color-primary)" />
                <strong>Email:</strong> support@trovio.in
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <MapPin size={16} color="var(--color-primary)" />
                <strong>Office:</strong> Admin Block, Room G-04 (Ground Floor)
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
