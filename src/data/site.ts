// Todo el contenido en un solo archivo. Fuente: el CV de Josué. Solo hechos y cifras que aparecen en él.
// `placeholder: true` marca lo que el dueño debe confirmar (nombre, dominio, correo público).
export const site = {
  name: 'Josué Batista', // placeholder: el CV no trae nombre; deducido del correo de la cuenta
  role: 'Desarrollador full-stack, automatización de procesos e IA',
  tagline: 'Desarrollador full-stack',
  url: 'https://depo01.github.io',
  phone: '+1 829 815 3395',
  whatsapp: '18298153395', // formato wa.me: solo dígitos con código de país
  email: 'josuebatista01p@gmail.com', // placeholder: confirmar que este es el correo público
  cv: '/cv-josue-batista.pdf', // PDF en public/ (CV_Malber_Batista_v2)
  github: 'https://github.com/depo01',
  linkedin: 'https://www.linkedin.com/in/malber-batista', // sin parámetros de seguimiento (utm)
  description:
    'Josué Batista, desarrollador full-stack especializado en automatización de procesos e IA. Python, APIs REST y modelos de lenguaje para devolverle horas al equipo.',
  placeholder: true,
};

export type Project = {
  slug: string;
  title: string;
  kind: string;
  category: string; // para el filtro del índice
  image: string; // IMAGEN DE PRUEBA en public/work/: reemplazar por capturas reales
  org: string;
  label: string; // etiqueta corta de la fila del índice
  period: string;
  metric?: { n: string; u: string }; // cifra del CV, si existe
  flow?: [string, string, string]; // antes, puente, después (solo con hechos del CV)
  summary: string;
  role: string;
  stack: string;
  sections: { h: string; p: string }[];
  bg: string;
  fg: string;
};

