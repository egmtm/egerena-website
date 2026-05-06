'use strict';

const S = {
  en: {
    bio:           'IT Engineer with over 20 years of experience designing, building, and consulting on technology solutions that are simple, resilient, and forward-thinking.',
    servicesTitle: 'Areas of Expertise',
    services:      ['Web Design', 'Graphic & Brand Design', 'Custom Applications', 'Media Production', 'Sound Design & Mixing', 'UI/UX Design', 'Social Media Design', 'Album Art', 'IT Consulting', 'Business Consulting', 'Security Consulting'],
    appsLink:      'EGM APPS',
    quoteLink:     'Request a Consulting Quote',
    langBtn:       'ES',
    toastLang:     '\uD83C\uDF0E También disponible en Español',
    toastDark:     'Too dark? Click here',
    toastLight:    'Too bright? Click here',
    // Form translations
    formTitle:     'Consulting Quote',
    labelName:     'Name *',
    labelEmail:    'Email *',
    labelCompany:  'Company/Organization',
    labelPurpose:  'Purpose * (select all that apply)',
    purposeWebDesign: 'Web Design',
    purposeGraphic: 'Graphic Design / Branding',
    purposeApp: 'Custom Application',
    purposeUIUX: 'UI/UX Design',
    purposeMedia: 'Media Production (Audio/Video)',
    purposeMusic: 'Music/Podcast Production',
    purposeAlbum: 'Album Art',
    purposeIT: 'IT Consulting',
    purposeBusiness: 'Business Consulting',
    purposeSecurity: 'Security Consulting',
    purposeOther: 'Other',
    labelDescription: 'Brief Description *',
    descPlaceholder: 'Tell us about your project, goals, and any specific requirements...',
    labelBudget: 'Budget Range',
    budgetSelect: 'Select one...',
    budgetUnder500: 'Under $500',
    budget500: '$500 - $2,000',
    budget2000: '$2,000 - $5,000',
    budget5000: '$5,000 - $10,000',
    budgetOther: 'Other',
    labelTimeline: 'Timeline',
    timelineSelect: 'Select one...',
    timelineASAP: 'ASAP',
    timeline1: '1-3 months',
    timeline3: '3-6 months',
    timeline6: '6+ months',
    timelineFlexible: 'Flexible',
    submitText: 'Send Quote Request',
    sending: 'Sending…',
    successMsg: 'Thank you! Your request was sent. We\'ll be in touch soon.',
    errorMsg: 'Something went wrong on our end. Please try again or email contact@egerena.com.',
    errorRate: 'Too many submissions. Please try again in an hour.',
    errorCsrf: 'Your session expired. Please reopen the form and try again.',
    errorPurpose: 'Please select at least one purpose.',
    errorName: 'Please enter your name.',
    errorEmail: 'Please enter a valid email address.',
    errorDescription: 'Description must be at least 120 characters.',
    errorGeneric: 'Please check your entries and try again.',
    otherPlaceholder: 'Please specify...'
  },
  es: {
    bio:           'Ingeniero en Sistemas de Información con más de 20 años de experiencia diseñando, desarrollando y asesorando en soluciones tecnológicas simples, resilientes y orientadas al futuro.',
    servicesTitle: 'Áreas de Especialización',
    services:      ['Diseño Web', 'Diseño Gráfico y de Marca', 'Aplicaciones Personalizadas', 'Producción Multimedia', 'Diseño de Sonido y Mezcla', 'Diseño UI/UX', 'Diseño para Redes Sociales', 'Arte de Álbum', 'Consultoría TI', 'Consultoría Empresarial', 'Consultoría de Seguridad'],
    appsLink:      'APLICACIONES DE EGM',
    quoteLink:     'Solicitar Cotización de Consultoría',
    langBtn:       'EN',
    toastLang:     '\uD83C\uDF10 Also available in English',
    toastDark:     '¿Muy oscuro? Haz clic aquí',
    toastLight:    '¿Muy brillante? Haz clic aquí',
    // Form translations
    formTitle:     'Cotización de Consultoría',
    labelName:     'Nombre *',
    labelEmail:    'Correo Electrónico *',
    labelCompany:  'Empresa/Organización',
    labelPurpose:  'Propósito * (seleccione todos los que apliquen)',
    purposeWebDesign: 'Diseño Web',
    purposeGraphic: 'Diseño Gráfico y de Marca',
    purposeApp: 'Aplicación Personalizada',
    purposeUIUX: 'Diseño UI/UX',
    purposeMedia: 'Producción Multimedia (Audio/Video)',
    purposeMusic: 'Producción Musical/Podcast',
    purposeAlbum: 'Arte de Álbum',
    purposeIT: 'Consultoría TI',
    purposeBusiness: 'Consultoría Empresarial',
    purposeSecurity: 'Consultoría de Seguridad',
    purposeOther: 'Otro',
    labelDescription: 'Descripción Breve *',
    descPlaceholder: 'Cuéntanos sobre tu proyecto, objetivos y requisitos específicos...',
    labelBudget: 'Rango de Presupuesto',
    budgetSelect: 'Seleccione uno...',
    budgetUnder500: 'Menos de $500',
    budget500: '$500 - $2,000',
    budget2000: '$2,000 - $5,000',
    budget5000: '$5,000 - $10,000',
    budgetOther: 'Otro',
    labelTimeline: 'Plazo',
    timelineSelect: 'Seleccione uno...',
    timelineASAP: 'Lo antes posible',
    timeline1: '1-3 meses',
    timeline3: '3-6 meses',
    timeline6: '6+ meses',
    timelineFlexible: 'Flexible',
    submitText: 'Enviar Solicitud de Cotización',
    sending: 'Enviando…',
    successMsg: '¡Gracias! Tu solicitud fue enviada. Te contactaremos pronto.',
    errorMsg: 'Algo salió mal de nuestro lado. Por favor intenta de nuevo o escribe a contact@egerena.com.',
    errorRate: 'Demasiados envíos. Por favor intenta de nuevo en una hora.',
    errorCsrf: 'Tu sesión expiró. Por favor reabre el formulario e intenta de nuevo.',
    errorPurpose: 'Por favor selecciona al menos un propósito.',
    errorName: 'Por favor ingresa tu nombre.',
    errorEmail: 'Por favor ingresa un correo electrónico válido.',
    errorDescription: 'La descripción debe tener al menos 120 caracteres.',
    errorGeneric: 'Por favor revisa tus entradas e intenta de nuevo.',
    otherPlaceholder: 'Por favor especifica...'
  }
};

