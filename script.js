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

const showRevealTarget = (target) => {
  target.classList.add("is-visible");
};

const showRevealChain = (target) => {
  let current = target;
  while (current && current !== document.documentElement) {
    if (current.classList?.contains("reveal")) showRevealTarget(current);
    current = current.parentElement;
  }
};

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      showRevealTarget(entry.target);
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
  }
);

const isInViewport = (item) => {
  const rect = item.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

const revealHashTarget = () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  const revealTarget = target?.closest(".reveal");
  if (revealTarget) showRevealChain(revealTarget);
};

if (window.location.hash) {
  revealTargets.forEach(showRevealTarget);
} else {
  revealTargets.forEach((item) => {
    if (isInViewport(item)) {
      showRevealChain(item);
      return;
    }
    revealObserver.observe(item);
  });
}

requestAnimationFrame(revealHashTarget);
window.addEventListener("hashchange", () => requestAnimationFrame(revealHashTarget));

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
