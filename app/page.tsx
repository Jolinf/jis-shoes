import { Gallery } from "@/components/Gallery";
import { Contact, Footer, Header, Hero, Offerings, Process, SendPicture } from "@/components/Sections";

/** Section order: clients/jis-shoes-ng/layout-manifest.md */
export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
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
