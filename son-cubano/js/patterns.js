/* Patrones rítmicos en una cuadrícula de 16 pasos (2 compases de 4/4 en corcheas).
   Paso par  = tiempo (1, 2, 3, 4)   -> "a tiempo"
   Paso impar = "y" (entre tiempos)  -> "contratiempo" */
window.SC = window.SC || {};

SC.STEPS = 16;

SC.stepLabel = function (i) {
  var beat = Math.floor((i % 8) / 2) + 1;
  return i % 2 === 0 ? String(beat) : 'y';
};

SC.isOffbeat = function (i) { return i % 2 === 1; };

function fromSteps(list) {
  var arr = new Array(SC.STEPS).fill(false);
  list.forEach(function (i) { arr[i] = true; });
  return arr;
}

SC.PATTERNS = {
  pulso:      { nombre: 'Pulso',             color: 'pulso',  pasos: fromSteps([0, 2, 4, 6, 8, 10, 12, 14]) },
  contra:     { nombre: 'Contratiempo (y)',  color: 'contra', pasos: fromSteps([1, 3, 5, 7, 9, 11, 13, 15]) },
  clave32:    { nombre: 'Clave 3-2',         color: 'clave',  pasos: fromSteps([0, 3, 6, 10, 12]) },
  clave23:    { nombre: 'Clave 2-3',         color: 'clave',  pasos: fromSteps([2, 4, 8, 11, 14]) },
  bajoNormal: { nombre: 'Bajo en el 1',      color: 'bajo',   pasos: fromSteps([0, 4, 8, 12]) },
  bajoSon:    { nombre: 'Bajo anticipado',   color: 'bajo',   pasos: fromSteps([3, 6, 11, 14]) },
  bongo:      { nombre: 'Bongó (martillo)',  color: 'bongo',  pasos: fromSteps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
                acento: fromSteps([6, 14]) },
  pasoSalsa:  { nombre: 'Paso salsa (en 1)', color: 'paso',   pasos: fromSteps([0, 2, 4, 8, 10, 12]) },
  pasoSon:    { nombre: 'Paso son (contratiempo)', color: 'paso', pasos: fromSteps([2, 4, 6, 10, 12, 14]) }
};

/* Secuencia de pies para el baile: por paso, qué pie se mueve (I = izquierdo, D = derecho, null = pausa) */
SC.PIES = {
  salsa: [ 'I', null, 'D', null, 'I', null, null, null, 'D', null, 'I', null, 'D', null, null, null ],
  son:   [ null, null, 'I', null, 'D', null, 'I', null, null, null, 'D', null, 'I', null, 'D', null ]
};
