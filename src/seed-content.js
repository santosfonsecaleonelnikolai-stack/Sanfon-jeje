// Contenido de ejemplo realista para la industria de la limpieza.
// El administrador puede editar/agregar todo esto desde el panel.

export const FORMULAS = [
  {
    slug: 'jabon-liquido-trastes',
    name: 'Jabón líquido para trastes',
    description: 'Lavatrastes concentrado, buen desengrasante y espuma abundante.',
    yield_liters: 20,
    procedure: [
      'Disolver el CMC (espesante) en 2 L de agua tibia y dejar reposar 20 min.',
      'En el resto del agua, agregar el ácido sulfónico y neutralizar lentamente con sosa hasta pH 7.',
      'Incorporar el texapón (agente activo) moviendo suavemente para no generar exceso de espuma.',
      'Agregar sal para ajustar la viscosidad, luego color y fragancia.',
      'Agregar conservador y completar con agua hasta el volumen final.',
    ].join('\n'),
    safety_notes: 'Usar guantes al manejar sosa cáustica. Neutralizar el sulfónico con cuidado, la reacción libera calor.',
    ingredients: [
      { ingredient_name: 'Texapón N-70', quantity: 3, unit: 'kg', cost_per_unit: 55 },
      { ingredient_name: 'Ácido sulfónico', quantity: 1.5, unit: 'kg', cost_per_unit: 48 },
      { ingredient_name: 'Sosa cáustica', quantity: 0.2, unit: 'kg', cost_per_unit: 35 },
      { ingredient_name: 'Sal (cloruro de sodio)', quantity: 0.4, unit: 'kg', cost_per_unit: 8 },
      { ingredient_name: 'CMC (espesante)', quantity: 0.1, unit: 'kg', cost_per_unit: 90 },
      { ingredient_name: 'Conservador', quantity: 0.05, unit: 'kg', cost_per_unit: 120 },
      { ingredient_name: 'Color y fragancia', quantity: 0.05, unit: 'kg', cost_per_unit: 150 },
      { ingredient_name: 'Agua', quantity: 14, unit: 'L', cost_per_unit: 0.1 },
    ],
  },
  {
    slug: 'limpiador-multiusos',
    name: 'Limpiador multiusos',
    description: 'Desengrasante ligero para superficies, pisos y cocina.',
    yield_liters: 20,
    procedure: [
      'Disolver el nonil fenol en 3 L de agua tibia.',
      'Agregar el metasilicato de sodio poco a poco moviendo constantemente.',
      'Incorporar amonio cuaternario para poder desinfectante.',
      'Agregar color, fragancia y completar con agua al volumen final.',
    ].join('\n'),
    safety_notes: 'No mezclar con productos clorados. Mantener etiquetado y fuera del alcance de niños.',
    ingredients: [
      { ingredient_name: 'Nonil fenol 9 moles', quantity: 1, unit: 'kg', cost_per_unit: 60 },
      { ingredient_name: 'Metasilicato de sodio', quantity: 0.5, unit: 'kg', cost_per_unit: 40 },
      { ingredient_name: 'Amonio cuaternario', quantity: 0.2, unit: 'kg', cost_per_unit: 130 },
      { ingredient_name: 'Color y fragancia', quantity: 0.05, unit: 'kg', cost_per_unit: 150 },
      { ingredient_name: 'Agua', quantity: 18, unit: 'L', cost_per_unit: 0.1 },
    ],
  },
  {
    slug: 'suavizante-telas',
    name: 'Suavizante de telas',
    description: 'Suavizante perlado con buena fragancia residual.',
    yield_liters: 20,
    procedure: [
      'Calentar 5 L de agua a 40 °C.',
      'Agregar el suavizante base (cloruro de dialquil) y disolver bien.',
      'Enfriar y agregar color, fragancia y conservador.',
      'Completar con agua fría hasta el volumen final.',
    ].join('\n'),
    safety_notes: 'Evitar contacto con los ojos. Producto solo para uso textil.',
    ingredients: [
      { ingredient_name: 'Suavizante base (cloruro de dialquil)', quantity: 1.6, unit: 'kg', cost_per_unit: 70 },
      { ingredient_name: 'Color y fragancia', quantity: 0.1, unit: 'kg', cost_per_unit: 150 },
      { ingredient_name: 'Conservador', quantity: 0.05, unit: 'kg', cost_per_unit: 120 },
      { ingredient_name: 'Agua', quantity: 18, unit: 'L', cost_per_unit: 0.1 },
    ],
  },
];

