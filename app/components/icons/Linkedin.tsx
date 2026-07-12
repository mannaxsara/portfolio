const Linkedin = () => {
    return (  
        <a
            href='https://www.linkedin.com/in/mannasarabilu/'
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 flex items-center justify-center hover:opacity-30 transition"
        >
            <img 
                src="/icons/ln-icon.png"
                alt="Linkedin"
                width={32}
                height={32}
                className="object-contain dark:invert dark:brightness-125"
                suppressHydrationWarning
            />
        </a>
    );
}
 
export default Linkedin;