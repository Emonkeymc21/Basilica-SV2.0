# Basílica SV 3.0 — Propuesta Premium Web Institucional Católica

## 1) Concepto creativo general

### Nombre del concepto visual
**"Luz del Altar"**

### Idea central
Una experiencia digital que toma el lenguaje simbólico del templo (luz, vitral, piedra, altar, comunidad reunida) y lo traduce a una interfaz moderna: luminosa, sobria, reverente y profundamente usable.

### Diferenciales de diseño
- **Identidad católica sin clichés de plantilla**: símbolos discretos (cruz lineal, arcos, vitrales abstractos) integrados en UI moderna.
- **Jerarquía litúrgica visual**: horarios y sacramentos como acceso prioritario.
- **Arquitectura escalable**: preparada para múltiples sedes, ministerios y calendario vivo.
- **Experiencia comunitaria**: oración, voluntariado, catequesis y noticias como ejes de participación.

### Mensaje emocional
Transmitir **esperanza, acogida y reverencia**: una web donde el visitante sienta que puede rezar, informarse y acercarse a la comunidad con confianza.

---

## 2) Arquitectura del sitio (sitemap)

- **Inicio**
  - Hero / bienvenida
  - Próximas celebraciones y horarios destacados
  - Noticias destacadas
  - CTA de oración / catequesis / contacto
- **Sobre la Iglesia**
  - Nuestra historia
  - Misión y visión pastoral
  - Clero y equipo pastoral
  - Sedes (futuro)
- **Horarios**
  - Misas
  - Confesiones
  - Adoración
  - Secretaría parroquial
- **Sacramentos**
  - Vista general
  - Bautismo
  - Eucaristía (Comunión)
  - Confirmación
  - Matrimonio
  - Reconciliación
  - Unción de los enfermos
- **Noticias / Blog**
  - Listado
  - Detalle
  - Categorías
- **Eventos / Calendario**
  - Agenda mensual
  - Detalle de evento
- **Intenciones de oración**
  - Formulario público
  - Confirmación
- **Catequesis / Formación**
  - Niños
  - Jóvenes
  - Adultos
  - Cursos / inscripción
- **Pastoral / Ministerios / Grupos**
  - Grupos parroquiales
  - Voluntariado
- **Galería**
  - Fotos
  - Videos / transmisiones
- **Donaciones** (opcional)
  - Formas de colaborar
  - Transparencia / destino
- **Contacto**
  - Formulario
  - Mapa
  - Teléfonos / WhatsApp / email
- **FAQ**
- **Legales**
  - Privacidad
  - Términos
  - Cookies
- **Panel administrativo (privado)**
  - Dashboard
  - Contenidos
  - Horarios
  - Eventos
  - Formularios
  - Medios
  - Usuarios/Roles

---

## 3) UX/UI detallada por sección (resumen operativo)

### Home (prioridad máxima)

#### Hero principal
- **Título**: "Una comunidad viva para encontrarnos con Cristo"
- **Subtítulo**: horarios, sacramentos, oración y vida parroquial en un solo lugar.
- **CTA primario**: Ver horarios de misa
- **CTA secundario**: Pedir oración
- **Visual**: imagen del templo con overlay suave y halo luminoso tipo vitral abstracto.

#### Bloques de contenido (orden recomendado)
1. Horarios rápidos (cards: Misa / Confesión / Adoración)
2. Próximos eventos
3. Sacramentos (grid 2x3)
4. Bienvenida del párroco / comunidad
5. Noticias destacadas
6. Intenciones de oración CTA
7. Catequesis / grupos
8. Mapa + contacto

#### Jerarquía visual
- Acciones urgentes (horarios/contacto) arriba.
- Contenido institucional al medio.
- Profundización (noticias, formación, grupos) después.

#### Componentes UI sugeridos
- Cards elevadas con borde sutil dorado
- Tabs accesibles para horarios
- Chips de categorías (eventos/noticias)
- Acordeón FAQ
- Formularios con validación inline y mensajes claros

#### Estados UX
- **Hover**: elevación sutil + borde dorado suave
- **Loading**: skeletons en listas
- **Empty**: mensajes cálidos ("Aún no hay eventos cargados")
- **Error**: tono humano + acción sugerida (reintentar/contactar)

