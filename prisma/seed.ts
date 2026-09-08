import { PrismaClient, ResourceType } from "@prisma/client";

const prisma = new PrismaClient();

const EDITION_NAME = "Intensivo Septiembre 2026";
const START_DATE = new Date("2026-09-14T00:00:00.000Z");
const END_DATE = new Date("2026-10-13T00:00:00.000Z");

function dateForDay(dayNumber: number): Date {
  const d = new Date(START_DATE);
  d.setUTCDate(d.getUTCDate() + (dayNumber - 1));
  return d;
}

type SeedDay = {
  day_number: number;
  title: string;
  time_estimate_minutes: number | null;
  is_live_session: boolean;
  live_session_label: string | null;
  is_unlocked: boolean;
  why_today: string | null;
  action_html: string | null;
  proof_required: string | null;
  note_html: string | null;
};

const days: SeedDay[] = [
  {
    day_number: 1,
    title: "Nicho, servicio y precio",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: true,
    why_today:
      "Todo lo de los próximos 29 días sale de esta decisión. Si el miércoles sigue abierta, la semana se va en decidir y no en vender. Mañana la validamos en directo, así que hoy tiene que salir escrita, aunque no estés seguro.",
    action_html: `<p><strong>Bloque 1 · Tu nicho (30 min)</strong></p>
<p>Abre la agenda del móvil y haz un barrido rápido apuntando sectores, no nombres. Cuántos negocios hay ahí y de qué tipo. Con eso delante, eliges por una de las dos vías.</p>
<p><strong>Vía A · Ya tienes un sector pensado.</strong> Defínelo y ciérralo hoy. Concreto: no "hostelería", sino "bares de menú de barrio". Antes de cerrarlo, comprueba que en tu agenda o en tu zona hay al menos cinco. Si no los hay, vía B.</p>
<p><strong>Vía B · No tienes sector.</strong> El nicho lo define un problema. Eliges uno concreto y trabajas con todos los negocios que lo tengan, del sector que sean.</p>
<p>Dos condiciones. <strong>Que se vea desde fuera</strong>: entrando en su web, llamando o mirando sus reseñas, sin hablar con ellos. Si no se puede ver, no tienes lista, tienes intuición. Y <strong>que le cueste dinero, no tiempo</strong>: "tardan en contestar" es flojo, "pierden citas porque nadie coge el teléfono" tiene un número detrás.</p>
<p><strong>Si tienes GPTs de nicho, avatar, problema y oferta, úsalos aquí</strong>, pero después del barrido de agenda, no antes. Un GPT da una respuesta razonable en abstracto; no sabe a quién conoces tú ni qué tienes a diez minutos de casa, y el acceso es lo que manda en 30 días. Le cuentas lo que has visto y lo usas para afinar. Lo que sale del bloque lo escribes tú.</p>
<p><strong>Bloque 2 · Tu servicio (30 min)</strong></p>
<p>Uno solo, y no se cambia en 30 días.</p>
<p><strong>Si ya tienes algo montado que quieres vender</strong>, ese es tu servicio. No montes nada nuevo. Solo déjalo dicho en una frase que se entienda sin explicarla.</p>
<p><strong>Si vendes consultoría o implantación a medida</strong>, vale, pero hoy se concreta en un entregable con nombre. "Auditoría de procesos con informe y plan", no "les ayudo con la IA". Algo que se pueda enseñar y poner en una factura.</p>
<p><strong>Si no tienes nada, o no quieres vender lo que tienes</strong>, eliges del catálogo de cinco (ver sección de Catálogo).</p>
<p>Sea cual sea la vía, el servicio tiene que atacar el problema del bloque 1. Si tu nicho pierde llamadas, no le vendas una web.</p>
<p><strong>Bloque 3 · Tu precio (30 min)</strong></p>
<p>Un número. Del rango si es del catálogo, el que decidas si es tuyo. Lo podrás cambiar, pero hoy sale con número. Un precio puesto vence a un precio "ya lo veré".</p>`,
    proof_required:
      "Tu frase en el grupo, con esta forma: \"Trabajo con [negocios que (problema) / sector concreto]. Pierden [qué] por eso. Les vendo [servicio] por [X]€.\"",
    note_html: `<p><strong>Aviso.</strong> Publícala aunque no te convenza. Mañana la corregimos entre todos. Lo que no se puede es llegar mañana sin nada escrito.</p>`,
  },
  {
    day_number: 2,
    title: "Los 20 de tu agenda",
    time_estimate_minutes: 90,
    is_live_session: true,
    live_session_label: "Directo de apertura",
    is_unlocked: false,
    why_today:
      "Los primeros mensajes no van a desconocidos. Van a gente que ya sabe quién eres, porque esta semana el objetivo es que envíes, no que aciertes.",
    action_html: `<p><strong>La sesión.</strong> Se valida el día 1: nicho, servicio y precio de cada uno, corregidos en directo. La sesión no sustituye la tarea de hoy, la complementa. Sales de ella con tu frase cerrada y después haces la lista.</p>
<p><strong>La acción</strong></p>
<ol>
<li>Abre la agenda del móvil, la de verdad. Baja de la A a la Z sin filtrar mentalmente. Apunta a todo el que tenga negocio o trabaje en uno.</li>
<li>Añade a quien conozca gente con negocio: tu cuñado, la vecina, el del gimnasio. Valen igual.</li>
<li>Cinco columnas: <strong>nombre · negocio · teléfono · cómo le conoces · qué sé de su negocio</strong>.</li>
<li>La última columna, de memoria y en una línea. "Trabaja solo y siempre está liado", "creo que no tiene web", "los pedidos se los apuntan en una libreta". Si de alguien no sabes nada, en blanco. Hoy no se investiga, eso es mañana.</li>
<li>Objetivo: 20 nombres. Si te quedas corto, sigue por WhatsApp y por los grupos donde estés.</li>
</ol>
<p>No hace falta que los 20 encajen con tu nicho.</p>`,
    proof_required: "Captura de la lista con los 20, y tu frase final después de la sesión.",
    note_html: `<p><strong>Audio del día · 60 segundos.</strong> Hoy vas a hacer una lista y te va a pasar una cosa: vas a ir tachando gente por adelantado. Este no, que hace años que no hablamos. Este tampoco, que qué va a pensar. Y vas a acabar con seis nombres en vez de veinte. No filtres. Filtrar hoy es decidir por otro lo que otro va a contestar, y tú no tienes ni idea de lo que va a contestar. Nadie la tiene. Escríbelos todos. Ya decidiremos luego a quién le escribes primero. Hoy la tarea es que la lista exista, no que sea buena.</p>`,
  },
  {
    day_number: 3,
    title: "La demo, sobre un negocio real",
    time_estimate_minutes: 120,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Mañana envías. Y no vas a enviar un pitch, vas a enviar algo hecho. Es la diferencia entre pedir un favor y enseñar tu trabajo.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>De tu lista de ayer, coge los tres que mejor encajen con tu nicho. Si ninguno encaja, los tres negocios reales que mejor conozcas.</li>
<li>Investígalos con la skill de investigación de prospecto: qué ofrecen, horarios, cómo cogen citas o pedidos, qué dicen sus reseñas, qué se les está escapando.</li>
<li>Elige uno. El que tenga el problema más claro, no el que mejor te caiga.</li>
<li>Monta la demo de tu servicio sobre ese negocio. Su nombre dentro, sus servicios, sus horarios, sus precios si son públicos. Nada de "Negocio Ejemplo S.L.".</li>
<li>Graba 30 segundos de la demo funcionando. Eso es lo que envías mañana.</li>
</ol>
<p><strong>Cómo tiene que ser la demo.</strong> No perfecta. Funcional. Que haga una cosa y la haga entera delante de quien la mire. Si puede tener efecto wow, mejor, y ese efecto no está en la cantidad de funciones: está en que el negocio se vea a sí mismo dentro. Eso es lo que hace que alguien pare y mire.</p>
<p>Lo que sobra hoy: pantallas de configuración, casos raros, flujos alternativos, ponerlo bonito. Un flujo, de principio a fin, con sus datos.</p>
<p><strong>Si tu servicio es el agente de voz:</strong> la demo es el número. Que se pueda llamar y que conteste con el nombre del negocio. No hace falta que haga todo. Es la demo con más efecto de las cinco: no hay que explicarla, se marca y se oye.</p>`,
    proof_required:
      "El vídeo de 30 segundos, o el número al que llamar, con el nombre del negocio visible o dicho.",
    note_html: `<p><strong>Material que hay que tener listo.</strong> La skill de investigación de prospecto, empaquetada y descargable (ver sección de Recursos), con instrucciones de instalación en una página. Más el vídeo de apoyo con el proceso completo en pantalla sobre un negocio real: cómo se lanza, qué devuelve, qué se usa y qué se descarta, y cómo pasa a la demo. Sin cortes, incluida la parte que sale regular.</p>`,
  },
  {
    day_number: 4,
    title: "Envío en directo",
    time_estimate_minutes: 90,
    is_live_session: true,
    live_session_label: "Directo",
    is_unlocked: false,
    why_today:
      "Este es el día que decide el reto. Nadie envía solo en su casa a las ocho de la tarde: se envía aquí, todos a la vez, con la sesión abierta.",
    action_html: `<p><strong>La sesión.</strong> Se envía dentro de ella. La tarea de hoy y el directo son la misma cosa.</p>
<p><strong>La acción</strong></p>
<ol>
<li>Llegas con tu demo y tu lista abiertas.</li>
<li>Coges la plantilla que corresponda. <strong>WhatsApp</strong> para todo el que tengas en la agenda. <strong>Email</strong> solo si no tienes su móvil personal. Tres huecos: nombre, negocio, detalle concreto. No la reescribas.</li>
<li>Eliges tres personas. Las tres primeras, no las tres mejores. Elegir a las mejores es una forma de tardar cuarenta minutos en elegir.</li>
<li>Envías los tres durante la sesión, con la demo.</li>
<li>Pegas la captura en el grupo antes de salir.</li>
</ol>
<p><strong>Qué NO se hace hoy.</strong> No se explica el precio, no se manda propuesta, no se pide reunión. Se enseña algo hecho y se hace una pregunta.</p>
<p><strong>Si alguien contesta durante la sesión</strong>, no improvises. Lo pegas en el grupo y lo trabajamos en directo. Contestar rápido y mal a la primera respuesta del reto es la forma más cara de aprender.</p>`,
    proof_required: "Captura de los tres mensajes enviados, con la hora visible.",
    note_html: `<p><strong>Al que llegue sin demo:</strong> envías igual, con lo que tengas. Hoy nadie se queda sin enviar. La demo se recupera mañana; el día de enviar acompañado no vuelve.</p>
<p><strong>Material que hay que tener listo.</strong> Las tres plantillas (ver sección de Recursos) publicadas antes de la sesión, en texto copiable, no en imagen.</p>`,
  },
  {
    day_number: 5,
    title: "Siete más y el primer seguimiento",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Ayer enviaste acompañado. Hoy compruebas que también sabes hacerlo solo, que es lo que vas a necesitar las próximas cuatro semanas.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li><strong>Primero los seguimientos.</strong> A los tres de ayer que no hayan contestado: "Hola [nombre], ¿llegaste a verlo? Sin prisa." Corto, sin disculpas y sin explicar por qué vuelves a escribir.</li>
<li><strong>Después, siete mensajes nuevos.</strong> Misma plantilla. Puedes reutilizar la demo si el negocio se parece, o cambiarle el nombre y los datos si es de otro tipo. Diez minutos, no dos horas.</li>
<li><strong>Si alguno ha contestado</strong>, pega su respuesta en el grupo antes de contestar tú.</li>
</ol>
<p>El orden importa: si lo haces al revés, los seguimientos no se hacen. Siempre se queda para luego lo que da más pereza.</p>
<p><strong>Si no tienes siete a quien escribir</strong>, en este orden:</p>
<ol>
<li>Lo que quede de tu lista.</li>
<li>Segunda vuelta a la agenda. El lunes tachaste gente mentalmente: el que hace años que no ves, el que crees que no le interesa. Ahí hay cinco o seis más.</li>
<li>Referidos, sin pedir favor. A tres personas sin negocio: "¿conoces a alguien que tenga un [tipo de negocio]? Estoy montando algo para ellos."</li>
<li>Los negocios de tu calle. No hace falta tener su teléfono: entras, preguntas por el dueño, le enseñas la demo en el móvil. Cuenta como envío.</li>
<li>Frío del nicho, con la skill. Último recurso.</li>
</ol>
<p><strong>El número es siete y da igual de dónde salgan.</strong> Nadie termina el viernes por debajo de siete porque no tenía a quién escribir.</p>`,
    proof_required: "Captura de los siete enviados y de los seguimientos.",
    note_html: `<p><strong>Audio del día · 75 segundos.</strong> A estas alturas ya te habrán dejado en visto. Y hay una interpretación automática que te va a venir sola: no le ha interesado. Piensa en lo que pasó de verdad. Le llegó tu mensaje un jueves por la tarde, con el negocio abierto, un proveedor al teléfono y alguien esperando en el mostrador. Lo abrió, lo dejó para luego y luego no llegó. Eso es todo. El segundo toque de hoy no es insistir. Es volver a aparecer cuando la otra persona tiene las manos libres. Ahí es donde aparece la mitad de las respuestas. Corto, sin disculpas y sin explicar por qué vuelves a escribir. Cuanto más justificas el segundo mensaje, más parece que estás pidiendo perdón por existir.</p>`,
  },
  {
    day_number: 6,
    title: "Perfil de LinkedIn y primer post",
    time_estimate_minutes: 120,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "El martes empiezas a escribir a gente que no te conoce. Lo primero que harán es buscarte. Hoy dejas el escaparate presentable y publicas una cosa, para que cuando lleguen no encuentren un perfil vacío.",
    action_html: `<p><strong>Parte 1 · El perfil (60 min)</strong></p>
<ol>
<li><strong>Foto.</strong> Tu cara, fondo limpio, expresión normal. Sin logos, sin fotos de grupo.</li>
<li><strong>Titular.</strong> Lo que haces y para quién, no tu cargo. Sale del día 1: "Ayudo a [nicho] a [resultado]". Si pone "Entusiasta de la IA", bórralo.</li>
<li><strong>Banner.</strong> Una frase con lo mismo. Canva, diez minutos.</li>
<li><strong>Extracto.</strong> Cuatro líneas: a quién ayudas, qué problema resuelves, cómo lo haces, cómo contactarte.</li>
<li><strong>Experiencia.</strong> Que no despiste. No hace falta inventar nada.</li>
</ol>
<p><strong>Parte 2 · El primer post (60 min)</strong></p>
<p>Un post sobre el problema que resuelve tu servicio. No sobre tu servicio: sobre el problema. Cuatro bloques cortos:</p>
<ol>
<li><strong>El problema, visto desde el negocio.</strong> Lo que le pasa un martes cualquiera. "Estás con un cliente delante y suena el teléfono. No lo coges. Esa persona llama al siguiente de la lista."</li>
<li><strong>Lo que cuesta.</strong> El número. Cuatro llamadas a la semana, ochenta euros cada cliente, mil doscientos ochenta al mes. Tu número, del ejercicio del viernes pasado.</li>
<li><strong>Por qué nadie lo arregla.</strong> Porque no se ve. Nadie lleva la cuenta de lo que pierde, la gente lleva la cuenta de lo que gasta.</li>
<li><strong>Qué se puede hacer.</strong> En dos líneas, sin vender. Que exista una solución, no que la tuya sea la mejor.</li>
</ol>
<p>600-900 caracteres. Sin emojis de alarma y sin pedir que comenten nada.</p>
<p><strong>Lo que no se hace:</strong> hablar de la herramienta, decir cuánto cobras, contar que estás en un reto, ni escribir un post motivacional sobre tu proceso. El post habla del negocio del cliente, no de ti.</p>
<p><strong>Si tu nicho no está en LinkedIn</strong> (bares, peluquerías, talleres), lo haces igual. No es para conseguirlos ahí: es para que quien busque tu nombre encuentre a alguien que se dedica a esto.</p>`,
    proof_required: "Captura del perfil, enlace al perfil y enlace al post, en el grupo.",
    note_html: `<p><strong>Material de apoyo.</strong> Vídeo de 6 minutos: tres titulares reales del grupo corregidos en pantalla, del genérico al concreto, y un post de ejemplo montado desde cero con la estructura de cuatro bloques.</p>`,
  },
  {
    day_number: 7,
    title: "Recuento honesto",
    time_estimate_minutes: 60,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Una semana de datos reales tuyos vale más que cualquier teoría de ventas. Pero solo si los miras de frente.",
    action_html: `<p>Cuatro números, sin adornar:</p>
<ol>
<li>Mensajes enviados.</li>
<li>Respuestas recibidas.</li>
<li>Silencios.</li>
<li>Negativas claras.</li>
</ol>
<p>Y tres líneas más:</p>
<ul>
<li>Qué frase de tu mensaje crees que está fallando.</li>
<li>Cuál de tus contactos está más cerca de una conversación de verdad.</li>
<li>Qué día te costó más, y qué pasó exactamente ese día.</li>
</ul>
<p>Publica los números en el grupo. Los que sean. Si son diez enviados y cero respuestas, se publican diez y cero.</p>`,
    proof_required: "Los cuatro números y las tres líneas, en el grupo.",
    note_html: `<p><strong>Audio del día · 75 segundos.</strong> Hoy toca mirar los números, y quiero avisarte de algo antes de que los mires. Si has enviado diez mensajes y no ha contestado nadie, tu cabeza va a sacar una conclusión inmediata: esto no funciona. O peor: yo no valgo para esto. Con diez datos. Diez. Con diez mensajes no se puede concluir nada, ni bueno ni malo. Lo único que dicen esos diez es que enviaste, y que hace una semana no lo hacías. Los números de hoy no son una nota. Son el punto de partida para saber qué tocar mañana. Si nadie contestó, cambiamos la primera línea. Si contestaron y se enfrió, cambiamos el cierre. Eso es todo lo que significan. Publícalos como salgan. Aquí el que publica un cero honesto va por delante del que no ha enviado nada.</p>`,
  },
];

