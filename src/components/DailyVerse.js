import { useMemo } from "react";
import { useApp } from "../context/AppContext";

const VERSES = [
  ["This is the day which the LORD hath made; we will rejoice and be glad in it.", "Psalm 118:24"],
  ["The LORD is my shepherd; I shall not want.", "Psalm 23:1"],
  ["I can do all things through Christ which strengtheneth me.", "Philippians 4:13"],
  ["Trust in the LORD with all thine heart; and lean not unto thine own understanding.", "Proverbs 3:5"],
  ["The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.", "Nahum 1:7"],
  ["But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.", "Isaiah 40:31"],
  ["My grace is sufficient for thee: for my strength is made perfect in weakness.", "2 Corinthians 12:9"],
  ["Be strong and of a good courage; fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee.", "Deuteronomy 31:6"],
  ["The LORD bless thee, and keep thee: the LORD make his face shine upon thee, and be gracious unto thee.", "Numbers 6:24-25"],
  ["And we know that all things work together for good to them that love God.", "Romans 8:28"],
  ["For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.", "2 Timothy 1:7"],
  ["Let all your things be done with charity.", "1 Corinthians 16:14"],
  ["The name of the LORD is a strong tower: the righteous runneth into it, and is safe.", "Proverbs 18:10"],
  ["Cast thy burden upon the LORD, and he shall sustain thee.", "Psalm 55:22"],
  ["Commit thy works unto the LORD, and thy thoughts shall be established.", "Proverbs 16:3"],
  ["The joy of the LORD is your strength.", "Nehemiah 8:10"],
  ["In every thing give thanks: for this is the will of God in Christ Jesus concerning you.", "1 Thessalonians 5:18"],
  ["The LORD shall fight for you, and ye shall hold your peace.", "Exodus 14:14"],
  ["Seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.", "Matthew 6:33"],
  ["A merry heart doeth good like a medicine: but a broken spirit drieth the bones.", "Proverbs 17:22"],
  ["He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.", "Psalm 91:1"],
  ["The steps of a good man are ordered by the LORD: and he delighteth in his way.", "Psalm 37:23"],
  ["Create in me a clean heart, O God; and renew a right spirit within me.", "Psalm 51:10"],
  ["The LORD is nigh unto all them that call upon him, to all that call upon him in truth.", "Psalm 145:18"],
  ["Let not your heart be troubled: ye believe in God, believe also in me.", "John 14:1"],
  ["If God be for us, who can be against us?", "Romans 8:31"],
  ["Thy word is a lamp unto my feet, and a light unto my path.", "Psalm 119:105"],
  ["The Lord is my light and my salvation; whom shall I fear?", "Psalm 27:1"],
  ["Blessed are the peacemakers: for they shall be called the children of God.", "Matthew 5:9"],
  ["Now faith is the substance of things hoped for, the evidence of things not seen.", "Hebrews 11:1"],
  ["Jesus Christ the same yesterday, and to day, and for ever.", "Hebrews 13:8"],
];

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

export default function DailyVerse() {
  const { settings } = useApp();
  const verse = useMemo(() => {
    if (settings?.dailyVerseText && settings?.dailyVerseReference) {
      return [settings.dailyVerseText, settings.dailyVerseReference];
    }
    return VERSES[dayOfYear(new Date()) % VERSES.length];
  }, [settings]);

  if (settings?.dailyVerseEnabled === false) return null;

  return (
    <section className="section" style={{ background: "var(--white)" }} aria-labelledby="daily-verse-title">
      <div className="container" style={{ maxWidth: 860 }}>
        <div
          className="card"
          style={{
            padding: "36px clamp(24px, 6vw, 72px)",
            textAlign: "center",
            background: "linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)",
            color: "white",
            border: "none",
            boxShadow: "0 18px 48px rgba(27,67,50,0.2)",
          }}
        >
          <div className="eyebrow" style={{ color: "var(--gold-light)", marginBottom: 12 }}>DAILY BIBLE VERSE</div>
          <h2 id="daily-verse-title" style={{ color: "white", fontSize: "clamp(22px, 3vw, 32px)", marginBottom: 16 }}>
            “{verse[0]}”
          </h2>
          <div style={{ color: "var(--gold-light)", fontWeight: 700, letterSpacing: 1, fontSize: 14 }}>{verse[1]}</div>
        </div>
      </div>
    </section>
  );
}
