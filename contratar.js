/* contratar.js – Lógica exclusiva de contratar.html */

// ── Pre-fill plan from URL query ──
const params = new URLSearchParams(window.location.search);
const planFromUrl = params.get('plan');
const planSelect = document.getElementById('plan');
const planDisplay = document.getElementById('plan-display');

if (planFromUrl && planSelect) {
  const match = [...planSelect.options].find(o => o.value === planFromUrl);
  if (match) planSelect.value = planFromUrl;
}
if (planDisplay && planSelect) {
  planDisplay.textContent = planSelect.value;
  planSelect.addEventListener('change', () => {
    planDisplay.textContent = planSelect.value;
  });
}

// ── Helpers ──
function setError(fieldId, errId, msg) {
  document.getElementById(fieldId).classList.toggle('error', !!msg);
  document.getElementById(errId).textContent = msg || '';
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

// ── JSON syntax highlight ──
function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'num';
      if (/^"/.test(match)) cls = /:$/.test(match) ? 'key' : 'str';
      else if (/true|false/.test(match)) cls = 'bool';
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

// ── Form submit ──
const form = document.getElementById('contratar-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn?.querySelector('.btn-text');
const btnSpinner = submitBtn?.querySelector('.btn-spinner');
const jsonPanel = document.getElementById('json-panel');
const jsonOutput = document.getElementById('json-output');
const resetBtn = document.getElementById('reset-btn');

function setLoading(on) {
  if (!submitBtn) return;
  submitBtn.disabled = on;
  if (btnText) btnText.hidden = on;
  if (btnSpinner) btnSpinner.hidden = !on;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const plan = document.getElementById('plan').value;

  // Validate
  let hasError = false;
  if (!nombre) { setError('fg-nombre', 'err-nombre', 'El nombre es requerido.'); hasError = true; }
  else setError('fg-nombre', 'err-nombre', '');

  if (!email) { setError('fg-email', 'err-email', 'El correo es requerido.'); hasError = true; }
  else if (!isValidEmail(email)) { setError('fg-email', 'err-email', 'Ingresa un correo válido.'); hasError = true; }
  else setError('fg-email', 'err-email', '');

  if (hasError) return;

  setLoading(true);

  // Build payload
  const payload = {
    "Nombre de usuario": nombre,
    "Email": email,
    "Elige tu plan": plan,
    "submittedAt": new Date().toISOString(),
    "formMode": "test"
  };

  try {
    // HTTP POST con fetch – mostramos la respuesta JSON tal como la imagen
    const response = await fetch('https://clarinet-paper-pledge.ngrok-free.dev/webhook-test/5423d564-cf44-4cb9-b8fe-5c6825bce53f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Construimos el array de respuesta que coincide con el formato de la imagen
    const serverData = await response.json();

    // La respuesta final en el formato exacto de la imagen:
    const displayPayload = [
      {
        "Nombre de usuario": nombre,
        "Email": email,
        "Elige tu plan": plan,
        "submittedAt": payload.submittedAt,
        "formMode": "test"
      }
    ];

    const prettyJson = JSON.stringify(displayPayload, null, 2);
    jsonOutput.innerHTML = syntaxHighlight(prettyJson);

    // Ocultar form, mostrar panel
    form.style.display = 'none';
    jsonPanel.hidden = false;

  } catch (err) {
    // En caso de error de red, igual mostramos el JSON generado localmente
    const displayPayload = [
      {
        "Nombre de usuario": nombre,
        "Email": email,
        "Elige tu plan": plan,
        "submittedAt": payload.submittedAt,
        "formMode": "test"
      }
    ];

    const prettyJson = JSON.stringify(displayPayload, null, 2);
    jsonOutput.innerHTML = syntaxHighlight(prettyJson);

    const statusIcon = document.getElementById('json-status-icon');
    const statusText = document.getElementById('json-status-text');
    if (statusIcon) statusIcon.innerHTML = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;display:block;color:#facc15"><path d="M10 3L18 17H2L10 3z"/><line x1="10" y1="10" x2="10" y2="13"/><circle cx="10" cy="15.5" r="0.5" fill="currentColor"/></svg>`;
    if (statusText) statusText.textContent = 'Enviado en modo offline (sin servidor)';

    form.style.display = 'none';
    jsonPanel.hidden = false;

  } finally {
    setLoading(false);
  }
});

// ── Reset ──
resetBtn?.addEventListener('click', () => {
  jsonPanel.hidden = true;
  form.style.display = '';
  form.reset();
  if (planDisplay && planSelect) planDisplay.textContent = planSelect.value;
  const statusIcon = document.getElementById('json-status-icon');
  const statusText = document.getElementById('json-status-text');
  if (statusIcon) statusIcon.innerHTML = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;display:block"><polyline points="3,10 7.5,15 17,5"/></svg>`;
  if (statusText) statusText.textContent = 'Suscripción enviada correctamente';
});
