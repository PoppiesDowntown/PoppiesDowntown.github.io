/* =========================================================
   POPPIE'S DOWNTOWN — SITE SETTINGS
   ✏️  Everything the owner may want to change lives here.
   Hours use 24h times: ["11:00","20:30"]. "" = "Call ahead".
   ========================================================= */
const POP = {
  phone: "843-756-0121",
  address: "4111 Meeting St, Loris, SC 29569",
  facebook: "",   // e.g. "https://facebook.com/poppiesdowntown"
  instagram: "",
  email: "",      // used by the contact form

  hours: {
    Monday: "", Tuesday: "", Wednesday: "", Thursday: "",
    Friday: ["11:00","20:30"], Saturday: ["11:00","20:30"], Sunday: ["12:00","20:00"]
  },

  // Daily kitchen menu, shown in "What's Cookin' Today"
  daily: {
    Monday:    { title: "Lunch & Dinner", items: [], note: "Today's menu drops on Facebook" },
    Tuesday:   { title: "Lunch & Dinner", items: [], note: "Today's menu drops on Facebook" },
    Wednesday: { title: "Menu Drop Day!", items: [], note: "New Wednesday menu, call ahead" },
    Thursday:  { title: "Tasty Thursday", items: [["Famous Chicken & Dumplins", ""]], note: "Go early, they sell out!" },
    Friday:    { title: "Friday Menu", items: [["Crispy chicken salad","$12"],["Crispy chicken wrap with chips","$11"],["Philly cheesesteak with chips","$11"],["Ravioli lasagna with a roll","$12"]], note: "Ravioli lasagna served 4–8:30 PM only" },
    Saturday:  { title: "Saturday Menu", items: [["Crispy chicken wrap with chips","$11"],["Philly cheesesteak with chips","$11"],["Crispy chicken salad","$12"]] },
    Sunday:    { title: "Sunday Supper", items: [["Pot roast plate with potatoes, carrots, mashed potatoes, green beans & cornbread","$14"],["Crispy chicken wrap with chips","$11"],["Crispy chicken salad","$12"]] }
  },

  everyday: [["Ham & cheese panini","$7.50"],["Turkey & cheese panini","$7.50"],["Roast beef & cheese panini","$7.50"],["Grilled cheese panini","$7.50"],["Chicken tenders with chips","$7.00"],["Corn dog with chips","$4.00"]]
};

/* ---------- helpers ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WEEK = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const today = DAYS[new Date().getDay()];
const fmt = t => { let [h, m] = t.split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; const hh = h % 12 || 12; return m ? `${hh}:${String(m).padStart(2,"0")} ${ap}` : `${hh} ${ap}`; };
const telHref = "tel:" + POP.phone.replace(/\D/g, "");

/* ---------- nav ---------- */
const burger = $(".burger"), links = $(".links");
burger && burger.addEventListener("click", () => {
  links.classList.toggle("open"); burger.classList.toggle("x");
  burger.setAttribute("aria-expanded", links.classList.contains("open"));
});

/* ---------- reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .1 });
$$(".rv").forEach(el => io.observe(el));

/* ---------- shared ---------- */
$$("[data-year]").forEach(e => e.textContent = new Date().getFullYear());
$$("[data-phone]").forEach(e => e.innerHTML = `<a href="${telHref}">${POP.phone}</a>`);
$$("[data-social]").forEach(e => {
  const s = [];
  if (POP.facebook) s.push(`<a href="${POP.facebook}" target="_blank" rel="noopener">Facebook</a>`);
  if (POP.instagram) s.push(`<a href="${POP.instagram}" target="_blank" rel="noopener">Instagram</a>`);
  e.innerHTML = s.length ? s.join(" · ") : "Find us on Facebook: Poppie's Downtown";
});

