(async function() {
  // Carga de datos
  const cursos = await fetch('data/cursos.json').then(r => r.json());
  const prereq = await fetch('data/prerequisitos.json').then(r => r.json());

  // Construcción de mapa de cursos + prerrequisitos
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
    const year = Math.ceil(c.semestre / 2);
    if (!years[year]) years[year] = { 1: [], 2: [] };
    const sem = c.semestre % 2 === 1 ? 1 : 2;
    years[year][sem].push(c);
  });

  const container = document.getElementById('curriculum');
  const approved = new Set();

  // Chequeo de prerrequisitos
  function canTake(code) {
    return map[code].prerequisitos.every(pr => approved.has(pr));
  }

  // Renderizado completo
  function render() {
    container.innerHTML = '';
    Object.keys(years).sort().forEach(year => {
      const yearDiv = document.createElement('div');
      yearDiv.className = 'year';
      yearDiv.innerHTML = `<h2>Año ${year}</h2>`;
      const sems = document.createElement('div');
      sems.className = 'semesters';

      [1, 2].forEach(s => {
        const semDiv = document.createElement('div');
        semDiv.className = 'semester';
        semDiv.innerHTML = `<h3>Semestre ${s}</h3><ul></ul>`;
        const ul = semDiv.querySelector('ul');

        years[year][s].forEach(c => {
          const li = document.createElement('li');
          li.textContent = `${c.codigo} - ${c.nombre}`;

          if (approved.has(c.codigo)) {
            li.classList.add('approved');
          } else if (!canTake(c.codigo)) {
            li.classList.add('disabled');
          }

          li.onclick = () => {
            if (canTake(c.codigo)) {
              approved.has(c.codigo)
                ? approved.delete(c.codigo)
                : approved.add(c.codigo);
              render();
            }
          };
          ul.appendChild(li);
        });

        sems.appendChild(semDiv);
      });

      yearDiv.appendChild(sems);
      container.appendChild(yearDiv);
    });
  }

  // Inicia render
  render();
})();
