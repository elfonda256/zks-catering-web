import Image from "next/image";
import type { MenuPackage } from "@/data/catering-data";
import { PACKAGE_IMAGES } from "@/data/home-content";
import { CheckCircle2 } from "@/components/icons";
import { formatRupiah } from "./order-form-ui";

interface PackagePickerProps {
  packages: MenuPackage[];
  selectedPrice: number;
  onSelect: (price: number) => void;
  disabled: boolean;
}

/** Photo cards backed by real radio inputs, so the choice works with keyboard and screen readers. */
export function PackagePicker({ packages, selectedPrice, onSelect, disabled }: PackagePickerProps) {
  return (
    <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-3" disabled={disabled}>
      <legend className="sr-only">Paket menu</legend>
      {packages.map((pkg) => {
        const isSelected = pkg.price === selectedPrice;
        const image = PACKAGE_IMAGES[pkg.price];
        return (
          <label
            key={pkg.id}
            className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-[10px] border-2 bg-[#232A2E] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#E07A35] ${
              isSelected ? "border-[#C85A17]" : "border-transparent hover:border-white/30"
            }`}
          >
            <input
              type="radio"
              name="packagePrice"
              value={pkg.price}
              checked={isSelected}
              onChange={() => onSelect(pkg.price)}
              className="sr-only"
            />
            {image && (
              <span className="relative block aspect-[4/3] w-full bg-[#1A1F22]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 18rem, (min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </span>
            )}
            {isSelected && (
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#C85A17] text-white">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Dipilih</span>
              </span>
            )}
            <span className="flex flex-1 flex-col p-5">
              <span className="font-heading text-lg font-extrabold uppercase leading-tight">{pkg.name}</span>
              <span className="mt-2 font-heading text-2xl font-extrabold text-[#E07A35]">
                {formatRupiah(pkg.price)}
                <span className="ml-1 font-text text-sm font-medium normal-case text-white/60">/ porsi</span>
              </span>
              <span className="mt-3 text-sm leading-relaxed text-white/70">{pkg.itemsSummary}</span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
