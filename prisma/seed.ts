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

days.push(
  {
    day_number: 8,
    title: "Reescritura",
    time_estimate_minutes: 60,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Llevas una semana con un mensaje y ya tienes datos reales sobre él: cuántos contestaron, cuántos no, qué pasó cuando contestaron. Hoy no se prueba nada nuevo. Se corrige lo que ya existe, con lo que aprendiste el domingo, no con teoría.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Relee tu recuento del domingo: cuántos enviados, cuántas respuestas, cuántos silencios, cuántas negativas.</li>
<li><strong>Si nadie contestó</strong>, el problema está casi siempre en la primera línea. La gente decide en tres segundos si sigue leyendo. Prueba a poner el detalle concreto del negocio por delante, antes incluso del saludo.</li>
<li><strong>Si contestaron pero la conversación se enfrió</strong>, el problema suele estar en el cierre. "Échale un ojo cuando puedas" no pide nada. Prueba a cerrar con una pregunta concreta que solo admita sí o no: "¿te viene bien que te lo enseñe cinco minutos esta semana?"</li>
<li>Escribe la versión nueva justo debajo de la vieja, para poder comparar las dos.</li>
</ol>
<p>No cambies la apertura y el cierre a la vez. Si tocas las dos cosas en el mismo mensaje, la semana que viene no vas a saber cuál de las dos cambió algo.</p>`,
    proof_required: "Mensaje viejo y mensaje nuevo, uno debajo del otro, en el grupo.",
    note_html: `<p><strong>Nota.</strong> Esta reescritura es la que vas a usar toda la semana 2. No la retoques cada día: dale al menos quince envíos antes de volver a tocarla, o nunca vas a saber si funciona.</p>`,
  },
  {
    day_number: 9,
    title: "Entra el frío",
    time_estimate_minutes: 120,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Esta semana se acaba la gente que ya te conoce. A partir de hoy escribes a quien no tiene ni idea de quién eres, y es la primera prueba real de si tu mensaje aguanta solo, sin la red de la relación previa por debajo.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Usa la skill de prospección para sacar 15 negocios de tu nicho que no conozcas de nada.</li>
<li>Investiga cada uno con la skill de investigación de prospecto: qué hacen, qué horario tienen, cómo gestionan hoy el problema de tu nicho, algo concreto que puedas nombrar en el mensaje.</li>
<li>Envía tu mensaje reescrito de ayer a los 15. Si el negocio no es al que le hiciste la demo del día 3, ajusta el detalle concreto a lo que hayas encontrado de él en la investigación. No envíes el mismo detalle a los 15: eso se nota.</li>
<li>Regístralos en tu lista o CRM si ya lo has empezado, con el canal marcado como "frío".</li>
</ol>`,
    proof_required: "Captura de los 15 mensajes enviados.",
    note_html: `<p><strong>Audio del día · 75 segundos.</strong> Hoy cambia una cosa importante: ya no le escribes a nadie que te conozca. Vas a notar la diferencia en el estómago antes que en las respuestas. No es que el mensaje se haya vuelto peor. Es que hasta ahora tenías una red debajo. Si el vecino no contestaba, no dolía igual que si no contesta un desconocido. No busques validación extra para compensar. No mandes el mensaje más largo, ni más amable, ni con más explicaciones. El mensaje que ya tienes fue probado la semana pasada. Hoy solo cambia a quién se lo mandas.</p>`,
  },
  {
    day_number: 10,
    title: "Seguimiento total",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "De aquí sale la mitad de las respuestas de todo el reto. Es la tarea con menos glamour de las 30 y la de mejor retorno por minuto invertido.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Repasa todos los mensajes enviados desde el día 4 que no hayan tenido respuesta. Sí, incluidos los de hace una semana.</li>
<li>A cada uno, un segundo toque corto: "¿llegaste a verlo? Sin prisa" o algo equivalente. No repitas el mensaje entero, no expliques por qué vuelves a escribir.</li>
<li>A los que ya contestaron pero la conversación quedó a medias, empuja un paso más: "¿te viene bien que hablemos cinco minutos esta semana?"</li>
<li>Anota en tu lista o CRM la fecha de cada seguimiento.</li>
</ol>`,
    proof_required: "Recuento de cuántos seguimientos enviaste y cuántas respuestas nuevas trajeron.",
    note_html: `<p><strong>Nota.</strong> Si llevas diez días sin tocar a alguien de tu lista, no es tarde para escribirle hoy. El seguimiento se hace toda la duración del reto, no solo esta semana.</p>`,
  },
  {
    day_number: 11,
    title: "El precio, en voz alta",
    time_estimate_minutes: 90,
    is_live_session: true,
    live_session_label: "Directo",
    is_unlocked: false,
    why_today:
      "Decir un precio en voz alta y escribirlo en un mensaje son dos habilidades distintas. La primera es la que te va a fallar en la primera llamada si no la entrenas antes de que haga falta de verdad.",
    action_html: `<p><strong>La acción, antes de la sesión</strong></p>
<ol>
<li>Graba un audio de 60 segundos diciendo tu precio en voz alta, dirigido a un cliente imaginario.</li>
<li>La justificación no puede ser tu esfuerzo. "Me ha llevado dos semanas montarlo" no vale. Tiene que ser el coste del problema para el cliente: "porque esto os está costando aproximadamente X al mes".</li>
<li>Practícalo dos o tres veces en voz alta antes de grabar la versión que envías.</li>
</ol>
<p><strong>La sesión.</strong> Se comparten varios audios y se corrigen en directo: si suena a disculpa, si justifica por tiempo en vez de por problema, si el precio baja dentro de la misma frase en que se dice.</p>`,
    proof_required: "El audio, publicado en el grupo antes de la sesión.",
    note_html: `<p><strong>Aviso.</strong> Si al grabarlo bajas el precio a mitad de frase sin darte cuenta, es la señal más clara de que el bloqueo no es técnico. Se corrige en la sesión, no antes.</p>`,
  },
  {
    day_number: 12,
    title: "Guion de llamada",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "La semana que viene coges el teléfono por primera vez en el reto. Sin un guion delante, la primera llamada se queda en blanco a los diez segundos, y ese silencio es lo que hace que cueste el doble marcar el segundo número.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li><strong>Apertura (10 seg).</strong> Quién eres y por qué llamas, en una frase.</li>
<li><strong>Cualificación económica al principio.</strong> Una pregunta que te diga rápido si merece la pena seguir hablando, sin sonar a interrogatorio.</li>
<li><strong>Pregunta de dolor.</strong> Que hable él, no tú. "¿Cómo lo gestionáis ahora mismo?" y luego silencio.</li>
<li><strong>Puente a reunión o a demo.</strong> "Tengo un ejemplo montado, ¿tienes diez minutos esta semana para que te lo enseñe?"</li>
<li><strong>Tres objeciones reales</strong> que ya te hayan puesto por escrito estas dos semanas, con una respuesta corta preparada para cada una.</li>
<li>Practícalo en voz alta tres veces. Que no suene leído la tercera vez.</li>
</ol>`,
    proof_required:
      "El guion escrito completo, y una nota confirmando que lo practicaste en voz alta tres veces.",
    note_html: `<p><strong>Nota.</strong> El guion no es para leerlo durante la llamada. Es para que la estructura esté en tu cabeza y no te quedes en blanco. Si lo lees palabra por palabra, se nota.</p>`,
  },
  {
    day_number: 13,
    title: "Tu CRM",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Ya llevas más de treinta contactos entre agenda, primeros envíos y frío. Se te están empezando a perder seguimientos, y de aquí a la semana 4 se van a perder muchos más si esto no se ordena hoy.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Monta una tabla, en Airtable, Sheets o lo que uses, con estas columnas: <strong>nombre · negocio · teléfono · canal (agenda, frío, referido, calle) · estado (nuevo, contactado, respondió, llamada, propuesta, cerrado, perdido) · próximo paso · fecha próximo paso</strong>.</li>
<li>Vuelca ahí todos los contactos que llevas hasta hoy, con su estado real, no el que te gustaría que tuvieran.</li>
<li>Revisa uno a uno: ¿tiene un próximo paso escrito? Si no lo tiene, no sabes qué hacer con él mañana, y es exactamente ahí donde se pierden.</li>
</ol>`,
    proof_required: "Captura del CRM con todos los contactos volcados y su estado.",
    note_html: `<p><strong>Nota.</strong> No se monta antes porque no hacía falta antes: con diez contactos se lleva en la cabeza sin problema. Con treinta, no, y a partir de hoy vas a superar esa cifra cada semana.</p>`,
  },
  {
    day_number: 14,
    title: "El rechazo como dato",
    time_estimate_minutes: 60,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Llevas dos semanas recibiendo noes y silencios. Hoy los miras de frente, con números, en vez de dejar que se acumulen como una sensación difusa de que esto no funciona.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Cuenta cuántos noes claros y cuántos silencios llevas en total desde el día 4.</li>
<li>De los últimos cinco, escribe qué te enseñó cada uno: ¿era el mensaje?, ¿era el nicho?, ¿era el momento en que escribiste?</li>
<li>Escribe una frase corta que te vaya a servir para marcar el siguiente número la semana que viene, cuando toque llamar.</li>
</ol>`,
    proof_required: "Los números y la reflexión, publicados en el grupo.",
    note_html: `<p><strong>Audio del día · 75 segundos.</strong> Llevas dos semanas recibiendo noes, y en algún momento de estos días te ha pasado por la cabeza que quizás esto no es para ti. Los números que has ido publicando dicen otra cosa. Dicen que has enviado, que has vuelto a escribir cuando no contestaban, que has grabado un precio en voz alta aunque te diera vergüenza. Eso no lo hace el que no vale para esto. Eso lo hace el que está aprendiendo a vender. La semana que viene entra el teléfono. Va a dar más miedo que escribir. Y vas a hacerlo igual, porque ya has demostrado que sabes hacer cosas con miedo.</p>`,
  },
  {
    day_number: 15,
    title: "Propuesta en una página",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "En cuanto alguien diga \"cuéntame más\", necesitas tener algo que enviar en ese momento, no montarlo esa misma noche con prisa y mal.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Una sola página, no más. Estructura: el problema (con el número real, no genérico), qué resuelves, qué entregas exactamente, en cuánto tiempo, precio.</li>
<li>Sin cifras de resultado inventadas. Si no tienes casos reales todavía, no pongas casos: pon tu demo como ejemplo, con honestidad.</li>
<li>Cierre con un paso concreto y accionable: "para empezar, hacemos X", no "hablamos y vemos".</li>
</ol>`,
    proof_required: "El PDF de la propuesta.",
    note_html: `<p><strong>Nota.</strong> Esta propuesta la vas a reutilizar toda la semana 3 y 4. No hace falta rehacerla para cada cliente, solo cambiar el nombre del negocio y el detalle concreto.</p>`,
  },
  {
    day_number: 16,
    title: "Segunda ronda de frío",
    time_estimate_minutes: 120,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "El mensaje ya está probado dos veces, con conocidos y con desconocidos. A estas alturas del reto toca subir el volumen, porque el pipeline de las semanas 3 y 4 depende de lo que siembres ahora.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Saca veinte negocios nuevos de tu nicho con la skill de prospección.</li>
<li>Usa el mensaje reescrito del día 8, adaptado al detalle concreto de cada uno.</li>
<li>Envía los veinte y actualiza el CRM con cada uno: canal "frío", estado "contactado", fecha de hoy.</li>
</ol>`,
    proof_required: "Captura de los veinte enviados y el CRM actualizado.",
    note_html: `<p><strong>Nota.</strong> Veinte en un día es más volumen del que has manejado hasta ahora. Resérvate al menos noventa minutos seguidos, no lo trocees entre otras cosas: se nota en la calidad de la personalización.</p>`,
  },
  {
    day_number: 17,
    title: "Primera llamada",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Mañana es la sesión donde se analiza una llamada real delante de todos. Necesitas tener al menos una hecha o agendada antes de llegar a esa sesión.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Revisa tu CRM: quién tiene teléfono y ha mostrado algo de interés, aunque sea tibio.</li>
<li>Llama con el guion del día 12 delante. No hace falta memorizarlo, hace falta tenerlo a mano.</li>
<li>Si nadie está lo bastante caliente para justificar una llamada en frío hoy, llama a alguien que no haya contestado por escrito. El objetivo de hoy es marcar el número, no que la llamada salga perfecta.</li>
<li>Registra el resultado en el CRM, sea cual sea.</li>
</ol>`,
    proof_required: "Captura de la llamada agendada, o notas de la llamada hecha.",
    note_html: `<p><strong>Nota.</strong> Da igual si la llamada sale mal o corta. Lo que cuenta hoy es que hayas marcado. La calidad de la llamada se trabaja mañana en la sesión.</p>`,
  },
  {
    day_number: 18,
    title: "Llamada real corregida",
    time_estimate_minutes: 90,
    is_live_session: true,
    live_session_label: "Directo",
    is_unlocked: false,
    why_today:
      "Una llamada real, corregida delante de todos, enseña más en veinte minutos que diez artículos genéricos sobre cómo vender por teléfono.",
    action_html: `<p><strong>La sesión.</strong> Se analiza la llamada de uno o dos voluntarios: qué funcionó, en qué momento se cerró la conversación, qué objeción apareció y cómo se respondió en el momento frente a cómo se podría haber respondido.</p>
<p><strong>La acción.</strong> Llega con tu llamada de ayer (hecha o agendada) y con la lista de objeciones reales que te hayan puesto hasta ahora, por si hace falta compartirlas.</p>`,
    proof_required: "Tu lista de objeciones reales recogidas hasta hoy.",
    note_html: `<p><strong>Nota.</strong> Si tu llamada de ayer no dio para mucho, no pasa nada: la sesión de hoy funciona igual analizando la de otro compañero. Lo importante es que participes con tus objeciones reales.</p>`,
  },
  {
    day_number: 19,
    title: "Objeciones respondidas",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Ayer salieron objeciones reales en la sesión. Hoy se responden por escrito, para no tener que improvisar la próxima vez que aparezcan en una llamada o un mensaje.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Lista todas las objeciones que te han puesto de verdad estas semanas. No las de un manual de ventas: las tuyas, tal cual te las dijeron.</li>
<li>Escribe una respuesta corta para cada una. Una o dos frases, no un párrafo.</li>
<li>Ensaya en voz alta las dos que más te cuesten responder.</li>
</ol>`,
    proof_required: "El documento con tus objeciones reales y sus respuestas.",
    note_html: `<p><strong>Nota.</strong> Este documento crece durante el resto del reto. Cada objeción nueva que te pongan a partir de hoy se añade aquí, no se pierde en la conversación.</p>`,
  },
  {
    day_number: 20,
    title: "Segundo post y entrega mínima",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Llevas tres semanas de material real. Hoy se cuenta algo de eso en público, y se deja por escrito qué recibe exactamente alguien el día que dice que sí, para no improvisarlo cuando pase.",
    action_html: `<p><strong>Parte 1 · El post (45 min)</strong></p>
<p>Un post contando algo concreto de estas tres semanas: una llamada que te sorprendió, una objeción que no esperabas, un número real de tu recuento. Nada de lecciones ni consejos: un hecho, contado como pasó.</p>
<p><strong>Parte 2 · Entrega mínima (45 min)</strong></p>
<ol>
<li>Escribe la lista exacta de lo que entregas cuando alguien dice que sí: qué, en qué plazo, con qué nivel de soporte después.</li>
<li>No prometas nada que no puedas sostener sin ayuda externa. Si algo depende de un tercero, dilo.</li>
</ol>`,
    proof_required: "Enlace al post, y la lista de entregables con plazos.",
    note_html: `<p><strong>Nota.</strong> La entrega mínima de hoy es la que vas a usar en la semana 4 cuando alguien diga que sí de verdad. Que esté clara ahora te ahorra improvisar bajo presión entonces.</p>`,
  },
  {
    day_number: 21,
    title: "Pedir la decisión",
    time_estimate_minutes: 60,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Mañana empieza la semana de pedir la decisión a quien está más avanzado. Hoy se prepara, para no improvisarlo persona por persona mañana mismo.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Repasa tu CRM y haz la lista de a quién se lo vas a pedir mañana: los que estén más avanzados, con más conversación real detrás.</li>
<li>Escribe la frase exacta con la que se lo vas a pedir a cada uno. Sin rodeos: "¿empezamos?" pesa más que "¿qué te parece?".</li>
</ol>`,
    proof_required: "La lista nominal de a quién se lo vas a pedir, más la frase exacta.",
    note_html: `<p><strong>Nota.</strong> No hace falta que la lista sea larga. Puede ser una sola persona. Lo importante es que la frase esté escrita hoy y no se improvise mañana.</p>`,
  },
  {
    day_number: 22,
    title: "Se pide la decisión",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Todo lo anterior ha sido para llegar a este momento. Sin pedirlo explícitamente, la mayoría de conversaciones abiertas se quedan abiertas para siempre, por buenas que hayan sido.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>A cada persona de tu lista de ayer, la pregunta directa que preparaste.</li>
<li>Sin bajar el precio antes de que nadie lo pida. Si aparece la objeción del pago único, ahí se ofrece el fraccionamiento, no antes.</li>
<li>Si alguien dice que sí, le entregas la propuesta del día 15 en ese mismo momento, con su nombre y su detalle concreto.</li>
</ol>`,
    proof_required: "Capturas de las peticiones enviadas.",
    note_html: `<p><strong>Nota.</strong> Un "no" hoy no es un fracaso del reto. Es información. Lo que no vale es no llegar a preguntarlo.</p>`,
  },
  {
    day_number: 23,
    title: "Tercera ronda",
    time_estimate_minutes: 120,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "El pipeline no se llena solo. Lo que siembras hoy no va a cerrar esta semana, va a cerrar en noviembre, y eso es exactamente lo que hace que el mes que viene no tengas que empezar de cero.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Veinte negocios nuevos de tu nicho, con la skill de prospección.</li>
<li>El mensaje ya probado y reescrito, adaptado al detalle de cada uno.</li>
<li>CRM actualizado con los veinte.</li>
</ol>`,
    proof_required: "Captura de los veinte enviados y el CRM.",
    note_html: `<p><strong>Nota.</strong> A estas alturas el mensaje ya no debería costarte escribirlo. Si te sigue costando cada vez, revisa si de verdad lo has interiorizado o lo estás reescribiendo desde cero cada día.</p>`,
  },
  {
    day_number: 24,
    title: "Dos llamadas",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "El teléfono no se abandona porque ya hayas hecho una llamada la semana pasada. Se sostiene, porque es donde se cierran las conversaciones que el mensaje escrito deja a medias.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Revisa el CRM y elige al menos dos contactos con teléfono y algo de interés mostrado.</li>
<li>Llama con el guion delante, registra el resultado de cada llamada al momento, no de memoria más tarde.</li>
</ol>`,
    proof_required: "Notas de las dos llamadas en el CRM.",
    note_html: `<p><strong>Nota.</strong> Si de las dos llamadas una no contesta, cuenta igual como llamada hecha para el número de hoy. Marcar es la tarea, no que te lo cojan.</p>`,
  },
  {
    day_number: 25,
    title: "Los déjame pensarlo",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Un \"déjame pensarlo\" casi nunca es sobre el precio de verdad. Es un no blando, y se rompe preguntando qué falta, no insistiendo en que decidan.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Repasa tu CRM: quién quedó en "lo estoy pensando" o similar.</li>
<li>A cada uno, una pregunta concreta y distinta según su caso: "¿qué te haría falta ver para decidirte?" en vez de "¿ya lo pensaste?".</li>
<li>Escucha la respuesta entera antes de proponer nada, aunque te dé la sensación de saber ya qué va a decir.</li>
</ol>`,
    proof_required: "Capturas de las conversaciones reabiertas.",
    note_html: `<p><strong>Nota.</strong> La pregunta correcta suele destapar la objeción real que no se dijo la primera vez: el pago único, el miedo a no saber usarlo, la comparación con otro presupuesto. Ahí es donde se puede trabajar de verdad.</p>`,
  },
  {
    day_number: 26,
    title: "Referidos",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Es la tarea con mejor ratio de todo el reto, y la que casi nadie hace, porque parece que se está pidiendo un favor cuando en realidad es una pregunta normal que la gente contesta con gusto.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>A todo el que te dijo que no, una pregunta directa: "¿conoces a alguien a quien esto sí le encaje?"</li>
<li>A los que ya son clientes o están a punto de serlo, la misma pregunta. El que ya confía en ti es tu mejor fuente de referidos, no solo el que dijo que no.</li>
<li>Cada nombre nuevo que te den entra directo al CRM, con canal "referido".</li>
</ol>`,
    proof_required: "Capturas de las preguntas enviadas y nombres nuevos entrados al CRM.",
    note_html: `<p><strong>Nota.</strong> No lo plantees como un favor ("¿me harías el favor de...") sino como una pregunta neutra. Cambia por completo cómo lo recibe la otra persona.</p>`,
  },
  {
    day_number: 27,
    title: "Tu sistema, no el del cliente",
    time_estimate_minutes: 90,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Llevas un mes vendiendo sistemas que automatizan el seguimiento de otros negocios. Hoy toca automatizar el tuyo, porque el seguimiento manual es lo primero que se abandona cuando aumenta el volumen.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>De los contactos que no han contestado en dos semanas o más, monta un recordatorio automático, o al menos una plantilla de reactivación lista para reutilizar, que no dependa de que te acuerdes tú.</li>
<li>Puede ser tan simple como un recordatorio calendarizado con el mensaje ya escrito y listo para enviar en un clic.</li>
</ol>`,
    proof_required: "Captura del sistema funcionando.",
    note_html: `<p><strong>Nota.</strong> No hace falta que sea sofisticado. El objetivo es que dentro de un mes, cuando tengas ochenta contactos en vez de treinta, el seguimiento no dependa de tu memoria.</p>`,
  },
  {
    day_number: 28,
    title: "Números de las cuatro semanas",
    time_estimate_minutes: 60,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Antes del último empujón de mañana y pasado, hay que ver el mapa completo del mes: qué ha funcionado de verdad y qué no, con números y no con sensaciones.",
    action_html: `<p><strong>La acción</strong></p>
<p>Cinco números, contados desde el día 4 hasta hoy:</p>
<ol>
<li>Contactados.</li>
<li>Respuestas.</li>
<li>Llamadas hechas.</li>
<li>Propuestas enviadas.</li>
<li>Cierres.</li>
</ol>`,
    proof_required: "Los cinco números, publicados en el grupo.",
    note_html: `<p><strong>Nota.</strong> Sean cuales sean los números, son reales, y son más de lo que tenías hace un mes. Mañana y pasado se aprovecha lo que queda de tiempo con esto delante.</p>`,
  },
  {
    day_number: 29,
    title: "Última ronda y cierre de cabos",
    time_estimate_minutes: 120,
    is_live_session: false,
    live_session_label: null,
    is_unlocked: false,
    why_today:
      "Mañana es el cierre del reto. Hoy no se deja ninguna conversación sin un próximo paso definido, porque lo que quede sin cerrar hoy es lo que se pierde cuando termine el acompañamiento diario.",
    action_html: `<p><strong>La acción</strong></p>
<ol>
<li>Si aún tienes capacidad, veinte contactos nuevos más. Si no, prioriza el punto siguiente.</li>
<li>Repasa el CRM entero, fila por fila: ninguna puede quedar sin "próximo paso" relleno. Si una conversación no tiene claro qué toca después, decide hoy qué va a ser.</li>
</ol>`,
    proof_required: "Captura del CRM sin ningún hueco en la columna de próximo paso.",
    note_html: `<p><strong>Nota.</strong> Este es el trabajo menos vistoso de los 30 días y el que más determina si el mes que viene arrancas con algo o desde cero.</p>`,
  },
  {
    day_number: 30,
    title: "Cierre",
    time_estimate_minutes: 90,
    is_live_session: true,
    live_session_label: "Directo de cierre",
    is_unlocked: false,
    why_today:
      "Es el día de mirar los números de verdad, sin adornarlos, y decidir en conjunto qué pasa a partir de mañana con lo que se ha construido este mes.",
    action_html: `<p><strong>La sesión.</strong> Cada uno comparte sus números reales de los 30 días: contactados, llamadas, propuestas, cierres. Qué se rompió, en qué momento, y qué se lleva a la mentoría quien continúe.</p>
<p><strong>La acción.</strong> Llega con tus cinco números del día 28 actualizados a hoy, y con una frase honesta sobre qué ha cambiado en ti en estos 30 días, más allá de los números.</p>`,
    proof_required: "Tus números finales, publicados en el grupo.",
    note_html: `<p><strong>Nota.</strong> No hay un número mínimo para que el reto se considere un éxito. El éxito es haber accionado 30 días seguidos, cosa que el 99% de la gente que "está aprendiendo IA" no hace nunca.</p>`,
  }
);

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

  const createdDays = await prisma.day.findMany({
    where: { edition_id: edition.id },
    select: { id: true, day_number: true },
  });
  const dayIdByNumber = new Map(createdDays.map((d) => [d.day_number, d.id]));

  const newCatalogItems = await Promise.all(
    catalogItems.map((item) =>
      prisma.resource.create({
        data: {
          edition_id: edition.id,
          type: ResourceType.catalog_item,
          title: item.title,
          content_html: item.content_html,
          price_range: item.price_range,
          sort_order: item.sort_order,
        },
      })
    )
  );

  const newTemplates = await Promise.all(
    templates.map((item) =>
      prisma.resource.create({
        data: {
          edition_id: edition.id,
          type: ResourceType.template,
          title: item.title,
          content_html: item.content_html,
          price_range: null,
          sort_order: item.sort_order,
        },
      })
    )
  );

  const skillFile = await prisma.skillFile.create({
    data: {
      edition_id: edition.id,
      title: "Skill de investigación de prospecto",
      download_url: "https://example.com/PENDIENTE-enlace-de-descarga",
      instructions_html:
        "<p>Instrucciones de instalación pendientes de completar en el panel de admin.</p>",
    },
  });

  const templateIds = newTemplates.map((t) => ({ id: t.id }));
  const catalogIds = newCatalogItems.map((r) => ({ id: r.id }));

  // Día 1: elegir servicio del catálogo si no se tiene uno propio.
  const day1Id = dayIdByNumber.get(1);
  if (day1Id) {
    await prisma.day.update({
      where: { id: day1Id },
      data: { resources: { connect: catalogIds } },
    });
  }

  // Día 3: investigar y montar la demo con la skill.
  const day3Id = dayIdByNumber.get(3);
  if (day3Id) {
    await prisma.day.update({
      where: { id: day3Id },
      data: { skill_files: { connect: { id: skillFile.id } } },
    });
  }

  // Día 4: envío en directo con las tres plantillas.
  const day4Id = dayIdByNumber.get(4);
  if (day4Id) {
    await prisma.day.update({
      where: { id: day4Id },
      data: { resources: { connect: templateIds } },
    });
  }

  // Día 5: más envíos y seguimientos, reutilizando plantillas y skill como último recurso.
  const day5Id = dayIdByNumber.get(5);
  if (day5Id) {
    await prisma.day.update({
      where: { id: day5Id },
      data: {
        resources: { connect: templateIds },
        skill_files: { connect: { id: skillFile.id } },
      },
    });
  }

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