const PLACEHOLDER_TITLE = "Pendiente";

for (let dayNumber = 8; dayNumber <= 30; dayNumber++) {
  days.push({
    day_number: dayNumber,
    title: PLACEHOLDER_TITLE,
    time_estimate_minutes: null,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today: null,
    action_html: null,
    proof_required: null,
    note_html: null,
  });
}

const catalogItems: Array<{
  title: string;
  content_html: string;
  price_range: string;
  sort_order: number;
}> = [
  {
    title: "Web con reserva y asistente",
    content_html:
      "Web sencilla donde el cliente reserva solo, con asistente que responde las dudas típicas antes de reservar. Para negocios sin web, o con una web donde no se puede hacer nada. <strong>Validado con tres casos reales.</strong>",
    price_range: "500–700€",
    sort_order: 1,
  },
  {
    title: "Agente de WhatsApp para citas o pedidos",
    content_html:
      "Contesta, cualifica, coge la cita o el pedido y lo deja apuntado. Para quien ya recibe WhatsApp y los gestiona a mano entre cliente y cliente.",
    price_range: "500–600€",
    sort_order: 2,
  },
  {
    title: "Agente de voz que coge el teléfono",
    content_html:
      "Coge las llamadas que hoy no coge nadie: informa, agenda y deja el registro. Para negocios donde el que atiende no puede parar. <strong>Es el que mejor demo tiene:</strong> se llama al número y se oye funcionar.",
    price_range: "600–900€",
    sort_order: 3,
  },
  {
    title: "Recuperación de clientes dormidos",
    content_html:
      "Se coge su lista de clientes antiguos, se limpia y se lanza una secuencia por WhatsApp o email para que vuelvan. Ingresos de gente que ya les compró.",
    price_range: "400–600€",
    sort_order: 4,
  },
  {
    title: "Presupuestos y respuesta rápida",
    content_html:
      "Recoge la solicitud, la ordena y devuelve un presupuesto el mismo día. Para talleres, reformas, instaladores: cualquiera que pierda trabajos por tardar tres días en presupuestar.",
    price_range: "500–700€",
    sort_order: 5,
  },
];

