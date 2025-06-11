describe('Login de Administrador', () => {
    beforeEach(() => {
        cy.visit('http://74.235.100.236:8080');
    });

    it('Debe dejar ingresar al administrador', () => {
        cy.get('input[name="correoCliente"]').type('juanitoalimana@gmail.com');
        cy.get('input[name="contrasenaCliente"]').type('123456789');
        cy.get('input[name="Ingresar"]').click();

        // Espera redirección al home de admin
        cy.url().should('include', '/home.php');
    });

    it('No deja ingresar a usuario no administrador', () => {
        cy.get('input[name="correoCliente"]').type('usuario@noadmin.com');
        cy.get('input[name="contrasenaCliente"]').type('cualquierclave');
        cy.get('input[name="Ingresar"]').click();

        // Espera alerta de solo administradores
        cy.on('window:alert', (txt) => {
            expect(txt).to.contains('Solo los administradores pueden iniciar sesión.');
        });

        // Debe seguir en el login
        cy.url().should('include', '/');
    });

    it('No deja ingresar con credenciales incorrectas', () => {
        cy.get('input[name="correoCliente"]').type('juanitoalimana@gmail.com');
        cy.get('input[name="contrasenaCliente"]').type('incorrecta');
        cy.get('input[name="Ingresar"]').click();

        cy.on('window:alert', (txt) => {
            expect(txt).to.contains('Contraseña incorrecta.');
        });

        cy.url().should('include', '/');
    });

    it('No deja ingresar a usuario inexistente', () => {
        cy.visit('http://74.235.100.236:8080');
        cy.on('window:alert', (txt) => {
            expect(txt).to.eq('Usuario no encontrado.');
        });
        cy.get('input[name="correoCliente"]').type('noexiste@usuario.com');
        cy.get('input[name="contrasenaCliente"]').type('loquesea');
        cy.get('input[name="Ingresar"]').click();
        cy.url().should('include', '/');
    });
});