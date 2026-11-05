import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  Menu, 
  X, 
  ArrowRight, 
  ArrowRightLeft, 
  TrendingDown, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  FileText, 
  Target, 
  CheckCircle,
  ShieldCheck,
  Smartphone,
  Zap,
  Lock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import './LandingPage.css';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="landing-page">
      {/* PUBLIC NAVBAR */}
      <header className="public-navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <div className="brand" style={{ marginRight: 'auto' }}>
            <Wallet size={28} />
            <span>ExMoney</span>
          </div>
          
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#benefits">Benefits</a>
          </nav>
          
          <div className="nav-actions">
            <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="primary" onClick={() => navigate('/register')}>Get Started</Button>
          </div>

          <button className="mobile-toggle" onClick={toggleMenu} style={{ marginLeft: 'auto' }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="#features" onClick={toggleMenu}>Features</a>
            <a href="#how-it-works" onClick={toggleMenu}>How It Works</a>
            <a href="#benefits" onClick={toggleMenu}>Benefits</a>
            <div className="nav-actions" style={{ display: 'flex' }}>
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button variant="primary" onClick={() => navigate('/register')}>Get Started</Button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="section section-light">
        <div className="container hero">
          <div className="hero-content">
            <h1>Take Control of Your Money.</h1>
            <p>
              Track your expenses, manage your budget, understand your spending, 
              and stay in control of your financial goals — all in one place.
            </p>
            <div className="hero-actions">
              <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
                Get Started <ArrowRight size={20} style={{ marginLeft: '8px' }}/>
              </Button>
              <Button variant="secondary" size="lg" onClick={() => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}>
                Explore Features
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-visual-inner">
              <div className="skeleton-line" style={{ width: '40%' }}></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line" style={{ width: '80%' }}></div>
              <div className="skeleton-line" style={{ height: '60px', marginTop: 'auto' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / QUICK VALUE SECTION */}
      <section className="section section-muted">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="icon-wrapper"><ShieldCheck size={24} /></div>
              <h4>Track Every Expense</h4>
            </div>
            <div className="trust-item">
              <div className="icon-wrapper"><Zap size={24} /></div>
              <h4>Smart Budget Management</h4>
            </div>
            <div className="trust-item">
              <div className="icon-wrapper"><Smartphone size={24} /></div>
              <h4>Clear Financial Insights</h4>
            </div>
            <div className="trust-item">
              <div className="icon-wrapper"><Lock size={24} /></div>
              <h4>Financial Goals</h4>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2 className="h2">Everything You Need to Manage Your Money</h2>
            <p>Powerful tools designed to simplify your financial life.</p>
          </div>
          
          <div className="features-grid">
            <Card className="feature-card">
              <CardBody>
                <TrendingDown className="feature-icon" size={32} />
                <h3 className="h3 mb-2">Expense Tracking</h3>
                <p className="text-muted">Record and organize your daily expenses effortlessly.</p>
              </CardBody>
            </Card>

            <Card className="feature-card">
              <CardBody>
                <TrendingUp className="feature-icon" size={32} />
                <h3 className="h3 mb-2">Income Tracking</h3>
                <p className="text-muted">Keep track of your income and understand your complete cash flow.</p>
              </CardBody>
            </Card>

            <Card className="feature-card">
              <CardBody>
                <PieChart className="feature-icon" size={32} />
                <h3 className="h3 mb-2">Budget Management</h3>
                <p className="text-muted">Set spending limits and monitor your progress throughout the month.</p>
              </CardBody>
            </Card>

            <Card className="feature-card">
              <CardBody>
                <BarChart3 className="feature-icon" size={32} />
                <h3 className="h3 mb-2">Spending Analytics</h3>
                <p className="text-muted">Understand where your money goes with clear visual insights.</p>
              </CardBody>
            </Card>

            <Card className="feature-card">
              <CardBody>
                <FileText className="feature-icon" size={32} />
                <h3 className="h3 mb-2">Financial Reports</h3>
                <p className="text-muted">Review your financial activity through organized reports.</p>
              </CardBody>
            </Card>

            <Card className="feature-card">
              <CardBody>
                <Target className="feature-icon" size={32} />
                <h3 className="h3 mb-2">Financial Goals</h3>
                <p className="text-muted">Set savings goals and track your progress over time.</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="section section-muted">
        <div className="container">
          <div className="section-header">
            <h2 className="h2">How It Works</h2>
            <p>Take control of your finances in three simple steps.</p>
          </div>

          <div className="workflow-grid">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <h3 className="h3 mb-2">Record</h3>
              <p className="text-muted">Add your income and expenses as they happen.</p>
            </div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <h3 className="h3 mb-2">Organize</h3>
              <p className="text-muted">Categorize transactions and set budgets for your spending.</p>
            </div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <h3 className="h3 mb-2">Understand</h3>
              <p className="text-muted">Use analytics and reports to understand your financial habits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2 className="h2">Your Finances, At a Glance</h2>
            <p>A beautifully designed dashboard gives you the clarity you need.</p>
          </div>

          <div className="dashboard-mockup">
            <div className="mockup-header">
              <div className="mockup-dot" style={{ background: '#EF4444' }}></div>
              <div className="mockup-dot" style={{ background: '#F59E0B' }}></div>
              <div className="mockup-dot" style={{ background: '#10B981' }}></div>
            </div>
            <div className="mockup-body">
              <div className="mockup-grid">
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <Card>
                    <CardBody>
                      <h4 className="text-muted text-sm font-medium">Total Balance</h4>
                      <div className="h2 mt-2">₹45,250.00</div>
                    </CardBody>
                  </Card>
                  
                  <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <Card style={{ flex: 1 }}>
                      <CardBody>
                        <h4 className="text-muted text-sm font-medium">Income</h4>
                        <div className="h3 mt-2" style={{ color: 'var(--color-secondary)' }}>₹60,000.00</div>
                      </CardBody>
                    </Card>
                    <Card style={{ flex: 1 }}>
                      <CardBody>
                        <h4 className="text-muted text-sm font-medium">Expenses</h4>
                        <div className="h3 mt-2" style={{ color: 'var(--color-danger)' }}>₹14,750.00</div>
                      </CardBody>
                    </Card>
                  </div>
                </div>

                <Card>
                  <CardBody>
                    <h3 className="h3 mb-4">Recent Transactions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      {[
                        { name: 'Grocery Store', cat: 'Food', amt: '-₹3,200', type: 'expense' },
                        { name: 'Monthly Salary', cat: 'Income', amt: '+₹60,000', type: 'income' },
                        { name: 'Electric Bill', cat: 'Utilities', amt: '-₹1,500', type: 'expense' },
                      ].map((tx, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div style={{ background: 'var(--color-bg)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
                              <ArrowRightLeft size={16} />
                            </div>
                            <div>
                              <div className="font-medium">{tx.name}</div>
                              <div className="text-sm text-muted">{tx.cat}</div>
                            </div>
                          </div>
                          <div className="font-semibold" style={{ color: tx.type === 'income' ? 'var(--color-secondary)' : 'var(--color-text)' }}>
                            {tx.amt}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="section section-muted">
        <div className="container">
          <div className="benefits-layout">
            <div>
              <h2 className="h2 mb-6">Why Choose ExMoney?</h2>
              <div className="benefits-list">
                {[
                  "Know exactly where your money goes every month",
                  "Avoid unnecessary spending with clear budgets",
                  "Stay within your financial limits automatically",
                  "Track your financial progress over the long term",
                  "Make informed, confident financial decisions",
                  "Build better spending habits effortlessly"
                ].map((benefit, idx) => (
                  <div key={idx} className="benefit-item">
                    <CheckCircle className="benefit-icon" size={24} />
                    <span className="font-medium text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="benefits-visual">
              <PieChart size={160} style={{ color: 'var(--color-primary)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section section-light">
        <div className="container">
          <div className="cta-box">
            <h2>Start Managing Your Money Smarter</h2>
            <p>
              Bring your income, expenses, budgets, and financial goals together in one simple place.
            </p>
            <Button variant="secondary" size="lg" onClick={() => navigate('/register')} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3><Wallet size={24} /> ExMoney</h3>
              <p className="text-muted">Simple tools for smarter expense management.</p>
            </div>
            <div className="footer-links">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#benefits">Benefits</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Account</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Get Started</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); }}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); }}>Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} ExMoney. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
