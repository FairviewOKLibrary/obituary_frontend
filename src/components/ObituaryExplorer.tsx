"use client";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Obituary, ObituaryResponse, SearchField, SourceFilter } from "@/lib/obituaries";
import { getInitials, pageNumbers, SEARCH_FIELDS, SOURCE_FILTERS } from "@/lib/obituaries";
import {
  ArchiveIcon, ArrowLeftIcon, ArrowRightIcon, BookIcon, CalendarIcon,
  ChevronRightIcon, ExternalIcon, FilterIcon, HeartIcon, InfoIcon, SearchIcon,
} from "./Icons";
import ObituaryDialog from "./ObituaryDialog";
import styles from "@/styles/page.module.scss";

const PAGE_SIZE = 12;
const isField = (value: string | null): value is SearchField => SEARCH_FIELDS.some(x => x.value === value);
const isSource = (value: string | null): value is SourceFilter => SOURCE_FILTERS.some(x => x.value === value);

function Portrait({ record }: { record: Obituary }) {
  const [failed, setFailed] = useState(false);
  const photo = record.thumbnail && /^https:\/\//i.test(record.thumbnail);
  return <div className={styles.portrait} aria-hidden="true">
    {photo && !failed ? <Image src={record.thumbnail!} alt="" width={104} height={116} sizes="104px" unoptimized onError={() => setFailed(true)} /> : <span>{getInitials(record.person) || <BookIcon size={28}/>}</span>}
  </div>;
}

function ObituaryCard({ record, onSelect }: { record: Obituary; onSelect: (record: Obituary) => void }) {
  return <article className={styles.recordCard}>
    <Portrait key={record.id} record={record} />
    <div className={styles.cardContent}>
      <div className={styles.cardTop}><span className={styles.cardSource}>{record.source === "db" ? <ArchiveIcon size={13} /> : <HeartIcon size={13} />}{record.source === "db" ? "Library archive" : "Funeral home notice"}</span></div>
      <h3><button className={styles.cardTitle} type="button" onClick={() => onSelect(record)}>{record.person}</button></h3>
      <p className={styles.cardDates}><CalendarIcon size={15}/>{record.birth || "Birth date unknown"}<span className={styles.dateDash} aria-hidden="true">—</span>{record.death || "Death date unknown"}</p>
      {record.maiden_name && <p className={styles.cardMaiden}>Maiden name: {record.maiden_name}</p>}
      <p className={styles.cardExcerpt}>{record.text || "View the record for available details and source information."}</p>
      <div className={styles.cardFooter}>
        <button type="button" className={styles.cardRead} onClick={() => onSelect(record)}>View record <ArrowRightIcon size={16}/></button>
        {record.link && <a className={styles.cardExternal} href={record.link} target="_blank" rel="noopener noreferrer" aria-label={`Open original notice for ${record.person}`}><ExternalIcon size={16}/></a>}
      </div>
    </div>
  </article>;
}

function SkeletonCards() { return <div className={styles.cardGrid} aria-label="Loading records">
  {Array.from({ length: 6 }, (_, index) => <div key={index} className={`${styles.recordCard} ${styles.skeletonCard}`} aria-hidden="true"><div className={styles.skeletonPhoto}/><div className={styles.skeletonBody}><div/><div/><div/><div/></div></div>)}
</div>; }

function Explorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searched = searchParams.get("q") ?? "";
  const currentField = isField(searchParams.get("field")) ? searchParams.get("field") as SearchField : "q";
  const source = isSource(searchParams.get("source")) ? searchParams.get("source") as SourceFilter : "all";
  const requestedPage = Number(searchParams.get("page") || "1");
  const currentPage = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const [input, setInput] = useState(searched);
  const [field, setField] = useState<SearchField>(currentField);
  const [data, setData] = useState<ObituaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Obituary | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => { setInput(searched); setField(currentField); }, [searched, currentField]);
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String((currentPage - 1) * PAGE_SIZE), source });
    if (searched.trim()) params.set(currentField, searched.trim());
    setLoading(true); setError("");
    fetch(`/api/obituaries?${params}`, { signal: controller.signal })
      .then(async response => {
        const body = (await response.json()) as ObituaryResponse;
        if (!response.ok) throw new Error(body.message || "We couldn't load the obituary collection.");
        return body;
      })
      .then(body => { setData(body); setLoading(false); })
      .catch(cause => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : "Unable to load records.");
        setLoading(false);
      });
    return () => controller.abort();
  }, [searched, currentField, source, currentPage]);

  const navigate = (next: { q?: string; field?: SearchField; source?: SourceFilter; page?: number }) => {
    const params = new URLSearchParams();
    const q = next.q ?? searched;
    const chosenField = next.field ?? currentField;
    const chosenSource = next.source ?? source;
    const page = next.page ?? 1;
    if (q.trim()) { params.set("q", q.trim()); if (chosenField !== "q") params.set("field", chosenField); }
    if (chosenSource !== "all") params.set("source", chosenSource);
    if (page > 1) params.set("page", String(page));
    router.push(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
    if (next.page !== undefined) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); navigate({ q: input, field, page: 1 }); };
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, total);

  return <>
    <div className={styles.searchCard} id="search">
      <div className={styles.searchCardTop}><div><span className={styles.eyebrow}>DISCOVER OUR COLLECTION</span><h2>Find a life, remember a story.</h2></div><span className={styles.searchNote}><SearchIcon size={16}/> Open to the public</span></div>
      <form onSubmit={submit} className={styles.searchForm} role="search">
        <label className={styles.searchFieldLabel} htmlFor="search-name">SEARCH OBITUARIES</label>
        <div className={styles.searchControls}>
          <div className={styles.searchInputWrap}><SearchIcon size={23}/><input id="search-name" type="search" autoComplete="off" value={input} onChange={event => setInput(event.target.value)} placeholder="Search by name, year, or keyword…" maxLength={120}/></div>
          <label className={styles.selectWrap}><span className={styles.srOnly}>Search in</span><select value={field} onChange={event => setField(event.target.value as SearchField)}>{SEARCH_FIELDS.map(x => <option key={x.value} value={x.value}>{x.label}</option>)}</select></label>
          <button className={styles.searchButton} type="submit">Search collection <ArrowRightIcon size={18}/></button>
        </div>
      </form>
      <div className={styles.searchHelp}><InfoIcon size={15}/><p>Try a full name, a family surname, or a year like “1952”. Use the dropdown for more specific searches.</p></div>
    </div>

    <section className={styles.resultsSection} ref={resultsRef} id="records" aria-labelledby="results-heading">
      <div className={styles.resultsHeading}><div><span className={styles.eyebrow}>THE OBITUARY COLLECTION</span><h2 id="results-heading">Explore the records</h2><p>Discover and honor the people who shaped our community.</p></div><div className={styles.archiveMark}><BookIcon size={25}/></div></div>
      <div className={styles.explorerLayout}>
        <aside className={styles.sidebar} aria-label="Filter obituary records">
          <div className={styles.sidePanel}><div className={styles.sidePanelHead}><FilterIcon size={17}/> REFINE YOUR VIEW</div><p className={styles.sideLabel}>RECORD SOURCE</p><div className={styles.sourceOptions}>{SOURCE_FILTERS.map(option => <button type="button" key={option.value} className={`${styles.sourceOption} ${source === option.value ? styles.activeSource : ""}`} aria-pressed={source === option.value} onClick={() => navigate({ source: option.value, page: 1 })}><span className={styles.sourceDot}/><span><strong>{option.label}</strong><small>{option.description}</small></span>{source === option.value && <ChevronRightIcon size={16}/>}</button>)}</div></div>
          <div className={styles.helpPanel}><BookIcon size={26}/><h3>Preserving local history</h3><p>Our collection brings together library archives and notices shared by local funeral homes.</p><a href="#about">About this collection <ArrowRightIcon size={15}/></a></div>
        </aside>
        <div className={styles.recordsColumn}>
          <div className={styles.recordsToolbar}><div aria-live="polite" aria-atomic="true" className={styles.resultCount}>{loading ? "Searching the collection…" : error ? "Unable to show results" : total === 0 ? "No records found" : <><strong>{total.toLocaleString()}</strong> {total === 1 ? "record" : "records"} found{searched ? <> for <em>“{searched}”</em></> : null}</>}</div>{searched && <button type="button" className={styles.clearButton} onClick={() => navigate({ q: "", field: "q", page: 1 })}>Clear search ×</button>}</div>
          {data?.warnings?.length && !loading && !error ? <div className={styles.warning} role="status"><InfoIcon size={17}/>{data.warnings.join(" ")}</div> : null}
          {loading ? <SkeletonCards /> : error ? <div className={styles.emptyState} role="alert"><ArchiveIcon size={34}/><h3>We couldn’t connect to the collection.</h3><p>{error}</p><button type="button" className={styles.secondaryButton} onClick={() => window.location.reload()}>Try again <ArrowRightIcon size={16}/></button></div> : total === 0 ? <div className={styles.emptyState}><SearchIcon size={34}/><h3>No matching records found</h3><p>Try a different spelling, a surname only, or search across all fields. Some historical records have limited details.</p><button type="button" className={styles.secondaryButton} onClick={() => navigate({ q: "", field: "q", source: "all" })}>Browse all records <ArrowRightIcon size={16}/></button></div> : <>
            <div className={styles.cardGrid}>{data?.results.map(record => <ObituaryCard key={record.id} record={record} onSelect={setSelected}/>)}</div>
            <div className={styles.paginationWrap}><p>Showing {start.toLocaleString()}–{end.toLocaleString()} of {total.toLocaleString()} records</p>{totalPages > 1 && <nav className={styles.pagination} aria-label="Obituary results pages"><button type="button" disabled={currentPage <= 1} onClick={() => navigate({ page: currentPage - 1 })} aria-label="Previous page"><ArrowLeftIcon size={17}/></button>{pageNumbers(currentPage, totalPages).map((part, index) => part === "ellipsis" ? <span key={`gap-${index}`} className={styles.pageDots}>…</span> : <button type="button" key={part} className={part === currentPage ? styles.pageActive : ""} aria-current={part === currentPage ? "page" : undefined} onClick={() => navigate({ page: part })} aria-label={`Go to page ${part}`}>{part}</button>)}<button type="button" disabled={currentPage >= totalPages} onClick={() => navigate({ page: currentPage + 1 })} aria-label="Next page"><ArrowRightIcon size={17}/></button></nav>}</div>
          </>}
        </div>
      </div>
    </section>
    <ObituaryDialog record={selected} onClose={() => setSelected(null)}/>
  </>;
}

export default function ObituaryExplorer() {
  return <Suspense fallback={<div className={styles.searchCard}>Loading the collection…</div>}><Explorer/></Suspense>;
}