const QEN = [
  {text:"Any sufficiently advanced technology is indistinguishable from magic.",author:"Arthur C. Clarke"},
  {text:"The best way to predict the future is to invent it.",author:"Alan Kay"},
  {text:"Simplicity is the soul of efficiency.",author:"Austin Freeman"},
  {text:"The function of good software is to make the complex appear simple.",author:"Grady Booch"},
  {text:"First, solve the problem. Then, write the code.",author:"John Johnson"},
  {text:"Technology is best when it brings people together.",author:"Matt Mullenweg"},
  {text:"Innovation distinguishes between a leader and a follower.",author:"Steve Jobs"},
  {text:"The advance of technology is based on making it fit in so you don't really notice it.",author:"Bill Gates"},
  {text:"It's not about ideas. It's about making ideas happen.",author:"Scott Belsky"},
  {text:"The art challenges the technology, and the technology inspires the art.",author:"John Lasseter"},
  {text:"Software is eating the world.",author:"Marc Andreessen"},
  {text:"Move fast and build things that last.",author:"Anonymous"},
  {text:"The only way to do great work is to love what you do.",author:"Steve Jobs"},
  {text:"Make it work, make it right, make it fast.",author:"Kent Beck"},
  {text:"Good code is its own best documentation.",author:"Steve McConnell"},
  {text:"The most disruptive things happen when technology reduces friction.",author:"Naval Ravikant"},
  {text:"Premature optimization is the root of all evil.",author:"Donald Knuth"},
  {text:"Always code as if the person maintaining your code will be a violent psychopath who knows where you live.",author:"John Woods"},
  {text:"Programs must be written for people to read, and only incidentally for machines to execute.",author:"Harold Abelson"},
  {text:"The internet is the world's largest library. It's just that all the books are on the floor.",author:"John Allen Paulos"},
  {text:"To invent, you need a good imagination and a pile of junk.",author:"Thomas Edison"},
  {text:"The real danger is not that computers will begin to think like men, but that men will begin to think like computers.",author:"Sydney J. Harris"},
  {text:"It's hardware that makes a machine fast. It's software that makes a fast machine slow.",author:"Craig Bruce"},
  {text:"Every great developer you know got there by solving problems they were unqualified to solve until they did it.",author:"Patrick McKenzie"},
  {text:"Simplicity is about subtracting the obvious and adding the meaningful.",author:"John Maeda"},
  {text:"The best error message is the one that never shows up.",author:"Thomas Fuchs"},
  {text:"There is no cloud. It's just someone else's computer.",author:"Anonymous"},
  {text:"Before software can be reusable it first has to be usable.",author:"Ralph Johnson"},
  {text:"An API that isn't comprehensible isn't usable.",author:"James Gosling"},
  {text:"The computer was born to solve problems that did not exist before.",author:"Bill Gates"},
  {text:"Talk is cheap. Show me the code.",author:"Linus Torvalds"},
  {text:"Code never lies, comments sometimes do.",author:"Ron Jeffries"},
  {text:"Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",author:"Bill Gates"},
  {text:"Walking on water and developing software from a specification are easy if both are frozen.",author:"Edward V. Berard"},
  {text:"A language that doesn't affect the way you think about programming is not worth knowing.",author:"Alan Perlis"},
  {text:"The most important property of a program is whether it accomplishes the intention of its user.",author:"C.A.R. Hoare"},
  {text:"Debugging is twice as hard as writing the code in the first place.",author:"Brian Kernighan"},
  {text:"Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.",author:"Dan Salomon"},
  {text:"Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",author:"Antoine de Saint-Exupéry"},
  {text:"The best thing about a boolean is even if you are wrong, you are only off by a bit.",author:"Anonymous"},
  {text:"Without requirements or design, programming is the art of adding bugs to an empty text file.",author:"Louis Srygley"},
  {text:"You can't have great software without a great team.",author:"Jim McCarthy"},
  {text:"Testing leads to failure, and failure leads to understanding.",author:"Burt Rutan"},
  {text:"It's not a bug. It's an undocumented feature.",author:"Anonymous"},
  {text:"The most dangerous phrase in the language is: We've always done it this way.",author:"Grace Hopper"},
  {text:"In theory, theory and practice are the same. In practice, they're not.",author:"Yogi Berra"},
  {text:"Deleted code is debugged code.",author:"Jeff Sickel"},
  {text:"Experience is the name everyone gives to their mistakes.",author:"Oscar Wilde"},
  {text:"The function of good software is to make the complex appear to be simple.",author:"Grady Booch"}
];

