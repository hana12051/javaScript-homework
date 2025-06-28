  class GameCarousel {
            constructor() {
                this.currentSlide = 0;
                this.totalSlides = 3;
                this.slidesContainer = document.getElementById('slidesContainer');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.pageInfo = document.getElementById('pageInfo');
                
                this.init();
            }

            init() {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
                this.nextBtn.addEventListener('click', () => this.nextSlide());
                this.updateButtons();
            }

            prevSlide() {
                if (this.currentSlide > 0) {
                    this.currentSlide--;
                    this.updateSlide();
                }
            }

            nextSlide() {
                if (this.currentSlide < this.totalSlides - 1) {
                    this.currentSlide++;
                    this.updateSlide();
                }
            }

            updateSlide() {
                const translateX = -this.currentSlide * 100;
                this.slidesContainer.style.transform = `translateX(${translateX}%)`;
                this.pageInfo.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
                this.updateButtons();
            }

            updateButtons() {
                this.prevBtn.disabled = this.currentSlide === 0;
                this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
            }
        }

        // 캐러셀 초기화
        document.addEventListener('DOMContentLoaded', () => {
            new GameCarousel();
        });