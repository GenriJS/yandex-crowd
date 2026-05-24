(function () {
    const root = document.querySelector('[data-participants-slider]');
    if (!root) return;

    const track = root.querySelector('[data-participants-track]');
    const cards = Array.from(track.children);
    const section = root.closest('.participants');
    const prevBtns = section.querySelectorAll('[data-participants-prev]');
    const nextBtns = section.querySelectorAll('[data-participants-next]');
    const currentEls = section.querySelectorAll('[data-participants-current]');
    const totalEls = section.querySelectorAll('[data-participants-total]');

    const total = cards.length;
    totalEls.forEach((el) => { el.textContent = total; });

    let index = 0;

    function getVisibleCount() {
        return window.innerWidth < 1200 ? 1 : 3;
    }

    function getStep() {
        if (cards.length < 2) {
            return cards[0] ? cards[0].getBoundingClientRect().width : 0;
        }
        const a = cards[0].getBoundingClientRect().left;
        const b = cards[1].getBoundingClientRect().left;
        return b - a;
    }

    function update() {
        const visible = getVisibleCount();
        const pages = Math.max(1, Math.ceil(total / visible));
        if (index > pages - 1) index = pages - 1;
        if (index < 0) index = 0;

        const step = getStep();
        const shownFromStart = Math.min(total, (index + 1) * visible);
        const maxOffset = Math.max(0, total - visible) * step;
        const desiredOffset = index * visible * step;
        track.style.transform = `translate3d(${-Math.min(desiredOffset, maxOffset)}px, 0, 0)`;

        currentEls.forEach((el) => { el.textContent = shownFromStart; });

        const atStart = index <= 0;
        const atEnd = index >= pages - 1;
        prevBtns.forEach((b) => { b.disabled = atStart; b.classList.toggle('is-disabled', atStart); });
        nextBtns.forEach((b) => { b.disabled = atEnd; b.classList.toggle('is-disabled', atEnd); });
    }

    function go(delta) {
        index += delta;
        update();
    }

    prevBtns.forEach((b) => b.addEventListener('click', () => go(-1)));
    nextBtns.forEach((b) => b.addEventListener('click', () => go(1)));

    let resizeRaf = null;
    window.addEventListener('resize', () => {
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(update);
    });

    let startX = null;
    let startY = null;
    let dragging = false;

    track.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        dragging = true;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!dragging || startX === null) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    track.addEventListener('touchend', (e) => {
        if (!dragging || startX === null) return;
        const dx = (e.changedTouches[0].clientX) - startX;
        dragging = false;
        startX = null;
        startY = null;
        if (Math.abs(dx) > 40) {
            go(dx < 0 ? 1 : -1);
        }
    });

    update();
})();
