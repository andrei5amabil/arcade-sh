// app/auth/page.tsx
import SignUpForm from '@/components/SignUpForm';
import LogInForm from '@/components/LogInForm';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-[#1a1b26] text-[#c0caf5] p-8 font-mono flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#7aa2f7] mb-2 tracking-tighter">ARCADE_OS // AUTH</h1>
          <p className="text-[#565f89] text-sm italic">Enter credentials to join other users.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-[#1f2335] rounded-xl border border-[#414868] shadow-2xl overflow-hidden">
  
        <section className="p-10 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-[#414868]">
            <div className="w-full max-w-sm">
            <h2 className="text-[#9ece6a] mb-8 font-bold text-sm uppercase tracking-tighter flex items-center">
                <span className="mr-2">●</span> New_Session
            </h2>
            <SignUpForm />
            </div>
        </section>

        <section className="p-10 flex flex-col items-center justify-start">
            <div className="w-full max-w-sm">
            <h2 className="text-[#bb9af7] mb-8 font-bold text-sm uppercase tracking-tighter flex items-center">
                <span className="mr-2">○</span> Resume_Session
            </h2>
            <LogInForm />
            </div>
        </section>

        </div>

        <div className="text-center">
          <Link href="/" className="text-[#565f89] hover:text-[#7aa2f7] transition-all text-xs">
            [ ESCAPE_TO_DASHBOARD ]
          </Link>
        </div>
      </div>
    </main>
  );
}