/* ---------- hours ---------- */
$$("[data-hours]").forEach(t => t.innerHTML = WEEK.map(d => {
  const v = POP.hours[d];
  return `<tr class="${d === today ? "now" : ""}"><td>${d}</td><td>${Array.isArray(v) ? fmt(v[0]) + " – " + fmt(v[1]) : (v || "Call ahead")}</td></tr>`;
}).join(""));
$$("[data-open]").forEach(e => {
  const v = POP.hours[today];
  if (!Array.isArray(v)) { e.innerHTML = `<i></i> Open 7 days a week`; return; }
  const n = new Date(), m = n.getHours() * 60 + n.getMinutes();
  const [o, c] = v.map(t => { const [h, mm] = t.split(":").map(Number); return h * 60 + mm; });
  e.innerHTML = m >= o && m < c ? `<i></i> Open now · till ${fmt(v[1])}` : `<i style="background:var(--pink)"></i> Closed · opens ${fmt(v[0])}`;
});

/* ---------- What's cookin' today ---------- */
const board = $("[data-today]");
if (board) {
  const pills = $(".day-pills");
  const draw = d => {
    const m = POP.daily[d] || { title: "Lunch & Dinner", items: [] };
    $(".day", board).textContent = d === today ? `Today · ${d}` : d;
    $("h3", board).textContent = m.title;
    const items = m.items.length ? m.items : [["Paninis, tenders & corn dogs", "daily"]];
    $("ul", board).innerHTML = items.map(([n, p]) => `<li><span>${n}</span><span class="dots"></span><b>${p || "ask!"}</b></li>`).join("");
    const note = $(".note", board);
    note.textContent = m.note || ""; note.style.display = m.note ? "" : "none";
    $$("button", pills).forEach(b => b.classList.toggle("on", b.dataset.d === d));
  };
  pills.innerHTML = WEEK.map(d => `<button data-d="${d}">${d.slice(0, 3)}</button>`).join("");
  pills.addEventListener("click", e => e.target.dataset.d && draw(e.target.dataset.d));
  draw(today);
}

/* ---------- menu page: weekend + everyday lists ---------- */
const plates = $("[data-plates]");
if (plates) {
  const colors = { Friday: "var(--orange)", Saturday: "var(--lime)", Sunday: "var(--pink)" };
  const times = { Friday: "11 AM – 8:30 PM", Saturday: "11 AM – 8:30 PM", Sunday: "12 Noon – 8 PM" };
  plates.innerHTML = ["Friday", "Saturday", "Sunday"].map(d => `
    <div class="plate rv in">
      <span class="d" style="background:${colors[d]};${d !== "Saturday" ? "color:#fff" : ""}">${d}</span>
      <div class="t">${times[d]}</div>
      <ul>${POP.daily[d].items.map(([n, p]) => `<li><span>${n}</span><span class="dots"></span><b>${p}</b></li>`).join("")}</ul>
      ${POP.daily[d].note ? `<small style="margin-top:10px">★ ${POP.daily[d].note}</small>` : ""}
    </div>`).join("");
}
const ev = $("[data-everyday]");
if (ev) ev.innerHTML = POP.everyday.map(([n, p]) => `<div><span>${n}</span><b>${p}</b></div>`).join("");

/* ---------- menu scroll spy ---------- */
const tabs = $$(".mtabs a");
if (tabs.length) {
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    tabs.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
    const on = tabs.find(a => a.classList.contains("on")); on && on.scrollIntoView({ block: "nearest", inline: "center" });
  }), { rootMargin: "-40% 0px -55% 0px" });
  $$(".msec").forEach(s => spy.observe(s));
}

/* ---------- lightbox ---------- */
const lb = $(".lightbox");
if (lb) {
  $$("[data-zoom]").forEach(img => img.addEventListener("click", () => { $("img", lb).src = img.src; $("img", lb).alt = img.alt; lb.classList.add("show"); }));
  lb.addEventListener("click", () => lb.classList.remove("show"));
  addEventListener("keydown", e => e.key === "Escape" && lb.classList.remove("show"));
}

/* ---------- contact form ---------- */
const form = $("form.contact");
form && form.addEventListener("submit", e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const body = `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\nTopic: ${d.topic}\n\n${d.msg}`;
  location.href = `mailto:${POP.email}?subject=${encodeURIComponent("Poppie's Downtown · " + d.topic)}&body=${encodeURIComponent(body)}`;
  $(".form-ok").hidden = false;
});
