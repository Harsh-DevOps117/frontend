import Link from 'next/link';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title display-xl">
          Unlock the power of <br/>
          OogWay AI
        </h1>
        
        <p className="hero-subtitle body-lg">
          The most advanced platform for generative experiences, intelligent workflows, and limitless creativity. Built for the next generation of builders.
        </p>
        
        <div className="hero-actions">
          <Link href="/signup" className="btn btn-primary">
            Get Started Free
          </Link>
          <Link href="/login" className="btn btn-tertiary">
            Log In
          </Link>
        </div>
      </div>
    </section>
  );
}
