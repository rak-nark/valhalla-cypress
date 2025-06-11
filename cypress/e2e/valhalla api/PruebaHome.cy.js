describe('Pruebas de Home', () => {
    beforeEach(() => {
        // Realiza login antes de cada prueba
        cy.visit('/login');
        cy.get('input#correoCliente').type('angelita@gmail.com');
        cy.get('input#contrasenaCliente').type('123456789');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/home');
    });

    it('debe mostrar el banner de bienvenida', () => {
        cy.contains('¡Bienvenidos a GameZone!').should('be.visible');
        cy.contains('Tu destino definitivo para videojuegos y entretenimiento').should('be.visible');
    });

    it('debe navegar a Mi Perfil desde el navbar', () => {
        cy.contains('Mi Perfil').click();
        cy.url().should('include', '/perfil');
    });

    it('debe navegar a Reservar Consola desde el navbar', () => {
        cy.contains('Reservar Consola').click();
        cy.url().should('include', '/reserva');
    });

    it('debe navegar a Mis Reservas desde el navbar', () => {
        cy.contains('Mis Reservas').click();
        cy.url().should('include', '/mis-reservas');
    });

    it('debe permanecer en Home al hacer clic en Home en el navbar', () => {
        cy.contains('Home').click();
        cy.url().should('include', '/home');
    });

    it('debe cerrar sesión y redirigir al login', () => {
        cy.contains('Cerrar Sesión').click();
        cy.url().should('include', '/login');
    });
});