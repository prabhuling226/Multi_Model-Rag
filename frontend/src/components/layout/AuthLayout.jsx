import Logo from "../common/Logo";

function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white border border-[#E8E2D5] rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
                {/* LEFT HERO PANEL */}
                <div className="bg-[#2C2A29] text-[#FBF9F5] flex flex-col justify-between p-10 relative overflow-hidden">
                    <div className="z-10">
                        <Logo />
                        <span className="inline-block px-3 py-1 mt-6 text-xs font-semibold tracking-wider uppercase bg-[#3D3A38] text-[#C5A059] rounded-full border border-[#4A4744]">
                            Enterprise RAG AI
                        </span>
                        <h1 className="text-4xl font-extrabold mt-6 leading-tight font-serif tracking-tight text-[#FBF9F5]">
                            Knowledge <br />
                            Meets <br />
                            Precision AI.
                        </h1>
                        <p className="mt-6 text-sm text-[#D8D1C5] leading-relaxed max-w-sm">
                            Seamless document ingestion, vector chunking, and intelligent conversational retrieval powered by FastAPI and Google Gemini.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-[#3D3A38] z-10">
                        <p className="text-xs text-[#8C8782]">
                            © 2026 DocMind RAG System. Production Ready.
                        </p>
                    </div>
                </div>

                {/* RIGHT FORM PANEL */}
                <div className="flex items-center justify-center p-8 bg-[#FBF9F5]">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;