#### Mobile vs desktop
- Mobile-first: CTA y horarios visibles sin scroll largo.
- Desktop: grid 12 columnas, hero dividido 5/7 o 6/6.

#### Accesibilidad WCAG AA
- Contraste mínimo 4.5:1 en texto principal
- Focus visible consistente (outline + ring)
- Labels explícitos en formularios
- Navegación teclado completa
- "Skip to content"

#### Microinteracciones
- Fade/slide muy suaves (<300ms)
- Contadores/fechas sin animación invasiva
- Parallax extremadamente leve (opcional, degradable)

#### Layout / ritmo visual
- Espaciado vertical por secciones 64–96px desktop / 40–56px mobile
- Máximo ancho 1200–1280px
- Grid de 12 columnas + tokens de spacing

---

## 4) Stack tecnológico recomendado (producción)

### Recomendación final (equilibrio ideal)
- **Frontend**: Next.js (App Router) + React + TypeScript
- **UI**: Tailwind CSS + componentes reutilizables + Radix UI (opcional)
- **Animaciones**: Framer Motion (sobrio)
- **Backend**: Route Handlers + Server Actions (según caso)
- **DB**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Auth.js (NextAuth v5) con credenciales/email mágico
- **Panel/CMS**: Panel custom (para horarios y formularios) + editor rich text simple
- **Storage**: Cloudinary o S3-compatible
- **Email**: Resend (fácil y moderno) / SMTP fallback
- **Analítica**: Plausible (privacidad) o GA4
- **SEO técnico**: metadata dinámica, sitemap, robots, schema.org
- **Infra**: Vercel para MVP; VPS si se requiere integración avanzada y costos controlados a escala

### ¿Por qué este stack?
- **Next.js** permite SSR/ISR/SEO excelente y una sola base de código fullstack.
- **Prisma + PostgreSQL** da consistencia, migraciones y relaciones complejas (eventos/sacramentos/roles).
- **Auth.js** acelera seguridad y control de sesiones.
- **Panel custom** evita sobrecargar con un CMS gigante si el equipo parroquial administra contenidos simples.

### CMS headless vs panel custom
- **Panel custom (recomendado inicial)**: mejor UX para tareas reales de parroquia (horarios, intenciones, eventos).
- **Headless CMS (alternativa)**: útil si hay equipo de comunicación más grande y múltiples editores de contenido largo.

---

## 5) Modelo de base de datos (resumen)

Ver `prisma/schema.prisma` y `sql/initial_critical_tables.sql`.
Incluye tablas para:
- users / roles / user_roles
- pages / site_settings
- schedules (mass, confession, adoration)
- sacraments / sacrament_requirements
- posts / post_categories
- events / event_categories
- ministries
- media
- prayer_requests
- contact_messages
- volunteers
- faq
- donations (opcional)
- livestream_links (opcional)
- liturgical_calendar_notes (opcional)
- audit_logs

**Buenas prácticas aplicadas**
- Slugs únicos
- timestamps auditables
- soft delete (`deleted_at`) en tablas de contenido
- índices por fecha/estado/publicación
- enums para estados

---

## 6) Esquema SQL / Prisma

- **Prisma completo**: `prisma/schema.prisma`
- **SQL inicial**: `sql/initial_critical_tables.sql`

---

## 7) Backend / API design (alto nivel)

### Endpoints / acciones clave
- `GET/POST /api/contact`
- `GET/POST /api/prayer-requests`
- `GET/POST/PATCH /api/admin/events`
- `GET/POST/PATCH /api/admin/posts`
- `GET/POST/PATCH /api/admin/schedules`
- `GET/POST/PATCH /api/admin/sacraments`
- `POST /api/admin/media/upload`
- `GET/PATCH /api/admin/site-settings`

### Reglas transversales
- Validación con Zod
- Sanitización de input
- Rate limiting por IP + ruta
- reCAPTCHA/hCaptcha en formularios públicos
- Logging estructurado (pino/console JSON)
- Manejo de errores con códigos consistentes

---

## 8) Panel administrativo (UX + permisos)

### Roles sugeridos
- **Admin**: acceso total, usuarios/roles/configuración
- **Editor**: noticias, eventos, páginas, medios
- **Colaborador**: borradores, respuestas a formularios, sin publicar

