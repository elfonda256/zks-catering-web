import Link from "next/link";
import { MENU_PACKAGES } from "@/data/catering-data";
import { PACKAGE_IMAGES } from "@/data/home-content";
import PhotoCard, { PHOTO_CARD_FRAME } from "@/components/site/PhotoCard";
import { CANVAS, CONTAINER, HEADING, TITLE_SIZE, TextLink } from "@/components/site/ui";

export default function PackageCards() {
  return (
    <section id="paket" className={`${CANVAS} pb-20 lg:pb-28 reveal-on-scroll`}>
      <div className={CONTAINER}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className={`${HEADING} ${TITLE_SIZE.medium} reveal-title`}>Paket katering harian</h2>
          <TextLink href="/menu">Lihat semua menu</TextLink>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(MENU_PACKAGES).map((pkg, index) => (
            <li key={pkg.id} className={`reveal-fade-up stagger-${index + 1}`}>
              <Link href={`/menu?paket=${pkg.price}`} className={PHOTO_CARD_FRAME}>
                <PhotoCard
                  image={PACKAGE_IMAGES[pkg.price]}
                  tag={`Rp${pkg.price.toLocaleString("id-ID")} / porsi`}
                  title={pkg.name}
                  description={pkg.description}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
