(() => {
  document.querySelectorAll(".year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------------- Menu ---------------- */
  const body = document.body;
  const burger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");
  const setMenu = (open) => {
    body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
  };
  burger.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------------- Footer ---------------- */
  // The footer brings its own logo, back-to-top and email, so the fixed header steps aside.
  const footerRoot = document.getElementById("footer-root");
  if (footerRoot && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => body.classList.toggle("footer-in", e.isIntersecting), { threshold: 0.35 }).observe(footerRoot);
  }

  /* ---------------- Experience marquee ---------------- */
  const kinPause = document.querySelector(".kin-pause");
  if (kinPause) {
    kinPause.addEventListener("click", () => {
      const paused = document.querySelector(".kin-marquees").classList.toggle("kin-paused");
      kinPause.setAttribute("aria-pressed", String(paused));
      kinPause.textContent = paused ? "Play motion" : "Pause motion";
    });
  }

  /* ---------------- Scroll story ---------------- */
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const q = (s) => document.querySelector(s);
  const qa = (s) => gsap.utils.toArray(s);

  gsap.set(".paper-sheet", { xPercent: -50, yPercent: 120, rotate: 6 });
  gsap.set(".tower", { yPercent: 100 });
  gsap.set(".tower-main", { xPercent: -50 });
  gsap.set(".panel", { yPercent: 130 });

  // Desk camera: how far to push in so the monitor fills most of the view.
  const cam = { p: 0 };
  const deskZoom = () => {
    const f = q(".desk-cam");
    return Math.min(2.6, (innerWidth * 0.8) / (f.offsetWidth * 0.2205), (innerHeight * 0.78) / (f.offsetHeight * 0.2775));
  };
  // Recomputed on every tick so it stays right if the window is resized.
  const applyCam = () => {
    const f = q(".desk-cam"), z = 1 + (deskZoom() - 1) * cam.p;
    gsap.set(f, { scale: z, x: f.offsetWidth * -0.0002 * cam.p, y: f.offsetHeight * 0.0153 * cam.p });
  };

  let tl;
  tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: {
      trigger: ".stage",
      start: "top top",
      end: () => "+=" + Math.round((tl ? tl.duration() : 40) * 235),
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
    },
  });

  // 1. Ransom note splash
  tl.to(".splash", { scale: 1, rotate: -3, duration: 1, ease: "back.out(1.6)" })
    .to(".cut", {
      opacity: 1, duration: 0.25,
      rotate: () => gsap.utils.random(-9, 9),
      y: () => gsap.utils.random(-5, 5),
      stagger: 0.07,
    }, "-=0.3")
    .to(".news-caption span", { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power1.inOut" })
    .to({}, { duration: 1 })

  // 2. Newspaper slides in over the scraps
    .to(".paper-sheet", { yPercent: -50, rotate: 0, duration: 1.4, ease: "power3.out" })
    .to(".paper-logo", { opacity: 1, duration: 0.4 })
    .to(".paper-logo-circle", { strokeDashoffset: 0, duration: 0.8, ease: "none" })
    .to(".paper-word-value", { opacity: 1, duration: 0.4 })
    .to(".paper-copy", { opacity: 1, duration: 0.4 })
    .to({}, { duration: 1 })

  // 3. History — yellow wipe, towers rise, years pop
    .set(".history", { visibility: "visible", clipPath: "circle(0% at 50% 50%)" })
    .to(".history", { clipPath: "circle(75% at 50% 50%)", duration: 1.2, ease: "power2.in" })
    .from(".history-title", { y: 40, opacity: 0, duration: 0.5 })
    .to(".tower:not(.tower-main)", { yPercent: 0, duration: 1, stagger: 0.12 }, "<")
    .to(".ev", { opacity: 1, duration: 0.3, stagger: 0.35 })
    .from(".ev", { x: (i, el) => (el.classList.contains("left") ? -30 : 30), duration: 0.3, stagger: 0.35 }, "<")
    .to(".tower-main", { yPercent: 0, duration: 1.4, ease: "power3.out" }, "-=1.6")
    .to({}, { duration: 1 })

  // 3b. Desk — wipe in, push the camera into the monitor, the services play on screen
    .set(".desk", { visibility: "visible", clipPath: "circle(0% at 50% 50%)" })
    .to(".desk", { clipPath: "circle(75% at 50% 50%)", duration: 1.2, ease: "power2.in" })
    .from(".desk-frame", { scale: 1.12, duration: 1.2 }, "<")
    .from(".desk-title span", { y: 30, opacity: 0, duration: 0.5 })
    .to({}, { duration: 0.6 })
    .to(".desk-title", { opacity: 0, y: -20, duration: 0.4 })
    .to(cam, { p: 1, duration: 1.8, ease: "power2.inOut", onUpdate: applyCam }, "<")
    // The monitor "channel-surfs": intro, then the seven services.
    .set(".dk-intro", { opacity: 1 })
    .from(".dk-intro .slogan", { scale: 0.6, opacity: 0, duration: 0.6, ease: "back.out(1.8)" })
    .from(".dk-intro p", { y: 14, opacity: 0, duration: 0.5 })
    .to({}, { duration: 1 });

  const svcs = qa(".dk-svc"), dots = qa(".dk-dots i");
  const flick = (out, into) => {
    tl.to(".static", { opacity: 0.9, duration: 0.12 }).set(out, { opacity: 0 });
    if (into) tl.set(into, { opacity: 1 });
    tl.to(".static", { opacity: 0, duration: 0.12 });
  };
  flick(".dk-intro", svcs[0]);
  svcs.forEach((svc, i) => {
    tl.from(svc.querySelector(".dk-tape"), { scaleX: 0, transformOrigin: "left center", duration: 0.5, ease: "power3.out" })
      .from(svc.querySelector("p"), { y: 12, opacity: 0, duration: 0.4 }, "<0.2")
      .to(dots[i], { opacity: 1, scale: 1.5, duration: 0.2 }, "<")
      .to({}, { duration: 0.9 });
    if (i < svcs.length - 1) flick(svc, svcs[i + 1]);
  });

  // Hold on the last service, then fade the screen chrome before moving on.
  tl.to(".dk-dots", { opacity: 0, duration: 0.3 }, "+=0.6")
    .to({}, { duration: 0.8 });

  // 5. Mugshot lineup
  tl.set(".mugshot", { visibility: "visible", yPercent: 100 })
    .to(".mugshot", { yPercent: 0, duration: 1.2, ease: "power3.inOut" })
    .fromTo(".mugshot-photo", { scale: 1.15 }, { scale: 1, duration: 1.2, ease: "power2.out" }, "<")
    .to(".badass-img", { opacity: 1, duration: 0.4 })
    .from(".badass-img", { scale: 1.8, rotate: -8, transformOrigin: "left center", duration: 0.5, ease: "back.out(1.8)" }, "<")
    .to(".scale-note", { opacity: 1, duration: 0.3 })
    .from(".scale-note", { scale: 1.8, rotate: 14, duration: 0.4, ease: "back.out(2)" }, "<")
    .to(".arm", { opacity: 1, duration: 0.4 })
    .to(".doodle", { opacity: 1, duration: 0.3, stagger: 0.12 })
    .from(".doodle", { scale: 0.3, rotate: () => gsap.utils.random(-30, 30), duration: 0.3, stagger: 0.12, ease: "back.out(2)" }, "<")
    .to(".panel", { yPercent: 0, duration: 0.9, ease: "power3.out" })
    .to({}, { duration: 1 });

  // Doodles keep wiggling once they're visible.
  qa(".doodle").forEach((d, i) => {
    gsap.to(d, { rotate: "+=6", y: "-=6", duration: 1.6 + i * 0.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
  });

  // Experience: poster lines drift apart slightly; the section title wipes in.
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    qa(".kl").forEach((line, i) => {
      gsap.fromTo(line, { xPercent: i % 2 ? 2 : -2 }, {
        xPercent: i % 2 ? -1 : 1, scaleX: 0.97, transformOrigin: i % 2 ? "right center" : "left center", ease: "none",
        scrollTrigger: { trigger: ".kin-open", start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    gsap.from(".kin-title span", {
      clipPath: "inset(0 0 100% 0)", y: 30, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".kin-title", start: "top 85%" },
    });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
