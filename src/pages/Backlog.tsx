import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

type Size = 'S' | 'M' | 'L';
interface Ticket {
  id: string; title: string; desc: string; size: Size;
  link?: { label: string; to: string }; risk?: string;
}
interface Group { label: string; tickets: Ticket[]; }
interface Week { num: number; color?: string; title: string; sub: string; groups: Group[]; }

const feedbackLoreto: Group = {
  label: 'Feedback reunión Loreto (07/07)',
  tickets: [
    { id: 'FB-01', title: 'Separar causa de demanda — reestructurar navegación', desc: 'Nueva sección "Redacción de demandas" con estados (redactada/lista/subida/suspendida). Causa nace solo al subir al PJUD.', size: 'L', risk: 'Alta' },
    { id: 'FB-02', title: 'Agente global en el Inicio', desc: 'Subagente de plataforma que reporta movimientos del día, propone plan de trabajo y acciona en lote.', size: 'L', risk: 'Alta', link: { label: 'Home', to: '/' } },
    { id: 'FB-03', title: 'Estado diario del PJUD (vista secundaria)', desc: 'Réplica de la vista del PJUD como respaldo y trigger check. Filtro por día, cruce por rol.', size: 'M', risk: 'Media' },
    { id: 'FB-04', title: 'Escritos tipo Word, editable y descargable', desc: 'Panel de escrito sugerido como documento Word: editable en línea, descarga Word/PDF, guardar.', size: 'M', risk: 'Alta', link: { label: 'Causa', to: '/causas/884-201' } },
    { id: 'FB-05', title: 'Suspender, reactivar y eliminar causas', desc: 'Estados de gestión con motivo. Reflejo instantáneo en listados, relojes y métricas.', size: 'M', risk: 'Alta', link: { label: 'Causas', to: '/causas' } },
    { id: 'FB-06', title: 'Recordatorios y notas internas por causa', desc: 'Vía procurador en lenguaje natural. Recordatorios al Inicio; notas en pestaña Datos.', size: 'M', risk: 'Media', link: { label: 'Causa', to: '/causas/884-201' } },
    { id: 'FB-07', title: 'Renombrar "Facturación" a "Hitos de cobro"', desc: 'No es % de avance: es el hito por el que el estudio cobra a la financiera.', size: 'S', risk: 'Baja', link: { label: 'Causa', to: '/causas/884-201' } },
    { id: 'FB-08', title: 'Feedback en vivo durante la carga de demandas', desc: 'Lista de operaciones apareciendo mientras se procesan (leyendo/validada/en revisión), no flash de éxito.', size: 'M', risk: 'Media' },
  ],
};

