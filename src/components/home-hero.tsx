"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDE_IDS = [
  "photo-1504674900247-0877df9cc836",
  "photo-1414235077428-338989a2e8c0",
  "photo-1555939594-58d7cb561ad1",
  "photo-1565299624946-b28f40a0ae38",
  "photo-1579584425555-c3ce17fd4351",
] as const;

const SLIDE_ALTS = [
  "Готовые блюда на столе",
  "Сервировка ресторанных блюд",
  "Блюда с гриля",
  "Пицца из печи",
  "Свежие суши",
] as const;

function unsplashSrc(id: string, width: number) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

const SLIDES = SLIDE_IDS.map((id, index) => ({
  id,
  src: unsplashSrc(id, 1800),
  srcSet: `${unsplashSrc(id, 800)} 800w, ${unsplashSrc(id, 1200)} 1200w, ${unsplashSrc(id, 1800)} 1800w`,
  alt: SLIDE_ALTS[index],
}));

const INTERVAL_MS = 7000;

export function HomeHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(() => new Set([0]));

  useEffect(() => {
    if (paused) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const next = (active + 1) % SLIDES.length;
    setLoaded((prev) => {
      if (prev.has(active) && prev.has(next)) return prev;
      const nextSet = new Set(prev);
      nextSet.add(active);
      nextSet.add(next);
      return nextSet;
    });
  }, [active]);

  return (
    <section
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative isolate min-h-[min(48dvh,420px)] w-full overflow-hidden sm:min-h-[min(52dvh,480px)] lg:min-h-[min(56dvh,560px)]">
        {SLIDES.map((slide, index) =>
          loaded.has(index) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slide.id}
              src={slide.src}
              srcSet={slide.srcSet}
              sizes="100vw"
              alt={slide.alt}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding={index === 0 ? "sync" : "async"}
              loading={index === 0 ? "eager" : "lazy"}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out",
                index === active ? "site-hero-media opacity-100" : "opacity-0",
              )}
              aria-hidden={index !== active}
            />
          ) : null,
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.22_0.05_155/0.88)] via-[oklch(0.25_0.04_150/0.55)] to-[oklch(0.3_0.03_145/0.25)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.04_150/0.75)] via-transparent to-[oklch(0.2_0.03_150/0.35)]" />

        <div className="site-shell relative flex min-h-[min(48dvh,420px)] flex-col justify-end pb-10 pt-10 sm:min-h-[min(52dvh,480px)] sm:pb-12 sm:pt-12 lg:min-h-[min(56dvh,560px)] lg:pb-14">
          <p className="site-rise font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Кафе Василёк
          </p>
          <h1 className="site-rise site-rise-delay-1 mt-3 max-w-3xl font-display text-xl font-medium leading-snug text-white/95 sm:text-2xl md:text-3xl">
            Готовое меню на день — с доставкой
          </h1>
          <p className="site-rise site-rise-delay-2 mt-3 max-w-xl text-sm text-white/80 sm:text-base md:text-lg">
            Выберите дату, посмотрите состав блюд и добавьте день в корзину.
          </p>
          <div className="site-rise site-rise-delay-3 mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/menu"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[oklch(0.96_0.02_140)] px-5 text-sm font-semibold text-[oklch(0.3_0.08_155)] transition hover:bg-white sm:h-12 sm:px-6"
            >
              Смотреть меню
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Слайды героя"
            >
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Слайд ${index + 1}`}
                  onClick={() => {
                    setLoaded((prev) => {
                      if (prev.has(index)) return prev;
                      const nextSet = new Set(prev);
                      nextSet.add(index);
                      return nextSet;
                    });
                    setActive(index);
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === active
                      ? "w-7 bg-white"
                      : "w-2 bg-white/45 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
