import { AboutMe } from "@/components/pages/home/about-me";
import Hero from "@/components/pages/home/hero";
import { Motto } from "@/components/pages/home/motto";
import { Project } from "@/components/pages/home/project";
import { SiteNew } from "@/components/pages/home/site-new";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="space-y-28 pb-16 md:space-y-32">
        <SiteNew />
        <Project />
        <AboutMe />
        <Motto />
      </div>
    </div>
  );
}
