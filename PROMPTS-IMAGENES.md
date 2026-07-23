# 🎨 Prompts de imágenes para la plataforma S&F

Copia y pega cada prompt en el **generador de imágenes de GPT** (o DALL·E). Guarda cada resultado con el **nombre de archivo exacto** indicado, dentro de la carpeta `public/img/` del proyecto.

> **Importante:**
> - La aplicación **funciona sin las imágenes** (muestra gradientes verdes de respaldo). Al agregar cada imagen, esa sección se enriquece automáticamente. Puedes ir subiéndolas de a poco.
> - Los archivos de **módulos, productos, empty-state y patrón** deben ser **PNG con fondo transparente**. Los de **login y hero** llevan fondo (no transparente).
> - Si el generador solo permite tamaños fijos (1024×1024, 1792×1024…), genera el más cercano y recorta/escala al tamaño indicado.
> - Todos los prompts piden explícitamente **sin texto ni logotipos** dentro de la imagen (el logo real ya lo pone la app).

## Estilo común de todo el set
Estética SaaS premium eco: ilustraciones vectoriales modernas (flat/semi-flat) con sombreado de gradiente suave y motivo de gota de agua y hojas; productos como renders 3D limpios sobre fondo transparente; fondos como atmósferas suaves de gotas y hojas. Paleta de marca: verde `#2E8B2E`, verde oscuro `#1F6B22`, verde brillante `#3DA53D`, lima `#7AC943`, menta `#E4F3E4`, casi-blanco `#F2FAF2`; dorado `#F9A825` como acento mínimo y rojo `#C62828` solo para peligro.

---

## 1. `public/img/login-bg.png` — Fondo del inicio de sesión (1920×1080, CON fondo)

```
Fondo de pantalla de inicio de sesion horizontal en relacion de aspecto 16:9, resolucion 1920x1080 pixeles, para una plataforma SaaS premium de la marca de limpieza ecologica S&F. Composicion abstracta y eterea de eco-limpieza sobre un gradiente suave verde-menta; gotas de agua translucidas y cristalinas suspendidas y resbalando sobre una superficie limpia y brillante, hojas verdes frescas y estilizadas flotando con suavidad, ondas y salpicaduras muy delicadas, reflejos limpios y destellos sutiles con bokeh suave. Formas organicas y fluidas, sensacion de frescura, higiene y naturaleza. Estetica moderna, minimalista y premium. Ambiente luminoso, aireado y espacioso, con mucho espacio negativo y desenfoque atmosferico progresivo hacia el centro para superponer despues una tarjeta de login flotante; el interes visual (gotas, hojas, reflejos) se concentra hacia bordes y esquinas, dejando el centro mas despejado, difuminado y limpio. Iluminacion suave y difusa tipo luz de dia natural, sin contrastes duros. Paleta estricta: verde primario #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D y lima #7AC943 en hojas y reflejos, menta #E4F3E4 y casi-blanco #F2FAF2 dominando el centro, dorado #F9A825 solo en algun reflejo minimo. Fondo totalmente relleno (NO transparente) con el gradiente verde-menta ocupando todo el lienzo. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, palabra, numero, tipografia, logotipo, monograma ni marca de agua; solo elementos visuales abstractos y naturales (agua, gotas, hojas, luz).
```

---

## 2. `public/img/hero-dashboard.png` — Banner del panel (1600×500, CON fondo)

