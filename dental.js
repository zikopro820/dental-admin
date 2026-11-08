/* =========================================================
   DENTAL — ajustes finales: la ficha de atención avanza el plan
   de tratamiento y se puede marcar el odontograma.
   ========================================================= */
const _fichaDental = fichaAtencion;
fichaAtencion = async function (c, modo = "atender") {   // eslint-disable-line no-global-assign
  await _fichaDental(c, modo);
  const g = $("#modalForm .grid2"); if (!g || !$("#medList") || !c.code || !c.mascotaId) return;
  const m = await DB.getMascota(c.code, c.mascotaId); if (!m) return;
  const plan = m.plan || [], pend = plan.map((x, i) => ({ x, i })).filter(o => o.x.estado !== "hecho");
  if (!pend.length) return;
  const box = $("[name=piezas]", g)?.closest(".field") || g.lastElementChild;
  box.insertAdjacentHTML("beforebegin", `<div class="field full ficha-sec plan-link"><label>${ico("list")} Avance del plan de tratamiento</label>
    <small class="sec-hint">Marca lo que se hizo hoy. El paciente verá el avance en Mi Sonrisa.</small>
    ${pend.map(({ x, i }) => `<label class="chk"><input type="checkbox" data-plan-hoy="${i}"><span><b>${esc(x.t)}${x.pieza ? " · pieza " + esc(x.pieza) : ""}</b><small>${x.ses ? `Sesión ${(+x.hechas || 0) + 1} de ${x.ses}` : "Marcar como hecho"} · ${S(x.p)}</small></span></label>`).join("")}</div>`);
  const sel = () => $$("[data-plan-hoy]").filter(x => x.checked).map(x => +x.dataset.planHoy);
  const base = mSubmit;
  mSubmit = async d => {
    const marcados = sel(); const r = await base(d); if (r === false) return false;
    if (!marcados.length) return;
    const m2 = await DB.getMascota(c.code, c.mascotaId), l = m2.plan || [];
    marcados.forEach(i => { const x = l[i]; if (!x) return; if (x.ses) { x.hechas = Math.min((+x.hechas || 0) + 1, x.ses); x.estado = x.hechas >= x.ses ? "hecho" : "curso"; } else x.estado = "hecho"; });
    await DB.saveMascota(c.code, c.mascotaId, { plan: l });
    toast(`Plan actualizado (${marcados.length})`);
  };
};
