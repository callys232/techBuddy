import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
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
        <main>{children}</main>
      </PageTransition>
      <Footer />
      <FloatingCTA
        whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}
        quoteHref="/quote"
      />
    </>
  );
}
