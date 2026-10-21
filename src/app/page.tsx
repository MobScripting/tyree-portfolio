import {
  AiSection,
  Contact,
  Experience,
  Hero,
  Lab,
  Nav,
  Proof,
  Work,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Proof />
        <Work />
        <AiSection />
        <Experience />
        <Lab />
        <Contact />
      </main>
    </>
  );
}
