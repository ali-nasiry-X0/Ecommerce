export function slider(Gallery, viewPort, Track, ControlsBox) {
  const gallery = Gallery;

  if (!gallery) return;

  const viewport = viewPort;
  const track = Track;

  if (!viewport || !track) return;
  let controlsBox = ControlsBox;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const DRAG_THRESHOLD = 5;
  const SWIPE_RATIO = 0.15;
  const FLICK_SPEED = 0.5;

  let slides = [];
  let activeIndex = 0;
  let targetIndex = null;
  let targetTimer = 0;
  let suppressClick = false;

  const drag = {
    pressed: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startScroll: 0,
    startIndex: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  };

  const clamp = (index) => Math.max(0, Math.min(index, slides.length - 1));
  const isRtl = () => getComputedStyle(viewport).direction === "rtl";

  const setActive = (index) => {
    activeIndex = index;

    [...controlsBox.children].forEach((button, i) => {
      button.setAttribute("aria-current", String(i === index));
    });
  };

  const clearTarget = () => {
    targetIndex = null;
    window.clearTimeout(targetTimer);
  };

  const scrollToSlide = (index, behavior = "smooth") => {
    if (!slides[index]) return;
    const delta =
      slides[index].getBoundingClientRect().left -
      viewport.getBoundingClientRect().left;

    viewport.scrollBy({
      left: delta,
      behavior: reduceMotion.matches ? "auto" : behavior,
    });
  };

  const goTo = (index, behavior = "smooth") => {
    if (!slides.length) return;

    const next = clamp(index);
    window.clearTimeout(targetTimer);
    targetIndex = next;
    targetTimer = window.setTimeout(clearTarget, 800);

    setActive(next);
    scrollToSlide(next, behavior);
  };

  const step = (direction) => goTo(activeIndex + direction);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio < 0.6) return;

        const index = slides.indexOf(entry.target);
        if (index === -1) return;

        if (targetIndex !== null) {
          if (index === targetIndex) clearTarget();
          return;
        }

        if (index !== activeIndex) setActive(index);
      });
    },
    { root: viewport, threshold: [0.6] },
  );

  const sameSlides = (next) =>
    next.length === slides.length && next.every((s, i) => s === slides[i]);

  const refresh = () => {
    const next = [...track.querySelectorAll(".product-detail__media")];
    const changed = !sameSlides(next);

    if (changed) {
      slides.forEach((slide) => observer.unobserve(slide));
      slides = next;
      slides.forEach((slide) => observer.observe(slide));
    }
    if (controlsBox.children.length !== slides.length) {
      controlsBox.replaceChildren(
        ...slides.map((_, index) => {
          const button = document.createElement("button");

          button.type = "button";
          button.setAttribute("aria-label", `Go to image ${index + 1}`);

          return button;
        }),
      );
    }
    controlsBox.hidden = slides.length < 2;

    if (changed) setActive(clamp(activeIndex));
  };

  controlsBox.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || !controlsBox.contains(button)) return;

    goTo([...controlsBox.children].indexOf(button));
  });
  new MutationObserver(refresh).observe(track, { childList: true });

  /* ---------- mouse drag ---------- */

  viewport.addEventListener("dragstart", (event) => event.preventDefault());

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    clearTarget();

    drag.pressed = true;
    drag.moved = false;
    drag.pointerId = event.pointerId;
    drag.startX = drag.lastX = event.clientX;
    drag.startScroll = viewport.scrollLeft;
    drag.startIndex = activeIndex;
    drag.lastTime = event.timeStamp;
    drag.velocity = 0;
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!drag.pressed || event.pointerId !== drag.pointerId) return;

    const distance = event.clientX - drag.startX;

    if (!drag.moved) {
      if (Math.abs(distance) < DRAG_THRESHOLD) return;

      drag.moved = true;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture(event.pointerId);
    }

    const elapsed = event.timeStamp - drag.lastTime;

    if (elapsed > 0) {
      drag.velocity = (event.clientX - drag.lastX) / elapsed;
    }

    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;

    viewport.scrollLeft = drag.startScroll - distance;
  });

  const endDrag = (event) => {
    if (!drag.pressed || event.pointerId !== drag.pointerId) return;

    drag.pressed = false;
    if (!drag.moved) return;

    drag.moved = false;

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
    suppressClick = true;
    window.setTimeout(() => (suppressClick = false), 0);

    const distance = event.clientX - drag.startX;
    const stale = event.timeStamp - drag.lastTime > 100;
    const speed = stale ? 0 : drag.velocity;

    let target = drag.startIndex;

    if (
      Math.abs(distance) > viewport.clientWidth * SWIPE_RATIO ||
      Math.abs(speed) > FLICK_SPEED
    ) {
      const movedLeft = (Math.abs(speed) > FLICK_SPEED ? speed : distance) < 0;
      const forward = isRtl() ? !movedLeft : movedLeft;

      target += forward ? 1 : -1;
    }

    goTo(target);

    let timer = 0;

    const finish = () => {
      window.clearTimeout(timer);
      viewport.removeEventListener("scrollend", finish);
      viewport.classList.remove("is-dragging");
    };

    viewport.addEventListener("scrollend", finish, { once: true });
    timer = window.setTimeout(finish, 600);
  };

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  viewport.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;

      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );

  /* ---------- resize ---------- */

  let resizeReady = false;

  new ResizeObserver(() => {
    if (!resizeReady) {
      resizeReady = true;
      return;
    }

    if (!drag.pressed) scrollToSlide(activeIndex, "auto");
  }).observe(viewport);

  refresh();
  setActive(0);
}