```
Banner web panoramico de bienvenida para el panel de control de una plataforma SaaS premium de limpieza profesional y ecologica S&F. Composicion horizontal ultra-ancha 1600x500 pixeles, pensada para superponer texto sobre el tercio izquierdo: el lado izquierdo debe quedar despejado, luminoso y casi vacio en tonos claros, mientras los elementos graficos se agrupan hacia el centro y la derecha. Sobre un gradiente suave que va del verde menta muy claro y casi-blanco a la izquierda hacia verdes mas saturados a la derecha, flotan con ligereza gotas de agua limpias y translucidas de distintos tamanos con reflejos brillantes, burbujas de jabon suaves y semitransparentes, y hojas verdes frescas y estilizadas (tipo eucalipto o menta). Algunas gotas y hojas con desenfoque sutil (bokeh) para dar profundidad, otras nitidas en primer plano. Formas curvas y organicas, equilibrio asimetrico con peso visual a la derecha, sensacion de frescura, higiene y naturaleza; composicion amable, positiva y respirable. Estilo SaaS premium, minimalista, sofisticado, calido, eco. Iluminacion suave y difusa tipo dia limpio, brillo higienico, sin contrastes duros. Paleta estricta: verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D, lima #7AC943, menta #E4F3E4, casi-blanco #F2FAF2, dorado #F9A825 solo como acento minimo. Fondo totalmente ambientado y relleno (NO transparente) de lado a lado; deja el lado izquierdo despejado para el texto. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, palabra, numero, tipografia, logotipo, monograma ni marca de agua; solo elementos graficos abstractos y organicos.
```

---

## 3. `public/img/mod-formulacion.png` — Módulo Formulación (900×650, TRANSPARENTE)

```
Ilustracion para el modulo de "formulacion de productos" de la plataforma S&F Industria de la limpieza. Estilo vectorial moderno flat/semi-flat con sombreado de gradiente suave y profundidad ligera, formas organicas y redondeadas, contornos limpios, acabado glossy pulcro y aireado, minimalista con abundante espacio negativo; sin fotorrealismo. Iluminacion suave y difusa sin sombras duras, brillo limpio y radiante. Sujeto: un bodegon de laboratorio limpio y luminoso con dos o tres vasos de precipitado y un matraz Erlenmeyer de vidrio transparente llenos de liquido verde translucido, con marcas de graduacion sutiles. Alrededor flotan gotas de liquido verde con reflejos, pequenas burbujas y salpicaduras organicas. Incorpora simbolos abstractos que evoquen una formula quimica: hexagonos moleculares conectados por lineas finas, pequenos circulos-atomo y una gota estilizada como icono central, todo esquematico y decorativo. Incluye una o dos hojas verdes frescas asomando entre el material. Paleta estricta: verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D y lima #7AC943, menta #E4F3E4 y casi-blanco #F2FAF2 en brillos y transparencias, dorado #F9A825 solo como acento minimo. Fondo 100% transparente (PNG con canal alfa): sin fondo, sin escenario, sin superficie; solo el conjunto recortado limpiamente. Encuadre horizontal 900x650 px, centrado con margenes generosos. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, numero, tipografia, logotipo ni marca de agua; los simbolos de formula deben ser puramente decorativos.
```

---

## 4. `public/img/mod-productos.png` — Módulo Nuestros productos (900×650, TRANSPARENTE)

```
Ilustracion para el modulo de productos de la plataforma S&F Industria de la limpieza: una linea de tres botellas de limpieza alineadas en fila, de frente y ligeramente en perspectiva tres cuartos. Estilo vectorial moderno flat/semi-flat con sombreado de gradiente suave y profundidad ligera, formas organicas redondeadas, contornos limpios, acabado glossy aireado, minimalista; sin fotorrealismo. Iluminacion suave y difusa, brillo limpio. De izquierda a derecha: 1) botella de lavatrastes con cuello estrecho y tapa dosificadora; 2) botella de multiusos con gatillo pulverizador; 3) botella de suavizante mas ancha y redondeada con tapon de rosca. Las tres comparten diseno unificado: siluetas organicas, etiquetas frontales en blanco con formas curvas y hojas estilizadas, plastico semitransparente con liquido verde y reflejos sutiles. Botellas escalonadas en altura para dar ritmo, mucho aire. Alrededor, pequenas burbujas, gotas translucidas y hojas verdes flotando sin saturar. Paleta estricta: verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D, lima #7AC943, menta #E4F3E4 y casi-blanco #F2FAF2 en etiquetas y brillos, dorado #F9A825 solo acento minimo. Nada de azules ni morados. Fondo 100% transparente (PNG con canal alfa): sin escena ni superficie. Relacion horizontal 900x650 px. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, palabra, numero, tipografia, logotipo ni marca de agua; las etiquetas en blanco o con formas abstractas de hojas y ondas.
```

---

