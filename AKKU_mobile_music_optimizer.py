from pathlib import Path
import re

ROOT = Path.cwd()

if not (ROOT / ".git").exists():
    raise SystemExit("ERROR: Run this script from your cloned Akku repository folder.")

assets = ROOT / "assets"
jaavedaan = assets / "audio_3.mp3"

if not jaavedaan.exists():
    raise SystemExit("ERROR: assets/audio_3.mp3 was not found. No changes were made.")

# 1. Remove the old Sound page.
soundtrack = ROOT / "soundtrack.html"
if soundtrack.exists():
    soundtrack.unlink()

# 2. Keep only Jaavedaan Hai.
for name in ("audio_1.mp3", "audio_2.mp3", "audio_4.mp3"):
    old = assets / name
    if old.exists():
        old.unlink()

# 3. Remove links to the deleted Sound page.
link_re = re.compile(
    r'<a\\b[^>]*href=["\\\'](?:\\./)?soundtrack\\.html(?:#[^"\\\']*)?["\\\'][^>]*>.*?</a>',
    re.I | re.S,
)

for page in ROOT.glob("*.html"):
    text = page.read_text(encoding="utf-8")
    text = link_re.sub("", text)
    page.write_text(text, encoding="utf-8")

# 4. Add a lightweight mobile stylesheet.
mobile_css = ROOT / "mobile-lite.css"
mobile_css.write_text(
    r'''@media (pointer: coarse), (max-width: 760px) {
  html {
    overflow-x: hidden !important;
    scroll-behavior: auto !important;
    -webkit-text-size-adjust: 100%;
  }

  body {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
    overscroll-behavior-x: none !important;
  }

  /* Remove expensive mobile-only decoration/canvas work. */
  .ambient-canvas,
  .entry-canvas,
  [data-space],
  .akk-cosmos,
  .akk-rich-layer,
  .akk-deco,
  .akk-glowline,
  .akk-velocity-glow,
  .akk-swipe-cue,
  .lumen,
  .cursor {
    display: none !important;
    animation: none !important;
  }

  /* Keep the design, remove continuous GPU-heavy motion on phones. */
  .orbit-ring,
  .orbit-photo,
  .halo,
  .record-aura,
  .letter-orbit,
  .letter-orb,
  .memory-orbit,
  .memory-orbit-core,
  .entry-glyph {
    animation: none !important;
  }

  /* Avoid expensive glass compositing on small GPUs. */
  .topbar,
  .mobile-menu,
  .mobile-menu-inner,
  .sound-dock,
  .sound-panel,
  .toast,
  .glass,
  .panel,
  .room-card,
  .museum-card,
  .video-frame {
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
  }

  img,
  video,
  canvas,
  svg {
    max-width: 100% !important;
  }

  video {
    height: auto !important;
  }

  .topbar {
    left: 10px !important;
    right: 10px !important;
    width: auto !important;
    transform: none !important;
  }

  .mobile-menu {
    max-width: 100vw !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  .mobile-menu-inner {
    width: min(92vw, 460px) !important;
    max-height: calc(100dvh - 28px) !important;
    overflow-y: auto !important;
  }

  button,
  a,
  input {
    touch-action: manipulation;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
''',
    encoding="utf-8",
)

# 5. Load the mobile stylesheet on every remaining page.
for page in ROOT.glob("*.html"):
    text = page.read_text(encoding="utf-8")
    if "mobile-lite.css" not in text:
        text = text.replace(
            "</head>",
            '<link rel="stylesheet" href="mobile-lite.css">\n</head>',
            1,
        )
        page.write_text(text, encoding="utf-8")

# 6. Add one Jaavedaan Hai player.
app = ROOT / "app.js"
if not app.exists():
    raise SystemExit("ERROR: app.js was not found.")

js = app.read_text(encoding="utf-8")
marker = "AKKU SINGLE-SONG MUSIC"

if marker not in js:
    js += r'''
/* AKKU SINGLE-SONG MUSIC */
(() => {
  const init = () => {
    if (document.querySelector("[data-akku-music]")) return;

    const audio = document.createElement("audio");
    audio.dataset.akkuMusic = "1";
    audio.src = "assets/audio_3.mp3";
    audio.preload = "metadata";
    audio.loop = true;
    audio.volume = 0.72;
    audio.setAttribute("playsinline", "");
    audio.setAttribute("aria-label", "Jaavedaan Hai");
    audio.style.cssText =
      "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1";

    document.body.appendChild(audio);

    const tryPlay = () => audio.play().catch(() => {});

    /* Browsers may block autoplay with sound until the first user gesture. */
    tryPlay();
    document.addEventListener("pointerdown", tryPlay, { once: true, passive: true });
    document.addEventListener("touchstart", tryPlay, { once: true, passive: true });
    document.addEventListener("keydown", tryPlay, { once: true, passive: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
'''
    app.write_text(js, encoding="utf-8")

# 7. Verify.
pages = list(ROOT.glob("*.html"))

assert not (ROOT / "soundtrack.html").exists()
assert jaavedaan.exists()

for name in ("audio_1.mp3", "audio_2.mp3", "audio_4.mp3"):
    assert not (assets / name).exists(), name

for page in pages:
    html = page.read_text(encoding="utf-8")
    assert "soundtrack.html" not in html, page.name
    assert "mobile-lite.css" in html, page.name

app_text = app.read_text(encoding="utf-8")
assert "assets/audio_3.mp3" in app_text
assert "audio.loop = true" in app_text
assert marker in app_text

print("AKKU MOBILE + SINGLE-MUSIC OPTIMIZATION COMPLETED")
print(f"Remaining HTML pages: {len(pages)}")
print("Sound page: REMOVED")
print("Other songs: REMOVED")
print("Jaavedaan Hai: KEPT + LOOPED")
print("Mobile optimization CSS: ADDED")
print("Verification: PASS")
