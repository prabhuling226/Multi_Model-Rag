function Logo() {
    return (
        <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#25211E] flex items-center justify-center text-white font-bold text-lg shadow-md">
                R
            </div>

            <div>
                <h2 className="text-2xl font-bold text-[#25211E]">
                    RAG Vault
                </h2>

                <p className="text-sm text-gray-500">
                    Enterprise AI Search
                </p>
            </div>

        </div>
    );
}

export default Logo;