## 5. `public/img/mod-marketing.png` — Módulo Cómo hacer marketing (900×650, TRANSPARENTE)

```
Ilustracion para el modulo de marketing de la plataforma S&F Industria de la limpieza. Estilo vectorial moderno flat/semi-flat con sombreado de gradiente suave y profundidad ligera, formas organicas redondeadas, contornos limpios, acabado glossy aireado, minimalista con mucho espacio en blanco; sin fotorrealismo. Iluminacion suave y difusa, brillo limpio. Sujeto protagonista: un megafono estilizado de formas organicas redondeadas, ligeramente inclinado hacia arriba a la derecha, transmitiendo energia y optimismo. Del megafono emergen y flotan pequenos iconos y burbujas: iconos genericos de redes sociales sin marcas reales (globo de conversacion, corazones/likes, campana de notificacion, simbolo de compartir), corazones ascendiendo y una flecha de crecimiento ascendente clara y dinamica en diagonal. Sensacion energetica, positiva y fresca. Incluye sutiles hojas verdes pequenas y una o dos gotas brillantes entre los iconos. Paleta estricta: verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D y lima #7AC943 (acentos y flecha), menta #E4F3E4 y casi-blanco #F2FAF2, dorado #F9A825 con moderacion en un par de destellos. Fondo 100% transparente (PNG con canal alfa): sin escena ni marcos. Relacion horizontal ~900x650 px. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, palabra, numero, tipografia, logotipo ni marca de agua; iconos genericos sin marca real.
```

---

## 6. `public/img/mod-maquinas.png` — Módulo Máquinas y equipo (900×650, TRANSPARENTE)

```
Ilustracion para el modulo "Maquinas" de la plataforma S&F Industria de la limpieza: una maquina industrial de acero inoxidable para mezclado y envasado de productos de limpieza, en vista tres cuartos ligeramente elevada, como unico protagonista con amplio aire limpio alrededor. Estilo vectorial moderno flat/semi-flat con sombreado de gradiente suave y profundidad ligera, formas organicas redondeadas combinadas con superficies tecnicas, contornos limpios, acabado glossy aireado, minimalista; sin fotorrealismo ni desgaste. Iluminacion suave y difusa tipo estudio, brillo higienico. Sujeto: gran tanque cilindrico vertical de acero pulido con reflejos suaves, tolva de mezclado superior, motor mezclador con eje y aspas insinuadas, panel de control lateral con perillas y diales minimalistas, ruedas o patas robustas, y tuberias curvas con valvulas que conectan a una pequena estacion de envasado con boquilla dosificadora y un envase generico. Detalles limpios: bridas, juntas, manometros redondos, mangueras ordenadas. Motivo sutil de gota y hojas a traves de reflejos verdes. Paleta estricta: cuerpo en acero claro (grises plateados con casi-blanco #F2FAF2 en reflejos), acentos en verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D (valvulas y tuberias) y menta #E4F3E4, lima #7AC943 solo en un indicador de estado y dorado #F9A825 acento minimo. Fondo 100% transparente (PNG con canal alfa): sin piso ni escenario, con sombra de contacto muy suave opcional. Encuadre horizontal 900x650 px con margenes. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, numero, etiqueta, tipografia, logotipo ni marca de agua.
```

---

## 7. `public/img/mod-mezclas-peligrosas.png` — Módulo Mezclas peligrosas (900×650, TRANSPARENTE)

