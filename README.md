# Lombo Consultores — plantilla «Expediente»

> **Sitio de demostración.** Lombo Consultores es un negocio ficticio creado
> para mostrar esta plantilla. El nombre, la dirección, el teléfono, el
> equipo, los testimonios y la valoración son datos de muestra y no
> corresponden a ningún despacho real. Antes de fijar el nombre se comprobó
> en la web: existen "Souto Asesores" y "Asesoría Morán y Souto" en
> A Coruña, así que se descartó el candidato inicial ("Souto Consultores")
> y se eligió **Lombo** (que además encaja con el concepto: el lomo es la
> pieza que sujeta las pestañas de una carpeta).

Web estática (HTML + CSS + un `main.js`, sin build ni framework) para una
asesoría fiscal, laboral, contable y de sociedades ficticia en Cambre
(A Coruña). Pensada como plantilla reutilizable para clientes reales del
sector.

## El concepto: «Expediente»

La idea visual de la que cuelga toda la web es **la carpeta de despacho con
una pestaña de color por área**. En una gestoría real, el objeto que de
verdad ves cuando entras es la carpeta del cliente sobre la mesa, con sus
separadores de colores asomando: fiscal, laboral, contable, sociedades. El
gesto que firma el sitio es **abrir una pestaña**, no sumar una columna de
números ni estampar un sello — por eso no hay cifras protagonistas en
ningún sitio de la web (ni facturación, ni ahorro, ni porcentajes).

Es el cuarto concepto de una tanda de cuatro plantillas ficticias del mismo
sector (asesoría fiscal/laboral/contable/sociedades), autorizada como
excepción puntual en `SECTORES.md` porque el nicho ya ha dado varios
clientes reales. Los otros tres, construidos en paralelo por otros agentes,
usan los conceptos «Sello», «Casillas» y «Cinta sumadora» — «Expediente» no
se solapa con ninguno.

## Mapa de secciones

Cinco secciones, deliberadamente más grandes y menos numerosas que en el
resto de plantillas del lote, porque aquí el contenido vive **dentro** del
cambio de pestaña en vez de reparado en muchos bloques cortos:

1. **Portada** (`#inicio`) — la carpeta se abre al cargar (cortina de
   entrada) y el hero enseña, ya fijas, las cuatro pestañas de color sobre
   el nombre del despacho.
2. **Navegación por pestañas** (`#areas` → `#expediente`) — las cuatro
   áreas como pestañas físicas. En escritorio, con movimiento, la sección
   se ancla y se recorre con **scrub horizontal** (recurso protagonista):
   el scroll pasa las páginas del expediente como si fueran hojas, y la
   pestaña activa se adelanta con más sombra mientras las otras se quedan
   atrás. Cada página fusiona los servicios de esa área **y** su trámite o
   fecha clave en un único bloque (no hay una sección de calendario
   aparte). Sin movimiento o en móvil, las cuatro páginas se leen apiladas
   y las pestañas son enlaces normales que saltan a cada una.
3. **Confianza** (`#confianza`) — un documento aparte «grapado» con un
   clip metálico dibujado en SVG: la valoración interna (4,8/5, encuesta
   propia, marcada explícitamente como no procedente de ninguna
   plataforma) y tres testimonios ficticios con nombre de pila.
4. **Equipo** (`#equipo`) — dos fichas de personal dentro de la misma
   carpeta, con nombre, cargo y bio completos.
5. **Contacto + pie** (`#contacto`) — la última «pestaña»: ficha del
   despacho, mapa de Google solo bajo clic, botón de WhatsApp flotante y
   el pie con el sello de demostración obligatorio.

## Paleta

Multi-acento, una pestaña por área, todas desaturadas para que convivan:

| Token | Uso | Valor |
|---|---|---|
| `--manila` | fondo base | `#E8DFC8` |
| `--crema` / `--papel` | paneles y "papel" | `#F4EEE0` / `#FBF8F1` |
| `--tinta` | texto principal, pie oscuro | `#2B241C` |
| `--fiscal` | pestaña fiscal | `#33473C` (verde botella) |
| `--laboral` | pestaña laboral | `#5C6B72` (azul grisáceo) |
| `--contable` | pestaña contable | `#9C5A42` (terracota) |
| `--sociedades` | pestaña sociedades | `#5C3A4E` (ciruela) |

**Texto apagado nunca con `opacity`.** Cada pareja fondo/texto tiene su
propio token, calculado con un script de razón WCAG
(`contraste.py`, ver más abajo) en vez de a ojo:

- `--apagado` (`#5F574B`) da 5,36:1 sobre manila, 6,15:1 sobre crema y
  6,71:1 sobre papel.
- El verde (`--fiscal`) y la ciruela (`--sociedades`) ya cumplen AA
  directamente como texto (7,51:1 y 7,29:1 sobre manila). El azul
  grisáceo y la terracota **no** llegaban (4,16:1 y 4,00:1), así que se
  definieron `--laboral-texto` (`#556065`, 4,87:1) y `--contable-texto`
  (`#8B523C`, 4,69:1) solo para letras; el acento de marca original se
  queda intacto en fondos, pestañas y filetes.
- Sobre cualquiera de los cuatro rellenos de acento, el texto va siempre
  en `--sobre-acento` (un tono papel), que da entre 5,01:1 y 9,40:1 —
  nunca en manila, que solo da 4,00–4,16:1 sobre laboral/contable y no
  pasa AA.

## Tipografía

Google Fonts, `Source Serif 4` (cuerpo y titulares) + `Special Elite`
(máquina de escribir, para las etiquetas de pestaña y el sello de la
cortina de entrada). Antes de cerrarlas se comprobaron los glifos €, ñ,
tildes y « » con una captura ampliada de ambas fuentes
(`screenshots/fuente-glifos.png`): las dos los tienen completos, incluida
Special Elite (que es la que más solía fallar en plantillas anteriores de
esta biblioteca).

## Movimiento

Mínimo cinco recursos del §2 del pliego, todos ligados al concepto:

1. **Lenis** — único motor de scroll de la página (`lerp: 0.18`, más alto
   de lo habitual: con un panel anclado y scrub horizontal, el lerp por
   defecto se lee como que el contenido "va al revés" un instante).
2. **Char-reveal** — los titulares (`data-revelar`) entran palabra a
   palabra.
3. **Galería anclada con scrub horizontal** (recurso protagonista) — el
   expediente (`#expediente`) se fija en pantalla y el scroll mueve la
   tira de las cuatro páginas en horizontal.
4. **Botones magnéticos** (`data-iman`) — en el CTA "Pedir una reunión" y
   en el botón flotante de WhatsApp.
5. **Cursor personalizado** — cambia sobre las cuatro pestañas físicas y
   muestra "abrir [área]"; también se activa sobre el clip metálico y el
   botón de WhatsApp.

Además, de regalo: apariciones por `IntersectionObserver` en las tarjetas
de confianza y equipo.

**Cortina de entrada** (no cuenta para el mínimo, es obligatoria aparte):
la carpeta empieza "cerrada" —dos tapas cubriendo la pantalla, con las
cuatro pestañas asomando arriba y un sello "EXPEDIENTE ABIERTO" en el
centro— y se abre como una puerta de dos hojas (`rotateY` + `expo.inOut`)
para revelar el hero. Retirada garantizada: sin GSAP o con movimiento
reducido se quita al instante (`js/main.js`, función `cortina()`), y hay
además una red de seguridad por `setTimeout` a los 3,6 s por si algo se
cuelga.

## Trampas del §6 que mordieron de verdad

Todas cazadas y corregidas durante la verificación con Playwright, no solo
leyendo el código:

1. **`xPercent` mal calculado en el scrub horizontal.** El cálculo
   ingenuo `xPercent: -100 * (n - 1)` asume que el porcentaje es relativo
   al ancho de **una** página, pero GSAP lo aplica sobre el ancho **propio**
   del elemento animado (la tira entera, 400 % = 4 páginas). Con n = 4 eso
   desplazaba casi dos tiras completas de más y dejaba el expediente
   **en blanco** durante todo el centro del scrub. Fórmula correcta:
   `xPercent: -100 * (n - 1) / n`. Se detectó comparando el
   `getBoundingClientRect()` de cada `.pagina` contra el marco visible en
   mitad del scrub, no mirando la captura final.
2. **La cabecera sticky tapaba las etiquetas de las pestañas físicas**
   durante el anclaje: el pin empezaba en `"top top"`, así que el
   expediente anclaba justo a `top:0`, debajo de una cabecera que también
   vive en `top:0` con más `z-index`. Se ancla ahora con
   `start: "top " + altoCabecera` (alto real de `#cabecera`, medido en
   tiempo de ejecución), dejando el hueco exacto.
