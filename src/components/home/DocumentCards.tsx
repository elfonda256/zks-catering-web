import Image from "next/image";
import { FACILITY_DOCUMENTS } from "@/data/home-content";
import { CONTAINER, HEADING, PAPER, TITLE_SIZE } from "@/components/site/ui";

/**
 * Facility and legal documents as a horizontally scrollable card row; each card opens the full scan.
 * The one paper chapter of the page: audit evidence reads like a file on a desk.
 */
export default function DocumentCards() {
  return (
    <section id="dokumen" className={`${PAPER} py-20 lg:py-28 reveal-on-scroll`}>
      <div className={CONTAINER}>
        <h2 className={`${HEADING} ${TITLE_SIZE.medium} reveal-title`}>Fasilitas &amp; dokumen resmi</h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-stone-700">
          Bukti fisik dapur, gudang, armada, dan legalitas kami untuk kebutuhan audit vendor. Klik kartu untuk melihat
          dokumen lengkap.
        </p>
      </div>

      <ul className="mt-10 flex gap-6 overflow-x-auto pb-4 pl-6 pr-6 [scrollbar-width:none] sm:pl-10 lg:pl-[max(6.25rem,calc((100vw-90rem)/2+6.25rem))]">
        {FACILITY_DOCUMENTS.map((doc) => (
          <li key={doc.title} className="w-[260px] shrink-0 sm:w-[300px]">
            <a href={doc.image} target="_blank" rel="noreferrer" className="group block">
              <span className="relative block aspect-[243/205] overflow-hidden rounded-[10px] bg-white shadow-[0_1px_2px_rgba(26,31,34,0.06)] ring-1 ring-stone-200">
                <Image
                  src={doc.image}
                  alt={doc.title}
                  fill
                  sizes="300px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-3 py-1 font-heading text-xs font-bold uppercase text-white">
                  {doc.category}
                </span>
              </span>
              <span className="mt-4 block font-heading text-xl font-extrabold uppercase leading-tight group-hover:text-brand-600">
                {doc.title}
              </span>
              <span className="mt-1 block text-[15px] leading-relaxed text-stone-600">{doc.subtitle}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
