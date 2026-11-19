import { WORKFLOW_STAGES } from "@/data/home-content";
import { DISPLAY, LABEL, SectionHeading } from "./ui";

export default function WorkflowSection() {
  return (
    <section id="alur-produksi" className="bg-[#141413] py-24 text-white sm:py-32 reveal-on-scroll">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Alur produksi"
          title="Tujuh tahap, satu arah"
          lead="Setiap porsi melewati alur kerja satu arah (one-way flow) agar nutrisi, rasa, dan sanitasi tetap konsisten dari bahan masuk sampai serah terima di kantin."
        />

        <ol className="mt-16 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {WORKFLOW_STAGES.map((stage, index) => (
            <li key={stage.title} className={`border-t-2 border-[#C85A17] pt-5 reveal-fade-up stagger-${index + 1}`}>
              <span className={`${DISPLAY} block text-5xl text-white/25`}>{String(index + 1).padStart(2, "0")}</span>
              {/* Two-line minimum keeps every description starting on the same baseline */}
              <h3 className={`${LABEL} mt-3 text-xl xl:min-h-[2lh]`}>{stage.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-white/60">{stage.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
