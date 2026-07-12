const Github = () => {
    return (  
        <a
            href='https://github.com/Chaitanyahoon'
            target="_blank" 
            rel="noopener noreferrer" 
        >
            <img 
                src="/icons/github.png"
                alt="github"
                width={32}
                height={32}
                className="hover:opacity-30 transition"
                suppressHydrationWarning
            />
        </a>
    );
}
 
export default Github;