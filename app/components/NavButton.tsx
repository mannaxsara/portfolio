import ScrollLink from "./ScrollLink";

interface NavButtonProps {
  href: string;
  children: React.ReactNode;
}

const NavButton = ({ href, children }: NavButtonProps) => {
  return (
    <ScrollLink
      href={href}
      className="relative px-3 py-1 font-pixelify text-text-base border-2 border-transparent 
                 hover:border-border-accent hover:bg-highlight-color hover:text-white hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--shadow-color)]
                 active:translate-y-0 active:shadow-none
                 transition-all duration-200 ease-out"
    >
      {children}
    </ScrollLink>
  );
};

export default NavButton;