const QES = [
  {text:"Cualquier tecnología suficientemente avanzada es indistinguible de la magia.",author:"Arthur C. Clarke"},
  {text:"La mejor manera de predecir el futuro es inventarlo.",author:"Alan Kay"},
  {text:"La simplicidad es el alma de la eficiencia.",author:"Austin Freeman"},
  {text:"La función del buen software es hacer que lo complejo parezca simple.",author:"Grady Booch"},
  {text:"Primero, resuelve el problema. Luego, escribe el código.",author:"John Johnson"},
  {text:"La tecnología es mejor cuando une a las personas.",author:"Matt Mullenweg"},
  {text:"La innovación distingue a un líder de un seguidor.",author:"Steve Jobs"},
  {text:"El avance tecnológico se basa en integrarse tan bien que apenas lo notas.",author:"Bill Gates"},
  {text:"No se trata de ideas. Se trata de hacer que las ideas sucedan.",author:"Scott Belsky"},
  {text:"El arte desafía a la tecnología, y la tecnología inspira al arte.",author:"John Lasseter"},
  {text:"El software se está comiendo al mundo.",author:"Marc Andreessen"},
  {text:"La única forma de hacer un gran trabajo es amar lo que haces.",author:"Steve Jobs"},
  {text:"Hazlo funcionar, hazlo bien, hazlo rápido.",author:"Kent Beck"},
  {text:"El buen código es su propia y mejor documentación.",author:"Steve McConnell"},
  {text:"Lo más disruptivo ocurre cuando la tecnología reduce la fricción.",author:"Naval Ravikant"},
  {text:"La optimización prematura es la raíz de todos los males.",author:"Donald Knuth"},
  {text:"Los programas deben escribirse para que las personas los lean, y solo incidentalmente para que las máquinas los ejecuten.",author:"Harold Abelson"},
  {text:"El peligro real no es que las computadoras comiencen a pensar como hombres, sino que los hombres comiencen a pensar como computadoras.",author:"Sydney J. Harris"},
  {text:"Es el hardware lo que hace rápida a una máquina. Es el software lo que hace lenta a una máquina rápida.",author:"Craig Bruce"},
  {text:"Todo gran desarrollador llegó ahí resolviendo problemas para los que no estaba calificado hasta que lo hizo.",author:"Patrick McKenzie"},
  {text:"La simplicidad consiste en restar lo obvio y añadir lo significativo.",author:"John Maeda"},
  {text:"El mejor mensaje de error es el que nunca aparece.",author:"Thomas Fuchs"},
  {text:"No existe la nube. Es solo la computadora de alguien más.",author:"Anónimo"},
  {text:"Antes de que el software pueda ser reutilizable, primero tiene que ser usable.",author:"Ralph Johnson"},
  {text:"Una API que no se puede entender no se puede usar.",author:"James Gosling"},
  {text:"La computadora nació para resolver problemas que antes no existían.",author:"Bill Gates"},
  {text:"Para inventar, necesitas una buena imaginación y un montón de cacharros.",author:"Thomas Edison"},
  {text:"Sin datos, eres solo otra persona con una opinión.",author:"W. Edwards Deming"},
  {text:"La tecnología en sí misma no es transformadora. Lo que importa es lo que hacemos con ella.",author:"Malala Yousafzai"},
  {text:"El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el valor de continuar.",author:"Winston Churchill"},
  {text:"Hablar es barato. Muéstrame el código.",author:"Linus Torvalds"},
  {text:"El código nunca miente, los comentarios a veces sí.",author:"Ron Jeffries"},
  {text:"Medir el progreso de programación por líneas de código es como medir el progreso de construcción de aviones por peso.",author:"Bill Gates"},
  {text:"Caminar sobre el agua y desarrollar software a partir de una especificación es fácil si ambos están congelados.",author:"Edward V. Berard"},
  {text:"Un lenguaje que no afecta la forma en que piensas sobre programación no vale la pena conocer.",author:"Alan Perlis"},
  {text:"La propiedad más importante de un programa es si cumple la intención de su usuario.",author:"C.A.R. Hoare"},
  {text:"La depuración es el doble de difícil que escribir el código en primer lugar.",author:"Brian Kernighan"},
  {text:"A veces vale la pena quedarse en la cama el lunes, en lugar de pasar el resto de la semana depurando el código del lunes.",author:"Dan Salomon"},
  {text:"La perfección se logra no cuando no hay nada más que agregar, sino cuando no queda nada que quitar.",author:"Antoine de Saint-Exupéry"},
  {text:"Lo mejor de un booleano es que incluso si te equivocas, solo estás fuera por un bit.",author:"Anónimo"},
  {text:"Sin requisitos o diseño, la programación es el arte de agregar errores a un archivo de texto vacío.",author:"Louis Srygley"},
  {text:"No puedes tener un gran software sin un gran equipo.",author:"Jim McCarthy"},
  {text:"Las pruebas conducen al fracaso, y el fracaso conduce a la comprensión.",author:"Burt Rutan"},
  {text:"No es un error. Es una característica no documentada.",author:"Anónimo"},
  {text:"La frase más peligrosa del lenguaje es: Siempre lo hemos hecho así.",author:"Grace Hopper"},
  {text:"En teoría, la teoría y la práctica son iguales. En la práctica, no lo son.",author:"Yogi Berra"},
  {text:"El código eliminado es código depurado.",author:"Jeff Sickel"},
  {text:"La experiencia es el nombre que todos dan a sus errores.",author:"Oscar Wilde"},
  {text:"La función del buen software es hacer que lo complejo parezca simple.",author:"Grady Booch"}
];

