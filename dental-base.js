/* =========================================================
   DENTAL — pacientes, odontograma, plan de tratamiento y cuotas
   (se carga después de app.js y reemplaza las vistas de la plantilla)
   ========================================================= */
Object.assign(SVG, {
  paw: '<path d="M7 3c-2.5 0-4 2-4 4.5 0 2 1 3.5 1.5 5.5.6 2.5.8 5.5 2 7.5.8 1.3 2.2 1 2.6-.4l.9-3.6c.3-1.2 1.7-1.2 2 0l.9 3.6c.4 1.4 1.8 1.7 2.6.4 1.2-2 1.4-5 2-7.5.5-2 1.5-3.5 1.5-5.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z"/>',
  tooth: '<path d="M7 3c-2.5 0-4 2-4 4.5 0 2 1 3.5 1.5 5.5.6 2.5.8 5.5 2 7.5.8 1.3 2.2 1 2.6-.4l.9-3.6c.3-1.2 1.7-1.2 2 0l.9 3.6c.4 1.4 1.8 1.7 2.6.4 1.2-2 1.4-5 2-7.5.5-2 1.5-3.5 1.5-5.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
});
const ODO = (window.DATOS && window.DATOS.odonto) || [];
const odoDe = e => ODO.find(x => x.id === e) || ODO[0] || { id: "sano", n: "Sano", c: "#fff" };
const FILAS = { sup: ["18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28"], inf: ["48", "47", "46", "45", "44", "43", "42", "41", "31", "32", "33", "34", "35", "36", "37", "38"],
  supT: ["55", "54", "53", "52", "51", "61", "62", "63", "64", "65"], infT: ["85", "84", "83", "82", "81", "71", "72", "73", "74", "75"] };
const TOOTH_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true">${SVG.tooth}</svg>`;
const edadP = s => { if (!s) return "—"; const m = Math.floor((Date.now() - toD(s)) / (30.44 * 864e5)); return m >= 24 ? `${Math.floor(m / 12)} años` : `${Math.max(m, 0)} meses`; };
const ini2 = n => String(n || "").replace(/^(Dra?\.)\s*/i, "").split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
const avatarP = (m, cls = "av") => `<span class="${cls} pav">${m.foto ? `<img src="${esc(foto(m.foto, 200))}" alt="" onerror="this.remove()">` : esc(ini2(m.nombre))}</span>`;
const S2 = n => "S/ " + (Math.round((+n || 0) * 100) / 100).toFixed(2);
const tieneAlergia = m => m.alergias && !/^ningun/i.test(m.alergias.trim());

/* ---------- Odontograma ---------- */
function odontoHTML(m, editable) {
  const od = m.odontograma || {}, pz = n => { const x = od[n] || {}, s = odoDe(x.e || "sano");
    return `<${editable ? "button type=\"button\"" : "span"} class="pz ${x.e || "sano"}" style="--c:${s.c}" data-pz="${n}" title="Pieza ${n} · ${esc(s.n)}${x.n ? " · " + esc(x.n) : ""}">${TOOTH_SVG}<b>${n}</b>${x.n ? "<em></em>" : ""}</${editable ? "button" : "span"}>`; };
  const fila = (l, cls) => `<div class="odo-row ${cls || ""}"><div>${l.slice(0, l.length / 2).map(pz).join("")}</div><div>${l.slice(l.length / 2).map(pz).join("")}</div></div>`;
  return `<div class="odo-scroll"><div class="odo">${fila(FILAS.sup)}${m.temporal ? fila(FILAS.supT, "temp") + fila(FILAS.infT, "temp") : ""}${fila(FILAS.inf, "low")}</div></div>`;
}
function odontoResumen(m) {
  const od = m.odontograma || {}, usados = [...new Set(Object.values(od).map(x => x.e).filter(e => e && e !== "sano"))];
  const notas = Object.entries(od).filter(([, x]) => x.n || (x.e && x.e !== "sano")).sort((a, b) => a[0].localeCompare(b[0]));
  return `<div class="odo-legend">${(usados.length ? usados : ["sano"]).map(e => `<span><i style="background:${odoDe(e).c}"></i>${esc(odoDe(e).n)} (${Object.values(od).filter(x => x.e === e).length || "todas"})</span>`).join("")}</div>
    ${notas.length ? `<div class="odo-notes">${notas.map(([n, x]) => `<span><b>${n}</b> ${esc(odoDe(x.e).n)}${x.n ? " · " + esc(x.n) : ""}</span>`).join("")}</div>` : ""}`;
}
function odontoEditor() {
  const m = CUR.m, od = JSON.parse(JSON.stringify(m.odontograma || {})); let temporal = !!m.temporal, sel = null;
  const pinta = () => {
    $("#odoEd").innerHTML = odontoHTML({ odontograma: od, temporal }, true);
    if (sel) $(`#odoEd [data-pz="${sel}"]`)?.classList.add("sel");
    const x = sel ? od[sel] || {} : null;
    $("#odoSide").innerHTML = sel ? `<b class="odo-sel">Pieza ${sel}</b>
      <div class="odo-states">${ODO.map(s => `<label><input type="radio" name="odoE" value="${s.id}" ${(x.e || "sano") === s.id ? "checked" : ""}><span><i style="background:${s.c}"></i>${esc(s.n)}</span></label>`).join("")}</div>
      <div class="field"><label>Nota de la pieza (la verá el paciente)</label><input id="odoN" value="${esc(x.n || "")}" placeholder="Ej. Caries en cara oclusal"></div>`
      : `<p class="sub">Toca un diente para marcar su estado: caries, resina, endodoncia, corona, implante…</p>`;
  };
  modal(`Odontograma · ${m.nombre}`, `<div class="odo-ed-top">${fld("temporal", "Mostrar dientes de leche (niños)", temporal, { type: "checkbox" })}<button type="button" class="btn btn-sm ghost" data-odoclear>Todo sano</button></div>
    <div id="odoEd" class="odo-ed"></div><div id="odoSide" class="odo-side"></div>`, async () => {
    Object.keys(od).forEach(k => { if ((!od[k].e || od[k].e === "sano") && !od[k].n) delete od[k]; });
    await DB.saveMascota(CUR.code, CUR.id, { odontograma: od, temporal });
    toast("Odontograma guardado · el paciente ya lo ve en Mi Sonrisa"); refresh();
  }, "Guardar odontograma");
  $(".modal-box").classList.add("wide");
  pinta();
  const M = $("#modalForm");
  const onClick = e => {
    if (!$("#odoEd")) return M.removeEventListener("click", onClick);
    const b = e.target.closest("[data-pz]"); if (b) { sel = b.dataset.pz; pinta(); return; }
    if (e.target.closest("[data-odoclear]")) { Object.keys(od).forEach(k => delete od[k]); sel = null; pinta(); }
  };
  const onChange = e => {
    if (!$("#odoEd")) return M.removeEventListener("change", onChange);
    if (e.target.name === "temporal") { temporal = e.target.checked; pinta(); }
    if (e.target.name === "odoE" && sel) { od[sel] = { ...(od[sel] || {}), e: e.target.value }; const keep = sel; pinta(); sel = keep; }
  };
  const onInput = e => { if (e.target.id === "odoN" && sel) od[sel] = { ...(od[sel] || {}), e: (od[sel] || {}).e || "sano", n: e.target.value.trim() }; };
  M.addEventListener("click", onClick); M.addEventListener("change", onChange); M.addEventListener("input", onInput);
}