```
Ilustracion de seguridad quimica ("no mezclar productos") para el modulo de mezclas peligrosas de la plataforma S&F Industria de la limpieza. Estilo vectorial moderno flat/semi-flat con sombreado de gradiente suave y profundidad ligera, formas organicas redondeadas, contornos limpios, acabado glossy aireado (glassmorphism ligero), minimalista con mucho espacio de respiro; sin fotorrealismo. Iluminacion suave y difusa, brillo limpio. Sujeto: en el centro, dos botellas de productos quimicos de limpieza estilizadas, una a la izquierda y otra a la derecha, con formas organicas suaves, tapones y etiquetas en blanco SIN texto. Entre ambas, una gran "X" clara y contundente que indica "no mezclar", formada por dos trazos redondeados. Encima y centrado, un simbolo de advertencia triangular con esquinas redondeadas y un signo de exclamacion dentro como icono principal de peligro. Alrededor, pequenas senales de precaucion flotantes sutiles y una hoja verde con gotas de agua. Paleta dominada por verdes: verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D, lima #7AC943, menta #E4F3E4 y casi-blanco #F2FAF2. EXCEPCION DE PELIGRO: el triangulo de advertencia, la "X" y las senales usan acentos ambar #F9A825 y rojo #C62828 de forma controlada e integrada con los verdes. Fondo 100% transparente (PNG con canal alfa): sin escenario ni marco. Relacion horizontal 900x650 px. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, palabra, numero, tipografia, logotipo ni marca de agua; etiquetas en blanco o formas abstractas.
```

---

## 8. `public/img/mod-equipo-minimo.png` — Módulo Equipo mínimo (900×650, TRANSPARENTE)

```
Ilustracion de un "kit de inicio" para fabricar productos de limpieza, para el modulo de equipo minimo de la plataforma S&F Industria de la limpieza. Composicion ordenada de equipo basico agrupado tipo flat-lay isometrico suave o vista tres cuartos ligeramente elevada, con los objetos separados y respirando. Estilo vectorial moderno flat/semi-flat con sombreado de gradiente suave y profundidad ligera, formas organicas redondeadas, contornos limpios, acabado glossy aireado, minimalista; sin fotorrealismo. Iluminacion suave y difusa, brillo limpio. Sujeto: objetos claramente identificables con equilibrio y aire: dos o tres cubetas o jarras graduadas de plastico translucido con marcas de medicion sutiles (sin numeros), una bascula digital con plataforma limpia, un par de guantes de proteccion, unos lentes de seguridad transparentes y un embudo de plastico. Pequenos detalles de hojas verdes y una o dos gotas translucidas flotando entre los objetos. Paleta estricta: verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D, lima #7AC943, menta #E4F3E4 y casi-blanco #F2FAF2, dorado #F9A825 acento minusculo. Fondo 100% transparente (PNG con canal alfa): sin piso ni fondo, con sombras de contacto muy tenues. Composicion horizontal 900x650 px, centrada con margenes generosos. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, numero, etiqueta, tipografia, logotipo ni marca de agua.
```

---

## 9. `public/img/mod-calculadora.png` — Módulo Calculadora (900×650, TRANSPARENTE)

```
Ilustracion para el modulo "Calculadora" (calculo de costos de dilucion y dosificacion) de la plataforma S&F Industria de la limpieza. Estilo vectorial moderno flat/semi-flat con sombreado de gradiente suave y profundidad ligera, formas organicas redondeadas, contornos limpios, acabado glossy aireado, minimalista con generoso espacio negativo; sin fotorrealismo. Iluminacion suave y difusa, brillo limpio. Sujeto principal: una calculadora estilizada de esquinas redondeadas y aspecto suave tipo 3D soft flat, flotando en el centro con ligera perspectiva isometrica. Alrededor, elementos que sugieren calculo de costos y dosificacion: una formula quimica ligera representada con iconos abstractos (matraz o gota con moleculas, simbolos suaves de mas, igual y porcentaje, lineas finas) y unas monedas o fichas de costo apiladas y flotando. Pequenas gotas de agua translucidas (verde translucido y menta con reflejos) y hojas organicas frescas integradas sin saturar. Paleta estricta: verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D y menta #E4F3E4 como base, lima #7AC943 en acentos y casi-blanco #F2FAF2 en brillos; dorado #F9A825 solo acento puntual en las monedas. Fondo 100% transparente (PNG con canal alfa): sin escenario ni sombra opaca. Relacion horizontal 900x650 px. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, numero legible, cifra en la pantalla de la calculadora ni en las teclas, tipografia, logotipo ni marca de agua.
```

---

## 10. `public/img/mod-usos.png` — Módulo Usos de los productos (900×650, TRANSPARENTE)

