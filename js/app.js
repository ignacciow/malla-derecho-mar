(async function() {
  const [cursos, prereq] = await Promise.all([
    fetch('data/cursos.json').then(r => r.json()),
    fetch('data/prerequisitos.json').then(r => r.json())
  ]);

  // Incorporar prerrequisitos dentro de cada curso
  const cursoMap = cursos.reduce((m, c) => { m[c.codigo] = c; c.prerequisitos = []; return m; }, {});
  prereq.forEach(p => { if(cursoMap[p.curso]) cursoMap[p.curso].prerequisitos = p.prerequisitos; });

  let approved = new Set();

  const grid = document.getElementById('grid');
  const missingEl = document.createElement('div');
  missingEl.id = 'missing';
  missingEl.innerHTML = '<strong>Disponibles:</strong><ul id="missing-list"></ul>';
  document.body.appendChild(missingEl);

  function render(filterYear = 'all', filterSem = 'all') {
    grid.innerHTML = '';
    const filtered = cursos.filter(c => {
      if (filterYear !== 'all') {
        const y = Math.ceil(c.semestre / 2);
        if (y !== Number(filterYear)) return false;
      }
      if (filterSem !== 'all' && c.semestre % 2 !== Number(filterSem) % 2) return false;
      return true;
    });

    filtered.forEach(c => {
      const card = document.createElement('div');
      card.className = 'course-card' + (approved.has(c.codigo) ? ' approved' : '');
      card.innerHTML = `
        <h3>${c.codigo}</h3>
        <p>${c.nombre}</p>
        <span class="badge">Sem ${c.semestre}</span>
      `;
      card.onclick = () => toggleApprove(c.codigo);
      grid.appendChild(card);
    });
    showMissing();
  }

  function toggleApprove(code) {
    approved.has(code) ? approved.delete(code) : approved.add(code);
    render(
      document.getElementById('filterYear').value,
      document.getElementById('filterSem').value
    );
  }

  function showMissing() {
    const list = document.getElementById('missing-list');
    list.innerHTML = '';
    const disponibles = cursos
      .filter(c => !approved.has(c.codigo))
      .filter(c => c.prerequisitos.every(pr => approved.has(pr)))
      .map(c => c.codigo);
    disponibles.forEach(code => {
      const li = document.createElement('li');
      li.textContent = code;
      list.appendChild(li);
    });
  }

  document.getElementById('filterYear').onchange = e =>
    render(e.target.value, document.getElementById('filterSem').value);
  document.getElementById('filterSem').onchange = e =>
    render(document.getElementById('filterYear').value, e.target.value);
  document.getElementById('reset').onclick = () => { approved.clear(); render(); };

  render();
})();
