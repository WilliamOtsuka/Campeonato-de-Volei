document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form-cadastro');
  const telefoneCoachInput = document.getElementById('telefoneCoach');

  telefoneCoachInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length === 0) {
      e.target.value = '';
    } else if (value.length > 6) {
      e.target.value = value.replace(
        /^(\d{2})(\d{5})(\d{0,4})$/,
        function (_, ddd, prefixo, sufixo) {
          return sufixo
            ? `(${ddd}) ${prefixo}-${sufixo}`
            : `(${ddd}) ${prefixo}`;
        }
      );
    } else if (value.length > 2) {
      e.target.value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      e.target.value = value.replace(/^(\d*)/, '($1');
    }
  });

  form.addEventListener('submit', function (e) {
    const pattern = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!pattern.test(telefoneCoachInput.value)) {
      alert('Digite o telefone no formato (99) 99999-9999 ou (99) 9999-9999');
      telefoneCoachInput.focus();
      e.preventDefault();
    }
  });
});