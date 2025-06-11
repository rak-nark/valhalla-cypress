describe('Pruebas de Login', () => {
  beforeEach(() => {
    // Antes de cada prueba, visita la página de login
    cy.visit('/login');
  });

  it('debe tener los campos vacíos y el botón deshabilitado al cargar la página', () => {
    cy.get('input#correoCliente').should('have.value', '');
    cy.get('input#contrasenaCliente').should('have.value', '');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debe mostrar un error si el campo correo está vacío', () => {
    cy.get('input#contrasenaCliente').type('123456789');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input#correoCliente').focus().blur(); // Simula perder el foco
    cy.contains('Ingrese un correo válido.').should('be.visible');
  });

  it('debe mostrar un error si la contraseña está vacía', () => {
    cy.get('input#correoCliente').type('usuario@ejemplo.com');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input#contrasenaCliente').focus().blur();
    cy.contains('La contraseña debe tener al menos 8 caracteres.').should('be.visible');
  });

  it('debe mostrar un error si el correo no es válido', () => {
    cy.get('input#correoCliente').type('correo-no-valido').blur();
    cy.get('input#contrasenaCliente').type('123456789');
    cy.contains('Ingrese un correo válido.').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('no debe aceptar solo espacios en el campo correo', () => {
    cy.get('input#correoCliente').type('     ').blur();
    cy.get('input#contrasenaCliente').type('123456789');
    cy.contains('Ingrese un correo válido.').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debe mostrar un error si la contraseña es demasiado corta', () => {
    cy.get('input#correoCliente').type('usuario@ejemplo.com');
    cy.get('input#contrasenaCliente').type('123');
    cy.get('input#contrasenaCliente').blur();
    cy.contains('La contraseña debe tener al menos 8 caracteres.').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debe desaparecer el mensaje de error al corregir el correo', () => {
    cy.get('input#correoCliente').type('correo-no-valido').blur();
    cy.contains('Ingrese un correo válido.').should('be.visible');
    cy.get('input#correoCliente').clear().type('usuario@ejemplo.com').blur();
    cy.contains('Ingrese un correo válido.').should('not.exist');
  });

  it('debe habilitar el botón cuando los datos son válidos', () => {
    cy.get('input#correoCliente').type('usuario@ejemplo.com');
    cy.get('input#contrasenaCliente').type('12345678');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('debe iniciar sesión correctamente con credenciales válidas y redirigir a /home', () => {
    cy.get('input#correoCliente').type('angelita@gmail.com');
    cy.get('input#contrasenaCliente').type('123456789');
    cy.get('button[type="submit"]').click();
    // Espera la redirección a /home
    cy.url().should('include', '/home');
  });

  it('debe mostrar un alert con mensaje de error cuando el login es incorrecto', () => {
    // Credenciales incorrectas
    cy.get('input#correoCliente').type('usuario@ejemplo.com');
    cy.get('input#contrasenaCliente').type('incorrecta123');
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Correo o contraseña incorrectos.');
    });
    cy.get('button[type="submit"]').click();
    // Verifica que NO redirige a /home
    cy.url().should('not.include', '/home');
  });

  it('debe mostrar un alert con mensaje de error cuando el correo es incorrecto', () => {
    // Escribe un correo incorrecto
    cy.get('input#correoCliente').type('correo-invalido@gmail.com');
    // Escribe una contraseña válida
    cy.get('input#contrasenaCliente').type('123456789');
    // Prepara el listener para la alerta antes de hacer clic en el botón
    cy.on('window:alert', (str) => {
      // Verifica que el mensaje de la alerta sea el esperado
      expect(str).to.equal('Correo electrónico no encontrado.');
    });
    // Hace clic en el botón para enviar el formulario
    cy.get('button[type="submit"]').click();
  });

  it('debe redirigir a la página de registro al hacer clic en "Regístrate aquí"', () => {
    cy.contains('Regístrate aquí').click();
    cy.url().should('include', '/signup');
  });
});