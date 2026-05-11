/**
 * register.js — Validación client-side del formulario de registro
 * HARDWARE STORE · Sprint 1
 */

(function () {
  'use strict';

  const SITE_NAME = 'hardwarestore';
  const FORBIDDEN_STRINGS = ['password', '1234', 'qwerty', SITE_NAME];
  const SPECIAL_CHARS_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldState(input, msg) {
    const errorEl = document.getElementById('error-' + input.id.replace('input-', ''));
    if (msg) {
      input.classList.add('input-invalid');
      input.classList.remove('input-valid');
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.add('visible');
      }
    } else {
      input.classList.remove('input-invalid');
      input.classList.add('input-valid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
    }
  }

  function validarNombre(input) {
    const val = input.value;
    if (val === '') {
      setFieldState(input, 'El nombre es obligatorio.');
      return false;
    }
    if (val !== val.trim()) {
      setFieldState(input, 'El nombre no debe tener espacios al inicio o al final.');
      return false;
    }
    setFieldState(input, null);
    return true;
  }

  function validarApellido(input) {
    const val = input.value;
    if (val === '') {
      setFieldState(input, 'El apellido es obligatorio.');
      return false;
    }
    if (val !== val.trim()) {
      setFieldState(input, 'El apellido no debe tener espacios al inicio o al final.');
      return false;
    }
    setFieldState(input, null);
    return true;
  }

  function validarEmail(input) {
    const val = input.value;
    if (val === '') {
      setFieldState(input, 'El email es obligatorio.');
      return false;
    }
    if (val !== val.trim()) {
      setFieldState(input, 'El email no debe tener espacios al inicio o al final.');
      return false;
    }
    if (!EMAIL_REGEX.test(val)) {
      setFieldState(input, 'Ingresá un email válido.');
      return false;
    }
    setFieldState(input, null);
    return true;
  }

  function validarPassword(passwordInput, email, nombre) {
    const val = passwordInput.value;
    const valLower = val.toLowerCase();
    
    if (val === '') {
      setFieldState(passwordInput, 'La contraseña es obligatoria.');
      return false;
    }
    if (val !== val.trim()) {
      setFieldState(passwordInput, 'La contraseña no debe tener espacios al inicio o al final.');
      return false;
    }
    if (val.length < 8) {
      setFieldState(passwordInput, 'Mínimo 8 caracteres.');
      return false;
    }
    if (!/[a-zA-Z]/.test(val)) {
      setFieldState(passwordInput, 'Debe incluir al menos una letra.');
      return false;
    }
    if (!/[0-9]/.test(val)) {
      setFieldState(passwordInput, 'Debe incluir al menos un número.');
      return false;
    }
    if (!SPECIAL_CHARS_REGEX.test(val)) {
      setFieldState(passwordInput, 'Debe incluir al menos un carácter especial.');
      return false;
    }
    
    const nombreLower = nombre.trim().toLowerCase();
    const forbidden = [...FORBIDDEN_STRINGS];
    if (nombreLower) forbidden.push(nombreLower);
    
    for (const s of forbidden) {
      if (valLower.includes(s)) {
        setFieldState(passwordInput, `No puede contener "${s}".`);
        return false;
      }
    }
    if (valLower === email.trim().toLowerCase()) {
      setFieldState(passwordInput, 'No puede ser igual al email.');
      return false;
    }
    setFieldState(passwordInput, null);
    return true;
  }

  function validarPasswordRepeat(repeatInput, passwordVal) {
    const val = repeatInput.value;
    if (val === '') {
      setFieldState(repeatInput, 'Repetí la contraseña.');
      return false;
    }
    if (val !== passwordVal) {
      setFieldState(repeatInput, 'Las contraseñas no coinciden.');
      return false;
    }
    setFieldState(repeatInput, null);
    return true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('register-form');
    const globalError = document.getElementById('form-global-error');
    if (!form) return;

    const fields = {
      nombre: document.getElementById('input-nombre'),
      apellido: document.getElementById('input-apellido'),
      email: document.getElementById('input-email'),
      password: document.getElementById('input-password'),
      repeat: document.getElementById('input-password-repeat')
    };

    // Lógica para mostrar/ocultar contraseña
    const toggles = document.querySelectorAll('.toggle-password');
    toggles.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const icon = this.querySelector('i');

        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const results = [
        validarNombre(fields.nombre),
        validarApellido(fields.apellido),
        validarEmail(fields.email),
        validarPassword(fields.password, fields.email.value, fields.nombre.value),
        validarPasswordRepeat(fields.repeat, fields.password.value)
      ];

      if (results.every(r => r === true)) {
        globalError.classList.remove('visible');
        form.submit();
      } else {
        globalError.textContent = 'No se permitió el registro porque faltan completar datos o hay errores.';
        globalError.classList.add('visible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
})();
