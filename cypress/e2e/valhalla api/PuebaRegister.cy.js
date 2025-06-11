describe('Pruebas de Registro', () => {
    beforeEach(() => {
        cy.visit('/signup');
    });

    it('debe tener los campos vacíos y el botón habilitado al cargar la página', () => {
        cy.get('input#nombreCliente').should('have.value', '');
        cy.get('input#apellidoCliente').should('have.value', '');
        cy.get('input#correoCliente').should('have.value', '');
        cy.get('input#contrasenaCliente').should('have.value', '');
        cy.get('button[type="submit"]').should('be.enabled');
    });

    it('debe mostrar error si el nombre está vacío', () => {
        cy.get('input#apellidoCliente').type('Pérez');
        cy.get('input#correoCliente').type('test@email.com');
        cy.get('input#contrasenaCliente').type('12345678');
        cy.get('input#nombreCliente').focus().blur();
        cy.contains('El nombre es obligatorio.').should('be.visible');
    });

    it('debe mostrar error si el apellido está vacío', () => {
        cy.get('input#nombreCliente').type('Juan');
        cy.get('input#correoCliente').type('test@email.com');
        cy.get('input#contrasenaCliente').type('12345678');
        cy.get('input#apellidoCliente').focus().blur();
        cy.contains('El apellido es obligatorio.').should('be.visible');
    });

    it('debe mostrar error si el nombre contiene caracteres no permitidos', () => {
        cy.get('input#nombreCliente').type('Juan123').blur();
        cy.contains('Solo se permiten letras.').should('be.visible');
    });

    it('debe mostrar error si el apellido contiene caracteres no permitidos', () => {
        cy.get('input#apellidoCliente').type('Pérez!').blur();
        cy.contains('Solo se permiten letras.').should('be.visible');
    });

    it('debe mostrar error si el correo no es válido', () => {
        //cy.get('input#nombreCliente').type('Juan');
        //cy.get('input#apellidoCliente').type('Pérez');
        //cy.get('input#correoCliente').type('correo-no-valido');
        //cy.get('input#contrasenaCliente').type('12345678');
        //cy.get('button[type="submit"]').click();
        //cy.contains('Ingrese un correo válido.').should('be.visible');
    });

    it('debe mostrar error si la contraseña es muy corta', () => {
        //cy.get('input#nombreCliente').type('Juan');
        //cy.get('input#apellidoCliente').type('Pérez');
        //cy.get('input#correoCliente').type('juan@email.com');
        //cy.get('input#contrasenaCliente').type('123');
        //cy.get('button[type="submit"]').click();
       // cy.contains('La contraseña debe tener al menos 8 caracteres.').should('be.visible');
    });

    it('debe registrar correctamente con datos válidos', () => {
        cy.get('input#nombreCliente').type('Juan');
        cy.get('input#apellidoCliente').type('Pérez');
        cy.get('input#correoCliente').type('juan.perez@email.com');
        cy.get('input#contrasenaCliente').type('12345678');
        cy.get('button[type="submit"]').click();
        // Aquí puedes verificar la redirección o mensaje de éxito
        // cy.url().should('include', '/login');
        // cy.contains('Registro exitoso').should('be.visible');
    });

    it('debe redirigir al login al hacer clic en "Iniciar Sesión"', () => {
        cy.contains('Iniciar Sesión').click();
        cy.url().should('include', '/login');
    });

    it('debe redirigir a /home al registrar correctamente con datos válidos', () => {
    cy.get('input#nombreCliente').type('Juan');
    cy.get('input#apellidoCliente').type('Pérez');
    cy.get('input#correoCliente').type('juan.perez@email.com');
    cy.get('input#contrasenaCliente').type('12345678');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/home');
});

it('no debe permitir registrar un usuario ya existente', () => {
    cy.get('input#nombreCliente').type('Angelita');
    cy.get('input#apellidoCliente').type('Gómez');
    cy.get('input#correoCliente').type('angelita@gmail.com');
    cy.get('input#contrasenaCliente').type('123456789');
    cy.get('button[type="submit"]').click();
    // Ajusta el mensaje según lo que muestre tu app
    cy.contains('El correo ya está registrado').should('be.visible');
});
});