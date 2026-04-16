const swiffyslider = function() {
  return {
      version: "1.6.0",
      init(rootElement = document.body) {
          for (let sliderElement of rootElement.querySelectorAll(".swiffy-slider")) {
              this.initSlider(sliderElement);
          }
      },

      initSlider(sliderElement) {
          // Limpar autoplay anterior se existir (para evitar múltiplos timers)
          if (sliderElement._swiffyAutoplayClear) {
              sliderElement._swiffyAutoplayClear();
              sliderElement._swiffyAutoplayTimer = null;
              sliderElement._swiffyAutoplayClear = null;
              sliderElement._swiffyAutoplayPause = null;
          }
          
          // Função para pausar autoplay temporariamente quando usuário interage manualmente
          const pauseAutoplayTemporarily = () => {
            if (sliderElement._swiffyAutoplayPause) {
              sliderElement._swiffyAutoplayPause();
            }
          };
          
          for (let navElement of sliderElement.querySelectorAll(".slider-nav")) {
              let next = navElement.classList.contains("slider-nav-next");
              navElement.addEventListener("click", () => {
                pauseAutoplayTemporarily();
                this.slide(sliderElement, next);
              }, { passive: true });
          }
          for (let indicatorElement of sliderElement.querySelectorAll(".slider-indicators")) {
              indicatorElement.addEventListener("click", () => {
                pauseAutoplayTemporarily();
                this.slideToByIndicator();
              }, { passive: true });
              this.onSlideEnd(sliderElement, () => this.handleIndicators(sliderElement), 60);
          }
          if (sliderElement.classList.contains("slider-nav-autoplay")) {
              const timeoutAttr = sliderElement.getAttribute("data-slider-nav-autoplay-interval");
              const timeout = timeoutAttr ? parseInt(timeoutAttr, 10) : 2500;
              this.autoPlay(sliderElement, timeout, sliderElement.classList.contains("slider-nav-autopause"));
          }
          if (["slider-nav-autohide", "slider-nav-animation"].some(className => sliderElement.classList.contains(className))) {
              const threshold = sliderElement.getAttribute("data-slider-nav-animation-threshold") ? sliderElement.getAttribute("data-slider-nav-animation-threshold") : 0.3;
              this.setVisibleSlides(sliderElement, threshold);
          }
          
          // Prevenir scroll da roda do mouse nos carrosséis de produtos
          const container = sliderElement.querySelector(".slider-container");
          if (container) {
              // Verificar se é um carrossel de produtos (carrossel1-5 ou recommendations)
              const isProductCarousel = sliderElement.closest('.carrossel1, .carrossel2, .carrossel3, .carrossel4, .carrossel5, .recommendations');
              if (isProductCarousel) {
                  container.addEventListener('wheel', (e) => {
                      // Prevenir scroll horizontal da roda do mouse
                      // Permitir apenas scroll vertical (para a página) ou touch/swipe
                      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                          e.preventDefault();
                      }
                  }, { passive: false });
              }
          }
      },

      setVisibleSlides(sliderElement, threshold = 0.3) {
          let observer = new IntersectionObserver(slides => {
              slides.forEach(slide => {
                  slide.isIntersecting ? slide.target.classList.add("slide-visible") : slide.target.classList.remove("slide-visible");
              });
              sliderElement.querySelector(".slider-container>*:first-child").classList.contains("slide-visible") ? sliderElement.classList.add("slider-item-first-visible") : sliderElement.classList.remove("slider-item-first-visible");
              sliderElement.querySelector(".slider-container>*:last-child").classList.contains("slide-visible") ? sliderElement.classList.add("slider-item-last-visible") : sliderElement.classList.remove("slider-item-last-visible");
          }, {
              root: sliderElement.querySelector(".slider-container"),
              threshold: threshold
          });
          for (let slide of sliderElement.querySelectorAll(".slider-container>*"))
              observer.observe(slide);
      },

      slide(sliderElement, next = true) {
          const container = sliderElement.querySelector(".slider-container");
          const fullpage = sliderElement.classList.contains("slider-nav-page");
          const noloop = sliderElement.classList.contains("slider-nav-noloop");
          const nodelay = sliderElement.classList.contains("slider-nav-nodelay");
          const slides = container.children;
          const gapWidth = parseInt(window.getComputedStyle(container).columnGap);
          const scrollStep = slides[0].offsetWidth + gapWidth;
          
          // Verificar se é o banners_centro_desktop (banners que ocupam 100% da largura)
          const isBannersCentroDesktop = sliderElement.closest("#banners_centro_desktop") !== null;
          
          let scrollLeftPosition = next ?
              container.scrollLeft + scrollStep :
              container.scrollLeft - scrollStep;
          if (fullpage || isBannersCentroDesktop) {
              // Para banners que ocupam 100% da largura, usar container.offsetWidth para avançar exatamente 1 banner
              scrollLeftPosition = next ?
                  container.scrollLeft + container.offsetWidth :
                  container.scrollLeft - container.offsetWidth;
          }
          if (container.scrollLeft < 1 && !next && !noloop) {
              scrollLeftPosition = (container.scrollWidth - container.offsetWidth);
          }
          if (container.scrollLeft >= (container.scrollWidth - container.offsetWidth) && next && !noloop) {
              scrollLeftPosition = 0;
          }
          container.scroll({
              left: scrollLeftPosition,
              behavior: nodelay ? "auto" : "smooth"
          });
      },

      slideToByIndicator() {
          const indicator = window.event.target;
          const indicatorIndex = Array.from(indicator.parentElement.children).indexOf(indicator);
          const indicatorCount = indicator.parentElement.children.length;
          const sliderElement = indicator.closest(".swiffy-slider");
          const slideCount = sliderElement.querySelector(".slider-container").children.length;
          const relativeSlideIndex = (slideCount / indicatorCount) * indicatorIndex;
          this.slideTo(sliderElement, relativeSlideIndex);
      },

      slideTo(sliderElement, slideIndex) {
          const container = sliderElement.querySelector(".slider-container");
          const gapWidth = parseInt(window.getComputedStyle(container).columnGap);
          const scrollStep = container.children[0].offsetWidth + gapWidth;
          const nodelay = sliderElement.classList.contains("slider-nav-nodelay");
          container.scroll({
              left: (scrollStep * slideIndex),
              behavior: nodelay ? "auto" : "smooth"
          });
      },

      onSlideEnd(sliderElement, delegate, timeout = 125) {
          let isScrolling;
          sliderElement.querySelector(".slider-container").addEventListener("scroll", function() {
              window.clearTimeout(isScrolling);
              isScrolling = setTimeout(delegate, timeout);
          }, { capture: false, passive: true });
      },

      autoPlay(sliderElement, timeout, autopause) {
        timeout = timeout < 1000 ? 1000 : timeout;
        const slider = this;
        const container = sliderElement.querySelector(".slider-container");
        
        // Armazenar o timer no elemento do slider para poder limpar corretamente
        let autoplayTimer = null;
        let isPaused = false;
        let isScrolling = false;
        
        // Função para limpar o timer atual
        const clearAutoplayTimer = () => {
          if (autoplayTimer !== null) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
          }
        };
        
        // Função para pausar temporariamente o autoplay (quando usuário interage)
        let manualInteractionTimer = null;
        const pauseTemporarily = () => {
          clearAutoplayTimer();
          if (manualInteractionTimer) clearTimeout(manualInteractionTimer);
          // Retomar após um tempo maior que o intervalo normal
          manualInteractionTimer = setTimeout(() => {
            startAutoplay();
          }, timeout + 500);
        };
        
        // Função para iniciar o autoplay
        const startAutoplay = () => {
          clearAutoplayTimer();
          if (manualInteractionTimer) {
            clearTimeout(manualInteractionTimer);
            manualInteractionTimer = null;
          }
          if (!isPaused && !isScrolling) {
            autoplayTimer = setInterval(() => {
              // Verificar se não está em animação antes de avançar
              if (!isScrolling && !isPaused) {
                // Marcar como em animação antes de iniciar o slide
                isScrolling = true;
                slider.slide(sliderElement, true);
                // O flag isScrolling será resetado pelo listener de scroll
              }
            }, timeout);
          }
        };
        
        // Detectar quando o scroll termina para resetar o flag de animação
        // E também pausar autoplay quando usuário faz scroll manual
        let lastScrollLeft = container.scrollLeft;
        let scrollEndTimer = null;
        let isManualScroll = false;
        let manualScrollTimeout = null;
        
        // Detectar início de scroll manual (touch/mouse)
        container.addEventListener("touchstart", () => {
          isManualScroll = true;
          pauseTemporarily();
        }, { passive: true });
        
        container.addEventListener("mousedown", () => {
          isManualScroll = true;
          pauseTemporarily();
        }, { passive: true });
        
        container.addEventListener("scroll", () => {
          const currentScrollLeft = container.scrollLeft;
          const isActuallyScrolling = Math.abs(currentScrollLeft - lastScrollLeft) > 1;
          
          if (isActuallyScrolling) {
            isScrolling = true;
            if (scrollEndTimer) clearTimeout(scrollEndTimer);
            // Resetar flag quando o scroll parar (sem movimento por 200ms)
            scrollEndTimer = setTimeout(() => {
              isScrolling = false;
              lastScrollLeft = container.scrollLeft;
              // Se foi scroll manual, resetar flag após um tempo maior
              if (isManualScroll) {
                if (manualScrollTimeout) clearTimeout(manualScrollTimeout);
                manualScrollTimeout = setTimeout(() => {
                  isManualScroll = false;
                }, 1000);
              }
            }, 200);
          }
          
          lastScrollLeft = currentScrollLeft;
        }, { passive: true });
        
        // Iniciar autoplay
        startAutoplay();
        
        if (autopause) {
          // Pausar no hover/touch
          sliderElement.addEventListener("mouseenter", () => {
            isPaused = true;
            clearAutoplayTimer();
          }, { passive: true });

          sliderElement.addEventListener("touchstart", () => {
            isPaused = true;
            clearAutoplayTimer();
          }, { passive: true });

          // Retomar quando sair do hover/touch
          sliderElement.addEventListener("mouseleave", () => {
            isPaused = false;
            startAutoplay();
          }, { passive: true });

          sliderElement.addEventListener("touchend", () => {
            // Pequeno delay antes de retomar para evitar conflitos
            setTimeout(() => {
              isPaused = false;
              startAutoplay();
            }, 300);
          }, { passive: true });
        }
        
        // Armazenar referências no elemento para limpeza e controle posterior
        sliderElement._swiffyAutoplayTimer = autoplayTimer;
        sliderElement._swiffyAutoplayClear = clearAutoplayTimer;
        sliderElement._swiffyAutoplayPause = pauseTemporarily;
        
        return autoplayTimer;
      },

      handleIndicators(sliderElement) {
          if (!sliderElement) return;
          const container = sliderElement.querySelector(".slider-container");
          const slidingAreaWidth = container.scrollWidth - container.offsetWidth;
          const percentSlide = (container.scrollLeft / slidingAreaWidth);
          for (let scrollIndicatorContainers of sliderElement.querySelectorAll(".slider-indicators")) {
              let scrollIndicators = scrollIndicatorContainers.children;
              let activeIndicator = Math.abs(Math.round((scrollIndicators.length - 1) * percentSlide));
              for (let element of scrollIndicators)
                  element.classList.remove("active");
              scrollIndicators[activeIndicator].classList.add("active");
          }
      }
  };
}();

window.swiffyslider = swiffyslider;
if (!document.currentScript.hasAttribute("data-noinit")) {
  if (document.currentScript.hasAttribute("defer")) {
      swiffyslider.init();
  } else {
      document.onreadystatechange = () => {
          if (document.readyState === 'interactive') {
              swiffyslider.init();
          }
      }
  }
}