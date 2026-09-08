import type { Resource, SkillFile } from "@prisma/client";
import CopyButton from "./CopyButton";

export default function ResourceSection({
  catalog,
  templates,
  skillFiles,
}: {
  catalog: Resource[];
  templates: Resource[];
  skillFiles: SkillFile[];
}) {
  if (catalog.length === 0 && templates.length === 0 && skillFiles.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 flex flex-col gap-10 border-t border-white/10 pt-10">
      {catalog.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Catálogo de servicios</h2>
          <div className="mt-4 flex flex-col gap-4">
            {catalog.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border-l-4 border-accent bg-card p-5 transition hover:shadow-glow"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-text-primary">{item.title}</h3>
                  {item.price_range && (
                    <span className="flex-none whitespace-nowrap text-sm font-semibold text-accent">
                      {item.price_range}
                    </span>
                  )}
                </div>
                <div
                  className="prose-content mt-3 text-sm text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: item.content_html }}
                />
                <div className="mt-4">
                  <CopyButton html={item.content_html} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {templates.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Plantillas</h2>
          <div className="mt-4 flex flex-col gap-4">
            {templates.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border-l-4 border-accent bg-card p-5 transition hover:shadow-glow"
              >
                <h3 className="font-medium text-text-primary">{item.title}</h3>
                <div
                  className="prose-content mt-3 text-sm text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: item.content_html }}
                />
                <div className="mt-4">
                  <CopyButton html={item.content_html} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillFiles.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Skill</h2>
          <div className="mt-4 flex flex-col gap-4">
            {skillFiles.map((skill) => (
              <div
                key={skill.id}
                className="rounded-xl border-l-4 border-accent bg-card p-5 transition hover:shadow-glow"
              >
                <h3 className="font-medium text-text-primary">{skill.title}</h3>
                <div
                  className="prose-content mt-3 text-sm text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: skill.instructions_html }}
                />
                <a
                  href={skill.download_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-white hover:shadow-glow"
                >
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
