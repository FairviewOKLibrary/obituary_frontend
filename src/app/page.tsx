import ObituaryExplorer from "@/components/ObituaryExplorer";
import { ArrowRightIcon, BookIcon, HeartIcon } from "@/components/Icons";
import styles from "@/styles/page.module.scss";

export default function Home() {
  return <>
    <a className={styles.skipLink} href="#search">Skip to obituary search</a>
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <a href="/" className={styles.brand} aria-label="Fairview City Library Obituary Collection home"><span className={styles.brandIcon}><BookIcon size={27}/></span><span className={styles.brandText}><strong>FAIRVIEW</strong><small>CITY LIBRARY</small></span></a>
        <nav aria-label="Main navigation" className={styles.nav}><a className={styles.navCurrent} href="#records" aria-current="page">Obituary collection</a><a href="#about">About the archive</a><a className={styles.navButton} href="#search">Search records <ArrowRightIcon size={15}/></a></nav>
      </div>
    </header>
    <main>
      <section className={styles.hero} aria-labelledby="hero-title"><div className={styles.heroInner}><div className={styles.heroCopy}><span className={styles.heroEyebrow}><span/> FAIRVIEW CITY LIBRARY · LOCAL HISTORY</span><h1 id="hero-title">Every life has<br/>a <em>story worth</em><br/>remembering.</h1><p>Explore obituaries and historical records that preserve the people, families, and memories of our community.</p><a className={styles.heroLink} href="#search">Begin your search <ArrowRightIcon size={20}/></a></div><div className={styles.heroArtwork} aria-hidden="true"><div className={styles.artworkHalo}/><div className={styles.artworkCard}><div className={styles.artworkBorder}><div className={styles.artworkSprig}>❧</div><span>IN LOVING MEMORY</span><div className={styles.artworkRule}/><p>Those we remember<br/>are always with us.</p><div className={styles.artworkRule}/><BookIcon size={26}/></div></div><span className={styles.artworkCaption}>PRESERVING STORIES FOR GENERATIONS</span></div></div></section>
      <div className={styles.contentWrap}><ObituaryExplorer/></div>
      <section className={styles.aboutSection} id="about" aria-labelledby="about-heading"><div className={styles.aboutInner}><div className={styles.aboutIcon}><HeartIcon size={28}/></div><div><span className={styles.eyebrow}>OUR PURPOSE</span><h2 id="about-heading">A place for remembrance. A resource for generations.</h2><p>The Fairview City Library Obituary Collection helps families, neighbors, and researchers explore local history. Records may come from the library’s historical archive or notices published by participating funeral homes. Information may be incomplete or vary by source.</p></div><a className={styles.aboutAction} href="#search">Explore records <ArrowRightIcon size={18}/></a></div></section>
    </main>
    <footer className={styles.footer}><div className={styles.footerInner}><div className={styles.footerBrand}><BookIcon size={26}/><span><strong>FAIRVIEW CITY LIBRARY</strong><small>Stories remembered. History preserved.</small></span></div><p>Made for community, family history, and remembrance.</p><a href="#search">Back to search ↑</a></div></footer>
  </>;
}
