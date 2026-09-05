# Moon Club Hub

MOON CLUB — WEB COMPLETA CON DISCORD + ROBLOX OAUTH, SISTEMA DE ADMINISTRADORES Y TICKETS



Quiero que construyas una aplicación web completa llamada MOON CLUB.



La aplicación debe ser moderna, profesional, completamente responsive y estar preparada para poder sacarse de Lovable y desplegarse de forma independiente, preferiblemente con un frontend compatible con GitHub Pages y un backend/API separado para las funciones que necesiten servidor.



Voy a adjuntar una imagen que será el logo oficial de Moon Club. Utiliza esa imagen como logo principal de la página y NO generes otro logo que sustituya al que voy a proporcionar.



---



1. IDENTIDAD VISUAL



Nombre:



MOON CLUB



Estética:



- Discoteca futurista.

- Cyber/neón.

- Moderna.

- Elegante.

- Oscura.

- Inspiración en clubes nocturnos y interfaces gaming modernas.

- Nada de apariencia corporativa aburrida.

- Nada de diseño genérico de IA.



Colores principales:



- Azul celeste neón.

- Amarillo neón.

- Rosa neón.

- Negro como color de fondo general.



Utiliza los colores neón principalmente en:



- Bordes.

- Botones.

- Sombras.

- Glow.

- Gradientes.

- Iconos.

- Elementos interactivos.

- Separadores.

- Estados activos.



El fondo general debe ser negro o casi negro.



Añade efectos de:



- Glow.

- Neon shadows.

- Gradientes suaves.

- Luces difuminadas.

- Efectos de discoteca.

- Animaciones sutiles.

- Glassmorphism oscuro cuando quede bien.



NO abuses de las animaciones. Debe verse profesional y seguir siendo rápido.



---



2. RESPONSIVE



La página debe funcionar perfectamente en:



- Android.

- iPhone.

- Tablets.

- Laptops.

- Monitores grandes.



Debe adaptarse automáticamente.



En celular:



- Menú lateral convertido en menú desplegable/hamburguesa.

- Botones grandes y fáciles de pulsar.

- Tickets en tarjetas.

- Chat adaptado a pantalla vertical.

- Nada debe salirse de la pantalla.

- El usuario debe poder utilizar todas las funciones desde el celular.



En PC:



- Sidebar.

- Dashboard completo.

- Panel de administración.

- Lista de tickets.

- Chat.



---



3. PÁGINA PRINCIPAL



Crear una landing page para Moon Club.



Debe contener:



- Logo proporcionado.

- Nombre MOON CLUB.

- Una breve descripción.

- Botón "Iniciar sesión".

- Botón "Continuar con Discord".

- Botón "Continuar con Roblox".



Los botones deben tener iconos oficiales apropiados.



Diseño del hero:



Fondo negro con iluminación azul, rosa y amarilla.



El logo debe tener un glow sutil que combine con la temática.



---



4. AUTENTICACIÓN



Implementar autenticación mediante:



Discord OAuth2



Botón:



Continuar con Discord



Debe utilizar el sistema OAuth oficial de Discord.



Solicitar únicamente los permisos necesarios para identificar al usuario.



No solicitar permisos innecesarios.



Nunca pedir la contraseña de Discord.



Roblox OAuth



Botón:



Continuar con Roblox



Utilizar el sistema oficial de autenticación/OAuth de Roblox disponible actualmente.



Nunca pedir la contraseña de Roblox.



---



5. SEGURIDAD DE OAUTH



IMPORTANTE:



Los Client Secret jamás deben estar en el frontend.



Utilizar variables de entorno.



Crear:



".env.example"



con variables similares a:



DISCORD_CLIENT_ID=

DISCORD_CLIENT_SECRET=

DISCORD_REDIRECT_URI=



ROBLOX_CLIENT_ID=

ROBLOX_CLIENT_SECRET=

ROBLOX_REDIRECT_URI=



SESSION_SECRET=



OWNER_DISCORD_ID=



No colocar valores reales.



Agregar ".env" al ".gitignore".



Nunca subir secretos a GitHub.



Utilizar:



- OAuth state.

- PKCE cuando corresponda.

- Protección CSRF.

- Cookies seguras.

- HttpOnly cuando corresponda.

- SameSite apropiado.

- HTTPS en producción.

- Validación de callbacks.

