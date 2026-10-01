(function () {
  var menuToggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      menuToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      nav.classList.toggle("is-open", !open);
    });
  }

  document.querySelectorAll(".sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sub = btn.nextElementSibling;
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      sub.classList.toggle("is-open", !open);
    });
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var slides = slider.querySelectorAll(".slide");
    var dotsWrap = slider.querySelector(".slider-dots");
    if (slides.length < 2) return;

    var current = 0;
    var timer;
    var dots = [];

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Slide " + (i + 1));
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function show(i) {
      slides[current].classList.remove("is-active");
      dots[current].removeAttribute("aria-current");
      current = i;
      slides[current].classList.add("is-active");
      dots[current].setAttribute("aria-current", "true");
    }

    function restart() {
      clearInterval(timer);
      if (!reduceMotion) {
        timer = setInterval(function () {
          show((current + 1) % slides.length);
        }, 5000);
      }
    }

    show(0);
    restart();
  });

  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector(".carousel-track");
    carousel.querySelector(".carousel-prev").addEventListener("click", function () {
      track.scrollBy({ left: -track.clientWidth, behavior: "smooth" });
    });
    carousel.querySelector(".carousel-next").addEventListener("click", function () {
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + track.clientWidth, behavior: "smooth" });
    });
  });

  var footerForm = document.getElementById("contact-form");
  var successModal = document.getElementById("success-modal");
  if (footerForm && successModal && successModal.showModal) {
    footerForm.addEventListener("cwd-contact:success", function () {
      footerForm.reset();
      setTimeout(function () {
        var status = footerForm.querySelector("[data-cwd-contact-status]");
        if (status) status.textContent = "";
      }, 0);
      successModal.showModal();
    });
    successModal.addEventListener("click", function (e) {
      if (e.target === successModal || e.target.closest("[data-close-modal]")) {
        successModal.close();
      }
    });
  }

  var spinImg = document.querySelector(".spin-once");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var spunKey = "lsl-styku-spun";
  var alreadySpun = false;
  try { alreadySpun = sessionStorage.getItem(spunKey) === "1"; } catch (e) {}
  if (spinImg && !reduceMotion && !alreadySpun && "IntersectionObserver" in window) {
    var spinObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        spinImg.classList.add("is-spinning");
        spinObserver.disconnect();
        try { sessionStorage.setItem(spunKey, "1"); } catch (e) {}
      }
    }, { threshold: 0.5 });
    spinObserver.observe(spinImg);
  }

  var dateEl = document.querySelector("[data-copyright-date]");
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
})();