const weeks: Week[] = [
  {
    num: 1, title: 'Cimientos: ingesta, OCR y máquina de estados',
    sub: 'Que un lote entre, se valide por OCR y nazca la operación con su número de crédito.',
    groups: [
      {
        label: 'Infraestructura y datos', tickets: [
          { id: 'INF-01', title: 'Levantar stack ProdBooster, repos, entornos y CI', desc: 'Bloquea todo lo demás. Pendiente de confirmar el stack.', size: 'M', risk: 'Bloqueante' },
          { id: 'INF-02', title: 'Esquema de las 9 entidades núcleo', desc: 'Causa, Parte, Documento, Actuación, Reloj, Acción, Firma, Receptor, Pauta.', size: 'M' },
          { id: 'INF-03', title: 'Autenticación y roles', desc: 'Patrocinante / apoderado / operador de ingesta.', size: 'S', link: { label: 'Login', to: '/bienvenida' } },
          { id: 'INF-04', title: 'Consentimiento Ley 21.719', desc: 'Firma de autorización de uso de Clave Única + trazabilidad desde el día 1.', size: 'M' },
        ],
      },
      {
        label: 'Ingesta y OCR — Espacio de operación', tickets: [
          { id: 'ING-01', title: 'Conector ZIP global (Modalidad A)', desc: 'Descomprimir, clasificar pagaré/CAV/tabla y asociar por crédito/RUT/patente.', size: 'M', link: { label: 'Bienvenida', to: '/bienvenida' } },
          { id: 'ING-02', title: 'Conector ZIP por cliente (Modalidad B)', desc: 'Carpetas por deudor + validación de integridad del set.', size: 'M' },
          { id: 'ING-03', title: 'Motor OCR doble con score de confianza', desc: 'Ponderado por campo. Empezar día 1 con deudores reales de la primera asignación.', size: 'L', risk: 'Riesgo #1' },
          { id: 'ING-04', title: 'Validación documental', desc: 'Completitud de 4 documentos + consistencia cruzada nombre/RUT/monto vs pagaré.', size: 'M' },
          { id: 'ING-05', title: 'Filtro de propietario CAV (con aval)', desc: 'Propietario vs deudor principal y aval según caso → marca "Vehículo Transferido".', size: 'M' },
          { id: 'ING-06', title: 'Conteo de partes vs pagaré → plantilla', desc: 'Dos avales, o rep. legal ≠ aval. Define qué plantilla GLOBAL se usa.', size: 'M' },
          { id: 'ING-07', title: 'Cola de revisión manual', desc: 'Campo dudoso junto al recorte del PDF. Bloqueo de promoción bajo umbral.', size: 'M', link: { label: 'Revisiones', to: '/revisiones' } },
        ],
      },
      {
        label: 'Máquina de estados', tickets: [
          { id: 'EST-01', title: 'Motor de la tabla maestra de transiciones', desc: 'Estados, validaciones y gatillantes. Núcleo del producto.', size: 'L' },
          { id: 'EST-02', title: 'Modelo de los dos cuadernos', desc: 'Principal / apremio con vigilancia paralela, sin bloqueo mutuo.', size: 'M', link: { label: 'Causa', to: '/causas/884-201' } },
          { id: 'EST-03', title: 'Motor de relojes', desc: 'Cuenta regresiva diaria, vencimiento y cierre por tipo de plazo.', size: 'M', link: { label: 'Home', to: '/' } },
        ],
      },
      {
        label: 'Diseño', tickets: [
          { id: 'DIS-01', title: 'Design system ProdBooster', desc: 'Tokens Navy/Latón (Tribunal), Fraunces/Inter, componentes base y los tres tratamientos de autonomía.', size: 'M' },
          { id: 'DIS-02', title: 'Pantallas de ingesta y validación en alta fidelidad', desc: 'Espacio de operación previo a la causa.', size: 'M' },
        ],
      },
    ],
  },
  {
    num: 2, color: 'var(--violeta)', title: 'El corazón agéntico: scraper, clasificación y home',
    sub: 'Que el agente lea del PJUD, clasifique por contenido y el home muestre urgencia real.',
    groups: [
      {
        label: 'Scraper y clasificación', tickets: [
          { id: 'SCR-01', title: 'Túnel de scraping PJUD', desc: 'Login con Clave Única, sesión conservadora, proxy rotativo, detección de bloqueo.', size: 'L', risk: 'Riesgo' },
          { id: 'SCR-02', title: 'Monitor de sincronización (~4h)', desc: 'Barrido por RUT, lectura de movimientos en ambos cuadernos, filtrado de ruido.', size: 'M' },
          { id: 'SCR-03', title: 'Clasificador por contenido del PDF', desc: 'Notificación / búsqueda / requerimiento / resolución / mandamiento. No por título.', size: 'L', link: { label: 'Causa', to: '/causas/884-201' } },
          { id: 'SCR-04', title: 'Validación de calce', desc: 'Nombre en el estampado = deudor de la causa. Alerta "estampado en causa incorrecta".', size: 'M' },
          { id: 'SCR-05', title: 'Registro de intentos + cruce con pauta', desc: 'Tanner 2, OLX 5. Alerta al acercarse al límite.', size: 'M', link: { label: 'Config', to: '/config' } },
        ],
      },
      {
        label: 'Gatillantes de la máquina de estados', tickets: [
          { id: 'EST-04', title: 'Validación de mandamiento campo a campo', desc: 'Si no calza, pre-redactar "rectifíquese".', size: 'M', link: { label: 'Home', to: '/' } },
          { id: 'EST-05', title: 'Notificación efectiva → encargo de embargo', desc: 'Directo, sin pasos intermedios. Excepciones no bloquean.', size: 'M', link: { label: 'Causa', to: '/causas/884-201' } },
          { id: 'EST-06', title: 'Reloj de requerimiento (8 días)', desc: 'En cuaderno de apremio, distinto de la notificación.', size: 'M' },
          { id: 'EST-07', title: 'Detección de excepciones y traslado', desc: 'Alerta máxima prioridad, solo humano.', size: 'S', link: { label: 'Home', to: '/' } },
        ],
      },
      {
        label: 'Home y navegación', tickets: [
          { id: 'HOM-01', title: 'Home global: urgencia como eje', desc: '"Vence pronto" arriba; el CAV y otros relojes van al pulso.', size: 'L', link: { label: 'Home', to: '/' } },
          { id: 'HOM-02', title: 'Pulso: métricas como acciones en lote', desc: '"8 embargos por encargar" es una puerta a un flujo agéntico, no una estadística.', size: 'M', link: { label: 'Home', to: '/' } },
          { id: 'HOM-03', title: 'Lista de causas + filtros por estado', desc: 'Cada fila es una operación con su crédito y su reloj.', size: 'M', link: { label: 'Causas', to: '/causas' } },
        ],
      },
    ],
  },
  {
    num: 3, color: 'var(--green)', title: 'Cierre: procurador, firmas, Registro Civil e informes',
    sub: 'Cerrar el ciclo: el procurador conversa, orquesta firmas, consulta el RC y saca informes.',
    groups: [
      {
        label: 'Procurador conversacional', tickets: [
          { id: 'PRO-01', title: 'Chat del procurador con estado', desc: 'Conversación con propuestas accionables. El botón dispara el flujo, no ejecuta directo.', size: 'L', link: { label: 'Causa', to: '/causas/884-201' } },
          { id: 'PRO-02', title: 'Pestaña expediente (vista clásica)', desc: 'Los dos cuadernos y la línea de tiempo. Secundaria a la conversación.', size: 'M', link: { label: 'Causa', to: '/causas/884-201' } },
        ],
      },
      {
        label: 'Redacción de escritos', tickets: [
          { id: 'RED-01', title: 'Motor de plantillas de demanda', desc: 'Las 6 variantes GLOBAL según deudor/jurisdicción.', size: 'M' },
          { id: 'RED-02', title: 'Escritos de trámite', desc: 'Curso progresivo, cumple lo ordenado, rectifíquese, certificado de no oposición.', size: 'M' },
          { id: 'RED-03', title: 'Escritos de domicilio', desc: 'Nuevo domicilio con/sin exhorto, oficios, devolución de exhorto.', size: 'M' },
          { id: 'RED-04', title: 'Escrito de cierre', desc: 'Designación de martillero + retiro.', size: 'S' },
        ],
      },
      {
        label: 'Firmas y presentación (vía PJUD por ahora)', tickets: [
          { id: 'FIR-01', title: 'Firma y presentación por PJUD', desc: 'Por ahora la firma y el submit efectivo se hacen fuera de la app, directo en PJUD.', size: 'M' },
          { id: 'FIR-02', title: 'Orquestación multi-firma (futuro)', desc: 'Derivar a apoderados, estado compartido, recordatorios automáticos.', size: 'M' },
          { id: 'FIR-03', title: 'Marcar como presentada (submit manual v1)', desc: 'Dispara hito de facturación y arranca reloj.', size: 'S' },
        ],
      },
      {
        label: 'Registro Civil e informes', tickets: [
          { id: 'RC-01', title: 'Cron de consulta a Registro Civil', desc: 'Por patente desde el día 25, cada 5–7 días hasta "inscripción aceptada".', size: 'M', link: { label: 'Home', to: '/' } },
          { id: 'RC-02', title: 'Cadena al confirmar inscripción', desc: 'Aviso al abogado + mail a financiera + informe de embargos del período.', size: 'S' },
          { id: 'INF-05', title: 'Bandeja priorizada + causas detenidas', desc: 'Sin movimiento >15/30 días con causa probable.', size: 'M', link: { label: 'Informes', to: '/informes' } },
          { id: 'INF-06', title: 'Informe Semáforo para la financiera', desc: '% con excepciones, % inubicables, % embargos inscritos.', size: 'M', link: { label: 'Informes', to: '/informes' } },
          { id: 'INF-07', title: 'Mapeo a facturación', desc: 'Hito + fecha + documento fundante (5% / 10% / 15%).', size: 'S', link: { label: 'Causa', to: '/causas/884-201' } },
        ],
      },
      {
        label: 'Configuración', tickets: [
          { id: 'CFG-01', title: 'Pauta por financiera', desc: 'Modalidad, intentos, criterio de baja de monto, política CAV, umbral, campo CRM.', size: 'M', link: { label: 'Config', to: '/config' } },
          { id: 'CFG-02', title: 'Base de receptores', desc: 'Alta, zonas, tarifas, performance, plantilla de mail de encargo.', size: 'S', link: { label: 'Config', to: '/config' } },
        ],
      },
    ],
  },
];

