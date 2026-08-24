import './HowItWorks.css';

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Data",
      description: "Securely link your enterprise data sources, APIs, and existing documentation into OogWay's secure vault. No coding required."
    },
    {
      number: "02",
      title: "Design the Workflow",
      description: "Use our visual node builder to construct intelligent pipelines. Chain prompts, map logic, and define strict output schemas."
    },
    {
      number: "03",
      title: "Deploy & Scale",
      description: "Publish your AI workflow instantly as an API endpoint or embed it directly into your internal tools with zero infrastructure overhead."
    }
  ];

  return (
    <section className="how-it-works">
      <div className="hiw-container">
        <div className="hiw-header">
          <h2 className="display-md">How it works</h2>
          <p className="body-lg hiw-subtitle">
            From raw data to deployed AI infrastructure in three steps. Built for scale, designed for simplicity.
          </p>
        </div>

        <div className="hiw-grid">
          {steps.map((step, index) => (
            <div key={index} className="hiw-step">
              <span className="hiw-number">{step.number}</span>
              <h3 className="card-title">{step.title}</h3>
              <p className="body">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
