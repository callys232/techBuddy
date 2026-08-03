import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AgentWidget } from "@/components/ui/AgentWidget";
import { PageStickman } from "@/components/ui/PageStickman";
import { BackToTop } from "@/components/ui/BackToTop";
import { PageTransition } from "@/components/layout/PageTransition";

/* Fixed faint SVG background — sky blue diagonal lines, mirrors Lamidone pattern */
function GlobalBg() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Structural grid lines */}
      <line x1="0" y1="0" x2="100%" y2="100%" stroke="#38BDF8" strokeWidth="0.4" strokeOpacity="0.04" />
      <line x1="25%" y1="0" x2="100%" y2="75%" stroke="#38BDF8" strokeWidth="0.3" strokeOpacity="0.025" />
      <line x1="0" y1="25%" x2="75%" y2="100%" stroke="#38BDF8" strokeWidth="0.3" strokeOpacity="0.025" />
      <line x1="50%" y1="0" x2="100%" y2="50%" stroke="#38BDF8" strokeWidth="0.35" strokeOpacity="0.03" />
      <line x1="0" y1="50%" x2="50%" y2="100%" stroke="#38BDF8" strokeWidth="0.35" strokeOpacity="0.03" />
      <line x1="75%" y1="0" x2="100%" y2="25%" stroke="#38BDF8" strokeWidth="0.4" strokeOpacity="0.05" />
      <line x1="0" y1="75%" x2="25%" y2="100%" stroke="#38BDF8" strokeWidth="0.4" strokeOpacity="0.05" />
      {/* Top-left accent cluster */}
      <line x1="0" y1="0" x2="30%" y2="0" stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.07" />
      <line x1="0" y1="0" x2="0" y2="30%" stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.07" />
      <line x1="0" y1="8%" x2="18%" y2="0" stroke="#38BDF8" strokeWidth="0.6" strokeOpacity="0.06" />
      {/* Bottom-right accent cluster */}
      <line x1="70%" y1="100%" x2="100%" y2="100%" stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.07" />
      <line x1="100%" y1="70%" x2="100%" y2="100%" stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.07" />
      <line x1="82%" y1="100%" x2="100%" y2="92%" stroke="#38BDF8" strokeWidth="0.6" strokeOpacity="0.06" />
      {/* Faint white structural lines */}
      <line x1="0" y1="33%" x2="100%" y2="33%" stroke="white" strokeWidth="0.3" strokeOpacity="0.018" />
      <line x1="0" y1="66%" x2="100%" y2="66%" stroke="white" strokeWidth="0.3" strokeOpacity="0.018" />
      <line x1="33%" y1="0" x2="33%" y2="100%" stroke="white" strokeWidth="0.3" strokeOpacity="0.018" />
      <line x1="66%" y1="0" x2="66%" y2="100%" stroke="white" strokeWidth="0.3" strokeOpacity="0.018" />
    </svg>
  );
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalBg />
      <Navbar />
      <PageStickman />
      <PageTransition>
        <main className="relative z-10">{children}</main>
      </PageTransition>
      <Footer />
      <AgentWidget />
      <BackToTop />
    </>
  );
}
