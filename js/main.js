/* ==========================================================================
   LOMBO CONSULTORES — plantilla de demostración (negocio ficticio)
   Concepto «Expediente». GSAP, ScrollTrigger y Lenis por CDN; sin ellos la
   página se lee entera y las cuatro pestañas se leen apiladas, no ancladas.
   ========================================================================== */

(function () {
  "use strict";

  var raiz = document.documentElement;
  var mqReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducido = mqReducido.matches;
  var gsapListo = !!(window.gsap && window.ScrollTrigger);
  var movimiento = gsapListo && !reducido;

  if (gsapListo) { window.gsap.registerPlugin(window.ScrollTrigger); }
  if (movimiento) { raiz.classList.add("has-motion"); }
  if (reducido) { raiz.classList.add("reduce-motion"); }

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ======================================================================
     0. CORTINA DE ENTRADA — retirada garantizada
     La carpeta cierra la pantalla y se retira. Sin GSAP o con movimiento
     reducido se quita al instante: nunca deja la página tapada.
     ====================================================================== */
  (function cortina() {
    var capa = $("#cortina");
    if (!capa) { return; }

    function quitar() {
      if (!capa || !capa.parentNode) { return; }
      capa.parentNode.removeChild(capa);
      capa = null;
    }

    if (!movimiento) { quitar(); return; }

    var gsap = window.gsap;
    var izq = $("#cortina-izq"), der = $("#cortina-der"), sello = $("#cortina-sello");

    gsap.set(sello, { scale: 1.5, opacity: 0 });

    var tl = gsap.timeline({ onComplete: quitar });
    tl.to(sello, { scale: 1, opacity: 1, duration: .55, ease: "back.out(2.2)" })
      .to({}, { duration: .5 }) /* el expediente se queda un instante a la vista */
      .to(sello, { opacity: 0, duration: .3, ease: "power1.out" }, "+=.05")
      .to(izq, { rotateY: -108, x: "-4%", duration: .95, ease: "expo.inOut" }, "<")
      .to(der, { rotateY: 108, x: "4%", duration: .95, ease: "expo.inOut" }, "<")
      .set(capa, { display: "none" });

    /* red de seguridad: si algo se cuelga (fuente que no carga, timeline que
       no arranca), la carpeta se retira igualmente a los 3,6 s. */
    setTimeout(quitar, 3600);
  })();

  /* ======================================================================
     1. CONTENIDO — funciona con o sin GSAP
     ====================================================================== */

  (function menu() {
    var boton = $("#hamburguesa"), nav = $("#nav");
    if (!boton || !nav) { return; }
    function cerrar() {
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-label", "Abrir menú");
      nav.classList.remove("esta-abierto");
    }
    boton.addEventListener("click", function () {
      var abierto = boton.getAttribute("aria-expanded") === "true";
      boton.setAttribute("aria-expanded", abierto ? "false" : "true");
      boton.setAttribute("aria-label", abierto ? "Abrir menú" : "Cerrar menú");
      nav.classList.toggle("esta-abierto", !abierto);
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", cerrar); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("esta-abierto")) { cerrar(); boton.focus(); }
    });
  })();

  (function cookies() {
    var banner = $("#cookie-banner"), ok = $("#cookie-ok");
    if (!banner || !ok) { return; }
    var CLAVE = "lombo-cookies";
    var aceptado = false;
    try { aceptado = localStorage.getItem(CLAVE) === "1"; } catch (e) {}
    if (!aceptado) { banner.hidden = false; }
    ok.addEventListener("click", function () {
      banner.hidden = true;
      try { localStorage.setItem(CLAVE, "1"); } catch (e) {}
    });
  })();

  /* ---------------- El control de paleta ----------------
     NO ES PARTE DEL SITIO. Es un mando para enseñar la misma carpeta con
     cuatro combinaciones de las cuatro pestañas delante del cliente
     mientras decide. Al entregar la web ya como oficial se borra esta
     función, el bloque .paleta del CSS, el <div id="paleta"> y la bandera
     del <head>. Funciona con o sin GSAP: no depende del bloque de
     movimiento.
     "burdeos" (el rojo real de Dourado & Fernández) es el estado por
     defecto: sin clase en <html>, igual que "manila" lo era antes de este
     cambio. Las otras tres viven como clases explícitas "paleta-*". */
  (function initPaleta() {
    var caja = $("#paleta");
    var botones = {
      burdeos: $("#paleta-burdeos"),
      manila: $("#paleta-manila"),
      artico: $("#paleta-artico"),
      terracota: $("#paleta-terracota")
    };
    if (!caja || !botones.burdeos || !botones.manila || !botones.artico || !botones.terracota) { return; }
    var CLAVE_PALETA = "expediente-paleta";

    caja.hidden = false; // sin JS no se enseña: no haría nada

    /* Este sitio no tenía ya una convención --cookie-h para que los
       flotantes esquiven el aviso de cookies (el WhatsApp no la usa: vive
       en la esquina contraria). Como el mando sí puede solapar el aviso
       —ambos anclados abajo—, se mide aquí su alto real. */
    function ajustarPorCookies() {
      var banner = $("#cookie-banner");
      var alto = (banner && !banner.hidden) ? banner.offsetHeight : 0;
      document.documentElement.style.setProperty("--paleta-cookie-h", alto ? (alto + 14) + "px" : "0px");
    }
    ajustarPorCookies();
    window.addEventListener("resize", ajustarPorCookies);
    var cookieOk = $("#cookie-ok");
    if (cookieOk) { cookieOk.addEventListener("click", function () { setTimeout(ajustarPorCookies, 0); }); }

    function pintar(nombre, guardar) {
      document.documentElement.classList.remove("paleta-manila", "paleta-artico", "paleta-terracota");
      if (nombre !== "burdeos") { document.documentElement.classList.add("paleta-" + nombre); }
      Object.keys(botones).forEach(function (k) {
        botones[k].setAttribute("aria-pressed", String(k === nombre));
      });
      if (guardar) { try { localStorage.setItem(CLAVE_PALETA, nombre); } catch (e) {} }
    }

    var actual = document.documentElement.classList.contains("paleta-manila") ? "manila"
      : document.documentElement.classList.contains("paleta-artico") ? "artico"
      : document.documentElement.classList.contains("paleta-terracota") ? "terracota" : "burdeos";
    pintar(actual, false);
    botones.burdeos.addEventListener("click", function () { pintar("burdeos", true); });
    botones.manila.addEventListener("click", function () { pintar("manila", true); });
    botones.artico.addEventListener("click", function () { pintar("artico", true); });
    botones.terracota.addEventListener("click", function () { pintar("terracota", true); });
  })();

  (function mapa() {
    var boton = $("#mapa-boton"), caja = $("#mapa");
    if (!boton || !caja) { return; }
    boton.addEventListener("click", function () {
      var marco = document.createElement("iframe");
      /* la localidad, nunca una calle: la dirección del despacho es inventada */
      marco.src = "https://www.google.com/maps?q=Cambre+A+Coru%C3%B1a&output=embed";
      marco.title = "Mapa de Cambre, A Coruña (la dirección del despacho es ficticia)";
      marco.loading = "lazy";
      marco.referrerPolicy = "no-referrer-when-downgrade";
      marco.setAttribute("width", "600");
      marco.setAttribute("height", "280");
      caja.insertBefore(marco, boton.nextSibling);
      boton.remove();
    });
  })();

  /* --- Contenedores con scroll accesibles por teclado, solo si desbordan --- */
  (function scrollAccesible() {
    var cajas = $$("[data-scroll-teclado]");
    if (!cajas.length) { return; }
    function revisar() {
      cajas.forEach(function (c) {
        var desborda = (c.scrollWidth > c.clientWidth + 4) || (c.scrollHeight > c.clientHeight + 4);
        if (desborda) { c.setAttribute("tabindex", "0"); }
        else { c.removeAttribute("tabindex"); }
      });
    }
    revisar();
    window.addEventListener("resize", revisar);
    window.addEventListener("load", revisar);
  })();

  /* ======================================================================
     2. EL EXPEDIENTE — pestaña activa, funciona sin GSAP
     Sin movimiento: las cuatro páginas están apiladas y los enlaces de las
     pestañas físicas son anclas normales que saltan a su página. Con
     movimiento, además, se ancla y se recorre con scrub horizontal.
     ====================================================================== */
  var pestanas = $$(".pestana-boton");
  var paginas = $$(".pagina", $("#expediente-tira"));

  function activarPestana(indice) {
    pestanas.forEach(function (a, i) {
      var activa = i === indice;
      a.classList.toggle("esta-activa", activa);
      if (activa) { a.setAttribute("aria-current", "true"); } else { a.removeAttribute("aria-current"); }
    });
    paginas.forEach(function (p, i) { p.classList.toggle("pagina--activa", i === indice); });
  }

  (function pestanasBase() {
    if (!pestanas.length || !paginas.length) { return; }
    pestanas.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        /* con el expediente anclado, el clic recalcula la posición de scroll
           en vez de saltar directo (ver expedientePin); sin anclaje, el salto
           normal del navegador a la página ya es correcto. */
        if (!estaAnclado) { activarPestana(i); return; }
        e.preventDefault();
        irAPagina(i);
      });
    });
  })();

  var estaAnclado = false;
  var irAPagina = function () {}; /* la rellena expedientePin() si hay movimiento */

  /* ======================================================================
     3. MOVIMIENTO
     ====================================================================== */
  if (!movimiento) { return; }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  var lenis = null;
  if (window.Lenis) {
    /* lerp más alto de lo habitual: en un panel anclado con scrub horizontal
       el asentamiento por defecto de Lenis se lee como que el contenido va
       al revés durante un instante. */
    lenis = new window.Lenis({ lerp: 0.18, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      if (a.closest(".pestanas-fisicas")) { return; } /* las pestañas llevan su propio salto */
      a.addEventListener("click", function (e) {
        var destino = document.querySelector(a.getAttribute("href"));
        if (!destino) { return; }
        e.preventDefault();
        lenis.scrollTo(destino, { offset: -70 });
      });
    });
  }

  function alEntrar(el, hacer) {
    if (!("IntersectionObserver" in window)) { hacer(); return; }
    var io = new IntersectionObserver(function (ent) {
      ent.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); hacer(); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
    io.observe(el);
  }

  function titulares() {
    $$("[data-revelar]").forEach(function (el) {
      var texto = (el.textContent || "").replace(/\s+/g, " ").trim();
      el.setAttribute("aria-label", texto);
      el.textContent = "";
      var frag = document.createDocumentFragment();
      var partes = [];
      texto.split(" ").forEach(function (palabra) {
        var caja = document.createElement("span");
        caja.className = "palabra";
        caja.setAttribute("aria-hidden", "true");
        var dentro = document.createElement("i");
        dentro.textContent = palabra;
        caja.appendChild(dentro);
        frag.appendChild(caja);
        frag.appendChild(document.createTextNode(" "));
        partes.push(dentro);
      });
      el.appendChild(frag);
      /* y:0 explícito: GSAP lee el translate3d(0,120%,0) del CSS como `y` en
         píxeles, no como yPercent; si no se fija, el titular se queda clavado. */
      gsap.set(partes, { y: 0, yPercent: 120 });
      alEntrar(el, function () {
        gsap.to(partes, { yPercent: 0, duration: 0.7, ease: "power3.out", stagger: 0.04 });
      });
    });
  }

  function apariciones() {
    $$("[data-aparecer]").forEach(function (el, i) {
      alEntrar(el, function () {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: (i % 4) * 0.06 });
      });
    });
  }

  /* --- El expediente: se ancla y se recorre con scrub horizontal --------
     Recurso protagonista. El progreso del scroll mueve la tira de páginas en
     horizontal (xPercent) y decide qué pestaña física va "adelante". */
  function expedientePin() {
    var contenedor = $("#expediente");
    var tira = $("#expediente-tira");
    if (!contenedor || !tira || !paginas.length || window.innerWidth < 900) { return; }

    contenedor.classList.add("esta-anclado");
    estaAnclado = true;
    var n = paginas.length;
    var distancia = Math.round(window.innerHeight * (1.65 * n));
    /* la cabecera es sticky y se queda por encima del anclaje: si el pin
       empieza en "top top" el expediente ancla justo debajo del header, pero
       el header la SOLAPA (mismo top:0) y tapa las etiquetas de las pestañas.
       Se ancla dejando el hueco exacto de la cabecera. */
    var altoCabecera = ($("#cabecera") || {}).offsetHeight || 0;

    var st;
    /* OJO: xPercent es relativo al ANCHO PROPIO de la tira (400% = 4
       páginas), no al de una sola página. Para recorrer (n-1) páginas hay
       que mover (n-1)/n de ese ancho propio, no (n-1) enteros: con n=4 el
       cálculo ingenuo (-300%) desplazaba casi dos tiras completas y dejaba
       el expediente en blanco durante todo el centro del scrub. */
    var tw = gsap.to(tira, {
      xPercent: -100 * (n - 1) / n,
      ease: "none",
      scrollTrigger: {
        trigger: contenedor,
        start: "top " + altoCabecera,
        end: "+=" + distancia,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var indice = Math.min(n - 1, Math.round(self.progress * (n - 1)));
          activarPestana(indice);
        }
      }
    });
    st = tw.scrollTrigger;

    irAPagina = function (indice) {
      var destino = st.start + (indice / (n - 1)) * (st.end - st.start);
      if (lenis) { lenis.scrollTo(destino, { duration: 1 }); }
      else { window.scrollTo({ top: destino, behavior: "smooth" }); }
    };
  }

  function imanes() {
    if (!window.matchMedia("(hover:hover)").matches) { return; }
    $$("[data-iman]").forEach(function (el) {
      var aX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      var aY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      el.addEventListener("mousemove", function (e) {
        var c = el.getBoundingClientRect();
        aX((e.clientX - (c.left + c.width / 2)) * 0.28);
        aY((e.clientY - (c.top + c.height / 2)) * 0.4);
      });
      el.addEventListener("mouseleave", function () { aX(0); aY(0); });
    });
  }

  function cursor() {
    var caja = $("#cursor"), texto = $("#cursor-texto");
    if (!caja || !window.matchMedia("(hover:hover)").matches) { return; }
    var aX = gsap.quickTo(caja, "x", { duration: 0.2, ease: "power3.out" });
    var aY = gsap.quickTo(caja, "y", { duration: 0.2, ease: "power3.out" });
    window.addEventListener("mousemove", function (e) { aX(e.clientX); aY(e.clientY); }, { passive: true });

    $$(".pestana-boton").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        caja.classList.add("es-grande");
        texto.textContent = "abrir " + (el.querySelector(".pestana-nombre") || {}).textContent;
      });
      el.addEventListener("mouseleave", function () { caja.classList.remove("es-grande"); texto.textContent = ""; });
    });
    [".clip", ".flotante-whatsapp"].forEach(function (sel) {
      $$(sel).forEach(function (el) {
        el.addEventListener("mouseenter", function () { caja.classList.add("es-grande"); });
        el.addEventListener("mouseleave", function () { caja.classList.remove("es-grande"); });
      });
    });
    $$("a, button").forEach(function (el) {
      if (el.classList.contains("pestana-boton")) { return; }
      el.addEventListener("mouseenter", function () { caja.classList.add("es-grande"); });
      el.addEventListener("mouseleave", function () { caja.classList.remove("es-grande"); });
    });
  }

  function arrancar() {
    titulares();
    apariciones();
    expedientePin();
    imanes();
    cursor();
    ScrollTrigger.refresh();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(arrancar);
  } else {
    window.addEventListener("load", arrancar);
  }

  if (mqReducido.addEventListener) {
    mqReducido.addEventListener("change", function () { window.location.reload(); });
  }
})();
