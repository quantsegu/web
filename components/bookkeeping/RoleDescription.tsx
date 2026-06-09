import { ROLE_SECTIONS } from '../../lib/bookkeepingTracker';

export default function RoleDescription() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <p className="text-sm text-emerald-900">
          Copy-friendly one-page role description. Use the Weekly tab to confirm daily work for the week, complete
          weekly reviews, and save status updates in the Status log.
        </p>
      </div>

      {ROLE_SECTIONS.map((section) => (
        <section key={section.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-2">{section.title}</h2>
          {'content' in section && (
            <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {section.content.split('\n').map((line, i) => {
                const bold = line.match(/^\*\*(.+?)\*\*(.*)$/);
                if (bold) {
                  return (
                    <p key={i} className="mb-1">
                      <strong>{bold[1]}</strong>
                      {bold[2]}
                    </p>
                  );
                }
                return (
                  <p key={i} className="mb-1">
                    {line}
                  </p>
                );
              })}
            </div>
          )}
          {'bullets' in section && (
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
