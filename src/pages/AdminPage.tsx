import "../App.css";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminProcesses, type AdminProcess } from "../data/adminProcesses";

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "2-digit",
  });
}

function statusLabel(status: AdminProcess["status"]): string {
  switch (status) {
    case "queued":
      return "Queued";
    case "running":
      return "Running";
    case "success":
      return "Success";
    case "failed":
      return "Failed";
  }
}

function nowStamp(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  return `[${hh}:${mm}:${ss}.${ms}]`;
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function AdminPage() {
  const [processes, setProcesses] = useState<AdminProcess[]>(adminProcesses);
  const [selectedId, setSelectedId] = useState(processes[0]?.id ?? "");

  // Keep the selected id valid if the list changes.
  useEffect(() => {
    if (processes.length === 0) return;
    setSelectedId((prev) =>
      processes.some((p) => p.id === prev) ? prev : processes[0]!.id,
    );
  }, [processes]);

  // Simulate a live headless browser: append logs + update current step.
  useEffect(() => {
    const id = window.setInterval(() => {
      setProcesses((prev) => {
        return prev.map((p) => {
          if (p.status !== "running") return p;

          // Small deterministic-ish progression based on string content.
          const bump = Math.max(1, (p.id.charCodeAt(p.id.length - 1) % 3) + 1);
          const nextCount = p.scrapedCount + bump;
          const stepBase =
            p.id === "proc_005"
              ? "Visiting listing details"
              : "Parsing results list";
          const max = p.id === "proc_005" ? 40 : 140;
          const nextStep =
            stepBase === "Visiting listing details"
              ? `${stepBase} (${Math.min(nextCount, max)}/${max})`
              : `${stepBase} (items ${Math.min(nextCount, max)}/${max})`;

          const logLine =
            stepBase === "Visiting listing details"
              ? `${nowStamp()} Parsed details: price, beds, baths`
              : `${nowStamp()} Extracted ${bump} new cards (total ${Math.min(nextCount, max)})`;

          const nextLogs = [...p.logs, logLine].slice(-220);

          // Auto-complete the process once it reaches max.
          if (nextCount >= max) {
            return {
              ...p,
              status: "success",
              currentStep: "Completed",
              scrapedCount: max,
              logs: [...nextLogs, `${nowStamp()} Done ✅`].slice(-220),
            };
          }

          return {
            ...p,
            currentStep: nextStep,
            scrapedCount: nextCount,
            logs: nextLogs,
          };
        });
      });
    }, 1100);

    return () => window.clearInterval(id);
  }, []);

  const selected = useMemo(() => {
    return processes.find((p) => p.id === selectedId) ?? processes[0];
  }, [processes, selectedId]);

  return (
    <div className="zApp">
      <header className="zHeader">
        <div className="zHeader__top">
          <nav className="zNav zNav--left" aria-label="Admin nav">
            <Link className="zNav__link" to="/">
              Listings
            </Link>
            <a className="zNav__link" href="#">
              Workers
            </a>
            <a className="zNav__link" href="#">
              Storage
            </a>
          </nav>

          <div className="zBrand" aria-label="Brand">
            <span className="zBrand__mark">Z</span>
            <span className="zBrand__text">illow</span>
          </div>

          <nav className="zNav zNav--right" aria-label="Admin actions">
            <span className="zNav__pill" aria-label="Environment">
              Admin
            </span>
            <a className="zNav__link" href="#">
              Settings
            </a>
          </nav>
        </div>
      </header>

      <main className="zContent">
        <div className="zAdmin">
          <section className="zAdmin__left" aria-label="Process details">
            <div className="zAdminPanel">
              <div className="zAdminPanel__header">
                <div>
                  <div className="zAdminPanel__title">Headless Browser</div>
                  <div className="zAdminPanel__subtitle">
                    {selected ? selected.currentStep : "Select a process"}
                  </div>
                </div>

                {selected ? (
                  <div className="zMetaRow" aria-label="Process meta">
                    <span className={`zBadge zBadge--${selected.status}`}>
                      {statusLabel(selected.status)}
                    </span>
                    <span className="zMetaText">
                      Started {formatWhen(selected.startedAt)}
                    </span>
                  </div>
                ) : null}
              </div>

              <div
                className="zAdminPreview"
                role="img"
                aria-label="Browser preview"
              >
                {selected ? (
                  <div className="zAdminPreview__inner">
                    {selected.screenshotDataUrl || selected.screenshotUrl ? (
                      <img
                        className="zAdminPreview__img"
                        src={
                          selected.screenshotDataUrl ?? selected.screenshotUrl
                        }
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <div className="zAdminPreview__hint">
                        Screenshot/stream placeholder
                      </div>
                    )}
                    <div className="zAdminPreview__meta">
                      <div className="zAdminPreview__url" title={selected.url}>
                        {selected.url}
                      </div>
                      <div className="zAdminPreview__small">
                        {selected.screenshotHint} · scraped{" "}
                        {selected.scrapedCount}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="zAdminPreview__inner">
                    Select a process on the right.
                  </div>
                )}
              </div>
            </div>

            <div className="zAdminPanel zAdminPanel--logs">
              <div className="zAdminPanel__header">
                <div>
                  <div className="zAdminPanel__title">Logs</div>
                  <div className="zAdminPanel__subtitle">
                    {selected ? `Live output for ${selected.id}` : ""}
                  </div>
                </div>

                <div className="zMetaRow">
                  <button
                    className="zSecondaryBtn"
                    type="button"
                    onClick={() => {
                      if (!selected) return;
                      downloadText(
                        `${selected.id}.log`,
                        selected.logs.join("\n") + "\n",
                      );
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>

              <div className="zAdminLogs" aria-label="Logs">
                {selected ? (
                  <pre className="zAdminLogs__pre">
                    {selected.logs.join("\n")}
                  </pre>
                ) : null}
              </div>
            </div>
          </section>

          <aside className="zAdmin__right" aria-label="Processes">
            <div className="zAdminSideHeader">
              <div>
                <div className="zAdminSideHeader__title">Processes</div>
                <div className="zAdminSideHeader__subtitle">
                  Click a card to inspect state, preview, and logs
                </div>
              </div>
              <button className="zSecondaryBtn" type="button">
                New
              </button>
            </div>

            <div className="zAdminSideScroll">
              {processes.map((p) => {
                const isSelected = p.id === selectedId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`zCard zProcCard ${isSelected ? "zCard--selected" : ""}`}
                    onClick={() => setSelectedId(p.id)}
                    aria-pressed={isSelected}
                  >
                    <div className="zProcCard__body">
                      <div className="zProcCard__top">
                        <div className="zProcCard__title">{p.title}</div>
                        <span className={`zBadge zBadge--${p.status}`}>
                          {statusLabel(p.status)}
                        </span>
                      </div>
                      <div className="zProcCard__meta">
                        <span className="zMetaText">{p.currentStep}</span>
                      </div>
                      <div className="zProcCard__meta">
                        <span className="zMetaText">
                          Started {formatWhen(p.startedAt)}
                        </span>
                        <span className="zMetaText">·</span>
                        <span className="zMetaText">
                          {p.scrapedCount} items
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
