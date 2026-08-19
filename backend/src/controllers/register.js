/**
 * register.js — Validación client-side del formulario de registro
 * HARDWARE STORE · Sprint 1
 */

// Patrón IIFE (Immediately Invoked Function Expression) para encapsular variables y no ensuciar el scope global
(function () {
  'use strict';

  const SITE_NAME = 'hardwarestore';
  const FORBIDDEN_STRINGS = ['password', '1234', 'qwerty', SITE_NAME];
  const SPECIAL_CHARS_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
  // Expresión Regular (Regex) para validar el formato estándar de un correo electrónico
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Función centralizadora para manipular el DOM (clases CSS) según el estado de error o éxito
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
    // Verificación de espacios residuales al inicio o final
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
    // Testeamos el string contra nuestra Expresión Regular de Email
    if (!EMAIL_REGEX.test(val)) {
      setFieldState(input, 'Ingresá un email válido.');
      return false;
    }
    setFieldState(input, null);
    return true;
  }

  function validarPassword(passwordInput) {
    const val = passwordInput.value;
    
    if (val === '') {
      setFieldState(passwordInput, 'La contraseña es obligatoria.');
      return false;
    }
    if (val.length < 8) {
      setFieldState(passwordInput, 'Mínimo 8 caracteres.');
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
    // Verificación de coincidencia exacta entre ambos campos
    if (val !== passwordVal) {
      setFieldState(repeatInput, 'Las contraseñas no coinciden.');
      return false;
    }
    setFieldState(repeatInput, null);
    return true;
  }

  // Esperamos a que el HTML esté completamente cargado antes de buscar elementos en el DOM
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('register-form');
    const globalError = document.getElementById('form-global-error');
    if (!form) return;

    // Mapeo de inputs del DOM a un objeto para fácil acceso
    const fields = {
      nombre: document.getElementById('input-nombre'),
      apellido: document.getElementById('input-apellido'),
      email: document.getElementById('input-email'),
      password: document.getElementById('input-password'),
      repeat: document.getElementById('input-password-repeat')
    };

    // Lógica UI para el botón de "Ojo" (Mostrar/Ocultar contraseña modificando el type del input)
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

    // Interceptamos el evento de envío del formulario
    form.addEventListener('submit', function (e) {
      // Prevenimos que la página se recargue inmediatamente
      e.preventDefault();
      
      const results = [
        validarNombre(fields.nombre),
        validarApellido(fields.apellido),
        validarEmail(fields.email),
        validarPassword(fields.password),
        validarPasswordRepeat(fields.repeat, fields.password.value)
      ];

      // Verificamos que absolutamente todas las funciones hayan retornado 'true'
      if (results.every(r => r === true)) {
        globalError.classList.remove('visible');
        // Si todo está OK, liberamos el formulario para que viaje al backend
        form.submit();
      } else {
        globalError.textContent = 'No se permitió el registro porque faltan completar datos o hay errores.';
        globalError.classList.add('visible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
})();