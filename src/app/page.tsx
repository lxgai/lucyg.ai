import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import { SITE_NAV } from "@/components/site/siteNav";
import { linkClass } from "@/components/site/ui";
import { resolveSiteImageSrc } from "@/lib/images";
import styles from "./home.module.css";

export const revalidate = 3600;

const CURRENTLY = [
  { label: "Reading", value: <><em>The Iliad</em> — Homer (trans. Fagles)</> },
  { label: "Dreaming", value: "moving to New York City (one day)" },
  { label: "Building", value: "this site, and a minimal planning app" },
  { label: "Planning", value: "maybe Sweden or Greece?" },
];

export default function Home() {
  return (
    <SiteShell toc={SITE_NAV}>
      {/* The banner is dithered, so it is served unoptimized and kept pixel-sharp. */}
      <Image
        src={resolveSiteImageSrc("/images/home/home_image.png")}
        alt="Dithered self-portraits on a rooftop"
        width={0}
        height={0}
        sizes="(max-width: 904px) 100vw, 720px"
        unoptimized
        priority
        className={styles.banner}
      />

      <p className={styles.greeting}>Hi, I&apos;m Lucy.</p>

      <p className={styles.paragraph}>
        Here you&apos;ll find what is essentially my collective space &amp; digital scrapbook on the{" "}
        <Link href="/favorites" className={linkClass}>things I love</Link> and things I&apos;m working on, in
        an effort to keep track of it all.
      </p>

      <p className={styles.paragraph}>
        I&apos;m currently a software engineer working in financial services, but recently have started{" "}
        <Link href="/projects" className={linkClass}>building</Link> and{" "}
        <Link href="/blog" className={linkClass}>writing</Link> outside that. Previously, I was at the
        University of California, San Diego.
      </p>

      <p className={styles.paragraph}>
        Consider this is an archive for a mind that wanders frequently, a fun external memory for the thoughts,{" "}
        <Link href="/travels" className={linkClass}>trips</Link>, and projects I find noteworthy and want to
        write to disk.
      </p>

      <p className={styles.placesIntro}>Some places you may want to visit:</p>
      <ul className={styles.places}>
        <li>
          <Link href="/travels/china-25" className={linkClass}>China &apos;25</Link>: my most recent trip;
        </li>
        <li>
          <Link href="/favorites" className={linkClass}>Favorites</Link>: what I&apos;ve been listening to,
          reading, and watching.
        </li>
      </ul>

      <h2 className={styles.currentlyHeading}>Currently</h2>
      <dl className={styles.currently}>
        {CURRENTLY.map((item) => (
          <div key={item.label} style={{ display: "contents" }}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>

      <p className={styles.signoff}>- lucy :)</p>
    </SiteShell>
  );
}
