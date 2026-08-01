/* =========================================================
   FarTech — Animasyon Katmani (calisma zamani)
   React SPA mount olduktan SONRA calisir; markup'a dokunmadan
   dogru elemanlara animasyon siniflarini ekler.
   ========================================================= */
(function () {
  "use strict";
  var D = document, H = D.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ==== TEK NUMARA ==== degistirince hem WhatsApp yuvarlagi hem randevu formu birlikte guncellenir.
  // FarTech WhatsApp numarasi (Arda onayladi 2026-08-02, gercek numara; format: bagi 90, bosluksuz):
  var WA = "905551066352";

  // JS aktif: reveal elemanlarini gizlemeye izin ver (JS yoksa gizlenmez).
  H.classList.add("fr-js");

  function enhance() {
    // React icerigi geldi mi?
    if (!D.querySelector(".hero-section")) return false;

    /* 1) Tekil bloklar — bir butun olarak belirir (basliklar, kartlar) */
    var singles = [
      ".hero-copy", ".hero-visual",
      ".section-heading", ".process-intro", ".faq-intro",
      ".offer-copy", ".offer-price-card",
      ".booking-copy", ".booking-card"
    ];
    singles.forEach(function (sel) {
      D.querySelectorAll(sel).forEach(function (el) {
        el.classList.add("fr-reveal");
        // hero-visual'in kendi floaty transform'u var -> reveal'da transform yok, sadece opaklik
        if (el.matches(".hero-visual")) el.classList.add("fr-fade");
      });
    });

    /* 2) Gruplu ogeler — dalga (stagger) ile sirayla belirir */
    var groups = [
      ".benefit-grid > .benefit-card",
      ".process-list > .process-item",
      ".faq-list > .faq-item",
      ".proof-strip-grid > *"
    ];
    groups.forEach(function (sel) {
      D.querySelectorAll(sel).forEach(function (el, i) {
        el.classList.add("fr-reveal");
        el.style.transitionDelay = (i % 4) * 90 + "ms";   // 0 / 90 / 180 / 270 ms
      });
    });

    /* 3) floaty — hero gorseli suzulur */
    if (!reduce) {
      var hv = D.querySelector(".hero-visual");
      if (hv) hv.classList.add("fx-floaty");
    }

    /* 4) ringpulse — kalici CTA'lara dikkat nabzi */
    [".nav-cta", ".mobile-booking"].forEach(function (sel) {
      var b = D.querySelector(sel);
      if (b) b.classList.add("fx-pulse");
    });

    /* 5) WhatsApp yuvarlagi — sag altta sabit (temsili numara, kolayca degistir) */
    if (!D.querySelector(".fx-wa")) {
      var wa = D.createElement("a");
      wa.className = "fx-wa";
      wa.href = "https://wa.me/" + WA;   // TEK kaynak: yukaridaki WA sabiti
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.setAttribute("aria-label", "WhatsApp ile yaz");
      wa.innerHTML =
        '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">' +
        '<path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4h.1' +
        'c6.6 0 11.9-5.4 11.9-12S22.6 3 16 3zm0 21.8c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.9 1 1-4.8-.2-.4' +
        'C5.5 18.6 5 16.8 5 15 5 9 9.9 4.1 16 4.1S27 9 27 15s-4.9 9.8-11 9.8zm6-7.4c-.3-.2-1.9-1-2.2-1.1' +
        '-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1 1.3-.2.2-.4.2-.7.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.6' +
        '-.1-.2-.8-1.9-1-2.6-.3-.7-.5-.6-.8-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6' +
        'c.2.2 2.4 3.7 5.9 5.2 2.1.9 2.9.9 4 .8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4z"/></svg>';
      D.body.appendChild(wa);
    }

    /* 5b) Atolye / FarTech bolumu — randevunun ustune ortali marka bandi */
    if (!D.querySelector(".fx-firma")) {
      var anchor = D.querySelector(".booking-section") || D.querySelector("footer");
      if (anchor && anchor.parentNode) {
        var fsec = D.createElement("section");
        fsec.className = "fx-firma fr-reveal";
        fsec.innerHTML =
          '<div class="fx-firma-inner">' +
            '<div class="fx-firma-logo"><img src="__FIRMA_IMG__" alt="FarTech logo" loading="lazy"></div>' +
            '<p class="fx-firma-tag">Sararmış ve matlaşmış farları ilk günkü netliğine döndürüyoruz. Marka bağımsız, garantili işçilik.</p>' +
          '</div>';
        anchor.parentNode.insertBefore(fsec, anchor);
      }
    }

    /* 5c) Guven seridi + musteri yorumlari — firma bandi ile randevu arasi.
       TEMSILI icerik: gercek yorum/rakamlar sonra degistirilecek. */
    if (!D.querySelector(".fx-trust")) {
      var banchor = D.querySelector(".booking-section") || D.querySelector("footer");
      if (banchor && banchor.parentNode) {
        var reviews = [
          { t: "Farlarım sararmıştı, değiştireceğim sanıyordum; işlem sonrası gerçekten yeni gibi oldu — hem de çok daha uygun fiyata.", n: "Mehmet K.", c: "Passat sahibi", a: "MK" },
          { t: "Gece görüşüm belirgin şekilde arttı. Temiz, hızlı ve güler yüzlü bir hizmet. Teşekkürler.", n: "Ayşe D.", c: "Clio sahibi", a: "AD" },
          { t: "İki farı da yaptırdım, aradaki fark inanılmaz. Aracın önü tamamen değişti.", n: "Burak T.", c: "Corolla sahibi", a: "BT" }
        ];
        var cards = reviews.map(function (r) {
          return '<figure class="fx-review fr-reveal">' +
            '<div class="fx-review-stars" aria-label="5 uzerinden 5">★★★★★</div>' +
            '<blockquote>“' + r.t + '”</blockquote>' +
            '<figcaption><span class="fx-ava">' + r.a + '</span>' +
            '<span class="fx-review-who"><b>' + r.n + '</b><span>' + r.c + '</span></span></figcaption>' +
            '</figure>';
        }).join("");

        var tsec = D.createElement("section");
        tsec.className = "fx-trust";
        tsec.innerHTML =
          '<div class="fx-trust-inner">' +
            '<div class="fx-trust-head fr-reveal">' +
              '<div class="fx-trust-kicker">MÜŞTERİ YORUMLARI</div>' +
              '<h2 class="fx-trust-title">Farını yenileyenler ne diyor?</h2>' +
            '</div>' +
            '<div class="fx-trust-stats">' +
              '<div class="fx-stat fr-reveal"><span class="fx-stat-num">200+</span><span class="fx-stat-lbl">yenilenen far</span></div>' +
              '<div class="fx-stat fr-reveal"><span class="fx-stat-num">4.9<span class="fx-stat-star">★</span></span><span class="fx-stat-lbl">müşteri puanı</span></div>' +
              '<div class="fx-stat fr-reveal"><span class="fx-stat-num">Garanti</span><span class="fx-stat-lbl">memnun kalmazsan</span></div>' +
            '</div>' +
            '<div class="fx-trust-reviews">' + cards + '</div>' +
          '</div>';
        banchor.parentNode.insertBefore(tsec, banchor);

        // stagger (dalga) — bu elemanlar block 6'daki gozlemciye dahil olur
        var st = tsec.querySelectorAll(".fx-trust-reviews > .fx-review");
        for (var i = 0; i < st.length; i++) st[i].style.transitionDelay = (i * 90) + "ms";
        var sc = tsec.querySelectorAll(".fx-trust-stats > .fx-stat");
        for (var j = 0; j < sc.length; j++) sc[j].style.transitionDelay = (j * 70) + "ms";
      }
    }

    /* 5d) Randevu formu -> WhatsApp'a hazir mesaj (backend/kayit YOK, hesap gerekmez).
       Musteri formu doldurur -> gonderince tum bilgiler isletmenin WhatsApp'ina hazir mesaj olur. */
    var bform = D.querySelector(".booking-section form") || D.querySelector(".booking-card form") || D.querySelector("form");
    if (bform && !bform.__fxWired) {
      bform.__fxWired = true;
      bform.addEventListener("submit", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();                 // React'in kendi onSubmit'ine ulasmasin
        if (!bform.checkValidity()) { bform.reportValidity(); return; }   // zorunlu alan kontrolu

        function val(n) { var el = bform.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ""; }
        var ad = val("name"), tel = val("phone"), arac = val("car"), yil = val("year"), not = val("note");
        var aracSatir = arac + (yil ? " (" + yil + ")" : "");

        var msg =
          "*FarTech — Randevu Talebi*\n" +
          "👤 Ad: " + ad + "\n" +
          "📞 Telefon: " + tel + "\n" +
          "🚗 Araç: " + aracSatir + "\n" +
          "📝 Not: " + (not || "-");

        window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");

        var btn = bform.querySelector('button[type="submit"]') || bform.querySelector("button");
        if (btn && !btn.__busy) {
          btn.__busy = true;
          var old = btn.textContent;
          btn.textContent = "WhatsApp açılıyor…";
          setTimeout(function () { btn.textContent = old; btn.__busy = false; }, 3500);
        }
      }, false);
    }

    /* 5e) ONCE/SONRA kaydirmali hero gorseli — far beyazlatma zaten bir once/sonra urunu.
       TEMSILI far cizimi; gercek foto gelince iki layer'daki svg birer <img> ile degistirilir. */
    var heroVisual = D.querySelector(".hero-visual");
    if (heroVisual && !heroVisual.querySelector(".fx-ba-wrap")) {

      function lamp(state) {
        var before = state === "before";
        var housing = before ? "#181410" : "#0e1319";
        var lensA = before ? "#c9a24a" : "#bfe9f6", lensB = before ? "#8f7326" : "#5bb9d6";
        var glow = before ? 0 : 1, haze = before ? 0.55 : 0;
        return '' +
          '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
          '<radialGradient id="lg-' + state + '" cx="42%" cy="42%" r="65%">' +
          '<stop offset="0%" stop-color="' + lensA + '"/><stop offset="70%" stop-color="' + lensB + '"/>' +
          '<stop offset="100%" stop-color="' + (before ? "#5c4a1c" : "#1c5f76") + '"/></radialGradient>' +
          '<filter id="bl-' + state + '"><feGaussianBlur stdDeviation="' + (before ? 4.5 : 0.4) + '"/></filter>' +
          '</defs>' +
          '<rect width="400" height="300" fill="' + (before ? "#0a0805" : "#070c11") + '"/>' +
          '<rect x="-20" y="196" width="440" height="140" fill="' + (before ? "#141210" : "#0c1116") + '"/>' +
          '<path d="M60 118 L330 92 Q360 94 362 124 L360 182 Q358 206 330 210 L90 202 Q64 198 60 170 Z" fill="' + housing + '" stroke="' + (before ? "#2a2110" : "#223038") + '" stroke-width="2"/>' +
          '<g filter="url(#bl-' + state + ')">' +
          '<ellipse cx="150" cy="150" rx="60" ry="44" fill="url(#lg-' + state + ')"/>' +
          '<ellipse cx="150" cy="150" rx="30" ry="23" fill="' + (before ? "#6b571f" : "#eaf8fd") + '" opacity="' + (before ? 0.5 : 0.95) + '"/>' +
          '<rect x="215" y="122" width="128" height="10" rx="5" fill="' + (before ? "#7a6428" : "#bfe9f6") + '" opacity="' + (before ? 0.55 : 0.95) + '"/>' +
          '<rect x="215" y="168" width="110" height="8" rx="4" fill="' + (before ? "#6b571f" : "#8fd3e8") + '" opacity="' + (before ? 0.45 : 0.85) + '"/></g>' +
          '<ellipse cx="150" cy="150" rx="80" ry="58" fill="#bfe9f6" opacity="' + (glow * 0.18) + '"/>' +
          '<ellipse cx="279" cy="127" rx="82" ry="17" fill="#bfe9f6" opacity="' + (glow * 0.14) + '"/>' +
          '<rect width="400" height="300" fill="#caa23e" opacity="' + (haze * 0.28) + '"/>' +
          '<rect width="400" height="300" fill="#3a2f12" opacity="' + (haze * 0.15) + '"/>' +
          '</svg>';
      }

      var wrap = D.createElement("div");
      wrap.className = "fx-ba-wrap";
      wrap.innerHTML =
        '<p class="fx-ba-cap">Aynı far — <b>kaydır</b> ve farkı gör</p>' +
        '<div class="fx-ba">' +
          '<div class="fx-ba-layer">' + lamp("before") + '</div>' +
          '<div class="fx-ba-layer fx-ba-after">' + lamp("after") + '</div>' +
          '<span class="fx-ba-tag b">Önce</span>' +
          '<span class="fx-ba-tag a">Sonra</span>' +
          '<input type="range" min="0" max="100" value="50" aria-label="Önce ve sonra karşılaştırma kaydırıcısı">' +
          '<div class="fx-ba-div"></div>' +
          '<div class="fx-ba-knob">⇄</div>' +
        '</div>' +
        '<div class="fx-ba-brosur"><button type="button">📄 Kampanya broşürünü gör</button></div>';

      var poster = heroVisual.querySelector(".hero-poster-card");
      if (poster) poster.style.display = "none";
      heroVisual.insertBefore(wrap, heroVisual.firstChild);

      var ba = wrap.querySelector(".fx-ba");
      var range = wrap.querySelector('input[type="range"]');
      function setx(v) { ba.style.setProperty("--x", v + "%"); }
      setx(50);

      var hinting = !reduce;
      range.addEventListener("input", function () {
        if (hinting) { hinting = false; ba.classList.remove("fx-hint"); }
        setx(range.value);
      });

      var bbtn = wrap.querySelector(".fx-ba-brosur button");
      if (poster && bbtn) {
        bbtn.addEventListener("click", function () {
          var show = poster.style.display === "none";
          poster.style.display = show ? "" : "none";
          bbtn.textContent = show ? "▲ Broşürü gizle" : "📄 Kampanya broşürünü gör";
        });
      }

      /* tek seferlik ipucu: kaydirici kendiliginden bir suzulur (kullanici dokununca iptal) */
      if (!reduce) {
        ba.classList.add("fx-hint");
        setTimeout(function () { if (hinting) setx(72); }, 550);
        setTimeout(function () { if (hinting) setx(30); }, 1350);
        setTimeout(function () { if (hinting) setx(50); }, 2150);
        setTimeout(function () { ba.classList.remove("fx-hint"); }, 2950);
      }
    }

    /* 6) IntersectionObserver: eleman gorunur olunca .fr-in ekle (KILIT SATIR)
       ONEMLI: siniflar mount'tan SONRA eklendigi icin, ilk gizlemeyi
       transition'siz yapariz (fr-prep) -> "sonup tekrar belirme" flasi olmaz. */
    var reveals = D.querySelectorAll(".fr-reveal");

    if (!("IntersectionObserver" in window) || reduce) {
      reveals.forEach(function (el) { el.classList.add("fr-in"); }); // fallback: hepsini goster
      return true;
    }

    reveals.forEach(function (el) { el.classList.add("fr-prep"); }); // transition:none
    void D.body.offsetWidth;                                          // reflow: gizli hale aninda gec

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("fr-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    // bir sonraki karede transition'i ac, sonra gozlemeye basla -> yumusak belirme
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        reveals.forEach(function (el) { el.classList.remove("fr-prep"); });
        reveals.forEach(function (el) { io.observe(el); });
      });
    });

    return true;
  }

  // React render bitene kadar dene (ilk seferde hazirsa hemen biter)
  if (enhance()) return;
  var tries = 0;
  var iv = setInterval(function () {
    if (enhance() || ++tries > 60) clearInterval(iv);   // en fazla ~3 sn bekle
  }, 50);
})();
