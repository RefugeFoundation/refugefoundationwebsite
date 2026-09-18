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

  // The HubSpot registration form (register.html) resizes its own iframe
  // container as its content changes, by writing an inline height style on
  // .hs-form-frame. When the multi-page form is replaced by the short
  // "thank you" message post-submit, that height drops sharply — but the
  // visitor is usually scrolled down near the submit button at that point,
  // so the confirmation renders above their current scroll position and
  // the page looks blank until they scroll back up. Watch for that drop
  // and bring the confirmation into view automatically.
  document.querySelectorAll(".register-embed .hs-form-frame").forEach(function (frame) {
    var card = frame.closest(".register-embed");
    var maxHeight = 0;
    var observer = new MutationObserver(function () {
      var height = parseInt(frame.style.height, 10) || 0;
      if (height > maxHeight) {
        maxHeight = height;
      } else if (maxHeight > 500 && height > 0 && height < maxHeight * 0.6) {
        card.classList.add("form-submitted");
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    observer.observe(frame, { attributes: true, attributeFilter: ["style"] });
  });

  // On some mobile browsers (notably iOS Safari with Low Power Mode, and
  // some in-app/webview browsers), autoplay of the muted home hero video
  // gets blocked and the browser shows its own native play button over
  // the video instead. Tapping that button often does nothing, because
  // .hero-inner sits above the video (it needs its own higher z-index so
  // its text stays readable over the footage) and silently absorbs the
  // tap before it ever reaches the <video> element. Listen for a tap
  // anywhere in the hero and retry play() from it directly — a real user
  // gesture, which browsers allow even when blocking silent autoplay.
  var heroVideo = document.querySelector(".hero-video");
  var heroSection = document.querySelector(".hero");
  if (heroVideo && heroSection) {
    heroSection.addEventListener("click", function () {
      if (heroVideo.paused) {
        heroVideo.play().catch(function () {});
      }
    });
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
