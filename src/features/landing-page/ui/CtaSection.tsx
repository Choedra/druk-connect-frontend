import Link from "next/link";

export function CtaSection() {
  return (
    <section className="pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-4xl bg-sky px-8 py-14 text-center text-white sm:px-12 lg:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">
            Have a skill or service to offer?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">
            Cooking, tutoring, driving or tax help. List it for free and reach the community in your
            city.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/auth/signup?role=LISTER"
              className="rounded-full bg-white px-7 py-3.5 font-semibold text-sky transition-colors hover:bg-sky-soft"
            >
              List your service
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-white/40 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
