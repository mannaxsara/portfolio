import ScrollLink from "./ScrollLink";

interface NavButtonProps {
  href: string;
  children: React.ReactNode;
}

const NavButton = ({ href, children }: NavButtonProps) => {
  return (
    <ScrollLink
      href={href}
      className="relative px-3 py-1 font-pixelify text-plum-brown border-2 border-transparent 
                 hover:border-rosewood hover:bg-raspberry hover:shadow-[4px_4px_0px_#412722] hover:text-light-pink
                 transition-all duration-150"
    >
      {children}
    </ScrollLink>
  );
};

export default NavButton;