const templates: Array<{ title: string; content_html: string; sort_order: number }> = [
  {
    title: "Plantilla A · WhatsApp a alguien de tu agenda",
    content_html: `<p>Se envía en mensajes seguidos, no en un ladrillo.</p>
<p><strong>1.</strong> Hola [NOMBRE], ¿qué tal? Soy [TU NOMBRE].</p>
<p><strong>2.</strong> Te escribo por una cosa concreta. He montado una [SERVICIO] para [NEGOCIO], para ver cómo quedaba. Está hecha con vuestros datos reales: [DETALLE CONCRETO QUE HAS VISTO].</p>
<p><strong>3.</strong> [ADJUNTAR VÍDEO O NÚMERO DE LA DEMO]</p>
<p><strong>4.</strong> Échale un ojo cuando puedas y me dices qué te parece. Sin compromiso, quiero saber si esto os serviría de algo.</p>
<p><em>Tres huecos: nombre, negocio y detalle concreto. El detalle es el único que cuesta y es el que hace el trabajo. "Vi que las reservas las cogéis por teléfono" vale. "Vi que sois muy buenos" no vale. No se añade precio, ni explicación de la tecnología, ni cuánto has tardado, ni "sé que estás muy liado".</em></p>`,
    sort_order: 1,
  },
  {
    title: "Plantilla B · Email cuando no tienes su móvil",
    content_html: `<p><strong>Asunto:</strong> [NOMBRE DEL NEGOCIO]</p>
<p>Hola,</p>
<p>Soy [TU NOMBRE]. Estuve mirando [NEGOCIO] y vi que [DETALLE CONCRETO].</p>
<p>He montado un ejemplo de [SERVICIO] con vuestros datos para enseñaros cómo quedaría. Son 30 segundos: [ENLACE O ADJUNTO].</p>
<p>Si os encaja, os cuento. Y si no, no pasa nada.</p>
<p>[TU NOMBRE] · [TELÉFONO]</p>
<p><em>Asunto solo con el nombre del negocio: es lo único que garantiza que lo abran. Máximo 80 palabras. Sin firma con cargos ni logos.</em></p>`,
    sort_order: 2,
  },
  {
    title: "Plantilla C · Presencial, negocio de tu calle",
    content_html: `<p>Apertura de 20 segundos, memorizada:</p>
<p>"Hola, soy [TU NOMBRE]. He montado una cosa para [NEGOCIO] y quería enseñársela al dueño, son treinta segundos. ¿Está por aquí?"</p>
<p><strong>Si está:</strong> le enseñas la demo en el móvil, callas mientras la mira, y luego una sola pregunta: "¿esto os serviría de algo?"</p>
<p><strong>Si no está:</strong> dejas tu teléfono, apuntas su nombre y vuelves otro día.</p>`,
    sort_order: 3,
  },
];

