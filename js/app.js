async function main() {
  const [cursos, prereq] = await Promise.all([
    fetch('data/cursos.json').then(r => r.json()),
    fetch('data/prerequisitos.json').then(r => r.json())
  ]);

  const nodes = cursos.map(c =>
    ({ id: c.codigo, label: `${c.codigo}\n${c.nombre}`, title: `Sem ${c.semestre}, ${c.creditos}cr` })
  );

  const edges = prereq.flatMap(p =>
    p.prerequisitos.map(pre => ({ from: pre, to: p.curso }))
  );

  const container = document.getElementById('grafo');
  new vis.Network(
    container,
    { nodes, edges },
    {
      layout: { hierarchical: { direction: 'LR' } },
      interaction: { hover: true },
      physics: { enabled: false }
    }
  );
}

main();
