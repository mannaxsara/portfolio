import Image from "next/image";

const Insta = () => {
    return (  
        <a
            href='https://www.instagram.com/mannaxsara/'
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 flex items-center justify-center hover:opacity-30 transition"
        >
            <Image 
                src="/icons/ig-icon.png"
                alt="instagram"
                width={32}
                height={32}
                className="object-contain dark:invert dark:brightness-125"
            />
        </a>
    );
}
 
export default Insta;