### Módulos del panel
- Dashboard (métricas y actividad)
- Horarios litúrgicos
- Eventos
- Noticias/Blog
- Páginas/Sacramentos
- Intenciones de oración (moderación)
- Mensajes de contacto
- Mediateca
- Configuración del sitio
- Usuarios y roles
- Historial de cambios

### UX del panel
- Navegación lateral fija + breadcrumbs
- Tabla + filtros + búsqueda
- Formularios con autoguardado (opcional)
- Estados de publicación: borrador / programado / publicado

---

## 9) Contenido inicial (copywriting) — ejemplos

### Hero principal
**Título:** Una comunidad viva para encontrarnos con Cristo  
**Texto:** Te damos la bienvenida a nuestra parroquia. Aquí encontrarás horarios de misa, sacramentos, actividades y un espacio para acercar tus intenciones de oración.  
**CTA:** Ver horarios de misa

### Bienvenida
"Queremos ser una casa abierta para todos: para quienes llegan cada semana, para las familias, para los jóvenes y también para quienes buscan volver a acercarse a la fe."

### Historia de la parroquia (ejemplo breve)
"Nuestra comunidad nació del deseo de anunciar el Evangelio y acompañar la vida de las familias del barrio. A lo largo de los años, la parroquia se convirtió en lugar de oración, formación y servicio, sosteniendo con esperanza a generaciones enteras."

### Sacramentos (microcopys)
- **Bautismo**: La puerta de la vida cristiana y el inicio del camino de fe.
- **Eucaristía**: Encuentro con Jesús vivo, alimento para la vida diaria.
- **Confirmación**: Fortalecimiento en el Espíritu Santo para dar testimonio.
- **Matrimonio**: Alianza de amor bendecida por Dios para toda la vida.
- **Reconciliación**: Misericordia que restaura y renueva el corazón.
- **Unción de los enfermos**: Consuelo, fortaleza y gracia en la enfermedad.

### Contacto
"Si necesitas orientación, información de sacramentos o ayuda para encontrar un horario, escribinos. Queremos acompañarte."

### Catequesis / comunidad
"Te invitamos a sumarte a nuestros espacios de formación y vida comunitaria: catequesis, grupos juveniles, pastoral y voluntariado."

### CTA oración
**"Dejanos tu intención de oración"**  
"Tu pedido será recibido con respeto y confidencialidad por la comunidad parroquial."

---

## 10) SEO completo (resumen)

### URLs amigables
- `/horarios`
- `/sacramentos/bautismo`
- `/noticias/[slug]`
- `/eventos/[slug]`
- `/catequesis`
- `/contacto`

### Meta ejemplos
- **Inicio**: "Iglesia Católica [Nombre] | Horarios de misa y vida parroquial"
- **Horarios**: "Horarios de misa, confesiones y adoración | [Nombre]"
- **Bautismo**: "Bautismo: requisitos e inscripción | [Nombre]"

### Schema.org
- `Church`
- `Organization`
- `Event`
- `FAQPage`
- `BreadcrumbList`

### Keywords locales (ejemplos)
- iglesia católica en [ciudad]
- horarios de misa [barrio/ciudad]
- confesiones [ciudad]
- catequesis [ciudad]

---

## 11) Seguridad y privacidad

- Validación server-side obligatoria
- Zod + sanitización de strings
- Protección XSS/CSRF según contexto
- ORM (Prisma) para evitar SQL injection
- Hash de contraseñas (bcrypt/argon2)
- Roles y permisos mínimos necesarios
- Rate limiting + captcha en formularios públicos
- Logs y auditoría de acciones de admin
- Backups automáticos de DB
- Política de privacidad y tratamiento de datos para formularios
- Consentimiento de cookies si se usan scripts no esenciales

---

## 12) Rendimiento y calidad

- ISR para noticias/eventos/horarios (cuando aplique)
- `next/image` con tamaños optimizados
- Lazy loading en galería
- Carga diferida de mapas y embeds
- Optimización de bundle (imports parciales)
- Monitoreo de errores (Sentry opcional)
- Tests unitarios + e2e básicos (Playwright recomendado)
- Objetivo Lighthouse: **90+** en Performance/SEO/Best Practices/Accessibility

---

## 13) Plan de implementación paso a paso (checklist)

### Fase 1 — Descubrimiento
- [ ] Relevar objetivos pastorales y públicos
- [ ] Identificar responsables de contenidos
- [ ] Definir alcance MVP vs full
- [ ] Recolectar branding, fotos, textos, horarios