- Validación de inputs.



---



6. PROPIETARIO DE MOON CLUB



Debe existir un usuario propietario/OWNER.



El propietario inicial será el creador de la página.



El usuario de Discord esperado es:



djmikami



PERO NO uses el nombre de usuario como mecanismo de seguridad.



Quiero que el sistema utilice una variable:



"OWNER_DISCORD_ID"



para guardar el Discord User ID real del propietario.



En el README explica que debo colocar allí el ID numérico de la cuenta de Discord del creador.



Cuando el propietario inicie sesión con Discord y su ID coincida con "OWNER_DISCORD_ID", debe recibir automáticamente:



OWNER / CREADOR



Este usuario tendrá acceso completo al panel administrativo.



No debe ser posible convertirse en OWNER simplemente cambiando un nombre de usuario.



---



7. DASHBOARD DEL USUARIO



Después de iniciar sesión:



Mostrar un dashboard.



Debe mostrar:



- Avatar.

- Nombre.

- Username.

- ID.

- Plataforma utilizada para iniciar sesión.

- Estado de la cuenta.

- Fecha de registro si está disponible.

- Botón de cerrar sesión.



Si el usuario tiene Discord y Roblox vinculados:



Mostrar:



Discord conectado ✓



Roblox conectado ✓



También incluir:



Vincular Discord



Vincular Roblox



cuando corresponda.



---



8. ROLES



Crear un sistema de roles:



USER



Usuario normal.



Puede:



- Ver su perfil.

- Crear tickets.

- Ver sus propios tickets.

- Responder en sus propios tickets.

- Subir imágenes.

- Subir vídeos compatibles.

- Cerrar sus propios tickets cuando corresponda.



No puede:



- Ver tickets de otras personas.

- Ver tickets cerrados de otros usuarios.

- Administrar usuarios.

- Crear administradores.



---



ADMIN



Los administradores son usuarios seleccionados por el OWNER.



Los ADMIN pueden:



- Ver tickets abiertos.

- Ver tickets cerrados.

- Responder tickets.

- Cerrar tickets.

- Reabrir tickets cerrados.

- Ver información del usuario que abrió el ticket.

- Ver la razón del ticket.

- Ver archivos adjuntos.

- Enviar imágenes.

- Enviar vídeos compatibles.

- Gestionar tickets.



Los ADMIN NO pueden:



- Crear otros administradores salvo que el OWNER lo permita.

- Cambiar al OWNER.

- Eliminar al OWNER.

- Modificar credenciales OAuth.



---



OWNER



El OWNER tiene todos los permisos.



Puede:



- Crear administradores.

- Quitar administradores.

- Ver todos los usuarios.

- Ver todos los tickets.

- Gestionar tickets.

- Reabrir tickets.

- Cerrar tickets.

- Gestionar configuración.

- Ver registros administrativos.

- Gestionar roles.



---



9. PANEL DEL OWNER



Cuando "djmikami" inicie sesión y sea reconocido mediante "OWNER_DISCORD_ID", mostrar una opción:



OWNER PANEL



El panel debe ser completamente independiente del dashboard normal.



Diseño profesional tipo panel administrativo.



Secciones:



Overview



Mostrar:



- Usuarios registrados.

- Administradores.

- Tickets abiertos.

- Tickets cerrados.

- Tickets totales.



Mostrar estadísticas mediante tarjetas.



---



Administradores



Crear una sección:



Administradores



Mostrar una lista de administradores.



Cada administrador debe mostrar:



- Avatar.

- Username.

- Discord ID.

- Fecha en la que recibió el rol.

- Estado.



Botones:



Dar administrador



Quitar administrador



---



10. DAR ADMINISTRADOR



El OWNER podrá buscar un usuario registrado.



Opciones:



- Buscar por username.

- Buscar por Discord ID.

- Buscar por Roblox ID.



Al seleccionar un usuario:



Mostrar confirmación:



"¿Quieres otorgar permisos de administrador a este usuario?"



Botones:



Cancelar



Confirmar



Al confirmar:



- Cambiar role a ADMIN.

- Registrar quién otorgó el rol.

- Registrar fecha/hora.

- Mostrar notificación.



---



11. QUITAR ADMINISTRADOR



El OWNER podrá quitar el rol ADMIN.



Mostrar confirmación.



Al quitarlo:



- Deja de tener acceso administrativo inmediatamente.

- Sus tickets existentes NO deben desaparecer.

- Sus mensajes NO deben desaparecer.

- Mantener el historial.



---



12. SISTEMA DE TICKETS



Crear un sistema de tickets profesional.



El usuario normal tendrá un botón:



+ Crear Ticket



Al pulsarlo abrir un formulario.



Campos:



Nombre de usuario



Campo para username.



Razón



Textarea grande:



"Explica detalladamente el motivo de tu ticket."



Categoría



Dropdown:



- Soporte.

- Reporte.

- Problema.

- Consulta.

- Otro.



Evidencias



Permitir adjuntar:



- Imágenes.

- Vídeos compatibles.



Mostrar una vista previa antes de enviar.



Botón:



Crear Ticket



---



13. CREACIÓN DEL TICKET



Cuando se cree:



Generar automáticamente:



- Ticket ID único.

- Usuario.

- Username.

- ID del usuario.

- Categoría.

- Razón.

- Fecha.

- Estado: ABIERTO.



Ejemplo:



"#MC-000001"



---



14. CHAT DEL TICKET



Al abrir un ticket se debe crear una interfaz de chat.



IMPORTANTE:



Solo pueden ver el contenido del ticket:



1. La persona que creó el ticket.

2. Los ADMIN.

3. El OWNER.



Ningún usuario normal debe poder ver tickets de otra persona.



El chat debe parecer una conversación moderna.



Cada mensaje debe mostrar:



- Avatar.

- Username.

- Rol si es ADMIN/OWNER.

- Fecha/hora.

- Mensaje.



Permitir:



- Texto.

- Imágenes.

- Vídeos compatibles.

- Adjuntos permitidos.



---



15. EVIDENCIAS



Los usuarios deben poder mandar pruebas mediante el chat.



Ejemplos:



- Capturas de pantalla.

- Fotografías.

- Vídeos.



Mostrar las imágenes dentro del chat cuando sea posible.



Los vídeos deben mostrar un reproductor cuando el formato sea compatible.



No almacenar archivos directamente dentro de GitHub.



Utilizar un sistema de almacenamiento/backend apropiado para producción.



Validar:



- Tipo de archivo.

- Tamaño.

- Extensión.

- MIME type.



No permitir archivos peligrosos o ejecutables.



---



16. PANEL DE ADMINISTRADORES



Cuando un usuario sea ADMIN, aparecerá en su sidebar:



ADMIN PANEL



Dentro:



Tickets Abiertos



Tickets Cerrados



---



17. TICKETS ABIERTOS



Los tickets abiertos deben aparecer en una lista.



ORDEN:



Del más antiguo al más nuevo.



Es decir:



Ticket más antiguo arriba.



Ticket más reciente abajo.



Cada ticket debe mostrar:



- Ticket ID.

- Username.

- Avatar.

- Razón.

- Categoría.

- Fecha/hora.

- Tiempo desde creación.

- Estado.



Ejemplo:



"#MC-000021"



Razón: Problema con mi cuenta



Abierto por: username



Categoría: Soporte



Hace 25 minutos



---



18. TICKETS CERRADOS



Crear sección:



Tickets Cerrados



Solo:



- ADMIN

- OWNER



pueden acceder.



Los usuarios normales NO pueden ver esta sección.



Cada ticket cerrado debe mostrar:



- ID.

- Usuario.

- Razón.

- Quién lo cerró.

- Fecha de cierre.

- Motivo de cierre si existe.



---



19. REABRIR TICKETS



Dentro de un ticket cerrado:



Botón:



Reabrir Ticket



Solo ADMIN/OWNER.



Al pulsarlo:



- Estado cambia a ABIERTO.

- Regresa automáticamente a Tickets Abiertos.

- Mantiene todo el historial.

- No elimina mensajes.

- Registrar quién lo reabrió y cuándo.



Esto debe servir si un ticket fue cerrado accidentalmente.



---



20. CERRAR TICKETS



Dentro de un ticket abierto:



Botón:



Cerrar Ticket



Antes de cerrar:



Mostrar confirmación.



Opcionalmente permitir:



Motivo del cierre



Al cerrar:



- Estado = CLOSED.

- Registrar administrador.

- Registrar fecha.

- Mover a Tickets Cerrados.



---



