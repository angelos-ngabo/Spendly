import { Link } from 'react-router-dom'
import { FirebaseSetupHelp } from '@/components/shared/firebase-setup-help'

export function MarketingFooter({ firebaseEnabled }: { firebaseEnabled: boolean }) {
  return (
    <footer className="border-t border-[#EAEAEA] bg-[#FAFAFA] py-14 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 md:grid-cols-4 md:px-6">
        <div>
          <h3 className="text-sm font-bold text-[#252B42]">Spendly</h3>
          <p className="mt-2 text-xs font-medium leading-relaxed text-[#737373]">
            Personal finance workspace with local-first guest mode and optional Firebase sync.
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
              <a href="#stories" className="hover:text-[#23A6F0]">
                Stories
              </a>
            </li>
            <li>
              <a href="#demo" className="hover:text-[#23A6F0]">
                Product tour
              </a>
            </li>
            <li>
              <a href="#cta" className="hover:text-[#23A6F0]">
                Workspace
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#252B42]">Product</h3>
          <ul className="mt-2 space-y-1.5 text-xs font-medium text-[#737373]">
            <li>Transactions & categories</li>
            <li>Savings reservations</li>
            <li>Analytics charts</li>
            <li>Spendly AI</li>
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
              <li className="text-[11px] leading-relaxed">Cloud accounts require Firebase configuration.</li>
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
        © {new Date().getFullYear()} Spendly · Design adapted from{' '}
        <a
          href="https://www.figma.com/design/nTZiydYDfolquJ54Yf9wQj/Financen---html-finance-web-page--Community-"
          className="text-[#737373] underline-offset-2 hover:text-[#23A6F0] hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Financen (Community)
        </a>
      </div>
    </footer>
  )
}
