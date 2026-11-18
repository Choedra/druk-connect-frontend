import { ChevronDown } from "lucide-react";

// Keep these answers in step with how the product actually works.
const FAQS = [
  {
    q: "Who can use Bhutanese Marketplace?",
    a: "Anyone can browse services. To contact a provider you need a free account. Bhutanese Marketplace is built for the Bhutanese community in Australia, but everyone is welcome to use the services listed.",
  },
  {
    q: "Does it cost anything?",
    a: "No. Joining is free and there are no listing fees. You agree prices and payment directly with the provider.",
  },
  {
    q: "Why do providers need two vouches?",
    a: "Vouches are how the community shows it knows and trusts someone. A provider needs two members to vouch for them before they can post, and you can see who vouched on each listing.",
  },
  {
    q: "How do I contact a provider?",
    a: "Open a listing, sign in and tap “Message on WhatsApp” to chat with the provider directly.",
  },
  {
    q: "What if something goes wrong?",
    a: "Sign in, open the listing and choose “Report scam or suspicious activity”. Our admins review every report.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">Frequently asked questions</h2>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-8">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-line bg-white open:bg-canvas">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-2xl px-6 py-5 font-semibold text-ink">
                {f.q}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-6 pb-6 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