// Cinco casos tomados del CV: tres con impacto medido (experiencia) y los proyectos destacados.
export const projects: Project[] = [
  {
    slug: 'del-excel-al-sistema',
    category: 'Automatización',
    image: '/work/prueba-real.jpg',
    title: 'Del Excel al sistema',
    kind: 'Automatización de procesos',
    org: 'Atlas TecnoGroup',
    label: 'Atlas TecnoGroup, actual',
    period: 'Actual',
    metric: { n: '10+', u: 'horas por semana' },
    flow: ['Excel manual', 'APIs REST y Python', 'Sistema en React con API'],
    summary: 'Un flujo que vivía en Excel, convertido en sistema. Más de 10 horas semanales devueltas.',
    role: 'Desarrollador, analista y administrador de base de datos',
    stack: 'Python, APIs REST, React, OpenAI API',
    sections: [
      { h: 'El problema', p: 'Un flujo de trabajo vivía en una hoja de Excel y se repetía a mano. El reporting manual se llevaba horas cada semana.' },
      { h: 'La idea', p: 'Rediseñé el flujo como un sistema con React y una API, y automaticé los procesos internos con APIs REST y Python. La lógica quedó pensada para replicarse en Make, n8n o Zapier.' },
      { h: 'El resultado', p: 'Más de 10 horas semanales ahorradas en reporting manual. Además, prototipos con modelos de lenguaje (OpenAI API) que clasifican y resumen datos operativos de forma automática.' },
    ],
    bg: '#2433ff',
    fg: '#f6f4ee',
  },
  {
    slug: 'dos-horas-menos',
    category: 'Datos y BI',
    image: '/work/prueba-real.jpg',
    title: 'Dos horas menos al día',
    kind: 'Monitoreo y reportes',
    org: 'Dominican Watchman',
    label: 'Dominican Watchman',
    period: 'Analista de base de datos Jr.',
    metric: { n: '2', u: 'horas menos cada día' },
    flow: ['Monitoreo y reporte a mano', 'Python y Power BI', 'Proceso automático'],
    summary: 'Monitoreo y reportes automáticos que eliminaron un proceso manual diario de 2 horas.',
    role: 'Analista de base de datos Jr.',
    stack: 'Python, SQL Server, Power BI, APIs',
    sections: [
      { h: 'El problema', p: 'Monitorear el rendimiento de las bases de datos y armar los reportes era un proceso manual que ocupaba 2 horas cada día.' },
      { h: 'La idea', p: 'Automaticé el monitoreo y los reportes con Python y Power BI, con flujos al estilo Zapier o Make sobre SQL Server y APIs.' },
      { h: 'El resultado', p: 'Se eliminó un proceso manual diario de 2 horas.' },
    ],
    bg: '#ffd21f',
    fg: '#0a0d24',
  },
  {
    slug: 'crm-medico',
    category: 'Aplicaciones web',
    image: '/work/prueba-real.jpg',
    title: 'CRM médico',
    kind: 'Aplicación web',
    org: 'Proyecto destacado',
    label: 'Pacientes, citas y facturación',
    period: 'Proyecto destacado',
    summary: 'Pacientes, citas y facturación en una sola aplicación, con dashboards de Power BI.',
    role: 'Diseño y desarrollo full-stack',
    stack: 'React, FastAPI, PostgreSQL, Power BI',
    sections: [
      { h: 'Qué resuelve', p: 'Una aplicación de gestión para consultorios: pacientes, citas y facturación en el mismo lugar.' },
      { h: 'Cómo está hecho', p: 'Interfaz en React, API en FastAPI y datos en PostgreSQL. Los dashboards analíticos de Power BI se integran dentro de la aplicación.' },
    ],
    bg: '#ff4a2a',
    fg: '#0a0d24',
  },
  {
    slug: 'sistema-de-gestion-interna',
    category: 'Aplicaciones web',
    image: '/work/prueba-real.jpg',
    title: 'Sistema de gestión interna',
    kind: 'Sistema administrativo',
    org: 'Proyecto destacado',
    label: 'Inventario, usuarios y reportes',
    period: 'Proyecto destacado',
    summary: 'Un sistema administrativo con módulos de inventario, usuarios y reportes.',
    role: 'Diseño y desarrollo full-stack',
    stack: 'Python, SQL Server, React',
    sections: [
      { h: 'Qué resuelve', p: 'Un sistema administrativo para llevar el inventario, los usuarios y los reportes de una organización sin hojas sueltas.' },
      { h: 'Cómo está hecho', p: 'Backend en Python, datos en SQL Server e interfaz en React, organizado en módulos independientes: inventario, usuarios y reportes.' },
    ],
    bg: '#0a0d24',
    fg: '#f6f4ee',
  },
  {
    slug: 'dashboard-analitico',
    category: 'Datos y BI',
    image: '/work/prueba-real.jpg',
    title: 'Dashboard analítico empresarial',
    kind: 'Inteligencia de negocio',
    org: 'Proyecto destacado',
    label: 'Power BI y varias fuentes',
    period: 'Proyecto destacado',
    summary: 'Paneles interactivos con datos de varias fuentes SQL y APIs externas.',
    role: 'Modelado de datos y visualización',
    stack: 'Power BI, SQL, APIs externas',
    sections: [
      { h: 'Qué resuelve', p: 'Paneles visuales e interactivos para ver el estado de una empresa en un solo lugar, sin armar el reporte a mano.' },
      { h: 'Cómo está hecho', p: 'Power BI conectado a múltiples fuentes de datos SQL y a APIs externas.' },
    ],
    bg: '#bcd4ff',
    fg: '#0a0d24',
  },
];

// Categorías del filtro, en el orden en que aparecen por primera vez.
export const categories = ['Todos', ...new Set(projects.map((p) => p.category))];

export const method = [
  { n: '1', t: 'Mirar', d: 'Primero observo la tarea tal como se hace hoy: quién la repite, cuándo y con qué herramientas.' },
  { n: '2', t: 'Medir', d: 'Anoto cuántas horas cuesta. Sin ese número no hay forma de saber si ayudó.' },
  { n: '3', t: 'Automatizar', d: 'Python, APIs REST y, si conviene, un modelo de lenguaje. La lógica queda lista para llevarse a Make, n8n o Zapier.' },
  { n: '4', t: 'Contar horas', d: 'Al final se mide lo mismo que al principio: las horas que le devolví al equipo.' },
];

// Servicios: solo lo que respalda el CV (Python, APIs REST, React, Power BI, OpenAI API).
export const services = [
  { n: '1', t: 'De Excel a sistema', d: 'Convierto un flujo que vive en hojas de cálculo en una aplicación con React y una API.' },
  { n: '2', t: 'Reportes automáticos', d: 'Monitoreo y reportes con Python, SQL y Power BI, sin armarlos a mano cada semana.' },
  { n: '3', t: 'Integraciones y APIs', d: 'Conecto sistemas con APIs REST y webhooks; la lógica es replicable en Make, n8n o Zapier.' },
  { n: '4', t: 'IA aplicada', d: 'Prototipos con modelos de lenguaje (OpenAI API) que clasifican y resumen datos operativos.' },
];

