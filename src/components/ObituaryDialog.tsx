"use client";
import { useEffect, useRef, useState } from "react";
import type { Obituary } from "@/lib/obituaries";
import { ArrowRightIcon, BookIcon, CloseIcon, ExternalIcon } from "./Icons";
import styles from "@/styles/page.module.scss";

interface Props { record: Obituary | null; onClose: () => void; }
export default function ObituaryDialog({ record, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    if (record && dialog && !dialog.open) dialog.showModal();
    if (!record && dialog?.open) dialog.close();
  }, [record]);
  const copyCitation = async () => {
    if (!record) return;
    const content = `${record.person}${record.birth || record.death ? ` (${record.birth || "?"}–${record.death || "?"})` : ""}. Fairview City Library Obituary Collection. Record: ${window.location.origin}/obituary/${encodeURIComponent(record.id)}${record.link ? ` Original notice: ${record.link}` : ""}`;
    try { await navigator.clipboard.writeText(content); setCopied(true); } catch { setCopied(false); }
  };
  return (
    <dialog ref={ref} className={styles.dialog} onClose={() => { setCopied(false); onClose(); }} onClick={(event) => {
      if (event.target === ref.current) ref.current?.close();
    }} aria-labelledby="obituary-dialog-title">
      {record && <>
        <div className={styles.dialogHead}>
          <span className={styles.dialogEyebrow}><BookIcon size={17}/> FAIRVIEW CITY LIBRARY COLLECTION</span>
          <button className={styles.iconButton} type="button" onClick={() => ref.current?.close()} aria-label="Close obituary details"><CloseIcon/></button>
        </div>
        <div className={styles.dialogInner}>
          <span className={styles.sourceTag}>{record.source === "db" ? "Library archive" : "Funeral home notice"}</span>
          <h2 id="obituary-dialog-title" className={styles.dialogTitle}>{record.person}</h2>
          {(record.birth || record.death) && <p className={styles.dialogDates}>{record.birth || "Date unknown"} <span aria-hidden="true">—</span> {record.death || "Date unknown"}</p>}
          <div className={styles.detailGrid}>
            {record.maiden_name && <div><span>Maiden name</span><strong>{record.maiden_name}</strong></div>}
            {record.location && <div><span>Location</span><strong>{record.location}</strong></div>}
          </div>
          <div className={styles.dialogSection}>
            <h3>About this record</h3>
            <p>{record.text || "No additional obituary text is currently available for this record."}</p>
          </div>
          <div className={styles.dialogActions}>
            <a className={styles.primaryButton} href={`/obituary/${encodeURIComponent(record.id)}`}>Open record page <ArrowRightIcon size={17}/></a>
            {record.link && <a className={styles.secondaryButton} href={record.link} target="_blank" rel="noopener noreferrer">Read original notice <ExternalIcon size={17}/></a>}
            <button className={styles.secondaryButton} type="button" onClick={copyCitation}>{copied ? "Citation copied" : "Copy citation"}</button>
          </div>
        </div>
      </>}
    </dialog>
  );
}