let lang = 'en', theme = 'dark', idx = 0, timer = null;
let qEN = [...QEN], qES = [...QES];

const shuffle = a => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = 0 | Math.random() * (i + 1);
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const getQ = () => lang === 'en' ? qEN : qES;
const $ = id => document.getElementById(id);

function loadPrefs() {
  try {
    theme = localStorage.getItem('egm_theme') || theme;
    lang  = localStorage.getItem('egm_lang')  || lang;
  } catch(e) {}
}
function savePrefs() {
  try {
    localStorage.setItem('egm_theme', theme);
    localStorage.setItem('egm_lang',  lang);
  } catch(e) {}
}

function applyTheme(t, save) {
  const card = $('card');
  const doSwap = () => {
    theme = t;
    document.documentElement.setAttribute('data-theme', t);
    $('icon-sun').style.display  = t === 'dark' ? 'block' : 'none';
    $('icon-moon').style.display = t === 'dark' ? 'none'  : 'block';
    if (save) savePrefs();
  };
  if (save) {
    card.classList.add('fading');
    setTimeout(() => { doSwap(); card.classList.remove('fading'); }, 400);
  } else {
    doSwap();
  }
}
function toggleTheme() { applyTheme(theme === 'dark' ? 'light' : 'dark', true); }

function applyLang(l, animate, save) {
  lang = l;
  const s = S[l], card = $('card');
  const update = () => {
    $('bioText').textContent       = s.bio;
    $('servicesTitle').textContent = s.servicesTitle;
    const grid = $('servicesGrid');
    grid.innerHTML = s.services.map((svc, i) => 
      `<span class="service-tag">${svc}</span>${i < s.services.length - 1 ? '<span class="service-sep">~</span>' : ''}`
    ).join('');
    $('appsLinkText').textContent  = s.appsLink;
    $('quoteLinkText').textContent = s.quoteLink;
    $('langBtn').textContent       = s.langBtn;
    
    // Update form labels
    if ($('modalTitle')) $('modalTitle').textContent = s.formTitle;
    if ($('labelName')) $('labelName').textContent = s.labelName;
    if ($('labelEmail')) $('labelEmail').textContent = s.labelEmail;
    if ($('labelCompany')) $('labelCompany').textContent = s.labelCompany;
    if ($('labelPurpose')) $('labelPurpose').textContent = s.labelPurpose;
    if ($('purposeWebDesign')) $('purposeWebDesign').textContent = s.purposeWebDesign;
    if ($('purposeGraphic')) $('purposeGraphic').textContent = s.purposeGraphic;
    if ($('purposeApp')) $('purposeApp').textContent = s.purposeApp;
    if ($('purposeUIUX')) $('purposeUIUX').textContent = s.purposeUIUX;
    if ($('purposeMedia')) $('purposeMedia').textContent = s.purposeMedia;
    if ($('purposeMusic')) $('purposeMusic').textContent = s.purposeMusic;
    if ($('purposeAlbum')) $('purposeAlbum').textContent = s.purposeAlbum;
    if ($('purposeIT')) $('purposeIT').textContent = s.purposeIT;
    if ($('purposeBusiness')) $('purposeBusiness').textContent = s.purposeBusiness;
    if ($('purposeSecurity')) $('purposeSecurity').textContent = s.purposeSecurity;
    if ($('purposeOtherLabel')) $('purposeOtherLabel').textContent = s.purposeOther;
    if ($('labelDescription')) $('labelDescription').textContent = s.labelDescription;
    if ($('formDescription')) $('formDescription').placeholder = s.descPlaceholder;
    if ($('labelBudget')) $('labelBudget').textContent = s.labelBudget;
    if ($('budgetSelect')) $('budgetSelect').textContent = s.budgetSelect;
    if ($('budgetUnder500')) $('budgetUnder500').textContent = s.budgetUnder500;
    if ($('budget500')) $('budget500').textContent = s.budget500;
    if ($('budget2000')) $('budget2000').textContent = s.budget2000;
    if ($('budget5000')) $('budget5000').textContent = s.budget5000;
    if ($('budgetOther')) $('budgetOther').textContent = s.budgetOther;
    if ($('labelTimeline')) $('labelTimeline').textContent = s.labelTimeline;
    if ($('timelineSelect')) $('timelineSelect').textContent = s.timelineSelect;
    if ($('timelineASAP')) $('timelineASAP').textContent = s.timelineASAP;
    if ($('timeline1')) $('timeline1').textContent = s.timeline1;
    if ($('timeline3')) $('timeline3').textContent = s.timeline3;
    if ($('timeline6')) $('timeline6').textContent = s.timeline6;
    if ($('timelineFlexible')) $('timelineFlexible').textContent = s.timelineFlexible;
    if ($('submitText')) $('submitText').textContent = s.submitText;
    if ($('formOtherPurpose')) $('formOtherPurpose').placeholder = s.otherPlaceholder;
    
    document.documentElement.setAttribute('lang', l);
    idx = 0;
    renderQuote(false);
    restartRotator();
  };
  if (animate) {
    card.classList.add('fading');
    setTimeout(() => { update(); card.classList.remove('fading'); }, 500);
  } else {
    update();
  }
  if (save) savePrefs();
}
function toggleLang() { applyLang(lang === 'en' ? 'es' : 'en', true, true); }

