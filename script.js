// Prevent script from running twice if file is loaded more than once
if (!window.__portfolioScriptInitialized) {
  window.__portfolioScriptInitialized = true;

  // Scroll Animation Observer
  document.addEventListener("DOMContentLoaded", function () {
    // Hamburger Menu Functionality - Improved Version
    function initHamburgerMenu() {
      const nav = document.querySelector("nav");

      if (!nav) return;

      // Create and insert hamburger + mobile menu
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

    initHamburgerMenu();

    // Configuration untuk observer
    const observerOptions = {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    };

    // Buat Intersection Observer
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;

        // Lock animation after first trigger so it cannot run 2x on scroll
        if (element.dataset.scrollAnimated === "true") {
          observer.unobserve(element);
          return;
        }

        element.dataset.scrollAnimated = "true";

        const animationType = element.dataset.animation || "fadeInUp";
        const staggerDelay = element.dataset.stagger || "0";

        element.style.animationDelay = `${staggerDelay}s`;
        element.classList.remove("scroll-animate");
        element.classList.add(`animate-${animationType}`);

        observer.unobserve(element);
      });
    }, observerOptions);

    function registerScrollAnimation(element, animationType, staggerDelay = 0) {
      if (!element) return;
      if (element.dataset.scrollRegistered === "true") return;
      if (element.dataset.scrollAnimated === "true") return;

      element.dataset.scrollRegistered = "true";

      if (animationType) {
        element.dataset.animation = animationType;
      }

      element.dataset.stagger = String(staggerDelay);
      element.classList.add("scroll-animate");
      observer.observe(element);
    }

    // Cari semua element dengan class scroll-animate yang sudah ada
    const animateElements = document.querySelectorAll(".scroll-animate");
    animateElements.forEach((el) => {
      registerScrollAnimation(el, el.dataset.animation || "fadeInUp", el.dataset.stagger || 0);
    });

    // Auto-animate project cards dengan stagger
    const projectCards = document.querySelectorAll(".project-main-content");
    projectCards.forEach((card, index) => {
      registerScrollAnimation(card, "slideInUp", index * 0.15);
    });

    // Auto-animate skill cards
    const skillCards = document.querySelectorAll(
      ".skills-card-content, .skills-content-1, .skills-content-2, .skills-content-3, .skills-content-4"
    );
    skillCards.forEach((card, index) => {
      registerScrollAnimation(card, "fadeInUp", index * 0.1);
    });

    // Auto-animate education cards
    const educationCards = document.querySelectorAll(".education-main-content");
    educationCards.forEach((card, index) => {
      registerScrollAnimation(card, "fadeInLeft", index * 0.15);
    });

    // Auto-animate certification cards
    const certCards = document.querySelectorAll(".certification-card");
    certCards.forEach((card, index) => {
      registerScrollAnimation(card, "bounceIn", index * 0.1);
    });

    // Auto-animate device content
    const deviceContent = document.querySelectorAll(".device-content, .device-content-footer");
    deviceContent.forEach((item, index) => {
      registerScrollAnimation(item, index % 2 === 0 ? "fadeInLeft" : "fadeInRight", 0);
    });

    // Auto-animate device container title
    const deviceTitle = document.querySelector(".device-container .device-title");
    registerScrollAnimation(deviceTitle, "fadeInDown", 0);

    // Auto-animate hero title and image (About section)
    const heroTitle = document.querySelector(".header-hero .hero-title");
    const heroImage = document.querySelector(".header-hero .hero-image");
    registerScrollAnimation(heroTitle, "fadeInLeft", 0);
    registerScrollAnimation(heroImage, "fadeInRight", 0);

    // Animate section titles
    const sectionTitles = document.querySelectorAll(
      ".project-title, .skills-title, .education-title, .certification-title, .contact-title, .device-title"
    );
    sectionTitles.forEach((title) => {
      registerScrollAnimation(title, "fadeInDown", 0);
    });

    // Auto-animate contact content sections
    const contactContent = document.querySelector(".contact-content");
    const contactHero = document.querySelector(".contact-hero");
    registerScrollAnimation(contactContent, "fadeInLeft", 0);
    registerScrollAnimation(contactHero, "fadeInRight", 0);

    // Add glow animation on hover untuk buttons
    const buttons = document.querySelectorAll(".button a, .nav-button a, .contact-button a");
    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", function () {
        this.classList.add("animate-glowPulse");
      });

      btn.addEventListener("mouseleave", function () {
        this.classList.remove("animate-glowPulse");
      });
    });

    // Auto-animate footer
    const footer = document.querySelector(".footer");
    registerScrollAnimation(footer, "fadeInUp", 0);

    // Float animation untuk icon scroll
    const scrollIcon = document.querySelector(".scroll i");
    if (scrollIcon) {
      scrollIcon.classList.add("animate-floatUp");
    }

    // Smooth counter animation untuk angka
    function animateCounter(element, target, duration = 2000) {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;

      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target;
          clearInterval(counter);
        } else {
          element.textContent = Math.floor(current);
        }
      }, 16);
    }

    // Trigger counter animation when visible
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

    // Apply counter animation ke elemen dengan angka
    const counters = document.querySelectorAll(".gpa, .wpm, .project");
    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });

    // Stagger animation untuk nav links
    const navLinks = document.querySelectorAll(".nav-link a");
    navLinks.forEach((link, index) => {
      if (link.dataset.navAnimated === "true") return;
      link.dataset.navAnimated = "true";
      link.style.opacity = "0";
      link.style.animation = `fadeInDown 0.6s ease-out ${0.1 * index}s forwards`;
    });

    // Stagger animation untuk cards di home
    const homeCards = document.querySelectorAll(".card span, .title .card span");
    homeCards.forEach((card, index) => {
      if (card.dataset.homeAnimated === "true") return;
      card.dataset.homeAnimated = "true";
      card.style.opacity = "0";
      card.style.animation = `scaleIn 0.6s ease-out ${0.1 * index + 0.3}s forwards`;
    });

    // Add interactive glow effect pada cards
    const projectCards2 = document.querySelectorAll(".project-main-content");
    projectCards2.forEach((card) => {
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

    // Skill cards hover effects
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

  // Navbar hide/show on scroll
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