```
Ilustracion para el modulo "Usos" de la plataforma S&F Industria de la limpieza, con sensacion fresca y satisfactoria de limpieza reluciente. Estilo vectorial moderno flat/semi-flat con sombreado de gradiente suave y profundidad ligera, formas organicas redondeadas, contornos limpios, acabado glossy aireado, minimalista con amplio espacio negativo; sin fotorrealismo duro. Iluminacion suave y difusa, brillo limpio. Sujeto principal: una botella con atomizador (spray) de liquido limpiador, elegante y de formas organicas redondeadas, colocada en diagonal en el tercio izquierdo, rociando una fina nube de gotitas hacia una superficie horizontal brillante y limpia a la derecha; sobre esa superficie aparecen varios destellos de brillo (sparkles) de cuatro puntas y pequenas estrellas de limpieza que sugieren limpieza impecable. El liquido y las gotitas translucidos y frescos. Una gota de agua estilizada y una o dos hojas verdes suaves alrededor de la botella. Paleta estricta: verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D y lima #7AC943, menta #E4F3E4 y casi-blanco #F2FAF2 (gotas y brillos), dorado #F9A825 con moderacion en pequenos destellos. Fondo 100% transparente (PNG con canal alfa): sin escena ni marco. Relacion horizontal 900x650 px. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, numero, etiqueta, tipografia, logotipo ni marca de agua.
```

---

## 11. `public/img/mod-formas-de-venta.png` — Módulo Formas de venta (900×650, TRANSPARENTE)

```
Ilustracion de un pequeno punto de venta o puesto de barrio para el modulo "Formas de venta" de la plataforma S&F Industria de la limpieza. Composicion centrada en lienzo horizontal 900x650 px con generoso aire alrededor. Estilo vectorial moderno flat/semi-flat con sombreado de gradiente suave y profundidad ligera (toque 3D soft e isometrico), formas organicas redondeadas, contornos limpios, acabado glossy aireado, minimalista; sin fotorrealismo. Iluminacion suave y difusa, brillo limpio. Sujeto: un mostrador o puesto compacto con un toldo curvo y organico arriba; sobre el mostrador, varios productos de limpieza estilizados (botellas de spray, envases y frascos redondeados); delante, un pequeno monton de monedas y algunos billetes doblados; una etiqueta de precio colgante con forma de gota o de hoja (sin numeros ni texto); y una bolsa de compra reutilizable de papel apoyada a un lado. Pequenas hojas verdes y una o dos gotas brillantes flotando alrededor. Paleta estricta: verde #2E8B2E dominante, verde oscuro #1F6B22, verde brillante #3DA53D y lima #7AC943, menta #E4F3E4 y casi-blanco #F2FAF2, dorado #F9A825 solo acento puntual en las monedas. Fondo 100% transparente (PNG con canal alfa): sin color de relleno ni marco, ilustracion recortada y flotando con aire alrededor. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, palabra, numero, cifra de precio, tipografia, logotipo ni marca de agua; etiquetas y billetes en blanco o formas abstractas.
```

---

## 12. `public/img/product-lavatrastes.png` — Producto Lavatrastes (1000×1000, TRANSPARENTE)

```
Render de producto de una unica botella de lavatrastes concentrado de la marca premium S&F Industria de la limpieza. Formato cuadrado 1000x1000 px, composicion aireada y centrada. Render 3D limpio y semi-realista de gama publicitaria e-commerce; una sola botella centrada en vista tres cuartos, ligeramente elevada como en flotacion suave; silueta esbelta y organica con hombros redondeados que evocan una gota de agua; plastico translucido que deja ver el liquido verde interior fresco y brillante con microburbujas; etiqueta minimalista de forma organica en menta #E4F3E4 y casi-blanco #F2FAF2, con un pequeno relieve abstracto de gota de agua con una hoja, SIN texto. Tapa dosificadora tipo flip-top mate; el liquido interior con degradado del verde #2E8B2E al verde brillante #3DA53D con verde oscuro #1F6B22 en zonas densas. Iluminacion de estudio suave tipo softbox, luz principal desde arriba a la izquierda, leve rim light, reflejos especulares delicados, sombras muy suaves. Dos o tres gotas de agua cristalinas y una o dos hojas verdes frescas flotando cerca de la base con leve profundidad de campo. Paleta estricta: verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D, lima #7AC943, menta #E4F3E4, casi-blanco #F2FAF2, dorado #F9A825 solo destello minimo. Fondo 100% transparente (PNG con canal alfa): sin superficie ni suelo; solo el producto y sus pequenos elementos decorativos recortados. Alta resolucion, calidad publicitaria. MUY IMPORTANTE: la imagen NO debe contener ningun texto, palabra, letra, numero, tipografia, logotipo ni marca de agua; la etiqueta puramente grafica y abstracta.
```

