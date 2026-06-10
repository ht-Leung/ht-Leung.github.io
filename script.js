const sections = document.querySelectorAll("[data-section]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const revealTargets = document.querySelectorAll(".reveal");
const previewVideos = document.querySelectorAll("[data-preview]");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  {
    threshold: 0.35,
    rootMargin: "-10% 0px -45% 0px",
  }
);

sections.forEach((section) => navObserver.observe(section));

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
  }
);

revealTargets.forEach((item) => revealObserver.observe(item));

const enableVideoPreview = (video) => {
  let previewing = false;

  const playPreview = async () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (previewing) return;

    previewing = true;
    video.muted = true;
    try {
      await video.play();
    } catch (_error) {
      previewing = false;
    }
  };

  const stopPreview = () => {
    if (!previewing) return;
    video.pause();
    video.currentTime = 0;
    previewing = false;
  };

  video.addEventListener("mouseenter", playPreview);
  video.addEventListener("mouseleave", stopPreview);
  video.addEventListener("focus", playPreview);
  video.addEventListener("blur", stopPreview);
};

previewVideos.forEach(enableVideoPreview);
