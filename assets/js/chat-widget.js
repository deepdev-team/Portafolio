/**
 * Widget de chat de los portafolios de David Gonzalez.
 *
 * Habla con el backend del asistente. El guion vive en el servidor: aqui
 * responde dudas sobre el perfil de David y sobre que entra y que no entra en
 * su alcance.
 *
 * Sin dependencias: inyecta su propio CSS y su propio DOM, y funciona igual en
 * el portafolio clasico y en portafolio2.
 *
 * Configuracion (atributos del <script>):
 *   data-position="left|right"  esquina donde vive el boton (por defecto right)
 *
 * El portafolio clasico lo usa a la izquierda porque la esquina derecha ya
 * tiene el boton de WhatsApp y el de tema.
 */
(function () {
  'use strict';

  var API_URL = 'https://deepdev.com.co/api/chat';

  // El corte real tiene que estar en el servidor; esto solo evita que un pegado
  // enorme salga del navegador. Y si el backend se cuelga, el widget no puede
  // quedarse en "escribiendo..." para siempre.
  var LIMITE_MENSAJE = 1000;
  var TIMEOUT_MS = 45000;
  var script = document.currentScript;
  var POSICION = (script && script.dataset.position === 'left') ? 'left' : 'right';

  var BIENVENIDA = '¡Hola! 👋\n\nSoy Steven, el asistente de David. Puedo contarte sobre su experiencia, su stack, sus proyectos o qué tipo de trabajo puede asumir.\n\n¿Qué te gustaría saber?';

  // ---------------------------------------------------------------- estilos
  var CSS = [
    '.dgc-root{--dgc-primary:#2563eb;--dgc-primary-dark:#1d4ed8;--dgc-panel:#ffffff;--dgc-msgs:#f8fafc;',
    '--dgc-bot:#ffffff;--dgc-ink:#0f172a;--dgc-muted:#94a3b8;--dgc-line:#e2e8f0;--dgc-input:#f1f5f9;',
    'position:fixed;bottom:24px;z-index:9998;font-family:inherit}',
    '.dgc-root[data-pos="right"]{right:24px}',
    '.dgc-root[data-pos="left"]{left:24px}',

    // El widget sigue al tema del sitio: los dos portafolios usan data-theme,
    // y portafolio2 ademas deja que mande el sistema cuando no hay eleccion.
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .dgc-root{',
    '--dgc-primary:#3b82f6;--dgc-primary-dark:#2563eb;--dgc-panel:#0f172a;--dgc-msgs:#111c2e;',
    '--dgc-bot:#1e293b;--dgc-ink:#e2e8f0;--dgc-muted:#64748b;--dgc-line:#1e293b;--dgc-input:#1e293b}}',
    '[data-theme="dark"] .dgc-root{--dgc-primary:#3b82f6;--dgc-primary-dark:#2563eb;--dgc-panel:#0f172a;',
    '--dgc-msgs:#111c2e;--dgc-bot:#1e293b;--dgc-ink:#e2e8f0;--dgc-muted:#64748b;--dgc-line:#1e293b;--dgc-input:#1e293b}',

    // --- boton flotante
    '.dgc-fab{position:relative;width:56px;height:56px;border:0;border-radius:50%;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;overflow:hidden;padding:0;',
    'background:conic-gradient(from 180deg,#38bdf8,#2563EB,#7dd3fc,#06b6d4,#3b82f6,#60a5fa,#38bdf8);',
    'box-shadow:0 0 24px rgba(56,189,248,.35),0 0 48px rgba(37,99,235,.2);',
    'animation:dgcFloat 3s ease-in-out infinite;transition:transform .18s ease}',
    '.dgc-fab:hover{transform:scale(1.1)}',
    '.dgc-fab:active{transform:scale(.92)}',
    '.dgc-fab.is-open{background:#4b5563;box-shadow:none;animation:none}',
    '.dgc-fab svg{position:relative;z-index:2;width:27px;height:27px;color:#fff;stroke:currentColor;fill:none;stroke-width:2.3}',
    '.dgc-shine{position:absolute;inset:0;border-radius:50%;z-index:1;',
    'background:radial-gradient(circle at 35% 35%,rgba(255,255,255,.45) 0%,rgba(255,255,255,.1) 40%,transparent 70%);',
    'animation:dgcSpin 25s linear infinite}',
    '.dgc-sweep{position:absolute;inset:0;border-radius:50%;z-index:1;',
    'background:conic-gradient(from 0deg,transparent 40%,rgba(255,255,255,.25) 50%,transparent 60%);',
    'animation:dgcSpin 8s linear infinite}',
    '.dgc-fab.is-open .dgc-shine,.dgc-fab.is-open .dgc-sweep{display:none}',
    '.dgc-halo{position:absolute;inset:0;border-radius:50%;background:#38bdf8;z-index:0;',
    'animation:dgcHalo 2s ease-out infinite;pointer-events:none}',
    '.dgc-fab.is-open + .dgc-halo{display:none}',
    '.dgc-badge{position:absolute;top:-2px;right:-2px;min-width:20px;height:20px;padding:0 5px;',
    'border-radius:999px;background:#f43f5e;color:#fff;font-size:11px;font-weight:700;line-height:20px;',
    'text-align:center;box-shadow:0 0 0 2px #fff;pointer-events:none;z-index:3}',
    '.dgc-wrap{position:relative}',

    // --- globo de invitacion
    '.dgc-teaser{position:absolute;bottom:6px;width:max-content;max-width:15rem;z-index:3;',
    'animation:dgcPop .28s ease-out}',
    '.dgc-root[data-pos="right"] .dgc-teaser{right:72px}',
    '.dgc-root[data-pos="left"] .dgc-teaser{left:72px}',
    '.dgc-teaser-btn{position:relative;display:block;text-align:left;background:#fff;border:0;cursor:pointer;',
    'border-radius:16px;border-bottom-right-radius:6px;padding:12px 18px 12px 16px;',
    'box-shadow:0 12px 30px rgba(15,23,42,.22);}',
    '.dgc-teaser-btn strong{display:block;font-size:14px;color:#0f172a;line-height:1.35}',
    '.dgc-teaser-btn span{display:block;font-size:12px;color:#64748b;margin-top:2px;line-height:1.35}',
    '.dgc-teaser-btn b{color:#2563eb}',
    '.dgc-teaser-tail{position:absolute;bottom:16px;width:12px;height:12px;background:#fff;transform:rotate(45deg)}',
    '.dgc-root[data-pos="right"] .dgc-teaser-tail{right:-4px}',
    '.dgc-root[data-pos="left"] .dgc-teaser-tail{left:-4px}',
    '.dgc-teaser-x{position:absolute;top:-8px;width:24px;height:24px;border:0;border-radius:50%;',
    'background:#334155;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 2px 8px rgba(0,0,0,.25)}',
    '.dgc-root[data-pos="right"] .dgc-teaser-x{left:-8px}',
    '.dgc-root[data-pos="left"] .dgc-teaser-x{right:-8px}',
    '.dgc-teaser-x svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.5}',

    // --- panel
    '.dgc-panel{position:absolute;bottom:72px;width:384px;max-width:calc(100vw - 32px);',
    'max-height:min(500px,70vh);background:var(--dgc-panel);border:1px solid var(--dgc-line);',
    'border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,.35);overflow:hidden;',
    'display:flex;flex-direction:column;animation:dgcIn .2s ease-out}',
    '.dgc-root[data-pos="right"] .dgc-panel{right:0}',
    '.dgc-root[data-pos="left"] .dgc-panel{left:0}',
    '.dgc-panel[hidden]{display:none}',

    '.dgc-head{background:var(--dgc-primary);color:#fff;padding:16px;display:flex;align-items:center;',
    'justify-content:space-between;flex-shrink:0}',
    '.dgc-head-l{display:flex;align-items:center;gap:12px}',
    '.dgc-avatar{position:relative;width:40px;height:40px;border-radius:50%;overflow:hidden;',
    'box-shadow:0 0 0 2px rgba(255,255,255,.5),0 0 12px rgba(56,189,248,.3);',
    'background:conic-gradient(from 180deg,#38bdf8,#2563EB,#7dd3fc,#06b6d4,#3b82f6,#60a5fa,#38bdf8)}',
    '.dgc-head h3{margin:0;font-size:15px;font-weight:600;line-height:1.2}',
    '.dgc-head p{margin:2px 0 0;font-size:11.5px;opacity:.85;line-height:1.2}',
    '.dgc-x{background:none;border:0;color:#fff;cursor:pointer;padding:8px;border-radius:50%;',
    'display:flex;transition:background .18s ease}',
    '.dgc-x:hover{background:rgba(255,255,255,.2)}',
    '.dgc-x svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2}',

    '.dgc-msgs{flex:1;overflow-y:auto;padding:16px;background:var(--dgc-msgs);min-height:0;',
    'display:flex;flex-direction:column;gap:14px}',
    '.dgc-row{display:flex;animation:dgcUp .22s ease-out}',
    '.dgc-row.user{justify-content:flex-end}',
    '.dgc-bubble{max-width:85%;border-radius:16px;padding:10px 15px}',
    '.dgc-row.user .dgc-bubble{background:var(--dgc-primary);color:#fff;border-bottom-right-radius:6px}',
    '.dgc-row.bot .dgc-bubble{background:var(--dgc-bot);color:var(--dgc-ink);border-bottom-left-radius:6px;',
    'box-shadow:0 1px 2px rgba(15,23,42,.08)}',
    '.dgc-bubble p{margin:0;font-size:13.5px;line-height:1.55;white-space:pre-wrap}',
    '.dgc-time{display:block;font-size:11px;margin-top:4px;opacity:.65}',
    '.dgc-row.bot .dgc-time{color:var(--dgc-muted);opacity:1}',

    '.dgc-typing{display:flex;align-items:center;gap:12px;background:var(--dgc-bot);border-radius:16px;',
    'border-bottom-left-radius:6px;padding:14px 20px;box-shadow:0 1px 2px rgba(15,23,42,.08)}',
    '.dgc-bars{display:flex;align-items:flex-end;gap:3px;height:20px}',
    '.dgc-bars i{width:3px;border-radius:999px;background:var(--dgc-primary);animation:dgcWave 1.2s ease-in-out infinite}',
    '.dgc-typing span{font-size:11.5px;color:var(--dgc-muted)}',

    '.dgc-foot{padding:14px;background:var(--dgc-panel);border-top:1px solid var(--dgc-line);flex-shrink:0}',
    '.dgc-form{display:flex;align-items:center;gap:8px}',
    '.dgc-input{flex:1;min-width:0;padding:10px 16px;border:1px solid transparent;border-radius:999px;',
    'background:var(--dgc-input);color:var(--dgc-ink);font-size:14px;font-family:inherit;outline:none}',
    '.dgc-input::placeholder{color:var(--dgc-muted)}',
    '.dgc-input:focus{border-color:var(--dgc-primary);box-shadow:0 0 0 2px rgba(37,99,235,.25)}',
    '.dgc-send{width:40px;height:40px;flex-shrink:0;border:0;border-radius:50%;background:var(--dgc-primary);',
    'color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .18s ease}',
    '.dgc-send:hover:not(:disabled){background:var(--dgc-primary-dark)}',
    '.dgc-send:disabled{background:#cbd5e1;cursor:not-allowed}',
    '[data-theme="dark"] .dgc-send:disabled{background:#334155}',
    '.dgc-send svg{width:19px;height:19px;stroke:currentColor;fill:none;stroke-width:2}',
    '.dgc-send.is-loading svg{animation:dgcSpin 1s linear infinite}',
    '.dgc-note{margin:8px 0 0;text-align:center;font-size:11px;color:var(--dgc-muted)}',

    // --- animaciones
    '@keyframes dgcFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}',
    '@keyframes dgcSpin{to{transform:rotate(360deg)}}',
    '@keyframes dgcHalo{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.7);opacity:0}}',
    '@keyframes dgcIn{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:none}}',
    '@keyframes dgcUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
    '@keyframes dgcPop{from{opacity:0;transform:translateX(16px) scale(.92)}to{opacity:1;transform:none}}',
    '@keyframes dgcWave{0%,100%{height:4px;opacity:.4}50%{height:18px;opacity:1}}',

    '@media (max-width:640px){',
    '.dgc-root{bottom:16px}.dgc-root[data-pos="right"]{right:16px}.dgc-root[data-pos="left"]{left:16px}',
    '.dgc-panel{width:calc(100vw - 32px)}',
    '.dgc-root[data-pos="left"] .dgc-panel{left:0}',
    '.dgc-teaser{display:none}}',

    '@media (prefers-reduced-motion:reduce){',
    '.dgc-fab,.dgc-shine,.dgc-sweep,.dgc-halo,.dgc-bars i,.dgc-panel,.dgc-row{animation:none!important}}'
  ].join('');

  var ICONOS = {
    chat: '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    loader: '<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56" stroke-linecap="round"/></svg>'
  };

  // ------------------------------------------------------------------ estado
  var abierto = false;
  var cargando = false;
  var conversationId = null;
  // Solo hila la conversacion en la UI: el servidor no debe usarlo para limitar
  // nada, porque lo fabrica el cliente.
  function idVisitante() {
    try {
      if (window.crypto && typeof crypto.randomUUID === 'function') {
        return 'visitor_' + crypto.randomUUID();
      }
      if (window.crypto && typeof crypto.getRandomValues === 'function') {
        var b = new Uint8Array(16);
        crypto.getRandomValues(b);
        return 'visitor_' + Array.prototype.map.call(b, function (n) {
          return ('0' + n.toString(16)).slice(-2);
        }).join('');
      }
    } catch (e) { /* sin crypto */ }
    return 'visitor_' + Math.random().toString(36).substring(2, 15);
  }

  var visitorId = (function () {
    try {
      var k = 'dg_visitor_id';
      var v = localStorage.getItem(k);
      if (!v) {
        v = idVisitante();
        localStorage.setItem(k, v);
      }
      return v;
    } catch (e) {
      return idVisitante();
    }
  })();

  // -------------------------------------------------------------------- DOM
  var estilos = document.createElement('style');
  estilos.textContent = CSS;
  document.head.appendChild(estilos);

  var raiz = document.createElement('div');
  raiz.className = 'dgc-root';
  raiz.dataset.pos = POSICION;
  raiz.innerHTML =
    '<div class="dgc-panel" hidden role="dialog" aria-label="Chat con el asistente del portafolio">' +
      '<div class="dgc-head">' +
        '<div class="dgc-head-l">' +
          '<div class="dgc-avatar"><span class="dgc-shine"></span><span class="dgc-sweep"></span></div>' +
          '<div><h3>Steven</h3><p>En línea</p></div>' +
        '</div>' +
        '<button class="dgc-x" type="button" aria-label="Cerrar chat">' + ICONOS.x + '</button>' +
      '</div>' +
      '<div class="dgc-msgs" aria-live="polite"></div>' +
      '<div class="dgc-foot">' +
        '<form class="dgc-form">' +
          '<input class="dgc-input" type="text" placeholder="Escribe tu mensaje..." aria-label="Mensaje" autocomplete="off" maxlength="1000">' +
          '<button class="dgc-send" type="submit" aria-label="Enviar mensaje" disabled>' + ICONOS.send + '</button>' +
        '</form>' +
        '<p class="dgc-note">Asistente de David Gonzalez · responde al instante</p>' +
      '</div>' +
    '</div>' +
    '<div class="dgc-wrap">' +
      '<div class="dgc-teaser" hidden>' +
        '<button class="dgc-teaser-btn" type="button">' +
          '<strong>👋 ¿Tienes dudas?</strong>' +
          '<span>Pregúntale a <b>Steven</b> sobre el perfil de David</span>' +
          '<span class="dgc-teaser-tail"></span>' +
        '</button>' +
        '<button class="dgc-teaser-x" type="button" aria-label="Cerrar invitación">' + ICONOS.x + '</button>' +
      '</div>' +
      '<button class="dgc-fab" type="button" aria-label="Abrir chat con el asistente del portafolio">' +
        '<span class="dgc-shine"></span><span class="dgc-sweep"></span>' + ICONOS.chat +
      '</button>' +
      '<span class="dgc-halo"></span>' +
      '<span class="dgc-badge">1</span>' +
    '</div>';
  document.body.appendChild(raiz);

  var panel = raiz.querySelector('.dgc-panel');
  var fab = raiz.querySelector('.dgc-fab');
  var badge = raiz.querySelector('.dgc-badge');
  var halo = raiz.querySelector('.dgc-halo');
  var lista = raiz.querySelector('.dgc-msgs');
  var form = raiz.querySelector('.dgc-form');
  var input = raiz.querySelector('.dgc-input');
  var enviar = raiz.querySelector('.dgc-send');
  var teaser = raiz.querySelector('.dgc-teaser');

  // Las barras del indicador de escritura
  var barras = '';
  for (var i = 0; i < 7; i++) {
    barras += '<i style="animation-delay:' + (i * 0.1) + 's"></i>';
  }

  // ---------------------------------------------------------------- helpers
  function hora(fecha) {
    return fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  function pintarMensaje(texto, rol) {
    var fila = document.createElement('div');
    fila.className = 'dgc-row ' + (rol === 'user' ? 'user' : 'bot');
    var burbuja = document.createElement('div');
    burbuja.className = 'dgc-bubble';
    var p = document.createElement('p');
    p.textContent = texto;
    var t = document.createElement('span');
    t.className = 'dgc-time';
    t.textContent = hora(new Date());
    burbuja.appendChild(p);
    burbuja.appendChild(t);
    fila.appendChild(burbuja);
    lista.appendChild(fila);
    lista.scrollTop = lista.scrollHeight;
  }

  function mostrarEscribiendo(activo) {
    var previo = lista.querySelector('.dgc-row.is-typing');
    if (previo) previo.remove();
    if (!activo) return;
    var fila = document.createElement('div');
    fila.className = 'dgc-row bot is-typing';
    fila.innerHTML = '<div class="dgc-typing"><div class="dgc-bars">' + barras + '</div><span>Steven está escribiendo...</span></div>';
    lista.appendChild(fila);
    lista.scrollTop = lista.scrollHeight;
  }

  function alternar(forzar) {
    abierto = typeof forzar === 'boolean' ? forzar : !abierto;
    panel.hidden = !abierto;
    fab.classList.toggle('is-open', abierto);
    fab.innerHTML = abierto
      ? ICONOS.x
      : '<span class="dgc-shine"></span><span class="dgc-sweep"></span>' + ICONOS.chat;
    fab.setAttribute('aria-label', abierto ? 'Cerrar chat' : 'Abrir chat con el asistente del portafolio');
    badge.hidden = abierto;
    halo.hidden = abierto;

    if (abierto) {
      ocultarTeaser();
      if (!lista.children.length) pintarMensaje(BIENVENIDA, 'assistant');
      setTimeout(function () { input.focus(); }, 60);
    }
  }

  function ocultarTeaser(recordar) {
    teaser.hidden = true;
    if (recordar) {
      try { sessionStorage.setItem('dg_teaser_visto', '1'); } catch (e) { /* sin sessionStorage */ }
    }
  }

  // ---------------------------------------------------------------- envio
  var CONTACTO = 'Mientras tanto puedes escribirle a David directo: davidsgonzalez98@hotmail.com o al WhatsApp +57 305 759 4088.';

  // Un 429 no es lo mismo que el servidor caido: si no se distinguen, nadie se
  // entera de que la cuota se esta agotando.
  function mensajeDeError(e) {
    if (e && e.name === 'AbortError') {
      return 'La respuesta está tardando más de lo normal. Intenta de nuevo en un momento. ' + CONTACTO;
    }
    if (e && e.message && e.message.indexOf('HTTP 429') === 0) {
      return 'Hay mucha demanda en este momento. Espera un minuto y vuelve a intentar. ' + CONTACTO;
    }
    return 'No pude conectarme en este momento. ' + CONTACTO;
  }

  async function enviarMensaje(texto) {
    pintarMensaje(texto, 'user');
    cargando = true;
    enviar.disabled = true;
    enviar.classList.add('is-loading');
    enviar.innerHTML = ICONOS.loader;
    mostrarEscribiendo(true);

    var control = (typeof AbortController === 'function') ? new AbortController() : null;
    var corte = control ? setTimeout(function () { control.abort(); }, TIMEOUT_MS) : null;

    try {
      var opciones = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          message: texto.slice(0, LIMITE_MENSAJE),
          conversation_id: conversationId,
          visitor_id: visitorId,
          bot: 'portafolio'
        })
      };
      if (control) opciones.signal = control.signal;

      var res = await fetch(API_URL, opciones);

      if (!res.ok) throw new Error('HTTP ' + res.status);

      var data = await res.json();
      if (data.conversation_id) conversationId = data.conversation_id;
      mostrarEscribiendo(false);
      var respuesta = (typeof data.message === 'string' && data.message.trim())
        ? data.message
        : 'No pude procesar tu mensaje. Intenta de nuevo.';
      pintarMensaje(respuesta, 'assistant');
    } catch (e) {
      mostrarEscribiendo(false);
      pintarMensaje(mensajeDeError(e), 'assistant');
    } finally {
      if (corte) clearTimeout(corte);
      cargando = false;
      enviar.classList.remove('is-loading');
      enviar.innerHTML = ICONOS.send;
      enviar.disabled = !input.value.trim();
      input.focus();
    }
  }

  // ---------------------------------------------------------------- eventos
  fab.addEventListener('click', function () { alternar(); });
  raiz.querySelector('.dgc-x').addEventListener('click', function () { alternar(false); });
  raiz.querySelector('.dgc-teaser-btn').addEventListener('click', function () { alternar(true); });
  raiz.querySelector('.dgc-teaser-x').addEventListener('click', function (e) {
    e.stopPropagation();
    ocultarTeaser(true);
  });

  input.addEventListener('input', function () {
    enviar.disabled = cargando || !input.value.trim();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var texto = input.value.trim();
    if (!texto || cargando) return;
    input.value = '';
    enviar.disabled = true;
    enviarMensaje(texto);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && abierto) alternar(false);
  });

  // El globo aparece a los pocos segundos, y solo una vez por sesion
  var yaVisto = false;
  try { yaVisto = !!sessionStorage.getItem('dg_teaser_visto'); } catch (e) { /* sin sessionStorage */ }
  if (!yaVisto) {
    setTimeout(function () {
      if (!abierto) teaser.hidden = false;
    }, 4000);
  }
})();