3. **El menú móvil abría pero no cerraba** — la trampa exacta que avisa el
   pliego: `.nav` (el panel del menú) llevaba `z-index: 130` y
   `.hamburguesa` no llevaba ninguno, así que el propio panel del menú
   tapaba el botón y el segundo clic no llegaba a ningún sitio. Se cazó
   con un `page.click('#hamburguesa')` de Playwright que agotaba el
   timeout, no mirando la captura. Arreglado dándole a `.hamburguesa`
   `z-index: 140`.
4. **La cortina no dejaba ver la apertura.** El contenedor `.cortina`
   tenía su propio fondo manila además de las dos tapas; aunque las tapas
   giraran hacia fuera, el contenedor seguía pintando el mismo color por
   detrás y la apertura no se veía nunca (solo el antes y el después). Se
   quitó el fondo del contenedor (`background: transparent`), dejando que
   solo las dos tapas cubran.

## Qué tocar para reskinearla a un cliente real

- **Colores**: las cuatro variables `--fiscal`/`--laboral`/`--contable`/
  `--sociedades` en `css/style.css` (bloque `:root`). Si el nuevo acento no
  llega a AA como texto, no cambiar el acento: añadir un
  `--nombre-texto` nuevo como se hizo con laboral y contable, y recalcular
  con `contraste.py`.
- **Nombre, dirección, teléfono, correo, horario**: buscar y reemplazar
  "Lombo Consultores" / "Rúa do Mercado 9" / "981 00 00 47" /
  "ola@lomboconsultores.example" en `index.html`, `404.html`,
  `aviso-legal.html`, `manifest.json` y el JSON-LD del `<head>`.
- **Áreas y trámites**: las cuatro `<article class="pagina">` dentro de
  `#expediente-tira`. Si el cliente tiene más o menos de cuatro áreas,
  cambiar `n` se resuelve solo (el JS lee `paginas.length`), pero hay que
  añadir/quitar también el `<a class="pestana-boton">` correspondiente y
  una variable de color más si hace falta.
- **Logotipo**: `assets/logo.svg` y `assets/favicon.svg`, mismo lenguaje
  (carpeta + pestañas). El monograma "LC" del centro es lo único que hay
  que rehacer con las iniciales reales.
- **Equipo y testimonios**: sustituir directamente, cuidando que las
  reseñas sigan sin atribuirse a ninguna plataforma (ver `PLIEGO.md §1`).
- **Mapa**: cambiar la query de `js/main.js` (`function mapa()`), que hoy
  apunta a "Cambre, A Coruña" sin calle porque la dirección es inventada.

## El control de paleta (demostración, quitar antes de dar la web por oficial)

Mando flotante abajo a la izquierda (`#paleta`) para enseñar la misma
carpeta con cuatro combinaciones de las cuatro pestañas delante del
cliente, sin reeditar el CSS en directo. Nació el mismo día en que, en
una reunión real con Dourado & Fernández (otra asesoría de la biblioteca),
el cliente dijo que no le gustaba el verde del sitio — desde entonces es
requisito de `PLIEGO.md §5` para toda la carpeta.

**Por qué el rojo de Dourado es ahora el color de arranque (2026-09-21)**:
las siete plantillas de asesoría/gestoría de la biblioteca se envían por
email a Dourado & Fernández, cliente real, para que elijan qué
**estructura** prefieren — no qué color. Como ya tienen su propia web en
su rojo de marca, ese rojo se saca de su paleta real (`--oro` #9C2A2E y
sus tonos vecinos) y se convierte en el arranque por defecto de las siete,
sin `localStorage`: así el color deja de ser una variable al comparar y lo
único que cambia entre plantillas es el concepto. El ensemble nativo de
esta plantilla no desaparece: pasa a ser la opción "Manila", uno de los
cuatro botones del mando.

**Caso especial de esta plantilla**: a diferencia de un sitio de acento
único (donde el mando cambia "el color de marca"), aquí no hay un único
acento — hay **cuatro pestañas de área**. El mando no cambia una variable,
cambia el ensemble completo de las cuatro a la vez, con sus pares
`-texto` recalculados a ≥4.5:1 sobre `--manila` (mismo método que
`--laboral-texto`/`--contable-texto` en el bloque `:root`). El papel, la
tinta y las líneas nunca cambian. Para "Burdeos" solo hace falta recalcular
`--contable-texto` (las otras tres pestañas ya pasan 4.5:1 con su propio
tono de marca) porque, a diferencia de Manila, ninguna de las cuatro puede
alejarse del rojo de Dourado sin dejar de leerse como su color.

Las cuatro paletas:

