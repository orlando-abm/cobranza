// FB-04 · Plantillas de escritos editables que abre el EscritoEditor (front mock).
// El cuerpo es HTML: el editor lo carga en una hoja tipo Word y permite formatear.

export interface EscritoTemplate {
  id: string;
  title: string;
  body: string;
}

const demanda = `
<h2 style="text-align:center">EN LO PRINCIPAL: Demanda ejecutiva. PRIMER OTROSÍ: Acompaña títulos. SEGUNDO OTROSÍ: Patrocinio y poder.</h2>
<p style="text-align:justify">S.J.L. en lo Civil de Santiago</p>
<p style="text-align:justify"><b>ESTUDIO CID &amp; ASOCIADOS</b>, en representación convencional de <b>Tanner Servicios Financieros S.A.</b>, en autos ejecutivos sobre cobro de pagaré, a US. respetuosamente digo:</p>
<p style="text-align:justify">Que vengo en deducir demanda ejecutiva en contra de <b>[DEUDOR]</b>, cédula de identidad N° <b>[RUT]</b>, domiciliado en <b>[DOMICILIO]</b>, a fin de que se despache mandamiento de ejecución y embargo por la suma de <b>[MONTO]</b>, más intereses y costas, en mérito de los fundamentos de hecho y de derecho que expongo:</p>
<p style="text-align:justify"><b>PRIMERO:</b> Consta del pagaré acompañado, suscrito con fecha [FECHA], que el demandado se obligó a pagar a mi representada la suma indicada en cuotas sucesivas.</p>
<p style="text-align:justify"><b>SEGUNDO:</b> Encontrándose en mora del pago de las cuotas a contar de la N° 13, se ha hecho exigible la totalidad de la obligación conforme a la cláusula de aceleración pactada.</p>
<p style="text-align:justify"><b>POR TANTO,</b> RUEGO A US.: tener por deducida demanda ejecutiva, ordenar se despache mandamiento de ejecución y embargo, y en definitiva acoger la demanda con costas.</p>
`;

const reposicion = `
<h2 style="text-align:center">EN LO PRINCIPAL: Recurso de reposición.</h2>
<p style="text-align:justify">S.J.L. en lo Civil</p>
<p style="text-align:justify"><b>ESTUDIO CID &amp; ASOCIADOS</b>, por la parte demandante, en autos sobre cobro de pagaré, a US. digo:</p>
<p style="text-align:justify">Que, dentro de plazo, vengo en interponer <b>recurso de reposición</b> en contra de la resolución que declaró inadmisible la demanda por un supuesto defecto en el domicilio del deudor, solicitando se deje sin efecto por las siguientes razones:</p>
<p style="text-align:justify"><b>PRIMERO:</b> El domicilio del ejecutado consta del Certificado de Anotaciones Vigentes acompañado, correspondiendo a <b>[DOMICILIO CAV]</b>, el cual se ha rectificado en el cuerpo de la demanda.</p>
<p style="text-align:justify"><b>SEGUNDO:</b> Habiéndose subsanado la observación, no existe obstáculo para proveer la demanda y despachar el mandamiento respectivo.</p>
<p style="text-align:justify"><b>POR TANTO,</b> RUEGO A US.: acoger la reposición, dejar sin efecto la resolución recurrida y proveer derechamente la demanda.</p>
`;

const rectifiquese = `
<h2 style="text-align:center">EN LO PRINCIPAL: Solicita rectificación de mandamiento.</h2>
<p style="text-align:justify">S.J.L. en lo Civil</p>
<p style="text-align:justify"><b>ESTUDIO CID &amp; ASOCIADOS</b>, por la parte ejecutante, a US. digo:</p>
<p style="text-align:justify">Que el mandamiento de ejecución y embargo despachado contiene un error en el <b>monto</b>, consignándose una suma que no corresponde a la demandada. En efecto, la demanda ejecutiva fue por <b>[MONTO CORRECTO]</b> y el mandamiento indica <b>[MONTO ERRADO]</b>.</p>
<p style="text-align:justify"><b>POR TANTO,</b> RUEGO A US.: se sirva rectificar el mandamiento de ejecución y embargo, dejando constancia del monto efectivamente demandado.</p>
`;

