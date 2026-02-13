const steps = [
  {
    icon: "🔗",
    number: "01",
    title: "Paste a URL",
    description: "Drop any website link into the input field.",
  },
  {
    icon: "🔍",
    number: "02",
    title: "AI Analyzes It",
    description: "Pasquda screenshots your site and judges every pixel.",
  },
  {
    icon: "🔥",
    number: "03",
    title: "Get Your Report Card",
    description: "A savage, shareable roast you won't forget.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <h2 className="mb-3 text-center font-heading text-2xl font-bold sm:text-3xl">
        How it works
      </h2>
      <p className="mb-8 text-center text-sm text-pasquda-gray/60 sm:mb-12 sm:text-base">
        Three steps to total humiliation
      </p>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="card-glow group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-6 text-center transition-all duration-300 hover:border-pasquda-pink/20 sm:p-8"
          >
            {/* Step number */}
            <span className="absolute top-4 right-4 font-mono text-xs text-pasquda-gray/20">
              {step.number}
            </span>

            {/* Icon */}
            <div className="mb-3 text-4xl transition-transform duration-300 group-hover:scale-110 sm:mb-4 sm:text-5xl">
              {step.icon}
            </div>

            <h3 className="font-heading text-lg font-bold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-pasquda-gray/70">
              {step.description}
            </p>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-pasquda-pink to-pasquda-pink-light transition-all duration-500 group-hover:w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