| Paleta | Fiscal | Laboral | Contable | Sociedades |
|---|---|---|---|---|
| **Burdeos** (rojo Dourado & Fernández, por defecto) | `#9C2A2E` su `--oro` exacto | `#7A1418` oxblood (su `--oro-tinta`) | `#B2413F` ladrillo polvoriento (su `--salvia`) | `#5C1114` vino/ciruela oscuro (su `--verde`) |
| **Manila** (el ensemble nativo original) | `#33473C` verde botella | `#5C6B72` azul grisáceo | `#9C5A42` terracota | `#5C3A4E` ciruela |
| **Ártico** (mood frío/glaciar) | `#1F4A5E` petróleo | `#55707D` gris acero | `#8C5C68` malva polvo | `#4A4770` índigo violeta |
| **Terracota** (mood cálido/tierra) | `#4A3222` café tostado | `#7A6B2E` oliva | `#AE5C2C` óxido | `#6E2E3C` vino |

Las cuatro tonalidades de Burdeos son deliberadamente parientes tonales de
un solo rojo (nunca se cruza a azul/verde/teal como sí hacen Ártico o
Terracota): `--fiscal`, la pestaña más prominente, es el rojo exacto de
Dourado; las otras tres son valores reales de su propia paleta (oro-tinta,
salvia, verde), no inventados, para que el conjunto se reconozca sin
ambigüedad como "el rojo de Dourado & Fernández" nada más abrir el email.

Para quitarlo al entregar la web ya como oficial:

1. En `index.html`: borrar el `<script>` de cabecera que resuelve
   `expediente-paleta` desde `localStorage` (justo antes de `</head>`) y
   el bloque `<div class="paleta" id="paleta" hidden>…</div>` (junto al
   botón de WhatsApp).
2. En `css/style.css`: borrar los bloques `html.paleta-manila` /
   `html.paleta-artico` / `html.paleta-terracota` (justo tras cerrarse el
   `:root`) y el bloque "Control de paleta (demostración…)" junto al CSS
   de WhatsApp. El bloque `:root` se queda tal cual, con el rojo Burdeos
   como color final — si el cliente real de esta copia concreta prefiere
   otra de las cuatro (p. ej. Manila), copiar sus 8 valores (`--fiscal`/
   `--laboral`/`--contable`/`--sociedades` + los cuatro `-texto`) desde su
   bloque `html.paleta-*` al `:root` antes de borrar ese bloque.
3. En `js/main.js`: borrar la función `initPaleta()` completa (vive junto
   a `menu()`, `cookies()` y `mapa()`, dentro del bloque "funciona con o
   sin GSAP").
4. Comprobar que no queda ningún `html.paleta-*` en el HTML servido (con
   el mando puesto en cualquier paleta que no sea Burdeos, la clase queda
   grabada en `localStorage`; recargar una vez sin el script de cabecera
   para limpiarla, o borrar manualmente la clave `expediente-paleta`).

## Créditos

Sin fotografías (el sector no las exige); toda la obra gráfica es SVG
propia. Detalle en `CREDITOS.md`.

## Verificación (§7 del pliego)

Hecha con Playwright/Chromium real, no solo leyendo el código:

- Abierta en 1440×900 y 390×844, con scroll real (`mouse.wheel`, nunca
  `window.scrollTo`, que con Lenis activo no dispara los `ScrollTrigger`).
- Capturas de cada sección en `screenshots/` (prefijo `d-` escritorio,
  `m-` móvil, `sg-` sin GSAP, `rm-` movimiento reducido, `cortina-` la
  cortina de entrada, `otros-` 404 y aviso legal).
- Consola limpia y cero peticiones fallidas en las tres pasadas
  (normal, sin GSAP, movimiento reducido).
- Pasada con GSAP bloqueado (`route.abort` de `cdn.jsdelivr.net`): la
  página se lee entera, apilada, y las pestañas cambian con un simple
  clic.
- Pasada con `prefers-reduced-motion: reduce`: sin animación, pero el
  contenido (qué pestaña está activa) sigue cambiando al clicar.
- Botones de cookies, menú móvil y mapa probados por clic real, no
  asumidos.
- Repasado el §1 entero: sin nombres, direcciones exactas ni reseñas
  atribuidas a plataformas reales; sin `aggregateRating` en el JSON-LD;
  `noindex, nofollow` en las tres páginas.

Pendiente (no bloqueante, deuda técnica declarada como en el resto de la
biblioteca): medición de `longtask` con `PerformanceObserver`, auditoría
automática tipo axe-core, y pruebas en Firefox/Safari o con lector de
pantalla real.
