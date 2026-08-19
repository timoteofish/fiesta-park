const container = document.querySelector(".container");
const loadingBar = document.querySelector(".loading-bar");
const loadingFill = document.querySelector(".loading-bar__fill");

if (container && loadingBar && loadingFill) {
  let progress = 0;
  let direction = 1;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let redirectStarted = false;

  const finishAndRedirect = () => {
    if (redirectStarted) {
      return;
    }

    redirectStarted = true;
    container.classList.add("is-exiting");

    const redirect = () => {
      window.location.href = "../central/";
    };

    if (prefersReducedMotion) {
      window.setTimeout(redirect, 80);
    } else {
      window.setTimeout(redirect, 460);
    }
  };

  const render = () => {
    if (redirectStarted) {
      return;
    }

    progress += 0.45 * direction;

    if (progress >= 100) {
      progress = 100;
      loadingBar.classList.add("loading-bar--complete");
      loadingFill.style.width = "100%";
      loadingBar.setAttribute("aria-valuenow", "100");
      finishAndRedirect();
      return;
    } else if (progress <= 0) {
      progress = 0;
      direction = 1;
      loadingBar.classList.remove("loading-bar--complete");
    }

    loadingFill.style.width = `${progress}%`;
    loadingBar.setAttribute("aria-valuenow", Math.round(progress).toString());

    requestAnimationFrame(render);
  };

  const startLoading = () => {
    loadingBar.classList.add("is-visible");
    requestAnimationFrame(render);
  };

  if (prefersReducedMotion) {
    loadingBar.classList.add("is-visible");
    requestAnimationFrame(render);
  } else {
    window.setTimeout(startLoading, 650);
  }
}
