(function () {
  "use strict";

 
  function createPopupElement(title, message, buttonText = "Tutup") {
    const wrapper = document.createElement("div");
    wrapper.className = "custom-popup";
    wrapper.innerHTML = `
      <div class="popup-content" role="dialog" aria-modal="true" aria-label="${title}">
        <h3>${title}</h3>
        <p>${message}</p>
        <button class="popup-close">${buttonText}</button>
      </div>
    `;

    return wrapper;
  }

  
  function showPopup(title, message, buttonText) {
    try {
      if (document.querySelector(".custom-popup")) return;

      const popup = createPopupElement(title, message, buttonText);
      document.body.appendChild(popup);

      const closeBtn = popup.querySelector(".popup-close");
      if (closeBtn) {
        closeBtn.focus();
        closeBtn.addEventListener("click", () => closePopup(popup), { once: true });
      }

      popup.addEventListener("click", (e) => {
        if (e.target === popup) closePopup(popup);
      });

      document.addEventListener("keydown", function escHandler(e) {
        if (e.key === "Escape") {
          closePopup(popup);
          document.removeEventListener("keydown", escHandler);
        }
      });
    } catch (err) {
      console.error("showPopup error:", err);
    }
  }

  function closePopup(popupNode) {
    try {
      if (!popupNode) return;
      popupNode.classList.add("fadeOut");
      setTimeout(() => {
        if (popupNode.parentNode) popupNode.parentNode.removeChild(popupNode);
      }, 400);
    } catch (err) {
      console.error("closePopup error:", err);
    }
  }


  function initFadeInObserver() {
    try {
      const els = document.querySelectorAll(".fade-in");
      if (!els || els.length === 0) return;

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );

      els.forEach((el) => observer.observe(el));
    } catch (err) {
      console.error("initFadeInObserver error:", err);
    }
  }

  
  function initSmoothScrollAndNavPopups(enableNavPopup = true) {
    try {
      const navLinks = document.querySelectorAll(".nav-links a");
      if (!navLinks) return;

      navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          const href = link.getAttribute("href") || "";
          
          if (!href.startsWith("#")) return;

          
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            window.scrollTo({
              top: target.getBoundingClientRect().top + window.scrollY - 60, // offset untuk navbar
              behavior: "smooth",
            });
          }

          
          if (enableNavPopup) {
            const label = (link.textContent || href.replace("#", "") || "section").trim();
            showPopup(`✨ Menu: ${label}`, `Mengarahkan ke bagian ${label}`, "Oke");
            
            setTimeout(() => {
              const p = document.querySelector(".custom-popup");
              if (p) closePopup(p);
            }, 1200);
          }
        });
      });
    } catch (err) {
      console.error("initSmoothScrollAndNavPopups error:", err);
    }
  }

  
  function init() {
    try {
      
      initFadeInObserver();

      initSmoothScrollAndNavPopups(true);

      setTimeout(() => {
        showPopup(
          "🌷 Welcome",
          "Enjoy diving in! 💖",
          "Close"
        );
      }, 900);
    } catch (err) {
      console.error("init error:", err);
    }
  }

  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
