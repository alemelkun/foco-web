// Formulario de pre-inscripción — usado por curso_inicial.html y eventos_sociales.html
// Usa Web3Forms (https://web3forms.com) para enviar el mail sin backend propio.
// Las claves reales viven en keys.js (no en este archivo, para que nunca se pierdan
// al actualizar este script).

// Fix para iOS Safari: sin esto, el estado :active de CSS
// (el feedback visual al tocar tarjetas y botones) no se activa en links.
document.addEventListener('touchstart', function () {}, true);

const reservaForm = document.getElementById('reserva-form');

if (reservaForm) {
  reservaForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const status = document.getElementById('reserva-status');
    const button = reservaForm.querySelector('button[type="submit"]');
    const formData = new FormData(reservaForm);

    // Identifica qué formulario es (dato en el propio <form data-course="...">)
    // y le pega la clave correspondiente desde keys.js antes de enviar.
    const courseKey = reservaForm.dataset.course;
    const accessKey = (typeof WEB3FORMS_KEYS !== 'undefined') ? WEB3FORMS_KEYS[courseKey] : null;
    formData.set('access_key', accessKey || '');

    button.disabled = true;
    button.textContent = 'Enviando...';
    status.textContent = '';
    status.className = 'course-form__status';

    try {
      if (!accessKey) {
        throw new Error('Falta configurar la clave de Web3Forms para "' + courseKey + '" en keys.js');
      }
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        status.textContent = '¡Listo! Recibimos tu pre-inscripción — te contactamos por WhatsApp a la brevedad.';
        status.classList.add('ok');
        reservaForm.reset();
      } else {
        throw new Error(result.message || 'Error desconocido');
      }
    } catch (error) {
      status.textContent = 'Hubo un problema al enviar. Escribinos directo por WhatsApp mejor.';
      status.classList.add('err');
      console.error(error);
    } finally {
      button.disabled = false;
      button.textContent = 'Enviar pre-inscripción';
    }
  });
}