const cumple = `
<h2 style="text-align:center">EN LO PRINCIPAL: Cumple lo ordenado.</h2>
<p style="text-align:justify">S.J.L. en lo Civil</p>
<p style="text-align:justify"><b>ESTUDIO CID &amp; ASOCIADOS</b>, por la parte demandante, dando cumplimiento a lo ordenado por US., a fin de subsanar dentro de plazo, digo:</p>
<p style="text-align:justify">Que vengo en ajustar el monto demandado conforme a la liquidación aritmética de las cuotas efectivamente pagadas (de la 1 a la 12), constituyéndose la mora a partir de la cuota N° 13, resultando un saldo insoluto de capital de <b>$10.895.269</b>.</p>
<p style="text-align:justify"><b>POR TANTO,</b> RUEGO A US.: tener por cumplido lo ordenado y proveer la demanda en los términos rectificados.</p>
`;

const certificadoRebeldia = `
<h2 style="text-align:center">EN LO PRINCIPAL: Solicita certificación de no oposición de excepciones.</h2>
<p style="text-align:justify">S.J.L. en lo Civil</p>
<p style="text-align:justify"><b>ESTUDIO CID &amp; ASOCIADOS</b>, por la parte ejecutante, a US. digo:</p>
<p style="text-align:justify">Que, habiéndose requerido de pago al ejecutado con fecha <b>[FECHA REQUERIMIENTO]</b> y transcurrido el término legal de ocho días sin que se hubieren opuesto excepciones, vengo en solicitar se certifique dicha circunstancia.</p>
<p style="text-align:justify"><b>POR TANTO,</b> RUEGO A US.: ordenar al Sr. Secretario certificar la no oposición de excepciones y, en su mérito, se tenga por acreditada la rebeldía para continuar con la ejecución.</p>
`;

const nuevoDomicilio = `
<h2 style="text-align:center">EN LO PRINCIPAL: Solicita notificación en nuevo domicilio.</h2>
<p style="text-align:justify">S.J.L. en lo Civil</p>
<p style="text-align:justify"><b>ESTUDIO CID &amp; ASOCIADOS</b>, por la parte demandante, a US. digo:</p>
<p style="text-align:justify">Que habiéndose informado por el receptor un domicilio distinto del ejecutado, ubicado en <b>[NUEVO DOMICILIO]</b>, vengo en solicitar se practique la notificación en dicha dirección.</p>
<p style="text-align:justify"><b>POR TANTO,</b> RUEGO A US.: ordenar la notificación del ejecutado en el nuevo domicilio individualizado.</p>
`;

const martillero = `
<h2 style="text-align:center">EN LO PRINCIPAL: Designa martillero. PRIMER OTROSÍ: Solicita retiro de especie con auxilio de la fuerza pública.</h2>
<p style="text-align:justify">S.J.L. en lo Civil</p>
<p style="text-align:justify"><b>ESTUDIO CID &amp; ASOCIADOS</b>, por la parte ejecutante, encontrándose inscrito el embargo sobre el vehículo patente <b>[PATENTE]</b>, a US. digo:</p>
<p style="text-align:justify">Que vengo en solicitar la designación de martillero público para proceder a la subasta del bien embargado, y en el primer otrosí el retiro de la especie con auxilio de la fuerza pública.</p>
<p style="text-align:justify"><b>POR TANTO,</b> RUEGO A US.: designar martillero y ordenar el retiro del vehículo embargado con auxilio de la fuerza pública.</p>
`;

