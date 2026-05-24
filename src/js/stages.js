(function () {
    const root = document.querySelector('[data-stages-slider]');
    if (!root) return;

    const track = root.querySelector('[data-stages-track]');
    const slides = Array.from(track.children);
    const prevBtn = root.querySelector('[data-stages-prev]');
    const nextBtn = root.querySelector('[data-stages-next]');
    const currentEl = root.querySelector('[data-stages-current]');
    const totalEl = root.querySelector('[data-stages-total]');

    const total = slides.length;
    totalEl.textContent = total;

    let index = 0;

    function update() {
        if (index < 0) index = 0;
        if (index > total - 1) index = total - 1;

        track.style.transform = `translate3d(${-index * 100}%, 0, 0)`;
        currentEl.textContent = index + 1;

        const atStart = index <= 0;
        const atEnd = index >= total - 1;
        prevBtn.disabled = atStart;
        prevBtn.classList.toggle('is-disabled', atStart);
        nextBtn.disabled = atEnd;
        nextBtn.classList.toggle('is-disabled', atEnd);
    }

    function go(delta) {
        index += delta;
        update();
    }

    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));

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
        const dx = e.changedTouches[0].clientX - startX;
        dragging = false;
        startX = null;
        startY = null;
        if (Math.abs(dx) > 40) {
            go(dx < 0 ? 1 : -1);
        }
    });

    update();
})();