function renderQuote(animate) {
  const q = getQ()[idx % getQ().length];
  const t = $('quoteText'), a = $('quoteAuthor');
  if (animate) {
    t.classList.add('fade'); a.classList.add('fade');
    setTimeout(() => {
      t.textContent = '\u201C' + q.text + '\u201D';
      a.textContent = '\u2014 ' + q.author;
      t.classList.remove('fade'); a.classList.remove('fade');
    }, 520);
  } else {
    t.textContent = '\u201C' + q.text + '\u201D';
    a.textContent = '\u2014 ' + q.author;
  }
}
function restartRotator() {
  clearInterval(timer);
  timer = setInterval(() => { idx = (idx + 1) % getQ().length; renderQuote(true); }, 8000);
}

function showToast(id, text, clickable, dur) {
  const el = $(id);
  if (!el) return;
  el.textContent = text;
  el.classList.toggle('active', clickable);
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show', 'active'), dur);
}

function openQuote(e) {
  e.preventDefault();
  const modal = $('quoteModal');
  if (!modal) return;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = $('quoteModal');
  if (!modal) return;
  modal.classList.remove('show');
  document.body.style.overflow = '';
  const form = $('quoteForm');
  if (form) form.reset();
  const submitBtn = $('submitBtn');
  if (submitBtn) {
    submitBtn.disabled = false;
    const txt = $('submitText');
    if (txt) txt.textContent = S[lang].submitText;
  }
  const msg = $('formMessage');
  if (msg) {
    msg.classList.add('form-message-hidden');
    msg.classList.remove('success', 'error');
    msg.textContent = '';
  }
  const otherGroup = $('otherPurposeGroup');
  if (otherGroup) otherGroup.classList.add('form-other-hidden');
}

