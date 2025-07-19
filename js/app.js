(async function () {
  const cursos = await fetch('data/cursos.json').then(r => r.json());
  const prereq = await fetch('data/prerequisitos.json').then(r => r.json());

  const map = cursos.reduce((acc, cur) => {
    acc[cur.codigo] = { ...cur, prerequisitos: [] };
    return acc;
  }, {});

  prereq.forEach(p => {
    if (map[p.curso]) {
      map[p.curso].prerequisitos = p.prerequisitos;
    }
  });

  const approved = new Set();

  const years = {};
  Object.values(map).forEach(c => {
    const year = Math.ceil(c.semestre / 2);
    const sem = c.semestre % 2 === 1 ? 1 : 2;
    if (!years[year]) years[year] = { 1: [], 2: [] };
    years[year][sem].push(c);
  });

  const container = document.getElementById('curriculum');

  function canTake(codigo) {
    return map[codigo].prerequisitos.every(pr => approved.has(pr));
  }

  function render() {
    container.innerHTML = '';

    Object.keys(years).sort().forEach(year => {
      const yearDiv = document.createElement('div');
      yearDiv.className = 'year';
      yearDiv.innerHTML = `<h2>Año ${year}</h2>`;

      const sems = document.createElement('div');
      sems.className = 'semesters';

      [1, 2].forEach(sem => {
        const semDiv = document.createElement('div');
        semDiv.className = 'semester';
        semDiv.innerHTML = `<h3>Semestre ${sem}</h3><ul></ul>`;
        const ul = semDiv.querySelector('ul');

        years[year][sem].forEach(curso => {
          const li = document.createElement('li');
          li.textContent = `${curso.codigo} - ${curso.nombre}`;

          if (approved.has(curso.codigo)) {
            li.classList.add('approved');
          } else if (!canTake(curso.codigo)) {
            li.classList.add('disabled');
          }

          li.onclick = () => {
            if (!canTake(curso.codigo)) return;

            if (approved.has(curso.codigo)) {
              approved.delete(curso.codigo);
            } else {
              approved.add(curso.codigo);
            }

            render();
          };

          ul.appendChild(li);
        });

        sems.appendChild(semDiv);
      });

      yearDiv.appendChild(sems);
      container.appendChild(yearDiv);
    });
  }

  render();
})();