const mailEncargo = `
<p><b>Para:</b> receptor/a M. Contreras &nbsp; <b>Asunto:</b> Encargo de embargo · Rol E-1234-2026</p>
<hr/>
<p>Estimado/a receptor/a M. Contreras:</p>
<p style="text-align:justify">Por encargo del <b>Estudio Cid &amp; Asociados</b>, en representación de <b>Tanner Servicios Financieros S.A.</b>, se solicita practicar diligencia de <b>EMBARGO</b> en la siguiente causa:</p>
<p>
  Rol: <b>E-1234-2026</b><br/>
  Tribunal: 2º Juzgado Civil de Santiago<br/>
  Partes: Pérez con Tanner<br/>
  Bien a embargar: Vehículo patente <b>LKTR-42</b><br/>
  Monto: $10.895.269
</p>
<p style="text-align:justify">Pauta Tanner: hasta 2 intentos. Adjunto mandamiento y copia de la notificación efectiva. Favor confirmar recepción y agendar diligencia.</p>
<p>Saludos,<br/>Procurador ProdBooster — Estudio Cid &amp; Asociados</p>
`;

// Esqueleto para escritos que redacta el abogado (traslados/excepciones): el agente
// nunca contesta la defensa por su cuenta (línea roja), solo deja la estructura.
const blank = `
<h2 style="text-align:center">EN LO PRINCIPAL: [Suma del escrito]</h2>
<p style="text-align:justify">S.J.L. en lo Civil</p>
<p style="text-align:justify"><b>ESTUDIO CID &amp; ASOCIADOS</b>, por la parte que represento, a US. digo:</p>
<p style="text-align:justify">[Redacta aquí el escrito. El agente dejó el encabezado y los antecedentes de la causa cargados; el contenido de la defensa lo decides y redactas tú.]</p>
<p style="text-align:justify"><b>POR TANTO,</b> RUEGO A US.: [petición concreta].</p>
`;

export const escritos: Record<string, EscritoTemplate> = {
  blank: { id: 'blank', title: 'Escrito (borrador)', body: blank },
  demanda: { id: 'demanda', title: 'Demanda ejecutiva (borrador)', body: demanda },
  reposicion: { id: 'reposicion', title: 'Recurso de reposición (borrador)', body: reposicion },
  rectifiquese: { id: 'rectifiquese', title: 'Rectifíquese el mandamiento (borrador)', body: rectifiquese },
  cumple: { id: 'cumple', title: 'Cumple lo ordenado (borrador)', body: cumple },
  'certificado-rebeldia': { id: 'certificado-rebeldia', title: 'Certificado de no oposición (borrador)', body: certificadoRebeldia },
  'nuevo-domicilio': { id: 'nuevo-domicilio', title: 'Nuevo domicilio (borrador)', body: nuevoDomicilio },
  martillero: { id: 'martillero', title: 'Designa martillero y retiro (borrador)', body: martillero },
  'mail-encargo': { id: 'mail-encargo', title: 'Mail de encargo al receptor (borrador)', body: mailEncargo },
};

/** Decide si una etiqueta de documento corresponde a un escrito editable; si no, es un PDF de solo lectura. */
export function escritoFor(label: string): EscritoTemplate | null {
  const t = label.toLowerCase();
  if (t.includes('mail') || t.includes('encargo')) return escritos['mail-encargo'];
  if (t.includes('reposic')) return escritos.reposicion;
  if (t.includes('rectif')) return escritos.rectifiquese;
  if (t.includes('cumple')) return escritos.cumple;
  if (t.includes('rebeld') || t.includes('no oposición') || t.includes('no oposicion') || t.includes('certificado')) return escritos['certificado-rebeldia'];
  if (t.includes('martiller') || t.includes('retiro')) return escritos.martillero;
  if (t.includes('domicilio')) return escritos['nuevo-domicilio'];
  if (t.includes('demanda')) return escritos.demanda;
  return null;
}