/* ---------- Plan de tratamiento / presupuesto ---------- */
const EST_P = { pendiente: ["", "Pendiente"], curso: ["warn", "En curso"], hecho: ["ok", "Hecho"] };
async function planForm(i) {
  const m = CUR.m, plan = m.plan || [], x = i == null ? { pieza: "", t: "", p: "", estado: "pendiente", ses: "", hechas: 0 } : plan[i];
  const sv = ordenar((await DB.listCol("servicios")).length ? await DB.listCol("servicios") : window.DATOS.servicios);
  modal(i == null ? "Agregar al plan de tratamiento" : "Editar tratamiento del plan", `${datalist("trL", sv.map(s => s.n))}<div class="grid2">
    ${fld("t", "Tratamiento", x.t, { req: true, full: true, list: "trL", ph: "Escribe o elige (ej. Curación con resina)" })}
    ${fld("pieza", "Pieza(s)", x.pieza, { ph: "Ej. 26 · o 16·26 · vacío si es general" })}
    ${fld("p", "Precio (S/)", x.p, { req: true, type: "number", extra: 'min="0" step="0.5"' })}
    ${fld("ses", "Sesiones (opcional)", x.ses, { type: "number", ph: "Ej. 3 · o 24 controles", extra: 'min="0" step="1"' })}
    ${fld("hechas", "Sesiones hechas", x.hechas || 0, { type: "number", extra: 'min="0" step="1"' })}
    ${fld("estado", "Estado", x.estado || "pendiente", { opts: [["pendiente", "Pendiente"], ["curso", "En curso"], ["hecho", "Hecho"]] })}
  </div>`, async d => {
    const it = { id: x.id || uid(), t: d.t, pieza: d.pieza, p: r2(d.p), ses: Math.max(0, Math.round(+d.ses || 0)), hechas: Math.max(0, Math.round(+d.hechas || 0)), estado: d.estado };
    if (it.ses && it.hechas >= it.ses) it.estado = "hecho";
    const l = plan.slice(); if (i == null) l.push(it); else l[i] = it;
    await DB.saveMascota(CUR.code, CUR.id, { plan: l }); toast("Plan actualizado"); refresh();
  }, "Guardar");
  const tIn = $("#modalForm [name=t]");
  tIn.addEventListener("change", () => { const s = sv.find(z => z.n === tIn.value); if (s && !$("#modalForm [name=p]").value) $("#modalForm [name=p]").value = s.p || ""; });
}
function presupuestoData() {
  const m = CUR.m, c = CUR.cliente, l = (m.plan || []).filter(x => x.estado !== "hecho");
  return { m, c, l, total: r2(l.reduce((a, x) => a + (+x.p || 0), 0)) };
}
async function presupuestoWA() {
  const { m, c, l, total } = presupuestoData(); if (!l.length) return toast("No hay tratamientos pendientes en el plan", true);
  const L = [`Hola ${String(c.dueno).split(" ")[0]}, te saluda *${NOMBRE_V}*.`, "", `🦷 *Presupuesto de tratamiento · ${m.nombre}*`, ""];
  l.forEach((x, i) => L.push(`${i + 1}. ${x.t}${x.pieza ? " (pieza " + x.pieza + ")" : ""}: ${S2(x.p)}${x.ses ? ` · ${x.ses} sesiones` : ""}`));
  L.push("", `*Total: ${S2(total)}*`, "Puedes pagarlo en cuotas sin intereses. Este presupuesto es válido por 30 días.", "", `Revisa tu plan y tu odontograma en Mi Sonrisa con tu código *${CUR.code}*:`, portalLink(CUR.code));
  openWA(c.celular, L.join("\n"));
}
async function presupuestoPDF() {
  const { m, c, l, total } = presupuestoData(); if (!l.length) return toast("No hay tratamientos pendientes en el plan", true);
  const aj = await cargarAjustes(); if (typeof MARCA !== "undefined" && !MARCA.nombre1) await cargarMarca();
  await safe(() => PDFV.recibo({ neg: negocio(aj), titulo: "PRESUPUESTO", num: PDFV.num("P", todayISO(), CUR.code + CUR.id + l.length + total), fecha: todayISO(), cliente: c.dueno, code: CUR.code, mascota: m.nombre, etqMascota: "Paciente",
    detalle: "Válido por 30 días", items: l.map(x => ({ n: x.t + (x.pieza ? ` · pieza ${x.pieza}` : "") + (x.ses ? ` · ${x.ses} sesiones` : ""), q: 1, p: +x.p || 0 })), total, pagos: [], pagado: 0, saldo: total,
    presupuesto: true, archivo: `Presupuesto-${m.nombre}` }));
}

