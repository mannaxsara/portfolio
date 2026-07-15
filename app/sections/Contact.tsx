"use client";

import { useState } from "react";
import { TextArea, Input } from "pixel-retroui";
import Github from "../components/icons/Github";
import Linkedin from "../components/icons/Linkedin";
import Insta from "../components/icons/Insta";
import Email from "../components/icons/Email";
import ScrollReveal from "../components/ScrollReveal";
import SectionHeading from "../components/SectionHeading";
import { supabase } from "../../lib/supabaseClient";

const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!name.trim() || !email.trim() || !message.trim()) {
            setErrorMsg("✕ Please fill in all fields.");
            return;
        }

        // Email address format validation check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setErrorMsg("✕ Please enter a valid email address.");
            return;
        }

        setSubmitting(true);

        const isPlaceholder =
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project");

        if (isPlaceholder) {
            // Simulated local database insertion for local testing
            setTimeout(() => {
                setSubmitting(false);
                setSent(true);
                setName("");
                setEmail("");
                setMessage("");
                setTimeout(() => setSent(false), 3000);
            }, 1000);
            return;
        }

        try {
            const { error } = await supabase
                .schema("SyePhasuk")
                .from("ContactMessages")
                .insert([
                    {
                        name: name.trim(),
                        email: email.trim(),
                        message: message.trim(),
                    },
                ]);

            if (error) {
                console.error("Supabase contact insert error:", error);
                setErrorMsg("✕ Failed to send message. Please try again later.");
            } else {
                setSent(true);
                setName("");
                setEmail("");
                setMessage("");
                setTimeout(() => setSent(false), 4000);
            }
        } catch (err) {
            console.error("Supabase insert exception:", err);
            setErrorMsg("✕ A network error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (  
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center pb-32 pt-10">
            <ScrollReveal>
                <SectionHeading subtitle="Hey, thanks for scrolling all the way down here! Whether you want to chat about data pipelines, collaborate on a project, or just say hi — my inbox is always open. I'd love to hear from you!">
                    Contact Me
                </SectionHeading>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="w-full max-w-lg">
                <form onSubmit={handleSubmit} className="w-full font-body cute-panel p-6 mb-12 flex flex-col gap-4 text-text-base">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-base text-text-base tracking-widest uppercase font-bold">♡ Name</label>
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
                        <label className="text-base text-text-base tracking-widest uppercase font-bold">♡ Email</label>
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
                        <label className="text-base text-text-base tracking-widest uppercase font-bold">♡ Message</label>
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
                          color: "var(--cream)",
                          borderColor: "var(--border-accent)",
                          borderWidth: "3px",
                          borderStyle: "solid",
                          boxShadow: "4px 4px 0px var(--shadow-color)",
                          fontFamily: "var(--font-jersey)",
                        }}
                    >
                        {submitting ? "SENDING..." : "♡ SEND MESSAGE"}
                    </button>

                    {sent && (
                        <p className="text-sm text-highlight-color text-center tracking-widest animate-pulse mt-2 font-semibold">
                            ♡ Message sent successfully! ♡
                        </p>
                    )}

                    {errorMsg && (
                        <p className="text-sm text-red-500 font-bold text-center tracking-widest mt-2 animate-pulse">
                            {errorMsg}
                        </p>
                    )}
                </form>
            </ScrollReveal>

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