async function main() {
  const existing = await prisma.edition.findFirst({ where: { name: EDITION_NAME } });
  if (existing) {
    console.log(`La edición "${EDITION_NAME}" ya existe (id: ${existing.id}). No se hace nada.`);
    return;
  }

  const edition = await prisma.edition.create({
    data: {
      name: EDITION_NAME,
      start_date: START_DATE,
      end_date: END_DATE,
      is_active: true,
    },
  });

  await prisma.day.createMany({
    data: days.map((d) => ({
      edition_id: edition.id,
      day_number: d.day_number,
      date: dateForDay(d.day_number),
      title: d.title,
      time_estimate_minutes: d.time_estimate_minutes,
      is_live_session: d.is_live_session,
      live_session_label: d.live_session_label,
      is_unlocked: d.is_unlocked,
      why_today: d.why_today,
      action_html: d.action_html,
      proof_required: d.proof_required,
      note_html: d.note_html,
    })),
  });

  await prisma.resource.createMany({
    data: catalogItems.map((item) => ({
      edition_id: edition.id,
      type: ResourceType.catalog_item,
      title: item.title,
      content_html: item.content_html,
      price_range: item.price_range,
      sort_order: item.sort_order,
    })),
  });

  await prisma.resource.createMany({
    data: templates.map((item) => ({
      edition_id: edition.id,
      type: ResourceType.template,
      title: item.title,
      content_html: item.content_html,
      price_range: null,
      sort_order: item.sort_order,
    })),
  });

  await prisma.skillFile.create({
    data: {
      edition_id: edition.id,
      title: "Skill de investigación de prospecto",
      download_url: "https://example.com/PENDIENTE-enlace-de-descarga",
      instructions_html:
        "<p>Instrucciones de instalación pendientes de completar en el panel de admin.</p>",
    },
  });

  console.log(`Edición "${EDITION_NAME}" creada (id: ${edition.id}) con ${days.length} días.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
