import { Gallery } from "@/components/Gallery";
import { Contact, Footer, Header, Hero, Offerings, Process, SendPicture, StyleStrip } from "@/components/Sections";

/** Section order: clients/jis-shoes-ng/layout-manifest.md. Visual rhythm: clients/jis-shoes-ng/design-logic.md */
export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StyleStrip />
        <Offerings />
        <Gallery />
        <SendPicture />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