/* ---------- Financiamiento en cuotas ---------- */
function finEstado(f) {
  const pag = r2((f.pagos || []).reduce((a, p) => a + (+p.monto || 0), 0)), saldo = r2(Math.max((+f.total || 0) - pag, 0)), cuotas = (f.pagos || []).filter(p => p.tipo === "cuota").length;
  const ini = toD(f.inicio) || toD(todayISO()), venc = new Date(ini.getFullYear(), ini.getMonth() + cuotas + 1, Math.min(+f.dia || ini.getDate(), 28));
  const vencISO = `${venc.getFullYear()}-${String(venc.getMonth() + 1).padStart(2, "0")}-${String(venc.getDate()).padStart(2, "0")}`;
  return { pag, saldo, cuotas, venc: vencISO, dias: diff(vencISO), prox: r2(Math.min(+f.monto || 0, saldo)) };
}
function finForm() {
  const pd = presupuestoData(), sug = pd.total || "";
  modal("Pago en cuotas", `<p class="sub" style="margin-bottom:12px">${esc(CUR.m.nombre)} · el paciente verá sus cuotas en Mi Sonrisa y recibirás recordatorios cuando venzan.</p><div class="grid2">
    ${fld("t", "Tratamiento", pd.l.length === 1 ? pd.l[0].t : (pd.l[0] || {}).t || "", { req: true, full: true, ph: "Ej. Ortodoncia con brackets" })}
    ${fld("total", "Precio total (S/)", sug, { req: true, type: "number", extra: 'min="1" step="0.5"' })}
    ${fld("inicial", "Cuota inicial (S/)", "", { type: "number", ph: "0 si no hay", extra: 'min="0" step="0.5"' })}
    ${fld("n", "Número de cuotas", 10, { req: true, type: "number", extra: 'min="1" max="60" step="1"' })}
    ${fld("dia", "Día de pago de cada mes", Math.min(new Date().getDate(), 28), { type: "number", extra: 'min="1" max="28" step="1"' })}
    ${fld("metodo", "Forma de pago de la inicial", "Efectivo", { opts: MET })}
    <div class="field full"><div class="cargo-sum" id="finSum"></div></div>
  </div>`, async d => {
    const total = r2(d.total), inicial = r2(d.inicial || 0), n = Math.max(1, Math.round(+d.n || 1));
    if (inicial > total) { toast("La inicial no puede ser mayor al total", true); return false; }
    const f = { id: uid(), t: d.t, total, inicial, n, monto: r2((total - inicial) / n), dia: Math.min(28, Math.max(1, Math.round(+d.dia || 1))), inicio: todayISO(), pagos: [] };
    if (inicial > 0) { f.pagos.push({ tipo: "inicial", monto: inicial, fecha: todayISO(), metodo: d.metodo }); await movCuota(f, inicial, d.metodo, "Cuota inicial"); }
    await DB.saveMascota(CUR.code, CUR.id, { financ: [...(CUR.m.financ || []), f] });
    toast(`Plan de ${n} cuotas de ${S2(f.monto)} creado`); refresh();
  }, "Crear plan de cuotas");
  const M = $("#modalForm"), calc = () => { const g = k => +($(`[name=${k}]`, M).value || 0), q = Math.max(1, Math.round(g("n") || 1)), c = r2((g("total") - g("inicial")) / q);
    $("#finSum").innerHTML = `<div><span>Inicial</span><b>${S2(g("inicial"))}</b></div><div class="tot"><span>${q} cuotas de</span><b>${S2(c > 0 ? c : 0)}</b></div>`; };
  M.addEventListener("input", function h() { if (!$("#finSum")) return M.removeEventListener("input", h); calc(); }); calc();
}
async function movCuota(f, monto, metodo, etq) {
  await DB.saveDocCol("movimientos", null, { fecha: todayISO(), hora: nowHM(), tipo: "servicio", concepto: `${etq} · ${f.t} – ${CUR.m.nombre}`, total: monto, metodo,
    items: [{ tipo: "servicio", n: `${etq} · ${f.t}`, q: 1, p: monto }], code: CUR.code, cliente: CUR.cliente.dueno, anulado: false });
}
function cuotaForm(fi) {
  const l = CUR.m.financ || [], f = l[fi], e = finEstado(f);
  modal("Registrar pago de cuota", `<p class="sub" style="margin-bottom:12px">${esc(f.t)} · cuota ${e.cuotas + 1} de ${f.n} · saldo ${S2(e.saldo)}</p><div class="grid2">
    ${fld("monto", "Monto (S/)", e.prox, { req: true, type: "number", extra: 'min="0.1" step="0.1"' })}
    ${fld("metodo", "Forma de pago", "Efectivo", { opts: MET })}
    ${fld("enviar", "Enviar comprobante por WhatsApp", true, { type: "checkbox", full: true })}</div>`, async d => {
    const monto = r2(d.monto); if (!(monto > 0)) { toast("Monto no válido", true); return false; }
    f.pagos = [...(f.pagos || []), { tipo: "cuota", monto, fecha: todayISO(), hora: nowHM(), metodo: d.metodo }];
    await movCuota(f, monto, d.metodo, `Cuota ${e.cuotas + 1}/${f.n}`);
    await DB.saveMascota(CUR.code, CUR.id, { financ: l });
    const ne = finEstado(f); toast("Cuota registrada en caja");
    if (d.enviar) openWA(CUR.cliente.celular, `Hola ${String(CUR.cliente.dueno).split(" ")[0]}, te saluda *${NOMBRE_V}*.\n\n✅ Recibimos tu pago de *${S2(monto)}* (${d.metodo}) · cuota ${e.cuotas + 1} de ${f.n} de *${f.t}*.\n\nPagado: ${S2(ne.pag)} · Saldo: *${S2(ne.saldo)}*${ne.saldo > 0 ? `\nPróxima cuota: ${S2(ne.prox)} el ${fmt(ne.venc)}` : "\n¡Tratamiento pagado por completo! 🎉"}\n\nRevisa tus cuotas en Mi Sonrisa: ${portalLink(CUR.code)}`);
    refresh();
  }, "Registrar pago");
}
function msgCuota(f, m, c) {
  const e = finEstado(f);
  return `Hola ${String(c.dueno || "").split(" ")[0]}, te saluda *${NOMBRE_V}* 🦷\n\nTe recordamos tu cuota ${e.cuotas + 1} de ${f.n} de *${f.t}*${m ? " (" + m.nombre + ")" : ""}: *${S2(e.prox)}*, ${e.dias < 0 ? `venció el ${fmt(e.venc)}` : e.dias === 0 ? "vence *hoy*" : `vence el ${fmt(e.venc)}`}.\n\nPuedes pagar por Yape, Plin, transferencia o en el consultorio.\nSaldo total: ${S2(e.saldo)}\n\nTus cuotas en Mi Sonrisa: ${portalLink(c.codigo || CUR.code)}`;
}

