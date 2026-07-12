"use client";

import { useState } from "react";
import { TextArea, Button, Input } from "pixel-retroui";
import Github from "../components/icons/Github";
import Linkedin from "../components/icons/Linkedin";
import Insta from "../components/icons/Insta";
import Email from "../components/icons/Email";
import ScrollReveal from "../components/ScrollReveal";

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
            <ScrollReveal>
                <h1 className="font-jersey text-4xl sm:text-6xl md:text-8xl uppercase tracking-[0.12em] text-text-base text-center py-6">
                    ✦ Contact Me ✦
                </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
                <p className="font-pixelify text-center leading-relaxed mb-8 text-text-base/90">
                    Hey, thanks for scrolling all the way down here! Whether you want to chat about data pipelines, collaborate on a project, or just say hi — my inbox is always open. I&apos;d love to hear from you! 💌🌸
                </p>
            </ScrollReveal>

            {/* Retro form container */}
            <ScrollReveal delay={0.2} className="w-full max-w-lg">
                <form onSubmit={handleSubmit} className="w-full font-pixelify bg-bg-alt border-4 border-border-accent shadow-[6px_6px_0px_var(--shadow-color)] p-6 mb-12 flex flex-col gap-4 text-text-base">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-text-muted tracking-widest uppercase font-bold">Name</label>
                        <Input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="your name..." 
                            bg="var(--bg-base)"
                            textColor="var(--text-base)"
                            borderColor="var(--border-accent)"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-text-muted tracking-widest uppercase font-bold">Email</label>
                        <Input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your email..." 
                            bg="var(--bg-base)"
                            textColor="var(--text-base)"
                            borderColor="var(--border-accent)"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-text-muted tracking-widest uppercase font-bold">Message</label>
                        <TextArea 
                            placeholder="write your message here..." 
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            bg="var(--bg-base)"
                            textColor="var(--text-base)"
                            borderColor="var(--border-accent)"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full text-base tracking-widest uppercase py-2.5 px-4 cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                        style={{
                          backgroundColor: "var(--highlight-color)",
                          color: "var(--bg-base)",
                          borderColor: "var(--border-accent)",
                          borderWidth: "4px",
                          borderStyle: "solid",
                          boxShadow: "4px 4px 0px var(--shadow-color)",
                          fontFamily: "var(--font-jersey)",
                        }}
                    >
                        {submitting ? "SENDING..." : "✦ SEND MESSAGE"}
                    </button>

                    {sent && (
                        <p className="text-xs text-border-accent text-center tracking-widest animate-pulse mt-2">
                            ✦ Message sent successfully! ✦
                        </p>
                    )}
                </form>
            </ScrollReveal>

            {/* Social links */}
            <ScrollReveal delay={0.3}>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                    <Linkedin />
                    <Github />
                    <Insta />
                    <Email />
                </div>
            </ScrollReveal>
        </div>
    );
}

export default Contact;