/* =========================================================
   BASE DE DATOS — Firebase (Firestore + Auth) o MODO DEMO
   Estructura en Firestore:
     clientes/{CODIGO}                 → titular del código
     clientes/{CODIGO}/mascotas/{id}   → cada paciente: datos, odontograma, plan, cuotas e historial
   ========================================================= */
(function () {
  const CFG = window.FIREBASE_CONFIG || {};
  const DEMO = !CFG.apiKey || CFG.apiKey.startsWith("PEGA");
  const V = "10.12.2";
  const KEY = "dc_db";
  const ALFA = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";   // sin 0, O, 1, I para no confundir
  const now = () => new Date().toISOString();
  const uid = () => Math.random().toString(36).slice(2, 10);
  const iso = n => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

  /* ---------------- MODO DEMO (localStorage) ---------------- */
  function seed() {
    const P = (id, plan, extra) => ({ historial: [], rec: [], financ: [], odontograma: {}, plan, ...extra, actualizado: now() });
    return { clientes: {
      "DC-1024": { codigo: "DC-1024", dueno: "María López", celular: "987654321", email: "maria@correo.com", direccion: "Calle Los Pinos 145, Lince", notas: "", creado: now(), mascotas: {
        maria: P("maria", [{ id: uid(), pieza: "", t: "Limpieza dental", p: 80, estado: "hecho" }, { id: uid(), pieza: "36", t: "Endodoncia", p: 350, estado: "hecho" }, { id: uid(), pieza: "46", t: "Corona de zirconio", p: 900, estado: "hecho" },
            { id: uid(), pieza: "26", t: "Curación con resina", p: 90, estado: "pendiente" }, { id: uid(), pieza: "38", t: "Extracción de muela del juicio", p: 180, estado: "pendiente" }],
          { nombre: "María López", sexo: "Femenino", nac: iso(-37 * 365), dni: "45871236", alergias: "Penicilina", enfermedades: "Ninguna", medicamentos: "",
            odontograma: { "18": { e: "ausente" }, "16": { e: "resina" }, "26": { e: "caries", n: "Caries en la cara de masticación" }, "36": { e: "endodoncia" }, "46": { e: "corona", n: "Corona de zirconio" }, "38": { e: "extraer", n: "Muela del juicio sin espacio" }, "11": { e: "resina" } },
            historial: [
              { id: uid(), f: iso(-12), hora: "16:00", t: "Corona de zirconio · pieza 46", piezas: "46", d: "Cementado de corona definitiva. Mordida ajustada.", vet: "Dr. Luis Cabanillas", monto: 900, pagado: 900, base: 900, cargos: [], pagos: [{ monto: 450, metodo: "Yape", fecha: iso(-30) }, { monto: 450, metodo: "Tarjeta", fecha: iso(-12) }], meds: [], ind: "Evitar alimentos muy duros las primeras 24 horas." },
              { id: uid(), f: iso(-30), hora: "15:00", t: "Endodoncia · pieza 36", piezas: "36", d: "Pulpitis irreversible. Tratamiento de conductos en una sesión.", vet: "Dr. Martín Rojas", monto: 380, pagado: 380, base: 350, cargos: [{ n: "Radiografía periapical", q: 1, p: 30 }], pagos: [{ monto: 380, metodo: "Efectivo", fecha: iso(-30) }],
                meds: [{ n: "Ibuprofeno 400 mg", dosis: "1 tableta", cada: "8 h", dias: "3" }, { n: "Clorhexidina 0.12% (enjuague)", dosis: "15 ml", cada: "12 h", dias: "7" }], ind: "No masticar del lado tratado hasta colocar la corona." },
              { id: uid(), f: iso(-200), hora: "10:00", t: "Evaluación y limpieza dental", d: "Sarro moderado. Se detecta caries en 26 y muela del juicio 38 sin espacio.", vet: "Dra. Andrea Cabanillas", monto: 130, pagado: 130, base: 130, cargos: [], pagos: [{ monto: 130, metodo: "Yape", fecha: iso(-200) }], meds: [] }],
            rec: [{ id: uid(), i: "tooth", t: "Curación pieza 26", f: iso(2) }] }),
        mateo: P("mateo", [{ id: uid(), pieza: "16·26·36·46", t: "Sellantes", p: 160, estado: "hecho" }, { id: uid(), pieza: "75", t: "Curación con resina", p: 70, estado: "pendiente" }],
          { nombre: "Mateo López", sexo: "Masculino", nac: iso(-8 * 365 - 60), dni: "", alergias: "Ninguna", enfermedades: "", medicamentos: "", temporal: true,
            odontograma: { "16": { e: "sellante" }, "26": { e: "sellante" }, "36": { e: "sellante" }, "46": { e: "sellante" }, "75": { e: "caries", n: "Caries pequeña en muela de leche" }, "51": { e: "ausente", n: "Cambio natural de diente" } },
            historial: [{ id: uid(), f: iso(-20), hora: "11:00", t: "Odontopediatría: sellantes y flúor", d: "Molares permanentes sanos. Se colocan sellantes preventivos.", vet: "Dra. Fiorella Quispe", monto: 160, pagado: 160, base: 160, cargos: [], pagos: [{ monto: 160, metodo: "Plin", fecha: iso(-20) }], meds: [], ind: "No comer en 30 minutos después del flúor." }],
            rec: [{ id: uid(), i: "kid", t: "Control de Mateo", f: iso(40) }] }) } },
      "DC-2048": { codigo: "DC-2048", dueno: "Diego Paredes", celular: "912345678", email: "", direccion: "Av. Petit Thouars 3300, San Isidro", notas: "Prefiere citas en la tarde", creado: now(), mascotas: {
        diego: P("diego", [{ id: uid(), pieza: "", t: "Ortodoncia con brackets metálicos", p: 3500, estado: "curso", ses: 24, hechas: 8 }, { id: uid(), pieza: "14·24", t: "Extracciones por ortodoncia", p: 240, estado: "hecho" }],
          { nombre: "Diego Paredes", sexo: "Masculino", nac: iso(-24 * 365), dni: "72145698", alergias: "Ninguna", enfermedades: "", medicamentos: "",
            odontograma: { "14": { e: "ausente", n: "Extraída por ortodoncia" }, "24": { e: "ausente", n: "Extraída por ortodoncia" }, "47": { e: "resina" } },
            financ: [{ id: uid(), t: "Ortodoncia con brackets", total: 3500, inicial: 500, n: 20, monto: 150, dia: Math.min(new Date().getDate() + 3, 28), inicio: iso(-250),
              pagos: [{ tipo: "inicial", monto: 500, fecha: iso(-250), metodo: "Transferencia" }, ...[0, 1, 2, 3, 4, 5, 6].map(k => ({ tipo: "cuota", monto: 150, fecha: iso(-220 + k * 30), metodo: k % 2 ? "Yape" : "Efectivo" }))] }],
            historial: [{ id: uid(), f: iso(-24), hora: "17:00", t: "Control de ortodoncia (8 de 24)", d: "Cambio de arco. Buena higiene.", vet: "Dra. Andrea Cabanillas", monto: 0, pagado: 0, meds: [], ind: "Usar cera si algún bracket roza." }],
            rec: [{ id: uid(), i: "brace", t: "Control de ortodoncia", f: iso(6) }] }) } } } };
  }
  // Citas y caja de ejemplo para el MODO DEMO
  function seedAgenda(d) {
    d.citas = {}; d.turnos = {}; d.movimientos = d.movimientos || {};
    const hhmm = () => { const n = new Date(); return String(n.getHours()).padStart(2, "0") + ":" + String(n.getMinutes()).padStart(2, "0"); };
    const add = (dias, hora, code, mid, mascota, dueno, cel, servicio, precio, pagado, origen, vet, vetId) => {
      const fecha = iso(dias), id = `${fecha}_${hora}_1`;
      d.turnos[id] = { fecha, hora, k: 1, creado: now() };
      d.citas[id] = { fecha, hora, k: 1, servicioId: "", servicio, precio, total: precio, pagado, estadoPago: pagado >= precio && precio ? "pagado" : pagado > 0 ? "adelanto" : "pendiente",
        pagos: pagado ? [{ monto: pagado, metodo: "Yape", fecha: iso(0), hora: hhmm() }] : [], code, mascotaId: mid, mascota, dueno, celular: cel, motivo: "", origen, estado: "confirmada", vet, vetId, creado: now() };
    };
    add(0, "10:00", "DC-1024", "maria", "María López", "María López", "987654321", "Curación con resina · pieza 26", 90, 0, "panel", "Dra. Andrea Cabanillas", "andrea");
    add(0, "16:30", "", "", "Lucía Torres", "Lucía Torres", "934567812", "Evaluación y diagnóstico", 50, 0, "web", "", "");
    add(2, "11:00", "DC-1024", "mateo", "Mateo López", "María López", "987654321", "Curación con resina · pieza 75", 70, 0, "panel", "Dra. Fiorella Quispe", "fiorella");
    add(6, "17:00", "DC-2048", "diego", "Diego Paredes", "Diego Paredes", "912345678", "Control de ortodoncia", 0, 0, "web", "Dra. Andrea Cabanillas", "andrea");
    const P = window.DATOS.productos, S = window.DATOS.servicios.filter(x => +x.p > 0 && +x.p < 500), metodos = ["Efectivo", "Yape", "Plin", "Tarjeta"], md = (x, n) => ((x % n) + n) % n;
    for (let dd = -20; dd <= 0; dd++) {
      const n = 1 + md(dd * 7, 3);
      for (let j = 0; j < n; j++) {
        const p = P[md(dd * 5 + j * 3, P.length)], q = 1 + md(j + dd, 2), costo = Math.round(p.p * .55 * 10) / 10;
        d.movimientos[uid()] = { fecha: iso(dd), hora: `1${j}:${j ? "15" : "40"}`, tipo: "venta", concepto: `Venta · ${p.n}`, total: Math.round(p.p * q * 100) / 100, metodo: metodos[md(j + dd, 4)],
          items: [{ tipo: "producto", id: p.id, n: p.n, q, p: p.p, costo }], cliente: "", anulado: false, creado: now() };
      }
      const s1 = S[md(dd * 3, S.length)];
      d.movimientos[uid()] = { fecha: iso(dd), hora: "11:30", tipo: "servicio", concepto: s1.n, total: s1.p, metodo: metodos[md(dd + 1, 4)], items: [{ tipo: "servicio", n: s1.n, q: 1, p: s1.p }], cliente: "Paciente", anulado: false, creado: now() };
      if (dd % 3 === 0) d.movimientos[uid()] = { fecha: iso(dd), hora: "17:00", tipo: "servicio", concepto: "Cuota · Ortodoncia con brackets – Diego Paredes", total: 150, metodo: "Yape", items: [{ tipo: "servicio", n: "Cuota · Ortodoncia con brackets", q: 1, p: 150 }], cliente: "Diego Paredes", anulado: false, creado: now() };
    }
  }

  // Pet Shop, servicios y ajustes de ejemplo (datos.js)
  function ensure(d) {
    const X = window.DATOS; if (!X) return d; let ch = false;
    const toMap = l => { const m = {}; l.forEach(({ id, ...r }) => m[id] = r); return m; };
    if (!d.productos) { d.productos = toMap(X.productos); ch = true; }
    if (!d.servicios) { d.servicios = toMap(X.servicios); ch = true; }
    if (!d.ajustes) { d.ajustes = { ...X.ajustes }; ch = true; }
    if (!d.inventario) { d.inventario = {}; X.productos.forEach((p, i) => d.inventario[p.id] = { cantidad: [12, 30, 8, 25, 2, 18, 14, 9, 6, 20, 5, 0, 3, 7, 15, 18][i % 16], costo: Math.round(p.p * .55 * 10) / 10, minimo: 3 }); ch = true;
      Object.entries(d.inventario).forEach(([id, v]) => { if (d.productos[id]) d.productos[id].stock = v.cantidad > 0 ? "disponible" : "agotado"; }); }
    if (!d.web && X.web) { d.web = JSON.parse(JSON.stringify(X.web)); ch = true; }
    if (!d.citas) { seedAgenda(d); ch = true; }
    if (ch) save(d); return d;
  }
  const load = () => { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.clientes) return ensure(d); } catch (e) {} const d = seed(); save(d); return ensure(d); };
  const save = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { alert("No se pudo guardar (almacenamiento lleno). Usa fotos más pequeñas."); } };
  const clone = o => JSON.parse(JSON.stringify(o));

  const demo = {
    mode: "demo",
    async onUser(cb) { let u = null; try { u = JSON.parse(sessionStorage.getItem("dc_admin")); } catch (e) {} this._cb = cb;
      // espera a que carguen todos los módulos del panel antes de abrir la sesión guardada
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => cb(u), { once: true }); else setTimeout(() => cb(u), 0); },
    async login(email, pass) {
      if (!email || pass.length < 4) throw new Error("Correo o contraseña incorrectos.");
      const u = { email }; try { sessionStorage.setItem("dc_admin", JSON.stringify(u)); } catch (e) {} this._cb && this._cb(u); return u;
    },
    async logout() { try { sessionStorage.removeItem("dc_admin"); } catch (e) {} this._cb && this._cb(null); },
    async listClientes() { const d = load(); return Object.values(d.clientes).map(c => { const { mascotas, ...r } = c; return { ...clone(r), nMascotas: Object.keys(mascotas || {}).length }; }); },
    async getCliente(code) { const c = load().clientes[code]; if (!c) return null; const { mascotas, ...r } = c; return clone(r); },
    async codeExists(code) { return !!load().clientes[code]; },
    async saveCliente(code, data) { const d = load(); const old = d.clientes[code] || { mascotas: {}, creado: now() }; d.clientes[code] = { ...old, ...data, codigo: code, mascotas: old.mascotas, actualizado: now() }; save(d); },
    async deleteCliente(code) { const d = load(); delete d.clientes[code]; save(d); },
    async listMascotas(code) { const c = load().clientes[code]; return c ? Object.entries(c.mascotas || {}).map(([id, m]) => ({ id, ...clone(m) })) : []; },
    async getMascota(code, id) { const m = load().clientes[code]?.mascotas?.[id]; return m ? { id, ...clone(m) } : null; },
    async saveMascota(code, id, data) { const d = load(); id = id || uid(); const c = d.clientes[code]; c.mascotas = c.mascotas || {}; c.mascotas[id] = { ...(c.mascotas[id] || {}), ...data, actualizado: now() }; save(d); return id; },
    async deleteMascota(code, id) { const d = load(); delete d.clientes[code].mascotas[id]; save(d); },
    async allMascotas() { const d = load(); const out = []; for (const [code, c] of Object.entries(d.clientes)) for (const [id, m] of Object.entries(c.mascotas || {})) out.push({ code, id, dueno: c.dueno, celular: c.celular, ...clone(m) }); return out; },
  };

  /* ---------------- FIREBASE ---------------- */
  let fb = null;
  async function F() {
    if (fb) return fb;
    const base = `https://www.gstatic.com/firebasejs/${V}/`;
    const [app, auth, fs] = await Promise.all([import(base + "firebase-app.js"), import(base + "firebase-auth.js"), import(base + "firebase-firestore.js")]);
    const a = app.initializeApp(CFG);
    fb = { ...auth, ...fs, auth: auth.getAuth(a), db: fs.getFirestore(a) };
    return fb;
  }
  const firebase = {
    mode: "firebase",
    async onUser(cb) { const f = await F(); if (document.readyState === "loading") await new Promise(r => document.addEventListener("DOMContentLoaded", r, { once: true })); f.onAuthStateChanged(f.auth, u => cb(u ? { email: u.email } : null)); },
    async login(email, pass) {
      const f = await F();
      try { await f.signInWithEmailAndPassword(f.auth, email, pass); }
      catch (e) {
        if (/api-key|configuration-not-found|unauthorized-domain|operation-not-allowed/.test(e.code || "")) throw new Error("Revisa la configuración de Firebase: " + e.code + " (ver COMO-CONFIGURAR.txt)");
        throw new Error(/invalid|wrong|not-found|credential/.test(e.code || "") ? "Correo o contraseña incorrectos." : "No se pudo ingresar: " + (e.code || e.message)); }
    },
    async logout() { const f = await F(); await f.signOut(f.auth); },
    // Datos públicos (clientes/) = solo el nombre. Celular, correo, dirección y notas van en privado/ (solo el panel).
    async listClientes() {
      const f = await F();
      const [s, p, all] = await Promise.all([f.getDocs(f.collection(f.db, "clientes")), f.getDocs(f.collection(f.db, "privado")), this.allMascotas()]);
      const pv = {}; p.docs.forEach(d => pv[d.id] = d.data());
      const n = {}; all.forEach(m => n[m.code] = (n[m.code] || 0) + 1);
      return s.docs.map(d => ({ ...d.data(), ...(pv[d.id] || {}), codigo: d.id, nMascotas: n[d.id] || 0 }));
    },
    async getCliente(code) {
      const f = await F();
      const [s, p] = await Promise.all([f.getDoc(f.doc(f.db, "clientes", code)), f.getDoc(f.doc(f.db, "privado", code))]);
      return s.exists() ? { ...s.data(), ...(p.exists() ? p.data() : {}), codigo: code } : null;
    },
    async codeExists(code) { const f = await F(); return (await f.getDoc(f.doc(f.db, "clientes", code))).exists(); },
    async saveCliente(code, data) {
      const f = await F(); const ref = f.doc(f.db, "clientes", code); const ex = await f.getDoc(ref);
      const { dueno, ...priv } = data;
      await f.setDoc(ref, { dueno, codigo: code, actualizado: now(), ...(ex.exists() ? {} : { creado: now() }) }, { merge: true });
      await f.setDoc(f.doc(f.db, "privado", code), priv, { merge: true });
    },
    async deleteCliente(code) {
      const f = await F();
      for (const m of await this.listMascotas(code)) await f.deleteDoc(f.doc(f.db, "clientes", code, "mascotas", m.id));
      for (const sub of ["fotos", "agenda"]) { const q = await f.getDocs(f.collection(f.db, "clientes", code, sub)); for (const d of q.docs) await f.deleteDoc(d.ref); }
      await f.deleteDoc(f.doc(f.db, "privado", code)); await f.deleteDoc(f.doc(f.db, "clientes", code));
    },
    async listMascotas(code) { const f = await F(); const s = await f.getDocs(f.collection(f.db, "clientes", code, "mascotas")); return s.docs.map(d => ({ id: d.id, ...d.data() })); },
    async getMascota(code, id) { const f = await F(); const s = await f.getDoc(f.doc(f.db, "clientes", code, "mascotas", id)); return s.exists() ? { id, ...s.data() } : null; },
    async saveMascota(code, id, data) { const f = await F();
      if (!id) { const r = await f.addDoc(f.collection(f.db, "clientes", code, "mascotas"), { ...data, actualizado: now() }); return r.id; }
      await f.setDoc(f.doc(f.db, "clientes", code, "mascotas", id), { ...data, actualizado: now() }, { merge: true }); return id; },
    async deleteMascota(code, id) { const f = await F(); await f.deleteDoc(f.doc(f.db, "clientes", code, "mascotas", id)); },
    async allMascotas() {
      const f = await F(); const [ms, cs, ps] = await Promise.all([f.getDocs(f.collectionGroup(f.db, "mascotas")), f.getDocs(f.collection(f.db, "clientes")), f.getDocs(f.collection(f.db, "privado"))]);
      const cl = {}; cs.docs.forEach(d => cl[d.id] = d.data()); ps.docs.forEach(d => cl[d.id] = { ...(cl[d.id] || {}), ...d.data() });
      return ms.docs.map(d => { const code = d.ref.parent.parent.id; return { code, id: d.id, dueno: cl[code]?.dueno || "", celular: cl[code]?.celular || "", ...d.data() }; });
    },
  };

  /* ---------- Pet Shop, servicios y ajustes ---------- */
  Object.assign(demo, {
    async listCol(col) { return Object.entries(load()[col] || {}).map(([id, x]) => ({ ...clone(x), id })); },
    async saveDocCol(col, id, data) { const d = load(); d[col] = d[col] || {}; id = id || uid(); d[col][id] = { ...(d[col][id] || {}), ...data, actualizado: now() }; save(d); return id; },
    async delDocCol(col, id) { const d = load(); delete d[col][id]; save(d); },
    async getAjustes() { return clone(load().ajustes || {}); },
    async saveAjustes(a) { const d = load(); d.ajustes = { ...(d.ajustes || {}), ...a }; save(d); },
    async importar(col) { const d = load(); d[col] = d[col] || {}; (window.DATOS[col] || []).forEach(({ id, ...r }) => d[col][id] = r);
      if (col === "productos") { d.inventario = d.inventario || {}; window.DATOS.productos.forEach(p => { if (!d.inventario[p.id]) d.inventario[p.id] = { cantidad: 10, costo: Math.round(p.p * .62 * 10) / 10, minimo: 3 }; d.productos[p.id].stock = "disponible"; }); }
      save(d); },
  });
  Object.assign(firebase, {
    async listCol(col) { const f = await F(); const s = await f.getDocs(f.collection(f.db, col)); return s.docs.map(d => ({ ...d.data(), id: d.id })); },
    async saveDocCol(col, id, data) { const f = await F();
      if (!id) { const r = await f.addDoc(f.collection(f.db, col), { ...data, actualizado: now() }); return r.id; }
      await f.setDoc(f.doc(f.db, col, id), { ...data, actualizado: now() }, { merge: true }); return id; },
    async delDocCol(col, id) { const f = await F(); await f.deleteDoc(f.doc(f.db, col, id)); },
    async getAjustes() { const f = await F(); const s = await f.getDoc(f.doc(f.db, "ajustes", "general")); return s.exists() ? s.data() : {}; },
    async saveAjustes(a) { const f = await F(); await f.setDoc(f.doc(f.db, "ajustes", "general"), a, { merge: true }); },
    async importar(col) { const f = await F();
      for (const { id, ...r } of (window.DATOS[col] || [])) {
        await f.setDoc(f.doc(f.db, col, id), { ...r, ...(col === "productos" ? { stock: "disponible" } : {}), actualizado: now() });
        if (col === "productos") await f.setDoc(f.doc(f.db, "inventario", id), { cantidad: 10, costo: Math.round(r.p * .62 * 10) / 10, minimo: 3 }, { merge: true });
      } },
  });

  /* ---------- Agenda, caja e inventario ---------- */
  const pubCita = c => ({ fecha: c.fecha, hora: c.hora, servicio: c.servicio, precio: +c.precio || 0, total: +(c.total ?? c.precio) || 0, pagado: +c.pagado || 0,
    estadoPago: c.estadoPago || "pendiente", mascota: c.mascota || "", mascotaId: c.mascotaId || "", estado: c.estado || "confirmada", vet: c.vet || "", sede: c.sede || "",
    cargos: (c.cargos || []).map(x => ({ n: x.n, q: +x.q || 1, p: +x.p || 0 })), ...(c.precioBase != null ? { precioBase: +c.precioBase } : {}),
    pagos: (c.pagos || []).map(p => ({ monto: +p.monto || 0, metodo: p.metodo || "", fecha: p.fecha || "", hora: p.hora || "" })) });
  Object.assign(demo, {
    async getDocX(col, id) { const d = load(); return d[col] && d[col][id] ? clone(d[col][id]) : null; },
    async setDocX(col, id, data) { const d = load(); d[col] = d[col] || {}; d[col][id] = { ...(d[col][id] || {}), ...data }; save(d); },
    async rango(col, a, b) { return Object.entries(load()[col] || {}).filter(([, x]) => x.fecha >= a && x.fecha <= b).map(([id, x]) => ({ ...clone(x), id })); },
    async turnosRango(a, b) { return this.rango("turnos", a, b); },
    async crearCita(base, cap) {
      const d = load(); d.turnos = d.turnos || {}; d.citas = d.citas || {};
      for (let k = 1; k <= cap; k++) { const id = `${base.fecha}_${base.hora}_${k}`; if (d.turnos[id]) continue;
        d.turnos[id] = { fecha: base.fecha, hora: base.hora, k, creado: now() }; d.citas[id] = { ...base, k, creado: now() }; save(d); return id; }
      return null;
    },
    async guardarCita(id, data) { const d = load(); d.citas[id] = { ...(d.citas[id] || {}), ...data, actualizado: now() }; save(d); },
    async borrarCita(c) { const d = load(); delete d.citas[c.id]; delete d.turnos[c.id]; save(d); },
    async bloquear(fecha, hora, cap, motivo) { const d = load(); d.turnos = d.turnos || {}; for (let k = 1; k <= cap; k++) { const id = `${fecha}_${hora}_${k}`; if (!d.turnos[id]) d.turnos[id] = { fecha, hora, k, bloqueo: true, motivo: motivo || "", creado: now() }; } save(d); },
    async desbloquear(fecha, hora) { const d = load(); Object.entries(d.turnos || {}).forEach(([id, t]) => { if (t.fecha === fecha && t.hora === hora && t.bloqueo) delete d.turnos[id]; }); save(d); },
    async stock(id, delta, extra = {}) {
      const d = load(); d.inventario = d.inventario || {}; const inv = d.inventario[id] || { cantidad: 0, costo: 0, minimo: 3 };
      inv.cantidad = (+inv.cantidad || 0) + delta; Object.assign(inv, extra); d.inventario[id] = inv;
      if (d.productos && d.productos[id]) d.productos[id].stock = inv.cantidad > 0 ? "disponible" : "agotado";
      save(d); return inv.cantidad;
    },
  });
  Object.assign(firebase, {
    async getDocX(col, id) { const f = await F(); const s = await f.getDoc(f.doc(f.db, col, id)); return s.exists() ? s.data() : null; },
    async setDocX(col, id, data) { const f = await F(); await f.setDoc(f.doc(f.db, col, id), data, { merge: true }); },
    async rango(col, a, b) { const f = await F(); const s = await f.getDocs(f.query(f.collection(f.db, col), f.where("fecha", ">=", a), f.where("fecha", "<=", b))); return s.docs.map(d => ({ ...d.data(), id: d.id })); },
    async turnosRango(a, b) { return this.rango("turnos", a, b); },
    async crearCita(base, cap) {
      const f = await F();
      for (let k = 1; k <= cap; k++) {
        const id = `${base.fecha}_${base.hora}_${k}`;
        try {
          await f.runTransaction(f.db, async tx => {
            const t = f.doc(f.db, "turnos", id); if ((await tx.get(t)).exists()) throw new Error("ocupado");
            tx.set(t, { fecha: base.fecha, hora: base.hora, k, creado: now() });
            tx.set(f.doc(f.db, "citas", id), { ...base, k, creado: now() });
            if (base.code) tx.set(f.doc(f.db, "clientes", base.code, "agenda", id), pubCita(base));
          });
          return id;
        } catch (e) { if (e.message !== "ocupado") throw e; }
      }
      return null;
    },
    async guardarCita(id, data) {
      const f = await F(); const ref = f.doc(f.db, "citas", id);
      await f.setDoc(ref, { ...data, actualizado: now() }, { merge: true });
      const c = (await f.getDoc(ref)).data();
      if (c && c.code) await f.setDoc(f.doc(f.db, "clientes", c.code, "agenda", id), pubCita(c));
    },
    async borrarCita(c) {
      const f = await F(); const b = f.writeBatch(f.db);
      b.delete(f.doc(f.db, "citas", c.id)); b.delete(f.doc(f.db, "turnos", c.id));
      if (c.code) b.delete(f.doc(f.db, "clientes", c.code, "agenda", c.id));
      await b.commit();
    },
    async bloquear(fecha, hora, cap, motivo) {
      const f = await F();
      for (let k = 1; k <= cap; k++) { const ref = f.doc(f.db, "turnos", `${fecha}_${hora}_${k}`);
        if (!(await f.getDoc(ref)).exists()) await f.setDoc(ref, { fecha, hora, k, bloqueo: true, motivo: motivo || "", creado: now() }); }
    },
    async desbloquear(fecha, hora) {
      const f = await F(); const s = await f.getDocs(f.query(f.collection(f.db, "turnos"), f.where("fecha", "==", fecha)));
      for (const d of s.docs) if (d.data().hora === hora && d.data().bloqueo) await f.deleteDoc(d.ref);
    },
    async stock(id, delta, extra = {}) {
      const f = await F(); const ref = f.doc(f.db, "inventario", id);
      await f.setDoc(ref, { ...extra, cantidad: f.increment(delta) }, { merge: true });
      const q = +((await f.getDoc(ref)).data().cantidad) || 0;
      await f.setDoc(f.doc(f.db, "productos", id), { stock: q > 0 ? "disponible" : "agotado" }, { merge: true });
      return q;
    },
  });
  Object.assign(demo, {
    async getWeb() { return clone(load().web || window.DATOS.web || {}); },
    async saveWeb(w) { const d = load(); d.web = w; save(d); },
    async citasDeCliente(code) { return Object.entries(load().citas || {}).filter(([, c]) => c.code === code).map(([id, c]) => ({ ...clone(c), id })); },
  });
  Object.assign(firebase, {
    async getWeb() { const w = await this.getDocX("ajustes", "web"); return w || JSON.parse(JSON.stringify(window.DATOS.web || {})); },
    async saveWeb(w) { const f = await F(); await f.setDoc(f.doc(f.db, "ajustes", "web"), w); },
    async citasDeCliente(code) { const f = await F(); const s = await f.getDocs(f.query(f.collection(f.db, "citas"), f.where("code", "==", code))); return s.docs.map(d => ({ ...d.data(), id: d.id })); },
  });
  /* ---------- Categorías, páginas e info extra de productos ---------- */
  Object.assign(demo, {
    async getConf(n) { const c = (load().conf || {})[n]; return c ? clone(c) : null; },
    async saveConf(n, data) { const d = load(); d.conf = d.conf || {}; d.conf[n] = data; save(d); },
    async getProdInfo(id) { const x = (load().productos_info || {})[id]; return x ? clone(x) : null; },
    async saveProdInfo(id, data) { const d = load(); d.productos_info = d.productos_info || {}; d.productos_info[id] = data; save(d); },
    async delProdInfo(id) { const d = load(); if (d.productos_info) delete d.productos_info[id]; save(d); },
  });
  Object.assign(firebase, {
    async getConf(n) { return this.getDocX("ajustes", n); },
    async saveConf(n, data) { const f = await F(); await f.setDoc(f.doc(f.db, "ajustes", n), data); },
    async getProdInfo(id) { return this.getDocX("productos_info", id); },
    async saveProdInfo(id, data) { const f = await F(); await f.setDoc(f.doc(f.db, "productos_info", id), data); },
    async delProdInfo(id) { const f = await F(); await f.deleteDoc(f.doc(f.db, "productos_info", id)); },
  });

  /* ---------- Imágenes de la web (medios) y fotos del historial ---------- */
  Object.assign(demo, {
    async saveMedio(data) { const d = load(); d.medios = d.medios || {}; const id = uid() + uid(); d.medios[id] = { data, creado: now() }; save(d); return id; },
    async getMedios(ids) { const m = load().medios || {}, o = {}; ids.forEach(id => { if (m[id]) o[id] = m[id].data; }); return o; },
    async saveFoto(code, data, meta = {}) { const d = load(); d.fotos = d.fotos || {}; d.fotos[code] = d.fotos[code] || {}; const id = uid() + uid(); d.fotos[code][id] = { ...meta, data, creado: now() }; save(d); return id; },
    async getFoto(code, id) { const x = ((load().fotos || {})[code] || {})[id]; return x ? x.data : null; },
    async delFoto(code, id) { const d = load(); if (d.fotos && d.fotos[code]) delete d.fotos[code][id]; save(d); },
  });
  Object.assign(firebase, {
    async saveMedio(data) { const f = await F(); const r = await f.addDoc(f.collection(f.db, "medios"), { data, creado: now() }); return r.id; },
    async getMedios(ids) { const f = await F(), o = {}; const r = await Promise.all(ids.map(id => f.getDoc(f.doc(f.db, "medios", id)).catch(() => null))); r.forEach((d, i) => { if (d && d.exists()) o[ids[i]] = d.data().data; }); return o; },
    async saveFoto(code, data, meta = {}) { const f = await F(); const r = await f.addDoc(f.collection(f.db, "clientes", code, "fotos"), { ...meta, data, creado: now() }); return r.id; },
    async getFoto(code, id) { const f = await F(); const d = await f.getDoc(f.doc(f.db, "clientes", code, "fotos", id)); return d.exists() ? d.data().data : null; },
    async delFoto(code, id) { const f = await F(); await f.deleteDoc(f.doc(f.db, "clientes", code, "fotos", id)); },
  });

  /* ---------- Radio del equipo (mensajes de voz y avisos en tiempo real) ---------- */
  const RK = "dc_radio", radioCbs = [];
  const radioLeer = () => { try { return JSON.parse(localStorage.getItem(RK)) || []; } catch (e) { return []; } };
  window.addEventListener("storage", e => {
    if (e.key === RK) { const l = radioLeer(), vistos = new Set((e.oldValue ? JSON.parse(e.oldValue) : []).map(x => x.id)); l.filter(x => !vistos.has(x.id)).forEach(m => radioCbs.forEach(cb => cb(m))); }
  });
  Object.assign(demo, {
    async radioEnviar(m) { const l = radioLeer().filter(x => x.ts > Date.now() - 864e5); const msg = { ...m, id: uid() + uid(), ts: Date.now(), creado: now() }; l.push(msg);
      try { localStorage.setItem(RK, JSON.stringify(l.slice(-60))); } catch (e) { localStorage.setItem(RK, JSON.stringify(l.filter(x => !x.audio).slice(-60))); }
      radioCbs.forEach(cb => cb(msg)); return msg.id; },
    radioEscuchar(desde, cb) { radioLeer().filter(x => x.ts >= desde).forEach(cb); radioCbs.push(cb); },
    async radioLimpiar() { localStorage.setItem(RK, JSON.stringify(radioLeer().filter(x => x.ts > Date.now() - 864e5))); },
    citasNuevas(desdeIso, cb) {   // reservas web que llegan mientras el panel está abierto
      const ids = () => Object.keys(load().citas || {}); let antes = new Set(ids());
      window.addEventListener("storage", e => { if (e.key !== KEY) return; const d = load(); Object.entries(d.citas || {}).forEach(([id, c]) => { if (!antes.has(id) && c.origen === "web") cb({ ...c, id }); }); antes = new Set(ids()); });
    },
  });
  Object.assign(firebase, {
    async radioEnviar(m) { const f = await F(); const r = await f.addDoc(f.collection(f.db, "radio"), { ...m, ts: Date.now(), creado: now() }); return r.id; },
    async radioEscuchar(desde, cb) { const f = await F(); f.onSnapshot(f.query(f.collection(f.db, "radio"), f.where("ts", ">=", desde)), s => s.docChanges().forEach(ch => { if (ch.type === "added") cb({ ...ch.doc.data(), id: ch.doc.id }); }), e => console.warn("Radio:", e.message)); },
    async radioLimpiar() { const f = await F(); const s = await f.getDocs(f.query(f.collection(f.db, "radio"), f.where("ts", "<", Date.now() - 864e5))); for (const d of s.docs.slice(0, 80)) await f.deleteDoc(d.ref); },
    async citasNuevas(desdeIso, cb) { const f = await F(); let primera = true;
      f.onSnapshot(f.query(f.collection(f.db, "citas"), f.where("creado", ">=", desdeIso)), s => { if (!primera) s.docChanges().forEach(ch => { const c = ch.doc.data(); if (ch.type === "added" && c.origen === "web") cb({ ...c, id: ch.doc.id }); }); primera = false; }, e => console.warn("Citas nuevas:", e.message)); },
  });

  // Cuando una cita (o un cambio de pago) es del panel en modo demo también sincroniza la copia del cliente
  demo.pubCita = firebase.pubCita = pubCita;

  const api = DEMO ? demo : firebase;
  api.nuevoCodigo = async function () {
    const pre = (window.APP && window.APP.prefijoCodigo) || "DC";
    for (let i = 0; i < 20; i++) {
      let c = pre + "-"; for (let j = 0; j < 5; j++) c += ALFA[Math.floor(Math.random() * ALFA.length)];
      if (!(await api.codeExists(c))) return c;
    }
    throw new Error("No se pudo generar un código. Intenta de nuevo.");
  };
  window.DB = api;
})();
