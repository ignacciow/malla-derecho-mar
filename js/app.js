(async function() {
  const [cursos, prereq] = await Promise.all([
    fetch('data/cursos.json').then(r => r.json()),
    fetch('data/prerequisitos.json').then(r => r.json())
  ]);

  let approved = new Set();

  function buildData(filterYear, filterSem) {
    const nodes = cursos
      .filter(c =>
        filterYear === 'all' ||
        (c.semestre >= (filterYear - 1) * 2 + 1 && c.semestre <= (filterYear - 1) * 2 + 2)
      )
      .filter(c =>
        filterSem === 'all' ||
        (c.semestre % 2 === Number(filterSem) % 2)
      )
      .map(c => ({
        id: c.codigo,
        label: c.codigo,
        title: `${c.nombre}\nSem: ${c.semestre}`,
        group: Math.ceil(c.semestre / 2),
        shape: 'box',
        color: approved.has(c.codigo) ? '#ff69b4' : '#fff0f5'
      }));
    const edges = prereq
      .flatMap(p => p.prerequisitos.map(pre => ({ from: pre, to: p.curso })));
    return { nodes, edges };
  }

  const container = document.getElementById('grafo');
  let network;

  function render(filterYear = 'all', filterSem = 'all') {
    const data = buildData(filterYear, filterSem);
    const opts = {
      layout: { hierarchical: { direction: 'LR' } },
      interaction: { hover: true },
      physics: { enabled: false }
    };
    network = new vis.Network(container, data, opts);
    network.on('click', params => {
      if (params.nodes.length) {
        const id = params.nodes[0];
        approved.has(id) ? approved.delete(id) : approved.add(id);
        render(
          document.getElementById('filterYear').value,
          document.getElementById('filterSem').value
        );
        showMissing();
      }
    });
  }

  function showMissing() {
    const missing = cursos
      .filter(c =>
        !approved.has(c.codigo) &&
        (c.prerequisitos || []).every(pr => approved.has(pr))
      )
      .map(c => c.codigo);
    console.log('Asignaturas disponibles:', missing);
  }

  document.getElementById('filterYear').onchange = e =>
    render(e.target.value, document.getElementById('filterSem').value);

  document.getElementById('filterSem').onchange = e =>
    render(document.getElementById('filterYear').value, e.target.value);

  document.getElementById('reset').onclick = () => {
    approved.clear();
    render();
  };

  render();
})();