const outMvp = [
  { id: 'V2-01', text: 'Subida efectiva de demandas a la OJV (flujo multi-firma completo con submit)' },
  { id: 'V2-02', text: 'Subida efectiva de escritos a la OJV' },
  { id: 'V2-03', text: 'Flujo hipotecario / consumo (validar con Normaliza antes de generalizar)' },
  { id: 'V2-04', text: 'Conector Modalidad C PROFIN vía RPA si no hay API' },
];

export default function Backlog() {
  const navigate = useNavigate();
  return (
    <>
      <div className="backlog-head">
        <div className="brand-row">
          <span className="dot"><Icon name="checkSquare" /></span>
          MVP · 3 semanas
        </div>
        <h1>Backlog de producto</h1>
        <div className="sub">Cada ticket enlaza a la pantalla que implementa. Estimación S/M/L en la escala del equipo.</div>
      </div>

      <div className="note">
        <Icon name="info" />
        <span><b>Corte del MVP:</b> entra toda la máquina de estados, ingesta, OCR, scraping de lectura, relojes y bandeja agéntica. Fuera solo la <b>subida efectiva a la OJV</b> (los escritos quedan firmados y listos; el submit lo hace el abogado por ahora).</span>
      </div>

      <div className="week-block" style={{ background: '#FFFBF5', borderColor: 'var(--amber)' }}>
        <div className="week-title">
          <div className="week-num" style={{ background: 'var(--amber)' }}>FB</div>
          <div><div className="wt">Feedback reunión Loreto (07/07)</div><div className="ws">Tickets de producto derivados de la sesión de revisión. FB-01 es estructural y bloquea el resto.</div></div>
        </div>
        <div className="ticket-group">
          <div className="tg-label">{feedbackLoreto.label}</div>
          {feedbackLoreto.tickets.map((t) => (
            <div className="ticket" key={t.id}>
              <span className="ticket-id">{t.id}</span>
              <div className="ticket-body">
                <div className="tt">{t.title}</div>
                <div className="td">{t.desc}</div>
              </div>
              <div className="ticket-meta">
                {t.risk && <span className="risk-flag">{t.risk}</span>}
                {t.link && <button className="link-tag" onClick={() => navigate(t.link!.to)}>{t.link.label}</button>}
                <span className={`size-tag size-${t.size}`}>{t.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {weeks.map((w) => (
        <div className="week-block" key={w.num} style={w.num === 2 ? { background: '#FBF9F3' } : undefined}>
          <div className="week-title">
            <div className="week-num" style={w.color ? { background: w.color } : undefined}>{w.num}</div>
            <div><div className="wt">{w.title}</div><div className="ws">{w.sub}</div></div>
          </div>
          {w.groups.map((g) => (
            <div className="ticket-group" key={g.label}>
              <div className="tg-label">{g.label}</div>
              {g.tickets.map((t) => (
                <div className="ticket" key={t.id}>
                  <span className="ticket-id">{t.id}</span>
                  <div className="ticket-body">
                    <div className="tt">{t.title}</div>
                    <div className="td">{t.desc}</div>
                  </div>
                  <div className="ticket-meta">
                    {t.risk && <span className="risk-flag">{t.risk}</span>}
                    {t.link && <button className="link-tag" onClick={() => navigate(t.link!.to)}>{t.link.label}</button>}
                    <span className={`size-tag size-${t.size}`}>{t.size}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      <div className="out-block">
        <h3><Icon name="xCircle" size={16} />Fuera de las 3 semanas — v1.1</h3>
        {outMvp.map((o) => (
          <div className="out-item" key={o.id}><span className="oid">{o.id}</span>{o.text}</div>
        ))}
      </div>
    </>
  );
}
