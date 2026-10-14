const form = document.getElementById('bookingForm');
const agendaBtn = document.getElementById('agendaBtn');
const contactBtn = document.getElementById('contactBtn');
const msg = document.getElementById('formMsg');
const opcionError = document.getElementById('opcionError');
const aceptaDatos = document.getElementById('aceptaDatos');
const aceptaComercial = document.getElementById('aceptaComercial');
const consentBox = document.getElementById('habeasData');
const consentError = document.getElementById('consentError');

const fields = [
  { id: 'nombre', label: 'Nombre completo' },
  { id: 'correo', label: 'Correo electrónico', email: true },
  { id: 'telefono', label: 'Teléfono / WhatsApp' },
  { id: 'tipoVisa', label: 'Tipo de servicio' }
];

function showMessage(text, type = 'error') {
  msg.className = `form-msg ${type}`;
  msg.textContent = text;
}
function clearMessage() {
  msg.className = 'form-msg hidden';
  msg.textContent = '';
}
function clearFieldState(input) {
  input.classList.remove('invalid-field');
}
function markInvalid(input) {
  input.classList.add('invalid-field');
}

fields.forEach(({ id }) => {
  const input = document.getElementById(id);
  input.addEventListener('input', () => clearFieldState(input));
  input.addEventListener('change', () => clearFieldState(input));
});

const aceptaTodo = document.getElementById('aceptaTodo');
const consentToggle = document.getElementById('consentToggle');
const consentPanel = document.getElementById('consentPanel');

function abrirAcuerdos(abrir) {
  consentPanel.hidden = !abrir;
  consentToggle.setAttribute('aria-expanded', String(abrir));
  consentToggle.setAttribute('aria-label', abrir ? 'Ocultar los acuerdos' : 'Ver los acuerdos');
}
consentToggle.addEventListener('click', () => abrirAcuerdos(consentPanel.hidden));

// La casilla maestra marca/desmarca las dos; cada una se puede ajustar por separado.
function sincronizarMaestra() {
  aceptaTodo.checked = aceptaDatos.checked && aceptaComercial.checked;
  aceptaTodo.indeterminate = aceptaDatos.checked !== aceptaComercial.checked;
  if (aceptaDatos.checked) {
    consentError.textContent = '';
    consentBox.classList.remove('invalid-field');
  }
}
aceptaTodo.addEventListener('change', () => {
  aceptaDatos.checked = aceptaComercial.checked = aceptaTodo.checked;
  aceptaTodo.indeterminate = false;
  sincronizarMaestra();
});
aceptaDatos.addEventListener('change', sincronizarMaestra);
aceptaComercial.addEventListener('change', sincronizarMaestra);
form.addEventListener('reset', () => setTimeout(() => { sincronizarMaestra(); abrirAcuerdos(false); }));

document.querySelectorAll('input[name="opcion"]').forEach(r => r.addEventListener('change', () => {
  const agenda = r.value === 'agenda' && r.checked;
  agendaBtn.classList.toggle('hidden', !agenda);
  contactBtn.classList.toggle('hidden', agenda);
  opcionError.textContent = '';
  clearMessage();
}));

form.addEventListener('submit', e => {
  e.preventDefault();
  clearMessage();
  opcionError.textContent = '';

  let firstInvalid = null;
  const missing = [];

  fields.forEach(({ id, label, email }) => {
    const input = document.getElementById(id);
    const value = input.value.trim();
    let invalid = !value;
    if (!invalid && email) invalid = !input.checkValidity();
    if (invalid) {
      markInvalid(input);
      missing.push(label);
      if (!firstInvalid) firstInvalid = input;
    } else clearFieldState(input);
  });

  const opcion = document.querySelector('input[name="opcion"]:checked')?.value;
  if (!opcion) {
    opcionError.textContent = '✨ Elige una de las dos opciones para continuar.';
    missing.push('una opción de contacto');
  }

  if (!aceptaDatos.checked) {
    consentError.textContent = '✨ Para continuar debes autorizar el tratamiento de tus datos personales.';
    consentBox.classList.add('invalid-field');
    missing.push('la autorización de datos personales');
    if (!firstInvalid) firstInvalid = aceptaDatos;
  }

  if (missing.length) {
    const text = missing.length === 1
      ? `✨ Solo falta completar: ${missing[0]}.`
      : `✨ Aún faltan algunos datos. Revisa los campos marcados para continuar.`;
    showMessage(text, 'error');
    (firstInvalid || document.querySelector('input[name="opcion"]'))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid?.focus();
    return;
  }

  const cfg = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : {};
  const registro = {
    nombre: document.getElementById('nombre').value.trim(),
    correo: document.getElementById('correo').value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    servicio: document.getElementById('tipoVisa').value,
    opcion,
    autorizacion: {
      tratamientoDatos: true,
      comunicacionesComerciales: aceptaComercial.checked,
      versionPolitica: (cfg.politica || {}).version || null,
      fechaAceptacion: new Date().toISOString(),
      textoAceptado: document.querySelector('#consentPanel .consent-check span').textContent.trim()
    }
  };

  enviarRegistro(registro, cfg.endpointRegistro).then(enviado => {
    if (!enviado) {
      // Sin backend configurado: solo se valida; no se afirma que se recibió nada.
      showMessage(opcion === 'agenda'
        ? '✓ ¡Perfecto! Tus datos y tu autorización están completos y la opción para agendar está lista.'
        : '✓ ¡Perfecto! Tus datos y tu autorización están completos. Te ayudaremos con la información que necesitas.', 'ok');
      return;
    }
    showMessage(opcion === 'agenda'
      ? '✓ ¡Perfecto! Recibimos tus datos y tu autorización. Te contactaremos para agendar tu cita.'
      : '✓ ¡Perfecto! Recibimos tus datos y tu autorización. Te contactaremos con la información que necesitas.', 'ok');
    form.reset();
    agendaBtn.classList.add('hidden');
    contactBtn.classList.add('hidden');
  }).catch(() => {
    showMessage('No pudimos enviar tu registro. Inténtalo de nuevo o escríbenos por WhatsApp.', 'error');
  });
});

/* Envía el registro (con la prueba de autorización) al backend definido en
   ../config.js → endpointRegistro. Los datos personales NO se guardan en el
   navegador. Si no hay endpoint, no se envía nada. */
async function enviarRegistro(registro, endpoint) {
  if (!endpoint) {
    console.warn('endpointRegistro no configurado: el registro no se envía ni se guarda.');
    return false;
  }
  const r = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registro)
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return true;
}