/* ---------- Vistas: pacientes ---------- */
Object.assign(VIEWS, {
  async clientes() {
    const cl = (await DB.listClientes()).sort((a, b) => (b.creado || "").localeCompare(a.creado || ""));
    $("#view").innerHTML = topBar("Pacientes", `${cl.length} familia${cl.length === 1 ? "" : "s"} / titular${cl.length === 1 ? "" : "es"} con código`, `<button class="btn btn-pri" data-new-client>${ico("plus")} Nuevo paciente</button>`) + `
      <div class="card">
        <div class="card-h"><label class="search">${ico("search")}<input id="cSearch" type="search" placeholder="Buscar por código, nombre o celular"></label></div>
        <div class="table-wrap"><table><thead><tr><th>Código</th><th>Titular</th><th class="hide-m">Celular</th><th>Pacientes</th><th></th></tr></thead><tbody id="cBody"></tbody></table></div>
      </div>`;
    const draw = q => {
      const l = cl.filter(c => (c.codigo + " " + c.dueno + " " + c.celular).toLowerCase().includes(q));
      $("#cBody").innerHTML = l.length ? l.map(c => `<tr class="click" data-client="${esc(c.codigo)}"><td><span class="code">${esc(c.codigo)}</span></td><td><b>${esc(c.dueno)}</b></td><td class="hide-m">${esc(c.celular)}</td><td>${c.nMascotas}</td><td style="text-align:right">${ico("eye")}</td></tr>`).join("")
        : `<tr><td colspan="5" class="empty">${cl.length ? "No hay resultados." : "Aún no hay pacientes. Crea el primero con «Nuevo paciente»."}</td></tr>`;
    };
    $("#cSearch").addEventListener("input", e => draw(e.target.value.trim().toLowerCase())); draw("");
  },
  async cliente({ code }) {
    const [c, ms] = await Promise.all([DB.getCliente(code), DB.listMascotas(code)]);
    if (!c) { go("clientes"); return toast("Paciente no encontrado", true); }
    $("#view").innerHTML = topBar(esc(c.dueno), "Titular del código · puede incluir a su familia", `<button class="btn btn-light" data-edit-client>${ico("edit")} Editar</button><button class="btn btn-danger" data-del-client>${ico("trash")}<span class="hide-m">Eliminar</span></button>`,
      `<div class="crumb"><button data-goto="clientes">Pacientes</button> / ${esc(code)}</div>`) + `
      <div class="card client-head">
        <div>
          <div class="info-row"><span>${ico("phone")} ${esc(c.celular)}</span>${c.email ? `<span>${ico("mail")} ${esc(c.email)}</span>` : ""}${c.direccion ? `<span>${ico("pin")} ${esc(c.direccion)}</span>` : ""}</div>
          ${c.notas ? `<p style="margin-top:10px;color:var(--muted)"><b>Notas:</b> ${esc(c.notas)}</p>` : ""}
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
            <button class="btn btn-wa btn-sm" data-send-code>${ico("wa")} Enviar código por WhatsApp</button>
            <button class="btn btn-wa btn-sm" data-send-citas="${esc(code)}">${ico("cal")} Enviar citas por WhatsApp</button>
            <button class="btn btn-light btn-sm" data-cita-cliente="${esc(code)}">${ico("plus")} Agendar cita</button>
            <a class="btn btn-light btn-sm" href="${esc(portalLink(code))}" target="_blank" rel="noopener">${ico("eye")} Ver Mi Sonrisa</a>
          </div>
        </div>
        <div class="code-big"><small>CÓDIGO DE PACIENTE</small><b>${esc(code)}</b><div class="row"><button class="btn btn-sm" data-copy="${esc(code)}">${ico("copy")} Copiar</button></div></div>
      </div>
      <div class="card"><div class="card-h"><h2>${ico("users")} Pacientes de este código</h2><small class="sub">El titular y sus familiares (hijos, pareja…)</small></div>
        <div class="pets">
          ${ms.map(m => { const pend = (m.plan || []).filter(x => x.estado !== "hecho").length, fin = (m.financ || []).find(f => finEstado(f).saldo > 0);
            return `<button class="pet pac" data-pet="${esc(m.id)}"><div class="pet-img">${avatarP(m, "pac-big")}</div>
            <div class="pet-b"><b>${esc(m.nombre)}</b><small>${edadP(m.nac)}${m.dni ? " · DNI " + esc(m.dni) : ""}</small><br>
            ${tieneAlergia(m) ? `<span class="st bad">Alergia: ${esc(m.alergias)}</span>` : ""}${pend ? `<span class="st warn">${pend} tratamiento${pend > 1 ? "s" : ""} pendiente${pend > 1 ? "s" : ""}</span>` : `<span class="st ok">Plan al día</span>`}${fin ? `<span class="st info">Cuotas: debe ${S2(finEstado(fin).saldo)}</span>` : ""}</div></button>`; }).join("")}
          <button class="pet add" data-new-pet><div>${ico("plus")}Agregar paciente</div></button>
        </div>
      </div>`;
    CUR.cliente = c; CUR.mascotas = ms;
  },
  async mascota({ code, id }) {
    const [c, m] = await Promise.all([DB.getCliente(code), DB.getMascota(code, id)]);
    if (!m) { go("cliente", { code }); return; }
    CUR.cliente = c; CUR.m = m;
    const his = (m.historial || []).slice().sort((a, b) => b.f.localeCompare(a.f));
    const rec = (m.rec || []).slice().sort((a, b) => a.f.localeCompare(b.f));
    const plan = m.plan || [], tot = plan.reduce((a, x) => a + (+x.p || 0), 0), pend = plan.filter(x => x.estado !== "hecho"), totPend = pend.reduce((a, x) => a + (+x.p || 0), 0);
    $("#view").innerHTML = topBar(esc(m.nombre), `${edadP(m.nac)}${m.sexo ? " · " + esc(m.sexo) : ""} · Titular: ${esc(c.dueno)}`,
      `<button class="btn btn-light" data-edit-pet>${ico("edit")} Editar datos</button><button class="btn btn-danger" data-del-pet>${ico("trash")}</button>`,
      `<div class="crumb"><button data-goto="clientes">Pacientes</button> / <button data-client="${esc(code)}">${esc(code)}</button> / ${esc(m.nombre)}</div>`) + `
      ${tieneAlergia(m) ? `<div class="alergia-bar">${ico("alert")} <b>ALERGIA:</b> ${esc(m.alergias)} — revisar antes de anestesia o recetas.</div>` : ""}
      <div class="ficha">
        <div>
          <div class="card">
            <div class="pac-head">${avatarP(m, "pac-xl")}<div><b>${esc(m.nombre)}</b><small>${esc(code)}</small></div></div>
            <div class="facts">
              <div><small>Edad</small><b>${edadP(m.nac)}</b></div><div><small>Sexo</small><b>${esc(m.sexo || "—")}</b></div>
              <div><small>DNI</small><b>${esc(m.dni || "—")}</b></div><div><small>Nacimiento</small><b>${fmt(m.nac)}</b></div>
              <div class="full"><small>Enfermedades</small><b>${esc(m.enfermedades || "Ninguna registrada")}</b></div>
              <div class="full"><small>Medicamentos que toma</small><b>${esc(m.medicamentos || "Ninguno")}</b></div>
            </div>
            <a class="btn btn-light btn-sm" style="width:100%" href="${esc(portalLink(code))}" target="_blank" rel="noopener">${ico("eye")} Ver como lo ve el paciente</a>
          </div>
          <div class="card"><div class="card-h"><h2>${ico("card")} Cuotas</h2><button class="btn btn-light btn-sm" data-fin-new>${ico("plus")} Plan de cuotas</button></div>
            ${(m.financ || []).map((f, i) => { const e = finEstado(f), pct = f.total ? Math.round(e.pag / f.total * 100) : 0;
              return `<div class="fin" data-fi="${i}"><div class="fin-h"><b>${esc(f.t)}</b><button class="icon-btn" data-fin-del title="Eliminar plan">${ico("trash")}</button></div>
                <span class="bar big"><i style="width:${pct}%"></i></span>
                <div class="fin-g"><div><small>Total</small><b>${S2(f.total)}</b></div><div><small>Pagado</small><b>${S2(e.pag)}</b></div><div><small>Saldo</small><b class="${e.saldo ? "c-red" : ""}">${S2(e.saldo)}</b></div></div>
                ${e.saldo > 0 ? `<p class="fin-next ${e.dias < 0 ? "late" : e.dias <= 5 ? "soon" : ""}">Cuota ${e.cuotas + 1} de ${f.n}: <b>${S2(e.prox)}</b> · ${e.dias < 0 ? "venció " : "vence "}${fmtD(e.venc)}${f.avisado ? ` · avisado ${fmtD(f.avisado)}` : ""}</p>
                  <div class="acts"><button class="btn btn-pri btn-sm" data-fin-pay>${ic2("cash")} Registrar cuota</button><button class="btn btn-wa btn-sm" data-fin-wa>${ico("wa")} Recordar</button></div>` : `<p class="fin-next ok">Pagado por completo ✓</p>`}</div>`; }).join("") || `<p class="empty">Sin cuotas. Úsalas para ortodoncia, implantes o tratamientos largos.</p>`}
          </div>
        </div>
        <div>
          <div class="card"><div class="card-h"><h2>${ico("cal")} Citas</h2><button class="btn btn-pri btn-sm" data-cita>${ico("plus")} Agendar cita</button></div><p class="empty">Cargando…</p></div>
          <div class="card"><div class="card-h"><h2>${ico("tooth")} Odontograma</h2><button class="btn btn-pri btn-sm" data-odo-edit>${ico("edit")} Editar odontograma</button></div>
            <div class="odo-view">${odontoHTML(m, false)}</div>${odontoResumen(m)}</div>
          <div class="card"><div class="card-h"><h2>${ico("list")} Plan de tratamiento y presupuesto</h2><button class="btn btn-light btn-sm" data-plan-new>${ico("plus")} Agregar</button></div>
            ${plan.length ? `<div class="plan-sum"><div><b>${plan.length - pend.length} de ${plan.length}</b><small>listos</small></div><span class="bar big"><i style="width:${Math.round((plan.length - pend.length) / plan.length * 100)}%"></i></span><div><b>${S2(totPend)}</b><small>pendiente de ${S2(tot)}</small></div></div>
            <div class="plan-list">${plan.map((x, i) => `<div class="pl ${x.estado}" data-pi="${i}"><span class="pl-pz">${esc(x.pieza || "—")}</span><div><b>${esc(x.t)}</b>${x.ses ? `<small>Sesión ${+x.hechas || 0} de ${x.ses}</small><span class="bar"><i style="width:${Math.round((+x.hechas || 0) / x.ses * 100)}%"></i></span>` : ""}</div><b class="pl-p">${S2(x.p)}</b>
              <button class="st ${EST_P[x.estado || "pendiente"][0]} st-btn" data-plan-st title="Cambiar estado">${EST_P[x.estado || "pendiente"][1]}</button>
              <div class="acts">${x.ses && x.estado !== "hecho" ? `<button class="icon-btn" data-plan-ses title="+1 sesión">+1</button>` : ""}<button class="icon-btn edit" data-plan-edit>${ico("edit")}</button><button class="icon-btn" data-plan-del>${ico("trash")}</button></div></div>`).join("")}</div>
            <div class="acts" style="margin-top:12px;flex-wrap:wrap"><button class="btn btn-wa btn-sm" data-pres-wa>${ico("wa")} Enviar presupuesto</button><button class="btn btn-light btn-sm" data-pres-pdf>${ico("file")} Presupuesto PDF</button><button class="btn btn-light btn-sm" data-fin-new>${ico("card")} Pasar a cuotas</button></div>`
            : `<p class="empty">Agrega los tratamientos que necesita (ej. resina en 26, endodoncia en 36). Puedes enviarlo como presupuesto por WhatsApp o PDF.</p>`}
          </div>
          <div class="card"><div class="card-h"><h2>${ico("history")} Historial clínico</h2><button class="btn btn-light btn-sm" data-add-his>${ico("plus")} Registrar atención</button></div>
            ${his.length ? `<ul class="tl">${his.map(x => `<li><div><span class="d">${fmt(x.f)}${x.hora ? " · " + esc(x.hora) + " h" : ""}${+x.monto ? ` · <b class="money">${S2(x.monto)}</b>${+x.pagado < +x.monto ? ` <span class="st warn">Saldo ${S2(+x.monto - (+x.pagado || 0))}</span>` : ` <span class="st ok">Pagado</span>`}` : ""}</span><b>${esc(x.t)}</b>${x.piezas ? `<p><b>Piezas:</b> ${esc(x.piezas)}</p>` : ""}${x.d ? `<p><b>Diagnóstico:</b> ${esc(x.d)}</p>` : ""}${(x.meds || []).length ? `<ul class="rx">${x.meds.map(r => `<li>${esc(r.n)}${r.dosis ? " – " + esc(r.dosis) : ""}${r.cada ? ", cada " + esc(r.cada) : ""}${r.dias ? ", " + esc(r.dias) + " días" : ""}</li>`).join("")}</ul>` : ""}${x.ind ? `<p><b>Indicaciones:</b> ${esc(x.ind)}</p>` : ""}<span class="v">${esc(x.vet || "")}</span></div><button class="icon-btn" data-del-item="historial" data-id="${esc(x.id)}" aria-label="Eliminar">${ico("trash")}</button></li>`).join("")}</ul>` : `<p class="empty">Sin atenciones registradas.</p>`}</div>
          <div class="card"><div class="card-h"><h2>${ico("bell")} Recordatorios para el paciente</h2><button class="btn btn-light btn-sm" data-add-rec>${ico("plus")} Recordatorio</button></div>
            <div class="list">${rec.length ? rec.map(r => `<div class="li"><div><b>${esc(r.t)}</b><small>${fmt(r.f)} · ${enDias(diff(r.f))}</small></div><button class="icon-btn" data-del-item="rec" data-id="${esc(r.id)}" aria-label="Eliminar">${ico("trash")}</button></div>`).join("") : `<p class="empty">Sin recordatorios.</p>`}</div></div>
        </div>
      </div>`;
  },
});

