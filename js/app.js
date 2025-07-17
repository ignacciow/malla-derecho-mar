body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background: #ffe4e1;
  color: #333;
}
header {
  background: #ffc0cb;
  padding: 1rem;
  text-align: center;
}
header h1 {
  margin: 0;
  font-size: 2rem;
}
#curriculum {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  padding: 2rem;
}
@media (min-width: 1200px) {
  #curriculum {
    grid-template-columns: repeat(4, 1fr);
  }
}
.year {
  background: #fff0f5;
  border: 2px solid #f08080;
  border-radius: 1rem;
  padding: 1rem;
}
.year h2 {
  margin-top: 0;
  color: #a0205a;
  font-size: 1.5rem;
  text-align: center;
}
.semesters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.semester {
  background: #ffeef1;
  border: 1px solid #f08080;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
.semester h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #c71585;
}
.semester ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
}
.semester li {
  margin: 0.25rem 0;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
}
.semester li:hover {
  background: #ffb6c1;
}
.semester li.approved {
  background: #ff69b4;
  color: #fff;
}
/* Ocultar listado de faltantes */
#missing { display: none; }
