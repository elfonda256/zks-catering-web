import Image from "next/image";
import type { ReactNode } from "react";
import { CANVAS, HEADING, RuledEyebrow, TITLE_SIZE } from "./ui";

/** Left offset that lines content up with CONTAINER while letting the row reach the viewport edge. */
const EDGE_LEFT = "pl-6 sm:pl-10 lg:pl-[max(6.25rem,calc((100vw-90rem)/2+6.25rem))]";
const EDGE_RIGHT = "pr-6 sm:pr-10 lg:pr-[max(6.25rem,calc((100vw-90rem)/2+6.25rem))]";

interface SplitFeatureProps {
  id?: string;
  imageSide: "left" | "right";
  image: { src: string; alt: string };
  eyebrow: string;
  title: string;
  children: ReactNode;
}

/**
 * Photo bleeding to one viewport edge with a single large rounded inner corner, title and copy beside it,
 * and a ruled eyebrow running across both.
 */
export default function SplitFeature({ id, imageSide, image, eyebrow, title, children }: SplitFeatureProps) {
  const imageLeft = imageSide === "left";

  return (
    <section id={id} className={`${CANVAS} py-20 lg:py-28 reveal-on-scroll`}>
      <div className={EDGE_LEFT}>
        <RuledEyebrow>{eyebrow}</RuledEyebrow>
      </div>

      <div className="mt-6 grid items-center gap-10 lg:mt-0 lg:grid-cols-2 lg:gap-0">
        <div
          className={`relative aspect-[641/504] w-full overflow-hidden reveal-image ${
            imageLeft ? "lg:rounded-br-[4.375rem]" : "lg:order-2 lg:rounded-bl-[4.375rem]"
          }`}
        >
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>

        <div className={imageLeft ? `pl-6 sm:pl-10 lg:pl-16 xl:pl-24 ${EDGE_RIGHT}` : `${EDGE_LEFT} pr-6 sm:pr-10 lg:pr-16 xl:pr-24`}>
          <h2 className={`${HEADING} ${TITLE_SIZE.large} reveal-title`}>{title}</h2>
          <div className="mt-6 space-y-5 text-[17px] leading-[1.7] text-white/85 reveal-paragraph">{children}</div>
        </div>
      </div>
    </section>
  );
}
