import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Obituary } from "@/lib/obituaries";
import { ArrowLeftIcon, BookIcon, CalendarIcon, ExternalIcon } from "@/components/Icons";
import styles from "@/styles/record.module.scss";

type Params = { params: Promise<{ id: string }> };
async function getRecord(id: string): Promise<Obituary | "unavailable" | null> {
  if (!/^(archive-\d{1,12}|notice-[a-f0-9]{16})$/.test(id)) return null;
  const base = process.env.OBITUARY_API_URL || "http://localhost:3001";
  try {
    const endpoint = new URL(`/obituary/${encodeURIComponent(id)}`, base);
    const response = await fetch(endpoint, { next: { revalidate: 120 }, signal: AbortSignal.timeout(12000) });
    if (response.status === 404) return null;
    if (!response.ok) return "unavailable";
    const body = (await response.json()) as { record?: Obituary };
    return body.record || null;
  } catch { return "unavailable"; }
}
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const record = await getRecord(id);
  if (!record || record === "unavailable") return { title: "Record unavailable | Fairview City Library", robots: { index: false } };
  return {
    title: `${record.person} | Fairview City Library Obituary Collection`,
    description: [record.person, record.birth, record.death, record.text?.slice(0, 140)].filter(Boolean).join(" · "),
    openGraph: { title: `${record.person} — Obituary Record`, description: `Record from Fairview City Library's obituary collection.` },
  };
}
export default async function RecordPage({ params }: Params) {
  const { id } = await params;
  const record = await getRecord(id);
  if (!record) notFound();
  if (record === "unavailable") return <div className={styles.page}><main className={styles.main}><Link href="/" className={styles.back}><ArrowLeftIcon size={16}/> Return to the collection</Link><div className={styles.unavailable}><BookIcon size={34}/><h1>Record temporarily unavailable</h1><p>We couldn’t load this record right now. Please try again or return to the obituary collection.</p><Link href={`/obituary/${encodeURIComponent(id)}`}>Try again →</Link></div></main></div>;
  const hasImage = record.thumbnail && record.thumbnail.startsWith("https://");
  return <div className={styles.page}>
    <header className={styles.header}><div className={styles.headerInner}><Link href="/" className={styles.brand}><BookIcon size={27}/><span>FAIRVIEW CITY LIBRARY</span></Link><Link href="/#records" className={styles.headerLink}>Explore the collection</Link></div></header>
    <main className={styles.main}>
      <Link href="/#records" className={styles.back}><ArrowLeftIcon size={16}/> Back to obituary collection</Link>
      <article className={styles.record}>
        <div className={styles.heading}>
          <div className={styles.portrait}>{hasImage ? <Image src={record.thumbnail!} alt="" width={138} height={166} unoptimized /> : <BookIcon size={45}/>}</div>
          <div><span className={styles.eyebrow}>{record.source === "db" ? "LIBRARY ARCHIVE RECORD" : "FUNERAL HOME NOTICE"}</span><h1>{record.person}</h1>{(record.birth || record.death) && <p className={styles.dates}><CalendarIcon size={18}/>{record.birth || "Birth date unknown"} — {record.death || "Death date unknown"}</p>}</div>
        </div>
        {(record.maiden_name || record.location) && <dl className={styles.facts}>{record.maiden_name && <div><dt>Maiden name</dt><dd>{record.maiden_name}</dd></div>}{record.location && <div><dt>Location</dt><dd>{record.location}</dd></div>}</dl>}
        <section className={styles.about}><h2>About this record</h2><p>{record.text || "No additional obituary text is currently available for this record."}</p></section>
        <div className={styles.actions}>{record.link && <a href={record.link} className={styles.original} target="_blank" rel="noopener noreferrer">Read the original notice <ExternalIcon size={17}/></a>}<Link href="/#search" className={styles.browse}>Search more records →</Link></div>
      </article>
      <div className={styles.note}><BookIcon size={24}/><p>This information is presented as part of the Fairview City Library local history collection. Dates and details may differ between sources.</p></div>
    </main>
    <footer className={styles.footer}>FAIRVIEW CITY LIBRARY <span>·</span> STORIES REMEMBERED, HISTORY PRESERVED</footer>
  </div>;
}
