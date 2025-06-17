describe('Pruebas de Mis Reservas', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input#correoCliente').type('marcanno@gmail.com');
        cy.get('input#contrasenaCliente').type('123456789');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/home');
        cy.contains('Mis Reservas').click();
        cy.url().should('include', '/mis-reservas');
    });

    it('debe mostrar la tabla de reservas', () => {
        cy.get('h2.animated-title').should('contain.text', 'Mis Reservas');
        cy.get('table.reservas-table').should('be.visible');
        cy.get('table.reservas-table tbody tr').should('have.length.at.least', 1);
    });

    it('debe alternar entre reservas pendientes e historial completo', () => {
        cy.get('button.btn-toggle-view').click();
        cy.get('button.btn-toggle-view').should('contain.text', 'Mostrar Reservas Pendientes');
        cy.get('button.btn-toggle-view').click();
        cy.get('button.btn-toggle-view').should('contain.text', 'Mostrar Historial Completo');
    });

    it('debe abrir el modal de edición y guardar cambios', () => {
        cy.get('button.btn-edit').first().click();
        cy.get('#modalEditarReserva').should('be.visible');
        // Cambia la hora y el tiempo de uso
        cy.get('#horaEditar').clear().type('15:00');
        cy.get('#tiempoUsoEditar').select('60');
        cy.get('button.btn-primary').contains('Guardar Cambios').click();
        cy.on('window:alert', (str) => {
            expect(str).to.contain('Reserva actualizada');
        });
    });

    it('debe eliminar una reserva', () => {
        cy.get('button.btn-delete').first().click();
        cy.on('window:alert', (str) => {
            expect(str).to.contain('Reserva eliminada');
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

    it('debe cerrar sesión correctamente', () => {
        cy.contains('Cerrar Sesión').click();
        cy.url().should('include', '/login');
    });
});