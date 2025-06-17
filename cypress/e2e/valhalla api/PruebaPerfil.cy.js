describe('Pruebas de Perfil', () => {
    beforeEach(() => {
        // Login antes de cada prueba
        cy.visit('/login');
        cy.get('input#correoCliente').type('juan.perez@email.com');
        cy.get('input#contrasenaCliente').type('123456789');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/home');
        // Ir a perfil
        cy.contains('Mi Perfil').click();
        cy.url().should('include', '/perfil');
    });



    it('no debe permitir números en el nombre', () => {
        cy.get('input#nombre').clear().type('Juan123');
        cy.get('button[type="submit"]').click();
        cy.contains('Solo se permiten letras.').should('be.visible');
    });

    it('no debe permitir números en el apellido', () => {
        cy.get('input#apellido').clear().type('Pérez123');
        cy.get('button[type="submit"]').click();
        cy.contains('Solo se permiten letras.').should('be.visible');
    });

    it('no debe permitir contraseña con menos de 8 caracteres', () => {
        cy.get('input#contrasena').clear().type('12345');
        cy.get('button[type="submit"]').click();
        // Ajusta el mensaje si tu backend/front lo muestra diferente
        cy.on('window:alert', (str) => {
            expect(str).to.contain('Errores de validación');
        });
    });

        it('debe navegar entre las opciones del navbar', () => {
        cy.contains('Home').click();
        cy.url().should('include', '/home');
        cy.contains('Mi Perfil').click();
        cy.url().should('include', '/perfil');
        cy.contains('Reservar Consola').click();
        cy.url().should('include', '/reserva');
        cy.contains('Mis Reservas').click();
        cy.url().should('include', '/mis-reservas');
    });


    it('debe actualizar la contraseña correctamente', () => {
        cy.get('input#contrasena').clear().type('123456789');
        cy.get('button[type="submit"]').click();
        cy.on('window:alert', (str) => {
            expect(str).to.contain('Datos actualizados correctamente');
        });
        cy.url().should('include', '/login');
    });


});