export default function Loading() {
  return (
    <div className="min-h-screen bg-plum-brown text-light-pink flex items-center justify-center p-4 font-poppins">
      <div className="flex flex-col items-center gap-6">
        
        {/* Loading Spinner */}
        <div className="relative w-16 h-16 border-4 border-rosewood bg-plum-brown flex items-center justify-center animate-spin">
          <span className="w-4 h-4 bg-raspberry"></span>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl tracking-widest font-jersey text-light-pink uppercase animate-pulse">
            loading.sys
          </p>
          <div className="flex gap-1.5 text-raspberry text-[10px] animate-pulse">
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>
        </div>
      </div>
    </div>
  );
}
