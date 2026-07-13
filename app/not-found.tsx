import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-plum-brown text-light-pink flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-lg bg-light-pink border-4 border-rosewood shadow-[8px_8px_0px_#d489a8] text-plum-brown relative">
        
        {/* Modal titlebar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-rosewood text-light-pink">
          <span className="text-[10px] tracking-widest uppercase opacity-90">404.exe — File Not Found</span>
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 bg-raspberry border border-white/20"></span>
            <span className="w-2.5 h-2.5 bg-mauve-brown border border-white/20"></span>
          </div>
        </div>

        {/* Modal content */}
        <div className="p-8 text-center flex flex-col gap-6 items-center relative">
          {/* Corner L-bracket accents */}
          <span className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-raspberry"></span>
          <span className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-raspberry"></span>
          <span className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-raspberry"></span>
          <span className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-raspberry"></span>

          <h1 className="font-jersey text-6xl text-raspberry mt-4 animate-pulse">404</h1>
          
          <div className="bg-[#fdf0f4] border-2 border-mauve-brown p-4 relative w-full">
            <p className="text-xs text-dark-rose leading-relaxed">
              [ERROR: PAGE_NOT_FOUND]<br/>
              The system cannot find the route specified. It may have been renamed, deleted, or never existed in the first place.
            </p>
          </div>

          <p className="text-xs text-mauve-brown">
            Let&apos;s return to the main dashboard or go back home!
          </p>

          <div className="flex gap-4 font-jersey text-xl mt-2">
            <Link 
              href="/" 
              className="px-5 py-1.5 bg-rosewood text-light-pink border-2 border-rosewood shadow-[3px_3px_0px_#d489a8] hover:bg-raspberry hover:border-raspberry active:translate-y-px active:shadow-none transition-all uppercase"
            >
              Go Home
            </Link>
            <Link 
              href="/dashboard" 
              className="px-5 py-1.5 bg-light-pink border-2 border-rosewood shadow-[3px_3px_0px_#d489a8] hover:bg-[#fce8f0] active:translate-y-px active:shadow-none transition-all uppercase"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
