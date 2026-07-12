const Insta = () => {
    return (  
        <a
            href='https://www.instagram.com/mannaxsara/'
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 flex items-center justify-center hover:opacity-30 transition"
        >
            <img 
                src="/icons/ig-icon.png"
                alt="instagram"
                width={32}
                height={32}
                className="object-contain dark:invert dark:brightness-125"
                suppressHydrationWarning
            />
        </a>
    );
}
 
export default Insta;