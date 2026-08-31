import logo from "@/assets/moon-club-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function MoonLogo({ className }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Logo de Moon Club"
      className={cn("select-none object-contain", className)}
      draggable={false}
    />
  );
}
