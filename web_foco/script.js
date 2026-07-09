// Formulario "Reservá tu lugar" — Curso Inicial
// Usa Web3Forms (https://web3forms.com) para enviar el mail sin backend propio.
// Reemplazá el "access_key" en curso_inicial.html por el tuyo antes de publicar.

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

    button.disabled = true;
    button.textContent = 'Enviando...';
    status.textContent = '';
    status.className = 'course-form__status';

    try {
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
    } finally {
      button.disabled = false;
      button.textContent = 'Enviar pre-inscripción';
    }
  });
}