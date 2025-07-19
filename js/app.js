// script.js
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');

  courses.forEach(c => {
    const el = document.createElement('div');
    el.className = 'course';
    el.id = c.id;
    el.textContent = c.name;
    el.addEventListener('click', () => {
      if (!el.classList.contains('unlocked')) return;
      el.classList.toggle('approved');
      updateUnlocks();
    });
    grid.appendChild(el);
  });

  function updateUnlocks() {
    courses.forEach(c => {
      const el = document.getElementById(c.id);
      const ok = c.prereqs.every(p =>
        document.getElementById(p)?.classList.contains('approved')
      );
      if (ok) el.classList.add('unlocked');
      else {
        el.classList.remove('unlocked');
        el.classList.remove('approved');
      }
    });
  }

  updateUnlocks();
});