/* ---------- Formularios de titular y paciente ---------- */
clientForm = function (c = {}, isNew) {   // eslint-disable-line no-global-assign
  modal(isNew ? "Nuevo paciente" : "Editar titular", `
    ${isNew ? `<p style="color:var(--muted);margin-bottom:16px;font-size:.9rem">Se generará un <b>código único</b> para entrar a Mi Sonrisa. Después podrás agregar a su familia (hijos, pareja) en el mismo código.</p>` : ""}
    <div class="grid2">
      ${fld("dueno", isNew ? "Nombre y apellido del paciente (titular)" : "Nombre del titular", c.dueno, { req: true, full: true, ph: "Ej. María López" })}
      ${fld("celular", "Celular (WhatsApp)", c.celular, { req: true, type: "tel", ph: "987654321" })}
      ${fld("email", "Correo", c.email, { type: "email", ph: "opcional" })}
      ${isNew ? `${fld("dni", "DNI", "", { ph: "opcional" })}${fld("nac", "Fecha de nacimiento", "", { type: "date" })}${fld("alergias", "Alergias", "", { ph: "Ej. Penicilina · Ninguna" })}${fld("enfermedades", "Enfermedades", "", { ph: "Ej. Diabetes, hipertensión, embarazo" })}` : ""}
      ${fld("direccion", "Dirección", c.direccion, { full: true, ph: "opcional" })}
      ${fld("notas", "Notas internas", c.notas, { type: "textarea", full: true, ph: "Solo las ve el personal (no aparece en la web)" })}
    </div>`, async d => {
      if (d.celular.replace(/\D/g, "").length < 9) { toast("El celular debe tener al menos 9 dígitos", true); return false; }
      if (isNew) {
        const { dni, nac, alergias, enfermedades, ...cl } = d;
        const code = await DB.nuevoCodigo(); await DB.saveCliente(code, cl);
        const id = await DB.saveMascota(code, null, { nombre: d.dueno, dni, nac, alergias: alergias || "Ninguna", enfermedades, medicamentos: "", sexo: "", historial: [], rec: [], plan: [], financ: [], odontograma: {} });
        toast("Paciente creado · Código " + code); go("mascota", { code, id });
      } else { await DB.saveCliente(CUR.code, d); toast("Titular actualizado"); refresh(); }
    }, isNew ? "Crear y generar código" : "Guardar");
};
petForm = function (m = {}) {   // eslint-disable-line no-global-assign
  const isNew = !m.id;
  modal(isNew ? "Agregar paciente al código" : "Datos del paciente", `
    <div class="photo-up"><span class="prev" id="pPrev">${m.foto ? `<img src="${esc(foto(m.foto, 200))}" alt="">` : ico("camera")}</span>
      <div><label class="btn btn-light btn-sm" for="pFile">${ico("camera")} ${m.foto ? "Cambiar foto" : "Foto (opcional)"}</label><input type="file" id="pFile" accept="image/*"><small>Se reduce automáticamente.</small></div>
      <input type="hidden" name="foto" value="${esc(m.foto || "")}"></div>
    <div class="grid2">
      ${fld("nombre", "Nombre y apellido", m.nombre, { req: true, ph: "Ej. Mateo López" })}
      ${fld("dni", "DNI", m.dni, { ph: "opcional" })}
      ${fld("nac", "Fecha de nacimiento", m.nac, { type: "date" })}
      ${fld("sexo", "Sexo", m.sexo || "", { opts: [["", "—"], "Femenino", "Masculino"] })}
      ${fld("alergias", "Alergias", m.alergias, { ph: "Ej. Penicilina, látex, anestesia · Ninguna" })}
      ${fld("enfermedades", "Enfermedades", m.enfermedades, { ph: "Ej. Diabetes, hipertensión, embarazo" })}
      ${fld("medicamentos", "Medicamentos que toma", m.medicamentos, { full: true, ph: "Ej. Anticoagulantes" })}
      ${fld("temporal", "Tiene dientes de leche (niño)", !!m.temporal, { type: "checkbox", full: true, ph: "Muestra los dientes de leche en el odontograma" })}
    </div>`, async d => {
      const code = CUR.code, base = isNew ? { historial: [], rec: [], plan: [], financ: [], odontograma: {} } : {};
      const id = await DB.saveMascota(code, m.id || null, { ...base, ...d, temporal: !!d.temporal });
      toast(isNew ? "Paciente agregado" : "Datos actualizados"); go("mascota", { code, id });
    }, isNew ? "Agregar paciente" : "Guardar");
  $("#pFile").addEventListener("change", async e => { const f = e.target.files[0]; if (!f) return; const data = await resizeImage(f, 300, .8); $("[name=foto]").value = data; $("#pPrev").innerHTML = `<img src="${data}" alt="">`; });
};
hisForm = function () {   // eslint-disable-line no-global-assign
  const svs = (window.DATOS.servicios || []).map(s => s.n);
  modal("Registrar atención", `${datalist("svcL", svs)}<div class="grid2">
    ${fld("f", "Fecha", todayISO(), { req: true, type: "date" })}
    ${fld("vet", "Atendido por", "", { opts: (typeof DOCS !== "undefined" && DOCS.length ? DOCS : window.DATOS.doctores || []).map(x => x.n) })}
    ${fld("t", "Atención / procedimiento", "", { req: true, full: true, list: "svcL", ph: "Ej. Limpieza dental" })}
    ${fld("piezas", "Piezas tratadas", "", { ph: "Ej. 26 · 36" })}
    ${fld("d", "Diagnóstico e indicaciones (lo verá el paciente)", "", { type: "textarea", full: true })}
  </div>`, async d => { await petUpdate({ historial: [...(CUR.m.historial || []), { id: uid(), ...d }] }, "Atención registrada"); });
};
recForm = function () {   // eslint-disable-line no-global-assign
  modal("Nuevo recordatorio", `<div class="grid2">
    ${fld("t", "Recordatorio", "", { req: true, full: true, ph: "Ej. Limpieza dental, control de ortodoncia" })}
    ${fld("f", "Fecha", addDays(todayISO(), 180), { req: true, type: "date" })}
    ${fld("i", "Ícono", "clean", { opts: [["clean", "Limpieza"], ["tooth", "Control dental"], ["brace", "Ortodoncia"], ["card", "Cuota"], ["kid", "Niños"], ["pill", "Medicamento"]] })}
  </div>`, d => petUpdate({ rec: [...(CUR.m.rec || []), { id: uid(), ...d }] }, "Recordatorio agregado"));
};

