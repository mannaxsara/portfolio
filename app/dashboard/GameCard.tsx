import Image from "next/image";
import PixelIcon from "../components/PixelIcon";

const GameCard = () => {
  return (
    <div className="cute-card overflow-hidden font-body">
      <div className="flex gap-1.5 justify-between items-center px-3 py-1.5 bg-border-accent">
        <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5">
          <PixelIcon name="star" solid size={11} />
          games.exe
        </span>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 bg-cream border border-white/30" />
          <span className="w-2.5 h-2.5 bg-blush border border-white/30" />
          <span className="w-2.5 h-2.5 bg-raspberry border border-white/30" />
        </div>
      </div>
      <div className="p-4">
        <h2 className="pixel-heading font-jersey text-2xl mb-3 text-highlight-color uppercase">Games Played</h2>
        <div className="border-b-2 border-border-accent py-2">
          <h3 className="font-bold text-text-base">League of Legends</h3>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <p className="text-sm text-text-muted mb-1">Main:</p>
              <Image
                src="/manna-avatar-heart.png"
                alt="main champion"
                width={200}
                height={100}
                className="object-cover w-full h-auto border-2 border-border-accent"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div>
              <p className="text-sm text-text-muted mb-1">Favourite skin:</p>
              <Image
                src="/manna-avatar-heart.png"
                alt="favourite skin"
                width={200}
                height={100}
                className="object-cover w-full h-auto border-2 border-border-accent"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
        </div>
        <div className="py-2">
          <h3 className="font-bold text-text-base">Minecraft</h3>
          <p className="text-sm text-text-muted inline-flex items-center gap-1.5">
            A collection of houses I&apos;ve built
            <PixelIcon name="sparkles" size={12} className="text-highlight-color" />
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Image
              src="/mc1.png"
              alt="Minecraft build"
              width={120}
              height={80}
              className="object-cover border-2 border-border-accent h-auto w-auto"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              src="/mc2.png"
              alt="Minecraft base"
              width={120}
              height={80}
              className="object-cover border-2 border-border-accent h-auto w-auto"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              src="/mc3.png"
              alt="Minecraft base"
              width={120}
              height={80}
              className="object-cover border-2 border-border-accent h-auto w-auto"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              src="/mc4.png"
              alt="Minecraft base"
              width={120}
              height={80}
              className="object-cover border-2 border-border-accent h-auto w-auto"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
