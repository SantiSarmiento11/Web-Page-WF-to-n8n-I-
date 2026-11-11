# MundoFutbol - Portal de Suscripcion y Contratacion de Streaming Deportivo Integrado con n8n

Plataforma web de captacion de clientes y pasarela de suscripciones para transmisiones deportivas, integrada de forma asincrona con flujos automatizados de n8n.

[![Dominio](https://img.shields.io/badge/Dominio-Streaming%20Deportivo%20%26%20Conversion-0052CC.svg)]()
[![n8n](https://img.shields.io/badge/Orquestacion-n8n%20Automation-EA4B71.svg)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg)]()
[![HTML5](https://img.shields.io/badge/HTML5-Semantico-E34F26.svg)]()
[![CSS3](https://img.shields.io/badge/CSS3-Modern%20UI-1572B6.svg)]()

## Resumen Ejecutivo

En las plataformas de streaming de contenidos digitales y transmisiones deportivas en vivo, la conversion de prospectos depende criticamente de una experiencia de contratacion sin fricciones y una activacion instantanea del servicio. MundoFutbol resuelve esta necesidad mediante una arquitectura desacoplada que enlaza un portal publico de alta tasa de conversion con un motor de orquestacion en n8n, permitiendo procesar altas de clientes, validar planes seleccionados y disparar notificaciones de bienvenida sin intermediacion humana.

## Alcance y Objetivos de Negocio

- Exposicion visual clara de los planes de streaming disponibles (Plan Basico, Plan Premium, Plan Temporada Completa).
- Formulario reactivo de contratacion con validacion dinamica del lado del cliente (`contratar.html`).
- Integracion webhook en tiempo real con el motor de automatizacion n8n (`Workflow.json`).
- Registro automatizado de nuevos suscriptores en base de datos o sistema CRM.
- Despacho automatico de correos transaccionales con credenciales de acceso a las transmisiones.

## Arquitectura del Sistema

El proyecto implementa una arquitectura orientada a eventos (Event-Driven Architecture):
1. Capa de Presentacion Web (`index.html`, `contratar.html`, `style.css`):
   Landing page y embudo de contratacion responsivo optimizado para conversion.
2. Capa de Logica de Cliente (`main.js`, `contratar.js`):
   Captura de eventos, validacion de inputs, preparacion de cargas utiles JSON y envio asincrono via Fetch API.
3. Capa de Orquestacion y Automatizacion (`Workflow.json` en n8n):
   Receptor Webhook HTTP, normalizador de datos, persistencia de prospectos y emisor de notificaciones transaccionales.