---

## 13. `public/img/product-multiusos.png` — Producto Multiusos (1000×1000, TRANSPARENTE)

```
Render de producto de una botella con atomizador de spray de limpiador multiusos desinfectante, producto estrella de la marca premium S&F Industria de la limpieza. Formato cuadrado 1000x1000 px, una sola botella centrada ocupando ~80% del alto, con aire generoso. Render 3D limpio y semi-realista de gama publicitaria e-commerce; vista tres cuartos, ligeramente elevada como en flotacion; silueta esbelta y organica con hombros redondeados que evocan una gota; plastico translucido con liquido verde interior fresco y microburbujas; etiqueta minimalista de forma organica en menta #E4F3E4 y casi-blanco #F2FAF2, con relieve abstracto de gota con hoja, SIN texto. Cabezal atomizador (gatillo/spray) mate en verde oscuro #1F6B22 con detalles claros; liquido interior en verde #2E8B2E dominante con reflejos verde brillante #3DA53D y toques de lima #7AC943; una gota de agua o brillo humedo sobre la superficie. Iluminacion de estudio suave tipo softbox, luz principal arriba-izquierda, leve rim light, reflejos delicados, sombras muy suaves. Dos o tres gotas cristalinas y una o dos hojas verdes flotando cerca de la base con profundidad de campo. Paleta estricta: verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D, lima #7AC943, menta #E4F3E4, casi-blanco #F2FAF2, dorado #F9A825 destello minimo. Fondo 100% transparente (PNG con canal alfa): sin superficie ni sombra de suelo; bordes nitidos. Encuadre cuadrado 1:1, 1000x1000 px. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, palabra, numero, tipografia, logotipo ni marca de agua; etiqueta puramente grafica.
```

---

## 14. `public/img/product-suavizante.png` — Producto Suavizante (1000×1000, TRANSPARENTE)

```
Render de producto de una botella de suavizante para telas de la marca premium S&F Industria de la limpieza. Formato cuadrado 1000x1000 px, botella bien centrada con aire alrededor. Render 3D limpio y semi-realista de gama publicitaria e-commerce; vista tres cuartos, ligeramente elevada como en flotacion; silueta esbelta y organica con hombros redondeados que evocan una gota; plastico translucido que deja ver el liquido verde interior; etiqueta minimalista de forma organica en menta #E4F3E4 y casi-blanco #F2FAF2, con relieve abstracto de gota de agua y una flor u hoja estilizada, SIN texto. Botella un poco mas ancha y redondeada con tapon dosificador de rosca; liquido interior verde perlado y sedoso con sutil brillo nacarado, degradados del verde brillante #3DA53D iluminado al verde #2E8B2E y verde oscuro #1F6B22 en sombras internas. Iluminacion de estudio suave tipo softbox, luz principal arriba-izquierda, leve rim light, reflejos delicados sobre material translucido, transiciones muy suaves sin sombras duras. Dos o tres gotas cristalinas y una o dos hojas verdes flotando cerca de la base con profundidad de campo. Paleta estricta: verde #2E8B2E, verde oscuro #1F6B22, verde brillante #3DA53D, lima #7AC943, menta #E4F3E4, casi-blanco #F2FAF2, dorado #F9A825 destello minimo. Fondo 100% transparente (PNG con canal alfa): sin superficie ni suelo ni sombra proyectada. Composicion cuadrada 1:1, 1000x1000 px, detalle realista del material. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, palabra, numero, tipografia, logotipo ni marca de agua; etiqueta con formas abstractas de gota y flor.
```

