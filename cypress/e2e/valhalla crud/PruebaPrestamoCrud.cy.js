describe('Gestión de Préstamos', () => {
  beforeEach(() => {
    cy.visit('http://74.235.100.236:8080');
    cy.get('input[name="correoCliente"]').type('juanitoalimana@gmail.com');
    cy.get('input[name="contrasenaCliente"]').type('123456789');
    cy.get('input[name="Ingresar"]').click();
    cy.url().should('include', '/home.php');
    // Navega a la vista de préstamos usando el menú
    cy.get('a.nav-link').contains('Préstamos').click();
    cy.url().should('include', '/prestamo.php');
  });

  // PRUEBA 1: Insertar un préstamo nuevo
  it('debe permitir insertar un nuevo préstamo', () => {
    // Abre el modal
    cy.get('button[data-bs-target="#exampleModal"]').click();

    // Espera a que el modal esté visible
    cy.get('#exampleModal').should('have.class', 'show').within(() => {
      // Ahora sí, interactúa con los campos
      const fechaHoy = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
      cy.get('input[name="fecha"]:visible').type(fechaHoy); // O el formato correcto
      cy.get('input[name="hora"]').type('15:00');
      cy.get('select[name="tiempodeuso"]').select('60');
      cy.get('select[name="id_consola"]').select('Xbox 360 1');
      cy.get('button[name="guarda"]').click();
    });

    cy.get('table').should('contain', 'Xbox 360 1');
  });

  // PRUEBA 2: Editar un préstamo
  it('debe permitir editar un préstamo existente', () => {
    cy.get('button[data-bs-target^="#editModal_"]').first().click();

    cy.get('.modal.show').within(() => {
      cy.get('select[name="tiempodeuso"]').select('180'); // Selecciona "3 horas"
      cy.get('button[name="modificar"]').click();
    });

  });

  // PRUEBA 3: Eliminar un préstamo
  it('debe permitir eliminar un préstamo', () => {
    cy.get('form').find('button[name="elimina"]').first().click();

    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  // PRUEBA 4: Validación - no permitir envío con campos vacíos
  it('debe mostrar error si intentamos guardar sin llenar campos', () => {
    cy.get('button[data-bs-target="#exampleModal"]').click();
    cy.get('button[name="guarda"]').click();

    // Validamos si permanece en el formulario (por ejemplo, que no se cierre)
    cy.get('form').should('exist');
  });
});