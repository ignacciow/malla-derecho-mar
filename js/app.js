(async function() {
  const cursos = await fetch('data/cursos.json').then(r => r.json());
  const prereq = await fetch('data/prerequisitos.json').then(r => r.json());

  // Construir mapa de cursos y prerrequisitos
  const map = cursos.reduce((acc, c) => {
    acc[c.codigo] = { ...c, prerequisitos: [] };
    return acc;
  }, {});
  prereq.forEach(p => {
    if (map[p.curso]) map[p.curso].prerequisitos = p.prerequisitos;
  });

  // Organizar por año y semestre
  const years = {};
  Object.values(map).forEach(c => {
    const y = Math.ceil(c.semestre / 2);
    if (!years[y]) years[y] = { 1: [], 2: [] };
    const sem = c.semestre % 2 === 1 ? 1 : 2;
    years[y][sem].push(c);
  });

  const container = document.getElementById('curriculum');
  const approved = new Set();

  function render() {
    container.innerHTML = '';
    Object.keys(years).sort().forEach(y => {
      const yDiv = document.createElement('div');
      yDiv.className = 'year';
      yDiv.innerHTML = `<h2>Año ${y}</h2>`;
      const sems = document.createElement('div');
      sems.className = 'semesters';
      [1,2].forEach(s => {
        const semDiv = document.createElement('div');
        semDiv.className = 'semester';
        semDiv.innerHTML = `<h3>Semestre ${s}</h3><ul></ul>`;
        const ul = semDiv.querySelector('ul');
        years[y][s].forEach(c => {
          const li = document.createElement('li');
          li.textContent = `${c.codigo} - ${c.nombre}`;
          if (approved.has(c.codigo)) li.classList.add('approved');
          li.onclick = () => {
            approved.has(c.codigo) ? approved.delete(c.codigo) : approved.add(c.codigo);
            render();
          };
          ul.appendChild(li);
        });
        sems.appendChild(semDiv);
      });
      yDiv.appendChild(sems);
      container.appendChild(yDiv);
    });
  }

  render();
})();
