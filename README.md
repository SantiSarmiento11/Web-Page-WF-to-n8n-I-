# Informe Técnico del Proyecto de Automatización de Suscripciones mediante n8n

## 1. Resumen Ejecutivo

El proyecto implementa una plataforma de gestión de suscripciones para un servicio de streaming deportivo, con una arquitectura basada en automatización mediante n8n. Su funcionamiento es similar al de plataformas como Netflix o Spotify, donde un usuario adquiere una suscripción y recibe acceso al servicio de manera automatizada.

La plataforma es accesible a través del sitio web:

https://p-gina-para-flujo.vercel.app/

Desde esta página, los usuarios pueden registrar una nueva suscripción, enviar sus datos al sistema y recibir automáticamente la información necesaria para acceder al servicio.

La solución integra una página web pública, un servidor n8n desplegado en un contenedor Docker, una base de datos PostgreSQL y sistemas de notificación por correo electrónico y Telegram.

La automatización permite:

- Registrar nuevas suscripciones.
- Generar licencias o códigos de acceso.
- Almacenar información de clientes y suscripciones.
- Enviar correos de confirmación.
- Consultar el estado de una suscripción mediante Telegram.

---

# 2. Arquitectura General del Sistema

## Componentes Principales

### Frontend Web

Sitio web:

https://p-gina-para-flujo.vercel.app/

Responsabilidades:

- Capturar información del usuario.
- Solicitar nuevas suscripciones.
- Validar información básica.
- Enviar solicitudes HTTP al Webhook de n8n.
- Mostrar respuestas del sistema al usuario.

Tecnologías observadas:

- HTML
- CSS
- JavaScript
- Hosting mediante Vercel

### Servidor n8n

El núcleo del sistema es n8n, ejecutándose dentro de un contenedor Docker alojado localmente en el equipo de uno de los desarrolladores.

Funciones:

- Recibir solicitudes desde la web.
- Ejecutar lógica de negocio.
- Generar licencias.
- Consultar y actualizar la base de datos.
- Enviar correos electrónicos.
- Gestionar interacciones con Telegram.

### Base de Datos

La base de datos también se encuentra alojada en el mismo servidor local que ejecuta n8n.

La solución utiliza una base de datos relacional implementada en PostgreSQL, compuesta actualmente por la tabla principal `subscriptions`.

Información almacenada:

- Identificador único de la suscripción (id)
- Correo electrónico del cliente (email)
- Nombre del cliente (nombre)
- Plan contratado (plan)
- Clave o licencia de acceso (license_key)
- Estado de la suscripción (status)
- Fecha de próxima renovación (next_renewal)
- Fecha de creación del registro (created_at)

### Servicio de Correo Electrónico

Permite enviar automáticamente:

- Confirmación de compra.
- Información de acceso.
- Licencia generada.
- Datos de soporte.

### Bot de Telegram

Proporciona un canal alternativo de consulta para el cliente.

Funciones:

- Consultar estado de suscripción.
- Verificar vigencia.
- Recibir confirmaciones.

---

# 3. Flujo Principal de Suscripciones

1. Webhook
2. Respond to Webhook
3. Generar Licencia
4. Insertar Registro en PostgreSQL (`subscriptions`)
5. Correo de Confirmación

Ejemplo de inserción:

```sql
INSERT INTO subscriptions (
    email,
    nombre,
    plan,
    license_key,
    next_renewal
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
);
```

---

# 4. Flujo de Telegram

1. Telegram Trigger
2. Pedir Correo
3. Buscar Suscripción

```sql
SELECT
    nombre,
    email,
    plan,
    license_key,
    status,
    next_renewal,
    created_at
FROM subscriptions
WHERE email = $1;
```

4. Validar existencia
5. Formatear estado
6. Confirmar o finalizar

---

# 5. Análisis de Infraestructura

```text
Internet
    │
    ▼
Página Web
(p-gina-para-flujo.vercel.app)
    │
    ▼
Webhook n8n
(Docker Local)
    │
 ┌──┴─────────┐
 ▼            ▼
PostgreSQL   Correo
 Local       SMTP
```

Paralelamente:

```text
Telegram
    │
    ▼
Bot Telegram
    │
    ▼
n8n
    │
    ▼
PostgreSQL
```

---

# 6. Fortalezas del Proyecto

- Automatización completa.
- Arquitectura modular.
- Bajo costo operativo.
- Canal adicional de atención mediante Telegram.
- Escalabilidad inicial adecuada.

---

# 7. Riesgos y Debilidades

- Punto único de falla.
- Dependencia de infraestructura local.
- Disponibilidad limitada.
- Necesidad de asegurar Webhooks.
- Protección adicional para la base de datos.

---

# 8. Recomendaciones de Mejora

## Corto Plazo

- Implementar HTTPS.
- Añadir validación de entradas.
- Registrar logs de auditoría.
- Crear respaldos automáticos.

## Mediano Plazo

Migrar a un VPS.

## Largo Plazo

- Balanceo de carga.
- Base de datos separada.
- Monitoreo.
- Sistema de pagos integrado.
- Renovaciones automáticas.

---

# 9. Conclusión

El proyecto presenta una arquitectura bien estructurada para una plataforma de suscripciones digitales orientada al streaming deportivo. La utilización de n8n permite automatizar eficazmente los procesos de creación de licencias, registro de clientes, almacenamiento de información y comunicación con los usuarios.

La base de datos almacena la información principal de las suscripciones, incluyendo correo electrónico del cliente, nombre, plan contratado, licencia generada, estado de la suscripción, fecha de próxima renovación y fecha de creación del registro.

La principal limitación identificada es la dependencia de infraestructura local, que constituye un punto único de falla. No obstante, la arquitectura actual proporciona una base sólida para evolucionar hacia una solución empresarial más robusta mediante la migración a infraestructura en la nube y la incorporación de mecanismos avanzados de seguridad, monitoreo y alta disponibilidad.
