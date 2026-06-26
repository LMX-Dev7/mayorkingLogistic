const WHATSAPP_NUMBER = '573224956349'; // +57 322 495 6349 (Colombia)

document.addEventListener('DOMContentLoaded', () => {
  const select    = document.getElementById('tipo-servicio');
  const form      = document.getElementById('form-cotizacion');
  const grupos    = document.querySelectorAll('.grupo-servicio');
  const btnCotizar = document.getElementById('btn-cotizar');
  const formError  = document.getElementById('form-error');

  if (!select || !form) return;

  // Muestra el grupo de campos correspondiente al servicio elegido
  select.addEventListener('change', () => {
    grupos.forEach((grupo) => {
      grupo.classList.toggle('hidden', grupo.dataset.servicio !== select.value);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ocultarError();

    // Validar selección de servicio
    if (!select.value) {
      mostrarError('Por favor selecciona el tipo de servicio.');
      select.focus();
      return;
    }

    // Validar campos de contacto
    const nombre   = document.getElementById('nombre-cliente');
    const telefono = document.getElementById('telefono-cliente');

    if (!nombre.value.trim()) {
      mostrarError('Por favor ingresa tu nombre completo.');
      nombre.classList.add('error');
      nombre.focus();
      return;
    }
    nombre.classList.remove('error');

    if (!telefono.value.trim()) {
      mostrarError('Por favor ingresa tu número de WhatsApp o teléfono.');
      telefono.classList.add('error');
      telefono.focus();
      return;
    }
    telefono.classList.remove('error');

    // Construir mensaje de WhatsApp
    const lineas = [
      `Hola, quiero cotizar: *${select.value}*`,
      `👤 Nombre: ${nombre.value.trim()}`,
      `📱 Teléfono: ${telefono.value.trim()}`,
    ];

    const grupoActivo = document.querySelector(`.grupo-servicio[data-servicio="${select.value}"]`);
    if (grupoActivo) {
      grupoActivo.querySelectorAll('[data-label]').forEach((campo) => {
        if (campo.value) lineas.push(`${campo.dataset.label}: ${campo.value}`);
      });
    }

    // Estado de carga
    setLoading(true);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lineas.join('\n'))}`;
    window.open(url, '_blank');

    // Restaurar botón tras abrir WhatsApp
    setTimeout(() => setLoading(false), 2500);
  });

  // Limpiar error al escribir en campos obligatorios
  ['nombre-cliente', 'telefono-cliente'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => el.classList.remove('error'));
  });

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
        <svg class="animate-spin w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span>Abriendo WhatsApp…</span>`;
    } else {
      btnCotizar.disabled = false;
      btnCotizar.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i><span>Enviar cotización por WhatsApp</span>';
      if (window.lucide) lucide.createIcons();
    }
  }
});
