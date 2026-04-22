import { Link } from 'react-router-dom'
import { FirebaseSetupHelp } from '@/components/shared/firebase-setup-help'

export function MarketingFooter({ firebaseEnabled }: { firebaseEnabled: boolean }) {
  return (
    <footer className="border-t border-[#EAEAEA] bg-[#FAFAFA] py-14 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 md:grid-cols-4 md:px-6">
        <div>
          <h3 className="text-sm font-bold text-[#252B42]">Spendly</h3>
          <p className="mt-2 text-xs font-medium leading-relaxed text-[#737373]">
            A modern personal finance workspace: start privately in your browser, then upgrade to encrypted cloud sync,
            backups, and multi-device access when you are ready.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#252B42]">Explore</h3>
          <ul className="mt-2 space-y-1.5 text-xs font-medium text-[#737373]">
            <li>
              <a href="#features" className="hover:text-[#23A6F0]">
                Features
              </a>
            </li>
            <li>
              <a href="#devices" className="hover:text-[#23A6F0]">
                Devices
              </a>
            </li>
            <li>
              <a href="#demo" className="hover:text-[#23A6F0]">
                Platform preview
              </a>
            </li>
            <li>
              <a href="#cta" className="hover:text-[#23A6F0]">
                Get started
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#252B42]">Product</h3>
          <ul className="mt-2 space-y-1.5 text-xs font-medium text-[#737373]">
            <li>Categorized transactions & notes</li>
            <li>Goal-based savings allocations</li>
            <li>Trend and category analytics</li>
            <li>Spendly AI for natural-language insight</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#252B42]">Account</h3>
          <ul className="mt-2 space-y-1.5 text-xs font-medium text-[#737373]">
            {firebaseEnabled ? (
              <>
                <li>
                  <Link to="/sign-in" className="hover:text-[#23A6F0]">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/sign-up" className="hover:text-[#23A6F0]">
                    Create account
                  </Link>
                </li>
              </>
            ) : (
              <li className="text-[11px] leading-relaxed">Cloud sign-in requires Firebase environment configuration.</li>
            )}
          </ul>
          {!firebaseEnabled ? (
            <div className="mt-3 rounded-md border border-[#E0E0E0] bg-white p-3">
              <FirebaseSetupHelp className="text-[10px] leading-relaxed" />
            </div>
          ) : null}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-[#E5E5E5] px-4 pt-6 text-center text-[10px] font-semibold text-[#9A9A9A] md:px-6">
        © {new Date().getFullYear()} Spendly
      </div>
    </footer>
  )
}
