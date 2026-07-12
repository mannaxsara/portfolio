import Button from "../components/Button";
import Image from "next/image";

const About = () => {
    return (  
        <div className="min-h-screen max-w-2xl mx-auto px-4 flex flex-col items-center py-20">
            <h1 className="font-jersey font-bold text-5xl py-12">About Me</h1>
            <div className="flex flex-col justify-center leading-relaxed text-center font-pixelify gap-5">
                <p>Hi there! I'm Manna — a Computer Science student at St. Vincent Pallotti College of Engineering, Nagpur, and I absolutely love building things that sit at the intersection of code, data, and real-world impact 💻🌱</p>
                <p>My journey so far has taken me from wiring up IoT microcontrollers in the RLabs cyber-physical systems lab at IIIT Hyderabad, to crunching industrial datasets and building time-series forecasting models as a trainee data analyst at the SAIL Bhilai Steel Plant. I also lead event technology for our college's ACM student chapter — which basically means I'm the person making sure the registration portals don't crash on event day 😅</p>
                <p>When I'm not debugging WebSocket connections or writing SQL queries, you'll probably find me exploring new frameworks, geeking out over clean dashboards, or brainstorming ways to make tech more accessible for everyone around me. I believe the best software is built with empathy, curiosity, and maybe a little bit of chaos ✨</p>
                <p>Want the full picture? Check out my dashboard — it's basically my digital personality card!</p>
            </div>
            <Image src="/manna-avatar.png" alt="Manna Sara Bilu" width={200} height={300} className="object-contain mt-6 filter drop-shadow-[4px_4px_0px_#634A45] animate-pixel-float"/>
            <a href="/dashboard" className="flex justify-center text-center font-jersey text-2xl mt-6">
                <Button
                    text="Dashboard"
                />
            </a>
        </div>
    );
}

export default About;