/* ---------- Recordatorios (reemplaza Vacunas) ---------- */
const avisadoR = f => f && diff(f) >= -10;
async function recordatoriosData() {
  const ms = await DB.allMascotas(), hoy = todayISO(), out = { cuotas: [], controles: [], limpieza: [] };
  ms.forEach(m => {
    (m.financ || []).forEach((f, fi) => { const e = finEstado(f); if (e.saldo > 0 && e.dias <= 7) out.cuotas.push({ m, f, fi, e }); });
    (m.rec || []).forEach(r => { const d = diff(r.f); if (d >= -14 && d <= 7) out.controles.push({ m, r }); });
    const lim = (m.historial || []).filter(h => /limpieza|profilaxis/i.test(h.t)).sort((a, b) => b.f.localeCompare(a.f))[0];
    if (lim && diff(lim.f) <= -180) out.limpieza.push({ m, lim, avisado: m.avisoLimpieza });
  });
  out.cuotas.sort((a, b) => a.e.dias - b.e.dias); out.controles.sort((a, b) => a.r.f.localeCompare(b.r.f)); void hoy;
  out.porAvisar = out.cuotas.filter(x => !avisadoR(x.f.avisado)).length + out.controles.filter(x => !avisadoR(x.r.avisado)).length + out.limpieza.filter(x => !avisadoR(x.avisado)).length;
  return out;
}
VIEWS.vacunas = async () => {
  const R = await recordatoriosData();
  const fila = (m, txt, sub, btn, av) => `<div class="li" data-pet="${esc(m.id)}" data-code="${esc(m.code)}" style="cursor:pointer">${avatarP(m)}<div><b>${esc(m.nombre)} · ${txt}</b><small>${esc(m.dueno)}${m.celular ? " · " + esc(m.celular) : ""} · ${sub}</small></div>
    ${avisadoR(av) ? `<span class="st ok">Avisado ✓ ${fmtD(av)}</span>` : ""}<button class="btn ${avisadoR(av) ? "btn-light" : "btn-wa"} btn-sm" ${btn}>${ico("wa")}<span class="hide-m">${avisadoR(av) ? "Otra vez" : "Avisar"}</span></button></div>`;
  $("#view").innerHTML = topBar("Recordatorios", "Cuotas por vencer, controles y limpiezas pendientes. Avisa por WhatsApp con un clic y queda marcado.") + `
    <div class="stats">
      <div class="stat"><i>${ico("card")}</i><div><b>${R.cuotas.length}</b><span>Cuotas por vencer o vencidas</span></div></div>
      <div class="stat"><i>${ico("cal")}</i><div><b>${R.controles.length}</b><span>Controles próximos</span></div></div>
      <div class="stat"><i>${ico("tooth")}</i><div><b>${R.limpieza.length}</b><span>Limpieza pendiente (+6 meses)</span></div></div>
      <div class="stat hl"><i>${ico("wa")}</i><div><b>${R.porAvisar}</b><span>Por avisar</span></div></div>
    </div>
    <div class="card"><div class="card-h"><h2>${ico("card")} Cuotas</h2></div><div class="list">${R.cuotas.map(x => fila(x.m, esc(x.f.t), `cuota ${x.e.cuotas + 1}/${x.f.n} · ${S2(x.e.prox)} · ${x.e.dias < 0 ? "venció " : "vence "}${fmtD(x.e.venc)}`, `data-rc-cuota="${x.fi}"`, x.f.avisado)).join("") || `<p class="empty">No hay cuotas por vencer esta semana.</p>`}</div></div>
    <div class="card"><div class="card-h"><h2>${ico("cal")} Controles y recordatorios</h2></div><div class="list">${R.controles.map(x => fila(x.m, esc(x.r.t), `${fmtD(x.r.f)} · ${enDias(diff(x.r.f))}`, `data-rc-rec="${esc(x.r.id)}"`, x.r.avisado)).join("") || `<p class="empty">Nada para esta semana.</p>`}</div></div>
    <div class="card"><div class="card-h"><h2>${ico("tooth")} Toca limpieza dental</h2></div><div class="list">${R.limpieza.map(x => fila(x.m, "Limpieza dental", `última: ${fmt(x.lim.f)}`, `data-rc-lim="1"`, x.avisado)).join("") || `<p class="empty">Todos tienen su limpieza al día.</p>`}</div></div>`;
};

