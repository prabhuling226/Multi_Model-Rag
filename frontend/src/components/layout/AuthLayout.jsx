import Logo from "../common/Logo";

function AuthLayout({ children }) {

    return (

        <div className="min-h-screen bg-[#F7F2EB]">

            <div className="grid grid-cols-2 min-h-screen">

                {/* LEFT PANEL */}

                <div className="bg-[#25211E] text-white flex flex-col justify-center px-20">

                    <Logo />

                    <h1 className="text-6xl font-bold mt-12 leading-tight">

                        Knowledge
                        <br />
                        Meets
                        <br />
                        Intelligence

                    </h1>

                    <p className="mt-8 text-lg text-gray-300 leading-8">

                        Upload documents.

                        Search instantly.

                        Chat with your enterprise knowledge using AI.

                    </p>

                </div>

                {/* RIGHT PANEL */}

                <div className="flex items-center justify-center">

                    <div className="w-[420px]">

                        {children}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AuthLayout;