21. BÚSQUEDA Y FILTROS



En ADMIN PANEL agregar:



- Buscar por username.

- Buscar por Ticket ID.

- Buscar por categoría.

- Filtrar abiertos/cerrados.

- Ordenar por fecha.



---



22. NOTIFICACIONES



Cuando sea posible mediante el backend:



Notificar al usuario cuando:



- Un admin responda.

- Su ticket sea cerrado.

- Su ticket sea reabierto.



Notificar a administradores cuando:



- Se cree un nuevo ticket.



Las notificaciones deben aparecer también dentro de la web.



Crear un icono de campana:



🔔



---



23. PERFIL



Crear página:



Mi Perfil



Mostrar:



- Avatar.

- Username.

- Discord.

- Roblox.

- ID.

- Tickets creados.

- Tickets abiertos.

- Tickets cerrados.



No mostrar información privada innecesaria.



---



24. SIDEBAR



Sidebar para usuarios normales:



MOON CLUB



- Dashboard

- Mi Perfil

- Mis Tickets

- Crear Ticket

- Notificaciones

- Configuración

- Cerrar sesión



Para ADMIN:



- Dashboard

- Mi Perfil

- Mis Tickets

- Crear Ticket

- ADMIN PANEL

  - Tickets Abiertos

  - Tickets Cerrados

- Notificaciones

- Configuración

- Cerrar sesión



Para OWNER:



Añadir:



- OWNER PANEL

  - Overview

  - Administradores

  - Usuarios

  - Tickets

  - Configuración



---



25. PÁGINA 404



Crear una página 404 personalizada con estética Moon Club.



Texto:



404



Esta página no existe.



Botón:



Volver a Moon Club



---



26. LOADING



Crear loaders elegantes con estética neón.



No utilizar loaders genéricos.



---



27. MOBILE



En móviles:



Sidebar convertido en menú.



Los tickets deben mostrarse como tarjetas.



El chat debe utilizar prácticamente todo el ancho disponible.



Los mensajes y archivos adjuntos deben adaptarse automáticamente.



Los botones deben tener suficiente tamaño para ser pulsados fácilmente.



---



28. BASE DE DATOS



Necesito una base de datos para:



users



- id

- discord_id

- discord_username

- discord_avatar

- roblox_id

- roblox_username

- role

- created_at

- updated_at



tickets



- id

- ticket_number

- user_id

- username

- category

- reason

- status

- created_at

- closed_at

- closed_by

- reopened_at

- reopened_by



messages



- id

- ticket_id

- user_id

- content

- attachment_url

- attachment_type

- created_at



admin_actions



- id

- admin_id

- target_user_id

- action

- created_at



Utilizar IDs internos seguros.



No almacenar contraseñas.



---



29. CONTROL DE ACCESO



MUY IMPORTANTE:



No confiar solamente en la interfaz.



Aunque un usuario modifique JavaScript o haga peticiones manuales, el backend debe comprobar:



- Quién es.

- Qué rol tiene.

- Qué ticket intenta abrir.

- Si pertenece a ese ticket.

- Si tiene permisos ADMIN.

- Si tiene permisos OWNER.



Por ejemplo:



Un USER no debe poder acceder a:



"/api/admin/tickets"



aunque intente escribir esa URL manualmente.



El backend debe devolver:



"403 Forbidden"



cuando corresponda.



---



30. API



Crear endpoints organizados.



Ejemplos:



"/api/auth/discord"



"/api/auth/discord/callback"



"/api/auth/roblox"



"/api/auth/roblox/callback"



"/api/auth/me"



"/api/auth/logout"



"/api/users"



"/api/tickets"



"/api/tickets/:id"



"/api/tickets/:id/messages"



"/api/tickets/:id/close"



"/api/tickets/:id/reopen"



"/api/admin/users"



"/api/admin/grant"



"/api/admin/revoke"



El backend debe validar autenticación y autorización en todos los endpoints sensibles.



---



31. GITHUB



Quiero que el proyecto quede perfectamente preparado para subirlo a GitHub.



Crear:



".gitignore"



".env.example"



"README.md"



Documentación completa.



Separar:



"/frontend"



"/backend"



o una estructura equivalente claramente organizada.



---



32. GITHUB PAGES



IMPORTANTE:



Quiero que el frontend pueda compilarse como sitio estático y desplegarse en:



"TUUSUARIO.github.io"



No quiero que el frontend dependa de Lovable.



Si una función necesita backend, debe comunicarse mediante una API externa segura.



No intentes colocar secretos OAuth en GitHub Pages.



Explica claramente en README qué partes necesitan backend.



---



33. DEPLOYMENT GRATUITO



Preparar el proyecto para que sea posible utilizar:



Frontend:



GitHub Pages o Cloudflare Pages.



Backend:



Una plataforma gratuita/serverless compatible con el proyecto.



Base de datos:



Una opción con nivel gratuito.



Si alguna de estas opciones tiene limitaciones, documentarlas claramente.



NO quiero que la aplicación dependa de Lovable para funcionar en producción.



---



34. README



Crear un README.md extremadamente claro que explique:



1. Qué es Moon Club.

2. Estructura del proyecto.

3. Instalación.

4. Variables de entorno.

5. Crear aplicación Discord.

6. Configurar Discord OAuth.

7. Crear/configurar Roblox OAuth.

8. Configurar Redirect URI.

9. Configurar OWNER_DISCORD_ID.

10. Configurar base de datos.

11. Ejecutar localmente.

12. Compilar frontend.

13. Subir frontend a GitHub.

14. Configurar GitHub Pages.

15. Desplegar backend.

16. Configurar CORS.

17. Configurar variables de entorno del backend.

18. Probar Discord.

19. Probar Roblox.

20. Probar sistema de tickets.



---



35. NO HACER



NO:



- Inventar Client IDs.

- Inventar Client Secrets.

- Poner secretos en el frontend.

- Guardar contraseñas.

- Crear un login falso.

- Utilizar autenticación simulada en producción.

- Depender de Lovable para producción.

- Poner logos de Lovable.

- Poner textos "Made with Lovable".

- Poner publicidad.

- Subir secretos a GitHub.

- Permitir que un usuario normal vea tickets ajenos.

- Permitir que un ADMIN se convierta en OWNER.

- Permitir que alguien se convierta en OWNER cambiando su username.

- Confiar únicamente en permisos del frontend.



---



36. EXPERIENCIA FINAL



Quiero que la página se sienta como una plataforma real llamada:



MOON CLUB



Debe parecer una mezcla de:



- Club nocturno futurista.

- Comunidad gaming.

- Sistema profesional de soporte.

- Dashboard moderno.



La combinación de colores debe ser:



NEGRO + AZUL CELESTE NEÓN + ROSA NEÓN + AMARILLO NEÓN.



Todo debe tener una estética coherente.



Quiero que el resultado final sea limpio, moderno y profesional, no simplemente una plantilla.



---



37. ANTES DE TERMINAR



Antes de considerar el proyecto terminado, revisa:



✓ Discord OAuth preparado.



✓ Roblox OAuth preparado.



✓ OWNER mediante Discord ID.



✓ Usuario propietario inicial: djmikami, pero la autorización real debe depender de OWNER_DISCORD_ID.



✓ Sistema USER / ADMIN / OWNER.



✓ Panel OWNER.



✓ Panel ADMIN.



✓ Crear administradores.



✓ Quitar administradores.



✓ Crear tickets.



✓ Razón del ticket.



✓ Username del creador.



✓ Categoría.



✓ Chat privado.



✓ Imágenes.



✓ Vídeos compatibles.



✓ Tickets abiertos.



✓ Tickets cerrados.



✓ Tickets abiertos ordenados del más antiguo al más nuevo.



✓ Reabrir tickets.



✓ Cerrar tickets.



✓ Historial de mensajes.



✓ Notificaciones.



✓ Perfil.



✓ Responsive móvil.



✓ Responsive PC.



✓ Diseño neón.



✓ Logo adjunto.



✓ Fondo negro.



✓ ".env.example".



✓ ".gitignore".



✓ README.



✓ Frontend independiente de Lovable.



✓ Backend separado.



✓ Secretos protegidos.



✓ Preparado para GitHub Pages.



✓ Preparado para deployment gratuito.



Finalmente, explícame qué partes requieren que yo cree mis propias aplicaciones OAuth y qué valores debo introducir manualmente. No pongas credenciales falsas ni intentes completar secretos automáticamente.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://moonclub-nexus.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0cc39723-a3fd-41f6-8734-98204e90a6f2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
