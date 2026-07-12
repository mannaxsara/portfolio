const Footer = () => {
  return (  
    <footer className="font-pixelify text-sm text-mauve-brown flex flex-col justify-center items-center bg-light-pink py-4 border-t-4 border-rosewood gap-1">
      <p>made with 💖 and way too much coffee by manna</p>
      <p className="text-[10px] opacity-60">© {new Date().getFullYear()} Manna Sara Bilu. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
