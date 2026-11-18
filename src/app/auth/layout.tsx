// Applies the public-site theme to sign in, sign up and vouch recovery.
// See .theme-marketplace in globals.css.
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="theme-marketplace min-h-screen bg-background text-ink">{children}</div>;
}