### Fase 2 — Diseño UX/UI
- [ ] Sitemap final
- [ ] Wireframes mobile-first
- [ ] Sistema visual (colores, tipografías, componentes)
- [ ] Mockups alta fidelidad (home + páginas clave + panel)

### Fase 3 — Setup técnico
- [ ] Inicializar Next + TS + Tailwind + Prisma
- [ ] Configurar PostgreSQL y migraciones
- [ ] Configurar auth y roles
- [ ] Variables de entorno y seguridad básica

### Fase 4 — Frontend público
- [ ] Home
- [ ] Horarios
- [ ] Sacramentos
- [ ] Noticias/Eventos
- [ ] Contacto / FAQ / legales

### Fase 5 — Backend + DB
- [ ] Modelado completo
- [ ] CRUDs admin
- [ ] Formularios públicos (contacto/oración/voluntariado)
- [ ] Upload de medios

### Fase 6 — Panel admin
- [ ] Dashboard
- [ ] Gestión de contenidos
- [ ] Moderación de oración/contacto
- [ ] Configuración y usuarios

### Fase 7 — QA
- [ ] Validaciones funcionales
- [ ] Accesibilidad básica
- [ ] SEO técnico
- [ ] Seguridad formularios

### Fase 8 — Deploy
- [ ] Configurar hosting + DB + storage + email
- [ ] Variables de entorno prod
- [ ] Dominio + HTTPS
- [ ] Monitoreo

### Fase 9 — Contenidos y lanzamiento
- [ ] Cargar textos, imágenes, horarios reales
- [ ] Probar flujo de formularios
- [ ] Publicar

### Fase 10 — Mantenimiento
- [ ] Actualización de contenidos
- [ ] Backups y revisiones
- [ ] Mejoras iterativas

---

## 14) Estructura de carpetas (propuesta)

Ver sección `README_PREMIUM_IMPLEMENTACION.md` y estructura de proyecto creada en `src/`.

---

## 15) Código base inicial (starter)

Incluido en este paquete:
- Layout actualizado
- Home con secciones premium (base)
- API pública de contacto y oración (ejemplos)
- Utils de seguridad/validación
- Prisma schema base ampliado
- SQL inicial crítico
- Admin dashboard base (UI skeleton)
- SEO helpers (`sitemap.ts`, `robots.ts`, schema helper)

---

## Paleta visual propuesta y simbolismo (justificada)

### Paleta final (recomendada)
- **Marfil** `#FAF7F0` — pureza, luz, calidez de templo
- **Azul profundo** `#0E2A47` — estabilidad, contemplación, institucionalidad
- **Dorado suave** `#C9A45C` — dignidad litúrgica, solemnidad (uso puntual)
- **Piedra** `#6B7280` — equilibrio y legibilidad
- **Burdeos litúrgico** `#6D1F2B` — acento para tiempos/fiestas/llamados importantes

### Uso recomendado
- 70% fondos claros (marfil/blanco)
- 20% azules institucionales (headers, hero overlays, footer)
- 8% grises/stone (texto secundario)
- 2% dorado/burdeos (acentos, badges, separadores)

---

## Tipografías (combinaciones reales)

### Opción recomendada
- **Títulos**: `Cormorant Garamond` (Google Fonts) — carácter solemne, elegante, excelente para titulares religiosos.
- **Texto/UI**: `Inter` — legibilidad superior en móvil, excelente para panel y cuerpos de texto.

### Alternativa más clásica
- **Títulos**: `Libre Baskerville`
- **Texto/UI**: `Source Sans 3`

**Motivo**: la combinación serif + sans crea contraste litúrgico/institucional y mantiene usabilidad moderna.

---

## EXTRA: identidad visual reinterpretada (luz / vitral / altar / comunidad / esperanza)

### Sistema visual "Vitral de Luz"
- Fondos claros con **degradados suaves radiales** que evocan luz entrando por vitrales.
- Motivos geométricos discretos inspirados en vitrales (rombos/arcos) como patrones de sección.
- Líneas doradas finas como separadores (alusión a marcos/retablos).
- Ilustraciones o overlays abstractos (nunca recargados) para transmitir lo sagrado sin caer en kitsch.
- Fotografía real de comunidad con tratamiento cálido y respetuoso.

