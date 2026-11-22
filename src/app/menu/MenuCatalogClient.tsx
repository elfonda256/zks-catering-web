"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MENU_PACKAGES } from "@/data/catering-data";
import { ORDER_TERMS, PACKAGE_IMAGES, PORTION_SPEC, buildWhatsAppUrl } from "@/data/home-content";
import PhotoCard, { PHOTO_CARD_FRAME } from "@/components/site/PhotoCard";
import { ButtonLink, CONTAINER, HEADING, PAPER, RuledEyebrow, TITLE_SIZE, TextLink } from "@/components/site/ui";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;
type Day = (typeof DAYS)[number];

const PACKAGE_PRICES = Object.values(MENU_PACKAGES).map((pkg) => pkg.price);

const formatPrice = (price: number) => `Rp${price.toLocaleString("id-ID")}`;

export default function MenuCatalogClient() {
  const searchParams = useSearchParams();
  const requested = Number(searchParams.get("paket"));
  const [selectedPrice, setSelectedPrice] = useState(PACKAGE_PRICES.includes(requested) ? requested : PACKAGE_PRICES[0]);
  const [selectedDay, setSelectedDay] = useState<Day>("Senin");

  const currentPackage = MENU_PACKAGES[selectedPrice];
  const variations = currentPackage.schedule[selectedDay] ?? [];
  const orderHref = `/pesan?paket=${selectedPrice}`;
  const whatsAppHref = buildWhatsAppUrl(
    `Halo PT Zahdan Kamal Sentosa, kami tertarik dengan ${currentPackage.name} (${formatPrice(currentPackage.price)}) untuk hari ${selectedDay}.`
  );

  return (
    <>
      <section className={`${CONTAINER} pt-8 lg:pt-12`} aria-labelledby="pilih-paket">
        <h2 id="pilih-paket" className={`${HEADING} ${TITLE_SIZE.medium}`}>
          Pilih paket
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(MENU_PACKAGES).map((pkg) => {
            const isSelected = pkg.price === selectedPrice;
            return (
              <li key={pkg.id}>
                <button
                  type="button"
                  onClick={() => setSelectedPrice(pkg.price)}
                  aria-pressed={isSelected}
                  className={`${PHOTO_CARD_FRAME} cursor-pointer`}
                >
                  <PhotoCard
                    image={PACKAGE_IMAGES[pkg.price]}
                    tag={isSelected ? `Dipilih · ${formatPrice(pkg.price)}` : `${formatPrice(pkg.price)} / porsi`}
                    title={pkg.name}
                    description={pkg.description}
                    selected={isSelected}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="paket-terpilih">
        <div className="pl-6 sm:pl-10 lg:pl-[max(6.25rem,calc((100vw-90rem)/2+6.25rem))]">
          <RuledEyebrow>Paket terpilih</RuledEyebrow>
        </div>

        <div className={`${CONTAINER} mt-10 grid gap-12 lg:grid-cols-12`}>
          <div className="lg:col-span-6">
            <h2 id="paket-terpilih" className={`${HEADING} ${TITLE_SIZE.large}`}>
              {currentPackage.name}
            </h2>
            <p className={`${HEADING} mt-4 text-4xl text-brand-300`}>
              {formatPrice(currentPackage.price)}
              <span className="ml-2 font-text text-lg font-medium normal-case text-white/70">per porsi</span>
            </p>
            <p className="mt-6 text-[17px] leading-[1.7] text-white/85">{currentPackage.itemsSummary}</p>
            <p className="mt-3 text-[15px] text-white/70">Cocok untuk: {currentPackage.idealFor}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={orderHref}>Pesan paket ini</ButtonLink>
              <ButtonLink href={whatsAppHref} variant="outline">
                Tanya via WhatsApp
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[10px] bg-ink-soft p-8 lg:col-span-5 lg:col-start-8">
            <h3 className="font-heading text-xl font-extrabold uppercase">Standar porsi</h3>
            <dl className="mt-5 divide-y divide-white/10">
              {PORTION_SPEC.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-[15px] text-white/80">{row.label}</dt>
                  <dd className="font-heading text-lg font-bold">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className={`${CONTAINER} pb-20 lg:pb-28`} aria-labelledby="menu-harian">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="menu-harian" className={`${HEADING} ${TITLE_SIZE.medium}`}>
            Menu hari {selectedDay}
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih hari">
            {DAYS.map((day) => {
              const isActive = day === selectedDay;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  aria-pressed={isActive}
                  className={`min-h-11 cursor-pointer rounded-full px-5 font-heading text-sm font-bold uppercase transition-colors ${
                    isActive ? "bg-brand-600 text-white" : "border-2 border-white/30 text-white hover:border-white"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {variations.map((items, index) => (
            <li key={`${selectedDay}-${index}`} className="flex flex-col rounded-[10px] bg-ink-soft p-7 museum-fade-enter">
              <span className="font-heading text-sm font-bold uppercase text-brand-300">Pilihan {index + 1}</span>
              <h3 className="mt-1 font-heading text-[1.75rem] font-extrabold uppercase leading-tight">{items[1]}</h3>
              <ul className="mt-5 grid flex-1 grid-cols-2 gap-x-6 gap-y-2 text-[15px] text-white/80">
                {items.map((item, itemIndex) => (
                  <li key={`${itemIndex}-${item}`} className={itemIndex === 1 ? "font-semibold text-white" : undefined}>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <TextLink href={orderHref}>Pesan pilihan ini</TextLink>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Paper chapter: the terms read like the contract they summarise. */}
      <section className={`${PAPER} py-20 lg:py-28`} aria-labelledby="ketentuan">
        <div className={CONTAINER}>
          <h2 id="ketentuan" className={`${HEADING} ${TITLE_SIZE.medium}`}>
            Ketentuan pemesanan
          </h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {ORDER_TERMS.map((term) => (
              <li key={term.title} className="border-t-4 border-brand-500 pt-6">
                <h3 className="font-heading text-xl font-extrabold uppercase">{term.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-stone-700">{term.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
