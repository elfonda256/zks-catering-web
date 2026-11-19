import Image from "next/image";
import { HEADING } from "./ui";

/** Wrapper classes for a link or button that holds a PhotoCard. */
export const PHOTO_CARD_FRAME =
  "group relative block aspect-[300/316] w-full overflow-hidden rounded-[10px] text-left text-white focus-visible:outline-2 focus-visible:outline-offset-4";

interface PhotoCardProps {
  image: { src: string; alt: string };
  tag: string;
  title: string;
  description?: string;
  selected?: boolean;
}

/** Full-bleed photo card with a small tag top-left and the title over a dark gradient. */
export default function PhotoCard({ image, tag, title, description, selected = false }: PhotoCardProps) {
  return (
    <>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <span
        className="absolute inset-0 bg-gradient-to-t from-[#1A1F22] via-[#1A1F22]/55 to-transparent"
        aria-hidden="true"
      />
      {selected && <span className="absolute inset-0 rounded-[10px] ring-4 ring-inset ring-[#C85A17]" aria-hidden="true" />}

      <span className="absolute left-4 top-4 rounded-full bg-[#C85A17] px-3 py-1 font-heading text-xs font-bold uppercase">
        {tag}
      </span>

      <span className="absolute inset-x-0 bottom-0 block p-5 sm:p-6">
        <span className={`${HEADING} block text-[1.75rem] sm:text-[2rem]`}>{title}</span>
        {description && <span className="mt-2 block text-sm leading-relaxed text-white/80 line-clamp-3">{description}</span>}
      </span>
    </>
  );
}
