import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AgentWidget } from "@/components/ui/AgentWidget";
import { BackToTop } from "@/components/ui/BackToTop";
import { PageTransition } from "@/components/layout/PageTransition";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <PageTransition>
        <main id="main-content" className="relative z-10">{children}</main>
      </PageTransition>
      <Footer />
      <AgentWidget />
      <BackToTop />
    </>
  );
}