export const PRODUCTS = [
  {
    name: 'S&F Lavatrastes Concentrado',
    category: 'Cocina',
    description: 'Lavatrastes rendidor con aroma a limón. Corta la grasa fácilmente.',
    presentations: [
      { size: '1 L', price: 38 }, { size: '5 L', price: 160 }, { size: '20 L', price: 590 },
    ],
    usage_instructions: 'Aplicar unas gotas en la esponja húmeda. Para grasa pesada, usar directo sin diluir.',
  },
  {
    name: 'S&F Multiusos Desinfectante',
    category: 'Superficies',
    description: 'Limpia y desinfecta superficies de cocina, baño y pisos.',
    presentations: [
      { size: '1 L', price: 32 }, { size: '5 L', price: 135 }, { size: '20 L', price: 500 },
    ],
    usage_instructions: 'Diluir 1 parte del producto en 10 de agua para limpieza general.',
  },
  {
    name: 'S&F Suavizante Aroma Primavera',
    category: 'Lavandería',
    description: 'Deja la ropa suave y con fragancia duradera.',
    presentations: [
      { size: '1 L', price: 30 }, { size: '5 L', price: 125 }, { size: '20 L', price: 460 },
    ],
    usage_instructions: 'Agregar 1 tapa por carga en el último enjuague.',
  },
];

export const DANGEROUS_MIXES = [
  {
    chemical_a: 'Cloro (hipoclorito de sodio)',
    chemical_b: 'Amoniaco',
    danger_level: 'alto',
    reaction: 'Libera gas cloramina, muy tóxico. Causa daño respiratorio grave.',
    first_aid: 'Salir al aire libre de inmediato, ventilar el área y buscar atención médica si hay dificultad para respirar.',
    prevention: 'Nunca combinar limpiadores clorados con productos con amoniaco. Etiquetar y almacenar por separado.',
  },
  {
    chemical_a: 'Cloro (hipoclorito de sodio)',
    chemical_b: 'Ácido (muriático / sarricida)',
    danger_level: 'alto',
    reaction: 'Libera gas cloro, altamente tóxico e irritante para vías respiratorias.',
    first_aid: 'Evacuar y ventilar. No respirar los vapores. Atención médica urgente si hay exposición.',
    prevention: 'No usar cloro junto con destapacaños o sarricidas ácidos. Enjuagar bien entre productos.',
  },
  {
    chemical_a: 'Peróxido de hidrógeno',
    chemical_b: 'Vinagre',
    danger_level: 'medio',
    reaction: 'Forma ácido peracético, corrosivo e irritante para piel, ojos y pulmones.',
    first_aid: 'Ventilar, enjuagar con agua la zona expuesta y buscar atención si persiste la irritación.',
    prevention: 'No combinar en el mismo recipiente. Usar por separado y enjuagar entre aplicaciones.',
  },
  {
    chemical_a: 'Cloro (hipoclorito de sodio)',
    chemical_b: 'Alcohol',
    danger_level: 'medio',
    reaction: 'Puede formar cloroformo y otros compuestos irritantes y tóxicos.',
    first_aid: 'Ventilar el área y evitar la inhalación. Buscar atención médica si hay mareo o náusea.',
    prevention: 'No mezclar desinfectantes con alcohol y cloro simultáneamente.',
  },
];

