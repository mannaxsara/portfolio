"use client";

import { useState } from "react";
import { TextArea } from "pixel-retroui";
import Github from "../components/icons/Github";
import Linkedin from "../components/icons/Linkedin";

const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) return;

        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSent(true);
            setName("");
            setEmail("");
            setMessage("");
            setTimeout(() => setSent(false), 3000);
        }, 1500);
    };

    return (  
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center pb-32">
            <h1 className="font-jersey font-bold text-5xl py-12">Contact Me</h1>
            <p className="font-pixelify text-center leading-relaxed mb-8">
                Hey, thanks for scrolling all the way down here! Whether you want to chat about data pipelines, collaborate on a project, or just say hi — my inbox is always open. I'd love to hear from you! 💌🌸
            </p>

            {/* Retro form container */}
            <form onSubmit={handleSubmit} className="w-full max-w-lg font-pixelify bg-light-pink border-4 border-rosewood shadow-[6px_6px_0px_#412722] p-6 mb-12 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-mauve-brown tracking-widest uppercase">Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="your name..." 
                        className="border-2 border-mauve-brown bg-[#fdf0f4] px-3 py-2 text-xs focus:outline-none focus:border-raspberry"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-mauve-brown tracking-widest uppercase">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your email..." 
                        className="border-2 border-mauve-brown bg-[#fdf0f4] px-3 py-2 text-xs focus:outline-none focus:border-raspberry"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-mauve-brown tracking-widest uppercase">Message</label>
                    <TextArea 
                        placeholder="write your message here..." 
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-rosewood text-light-pink text-sm tracking-widest border-2 border-rosewood shadow-[2px_2px_0px_#412722] hover:bg-raspberry hover:border-raspberry active:translate-y-px active:shadow-none transition-all disabled:opacity-50 mt-2"
                >
                    {submitting ? "SENDING..." : "✦ SEND MESSAGE"}
                </button>

                {sent && (
                    <p className="text-xs text-raspberry text-center tracking-widest animate-pulse mt-2">
                        ✦ Message sent successfully! ✦
                    </p>
                )}
            </form>

            {/* Social links */}
            <div className="flex flex-wrap gap-5 items-center justify-center">
                <Linkedin/>
                <Github/>
                <a href="mailto:mannasarabilu@gmail.com" className="hover:opacity-30 transition flex items-center justify-center w-[32px] h-[32px]" title="Email">
                    <svg className="w-7 h-7 text-mauve-brown" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

export default Contact;