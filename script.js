// Prevent script from running twice if file is loaded more than once
if (!window.__portfolioScriptInitialized) {
  window.__portfolioScriptInitialized = true;

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;

    function initThemeToggle() {
      const toggle = document.querySelector(".theme-toggle");
      if (!toggle) return;

      const updateIcon = () => {
        const icon = toggle.querySelector("i");
        if (!icon || !window.feather) return;
        icon.setAttribute("data-feather", root.classList.contains("theme-light") ? "sun" : "moon");
        feather.replace();
      };

      toggle.addEventListener("click", function () {
        const nextTheme = root.classList.contains("theme-light") ? "theme-dark" : "theme-light";
        root.classList.remove("theme-light", "theme-dark");
        root.classList.add(nextTheme);
        localStorage.setItem("portfolio-theme", nextTheme);
        updateIcon();
      });

      updateIcon();
    }

    // Hamburger Menu Functionality
    function initHamburgerMenu() {
      const nav = document.querySelector("nav");
      if (!nav) return;

      function createMobileMenu() {
        const existingMenu = document.querySelector(".mobile-menu");
        if (existingMenu) existingMenu.remove();

        const existingHamburger = document.querySelector(".hamburger-menu");
        if (existingHamburger) existingHamburger.remove();

        const hamburgerHTML = `
          <div class="hamburger-menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `;

        const mobileMenuHTML = `
          <div class="mobile-menu">
            <div class="mobile-menu-content">
              <a href="#">Home</a>
              <a href="#about">About</a>
              <a href="#projects">Projects</a>
              <a href="#skills">Skills</a>
              <a href="#device">Device</a>
              <a href="#education">Education</a>
              <a href="#achievement">Achievement</a>
              <a href="#contact">Contact</a>
              <a href="" class="mobile-visit-btn">Visit Me</a>
            </div>
          </div>
        `;

        nav.insertAdjacentHTML("beforeend", hamburgerHTML);
        nav.parentElement.insertAdjacentHTML("afterend", mobileMenuHTML);

        const hamburger = document.querySelector(".hamburger-menu");
        const mobileMenu = document.querySelector(".mobile-menu");
        const mobileLinks = document.querySelectorAll(".mobile-menu-content a");

        if (hamburger && mobileMenu) {
          hamburger.addEventListener("click", function (e) {
            e.stopPropagation();
            this.classList.toggle("active");
            mobileMenu.classList.toggle("active");
          });

          mobileLinks.forEach((link) => {
            link.addEventListener("click", function () {
              hamburger.classList.remove("active");
              mobileMenu.classList.remove("active");
            });
          });
        }
      }

      function handleResize() {
        if (window.innerWidth <= 767) {
          if (!document.querySelector(".hamburger-menu")) {
            createMobileMenu();
          }
        } else {
          const hamburger = document.querySelector(".hamburger-menu");
          const mobileMenu = document.querySelector(".mobile-menu");
          if (hamburger) hamburger.remove();
          if (mobileMenu) mobileMenu.remove();
        }
      }

      handleResize();
      window.addEventListener("resize", handleResize);
    }

    initThemeToggle();
    initHamburgerMenu();

    // Scroll Animation Observer (single trigger only)
    const observerOptions = {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    };
    const animated = new WeakSet();

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        if (animated.has(element)) {
          observer.unobserve(element);
          return;
        }

        animated.add(element);
        const animationType = element.dataset.animation || "fadeInUp";
        element.classList.add("is-visible", `animate-${animationType}`);
        observer.unobserve(element);
      });
    }, observerOptions);

    // Register and observe all elements marked with scroll-animate
    const animateElements = document.querySelectorAll(".scroll-animate");
    animateElements.forEach((el) => {
      const staggerDelay = el.dataset.stagger || "0";
      if (staggerDelay !== "0") {
        el.style.animationDelay = `${staggerDelay}s`;
      }
      observer.observe(el);
    });

    // Hover glow pulse for buttons
    const buttons = document.querySelectorAll(".button a, .nav-button a, .contact-button a");
    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", function () {
        this.classList.add("animate-glowPulse");
      });

      btn.addEventListener("mouseleave", function () {
        this.classList.remove("animate-glowPulse");
      });
    });

    // Float animation for scroll icon
    const scrollIcon = document.querySelector(".scroll i");
    if (scrollIcon) {
      scrollIcon.classList.add("animate-floatUp");
    }

    // Smooth counter animation with decimal support
    function animateCounter(element, target, duration = 2000) {
      const start = 0;
      const stepTime = 16;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = start;
      const hasDecimals = target % 1 !== 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = hasDecimals ? target.toFixed(2) : target;
          clearInterval(counter);
        } else {
          element.textContent = hasDecimals ? current.toFixed(2) : Math.floor(current);
        }
      }, stepTime);
    }

    // Observe stats counter
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.dataset.counterAnimated !== "true") {
            const value = parseFloat(entry.target.textContent);
            if (!isNaN(value)) {
              entry.target.dataset.counterAnimated = "true";
              animateCounter(entry.target, value);
              counterObserver.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const counters = document.querySelectorAll(".gpa, .wpm, .project");
    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });

    // Project cards interactive effect
    const projectCards = document.querySelectorAll(".project-main-content");
    projectCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.boxShadow = "0 0 20px rgba(4, 217, 255, 0.5)";
        this.style.transform = "translateY(-10px)";
        this.style.transition = "all 0.3s ease";
      });

      card.addEventListener("mouseleave", function () {
        this.style.boxShadow = "none";
        this.style.transform = "translateY(0)";
      });
    });

    // Skill sections hover effects
    const skillContentCards = document.querySelectorAll(
      ".skills-content-1, .skills-content-2, .skills-content-3, .skills-content-4"
    );
    skillContentCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.backgroundColor = "rgba(87, 87, 87, 0.3)";
        this.style.transform = "translateY(-5px)";
        this.style.transition = "all 0.3s ease";
        this.style.borderLeft = "3px solid var(--main)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.backgroundColor = "rgba(87, 87, 87, 0.1)";
        this.style.transform = "translateY(0)";
        this.style.borderLeft = "none";
      });
    });
  });

  // Navbar show/hide on scroll
  let lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector("nav");
    if (!navbar) return;

    const scrollTop = window.scrollY;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      navbar.style.transform = "translateY(-100%)";
      navbar.style.transition = "transform 0.3s ease-in";
    } else {
      navbar.style.transform = "translateY(0)";
      navbar.style.transition = "transform 0.3s ease-out";
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
}
