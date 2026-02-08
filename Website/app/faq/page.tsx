import Link from "next/link";

const faqItems = [
  {
    question: "What is Nodexity?",
    answer: "Nodexity is a local first Minecraft server management platform: desktop app in development, launcher and hosting planned."
  },
  {
    question: "Is Nodexity open source?",
    answer: "Yes. The desktop app is AGPL-3.0 and the website is MIT."
  },
  {
    question: "Do I need an account?",
    answer: "No account is required to run the desktop app locally."
  },
  {
    question: "Where is my data stored?",
    answer: "All server data stays on your machine by default."
  },
  {
    question: "Does Nodexity work offline?",
    answer: "Yes. The desktop app is built to work offline; everything stays on your machine."
  },
  {
    question: "What platforms are supported?",
    answer: "The desktop app targets Windows first, with cross-platform support planned."
  },
  {
    question: "When is the release?",
    answer: "We are in active development. Join Discord for updates and early access news."
  },
  {
    question: "How can I help?",
    answer: "Join Discord, share feedback, report bugs, and star the GitHub repo."
  }
];

export default function FaqPage() {
  return (
    <section className="full-width-section relative">
      <div className="section-content mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl font-mono">
            FAQ
          </h1>
        </div>
        <div className="space-y-6 border-t border-border pt-8">
          {faqItems.map((item) => (
            <div key={item.question} className="space-y-2">
              <h2 className="text-base font-semibold text-text-primary sm:text-lg">
                {item.question}
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="https://discord.gg/RVTAEbdDBJ"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-discord"
          >
            <span className="relative z-20 font-mono">JOIN DISCORD</span>
          </a>
          <Link href="/" className="btn-secondary">
            <span className="relative z-20 font-mono">BACK HOME</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

