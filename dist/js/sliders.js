const gallery = document.querySelector(".product-detail__gallery");

if (gallery) {
  const viewport = gallery.querySelector(".product-detail__pictures");
  const track = gallery.querySelector(".product-detail__track");
  const slides = [...track.querySelectorAll(".product-detail__media")];
  const controls = [
    ...gallery.querySelectorAll(".product-detail__controls button"),
  ];

  if (viewport && track && slides.length) {
    let activeIndex = 0;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let moved = false;

    const gap = () => {
      const styles = getComputedStyle(track);
      return Number.parseFloat(styles.columnGap || styles.gap) || 0;
    };

    const slideStep = () => {
      return slides[0].getBoundingClientRect().width + gap();
    };

    const updateControls = () => {
      controls.forEach((button, index) => {
        const active = index === activeIndex;

        button.setAttribute("aria-current", String(active));
        button.setAttribute("aria-label", `Go to image ${index + 1}`);
      });
    };

    const goToSlide = (index, behavior = "smooth") => {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));

      viewport.scrollTo({
        left: activeIndex * slideStep(),
        behavior,
      });

      updateControls();
    };

    controls.forEach((button, index) => {
      button.addEventListener("click", () => {
        goToSlide(index);
      });
    });

    let scrollTimer;

    viewport.addEventListener(
      "scroll",
      () => {
        window.clearTimeout(scrollTimer);

        scrollTimer = window.setTimeout(() => {
          const step = slideStep();

          if (step > 0) {
            activeIndex = Math.max(
              0,
              Math.min(
                Math.round(viewport.scrollLeft / step),
                slides.length - 1,
              ),
            );

            updateControls();
          }
        }, 80);
      },
      { passive: true },
    );

    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      isDragging = true;
      moved = false;
      startX = event.clientX;
      startScrollLeft = viewport.scrollLeft;

      viewport.classList.add("is-dragging");

      if (event.pointerType === "mouse") {
        viewport.setPointerCapture(event.pointerId);
      }
    });

    viewport.addEventListener("pointermove", (event) => {
      if (!isDragging) return;

      const distance = event.clientX - startX;

      if (Math.abs(distance) > 4) {
        moved = true;
      }

      if (moved) {
        viewport.scrollLeft = startScrollLeft - distance;
      }
    });

    const stopDragging = () => {
      if (!isDragging) return;

      isDragging = false;
      viewport.classList.remove("is-dragging");
    };

    viewport.addEventListener("pointerup", stopDragging);
    viewport.addEventListener("pointercancel", stopDragging);
    viewport.addEventListener("lostpointercapture", stopDragging);

    slides.forEach((image) => {
      image.draggable = false;
    });

    window.addEventListener("resize", () => {
      goToSlide(activeIndex, "auto");
    });

    updateControls();
  }
}
