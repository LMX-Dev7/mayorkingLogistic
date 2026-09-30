const WHATSAPP_NUMBER = '573224956349'; // +57 322 495 6349 (Colombia)
const MAX_CAMPO = 120;

// Limpia texto libre antes de armar el mensaje: sin saltos de línea ni marcas de formato de WhatsApp
function limpiar(valor) {
  return String(valor)
    .replace(/[\r\n]+/g, ' ')
    .replace(/[*_~`]/g, '')
    .trim()
    .slice(0, MAX_CAMPO);
}

document.addEventListener('DOMContentLoaded', () => {
  const select    = document.getElementById('tipo-servicio');
  const form      = document.getElementById('form-cotizacion');
  const grupos    = document.querySelectorAll('.grupo-servicio');
  const btnCotizar = document.getElementById('btn-cotizar');
  const formError  = document.getElementById('form-error');
  const consent    = document.getElementById('acepto-datos');

  if (!select || !form) return;

  const serviciosValidos = Array.from(select.options)
    .filter((o) => !o.disabled)
    .map((o) => o.value || o.text);

  function mostrarGrupo() {
    grupos.forEach((grupo) => {
      grupo.classList.toggle('hidden', grupo.dataset.servicio !== select.value);
    });
  }

  // Muestra el grupo de campos correspondiente al servicio elegido
  select.addEventListener('change', mostrarGrupo);

  // Las tarjetas de servicio preseleccionan el tipo en el formulario
  document.querySelectorAll('.svc-link[data-servicio]').forEach((link) => {
    link.addEventListener('click', () => {
      if (serviciosValidos.includes(link.dataset.servicio)) {
        select.value = link.dataset.servicio;
        mostrarGrupo();
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ocultarError();

    // Validar selección de servicio (contra la lista real de opciones)
    if (!select.value || !serviciosValidos.includes(select.value)) {
      invalido(select, 'Por favor selecciona el tipo de servicio.');
      return;
    }
    marcarValido(select);

    // Validar campos de contacto
    const nombre   = document.getElementById('nombre-cliente');
    const telefono = document.getElementById('telefono-cliente');

    const nombreLimpio = limpiar(nombre.value);
    if (!nombreLimpio) {
      invalido(nombre, 'Por favor ingresa tu nombre completo.');
      return;
    }
    marcarValido(nombre);

    if (!telefono.value.trim()) {
      invalido(telefono, 'Por favor ingresa tu número de WhatsApp o teléfono.');
      return;
    }

    // Solo dígitos, espacios y + ( ) - ; entre 7 y 15 dígitos reales
    const soloDigitos = telefono.value.replace(/\D/g, '');
    if (!/^[0-9+\s()\-]+$/.test(telefono.value.trim()) || soloDigitos.length < 7 || soloDigitos.length > 15) {
      invalido(telefono, 'Ingresa un número de teléfono válido (solo números, entre 7 y 15 dígitos).');
      return;
    }
    marcarValido(telefono);

    // Autorización de tratamiento de datos (Ley 1581 de 2012)
    if (consent && !consent.checked) {
      invalido(consent, 'Para enviar la cotización debes autorizar el tratamiento de tus datos.');
      return;
    }
    if (consent) marcarValido(consent);

    // Construir mensaje de WhatsApp
    const lineas = [
      `Hola, quiero cotizar: *${select.value}*`,
      `👤 Nombre: ${nombreLimpio}`,
      `📱 Teléfono: ${limpiar(telefono.value)}`,
    ];

    const grupoActivo = Array.from(grupos).find((g) => g.dataset.servicio === select.value);
    if (grupoActivo) {
      grupoActivo.querySelectorAll('[data-label]').forEach((campo) => {
        const valor = limpiar(campo.value);
        if (valor) lineas.push(`${campo.dataset.label}: ${valor}`);
      });
    }

    // Estado de carga
    setLoading(true);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lineas.join('\n'))}`;
    const ventana = window.open(url, '_blank');
    if (ventana) {
      ventana.opener = null;
    } else {
      // Popup bloqueado (Safari/iOS, bloqueadores): abrir en la misma pestaña
      window.location.href = url;
    }

    // Restaurar botón tras abrir WhatsApp
    setTimeout(() => setLoading(false), 2500);
  });

  // Limpiar el estado de error al corregir un campo
  ['tipo-servicio', 'nombre-cliente', 'telefono-cliente', 'acepto-datos'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const evento = id === 'nombre-cliente' || id === 'telefono-cliente' ? 'input' : 'change';
    el.addEventListener(evento, () => marcarValido(el));
  });

  function invalido(campo, msg) {
    campo.classList.add('error');
    campo.setAttribute('aria-invalid', 'true');
    campo.setAttribute('aria-describedby', 'form-error');
    mostrarError(msg);
    campo.focus();
  }

  function marcarValido(campo) {
    campo.classList.remove('error');
    campo.removeAttribute('aria-invalid');
    campo.removeAttribute('aria-describedby');
  }

  function mostrarError(msg) {
    formError.textContent = msg;
    formError.classList.remove('hidden');
    formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function ocultarError() {
    formError.classList.add('hidden');
    formError.textContent = '';
  }

  function setLoading(loading) {
    if (loading) {
      btnCotizar.disabled = true;
      btnCotizar.innerHTML = `
        <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span>Abriendo WhatsApp…</span>`;
    } else {
      btnCotizar.disabled = false;
      btnCotizar.innerHTML = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-send"/></svg><span>Enviar cotización por WhatsApp</span>';
    }
  }
});