function handleFormSubmit(e) {
  const form = e.target;
  const submitBtn = $('submitBtn');
  const submitText = $('submitText');
  const formMsg = $('formMessage');
  const s = S[lang];

  const showError = (text) => {
    e.preventDefault();
    if (formMsg) {
      formMsg.textContent = text;
      formMsg.className = 'form-message error';
    }
    submitBtn.disabled = false;
    if (submitText) submitText.textContent = s.submitText;
  };

  const name = form.elements['name']?.value.trim() || '';
  const email = form.elements['email']?.value.trim() || '';
  const description = form.elements['description']?.value.trim() || '';
  const purposes = form.querySelectorAll('input[name="purpose[]"]:checked');

  if (!name)                              return showError(s.errorName);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                                          return showError(s.errorEmail);
  if (description.length < 120)          return showError(s.errorDescription);
  if (purposes.length === 0)              return showError(s.errorPurpose);

  submitBtn.disabled = true;
  if (submitText) submitText.textContent = s.sending;
  if (formMsg) {
    formMsg.classList.add('form-message-hidden');
    formMsg.classList.remove('success', 'error');
  }
}

function toggleOtherPurpose() {
  const otherCheckbox = $('purposeOtherCheckbox');
  const otherGroup = $('otherPurposeGroup');
  if (otherCheckbox && otherGroup) {
    if (otherCheckbox.checked) {
      otherGroup.classList.remove('form-other-hidden');
    } else {
      otherGroup.classList.add('form-other-hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPrefs();
  qEN = shuffle(QEN);
  qES = shuffle(QES);
  applyTheme(theme, false);
  applyLang(lang, false, false);
  idx = Math.floor(Math.random() * getQ().length);
  renderQuote(false);
  restartRotator();

  const bind = (id, fn) => { const el = $(id); if (el) el.addEventListener('click', fn); };
  bind('langToggle',  toggleLang);
  bind('themeToggle', toggleTheme);
  bind('themeToast',  () => { toggleTheme(); $('themeToast').classList.remove('show', 'active'); });
  bind('quoteLink',   openQuote);
  bind('closeModal',  closeModal);
  
  // Modal click outside to close
  const modal = $('quoteModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  
  // Form submission
  const form = $('quoteForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  // Other purpose checkbox
  const otherCheckbox = $('purposeOtherCheckbox');
  if (otherCheckbox) {
    otherCheckbox.addEventListener('change', toggleOtherPurpose);
  }
  
  // Check for form response in URL
  const params = new URLSearchParams(window.location.search);
  if (params.has('quote')) {
    const status = params.get('quote');
    const code   = params.get('c') || '';
    const formMsg = $('formMessage');
    const s = S[lang];

    const cleanUrl = () => window.history.replaceState({}, '', window.location.pathname);

    if (status === 'success') {
      // Open modal briefly to show success, then close
      if (modal && formMsg) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        formMsg.textContent = s.successMsg;
        formMsg.className = 'form-message success';
        cleanUrl();
        setTimeout(() => closeModal(), 4000);
      }
    } else if (status === 'invalid' || status === 'error') {
      // Map error code to friendly message
      let text = s.errorMsg;
      if (status === 'invalid') {
        if      (code === 'name')        text = s.errorName;
        else if (code === 'email')       text = s.errorEmail;
        else if (code === 'description') text = s.errorDescription;
        else if (code === 'purpose')     text = s.errorPurpose;
        else                             text = s.errorGeneric;
      } else if (code === 'rate') {
        text = s.errorRate;
      }
      if (modal && formMsg) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        formMsg.textContent = text;
        formMsg.className = 'form-message error';
        cleanUrl();
      }
    }
  }

  // toasts removed per design decision

  document.querySelector('.foot').innerHTML = `© 2003–${new Date().getFullYear()} EGerena.com`;
});