---

## 15. `public/img/empty-state.png` — Estado vacío / sin acceso (800×800, TRANSPARENTE)

```
Ilustracion de "estado vacio" para la plataforma S&F Industria de la limpieza. Composicion cuadrada centrada 800x800 px con margenes generosos y mucho espacio negativo transparente. Estilo vectorial moderno flat/semi-flat con sombreado de gradiente suave y profundidad ligera, formas totalmente organicas y redondeadas, contornos limpios, acabado glossy aireado, minimalista; sin fotorrealismo. Iluminacion suave y difusa, brillo limpio, sensacion acogedora. Sujeto principal: una mascota simpatica con forma de gota de agua brillante, cuerpo redondeado tipo gota con la punta hacia arriba, cara amistosa con ojos grandes y expresivos, mejillas suaves y una sonrisa calida; esta de pie ligeramente inclinada y levanta uno de sus bracitos redondeados saludando con la mano abierta en gesto de bienvenida; superficie limpia y translucida con un reflejo blanco arriba; una hojita verde brota sobre la parte superior de la gota. Elemento secundario: a un lado, una puerta cerrada minimalista y redondeada (esquinas suaves, arco arriba) con un candado dorado visible en el centro que comunica de forma amable que el acceso esta bloqueado. Una o dos hojas flotando, pequenas gotitas o burbujas y un par de destellos de brillo, sutiles. Paleta estricta: verde #2E8B2E (cuerpo de la mascota), verde oscuro #1F6B22 (contornos y sombreado), verde brillante #3DA53D y lima #7AC943 (reflejos y hojas), menta #E4F3E4 y casi-blanco #F2FAF2 (brillos y volumenes claros), dorado #F9A825 solo para el candado y pequenos detalles. Fondo 100% transparente de verdad (PNG con canal alfa): sin relleno, sin degradado, sin rectangulo detras ni sombra de plano. Lienzo cuadrado 1:1, 800x800 px. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, numero, palabra, tipografia, logotipo, marca de agua ni firma; nada de carteles con texto sobre la puerta.
```

---

## 16. `public/img/pattern-droplets.png` — Patrón de fondo sutil (1200×1200, TRANSPARENTE, seamless)

```
Patron sin costura (seamless tile) muy sutil y minimalista de pequenas gotas de agua y hojitas organicas dispersas de forma uniforme sobre fondo totalmente transparente, como textura decorativa de fondo para la plataforma S&F Industria de la limpieza. Formas planas de contornos redondeados y suaves, estilo ilustracion vectorial delicada, lineas finas y siluetas simples, fresco, limpio, premium y eco. Gotas de agua simplificadas (forma de lagrima con suave brillo interior) y hojas menuditas tipo brote, en una reticula organica y espaciada con mucho aire entre elementos, distribucion dispersa pero perfectamente repetible en mosaico: las formas que tocan cualquier borde continuan del lado opuesto para un tileado perfecto sin uniones visibles (seamless en las cuatro direcciones). Iluminacion suave, gradientes muy sutiles, pequenos brillos en las gotas. Paleta en muy baja intensidad y tono pastel: principalmente menta #E4F3E4, con leves acentos de verde #2E8B2E, verde brillante #3DA53D y ligeros toques de verde oscuro #1F6B22 solo en pequenos detalles; elementos de baja opacidad, casi como marca de agua. Fondo 100% transparente (PNG con canal alfa): solo las formas de gotas y hojas sobre el vacio transparente, sin fondo, sin bordes, sin marcos. Formato cuadrado 1:1, 1200x1200 px, patron repetible sin costura. MUY IMPORTANTE: la imagen NO debe contener ningun texto, letra, numero, palabra, tipografia, logotipo ni marca de agua; solo formas abstractas de gotas y hojas.
```

---

## Después de generar las imágenes

1. Guarda cada archivo con su nombre exacto en `public/img/`.
2. Recarga la app: las portadas de módulos, el fondo del login, el banner del panel y las fotos de producto aparecerán automáticamente.
3. Si una imagen no se ve, revisa que el nombre del archivo coincida exactamente (todo en minúsculas, con guiones).