// ───────── DATOS DE EJEMPLO ─────────
// Todo lo que sigue es relleno para ver el diseño. Reemplazar por datos reales antes de publicar.

// Contacto: sin `formEndpoint` el formulario abre el correo del visitante (mailto).
// Para recibir mensajes directo, poner aquí la URL de un servicio como Formspree o Web3Forms.
export const contact = {
  formEndpoint: '', // ejemplo: 'https://formspree.io/f/xxxxxxx'
  responseTime: 'Respondo en menos de 24 horas', // EJEMPLO
  location: 'República Dominicana, GMT-4', // EJEMPLO
};

export const about = {
  photo: '/foto-placeholder.svg', // EJEMPLO: reemplazar por tu foto (public/)
  photoAlt: 'Retrato de Josué Batista (foto de ejemplo)',
  now: 'Hoy busco proyectos de automatización y desarrollo full-stack, en remoto o freelance.', // EJEMPLO
};

// BORRADORES: redactados a partir del CV, no son citas textuales. Antes de publicar en GitHub Pages,
// cada persona debe revisarlos y aprobarlos (o darte su propio texto). Ajusta nombre/cargo si hace falta.
export const testimonials = [
  {
    q: 'Cuando Josué agarra una tarea repetitiva, la convierte en un proceso que corre solo. Lo que antes nos llevaba horas cada semana hoy sale sin que nadie lo toque.',
    who: 'Ing. Gerson Cabreja',
    role: 'Jefe directo, Dominican Watchman National',
  },
  {
    q: 'Es de los que no esperan a que se lo pidan dos veces: entiende el problema, propone una solución y la deja funcionando. Da gusto tenerlo en el equipo.',
    who: 'Ing. Gerson Cabreja',
    role: 'Jefe directo, Dominican Watchman National',
  },
  {
    q: 'Trabajar con Josué es fácil. Hace buenas preguntas, aprende rápido y cuida los detalles, justo lo que se necesita cuando los datos y los procesos son críticos.',
    who: 'Jeso Heredia',
    role: 'Experto en SAP',
  },
];

export const languages = [
  { l: 'Español', v: 'Nativo' },
  { l: 'Inglés', v: 'Intermedio (ejemplo)' }, // EJEMPLO
];

export const stack = [
  { g: 'Frontend', v: 'React, TypeScript, JavaScript, HTML y CSS' },
  { g: 'Backend', v: 'Python, C#, Node.js (básico)' },
  { g: 'Datos', v: 'SQL Server, MySQL, Oracle PL/SQL, MongoDB' },
  { g: 'Automatización e IA', v: 'Make, Zapier, n8n, APIs REST, Webhooks, OpenAI API, LangChain (básico)' },
  { g: 'Entorno', v: 'Docker, Azure DevOps, Git, Power BI, Windows y Linux' },
];

export const path = [
  {
    when: 'Actual',
    who: 'Atlas TecnoGroup',
    what: 'Desarrollador, analista y administrador de base de datos',
    d: 'Automatización de procesos internos con APIs REST y Python, y prototipos con modelos de lenguaje.',
  },
  {
    when: 'Antes',
    who: 'Dominican Watchman',
    what: 'Analista de base de datos Jr.',
    d: 'Administración de SQL Server, monitoreo de rendimiento y reportes con Power BI.',
  },
  {
    when: '2016 a 2019',
    who: 'COPI-NET',
    what: 'Encargado de ventas, digitación y desarrollo',
    d: 'Sistemas de facturación interna y digitalización de datos. La eficiencia operativa subió un 20 %.',
  },
];

export const study = [
  { what: 'Licenciatura en Informática', where: 'UCATEBA, Universidad Católica Tecnológica de Barahona' },
  { what: 'Bachiller', where: 'Liceo Politécnico Cruce de Palo Alto' },
];

export const certs = [
  { what: 'Desarrollo de aplicaciones web con ASP.NET MVC', by: 'Mescyt' },
  { what: 'Programación de bases de datos Oracle', by: 'Mescyt' },
  { what: 'Desarrollo de aplicaciones móviles con Android', by: 'INFOTEP, Mescyt' },
  { what: 'Excel avanzado', by: 'INFOTEP' },
  { what: 'Manejador de paquete de oficina e internet', by: 'INFOTEP' },
];
