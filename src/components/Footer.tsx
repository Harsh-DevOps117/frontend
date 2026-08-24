import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">OogWay</span>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4 className="footer-heading">Product</h4>
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/security">Security</Link>
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <Link href="/docs">Documentation</Link>
            <Link href="/api">API Reference</Link>
            <Link href="/community">Community</Link>
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <Link href="/about">About</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} OogWay Inc. All rights reserved.</p>
        <div className="footer-legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