export const MACHINES = [
  { name: 'Mezcladora / agitador industrial', purpose: 'Mezclar y homogeneizar las fórmulas en grandes volúmenes.',
    approx_price_range: '$8,000 – $25,000 MXN', supplier_info: 'Proveedores de equipo químico y de alimentos.',
    module: 'maquinas', is_essential: false },
  { name: 'Envasadora / dosificadora', purpose: 'Llenar envases con volumen exacto de forma rápida.',
    approx_price_range: '$15,000 – $60,000 MXN', supplier_info: 'Equipos de envasado semiautomáticos.',
    module: 'maquinas', is_essential: false },
  { name: 'Etiquetadora', purpose: 'Colocar etiquetas de forma uniforme en botellas.',
    approx_price_range: '$6,000 – $20,000 MXN', supplier_info: 'Proveedores de empaque.',
    module: 'maquinas', is_essential: false },
  // Equipo mínimo:
  { name: 'Tambos / cubetas graduadas', purpose: 'Preparar y almacenar las mezclas.',
    approx_price_range: '$150 – $600 MXN', supplier_info: 'Ferretería o distribuidor de plásticos.',
    module: 'equipo-minimo', is_essential: true },
  { name: 'Báscula digital (hasta 40 kg)', purpose: 'Pesar los ingredientes con precisión.',
    approx_price_range: '$500 – $1,500 MXN', supplier_info: 'Tiendas de básculas o en línea.',
    module: 'equipo-minimo', is_essential: true },
  { name: 'Palas / agitadores manuales', purpose: 'Mezclar mientras arrancas sin máquina.',
    approx_price_range: '$80 – $300 MXN', supplier_info: 'Ferretería.',
    module: 'equipo-minimo', is_essential: true },
  { name: 'Equipo de protección (guantes, lentes, cubrebocas, mandil)', purpose: 'Protección personal obligatoria.',
    approx_price_range: '$300 – $900 MXN', supplier_info: 'Tienda de seguridad industrial.',
    module: 'equipo-minimo', is_essential: true },
  { name: 'Embudos y jarras dosificadoras', purpose: 'Envasar a mano sin desperdicio.',
    approx_price_range: '$100 – $400 MXN', supplier_info: 'Distribuidor de plásticos.',
    module: 'equipo-minimo', is_essential: true },
];

export const ARTICLES = {
  marketing: [
    { title: '1. Define tu marca y tu cliente', sort_order: 1,
      body: 'Antes de vender, define a quién le vendes (amas de casa, negocios, escuelas) y qué te hace diferente: precio, aroma, rendimiento o servicio a domicilio. Usa siempre el logo y los colores S&F para que te reconozcan.' },
    { title: '2. Redes sociales que sí venden', sort_order: 2,
      body: 'Publica antes/después de limpieza, testimonios de clientes y promociones de recarga. Facebook Marketplace y grupos locales funcionan muy bien para productos de limpieza. Sube fotos claras con el precio visible.' },
    { title: '3. Programa de recarga y fidelidad', sort_order: 3,
      body: 'Ofrece descuento por traer su envase a rellenar. Es económico para ti, ecológico y fideliza al cliente. Da una tarjeta: a la 10a recarga, una gratis.' },
    { title: '4. Venta a negocios (mayoreo)', sort_order: 4,
      body: 'Restaurantes, estéticas, escuelas y oficinas compran volumen constante. Ofrece presentación de 20 L con precio preferente y entrega programada.' },
  ],
  'formas-de-venta': [
    { title: 'Menudeo (botella individual)', sort_order: 1,
      body: 'Vende presentaciones de 1 L con buen margen. Ideal para vecinos y redes sociales. Margen típico: 50–70%.' },
    { title: 'Mayoreo (garrafa de 20 L)', sort_order: 2,
      body: 'Precio por litro más bajo, pero volumen alto y clientes recurrentes. Ideal para negocios.' },
    { title: 'Recarga / rellenado', sort_order: 3,
      body: 'El cliente trae su envase y pagas menos empaque. Excelente margen y fideliza.' },
    { title: 'Ruta de reparto', sort_order: 4,
      body: 'Organiza entregas por zona un día fijo a la semana para bajar costos y asegurar recompra.' },
  ],
};
