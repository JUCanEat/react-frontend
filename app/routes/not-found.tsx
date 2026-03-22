import { TopBar } from "~/components/shared/top_bar";
import { BottomNav } from "~/components/shared/bottom_nav";

const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
    delay: `${Math.random() * 4}s`,
    duration: `${Math.random() * 3 + 2}s`,
}));

export default function NotFound() {
    return (
        <div className="flex flex-col h-screen w-full dark:bg-zinc-950" style={{ overflow: "hidden" }}>
            <TopBar isLoginPage={false} />

            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
                {stars.map(star => (
                    <div
                        key={star.id}
                        style={{
                            position: "absolute",
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            borderRadius: "50%",
                            backgroundColor: "white",
                            opacity: 0.8,
                            animation: `twinkle ${star.duration} ${star.delay} infinite alternate`,
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes twinkle {
                    from { opacity: 0.1; }
                    to { opacity: 0.9; }
                }
                @keyframes float {
                    0%   { transform: translateY(0px) rotate(-10deg); }
                    50%  { transform: translateY(-18px) rotate(10deg); }
                    100% { transform: translateY(0px) rotate(-10deg); }
                }
            `}</style>

            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6" style={{ position: "relative", zIndex: 1 }}>

                <div style={{ fontSize: "72px", animation: "float 4s ease-in-out infinite" }}>
                    🧑‍🚀
                </div>

                <p className="text-8xl font-bold mt-2" style={{ color: "#009DE0" }}>404</p>
                <p className="text-xl font-semibold text-white">Lost in space</p>
                <p className="text-sm text-white opacity-50 text-center">
                    This page doesn't exist. Let's get you back to Earth.
                </p>

                <button
                    className="mt-4 px-8 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: "#009DE0" }}
                    onClick={() => window.location.href = "/"}
                >
                    Go to home
                </button>
            </div>

            <BottomNav page={"overview"} />
        </div>
    );
}
