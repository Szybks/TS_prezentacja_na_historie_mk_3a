/* =========================================================
   NOWE NURTY POLITYCZNE — logika prezentacji
   - autoscroll z regulacją prędkości
   - animacje budujące się przy przewijaniu
   - licznik postępu, nawigacja i skróty
   ========================================================= */

(() => {
  "use strict";

  const doc = document;
  const body = doc.body;
  const root = doc.documentElement;
  const params = new URLSearchParams(window.location.search);
  const forceMotion = params.get("anim") === "1";

  if (forceMotion) root.classList.add("force-motion");

  const reduceMotion =
    !forceMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (selector, context = doc) => context.querySelector(selector);
  const $$ = (selector, context = doc) => Array.from(context.querySelectorAll(selector));

  /* ---------- 1. Start hero ---------- */
  const showHero = () => body.classList.add("is-loaded");
  if (doc.readyState === "complete") showHero();
  else window.addEventListener("load", showHero, { once: true });
  window.setTimeout(showHero, 1000);

  /* ---------- 2. Dzielenie nagłówków na słowa ---------- */
  $$("[data-split]").forEach((heading) => {
    if (heading.querySelector(".split-word")) return;

    const text = heading.textContent.trim().replace(/\s+/g, " ");
    if (!text) return;

    const words = text.split(" ");
    const fragment = doc.createDocumentFragment();
    heading.textContent = "";

    words.forEach((word, index) => {
      const outer = doc.createElement("span");
      outer.className = "split-word";
      outer.style.setProperty("--i", String(index));

      const inner = doc.createElement("span");
      inner.textContent = word;
      outer.appendChild(inner);
      fragment.appendChild(outer);

      if (index < words.length - 1) fragment.appendChild(doc.createTextNode(" "));
    });

    heading.appendChild(fragment);
    heading.setAttribute("aria-label", text);
  });

  /* ---------- 3. Stagger dla grup ---------- */
  $$("[data-stagger]").forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      if (!child.classList.contains("reveal")) child.classList.add("reveal");
      if (!child.style.getPropertyValue("--delay")) {
        child.style.setProperty("--delay", `${(index * 0.085).toFixed(2)}s`);
      }
    });
  });

  /* Timeline: każdy punkt buduje się osobno */
  $$(".tl-item").forEach((item) => item.classList.add("reveal"));

  /* ---------- 4. Observer wejść ---------- */
  const revealElements = $$(".reveal");

  if (revealElements.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -7% 0px",
        }
      );

      revealElements.forEach((element) => revealObserver.observe(element));
    } else {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    }
  }

  /* ---------- 5. Liczniki ---------- */
  const counters = $$("[data-count]");

  const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;

    if (reduceMotion) {
      element.textContent = String(Math.round(target));
      return;
    }

    const duration = 1250;
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(frame);
      else element.textContent = String(Math.round(target));
    };

    requestAnimationFrame(frame);
  };

  if (counters.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.65 }
      );

      counters.forEach((counter) => counterObserver.observe(counter));
    } else {
      counters.forEach((counter) => {
        counter.textContent = String(Math.round(Number(counter.dataset.count) || 0));
      });
    }
  }

  /* ---------- 6. Postęp, timeline, parallax ---------- */
  const progressBar = $("#progressBar");
  const timeline = $("#timeline");
  const timelineFill = $("#timelineFill");
  const parallaxElements = $$("[data-parallax]");
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateProgress = () => {
    if (!progressBar) return;
    const scrollable = root.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${clamp(value, 0, 1)})`;
  };

  const updateTimeline = () => {
    if (!timeline || !timelineFill) return;
    const rect = timeline.getBoundingClientRect();
    if (!rect.height) return;
    const progress = clamp((window.innerHeight * 0.56 - rect.top) / rect.height, 0, 1);
    timelineFill.style.height = `${progress * 100}%`;
  };

  const updateParallax = () => {
    if (!parallaxElements.length || reduceMotion) return;
    const viewportHeight = window.innerHeight;

    parallaxElements.forEach((element) => {
      const section = element.closest("section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -180 || rect.top > viewportHeight + 180) return;

      const speed = Number(element.dataset.parallax) || 0.08;
      const centerOffset = rect.top + rect.height / 2 - viewportHeight / 2;
      const translate = -centerOffset * speed;
      element.style.transform = `translate3d(0, ${translate.toFixed(2)}px, 0) scale(1.08)`;
    });
  };

  let scrollRaf = 0;

  const updateScrollUI = () => {
    scrollRaf = 0;
    updateProgress();
    updateTimeline();
    updateParallax();
  };

  const requestScrollUpdate = () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(updateScrollUI);
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  window.addEventListener("load", requestScrollUpdate);

  if (doc.fonts && doc.fonts.ready) {
    doc.fonts.ready.then(requestScrollUpdate).catch(() => {});
  }

  /* ---------- 7. Aktywna sekcja i etykieta ---------- */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav-dot");
  const currentLabel = $("#currentLabel");
  const navById = new Map(
    navLinks.map((link) => [link.getAttribute("href").slice(1), link])
  );

  const setActiveSection = (id) => {
    const section = doc.getElementById(id);
    if (!section) return;

    navLinks.forEach((link) => {
      const isActive = link === navById.get(id);
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });

    if (currentLabel) {
      const chapter = section.dataset.chapter || "";
      const title = section.dataset.title || "";
      currentLabel.textContent = chapter ? `${chapter} / 14 · ${title}` : title;
    }
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) setActiveSection(visible[0].target.id);
      },
      {
        rootMargin: "-44% 0px -51% 0px",
        threshold: [0, 0.01, 0.08, 0.3],
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    setActiveSection("start");
  }

  const initialId = window.location.hash ? window.location.hash.slice(1) : "start";
  setActiveSection(doc.getElementById(initialId) ? initialId : "start");

  /* ---------- 8. Autoscroll ---------- */
  const autoBtn = $("#autoBtn");
  const autoState = $("#autoState");
  const speedBtn = $("#speedBtn");
  const fullBtn = $("#fullBtn");
  const heroAuto = $("#heroAuto");
  const finalAuto = $("#finalAuto");
  const heroAutoLabel = heroAuto ? heroAuto.querySelector(".hero-auto-label") : null;
  const toast = $("#toast");

  const speedSteps = [0.5, 1, 1.5, 2];
  let speedIndex = 1;

  const auto = {
    active: false,
    speed: 40, // px / sekundę przy 1×
    multiplier: speedSteps[speedIndex],
    raf: 0,
    lastTime: 0,
    accumulator: 0,
  };

  let toastTimer = 0;

  const showToast = (message, duration = 3400) => {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, duration);
  };

  const syncAutoUI = () => {
    if (autoBtn) {
      autoBtn.classList.toggle("is-on", auto.active);
      autoBtn.setAttribute("aria-pressed", String(auto.active));
      autoBtn.setAttribute(
        "aria-label",
        auto.active ? "Zatrzymaj autoscroll" : "Uruchom autoscroll"
      );
    }

    if (autoState) autoState.textContent = auto.active ? "wł." : "wył.";
    if (heroAutoLabel) {
      heroAutoLabel.textContent = auto.active
        ? "Zatrzymaj autoscroll"
        : "Uruchom autoscroll";
    }
    if (heroAuto) heroAuto.setAttribute("aria-pressed", String(auto.active));
  };

  const isAtBottom = () =>
    window.innerHeight + window.scrollY >= root.scrollHeight - 4;

  const stopAuto = (announce = false) => {
    if (!auto.active) {
      syncAutoUI();
      return;
    }

    auto.active = false;
    auto.lastTime = 0;
    auto.accumulator = 0;
    if (auto.raf) cancelAnimationFrame(auto.raf);
    auto.raf = 0;
    syncAutoUI();

    if (announce) showToast("Autoscroll zatrzymany.");
  };

  const autoTick = (now) => {
    if (!auto.active) return;

    if (!auto.lastTime) auto.lastTime = now;
    const delta = Math.min(now - auto.lastTime, 80);
    auto.lastTime = now;

    auto.accumulator += auto.speed * auto.multiplier * (delta / 1000);
    const step = Math.floor(auto.accumulator);

    if (step > 0) {
      auto.accumulator -= step;
      window.scrollBy(0, step);
    }

    if (isAtBottom()) {
      stopAuto(false);
      showToast(
        "Koniec prezentacji. Kliknij „Wróć na start”, aby powtórzyć.",
        5200
      );
      return;
    }

    auto.raf = requestAnimationFrame(autoTick);
  };

  const startAuto = () => {
    if (auto.active) {
      stopAuto(true);
      return;
    }

    // Po dojściu do końca kliknięcie „Autoscroll” zaczyna od nowa.
    if (isAtBottom()) window.scrollTo(0, 0);

    auto.active = true;
    auto.lastTime = 0;
    auto.accumulator = 0;
    syncAutoUI();
    showToast("Autoscroll włączony. Kliknij ponownie albo użyj kółka, aby zatrzymać.");
    auto.raf = requestAnimationFrame(autoTick);
  };

  const toggleAuto = () => {
    if (auto.active) stopAuto(true);
    else startAuto();
  };

  if (autoBtn) autoBtn.addEventListener("click", toggleAuto);
  if (heroAuto) heroAuto.addEventListener("click", toggleAuto);

  if (finalAuto) {
    finalAuto.addEventListener("click", () => {
      if (auto.active) {
        stopAuto(true);
        return;
      }
      window.scrollTo(0, 0);
      window.requestAnimationFrame(() => startAuto());
    });
  }

  if (speedBtn) {
    speedBtn.addEventListener("click", () => {
      speedIndex = (speedIndex + 1) % speedSteps.length;
      auto.multiplier = speedSteps[speedIndex];
      const label = String(auto.multiplier).replace(".", ",");
      speedBtn.textContent = `${label}×`;
      speedBtn.setAttribute(
        "aria-label",
        `Prędkość autoscrolla: ${label} razy`
      );
      showToast(`Prędkość autoscrolla: ${label}×`);
    });
  }

  // Ręczne przewijanie zatrzymuje autoscroll.
  ["wheel", "touchmove"].forEach((eventName) => {
    window.addEventListener(
      eventName,
      () => {
        if (!auto.active) return;
        stopAuto(false);
        showToast("Autoscroll wstrzymany — ręczne przewijanie.");
      },
      { passive: true }
    );
  });

  // Schowek / zmiana karty — bezpiecznie zatrzymaj.
  doc.addEventListener("visibilitychange", () => {
    if (doc.hidden && auto.active) stopAuto(false);
  });

  /* ---------- 9. Pełny ekran ---------- */
  const toggleFullscreen = () => {
    if (!doc.fullscreenElement) {
      const request = root.requestFullscreen && root.requestFullscreen();
      if (request && typeof request.catch === "function") {
        request.catch(() => showToast("Ten tryb pełnoekranowy nie jest dostępny."));
      }
    } else if (doc.exitFullscreen) {
      doc.exitFullscreen().catch(() => {});
    }
  };

  if (fullBtn) {
    fullBtn.addEventListener("click", toggleFullscreen);
  }

  doc.addEventListener("fullscreenchange", () => {
    if (!fullBtn) return;
    const isFull = Boolean(doc.fullscreenElement);
    fullBtn.classList.toggle("is-on", isFull);
    fullBtn.setAttribute(
      "aria-label",
      isFull ? "Wyjdź z pełnego ekranu" : "Pełny ekran"
    );
  });

  /* ---------- 10. Skróty klawiszowe ---------- */
  doc.addEventListener("keydown", (event) => {
    const target = event.target;

    if (event.key === "Escape" && auto.active) {
      stopAuto(true);
      return;
    }

    const isTyping =
      target instanceof Element &&
      target.closest("input, textarea, select, [contenteditable='true']");

    if (isTyping || event.ctrlKey || event.metaKey || event.altKey) return;

    // Skróty literowe działają także wtedy, gdy focus został na linku
    // lub przycisku (np. po kliknięciu nawigacji).
    if ((event.key === "a" || event.key === "A") && !event.repeat) {
      event.preventDefault();
      toggleAuto();
      return;
    }

    if ((event.key === "f" || event.key === "F") && !event.repeat) {
      event.preventDefault();
      toggleFullscreen();
      return;
    }

    const isButtonOrLink =
      target instanceof Element && target.closest("button, a, summary");

    if (isButtonOrLink) return;

    if (
      auto.active &&
      ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
        event.key
      )
    ) {
      stopAuto(false);
      showToast("Autoscroll wstrzymany — ręczne przewijanie.");
    }
  });

  /* ---------- 11. Płynne przejścia do sekcji ---------- */
  doc.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = doc.querySelector(href);
    if (!target) return;

    event.preventDefault();
    if (auto.active) stopAuto(false);

    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    try {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search + href
      );
    } catch (error) {
      // file:// w niektórych przeglądarkach nie pozwala na replaceState.
    }
  });

  /* ---------- 12. Start ---------- */
  syncAutoUI();
  requestScrollUpdate();
  window.setTimeout(requestScrollUpdate, 350);
})();
