const calendarDays = Array.from(document.querySelectorAll(".calendar-day"));
const status = document.querySelector(".section-divider__status");
const statusDate = document.querySelector("[data-status-date]");
const statusKicker = document.querySelector(".section-divider__status-kicker");
const statusState = document.querySelector(".section-divider__status-text span");
const kid = document.querySelector(".section-divider__kid");

const currentDay = 20;

if (calendarDays.length > 0 && status && statusDate && statusKicker && statusState && kid) {
  let animationFrameId = 0;
  let transitionTimerId = 0;
  let kidTimerId = 0;

  const openKidSrc = kid.dataset.kidOpenSrc;
  const closedKidSrc = kid.dataset.kidClosedSrc;

  calendarDays.forEach((day) => {
    const numericDay = Number(day.dataset.day);
    const isOpen = Number.isFinite(numericDay) && numericDay >= currentDay;
    day.classList.toggle("is-open", isOpen);
    day.classList.toggle("is-closed", !isOpen);
  });

  const showStatus = () => {
    status.classList.remove("is-exiting");
    status.classList.remove("is-visible");
    void status.offsetWidth;
    status.classList.add("is-visible");
  };

  const transitionStatus = (button, immediate = false) => {
    window.cancelAnimationFrame(animationFrameId);
    window.clearTimeout(transitionTimerId);
    window.clearTimeout(kidTimerId);

    const selectedLabel = button.dataset.dateLabel ?? `${button.textContent?.trim()} de agosto`;
    const isOpen = button.classList.contains("is-open");
    const nextKidSrc = isOpen ? openKidSrc : closedKidSrc;

    const applyContent = () => {
      statusKicker.textContent = isOpen ? "Aberto" : "Fechado";
      statusKicker.classList.toggle("is-open", isOpen);
      statusKicker.classList.toggle("is-closed", !isOpen);
      statusState.textContent = isOpen ? "Fiesta aberto" : "Fiesta fechado";
      statusDate.textContent = selectedLabel;
      showStatus();
    };

    if (immediate) {
      kid.src = nextKidSrc;
      applyContent();
      return;
    }

    status.classList.remove("is-visible");
    status.classList.add("is-exiting");
    kid.classList.add("is-swapping");

    kidTimerId = window.setTimeout(() => {
      kid.src = nextKidSrc;
      kid.classList.remove("is-swapping");
    }, 180);

    transitionTimerId = window.setTimeout(() => {
      applyContent();
    }, 220);
  };

  const updateSelection = (button, immediate = false) => {
    calendarDays.forEach((day) => {
      const isSelected = day === button;
      day.classList.toggle("is-selected", isSelected);
      day.setAttribute("aria-pressed", String(isSelected));
    });

    transitionStatus(button, immediate);
  };

  calendarDays.forEach((button) => {
    button.addEventListener("click", () => updateSelection(button));
  });

  const initialSelection =
    document.querySelector(".calendar-day.is-selected") ??
    calendarDays[0];

  updateSelection(initialSelection, true);
}
