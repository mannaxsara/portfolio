import ScrollLink from "./ScrollLink";
import Link from "next/link";
import PixelIcon from "./PixelIcon";

interface NavButtonProps {
  href: string;
  children: React.ReactNode;
  accent?: boolean;
}

const NavButton = ({ href, children, accent = false }: NavButtonProps) => {
  const classes = accent
    ? `relative px-3.5 py-1.5 font-body text-sm sm:text-base font-semibold
       text-cream bg-highlight-color border-2 border-border-accent
       shadow-[2px_2px_0_var(--shadow-color)]
       hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--shadow-color)] hover:bg-raspberry
       active:translate-y-0 active:shadow-none
       transition-all duration-200 ease-out inline-flex items-center gap-1.5`
    : `relative px-3 py-1.5 font-body text-sm sm:text-base text-text-base
       border-2 border-transparent
       hover:border-border-accent hover:bg-cream/80 dark:hover:bg-card-bg
       hover:text-highlight-color hover:-translate-y-0.5
       hover:shadow-[2px_2px_0_var(--shadow-color)]
       active:translate-y-0 active:shadow-none
       transition-all duration-200 ease-out group inline-flex items-center gap-1`;

  const content = accent ? (
    <>
      <PixelIcon name="heart" solid size={12} />
      {children}
    </>
  ) : (
    <>
      <PixelIcon
        name="heart"
        solid
        size={10}
        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-highlight-color"
      />
      {children}
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <ScrollLink href={href} className={classes}>
      {content}
    </ScrollLink>
  );
};

export default NavButton;
