export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/favicon.svg') {
      return new Response(FAVICON_SVG, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' } });
    }
    if (path === '/favicon.ico') {
      const ico = Uint8Array.from(atob('AAABAAEAEBAAAAAAIADzAAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAALpJREFUeJxjZIACblmr/wwkgK+PjzEyMDAwMJGjGVkPIzmakQETJZqpb0B+ehTD0hmtDAwMDAzHdyxkCPByZJCSEGXYumISw6ubexmObV/AwMSEaicLIRvK8xMYPn3+yqBo6M3w9dsP/C748uUbg5ioEIOwED+DoAAfw5ev3xgYGRmJ98LGHQcY2NhYGW6e3MBw6+5DhiMnzjN0TVrAIMDHy/DgwjaGk7sWYXhhuEXjgBjAKOt3Y2ADEQA4Ijai2lFAPAAAAABJRU5ErkJggg=='), c => c.charCodeAt(0));
      return new Response(ico, { headers: { 'Content-Type': 'image/x-icon', 'Cache-Control': 'public, max-age=86400' } });
    }
    if (path === '/sitemap.xml') {
      return new Response(SITEMAP_XML, { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' } });
    }
    if (path === '/legal' || path === '/legal.html') {
      return new Response(LEGAL_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    if (request.method === 'POST' && path === '/verify-password') {
      try {
        const body = await request.json();
        const entered = (body.password || '').trim().toUpperCase();
        const correct = (env.UC_PASSWORD || '').trim().toUpperCase();
        if (entered === correct) {
          return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      } catch(e) {
        return new Response(JSON.stringify({ ok: false }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
    }

    return new Response(INDEX_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
};

const INDEX_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Free UK self-employed income, mileage and Universal Credit calculator. Estimate net income and UC in one page — works on phone and desktop.">
<title>uccalc.co.uk — Income, Mileage &amp; UC Calculator (UK)</title>

<!-- SEO -->
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://uccalc.co.uk/">

<!-- FAVICON — FIXED -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/x-icon" href="/favicon.ico">

<!-- Open Graph -->
<meta property="og:title" content="uccalc.co.uk — Income, Mileage & UC Calculator (UK)">
<meta property="og:description" content="Free UK self-employed income, mileage and Universal Credit calculator. Estimate net income and UC in one page — works on phone and desktop.">
<meta property="og:url" content="https://uccalc.co.uk/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="UCCalc">

<!-- Schema.org -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "UCCalc",
  "url": "https://uccalc.co.uk",
  "description": "Free UK self-employed income, mileage and Universal Credit calculator. Estimate net income and UC in one page.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "inLanguage": "en-GB",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "GBP"
  }
}
</script>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,600&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{
  --navy:#0b1d3a;--blue:#1d4ed8;--blue-light:#3b82f6;--blue-pale:#dbeafe;--blue-ghost:#eff6ff;
  --violet:#6d28d9;--violet-light:#ede9fe;--emerald:#059669;--emerald-light:#d1fae5;
  --rose:#e11d48;--rose-light:#ffe4e6;--amber:#d97706;--amber-light:#fef3c7;
  --g50:#f8fafc;--g100:#f1f5f9;--g200:#e2e8f0;--g300:#cbd5e1;--g400:#94a3b8;
  --g600:#475569;--g700:#334155;--g800:#1e293b;
  --r-sm:8px;--r-md:12px;--r-lg:18px;--r-xl:24px;
  --shadow:0 2px 16px rgba(10,25,60,0.09),0 1px 3px rgba(10,25,60,0.06);
}
body{font-family:'DM Sans',sans-serif;font-weight:600;background:#eaf0fb;color:var(--g800);min-height:100vh;-webkit-font-smoothing:antialiased;display:flex;flex-direction:column}
.skip-link{position:absolute;left:-9999px;top:8px;z-index:999;padding:10px 16px;background:#fff;color:var(--blue);font-weight:800;border-radius:8px;text-decoration:none}
.skip-link:focus{left:12px;outline:3px solid var(--blue-light)}
.hdr{background:var(--navy);padding:10px 16px 10px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;position:sticky;top:0;z-index:100;box-shadow:0 4px 24px rgba(0,20,50,0.35)}
@media(min-width:720px){.hdr{padding:12px 28px;flex-wrap:nowrap}}
.hdr-nav{display:flex;align-items:center;gap:4px;flex-wrap:wrap;justify-content:flex-end}
.hdr-nav a{color:#bfdbfe;text-decoration:none;font-size:12px;font-weight:700;padding:8px 12px;border-radius:8px;white-space:nowrap}
.hdr-nav a:hover{background:rgba(255,255,255,0.12);color:#fff}
@media(min-width:720px){.hdr-nav a{font-size:13px;padding:8px 14px}}
.brand{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none}
.brand-icon{width:34px;height:34px;background:var(--blue);border-radius:9px;display:flex;align-items:center;justify-content:center}
.brand-icon svg{width:18px;height:18px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.brand-name{font-size:15px;font-weight:800;color:#fff}
.brand-name em{font-style:normal;color:#60a5fa}
.brand-tld{font-size:11px;font-weight:600;color:#93c5fd;opacity:0.8;letter-spacing:0.01em}
.hdr-tag{font-size:11px;font-weight:500;color:#bfdbfe;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.25);padding:4px 12px;border-radius:20px;letter-spacing:0.04em}
.hero{display:flex;min-height:420px;overflow:hidden}
.hero-left{flex:1 1 55%;background:linear-gradient(145deg,#0b1d3a 0%,#1a3a6e 100%);display:flex;align-items:center;padding:52px 40px 52px 48px;position:relative;overflow:hidden}
.hero-left::after{content:'';position:absolute;right:-60px;top:50%;transform:translateY(-50%);width:120px;height:120%;background:linear-gradient(145deg,#0b1d3a 0%,#1a3a6e 100%);clip-path:polygon(0 0,100% 10%,100% 90%,0 100%);z-index:2}
.hero-left-inner{position:relative;z-index:3;max-width:440px}
.hero-right{flex:0 0 45%;position:relative;overflow:hidden}
.hero-right img{width:100%;height:100%;object-fit:cover;display:block}
@media(max-width:700px){.hero{flex-direction:column}.hero-right{flex:0 0 220px;width:100%}.hero-left{flex:1;padding:36px 24px 40px;justify-content:center;text-align:center}.hero-left::after{display:none}.hero-left-inner{max-width:100%}.hero-sub{margin-left:auto;margin-right:auto}.hero-cta-row{justify-content:center}}
.live-dot{width:7px;height:7px;background:#34d399;border-radius:50%;animation:pulse 2s infinite;display:inline-block}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.hero-badge{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:#bfdbfe;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);padding:5px 14px;border-radius:20px;margin-bottom:20px}
.hero h1{font-size:clamp(22px,3.2vw,36px);font-weight:800;color:#fff;line-height:1.18;margin-bottom:14px;letter-spacing:-0.02em}
.hero h1 em{font-style:normal;color:#93c5fd}
.hero-sub{font-size:14px;font-weight:600;color:rgba(255,255,255,0.78);max-width:380px;margin:0 0 28px;line-height:1.7}
.hero-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}
.hero-cta{display:inline-flex;align-items:center;justify-content:center;padding:12px 22px;border-radius:12px;font-weight:800;font-size:14px;text-decoration:none;transition:transform 0.15s,box-shadow 0.15s}
.hero-cta-primary{background:#fff;color:var(--navy);box-shadow:0 4px 20px rgba(0,0,0,0.25)}
.hero-cta-primary:hover{box-shadow:0 6px 28px rgba(0,0,0,0.35)}
.page{max-width:860px;margin:0 auto;padding:28px 16px 48px;width:100%;flex:1}
.disclaimer-banner{display:flex;gap:8px;align-items:center;background:#fffbeb;border:1px solid #fcd34d;border-radius:var(--r-sm);padding:8px 14px;margin-bottom:16px}
.disclaimer-banner-icon{flex-shrink:0;width:16px;height:16px}
.disclaimer-banner-icon svg{width:100%;height:100%;stroke:#b45309;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.disclaimer-banner-title{font-size:12px;font-weight:800;color:#92400e;margin-right:4px}
.disclaimer-banner-text p{font-size:12px;font-weight:600;color:#78350f;line-height:1.4;margin:0;display:inline}
.section-block{scroll-margin-top:88px}
.section-kicker{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:var(--g600);margin-bottom:8px;padding:0 2px}
.section-kicker span{color:var(--blue)}
.card{background:#fff;border-radius:var(--r-xl);box-shadow:var(--shadow);margin-bottom:20px;overflow:hidden}
.card-inc{border-left:4px solid var(--blue)}
.card-uc{border-left:4px solid var(--violet)}
.card-hdr{display:flex;align-items:center;gap:13px;padding:16px 22px;border-bottom:1px solid var(--g100)}
.card-inc .card-hdr{background:linear-gradient(90deg,var(--blue-ghost) 0%,#fff 100%)}
.card-uc .card-hdr{background:linear-gradient(90deg,var(--violet-light) 0%,#fff 100%)}
.ch-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ch-icon svg{width:18px;height:18px;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.chi-blue{background:var(--blue-pale)}.chi-blue svg{stroke:var(--blue)}
.chi-violet{background:var(--violet-light)}.chi-violet svg{stroke:var(--violet)}
.ch-txt h2{font-size:17px;font-weight:800;color:var(--g800);letter-spacing:-0.02em}
.ch-txt p{font-size:12px;font-weight:600;color:var(--g400);margin-top:2px}
.lock-badge{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--violet);background:var(--violet-light);border:1.5px solid #c4b5fd;padding:7px 13px;border-radius:20px}
.lock-badge svg{width:13px;height:13px;stroke:var(--violet);fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.card-body{padding:22px}
.sec-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:var(--g600);margin:18px 0 10px;display:flex;align-items:center;gap:10px}
.sec-label::after{content:'';flex:1;height:1px;background:var(--g200)}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
@media(max-width:560px){.g2,.g3{grid-template-columns:1fr}}
.field label{display:block;font-size:13px;font-weight:700;color:var(--g700);margin-bottom:5px}
.field label .req{color:var(--rose)}
.field input,.field select{width:100%;height:40px;padding:0 11px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:var(--g800);background:var(--g50);border:1.5px solid var(--g200);border-radius:var(--r-sm);transition:border-color 0.18s,box-shadow 0.18s;outline:none}
.field input:focus,.field select:focus{border-color:var(--blue-light);background:#fff;box-shadow:0 0 0 3px rgba(59,130,246,0.12)}
.card-uc .field input:focus{border-color:var(--violet);box-shadow:0 0 0 3px rgba(109,40,217,0.11)}
.field input::placeholder{color:var(--g300)}
.field input[readonly]{background:var(--g100);color:var(--g600);cursor:default}
.btn-row{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;border-radius:var(--r-sm);padding:10px 18px;cursor:pointer;border:none;transition:all 0.18s;white-space:nowrap}
.btn svg{width:15px;height:15px;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.btn-clear{background:var(--g100);color:var(--g700);border:1.5px solid var(--g300)}
.btn-clear:hover{background:var(--g200)}.btn-clear svg{stroke:var(--g600)}
.btn-primary{background:var(--blue);color:#fff;flex:1;font-size:14px;font-weight:800;padding:12px 18px}
.btn-primary:hover{background:#1e40af}.btn-primary svg{stroke:#fff}
.btn-violet-fill{background:var(--violet);color:#fff;flex:1;font-size:14px;font-weight:800;padding:12px 18px}
.btn-violet-fill:hover{background:#5b21b6}.btn-violet-fill svg{stroke:#fff}
.btn-outline{background:#fff;color:var(--blue);border:1.5px solid var(--blue-pale)}
.btn-outline:hover{background:var(--blue-ghost)}.btn-outline svg{stroke:var(--blue)}
.btn-outline-v{background:#fff;color:var(--violet);border:1.5px solid #c4b5fd}
.btn-outline-v:hover{background:var(--violet-light)}.btn-outline-v svg{stroke:var(--violet)}
.alert{display:none;align-items:center;gap:9px;font-size:13px;font-weight:700;padding:10px 14px;border-radius:var(--r-sm);margin-bottom:14px}
.alert.show{display:flex}
.alert svg{width:15px;height:15px;flex-shrink:0;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.alert-err{background:var(--rose-light);color:var(--rose);border:1px solid #fecdd3}.alert-err svg{stroke:var(--rose)}
.alert-ok{background:var(--emerald-light);color:var(--emerald);border:1px solid #a7f3d0}.alert-ok svg{stroke:var(--emerald)}
.result-panel{display:none;margin-top:20px;border-top:1px solid var(--g100);padding-top:20px}
.result-panel.show{display:block}
.btable{width:100%;table-layout:fixed;border-collapse:collapse;margin-bottom:16px}
.btable td{padding:8px 4px;font-size:13px;font-weight:600;border-bottom:1px solid var(--g100);vertical-align:middle}
.btable tr:last-child td{border-bottom:none}
.td-l{color:var(--g600);width:58%;padding-right:8px}.td-r{text-align:right;font-weight:700;color:var(--g800);white-space:nowrap;width:42%;vertical-align:top}
.tr-tot td{font-weight:800;font-size:15px;padding-top:12px;border-top:2px solid var(--g200);border-bottom:none}
.card-inc .tr-tot .td-r{color:var(--blue)}
.card-uc .tr-tot .td-r{color:var(--violet)}
.metrics{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:480px){.metrics{grid-template-columns:1fr}}
.metric{border-radius:var(--r-md);padding:14px 16px;border:1px solid transparent}
.m-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:5px}
.m-val{font-size:28px;font-weight:800;letter-spacing:-0.02em}
.m-blue{background:var(--blue-ghost);border-color:var(--blue-pale)}.m-blue .m-label{color:var(--blue)}.m-blue .m-val{color:var(--blue)}
.m-rose{background:var(--rose-light);border-color:#fecdd3}.m-rose .m-label{color:#be123c}.m-rose .m-val{color:var(--rose)}
.m-violet{background:var(--violet-light);border-color:#c4b5fd}.m-violet .m-label{color:#5b21b6}.m-violet .m-val{color:var(--violet)}
.m-amber{background:var(--amber-light);border-color:#fde68a}.m-amber .m-label{color:#b45309}.m-amber .m-val{color:var(--amber)}
.mif-warn{background:#fef3c7;border:1px solid #fde68a;border-radius:var(--r-sm);padding:10px 14px;font-size:13px;font-weight:600;color:#92400e;margin-top:12px;display:none}
.mif-warn.show{display:block}
.footer{text-align:center;padding:28px 16px 32px;font-size:12px;font-weight:600;color:var(--g600);border-top:1px solid var(--g200);background:var(--g50);margin-top:auto}
.footer-inner{max-width:560px;margin:0 auto}
.footer-brand{font-size:15px;font-weight:800;color:var(--g800);margin-bottom:8px}
.footer-brand em{font-style:normal;color:var(--blue)}
.footer-note{line-height:1.6;margin-bottom:16px}
.footer-meta{font-size:11px;color:var(--g400);margin-bottom:4px}
.footer-top{display:inline-flex;align-items:center;gap:6px;margin-top:18px;padding:10px 16px;color:#fff;background:var(--blue);font-weight:800;text-decoration:none;font-size:14px;border-radius:10px}
.footer-top::after{content:'↑';font-size:18px;font-weight:900}
.footer-top:hover{background:#1e40af}
.page-toolbar{display:flex;justify-content:flex-end;margin-bottom:16px}
.page-toolbar .btn-clear{padding:10px 16px;font-size:13px}
.expense-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.expense-row input[type="text"]{flex:1;height:40px;padding:0 11px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:var(--g800);background:var(--g50);border:1.5px solid var(--g200);border-radius:var(--r-sm);outline:none}
.expense-row input[type="text"]:focus{border-color:var(--blue-light);background:#fff;box-shadow:0 0 0 3px rgba(59,130,246,0.12)}
.expense-row input[type="number"]{width:110px;height:40px;padding:0 11px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:var(--g800);background:var(--g50);border:1.5px solid var(--g200);border-radius:var(--r-sm);outline:none;flex-shrink:0}
.expense-row input[type="number"]:focus{border-color:var(--blue-light);background:#fff;box-shadow:0 0 0 3px rgba(59,130,246,0.12)}
.expense-row .pound{font-size:14px;font-weight:700;color:var(--g600);flex-shrink:0}
.btn-remove-expense{width:32px;height:32px;border-radius:6px;border:1.5px solid #fecdd3;background:var(--rose-light);color:var(--rose);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all 0.18s}
.btn-remove-expense svg{width:14px;height:14px;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;fill:none}
.btn-add-expense{display:inline-flex;align-items:center;gap:7px;margin-top:4px;padding:9px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:var(--blue);background:var(--blue-ghost);border:1.5px dashed var(--blue-pale);border-radius:var(--r-sm);cursor:pointer;transition:all 0.18s}
.btn-add-expense:hover{background:var(--blue-pale)}
.btn-add-expense svg{width:14px;height:14px;stroke:var(--blue);stroke-width:2.5;fill:none}

/* ===== PAYWALL ===== */
.paywall{padding:36px 24px;text-align:center;background:linear-gradient(145deg,#f5f3ff 0%,#ede9fe 100%);border-top:1px solid #ddd6fe}
.paywall-icon{width:68px;height:68px;background:var(--violet);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;box-shadow:0 8px 24px rgba(109,40,217,0.3)}
.paywall-icon svg{width:30px;height:30px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.paywall h3{font-size:22px;font-weight:800;color:var(--navy);margin-bottom:8px}
.paywall-desc{font-size:14px;font-weight:600;color:var(--g600);line-height:1.6;max-width:380px;margin:0 auto 4px}
.paywall-price{font-size:32px;font-weight:800;color:var(--violet);margin:14px 0 4px}
.paywall-price span{font-size:14px;font-weight:600;color:var(--g400)}
.paywall-features{display:flex;flex-direction:column;gap:7px;margin:16px auto;max-width:280px;text-align:left}
.paywall-features li{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:600;color:var(--g700);list-style:none}
.paywall-features li::before{content:'✓';color:var(--emerald);font-weight:800;font-size:15px;flex-shrink:0}
.btn-pay{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:var(--violet);color:#fff;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:800;padding:15px 32px;border-radius:14px;text-decoration:none;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(109,40,217,0.35);transition:all 0.2s;margin-bottom:14px;width:100%;max-width:320px}
.btn-pay:hover{background:#5b21b6;box-shadow:0 6px 28px rgba(109,40,217,0.45);transform:translateY(-1px)}
.btn-pay svg{width:18px;height:18px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pay-methods{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px;flex-wrap:wrap}
.pay-method-badge{font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;background:#fff;border:1.5px solid var(--g200);color:var(--g700)}
.paywall-divider{display:flex;align-items:center;gap:12px;margin:16px auto;max-width:320px}
.paywall-divider::before,.paywall-divider::after{content:'';flex:1;height:1px;background:var(--g200)}
.paywall-divider span{font-size:12px;font-weight:700;color:var(--g400)}
.unlock-form{display:flex;flex-direction:column;align-items:center;gap:10px;max-width:320px;margin:0 auto}
.unlock-input-row{display:flex;gap:8px;width:100%}
.unlock-input{flex:1;height:44px;padding:0 14px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;color:var(--g800);background:#fff;border:2px solid var(--g200);border-radius:10px;outline:none;transition:border-color 0.18s,box-shadow 0.18s;letter-spacing:0.05em}
.unlock-input:focus{border-color:var(--violet);box-shadow:0 0 0 3px rgba(109,40,217,0.12)}
.unlock-input::placeholder{color:var(--g300);letter-spacing:0;font-weight:600}
.btn-unlock{height:44px;padding:0 20px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:800;background:var(--navy);color:#fff;border:none;border-radius:10px;cursor:pointer;transition:all 0.18s;white-space:nowrap}
.btn-unlock:hover{background:#1a3a6e}
.unlock-err{font-size:12px;font-weight:700;color:var(--rose);display:none;margin-top:2px}
.unlock-err.show{display:block}
.unlock-input-wrap{position:relative;flex:1;display:flex;align-items:center}
.unlock-input-wrap .unlock-input{width:100%;padding-right:42px}
.btn-eye{position:absolute;right:10px;background:none;border:none;cursor:pointer;padding:4px;display:flex;align-items:center;color:var(--g400)}
.btn-eye:hover{color:var(--g700)}
.btn-eye svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.btn-toggle-uc{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--g600);background:var(--g100);border:1.5px solid var(--g200);padding:7px 13px;border-radius:20px;cursor:pointer;transition:all 0.18s}
.btn-toggle-uc:hover{background:var(--g200)}
.btn-toggle-uc svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.paywall-secure{font-size:11px;font-weight:600;color:var(--g400);display:flex;align-items:center;justify-content:center;gap:5px;margin-top:18px}
.paywall-secure svg{width:12px;height:12px;stroke:var(--g400);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.expiry-warning-bar{display:none;align-items:center;gap:10px;background:#fef3c7;border:1.5px solid #fcd34d;border-radius:10px;padding:12px 16px;margin-bottom:16px;text-align:left}
.expiry-warning-bar svg{width:18px;height:18px;flex-shrink:0;stroke:#b45309;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.expiry-warning-bar strong{font-size:13px;color:#92400e;display:block}
.expiry-warning-bar span{font-size:12px;font-weight:600;color:#b45309}
.expiry-warning-bar a{color:#92400e;font-weight:800;text-decoration:underline}
</style>

<a class="skip-link" href="#section-income">Skip to calculator</a>

<header class="hdr">
  <a href="#top" class="brand">
    <div class="brand-icon"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
    <span class="brand-name">uc<em>calc</em></span>
  </a>
  <nav class="hdr-nav" aria-label="On this page">
    <a href="#top">Home</a>
    <a href="#section-income">Income</a>
  </nav>
</header>

<section class="hero" id="top">
  <div class="hero-left">
    <div class="hero-left-inner">
      <div class="hero-badge"><span class="live-dot"></span>Self-employed income tool</div>
      <h1>Income &amp; Mileage<br><em>Universal Credit</em><br>Calculator</h1>
      <p class="hero-sub">Track your earnings, claim vehicle mileage and deduct expenses to see how much Universal Credit you could receive.</p>
      <div class="hero-cta-row">
        <a class="hero-cta hero-cta-primary" href="#section-income">Start with income</a>
      </div>
    </div>
  </div>
  <div class="hero-right">
    <img src="https://pub-312d3078629e491faac32bc31bf01e5b.r2.dev/uc2.jpg" alt="Vehicle Mileage & Expenses Universal Credit Calculator" loading="eager">
  </div>
</section>

<main class="page" id="main">
  <div class="page-toolbar">
    <button type="button" class="btn btn-clear" onclick="clearAll()">
      <svg viewBox="0 0 24 24"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      Clear all
    </button>
  </div>

  <!-- WARNING BANNER -->
  <div class="disclaimer-banner" role="alert">
    <div class="disclaimer-banner-icon">
      <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    </div>
    <div class="disclaimer-banner-text">
      <span class="disclaimer-banner-title">⚠ Important:</span>
      <p>Not financial advice. Figures are estimates for planning only. Not affiliated with DWP, HMRC or the UK Government. Always verify your entitlement at <a href="https://www.gov.uk/universal-credit" target="_blank" rel="noopener" style="color:#92400e;font-weight:800;">gov.uk</a>.</p>
    </div>
  </div>

  <!-- STEP 1 -->
  <section id="section-income" class="section-block" aria-labelledby="income-heading">
    <p class="section-kicker"><span>Step 1</span> — Income &amp; expenses</p>
    <div class="card card-inc">
      <div class="card-hdr">
        <div class="ch-icon chi-blue"><svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></div>
        <div class="ch-txt"><h2 id="income-heading">Income &amp; Expenses</h2><p>Enter your earnings and deductible costs for the period</p></div>
      </div>
      <div class="card-body">
        <div id="incAlert" class="alert alert-err"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><span id="incAlertMsg"></span></div>
        <div id="incOk" class="alert alert-ok"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Calculation complete — net income updated below.</span></div>
        <div class="sec-label">Period &amp; earnings</div>
        <div class="g2">
          <div class="field"><label>Start date <span class="req">*</span></label><input type="date" id="startDate"></div>
          <div class="field"><label>End date <span class="req">*</span></label><input type="date" id="endDate"></div>
          <div class="field"><label>Gross income (£) <span class="req">*</span></label><input type="number" id="incomeSalary" min="0" step="0.01" placeholder="0.00"></div>
          <div class="field"><label>Business miles <span class="req">*</span></label><input type="number" id="totalMileage" min="0" step="1" placeholder="0"></div>
        </div>
        <div class="sec-label">Allowable expenses — Fixed</div>
        <div class="g3">
          <div class="field"><label>Airport fees (£)</label><input type="number" id="airportFees" min="0" step="0.01" placeholder="0.00"></div>
          <div class="field"><label>Congestion charge (£)</label><input type="number" id="congestionCharge" min="0" step="0.01" placeholder="0.00"></div>
          <div class="field"><label>Mobile bills (£)</label><input type="number" id="mobileBills" min="0" step="0.01" placeholder="0.00"></div>
        </div>
        <div class="sec-label">My Expenses</div>
        <div id="customExpenseList"></div>
        <button type="button" class="btn-add-expense" onclick="addExpenseRow()">
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>Add expense
        </button>
        <div class="btn-row">
          <button class="btn btn-primary" onclick="calcIncome()"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>Calculate income</button>
          <button class="btn btn-outline" onclick="saveIncomePDF()"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Save PDF</button>
          <button type="button" class="btn btn-clear" onclick="clearIncomeOnly()">Clear</button>
        </div>
        <div id="incomeResult" class="result-panel">
          <table class="btable" id="incTable"></table>
          <div class="metrics">
            <div class="metric m-rose"><div class="m-label">Total expenses</div><div class="m-val" id="mTotalExp">—</div></div>
            <div class="metric m-blue"><div class="m-label">Net income</div><div class="m-val" id="mNetIncome">—</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- STEP 2 — UC LOCKED -->
  <section id="section-uc" class="section-block" aria-labelledby="uc-heading">
    <p class="section-kicker"><span>Step 2</span> — UC</p>
    <div class="card card-uc">
      <div class="card-hdr">
        <div class="ch-icon chi-violet"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
        <div class="ch-txt"><h2 id="uc-heading">UC Payment</h2><p>Calculate your UC entitlement after the earnings taper</p></div>
        <div class="lock-badge" id="lockBadge"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Premium</div>
        <button type="button" class="btn-toggle-uc" id="ucToggleBtn" onclick="toggleUCSection()" style="display:none">
          <svg id="ucToggleIcon" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>
          <span id="ucToggleLabel">Hide</span>
        </button>
      </div>

      <!-- PAYWALL -->
      <div id="ucLockWrapper">
        <div class="paywall">
          <div id="expiryBanner" style="display:none;align-items:center;gap:10px;background:#fef3c7;border:1.5px solid #fcd34d;border-radius:10px;padding:12px 16px;margin-bottom:20px;text-align:left">
            <svg viewBox="0 0 24 24" style="width:18px;height:18px;flex-shrink:0;stroke:#b45309;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div><strong style="font-size:13px;color:#92400e;display:block">Your access has expired</strong><span style="font-size:12px;font-weight:600;color:#b45309">Your 30-day access has ended. Please pay again to unlock the calculator.</span></div>
          </div>
          <div class="paywall-icon"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
          <h3>Unlock UC Calculator</h3>
          <p class="paywall-desc">Get instant access to the full Universal Credit calculator. See your exact UC entitlement based on your real self-employed income.</p>
          <div class="paywall-price">£0.98 <span>· 30-day access</span></div>
          <ul class="paywall-features">
            <li>Full UC entitlement calculator</li>
            <li>55% taper rate applied automatically</li>
            <li>Work allowance &amp; MIF included</li>
            <li>Download full PDF report</li>
          </ul>
          <a href="https://buy.stripe.com/dRmbJ3fmpcly0YcgSK6wE00" target="_blank" class="btn-pay">
            <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            Pay £0.98 &amp; Get Password
          </a>
          <div class="pay-methods">
            <span class="pay-method-badge">💳 Card</span>
            <span class="pay-method-badge">🍎 Apple Pay</span>
            <span class="pay-method-badge">G Google Pay</span>
            <span class="pay-method-badge">Klarna</span>
            <span class="pay-method-badge">Revolut</span>
            <span class="pay-method-badge">Amazon Pay</span>
          </div>
          <div class="paywall-divider"><span>Already paid? Enter your password</span></div>
          <div class="unlock-form">
            <div class="unlock-input-row">
              <div class="unlock-input-wrap">
                <input type="password" class="unlock-input" id="pwdInput" placeholder="Enter your password" autocomplete="new-password" maxlength="20">
                <button type="button" class="btn-eye" onclick="togglePwd()" title="Show/hide password">
                  <svg id="eyeIcon" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
              <button type="button" class="btn-unlock" onclick="tryUnlock()">Unlock</button>
            </div>
            <div class="unlock-err" id="unlockErr">❌ Incorrect password. Please check and try again.</div>
          </div>
          <p class="paywall-secure">
            <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Secure payment by Stripe · Not affiliated with DWP or HMRC
          </p>
        </div>
      </div>

      <!-- UC CONTENT (hidden until unlocked) -->
      <div id="ucContent" style="display:none">
        <div id="expiryWarningBar" class="expiry-warning-bar" style="margin:16px 22px 0">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div><strong id="expiryWarningTitle">Your access expires soon</strong><span id="expiryWarningMsg">Renew before it expires. <a href="https://buy.stripe.com/dRmbJ3fmpcly0YcgSK6wE00" target="_blank">Pay £0.98 to renew →</a></span></div>
        </div>
        <div class="card-body">
          <div id="ucAlert" class="alert alert-err"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><span id="ucAlertMsg"></span></div>
          <div id="ucOk" class="alert alert-ok"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Calculation complete — total you receive is updated below.</span></div>
          <div class="sec-label">Entitlement elements</div>
          <div class="g2">
            <div class="field"><label>Standard allowance (£) <span class="req">*</span></label>
              <select id="standardAllowance" onchange="updateStandard()">
                <option value="316.98">Single (Under 25) — £316.98</option>
                <option value="400.14" selected>Single (25 or Over) — £400.14</option>
                <option value="497.55">Couple (Both Under 25) — £497.55</option>
                <option value="628.10">Couple (One or Both 25+) — £628.10</option>
              </select>
            </div>
            <div class="field"><label>Children element (£)</label><input type="number" id="childrenEl" min="0" step="0.01" placeholder="0.00"></div>
            <div class="field"><label>Disabled child element (£)</label><input type="number" id="disabledEl" min="0" step="0.01" placeholder="0.00"></div>
            <div class="field"><label>Carer element (£)</label><input type="number" id="carerEl" min="0" step="0.01" placeholder="0.00"></div>
            <div class="field"><label>Housing element (£)</label><input type="number" id="housingEl" min="0" step="0.01" placeholder="0.00"></div>
            <div class="field"><label>Total entitlement (£) <span class="req">*</span></label><input type="number" id="totalEntitlement" min="0" step="0.01" placeholder="Auto-calculated"></div>
          </div>
          <div class="sec-label">Income &amp; deductions</div>
          <div class="g2">
            <div class="field"><label>Net income used by DWP (£) <span class="req">*</span></label><input type="number" id="totalIncomeNet" min="0" step="0.01" placeholder="Auto-filled from above" readonly></div>
            <div class="field"><label>Minimum Income Floor (£)</label><input type="number" id="mifAmount" min="0" step="0.01" value="1642.72"></div>
            <div class="field"><label>Work allowance — first £ disregarded</label><input type="number" id="workAllowance" min="0" step="0.01" value="411.00"></div>
            <div class="field"><label>Advance repayments (£)</label><input type="number" id="advancePayments" min="0" step="0.01" placeholder="0.00"></div>
            <div class="field"><label>Other deductions (£)</label><input type="number" id="otherDed" min="0" step="0.01" placeholder="0.00"></div>
          </div>
          <div class="mif-warn" id="mifWarn">Your actual net income is below the Minimum Income Floor. DWP will use the MIF figure to calculate your taper deduction.</div>
          <div class="btn-row">
            <button class="btn btn-violet-fill" onclick="calcUC()"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>Calculate UC payment</button>
            <button class="btn btn-outline-v" onclick="saveFullPDF()"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Save full report</button>
            <button type="button" class="btn btn-clear" onclick="clearUCOnly()">Clear</button>
          </div>
          <div id="ucResult" class="result-panel">
            <table class="btable" id="ucTable"></table>
            <div class="metrics">
              <div class="metric m-violet"><div class="m-label">Total you receive</div><div class="m-val" id="mUCPayment">—</div></div>
              <div class="metric m-amber"><div class="m-label">UC reduction</div><div class="m-val" id="mUCReduction">—</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>


<footer class="footer">
  <div class="footer-inner">
    <a href="#top" class="footer-brand" style="display:block;text-decoration:none">uc<em>calc</em> — UK calculator</a>
    <p class="footer-note"><strong>Not financial advice.</strong> Figures are estimates for planning only. Not affiliated with DWP, HMRC or the UK Government. Always verify your entitlement at gov.uk.</p>
    <p class="footer-meta">Not legal advice · <a href="/legal" style="color:var(--g400)">Legal &amp; Privacy Policy</a></p>
    <p class="footer-meta">© 2025 uccalc.co.uk — All rights reserved.</p>
    <a class="footer-top" href="#top">Back to top</a>
  </div>
</footer>

<script>
const FIRST_MI = 833;
const UC_PASSWORD = 'UC2620';
const fmt = v => '£' + Math.abs(parseFloat(v)||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtMi = v => parseInt(v).toLocaleString() + ' mi';

/* PASSWORD UNLOCK — sessionStorage only, 1-hour inactivity */
const SESSION_KEY = 'uc_session_at';
const UC_HIDDEN_KEY = 'uc_section_hidden';
const SESSION_MS = 1 * 60 * 60 * 1000; // 1 hour inactivity

function togglePwd(){
  const input = document.getElementById('pwdInput');
  const icon = document.getElementById('eyeIcon');
  if(input.type==='password'){
    input.type='text';
    icon.innerHTML='<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
  } else {
    input.type='password';
    icon.innerHTML='<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
  }
}

function toggleUCSection(){
  const ucContent = document.getElementById('ucContent');
  const icon = document.getElementById('ucToggleIcon');
  const label = document.getElementById('ucToggleLabel');
  const isHidden = ucContent.style.display === 'none';
  if(isHidden){
    ucContent.style.display = 'block';
    icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    label.textContent = 'Hide';
    sessionStorage.setItem(UC_HIDDEN_KEY, '0');
  } else {
    ucContent.style.display = 'none';
    icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    label.textContent = 'Show';
    sessionStorage.setItem(UC_HIDDEN_KEY, '1');
  }
}

function doUnlock(){
  document.getElementById('ucLockWrapper').style.display = 'none';
  document.getElementById('lockBadge').style.display = 'none';
  document.getElementById('ucToggleBtn').style.display = 'flex';
  const hidden = sessionStorage.getItem(UC_HIDDEN_KEY) === '1';
  const ucContent = document.getElementById('ucContent');
  const icon = document.getElementById('ucToggleIcon');
  const label = document.getElementById('ucToggleLabel');
  if(hidden){
    ucContent.style.display = 'none';
    icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    label.textContent = 'Show';
  } else {
    ucContent.style.display = 'block';
    icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    label.textContent = 'Hide';
  }
  sessionStorage.setItem(SESSION_KEY, Date.now().toString());
  calcEntitlement();
}

['click','keydown','scroll','mousemove','touchstart'].forEach(function(evt){
  document.addEventListener(evt, function(){
    if(sessionStorage.getItem(SESSION_KEY)){
      sessionStorage.setItem(SESSION_KEY, Date.now().toString());
    }
  }, {passive:true});
});

async function tryUnlock(){
  const val = document.getElementById('pwdInput').value.trim();
  const err = document.getElementById('unlockErr');
  if(!val){ err.classList.add('show'); return; }
  try {
    const res = await fetch('/verify-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: val })
    });
    const data = await res.json();
    if(data.ok){
      sessionStorage.setItem(SESSION_KEY, Date.now().toString());
      err.classList.remove('show');
      doUnlock();
    } else {
      err.classList.add('show');
      document.getElementById('pwdInput').focus();
    }
  } catch(e) {
    err.classList.add('show');
  }
}

document.getElementById('pwdInput').addEventListener('keydown', function(e){ if(e.key==='Enter') tryUnlock(); });

(function(){
  const sessionTs = sessionStorage.getItem(SESSION_KEY);
  if(sessionTs){
    const sessionAge = Date.now() - parseInt(sessionTs);
    if(sessionAge < SESSION_MS){
      doUnlock();
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(UC_HIDDEN_KEY);
    }
  }
})();

/* ENTITLEMENT */
function updateStandard(){ calcEntitlement(); }
function calcEntitlement(){
  const s=parseFloat(document.getElementById('standardAllowance').value)||0;
  const c=parseFloat(document.getElementById('childrenEl').value)||0;
  const d=parseFloat(document.getElementById('disabledEl').value)||0;
  const cr=parseFloat(document.getElementById('carerEl').value)||0;
  const h=parseFloat(document.getElementById('housingEl').value)||0;
  document.getElementById('totalEntitlement').value=(s+c+d+cr+h).toFixed(2);
}
['childrenEl','disabledEl','carerEl','housingEl'].forEach(id=>{
  document.getElementById(id).addEventListener('input',calcEntitlement);
});
document.getElementById('standardAllowance').addEventListener('change',calcEntitlement);

/* EXPENSES */
function addExpenseRow(){
  const list=document.getElementById('customExpenseList');
  const row=document.createElement('div');
  row.className='expense-row';
  row.innerHTML=\`<input type="text" placeholder="Expense name" maxlength="40"><span class="pound">£</span><input type="number" min="0" step="0.01" placeholder="0.00"><button type="button" class="btn-remove-expense" onclick="this.parentElement.remove()"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>\`;
  list.appendChild(row);
  row.querySelector('input[type="text"]').focus();
}
function getCustomExpenses(){
  const rows=document.querySelectorAll('#customExpenseList .expense-row');
  const result=[];
  rows.forEach(row=>{
    const name=row.querySelector('input[type="text"]').value.trim()||'Custom expense';
    const amt=parseFloat(row.querySelector('input[type="number"]').value)||0;
    if(amt>0)result.push({name,amt});
  });
  return result;
}

/* CLEAR */
function clearIncomeOnly(){
  ['startDate','endDate','incomeSalary','totalMileage','airportFees','congestionCharge','mobileBills'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('customExpenseList').innerHTML='';
  document.getElementById('incTable').innerHTML='';
  document.getElementById('mTotalExp').textContent='—';
  document.getElementById('mNetIncome').textContent='—';
  document.getElementById('totalIncomeNet').value='';
  document.getElementById('incomeResult').classList.remove('show');
  document.getElementById('incAlert').classList.remove('show');
  document.getElementById('incOk').classList.remove('show');
}
function clearUCOnly(){
  ['childrenEl','disabledEl','carerEl','housingEl','advancePayments','otherDed'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('mifAmount').value='1642.72';
  document.getElementById('workAllowance').value='411.00';
  document.getElementById('totalIncomeNet').value='';
  document.getElementById('standardAllowance').selectedIndex=1;
  calcEntitlement();
  document.getElementById('ucTable').innerHTML='';
  document.getElementById('mUCPayment').textContent='—';
  document.getElementById('mUCReduction').textContent='—';
  document.getElementById('ucResult').classList.remove('show');
  document.getElementById('mifWarn').classList.remove('show');
  document.getElementById('ucAlert').classList.remove('show');
  document.getElementById('ucOk').classList.remove('show');
}
function clearAll(){ clearIncomeOnly(); clearUCOnly(); }

/* ALERTS */
function showErr(aId,msg){
  const a=document.getElementById(aId);a.classList.add('show');
  document.getElementById(aId+'Msg').textContent=msg;
  document.getElementById(aId==='incAlert'?'incOk':'ucOk').classList.remove('show');
}
function showOk(okId){
  document.getElementById(okId).classList.add('show');
  document.getElementById(okId==='incOk'?'incAlert':'ucAlert').classList.remove('show');
}

/* MILEAGE */
function getMileageAmt(mi){ return mi<=FIRST_MI?mi*0.45:(FIRST_MI*0.45)+((mi-FIRST_MI)*0.25); }
function buildRows(rows){
  return rows.map((r,i)=>{
    const last=i===rows.length-1;
    return \`<tr class="\${last?'tr-tot':''}"><td class="td-l">\${r[0]}</td><td class="td-r">\${r[1]}</td></tr>\`;
  }).join('');
}

/* CALC INCOME */
function calcIncome(){
  const sd=document.getElementById('startDate').value;
  const ed=document.getElementById('endDate').value;
  const salary=parseFloat(document.getElementById('incomeSalary').value)||0;
  const miles=parseFloat(document.getElementById('totalMileage').value)||0;
  if(!sd||!ed||!salary||!miles){showErr('incAlert','Please fill in all required fields marked with *');document.getElementById('incomeResult').classList.remove('show');return false;}
  const airport=parseFloat(document.getElementById('airportFees').value)||0;
  const cong=parseFloat(document.getElementById('congestionCharge').value)||0;
  const mobile=parseFloat(document.getElementById('mobileBills').value)||0;
  const customExps=getCustomExpenses();
  const customTotal=customExps.reduce((sum,e)=>sum+e.amt,0);
  const mileageAmt=getMileageAmt(miles);
  const totalExp=mileageAmt+airport+cong+mobile+customTotal;
  const netIncome=salary-totalExp;
  const rows=[['Gross income',fmt(salary)],['Mileage ('+fmtMi(miles)+' @ HMRC rate)','−'+fmt(mileageAmt)]];
  if(airport)rows.push(['Airport fees','−'+fmt(airport)]);
  if(cong)rows.push(['Congestion charge','−'+fmt(cong)]);
  if(mobile)rows.push(['Mobile bills','−'+fmt(mobile)]);
  customExps.forEach(e=>rows.push([e.name,'−'+fmt(e.amt)]));
  rows.push(['Net income',fmt(netIncome)]);
  document.getElementById('incTable').innerHTML=buildRows(rows);
  document.getElementById('mTotalExp').textContent=fmt(totalExp);
  document.getElementById('mNetIncome').textContent=fmt(netIncome);
  const mif=parseFloat(document.getElementById('mifAmount').value)||0;
  const earningsUsed=Math.max(netIncome,mif);
  document.getElementById('totalIncomeNet').value=earningsUsed.toFixed(2);
  document.getElementById('mifWarn').classList.toggle('show',netIncome<mif);
  document.getElementById('incomeResult').classList.add('show');
  showOk('incOk');
  return true;
}

/* CALC UC */
function calcUC(){
  const ent=parseFloat(document.getElementById('totalEntitlement').value)||0;
  const net=parseFloat(document.getElementById('totalIncomeNet').value)||0;
  const wa=parseFloat(document.getElementById('workAllowance').value)||0;
  const adv=parseFloat(document.getElementById('advancePayments').value)||0;
  const otd=parseFloat(document.getElementById('otherDed').value)||0;
  if(!ent){showErr('ucAlert','Please enter a total entitlement amount');document.getElementById('ucResult').classList.remove('show');return false;}
  const aboveAllow=Math.max(0,net-wa);
  const taperDed=aboveAllow*0.55;
  const payment=Math.max(0,ent-taperDed-adv-otd);
  const rows=[['Total entitlement',fmt(ent)],['Work allowance (disregarded)',fmt(Math.min(wa,net))+' not counted'],['Earnings above allowance',fmt(aboveAllow)],['UC reduction (55% taper)','−'+fmt(taperDed)]];
  if(adv)rows.push(['Advance repayments','−'+fmt(adv)]);
  if(otd)rows.push(['Other deductions','−'+fmt(otd)]);
  rows.push(['Total you receive',fmt(payment)]);
  document.getElementById('ucTable').innerHTML=buildRows(rows);
  document.getElementById('mUCPayment').textContent=fmt(payment);
  document.getElementById('mUCReduction').textContent=fmt(taperDed);
  document.getElementById('ucResult').classList.add('show');
  showOk('ucOk');
  return true;
}

/* PDF */
function fmtDateLong(d){
  if(!d)return'—';
  const[y,m,day]=d.split('-');
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return \`\${parseInt(day)} \${months[parseInt(m)-1]} \${y}\`;
}
function buildPDF(includeUC){
  const{jsPDF}=window.jspdf;
  const doc=new jsPDF({unit:'mm',format:'a4',compress:true});
  const pageW=doc.internal.pageSize.getWidth(),pageH=doc.internal.pageSize.getHeight();
  const mL=14,mR=14,colW=pageW-mL-mR,amountRight=pageW-mR,labelLeft=mL+2,labelMax=amountRight-labelLeft-56;
  const lineH=5;
  function setBold(n){doc.setFont('helvetica','bold');doc.setFontSize(n)}
  function setNorm(n){doc.setFont('helvetica','normal');doc.setFontSize(n)}
  let y=36;
  function ensureSpace(h){if(y+h>pageH-20){doc.addPage();y=22}}
  doc.setFillColor(11,29,58);doc.rect(0,0,pageW,26,'F');
  doc.setFillColor(29,78,216);doc.rect(0,26,pageW,2.5,'F');
  setBold(15);doc.setTextColor(255,255,255);doc.text('Income & Expenses Report',mL,17);
  setNorm(10);doc.setTextColor(186,210,253);doc.text('uccalc',amountRight,17,{align:'right'});
  const sd=fmtDateLong(document.getElementById('startDate').value);
  const ed=fmtDateLong(document.getElementById('endDate').value);
  setBold(10);doc.setTextColor(29,78,216);doc.text('Period: '+sd+'  –  '+ed,mL,y);
  setNorm(10);doc.setTextColor(100,116,139);doc.text('Generated: '+new Date().toLocaleDateString('en-GB'),amountRight,y,{align:'right'});
  y+=10;
  function bar(title,r,g,b){ensureSpace(14);doc.setFillColor(r,g,b);doc.rect(mL,y,colW,8,'F');setBold(11);doc.setTextColor(255,255,255);doc.text(title,mL+3,y+5.5);y+=12;setNorm(11)}
  function rowLine(label,val,isTotal,br,bg,bb){
    const lines=doc.splitTextToSize(String(label),labelMax);
    const blockH=6+(lines.length-1)*lineH+5;
    ensureSpace(blockH+4);
    if(isTotal){setBold(12);doc.setTextColor(br||29,bg||78,bb||216);}else{setNorm(11);doc.setTextColor(71,85,105);}
    lines.forEach((ln,i)=>doc.text(ln,labelLeft,y+5+i*lineH));
    if(isTotal){setBold(12);doc.setTextColor(br||29,bg||78,bb||216);}else{setBold(11);doc.setTextColor(30,41,59);}
    doc.text(String(val).replace(/\u2212/g,'-'),amountRight,y+5,{align:'right'});
    setNorm(11);y+=blockH;doc.setDrawColor(226,232,240);doc.setLineWidth(0.25);doc.line(mL,y,amountRight,y);y+=2;
  }
  const salary=parseFloat(document.getElementById('incomeSalary').value)||0;
  const miles=parseFloat(document.getElementById('totalMileage').value)||0;
  const airport=parseFloat(document.getElementById('airportFees').value)||0;
  const cong=parseFloat(document.getElementById('congestionCharge').value)||0;
  const mobile=parseFloat(document.getElementById('mobileBills').value)||0;
  const customExps=getCustomExpenses();
  const mileageAmt=getMileageAmt(miles);
  const totalExp=mileageAmt+airport+cong+mobile+customExps.reduce((s,e)=>s+e.amt,0);
  const netIncome=salary-totalExp;
  bar('Income summary',29,78,216);
  rowLine('Gross income',fmt(salary));
  rowLine('Mileage deduction ('+fmtMi(miles)+')','−'+fmt(mileageAmt));
  if(airport)rowLine('Airport fees','−'+fmt(airport));
  if(cong)rowLine('Congestion charge','−'+fmt(cong));
  if(mobile)rowLine('Mobile bills','−'+fmt(mobile));
  customExps.forEach(e=>rowLine(e.name,'−'+fmt(e.amt)));
  rowLine('Total expenses',fmt(totalExp));y+=2;
  rowLine('Net income',fmt(netIncome),true,29,78,216);
  if(includeUC){
    y+=6;
    const ent=parseFloat(document.getElementById('totalEntitlement').value)||0;
    const net=parseFloat(document.getElementById('totalIncomeNet').value)||0;
    const wa=parseFloat(document.getElementById('workAllowance').value)||0;
    const adv=parseFloat(document.getElementById('advancePayments').value)||0;
    const otd=parseFloat(document.getElementById('otherDed').value)||0;
    const aboveAllow=Math.max(0,net-wa);
    const taperDed=aboveAllow*0.55;
    const payment=Math.max(0,ent-taperDed-adv-otd);
    bar('Universal Credit payment',109,40,217);
    rowLine('Total entitlement',fmt(ent));
    rowLine('Work allowance disregarded',fmt(Math.min(wa,net)));
    rowLine('Earnings above allowance',fmt(aboveAllow));
    rowLine('UC reduction (55% taper)','−'+fmt(taperDed));
    if(adv)rowLine('Advance repayments','−'+fmt(adv));
    if(otd)rowLine('Other deductions','−'+fmt(otd));
    y+=2;rowLine('Total you receive',fmt(payment),true,109,40,217);
  }
  const footY=pageH-11;
  doc.setFillColor(11,29,58);doc.rect(0,footY,pageW,11,'F');
  doc.setFillColor(29,78,216);doc.rect(0,footY,pageW,2,'F');
  setNorm(9);doc.setTextColor(186,210,253);doc.text('Not financial advice · uccalc.co.uk',pageW/2,footY+7.5,{align:'center'});
  doc.save('income_report'+(includeUC?'_with_uc':'')+'.pdf');
}
function saveIncomePDF(){if(calcIncome())buildPDF(false)}
function saveFullPDF(){if(calcIncome()&&calcUC())buildPDF(true)}


calcEntitlement();
</script>
</body>
</html>
`;
const LEGAL_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Legal disclaimer, privacy policy and terms of use for uccalc.co.uk — UK self-employed Universal Credit calculator.">
<title>Legal & Privacy — uccalc.co.uk</title>

<!-- FAVICON — FIXED -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/x-icon" href="/favicon.ico">

<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{
  --navy:#0b1d3a;--blue:#1d4ed8;--blue-light:#3b82f6;--blue-pale:#dbeafe;--blue-ghost:#eff6ff;
  --violet:#6d28d9;--violet-light:#ede9fe;--emerald:#059669;--emerald-light:#d1fae5;
  --rose:#e11d48;--rose-light:#ffe4e6;--amber:#d97706;--amber-light:#fef3c7;
  --g50:#f8fafc;--g100:#f1f5f9;--g200:#e2e8f0;--g300:#cbd5e1;--g400:#94a3b8;
  --g600:#475569;--g700:#334155;--g800:#1e293b;
  --r-sm:8px;--r-md:12px;--r-lg:18px;--r-xl:24px;
  --shadow:0 2px 16px rgba(10,25,60,0.09),0 1px 3px rgba(10,25,60,0.06);
}
body{font-family:'DM Sans',sans-serif;font-weight:600;background:#eaf0fb;color:var(--g800);min-height:100vh;-webkit-font-smoothing:antialiased;display:flex;flex-direction:column}
.hdr{background:var(--navy);padding:10px 16px 10px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;position:sticky;top:0;z-index:100;box-shadow:0 4px 24px rgba(0,20,50,0.35)}
@media(min-width:720px){.hdr{padding:12px 28px;flex-wrap:nowrap}}
.hdr-nav{display:flex;align-items:center;gap:4px;flex-wrap:wrap;justify-content:flex-end}
.hdr-nav a{color:#bfdbfe;text-decoration:none;font-size:12px;font-weight:700;padding:8px 12px;border-radius:8px;white-space:nowrap}
.hdr-nav a:hover{background:rgba(255,255,255,0.12);color:#fff}
@media(min-width:720px){.hdr-nav a{font-size:13px;padding:8px 14px}}
.brand{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none}
.brand-icon{width:34px;height:34px;background:var(--blue);border-radius:9px;display:flex;align-items:center;justify-content:center}
.brand-icon svg{width:18px;height:18px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.brand-name{font-size:15px;font-weight:800;color:#fff}
.brand-name em{font-style:normal;color:#60a5fa}
.hdr-tag{font-size:11px;font-weight:500;color:#bfdbfe;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.25);padding:4px 12px;border-radius:20px;letter-spacing:0.04em}

/* PAGE HERO */
.legal-hero{background:linear-gradient(145deg,#0b1d3a 0%,#1a3a6e 100%);padding:48px 24px 52px;text-align:center}
.legal-hero h1{font-size:clamp(22px,3vw,34px);font-weight:800;color:#fff;letter-spacing:-0.02em;margin-bottom:10px}
.legal-hero h1 em{font-style:normal;color:#93c5fd}
.legal-hero p{font-size:13px;font-weight:600;color:rgba(255,255,255,0.65);max-width:460px;margin:0 auto}

/* TOC PILLS */
.toc{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:20px 16px 0;max-width:860px;margin:0 auto}
.toc a{font-size:12px;font-weight:700;color:var(--blue);background:#fff;border:1.5px solid var(--blue-pale);padding:6px 14px;border-radius:20px;text-decoration:none;white-space:nowrap}
.toc a:hover{background:var(--blue-ghost)}

.page{max-width:860px;margin:0 auto;padding:28px 16px 48px;width:100%;flex:1}

/* CARDS */
.card{background:#fff;border-radius:var(--r-xl);box-shadow:var(--shadow);margin-bottom:20px;overflow:hidden}
.card-blue{border-left:4px solid var(--blue)}
.card-violet{border-left:4px solid var(--violet)}
.card-amber{border-left:4px solid var(--amber)}
.card-emerald{border-left:4px solid var(--emerald)}
.card-rose{border-left:4px solid var(--rose)}

.card-hdr{display:flex;align-items:center;gap:13px;padding:16px 22px;border-bottom:1px solid var(--g100)}
.card-blue .card-hdr{background:linear-gradient(90deg,var(--blue-ghost) 0%,#fff 100%)}
.card-violet .card-hdr{background:linear-gradient(90deg,var(--violet-light) 0%,#fff 100%)}
.card-amber .card-hdr{background:linear-gradient(90deg,var(--amber-light) 0%,#fff 100%)}
.card-emerald .card-hdr{background:linear-gradient(90deg,var(--emerald-light) 0%,#fff 100%)}
.card-rose .card-hdr{background:linear-gradient(90deg,var(--rose-light) 0%,#fff 100%)}

.ch-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ch-icon svg{width:18px;height:18px;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.chi-blue{background:var(--blue-pale)}.chi-blue svg{stroke:var(--blue)}
.chi-violet{background:var(--violet-light)}.chi-violet svg{stroke:var(--violet)}
.chi-amber{background:var(--amber-light)}.chi-amber svg{stroke:var(--amber)}
.chi-emerald{background:var(--emerald-light)}.chi-emerald svg{stroke:var(--emerald)}
.chi-rose{background:var(--rose-light)}.chi-rose svg{stroke:var(--rose)}

.ch-txt h2{font-size:17px;font-weight:800;color:var(--g800);letter-spacing:-0.02em}
.ch-txt p{font-size:12px;font-weight:600;color:var(--g400);margin-top:2px}

.card-body{padding:22px 24px}
.card-body p{font-size:13px;font-weight:600;color:var(--g700);line-height:1.75;margin-bottom:12px}
.card-body p:last-child{margin-bottom:0}
.card-body strong{color:var(--g800);font-weight:800}
.card-body a{color:var(--blue);text-decoration:none}
.card-body a:hover{text-decoration:underline}

.pill-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px}
.pill-blue{background:var(--blue-ghost);color:var(--blue);border:1px solid var(--blue-pale)}
.pill-green{background:var(--emerald-light);color:var(--emerald);border:1px solid #a7f3d0}
.pill-amber{background:var(--amber-light);color:var(--amber);border:1px solid #fde68a}
.pill svg{width:11px;height:11px;stroke:currentColor;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}

.updated-tag{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--g400);background:var(--g100);border:1px solid var(--g200);padding:4px 12px;border-radius:20px;margin-bottom:20px}

/* FOOTER */
.footer{text-align:center;padding:28px 16px 32px;font-size:12px;font-weight:600;color:var(--g600);border-top:1px solid var(--g200);background:var(--g50);margin-top:auto}
.footer-inner{max-width:560px;margin:0 auto}
.footer-brand{font-size:15px;font-weight:800;color:var(--g800);margin-bottom:8px}
.footer-brand em{font-style:normal;color:var(--blue)}
.footer-note{line-height:1.6;margin-bottom:16px}
.footer-meta{font-size:11px;color:var(--g400);margin-bottom:4px}
.footer-top{display:inline-flex;align-items:center;gap:6px;margin-top:18px;padding:10px 16px;color:#fff;background:var(--blue);font-weight:800;text-decoration:none;font-size:14px;border-radius:10px}
.footer-top::after{content:'↑';font-size:18px;font-weight:900}
.footer-top:hover{background:#1e40af}
</style>
</head>
<body>

<header class="hdr">
  <a href="/" class="brand">
    <div class="brand-icon"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
    <span class="brand-name">uc<em>calc</em></span>
  </a>
  <nav class="hdr-nav" aria-label="Site navigation">
    <a href="/">Home</a>
    <a href="/#section-income">Calculator</a>
  </nav>
</header>

<div class="legal-hero">
  <h1>Legal &amp; <em>Privacy</em></h1>
  <p>Everything you need to know about how this tool works, what we collect, and your rights. Last updated April 2025.</p>
</div>

<nav class="toc" aria-label="Jump to section">
  <a href="#disclaimer">Disclaimer</a>
  <a href="#no-liability">No Liability</a>
  <a href="#mif-note">MIF Note</a>
  <a href="#privacy">Privacy</a>
  <a href="#cookies">Cookies</a>
  <a href="#third-parties">Third Parties</a>
  <a href="#payments">Payments</a>
  <a href="#contact">Contact</a>
</nav>

<main class="page">

  <div class="updated-tag">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    Last updated: April 2025
  </div>

  <!-- DISCLAIMER -->
  <section id="disclaimer" class="card card-blue" style="scroll-margin-top:88px">
    <div class="card-hdr">
      <div class="ch-icon chi-blue"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>
      <div class="ch-txt"><h2>Disclaimer</h2><p>Important — please read before using the calculator</p></div>
    </div>
    <div class="card-body">
      <p><strong>uccalc.co.uk is a free estimation tool for planning purposes only.</strong> All figures produced by this calculator are estimates and should not be relied upon as accurate, complete, or up to date.</p>
      <p>This tool is <strong>not financial advice, not legal advice, and not benefits advice.</strong> Nothing on this website constitutes advice regulated under the Financial Services and Markets Act 2000 or any other UK legislation.</p>
      <p>This website is <strong>not affiliated with, endorsed by, or connected to</strong> the Department for Work and Pensions (DWP), His Majesty's Revenue and Customs (HMRC), or the UK Government in any way.</p>
      <p>Universal Credit rules are complex, frequently updated, and depend heavily on your personal circumstances. Always verify your entitlement directly at <a href="https://www.gov.uk/universal-credit" target="_blank" rel="noopener">gov.uk</a> or by speaking with a qualified benefits adviser such as Citizens Advice.</p>
    </div>
  </section>

  <!-- NO LIABILITY -->
  <section id="no-liability" class="card card-rose" style="scroll-margin-top:88px">
    <div class="card-hdr">
      <div class="ch-icon chi-rose"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
      <div class="ch-txt"><h2>No Liability</h2><p>Use of this tool is entirely at your own risk</p></div>
    </div>
    <div class="card-body">
      <p>To the fullest extent permitted by law, uccalc.co.uk and its operator accept <strong>no liability whatsoever</strong> for any loss, damage, financial shortfall, overpayment, underpayment, or other consequence arising from your use of, or reliance on, figures produced by this calculator.</p>
      <p>This includes but is not limited to: incorrect UC payment estimates, errors resulting from changes to DWP or HMRC rates, Minimum Income Floor calculations, or any other benefit entitlement assessment.</p>
      <p>By using this calculator you acknowledge and agree that <strong>you use it entirely at your own risk</strong> and that no warranty of accuracy or fitness for purpose is given.</p>
    </div>
  </section>

  <!-- MIF NOTE -->
  <section id="mif-note" class="card card-amber" style="scroll-margin-top:88px">
    <div class="card-hdr">
      <div class="ch-icon chi-amber"><svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>
      <div class="ch-txt"><h2>Minimum Income Floor (MIF) Note</h2><p>A particularly complex area — please read carefully</p></div>
    </div>
    <div class="card-body">
      <p>The Minimum Income Floor (MIF) is one of the most complex rules in Universal Credit for self-employed claimants. It assumes you earn at least the equivalent of the National Living Wage for your expected hours, even if your actual income is lower.</p>
      <p>Whether the MIF applies to you depends on many individual factors including: how long you have been self-employed, whether DWP considers you "gainfully self-employed", your age, your location, your expected hours, and whether you are in a start-up period.</p>
      <p><strong>The MIF figure used in this calculator is a general estimate and may not reflect your actual MIF.</strong> It is included to illustrate the concept only. Do not use this calculator's MIF output to make financial decisions. Always confirm your MIF with your work coach at the DWP.</p>
    </div>
  </section>

  <!-- PRIVACY -->
  <section id="privacy" class="card card-emerald" style="scroll-margin-top:88px">
    <div class="card-hdr">
      <div class="ch-icon chi-emerald"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
      <div class="ch-txt"><h2>Privacy Policy</h2><p>What we collect — and what we don't</p></div>
    </div>
    <div class="card-body">
      <p><strong>We do not collect, store, or process any personal data.</strong> This calculator runs entirely in your browser. No information you enter — income figures, mileage, dates, or anything else — is ever sent to our servers or stored anywhere.</p>
      <p>We do not use any analytics, tracking pixels, session recording tools, or advertising networks. There are no hidden data collection scripts on this website.</p>
      <p>This website does not require you to create an account or provide any personal information to use the calculator.</p>
      <div class="pill-row">
        <span class="pill pill-green"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>No personal data collected</span>
        <span class="pill pill-green"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>No accounts required</span>
        <span class="pill pill-green"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>No tracking or analytics</span>
        <span class="pill pill-green"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>No data sent to servers</span>
      </div>
    </div>
  </section>

  <!-- COOKIES -->
  <section id="cookies" class="card card-blue" style="scroll-margin-top:88px">
    <div class="card-hdr">
      <div class="ch-icon chi-blue"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
      <div class="ch-txt"><h2>Cookies &amp; Session Storage</h2><p>We keep it minimal</p></div>
    </div>
    <div class="card-body">
      <p>This website does not use cookies for tracking, advertising, or analytics purposes.</p>
      <p>The only browser storage used is <strong>session storage</strong> — a temporary in-browser mechanism that remembers whether you have unlocked the UC calculator during your current visit. This is cleared automatically when you close your browser tab and is never transmitted anywhere.</p>
      <p>No cookie consent banner is required because no tracking or non-essential cookies are set. If this changes in the future, this page will be updated and a consent mechanism will be added.</p>
      <div class="pill-row">
        <span class="pill pill-green"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>No tracking cookies</span>
        <span class="pill pill-amber"><svg viewBox="0 0 24 24"><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>Session storage used (temporary, local only)</span>
      </div>
    </div>
  </section>

  <!-- THIRD PARTIES -->
  <section id="third-parties" class="card card-violet" style="scroll-margin-top:88px">
    <div class="card-hdr">
      <div class="ch-icon chi-violet"><svg viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg></div>
      <div class="ch-txt"><h2>Third-Party Services</h2><p>External resources loaded by this page</p></div>
    </div>
    <div class="card-body">
      <p>This website loads a small number of third-party resources to function. These are standard, widely used services:</p>
      <p><strong>Google Fonts</strong> — loads the DM Sans typeface. Google may log your IP address as part of this request. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google's Privacy Policy</a>.</p>
      <p><strong>Cloudflare CDN</strong> — loads the jsPDF library used to generate PDF reports in your browser. Cloudflare may log request metadata. See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare's Privacy Policy</a>.</p>
      <p><strong>Cloudflare R2</strong> — serves the hero image on the home page. Standard CDN image delivery, no personal data involved.</p>
      <p>None of these services have access to any data you enter into the calculator.</p>
    </div>
  </section>

  <!-- PAYMENTS -->
  <section id="payments" class="card card-violet" style="scroll-margin-top:88px">
    <div class="card-hdr">
      <div class="ch-icon chi-violet"><svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg></div>
      <div class="ch-txt"><h2>Payments</h2><p>How the one-time UC calculator unlock works</p></div>
    </div>
    <div class="card-body">
      <p>Access to the UC Payment calculator is available for a one-time payment of £0.98. Payments are processed entirely by <strong>Stripe</strong>, a regulated payment services provider. We do not see, store, or handle your card details at any point.</p>
      <p>Upon payment, Stripe's hosted checkout page will provide you with a password to unlock the calculator. This password is delivered via Stripe's platform — we do not send emails or collect your email address.</p>
      <p>For payment-related queries, refunds, or disputes, please see <a href="https://stripe.com/gb/privacy" target="_blank" rel="noopener">Stripe's Privacy Policy</a>.</p>
      <div class="pill-row">
        <span class="pill pill-green"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>Card details handled by Stripe only</span>
        <span class="pill pill-green"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>We never see your payment info</span>
      </div>
    </div>
  </section>

  <!-- CONTACT -->
  <section id="contact" class="card card-blue" style="scroll-margin-top:88px">
    <div class="card-hdr">
      <div class="ch-icon chi-blue"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
      <div class="ch-txt"><h2>Contact Us</h2><p>Questions about this policy or the tool</p></div>
    </div>
    <div class="card-body">
      <p>If you have any questions about this privacy policy, the disclaimer, or how this tool works — or if you believe any figures in the calculator are incorrect or out of date — please send us a message below and we will get back to you.</p>
      <p>This page was last updated in <strong>April 2025</strong>. We may update it from time to time — please check back periodically.</p>

      <div id="contactSuccess" style="display:none;align-items:center;gap:9px;font-size:13px;font-weight:700;padding:10px 14px;border-radius:8px;margin:14px 0;background:#d1fae5;color:#059669;border:1px solid #a7f3d0">
        <svg viewBox="0 0 24 24" style="width:15px;height:15px;flex-shrink:0;fill:none;stroke:#059669;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Message sent! We'll be in touch soon.
      </div>
      <div id="contactError" style="display:none;align-items:center;gap:9px;font-size:13px;font-weight:700;padding:10px 14px;border-radius:8px;margin:14px 0;background:#ffe4e6;color:#e11d48;border:1px solid #fecdd3">
        <svg viewBox="0 0 24 24" style="width:15px;height:15px;flex-shrink:0;fill:none;stroke:#e11d48;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span id="contactErrorMsg">Something went wrong. Please try again.</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
        <div>
          <label style="display:block;font-size:13px;font-weight:700;color:#334155;margin-bottom:5px">Your name <span style="color:#e11d48">*</span></label>
          <input type="text" id="legalContactName" placeholder="Jane Smith" autocomplete="name" style="width:100%;height:40px;padding:0 11px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:#1e293b;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:8px;outline:none;transition:border-color 0.18s,box-shadow 0.18s" onfocus="this.style.borderColor='#3b82f6';this.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'" onblur="this.style.borderColor='#e2e8f0';this.style.boxShadow='none'">
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:700;color:#334155;margin-bottom:5px">Email address <span style="color:#e11d48">*</span></label>
          <input type="email" id="legalContactEmail" placeholder="jane@example.com" autocomplete="email" style="width:100%;height:40px;padding:0 11px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:#1e293b;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:8px;outline:none;transition:border-color 0.18s,box-shadow 0.18s" onfocus="this.style.borderColor='#3b82f6';this.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'" onblur="this.style.borderColor='#e2e8f0';this.style.boxShadow='none'">
        </div>
      </div>
      <div style="margin-top:12px">
        <label style="display:block;font-size:13px;font-weight:700;color:#334155;margin-bottom:5px">Message <span style="color:#e11d48">*</span></label>
        <textarea id="legalContactMsg" rows="4" placeholder="Your question or feedback…" style="width:100%;padding:10px 11px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:#1e293b;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:8px;outline:none;resize:vertical;transition:border-color 0.18s,box-shadow 0.18s" onfocus="this.style.borderColor='#3b82f6';this.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'" onblur="this.style.borderColor='#e2e8f0';this.style.boxShadow='none'"></textarea>
      </div>
      <div style="margin-top:14px">
        <button id="legalContactBtn" onclick="submitLegalContact()" style="display:inline-flex;align-items:center;justify-content:center;gap:7px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:800;background:#1d4ed8;color:#fff;border:none;border-radius:8px;padding:12px 22px;cursor:pointer;transition:background 0.18s">
          <svg viewBox="0 0 24 24" style="width:15px;height:15px;stroke:#fff;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          Send message
        </button>
      </div>
    </div>
  </section>

</main>

<footer class="footer">
  <div class="footer-inner">
    <p class="footer-brand">uc<em>calc</em> — UK calculator</p>
    <p class="footer-note"><strong>Not financial advice.</strong> Figures are estimates for planning only. Not affiliated with DWP, HMRC or the UK Government. Always verify your entitlement at gov.uk.</p>
    <p class="footer-meta">© 2025 uccalc.co.uk — All rights reserved. · <a href="legal.html" style="color:var(--g400)">Legal &amp; Privacy</a></p>
    <a class="footer-top" href="#top">Back to top</a>
  </div>
</footer>

<script>
async function submitLegalContact(){
  const name=document.getElementById('legalContactName').value.trim();
  const email=document.getElementById('legalContactEmail').value.trim();
  const msg=document.getElementById('legalContactMsg').value.trim();
  const ok=document.getElementById('contactSuccess');
  const err=document.getElementById('contactError');
  const errMsg=document.getElementById('contactErrorMsg');
  ok.style.display='none'; err.style.display='none';
  if(!name||!email||!msg){errMsg.textContent='Please fill in all fields.';err.style.display='flex';return;}
  const btn=document.getElementById('legalContactBtn');
  btn.disabled=true;btn.textContent='Sending…';
  try{
    const res=await fetch('https://api.web3forms.com/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({access_key:'8313ce2f-b515-4b9e-905b-838d4629ca05',name,email,message:msg,subject:'uccalc.co.uk — Legal page contact'})
    });
    const data=await res.json();
    if(data.success){
      ok.style.display='flex';
      document.getElementById('legalContactName').value='';
      document.getElementById('legalContactEmail').value='';
      document.getElementById('legalContactMsg').value='';
    } else {
      errMsg.textContent='Something went wrong. Please try again.';
      err.style.display='flex';
    }
  } catch(e){
    errMsg.textContent='Network error. Please try again.';
    err.style.display='flex';
  }
  btn.disabled=false;
  btn.innerHTML='<svg viewBox="0 0 24 24" style="width:15px;height:15px;stroke:#fff;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>Send message';
}
</script>
</body>
</html>`;
const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://uccalc.co.uk/</loc>
    <lastmod>2026-04-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://uccalc.co.uk/legal.html</loc>
    <lastmod>2026-04-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

</urlset>
`;
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0b1d3a"/>
  <rect y="29" width="32" height="3" rx="0" fill="#1d4ed8"/>
  <text x="16" y="21" font-family="Arial Black, Arial" font-weight="900" font-size="13" fill="white" text-anchor="middle">UC</text>
</svg>
`;
