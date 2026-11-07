import { Gallery } from "@/components/Gallery";
import { HeroFilm } from "@/components/HeroFilm";
import { Splash } from "@/components/Splash";
import { Contact, Footer, Header, Hero, Offerings, Process, SendPicture, StyleStrip } from "@/components/Sections";

/** Section order: clients/jis-shoes-ng/layout-manifest.md. Visual rhythm: clients/jis-shoes-ng/design-logic.md */
export default function Page() {
  return (
    <>
      <Splash />
      {/* Full-screen film first when one is configured; it hands over to the hero below when it ends */}
      <HeroFilm />
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
