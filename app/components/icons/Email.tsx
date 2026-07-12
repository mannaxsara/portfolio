const Email = () => {
    return (  
        <a
            href="mailto:mannasarabilu@gmail.com"
            className="w-[36px] h-8 flex items-center justify-center hover:opacity-30 transition"
            title="Email"
        >
            <img 
                src="/icons/mail-icon.png"
                alt="Email"
                width={36}
                height={32}
                className="object-contain dark:invert dark:brightness-125"
                suppressHydrationWarning
            />
        </a>
    );
}
 
export default Email;
