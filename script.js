/**
 * Bhavya Khandelwal Portfolio - Interactive JavaScript
 * Includes: Mobile Menu, Sticky Header, Active Nav Scrollspy, Scroll Reveal, Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Sticky Header Styling on Scroll
  const header = document.getElementById('header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 3. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-footer a');

  const toggleMenu = () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));

    // Prevent body scroll when mobile menu is active
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    if (mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', toggleMenu);

    // Close when clicking any nav link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        mobileNav.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close menu if viewport expands beyond mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // 4. Active Navigation Link on Scroll (Scrollspy)
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav .mobile-nav-link');

  const updateActiveLink = () => {
    const scrollY = window.pageYOffset;
    const headerHeight = header ? header.offsetHeight : 72;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerHeight - 60;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Desktop
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        // Mobile
        mobileLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // 5. Scroll Reveal Animations via IntersectionObserver
  const cardsAndSections = document.querySelectorAll(
    '.card, .about-grid, .hero-content, .hero-visual, .section-header'
  );

  cardsAndSections.forEach(el => el.classList.add('reveal-on-scroll'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    cardsAndSections.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    cardsAndSections.forEach(el => el.classList.add('revealed'));
  }

  // 6. Contact Form Validation and Submission Handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Email validation helper
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Real-time input clearing of errors
    [nameInput, emailInput, messageInput].forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errSpan = document.getElementById(`${input.id}Error`);
        if (errSpan) errSpan.textContent = '';
        if (formStatus) {
          formStatus.style.display = 'none';
          formStatus.className = 'form-status';
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;

      // Validate Name
      const nameValue = nameInput.value.trim();
      if (!nameValue) {
        nameInput.classList.add('error');
        nameError.textContent = 'Please enter your name.';
        hasError = true;
      } else if (nameValue.length < 2) {
        nameInput.classList.add('error');
        nameError.textContent = 'Name should be at least 2 characters.';
        hasError = true;
      } else {
        nameInput.classList.remove('error');
        nameError.textContent = '';
      }

      // Validate Email
      const emailValue = emailInput.value.trim();
      if (!emailValue) {
        emailInput.classList.add('error');
        emailError.textContent = 'Please enter your email address.';
        hasError = true;
      } else if (!isValidEmail(emailValue)) {
        emailInput.classList.add('error');
        emailError.textContent = 'Please enter a valid email address.';
        hasError = true;
      } else {
        emailInput.classList.remove('error');
        emailError.textContent = '';
      }

      // Validate Message
      const messageValue = messageInput.value.trim();
      if (!messageValue) {
        messageInput.classList.add('error');
        messageError.textContent = 'Please enter your message.';
        hasError = true;
      } else if (messageValue.length < 10) {
        messageInput.classList.add('error');
        messageError.textContent = 'Message should be at least 10 characters.';
        hasError = true;
      } else {
        messageInput.classList.remove('error');
        messageError.textContent = '';
      }

      if (hasError) {
        return;
      }

      // If valid, show loading state on button
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending...</span>
        <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.3"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
      `;

      // Simulate sending submission (client-side demo)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        formStatus.className = 'form-status success';
        formStatus.textContent = `Thank you, ${nameValue}! Your message has been received. I will respond to ${emailValue} soon.`;
        formStatus.style.display = 'block';

        // Reset form
        contactForm.reset();

        // Clear success message after 8 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 8000);
      }, 700);
    });
  }
});
