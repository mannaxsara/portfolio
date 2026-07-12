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
                 hover:border-border-accent hover:bg-raspberry hover:shadow-[4px_4px_0px_var(--shadow-color)] hover:text-light-pink
                 transition-all duration-150"
    >
      {children}
    </ScrollLink>
  );
};

export default NavButton;