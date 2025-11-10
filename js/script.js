// ------------------------------------------------
// ✅ Lenis 부드러운 스크롤 초기화
// ------------------------------------------------
if (typeof Lenis === 'undefined') {
  console.error('❌ Lenis 로드 실패: CDN 경로를 확인하세요.');
} else {
  const lenis = new Lenis({
    duration: 1.2,
    smooth: true,
    smoothTouch: false,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);
}






// ------------------------------------------------
// ✅ Contact 오버레이 열기/닫기
// ------------------------------------------------
const openBtn = document.getElementById('openContact');
const closeBtn = document.getElementById('closeContact');
const contact = document.getElementById('contactOverlay');

openBtn.addEventListener('click', () => {
  contact.classList.add('active');
  gsap.fromTo(contact, { x: 400, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
});

closeBtn.addEventListener('click', () => {
  gsap.to(contact, {
    x: 400,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.in',
    onComplete: () => contact.classList.remove('active')
  });
});

// ------------------------------------------------
// ✅ GSAP Scroll 애니메이션
// ------------------------------------------------
gsap.registerPlugin(ScrollTrigger);

gsap.from('.hero h1', { y: 80, opacity: 0, duration: 1, ease: 'power3.out' });
gsap.from('.hero-description', { y: 50, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out' });

// ✅ 각 섹션마다 등장 애니메이션 (다시 스크롤해도 재작동)
gsap.utils.toArray('section').forEach((section) => {
  gsap.fromTo(
    section,
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play reverse play reverse',
        markers: false
      }
    }
  );
});

// ------------------------------------------------
// ✅ EmailJS 초기화 & 전송
// ------------------------------------------------
// emailjs.init('YOUR_PUBLIC_KEY'); // 본인 공개 키

// document.getElementById('sendEmail').addEventListener('click', (e) => {
//   const name = document.getElementById('senderName').value.trim();
//   const email = document.getElementById('senderEmail').value.trim();
//   const msg = document.getElementById('message').value.trim();

//   if (!name || !email || !msg) {
//     alert('모든 항목을 입력해주세요.');
//     return;
//   }

//   const templateParams = {
//     sender_name: name,
//     sender_email: email,
//     message: msg,
//     designer_name: '우현지',
//     designer_email: 'rute2002@nate.com',
//     designer_phone: '010-3321-7317',
//     designer_role: '웹디자이너',
//     designer_motto: '끝까지 포기하지 않는다'
//   };

//   emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams).then(
//     () => {
//       alert('메시지가 성공적으로 전송되었습니다. 감사합니다!');
//       contact.classList.remove('active');
//     },
//     (error) => {
//       alert('전송에 실패했습니다. 다시 시도해주세요.');
//       console.error('EmailJS Error:', error);
//     }
//   );
// });

// ------------------------------------------------
// ✅ FAQ 아코디언
// ------------------------------------------------
document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// ------------------------------------------------
// ✅ Smooth Scroll (내비게이션)
// ------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) lenis.scrollTo(target);
  });
});

// ------------------------------------------------
// ✅ 다크/라이트 모드 토글 (로컬저장 포함)
// ------------------------------------------------
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

if (currentTheme === 'light') {
  document.body.classList.add('light-mode');
  themeToggle.textContent = '☀️';
} else {
  themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
  gsap.fromTo(themeToggle, { rotate: 0 }, { rotate: 360, duration: 0.6, ease: 'power2.out' });
});






// ✅ 카드 클릭 시 팝업 열기
const cards = document.querySelectorAll('.feature-card');
const popup = document.getElementById('cardPopup');
const popupContent = document.querySelector('.popup-content');
const popupImage = document.getElementById('popupImage');
const popupTitle = document.getElementById('popupTitle');
const popupDescription = document.getElementById('popupDescription');
const closePopup = document.getElementById('closePopup');
let scrollY = 0;
let popupLenis;

// ✅ 팝업 열기
cards.forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img')?.src;
    const title = card.querySelector('.feature-title')?.textContent || '작업 제목';
    const desc = card.querySelector('.feature-description')?.textContent || '설명 내용이 표시됩니다.';

    popupImage.src = img;
    popupTitle.textContent = title;
    popupDescription.textContent = desc;

    // ✅ Lenis 현재 위치 저장
    if (typeof lenis !== 'undefined') {
      scrollY = lenis.scroll;  // Lenis의 내부 스크롤 위치 저장
      lenis.stop();
    } else {
      scrollY = window.scrollY;
    }

    popup.classList.add('active');
    document.body.classList.add('no-scroll');
    document.documentElement.classList.add('no-scroll');

    // ✅ 팝업 내부 Lenis 생성
    if (typeof Lenis !== 'undefined') {
      popupLenis = new Lenis({
        wrapper: popup.querySelector('.popup-left'),
        content: popup.querySelector('.popup-left'),
        duration: 1.1,
        smooth: true,
      });

      function raf(time) {
        popupLenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // ✅ 애니메이션
    gsap.set(popupContent, { scale: 0.4, rotateY: 180, opacity: 0 });
    gsap.to(popupContent, {
      scale: 1,
      rotateY: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out"
    });
  });
});

// ✅ 닫기
closePopup.addEventListener('click', () => {
  gsap.to(popupContent, {
    scale: 0.7,
    opacity: 0,
    duration: 0.5,
    ease: "power2.inOut",
    onComplete: () => {
      popup.classList.remove('active');
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');

      // ✅ 팝업 Lenis 제거
      if (popupLenis) {
        popupLenis.destroy();
        popupLenis = null;
      }

      // ✅ 메인 Lenis 복원 (원래 위치로)
      if (typeof lenis !== 'undefined') {
        lenis.start();
        lenis.scrollTo(scrollY, { immediate: true }); // ✅ 위치 복구!
      } else {
        window.scrollTo(0, scrollY);
      }

      gsap.set(popupContent, { scale: 1, opacity: 1 });
    }
  });
});





const cursorLabel = document.querySelector('.cursor-label');
const featureCards = document.querySelectorAll('.feature-card');

let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;
const speed = 0.05; // 이동 부드러움 정도

// 마우스 위치 업데이트
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// 매 프레임마다 보간(LERP) 이동
function animateCursor() {
  currentX += (mouseX - currentX) * speed;
  currentY += (mouseY - currentY) * speed;
  cursorLabel.style.transform = `translate(${currentX - 70}px, ${currentY - 70}px) scale(${cursorLabel.classList.contains('active') ? 1 : 0})`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// 카드 위에서만 활성화 + 제목 표시
featureCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    const title = card.querySelector('.feature-title')?.textContent || '';
    cursorLabel.innerHTML = `<span>${title}</span>제작스토리보기`;
    cursorLabel.classList.add('active');
  });

  card.addEventListener('mouseleave', () => {
    cursorLabel.innerHTML = `제작스토리보기`;
    cursorLabel.classList.remove('active');
  });
});
