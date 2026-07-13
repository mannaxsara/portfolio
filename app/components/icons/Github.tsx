const Github = () => {
    return (  
        <a
            href='https://github.com/mannaxsara'
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 flex items-center justify-center hover:opacity-30 transition"
        >
            <img 
                src="/icons/gh-icon.png"
                alt="github"
                width={32}
                height={32}
                className="object-contain dark:invert dark:brightness-125"
                suppressHydrationWarning
            />
        </a>
    );
}
 
export default Github;