/* ---------- Clics ---------- */
document.addEventListener("click", async e => {
  const t = e.target.closest("button"); if (!t || !$("#view").contains(t)) return;
  // recordatorios por WhatsApp
  if (t.matches("[data-rc-cuota], [data-rc-rec], [data-rc-lim]")) {
    e.stopPropagation();
    const row = t.closest("[data-pet]"), code = row.dataset.code, id = row.dataset.pet, [c, m] = await Promise.all([DB.getCliente(code), DB.getMascota(code, id)]);
    if (t.dataset.rcCuota != null) { const f = m.financ[+t.dataset.rcCuota]; openWA(c.celular, msgCuota(f, m.nombre !== c.dueno ? m : null, c)); f.avisado = todayISO(); await DB.saveMascota(code, id, { financ: m.financ }); }
    if (t.dataset.rcRec) { const r = (m.rec || []).find(x => x.id === t.dataset.rcRec); openWA(c.celular, `Hola ${String(c.dueno).split(" ")[0]}, te saluda *${NOMBRE_V}* 🦷\n\nTe recordamos: *${r.t}*${m.nombre !== c.dueno ? " de " + m.nombre : ""} el ${largo(r.f)}.\n\n¿Te separamos una cita? Reserva aquí:\n${webBase()}citas?codigo=${encodeURIComponent(code)}`); r.avisado = todayISO(); await DB.saveMascota(code, id, { rec: m.rec }); }
    if (t.dataset.rcLim) { openWA(c.celular, `Hola ${String(c.dueno).split(" ")[0]}, te saluda *${NOMBRE_V}* 🦷\n\nYa pasaron más de 6 meses desde la última limpieza dental${m.nombre !== c.dueno ? " de " + m.nombre : ""}. Hacerla a tiempo previene caries y problemas de encías.\n\n¿Te separamos una cita? Reserva aquí en un minuto:\n${webBase()}citas?servicio=limpieza&codigo=${encodeURIComponent(code)}`); await DB.saveMascota(code, id, { avisoLimpieza: todayISO() }); }
    toast("Marcado como avisado"); return refresh();
  }
  if (CUR.v !== "mascota") return;
  if (t.matches("[data-odo-edit]")) return odontoEditor();
  if (t.matches("[data-plan-new]")) return planForm(null);
  if (t.matches("[data-pres-wa]")) return presupuestoWA();
  if (t.matches("[data-pres-pdf]")) return presupuestoPDF();
  if (t.matches("[data-fin-new]")) return finForm();
  const pi = t.closest("[data-pi]");
  if (pi) { const i = +pi.dataset.pi, l = (CUR.m.plan || []).slice(), x = l[i];
    if (t.matches("[data-plan-edit]")) return planForm(i);
    if (t.matches("[data-plan-del]")) return confirmDel(`Se quitará <b>${esc(x.t)}</b> del plan.`, async () => { l.splice(i, 1); await DB.saveMascota(CUR.code, CUR.id, { plan: l }); toast("Quitado del plan"); refresh(); });
    if (t.matches("[data-plan-st]")) { x.estado = { pendiente: "curso", curso: "hecho", hecho: "pendiente" }[x.estado || "pendiente"]; if (x.estado === "hecho" && x.ses) x.hechas = x.ses; await DB.saveMascota(CUR.code, CUR.id, { plan: l }); toast(`Estado: ${EST_P[x.estado][1]}`); return refresh(); }
    if (t.matches("[data-plan-ses]")) { x.hechas = Math.min((+x.hechas || 0) + 1, x.ses); x.estado = x.hechas >= x.ses ? "hecho" : "curso"; await DB.saveMascota(CUR.code, CUR.id, { plan: l }); toast(`Sesión ${x.hechas} de ${x.ses}`); return refresh(); }
  }
  const fi = t.closest("[data-fi]");
  if (fi) { const i = +fi.dataset.fi, l = CUR.m.financ || [];
    if (t.matches("[data-fin-pay]")) return cuotaForm(i);
    if (t.matches("[data-fin-wa]")) { openWA(CUR.cliente.celular, msgCuota(l[i], CUR.m.nombre !== CUR.cliente.dueno ? CUR.m : null, { ...CUR.cliente, codigo: CUR.code })); l[i].avisado = todayISO(); await DB.saveMascota(CUR.code, CUR.id, { financ: l }); return refresh(); }
    if (t.matches("[data-fin-del]")) return confirmDel(`Se eliminará el plan de cuotas <b>${esc(l[i].t)}</b>. Los pagos ya registrados en Caja se mantienen.`, async () => { l.splice(i, 1); await DB.saveMascota(CUR.code, CUR.id, { financ: l }); toast("Plan de cuotas eliminado"); refresh(); });
  }
});
