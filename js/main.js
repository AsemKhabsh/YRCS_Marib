/**
 * جمعية الهلال الأحمر اليمني — فرع مأرب
 * اليمن Red Crescent Society — Marib Branch
 * Main JavaScript Engine (v2.0)
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // =========================================================================
  // 1. نظام تبديل اللغة (Bilingual System - Arabic / English)
  // =========================================================================
  var htmlElement = document.documentElement;
  var langToggleBtn = document.getElementById('lang-toggle-btn');

  function setLanguage(lang) {
    htmlElement.lang = lang;
    htmlElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    var pageTitle = lang === 'ar'
      ? 'جمعية الهلال الأحمر اليمني – فرع مأرب'
      : 'Yemen Red Crescent Society – Marib Branch';
    document.title = pageTitle;

    try {
      localStorage.setItem('yrc_lang', lang);
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }

    // تحديث نص زر اللغة
    if (langToggleBtn) {
      var langLabel = langToggleBtn.querySelector('.lang-label');
      if (langLabel) {
        langLabel.innerHTML = lang === 'ar'
          ? '<span class="lang-desktop">English</span><span class="lang-mobile">EN</span>'
          : '<span class="lang-desktop">العربية</span><span class="lang-mobile">عربي</span>';
      }
    }
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      var currentLang = htmlElement.lang || 'ar';
      setLanguage(currentLang === 'ar' ? 'en' : 'ar');
    });
  }

  // استعادة اللغة المحفوظة
  try {
    var savedLang = localStorage.getItem('yrc_lang');
    if (savedLang === 'en' || savedLang === 'ar') {
      setLanguage(savedLang);
    }
  } catch (e) {}

  // =========================================================================
  // 2. نظام النمط الداكن/الفاتح (Dark / Light Theme Switcher)
  // =========================================================================
  var themeToggleBtn = document.getElementById('theme-toggle-btn');

  function getPreferredTheme() {
    try {
      var savedTheme = localStorage.getItem('yrc_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    } catch (e) {}
    // الوضع الافتراضي دائماً نهاري (Light Mode) حتى لو كان متصفح المستخدم على الوضع الداكن
    return 'light';
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('yrc_theme', theme);
    } catch (e) {}

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الداكن');
      var icon = themeToggleBtn.querySelector('svg');
      if (icon) {
        icon.innerHTML = theme === 'dark'
          ? '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>'
          : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      }
    }
  }

  var currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      var activeTheme = htmlElement.getAttribute('data-theme') || 'light';
      applyTheme(activeTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // =========================================================================
  // 3. شريط تقدم القراءة وزر الصعود للأعلى (Scroll Progress & Back to Top)
  // =========================================================================
  var progressBar = document.getElementById('scroll-progress');
  var backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = Math.min(progress, 100) + '%';
    }

    if (backToTopBtn) {
      if (scrollTop > 500) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 4. القائمة الجوالة (Mobile Navigation Drawer)
  // =========================================================================
  var navbar = document.querySelector('.navbar');
  var navToggleBtn = document.getElementById('nav-toggle-btn');
  var mobileBackdrop = document.getElementById('mobile-nav-backdrop');

  function toggleMobileMenu(open) {
    if (!navbar) return;
    var isOpen = open !== undefined ? open : !navbar.classList.contains('menu-open');
    navbar.classList.toggle('menu-open', isOpen);
    if (mobileBackdrop) {
      mobileBackdrop.classList.toggle('open', isOpen);
    }
    if (navToggleBtn) {
      navToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }

  if (navToggleBtn) {
    navToggleBtn.addEventListener('click', function () {
      toggleMobileMenu();
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', function () {
      toggleMobileMenu(false);
    });
  }

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMobileMenu(false);
    });
  });

  // =========================================================================
  // 5. تمييز الرابط النشط أثناء التمرير (Active Section Spy)
  // =========================================================================
  var sections = document.querySelectorAll('section[id], header[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          var href = link.getAttribute('href');
          link.classList.toggle('active', href === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (section) {
    spyObserver.observe(section);
  });

  // =========================================================================
  // 6. عداد الأرقام التفاعلي (Smooth Counter Animation)
  // =========================================================================
  var counters = document.querySelectorAll('.stat-number');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      counterObserver.unobserve(el);

      if (prefersReducedMotion) return;

      var rawText = el.textContent.trim();
      var match = rawText.match(/^([^\d]*)([\d,]+)([^\d]*)$/);
      if (!match) return;

      var prefix = match[1];
      var targetNum = parseInt(match[2].replace(/,/g, ''), 10);
      var suffix = match[3];

      var noComma = el.hasAttribute('data-no-comma');
      var startTime = performance.now();
      var duration = 1500;

      function updateCounter(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        // Quartic ease-out curve
        var easeProgress = 1 - Math.pow(1 - progress, 4);
        var currentVal = Math.round(targetNum * easeProgress);

        var formattedVal = noComma ? currentVal : currentVal.toLocaleString('en');
        el.textContent = prefix + formattedVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          var finalVal = noComma ? targetNum : targetNum.toLocaleString('en');
          el.textContent = prefix + finalVal + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }, { threshold: 0.25 });

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  // =========================================================================
  // 7. فلترة التدخلات الإنسانية (Interventions Filter Tabs)
  // =========================================================================
  var filterButtons = document.querySelectorAll('.filter-btn');
  var interventionCards = document.querySelectorAll('.intervention-card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filterValue = btn.getAttribute('data-filter');

      interventionCards.forEach(function (card) {
        var cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(function () {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // =========================================================================
  // 8. معرض الصور الاحترافي المتكامل (Enhanced Lightbox Gallery Modal)
  // =========================================================================
  var lightbox = document.getElementById('lightbox-modal');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxCounter = document.getElementById('lightbox-counter');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');

  var galleryItems = [];
  var currentIndex = 0;

  // جمع صور المقدرات والتدخلات لبناء معرض صور سلس
  document.querySelectorAll('[data-gallery-img]').forEach(function (element, index) {
    var img = element.querySelector('img');
    var caption = element.getAttribute('data-caption') || (img ? img.alt : '');
    var src = img ? img.src : element.getAttribute('data-src');

    galleryItems.push({
      src: src,
      caption: caption,
      alt: img ? img.alt : ''
    });

    element.setAttribute('data-index', index);
    element.style.cursor = 'pointer';

    element.addEventListener('click', function () {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    var item = galleryItems[currentIndex];

    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryItems.length;
    }

    lightbox.showModal();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.close();
    document.body.style.overflow = '';
  }

  function showNextImage() {
    openLightbox(currentIndex + 1);
  }

  function showPrevImage() {
    openLightbox(currentIndex - 1);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      showNextImage();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      showPrevImage();
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      // إغلاق عند النقر على الخلفية المعتمة
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // التنقل بلوحة المفاتيح
    window.addEventListener('keydown', function (e) {
      if (!lightbox.open) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') {
        htmlElement.dir === 'rtl' ? showPrevImage() : showNextImage();
      }
      if (e.key === 'ArrowLeft') {
        htmlElement.dir === 'rtl' ? showNextImage() : showPrevImage();
      }
    });

    // دعم إيماءات اللمس على الهواتف (Touch Swipe)
    var touchStartX = 0;
    var touchEndX = 0;

    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 45) {
        if (diffX > 0) {
          htmlElement.dir === 'rtl' ? showNextImage() : showPrevImage();
        } else {
          htmlElement.dir === 'rtl' ? showPrevImage() : showNextImage();
        }
      }
    }, { passive: true });
  }

  // =========================================================================
  // 9. تأثير الظهور التدريجي (Scroll Reveal Stagger)
  // =========================================================================
  var revealElements = document.querySelectorAll('.reveal');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(function (el, index) {
    el.style.setProperty('--delay', index % 4);
    revealObserver.observe(el);
  });
});