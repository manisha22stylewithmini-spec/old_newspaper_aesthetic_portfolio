// Mounts the Pushpin Tear Footer into the static site as a React island.
// Build: `npm run build` → js/footer.bundle.js (loaded by index.html).
import { createRoot } from "react-dom/client"
import PushpinTearFooter from "@/components/ui/pushpin-tear-footer"

const EMAIL = "manishabaroliya2025@gmail.com"
const MAILTO = "mailto:" + EMAIL


// Drawn under the torn sheet. The defs also hold the dark scratched texture that
// css/style.css paints onto the sheet itself (#footer-root .tpf-sheet).
// Below the tear: light newsprint with Manisha's story printed across the full width.
const PAPER_ART = (
  <>
    <defs>
      {/* one copy of the texture stretched over the sheet: no repeats, no mirrored seams */}
      <pattern id="mb-sheet-tex" width="1" height="1" patternContentUnits="objectBoundingBox">
        <image href="assets/panel-bg.png" width="1" height="1" preserveAspectRatio="xMidYMid slice" />
      </pattern>
      {/* paper-coloured glow that keeps the wordmark and small print readable */}
      <radialGradient id="mb-clear" cx="50%" cy="84%" r="42%">
        <stop offset="0" stopColor="#ece7df" stopOpacity=".92" />
        <stop offset=".55" stopColor="#ece7df" stopOpacity=".7" />
        <stop offset="1" stopColor="#ece7df" stopOpacity="0" />
      </radialGradient>
    </defs>
    <image
      href="assets/clipping-mb.webp"
      x="-2%" y="34%" width="104%" height="68%"
      preserveAspectRatio="xMidYMid slice"
      opacity=".38"
    />
    <rect width="100%" height="100%" fill="url(#mb-clear)" />
  </>
)

function SiteFooter() {
  return (
    <>
    <PushpinTearFooter
      brand="manisha."
      name="Manisha Baroliya"
      logo={<img src="assets/mb-logo-badge.webp" alt="" style={{ height: "2.6em", width: "2.6em", borderRadius: "50%", display: "block", boxShadow: "0 0 0 2px rgba(243,239,233,.25)" }} />}
      logoHref="index.html"
      email={EMAIL}
      // No newsletter: this is a static site with nothing to receive sign-ups.
      newsletter={null}
      status={{ label: "open to product & UX/UI roles", href: "contact.html" }}
      mark="MB / 2026"
      timeZone="Asia/Kolkata"
      timeLabel="IST"
      socials={[
        { icon: "mail", label: "Email Manisha", href: MAILTO },
        { icon: "chat", label: "Contact page", href: "contact.html" },
      ]}
      columns={[
        {
          title: "explore",
          links: [
            { label: "About", href: "index.html" },
            { label: "Experience", href: "#experience" },
            { label: "Contact", href: "contact.html" },
          ],
          cta: { label: "hire.", href: MAILTO },
        },
        {
          title: "live work",
          links: [
            { label: "Loop Lynks", href: "https://looplynks.com" },
            { label: "Const-ant", href: "https://const-ant.com" },
            { label: "Email", href: MAILTO },
          ],
          cta: { label: "talk.", href: "contact.html" },
        },
      ]}
      chat={{ label: "say hi", href: "contact.html" }}
      sideLinks={[
        { icon: "mail", label: "email", href: MAILTO },
        { icon: "chat", label: "call", href: "tel:+917290892486" },
      ]}
      copyright="© 2026 Manisha Baroliya"
      credit="designed & built by hand"
      handle={{ label: "let's talk →", href: "contact.html" }}
      // The sheet is painted with the dark scratched texture (see css), so its ink is light.
      // `sheet` stays purple: it colours the pin, the badge's check and the toast.
      sheet="#a982e8"
      sheetInk="#f3efe9"
      paper="#ece7df"
      paperInk="#1c1730"
      seed={12}
      height="100svh"
      fontSans={'"Inter", "Helvetica Neue", Arial, system-ui, sans-serif'}
      paperArt={PAPER_ART}
    />
    {/* A newspaper headline strip where the newsletter field would sit. */}
    <p className="mb-headline" aria-hidden="true">
      <b>EXTRA!</b> 3+ years &middot; 10+ SaaS &amp; B2B platforms &middot; a 200+ component design system
    </p>
    </>
  )
}

const el = document.getElementById("footer-root")
if (el) createRoot(el).render(<SiteFooter />)
