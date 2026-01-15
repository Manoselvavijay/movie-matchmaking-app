import { signup } from '@/app/login/actions'
import Link from 'next/link'

export default function SignupPage(props: {
    searchParams: Promise<{ error?: string, message?: string }>
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black bg-opacity-90 relative">
            {/* Background Image (Netflix style) */}
            <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/5e16108c-fd30-46de-9bb8-a02ac44ef5a3/58c234a4-9dfc-4577-9dbd-077f7d638202/US-en-20240205-popsignuptwoweeks-perspective_alpha_website_small.jpg')] bg-cover bg-center"></div>
            <div className="absolute inset-0 z-0 bg-black/60"></div>

            {/* Top Nav (Logo only) */}
            <div className="absolute top-0 left-0 w-full p-8 z-20">
                <div className="flex items-center gap-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-red-600 flex items-center justify-center rounded-sm">
                        <span className="text-red-600 font-bold text-xs md:text-sm">MW</span>
                    </div>
                    <span className="text-red-600 font-bold text-2xl md:text-3xl tracking-tighter uppercase">MatchWatch</span>
                </div>
            </div>

            <div className="w-full max-w-[450px] bg-black/75 p-16 rounded-lg relative z-10 shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-8">Sign Up</h1>

                <form className="flex flex-col gap-4">
                    <SearchParamErrorWrapper searchParams={props.searchParams} />

                    <div className="relative">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="peer w-full bg-[#333] rounded px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:bg-[#454545] transition"
                            placeholder="Email"
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs"
                        >
                            Email
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="peer w-full bg-[#333] rounded px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:bg-[#454545] transition"
                            placeholder="Password"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs"
                        >
                            Password
                        </label>
                    </div>

                    <button
                        formAction={signup}
                        className="w-full py-4 mt-6 bg-red-600 rounded text-white font-bold hover:bg-red-700 transition"
                    >
                        Sign Up
                    </button>

                    <div className="mt-4 text-gray-400">
                        Already have an account? <Link href="/login" className="text-white hover:underline">Sign in now</Link>.
                    </div>
                </form>
            </div>
        </div>
    )
}

// Helper to wait for searchParams
async function SearchParamErrorWrapper({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
    const params = await searchParams;
    if (!params.error && !params.message) return null;

    return (
        <div className="mb-4">
            {params.error && (
                <div className="bg-[#e87c03] p-3 rounded text-white text-sm">
                    {params.error}
                </div>
            )}
            {params.message && (
                <div className="bg-green-600 p-3 rounded text-white text-sm">
                    {params.message}
                </div>
            )}
        </div>
    );
}
