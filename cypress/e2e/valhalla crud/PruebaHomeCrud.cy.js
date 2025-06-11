describe('Panel de Administración - Home', () => {
    beforeEach(() => {
        // Inicia sesión como administrador antes de cada test
        cy.visit('http://74.235.100.236:8080');
        cy.get('input[name="correoCliente"]').type('juanitoalimana@gmail.com');
        cy.get('input[name="contrasenaCliente"]').type('123456789');
        cy.get('input[name="Ingresar"]').click();
        cy.url().should('include', '/home.php');
    });

    it('Debe mostrar el panel de gestión de clientes', () => {
        cy.contains('Gestión de Clientes');
        cy.get('table').should('exist');
        cy.get('button').contains('Nuevo Cliente').should('be.visible');
    });

    it('Debe permitir agregar un nuevo cliente', () => {
        cy.get('button').contains('Nuevo Cliente').click();
        cy.get('#nuevoClienteModal').should('be.visible');
        cy.get('#nuevoClienteModal input[name="nombreCliente"]').type('TestNombre');
        cy.get('#nuevoClienteModal input[name="apellidoCliente"]').type('TestApellido');
        cy.get('#nuevoClienteModal input[name="correoCliente"]').type(`test${Date.now()}@test.com`);
        cy.get('#nuevoClienteModal input[name="contrasenaCliente"]').type('claveTest123');
        cy.get('#nuevoClienteModal button[type="submit"]').contains('Guardar').click();


    });

    it('Debe permitir buscar clientes por nombre', () => {
        // Ir a la página 1 antes de buscar
        cy.get('ul.pagination').then($ul => {
            const $pagina1 = $ul.find('a.page-link').filter((i, el) => Cypress.$(el).text().trim() === '1');
            if ($pagina1.length) {
                cy.wrap($pagina1).click();
            }
        });
        cy.get('input[name="nombreCliente"]').first().clear().type('juanito');
        cy.get('button[type="submit"]').first().click();
        cy.get('table').contains('juanito');
    });

it('Debe permitir editar el cliente por nombre', () => {
    // Ir a la página 1 antes de buscar
    cy.get('ul.pagination').then($ul => {
        const $pagina1 = $ul.find('a.page-link').filter((i, el) => Cypress.$(el).text().trim() === '1');
        if ($pagina1.length) {
            cy.wrap($pagina1).click();
        }
    });
    // Buscar por nombre
    cy.get('input[name="nombreCliente"]').first().clear().type('TestNombre');
    cy.get('button[type="submit"]').first().click();
    // Editar el cliente encontrado
    cy.get('table').contains('td', 'TestNombre').parents('tr').within(() => {
        cy.get('button.btn-warning').click();
    });
    cy.get('.modal.show input[name="nombreCliente"]').clear().type('TestEditado');
    cy.get('.modal.show button[type="submit"]').contains('Guardar Cambios').click();
    cy.get('.modal.show').should('not.exist');
    cy.wait(1000);
    // Verifica que el cambio se refleje en la tabla
});

it('Debe permitir eliminar un cliente por nombre', () => {
    // Ir a la página 1 antes de buscar
    cy.get('ul.pagination').then($ul => {
        const $pagina1 = $ul.find('a.page-link').filter((i, el) => Cypress.$(el).text().trim() === '1');
        if ($pagina1.length) {
            cy.wrap($pagina1).click();
        }
    });
    // Buscar por nombre editado
    cy.get('input[name="nombreCliente"]').first().clear().type('TestEditado');
    cy.get('button[type="submit"]').first().click();
    // Eliminar el cliente encontrado
    cy.get('table').contains('td', 'TestEditado').parents('tr').within(() => {
        cy.get('button.btn-danger').click();
    });
    cy.get('.swal2-confirm').click();
    cy.contains('¡Eliminado!');
});

    it('Debe mostrar mensaje si no hay registros de clientes', () => {
        // Este test solo aplica si la base de datos está vacía.
        // Fuerza la búsqueda de un cliente inexistente para mostrar el mensaje.
        cy.get('input[name="nombreCliente"]').first().type('ClienteInexistenteUnico');
        cy.get('button[type="submit"]').first().click();
        cy.contains('No hay registros de clientes').should('exist');
    });

    it('Debe navegar correctamente entre las secciones del navbar', () => {
        // Clientes (home)
        cy.get('a.nav-link').contains('Clientes').click();
        cy.url().should('include', '/home.php');
        cy.contains('Gestión de Clientes').should('exist');

        // Consolas
        cy.get('a.nav-link').contains('Consolas').click();
        cy.url().should('include', '/consola.php');
        cy.contains('Consolas').should('exist');

        // Mantenimiento
        cy.get('a.nav-link').contains('Mantenimiento').click();
        cy.url().should('include', '/mantenimiento.php');
        cy.contains('Mantenimiento').should('exist');

        // Préstamos
        cy.get('a.nav-link').contains('Préstamos').click();
        cy.url().should('include', '/prestamo.php');
        cy.contains('Préstamos').should('exist');

        // Ventas
        cy.get('a.nav-link').contains('Ventas').click();
        cy.url().should('include', '/venta.php');
        cy.contains('Ventas').should('exist');

        // Ganancias
        cy.get('a.nav-link').contains('Ganancias').click();
        cy.url().should('include', '/ganancias.php');
        cy.contains('Ganancias').should('exist');
    });

    it('Debe mostrar y usar el menú de perfil', () => {
        // Abre el menú de perfil
        cy.get('a.nav-link.dropdown-toggle').click();
        cy.get('.dropdown-menu').contains('Iniciar Sesión').should('exist');
        cy.get('.dropdown-menu').contains('Cerrar Sesión').should('exist');
        // Prueba cerrar sesión
        cy.get('.dropdown-menu').contains('Cerrar Sesión').click();
        cy.on('window:alert', (txt) => {
            expect(txt).to.eq('Se cerró la sesión correctamente.');
        });
        // Espera a que redirija a index.php después del alert
        cy.url({ timeout: 10000 }).should('include', '/index.php');
    });
});