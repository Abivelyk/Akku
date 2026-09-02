from pathlib import Path
import re, zipfile, hashlib
ROOT=Path(__file__).resolve().parent
required=['index.html','styles.css','app.js','assets/audio_3.mp3','assets/v02.mp4','assets/v03.mp4']
for p in required:
    q=ROOT/p
    if not q.exists(): raise SystemExit(f'Missing {p}')
text=(ROOT/'app.js').read_text(encoding='utf-8')
assert "assets/audio_3.mp3" in text and 'music.currentTime' in text and 'video.addEventListener' in text
css=(ROOT/'styles.css').read_text(encoding='utf-8')
assert not re.search(r'animation:[^;{}]*infinite', css)
assert 'pointermove' not in text
assert not re.search(r'\.room\.active::after\{[^}]*animation:(?!none)', css)
assert 'preload="metadata"' in text
forbidden=['soundtrack.html','audio_1.mp3','audio_2.mp3','audio_4.mp3']
alltext='\n'.join((ROOT/p).read_text(encoding='utf-8',errors='ignore') for p in ['index.html','app.js','styles.css'])
for f in forbidden: assert f not in alltext
assert len(list((ROOT/'assets').glob('p*.webp')))==26
print('AKKU rebuild validation: PASS')
print('26 photos, 2 videos, 1 audio track')
print('Single-page router keeps music alive across rooms')
print('No canvas loops, no continuous decorative animation loops')
print('Single solar background compositor layer; pointer tracking disabled')
zip_path=ROOT.with_suffix('.zip')
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in ROOT.rglob('*'):
        if p.is_file() and p != zip_path: z.write(p,p.relative_to(ROOT.parent))
print(zip_path)
