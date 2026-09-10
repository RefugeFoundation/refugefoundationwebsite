document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      var expanded = links.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded);
    });
  }

  // Close mobile nav when a link is clicked
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
    });
  });

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  // Email buttons: attempt to open the visitor's mail app via mailto,
  // and also copy the address to the clipboard with a small confirmation,
  // since not every browser/device has a default mail client configured.
  document.querySelectorAll(".email-copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var email = btn.getAttribute("data-email");
      if (!email || !navigator.clipboard) return;
      navigator.clipboard.writeText(email).then(function () {
        showCopyToast(btn, "Email copied!");
      }).catch(function () {});
    });
  });

  function showCopyToast(anchorEl, message) {
    var toast = document.createElement("span");
    toast.className = "copy-toast";
    toast.textContent = message;
    anchorEl.insertAdjacentElement("afterend", toast);
    requestAnimationFrame(function () {
      toast.classList.add("show");
    });
    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        toast.remove();
      }, 250);
    }, 1800);
  }

  // Simple front-end form handling (no backend wired up yet)
  document.querySelectorAll("form[data-placeholder-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-success");
      if (note) {
        note.style.display = "block";
        form.reset();
      }
    });
  });
});
