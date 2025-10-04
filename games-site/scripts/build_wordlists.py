#!/usr/bin/env python3
import os, re, sys
from collections import defaultdict

# --- Paths ---
THIS = os.path.abspath(__file__)
ROOT = os.path.dirname(os.path.dirname(THIS))             # project root
OUT_DIR = os.path.join(ROOT, "src", "games", "daily", "WordleWordLists")
ANSWERS_PATH = os.path.join(OUT_DIR, "answers.txt")

print("[i] __file__:", THIS)
print("[i] ROOT:", ROOT)
print("[i] OUT_DIR:", OUT_DIR)
os.makedirs(OUT_DIR, exist_ok=True)
print("[i] Ensured OUT_DIR exists.")

WORD_RE = re.compile(r"^[a-z]{5}$")
BAN = set([])  # add words you never want as answers

def is_clean_word(w: str) -> bool:
    return bool(WORD_RE.match(w)) and w not in BAN

def write_file(path: str, lines: list[str]):
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"[ok] Wrote {len(lines):5d} -> {os.path.relpath(path, ROOT)}")

def try_import_wordfreq():
    try:
        from wordfreq import top_n_list, zipf_frequency  # type: ignore
        return top_n_list, zipf_frequency
    except Exception as e:
        print("[!] Could not import 'wordfreq':", e)
        return None, None

def build_with_wordfreq():
    top_n_list, zipf_frequency = try_import_wordfreq()
    if top_n_list is None:
        return False

    # --- allowed (large) ---
    print("[i] Building allowed-*.txt with wordfreq…")
    candidates = set()
    for N in (50000, 100000):
        for w in top_n_list("en", N):
            w = w.lower()
            if is_clean_word(w):
                candidates.add(w)

    buckets: dict[str, list[tuple[str, float]]] = defaultdict(list)
    for w in candidates:
        z = zipf_frequency(w, "en")
        buckets[w[0]].append((w, z))

    for letter in "abcdefghijklmnopqrstuvwxyz":
        arr = sorted(buckets.get(letter, []), key=lambda t: (-t[1], t[0]))
        words = [w for (w, _) in arr]
        write_file(os.path.join(OUT_DIR, f"allowed-{letter}.txt"), words)

    # --- answers (curated) ---
    print("[i] Building answers.txt with wordfreq…")
    THRESHOLD = 3.8  # raise for stricter, lower for bigger
    answers = []
    seen = set()
    for w in top_n_list("en", 100000):
        w = w.lower()
        if w in seen: 
            continue
        seen.add(w)
        if not is_clean_word(w): 
            continue
        if zipf_frequency(w, "en") >= THRESHOLD:
            answers.append(w)

    answers = sorted(set(answers))
    write_file(ANSWERS_PATH, answers)
    return True

def build_with_fallback():
    print("[i] Using fallback SMALL lists (no wordfreq).")
    # Tiny demo lists so you can confirm files appear
    small_answers = [
        "crane","blush","focal","evade","naval","serve","heath","dwarf","model","stink",
        "grade","quiet","abate","feign","major","death","fresh","crust","stool","colon",
    ]
    write_file(ANSWERS_PATH, small_answers)

    # allowed-* minimal buckets
    sample_allowed = {
        "a": ["aback","abate","adobe","adopt","adore","after","again","agree","ahead","aisle","alarm","album","alien","align","alike","alive","allow","alone","along","aloof","altar","alter","angel","anger","angle","apple","apply","arise","armed","armor","aroma","array","arrow","aside","asset","attic","audio","audit","aware","awful","awake","award"],
        "b": ["badge","bagel","baker","balmy","banal","basil","beach","beard","beast","below","bench","berry","beset","bevel","bible","bicep","biker","birth","bison","black","blade","blame","blank","blast","bleed","blend","bless","blind","blink","bliss","block","blood","bloom","board","boast","bonus","boost","borax","bored","borne","bound","brain","brake","brand","brass","brave","bread","break","breed","brick","bride","brief","bring","brink","broad","broke","brook","brown","brush"],
        "c": ["cabal","cabin","cable","cache","cacti","cadet","cagey","candy","canoe","canon","carve","catch","cater","cedar","cello","chain","chair","chalk","chant","chaos","charm","chart","chase","cheap","cheat","check","cheek","cheer","chess","chest","chief","child","chili","chill","chime","choir","choke","chord","chore","chose","chuck","churn","cider","cigar","civic","civil","claim","clamp","clash","class","clean","clear","clerk","click","cliff","climb","clock","clone","close","cloth","cloud","clown","coach","coast","colon","color","comic","comma","couch","cough","could","count","court","cover","crack","craft","crane","crank","crash","crate","crave","crawl","crazy","cream","creek","creep","crest","crime","crisp","crowd","crown","crude","cruel","crumb","crush","crust"],
    }
    for letter in "abcdefghijklmnopqrstuvwxyz":
        words = sample_allowed.get(letter, [])
        write_file(os.path.join(OUT_DIR, f"allowed-{letter}.txt"), words)

def main():
    ok = build_with_wordfreq()
    if not ok:
        build_with_fallback()
    print("[done] Lists generated to:", OUT_DIR)

if __name__ == "__main__":
    main()
