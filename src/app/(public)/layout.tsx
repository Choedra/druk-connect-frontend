import { Footer } from "@/src/features/landing-page/ui/Footer";
import { Header } from "@/src/features/landing-page/ui/Header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only font-landing focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sky focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      {children}
      <Footer />
    </>
  );
}
