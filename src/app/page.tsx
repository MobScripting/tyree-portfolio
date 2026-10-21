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
import { StageLoader } from "@/components/StageLoader";

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
      <StageLoader />
    </>
  );
}
