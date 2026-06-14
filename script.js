/* =========================================
PTIT GRADUATION OS
========================================= */

const API_URL = "http://localhost:5000";

const bootScreen = document.getElementById("boot-screen");
const desktop = document.getElementById("desktop");

const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");

const achievementPopup =
  document.getElementById("achievement-popup");

const clock =
  document.getElementById("clock");

/* =========================================
Z INDEX MANAGER
========================================= */

let highestZ = 1000;

/* =========================================
BOOT SEQUENCE
========================================= */

function initTaskbarButtons() {
  document.querySelectorAll('.taskbar-app[data-window]').forEach(btn => {
    btn.addEventListener('click', () => {
      const windowId = btn.dataset.window;
      const win = document.getElementById(windowId);

      if (win) {
        if (win.classList.contains('active')) {
          // Nếu đang mở → focus lên trên
          highestZ++;
          win.style.zIndex = highestZ;
        } else {
          // Mở cửa sổ
          openWindow(windowId);
        }
      }
    });
  });
}

window.addEventListener("load", () => {


  setTimeout(() => {

    bootScreen.style.transition =
      "opacity 1s ease";

    bootScreen.style.opacity = "0";

    setTimeout(() => {

      bootScreen.style.display = "none";

      desktop.style.display = "block";

      showAchievement();

    }, 1000);

  }, 3500);

  initTaskbarButtons();


});

/* =========================================
ACHIEVEMENT POPUP
========================================= */

function showAchievement() {


  if (!achievementPopup) return;

  achievementPopup.classList.add("show");

  setTimeout(() => {

    achievementPopup.classList.remove("show");

  }, 5000);


}

/* =========================================
CLOCK
========================================= */

function updateClock() {


  const now = new Date();

  const hour =
    String(now.getHours()).padStart(2, "0");

  const minute =
    String(now.getMinutes()).padStart(2, "0");

  if (clock) {
    clock.textContent =
      `${hour}:${minute}`;
  }


}

updateClock();

setInterval(updateClock, 1000);

/* =========================================
START MENU
========================================= */

if (startButton) {


  startButton.addEventListener("click", (e) => {

    e.stopPropagation();

    startMenu.classList.toggle("active");

  });


}

document.addEventListener("click", (e) => {


  if (
    startMenu &&
    !startMenu.contains(e.target) &&
    e.target !== startButton
  ) {
    startMenu.classList.remove("active");
  }


});

function animateTimeline() {

  const timeline =
    document.querySelector('.timeline');

  if (!timeline) return;

  timeline.classList.remove('animate');

  const items =
    timeline.querySelectorAll('.timeline-item');

  items.forEach(item =>
    item.classList.remove('show')
  );

  void timeline.offsetWidth;

  timeline.classList.add('animate');

  items.forEach((item, index) => {

    setTimeout(() => {
      item.classList.add('show');
    }, 500 + index * 400);

  });
}

/* =========================================
CLOSE WINDOW
========================================= */

function closeWindow(id) {
  const windowElement = document.getElementById(id);
  if (!windowElement) return;

  windowElement.classList.remove("active");

  // Bỏ active trên taskbar
  document.querySelectorAll('.taskbar-app').forEach(btn => {
    if (btn.dataset.window === id) {
      btn.classList.remove('active');
    }
  });
}

function updateTaskbarActive(activeId) {
  // Xóa active tất cả
  document.querySelectorAll('.taskbar-app').forEach(btn => {
    btn.classList.remove('active');
  });

  // Thêm active cho nút tương ứng
  const activeButton = document.querySelector(`.taskbar-app[data-window="${activeId}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

/* =========================================
FOCUS WINDOW
========================================= */

const windows =
  document.querySelectorAll(".window");

windows.forEach(win => {


  win.addEventListener("mousedown", () => {

    highestZ++;

    win.style.zIndex =
      highestZ;

  });


});

/* =========================================
DRAG WINDOWS
========================================= */

makeWindowsDraggable();

function makeWindowsDraggable() {


  const allWindows =
    document.querySelectorAll(".window");

  allWindows.forEach(win => {

    const header =
      win.querySelector(".window-header");

    if (!header) return;

    let isDragging = false;

    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("mousedown", (e) => {

      isDragging = true;

      highestZ++;

      win.style.zIndex =
        highestZ;

      const rect =
        win.getBoundingClientRect();

      offsetX =
        e.clientX - rect.left;

      offsetY =
        e.clientY - rect.top;

      document.body.style.userSelect =
        "none";

    });

    document.addEventListener(
      "mousemove",
      (e) => {

        if (!isDragging) return;

        win.style.left =
          `${e.clientX - offsetX}px`;

        win.style.top =
          `${e.clientY - offsetY}px`;

      }
    );

    document.addEventListener(
      "mouseup",
      () => {

        isDragging = false;

        document.body.style.userSelect =
          "auto";

      }
    );

  });


}

/* =========================================
ESC KEY
========================================= */

document.addEventListener(
  "keydown",
  (e) => {


    if (e.key === "Escape") {

      startMenu.classList.remove(
        "active"
      );

    }

  }


);

/* =========================================
DEFAULT WINDOW
========================================= */

// setTimeout(() => {


//   openWindow("invitation-window");


// }, 4500);

/* =========================================
DOUBLE CLICK ICONS
========================================= */

const desktopIcons =
  document.querySelectorAll(".desktop-icon");

desktopIcons.forEach(icon => {


  icon.addEventListener(
    "dblclick",
    () => {

      console.log(
        "Desktop icon opened"
      );

    }
  );


});

/* =========================================
PREVENT IMAGE DRAG
========================================= */

document
  .querySelectorAll("img")
  .forEach(img => {


    img.setAttribute(
      "draggable",
      false
    );


  });

/* =========================================
WINDOW ANIMATION HELPER
========================================= */

function animateOpen(windowElement) {


  windowElement.animate(

    [
      {
        opacity: 0,
        transform:
          "scale(.95)"
      },
      {
        opacity: 1,
        transform:
          "scale(1)"
      }
    ],

    {
      duration: 250,
      easing: "ease-out"
    }

  );


}

const observer =
  new MutationObserver(() => {


    document
      .querySelectorAll(
        ".window.active"
      )
      .forEach(win => {

        if (
          !win.dataset.animated
        ) {

          animateOpen(win);

          win.dataset.animated =
            "true";

        }

      });

  });


observer.observe(
  document.body,
  {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"]
  }
);

/* =========================================
SPECIAL PHOTOS GALLERY - WITH PASSWORD LOCK
========================================= */

const TOTAL_PHOTOS = 242;
const INITIAL_PHOTOS = 20;
let unlocked = false;
let galleryInitialized = false;

const ITEM_HEIGHT = 180;
const GAP = 16;

function initVirtualGallery() {
  if (galleryInitialized) return;
  galleryInitialized = true;

  const wrapper = document.getElementById("special-gallery-wrapper");
  const gallery = document.getElementById("special-gallery");
  const spacer = document.getElementById("gallery-spacer");

  let visibleCount = INITIAL_PHOTOS;

  function getVisiblePhotos() {
    return unlocked ? TOTAL_PHOTOS : INITIAL_PHOTOS;
  }

  function render() {
    const galleryWidth = wrapper.clientWidth;
    const columnWidth = 240;
    const columns = Math.max(1, Math.floor(galleryWidth / (columnWidth + GAP)));

    const totalRows = Math.ceil(getVisiblePhotos() / columns);

    spacer.style.height = `${totalRows * (ITEM_HEIGHT + GAP)}px`;

    const scrollTop = wrapper.scrollTop;
    const viewportHeight = wrapper.clientHeight;

    const startRow = Math.max(0, Math.floor(scrollTop / (ITEM_HEIGHT + GAP)) - 2);
    const visibleRows = Math.ceil(viewportHeight / (ITEM_HEIGHT + GAP)) + 4;
    const endRow = startRow + visibleRows;

    const startIndex = startRow * columns;
    const endIndex = Math.min(getVisiblePhotos(), endRow * columns);

    gallery.style.transform = `translateY(${startRow * (ITEM_HEIGHT + GAP)}px)`;
    gallery.innerHTML = "";

    const fragment = document.createDocumentFragment();

    for (let i = startIndex + 1; i <= endIndex; i++) {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.innerHTML = `
                <img src="assets/images/special/${i}.jpg" loading="lazy" alt="Photo ${i}">
            `;
      fragment.appendChild(item);
    }

    gallery.appendChild(fragment);
  }

  // Render lần đầu
  render();

  wrapper.addEventListener("scroll", render);
  window.addEventListener("resize", render);

  // === NÚT MỞ KHOÁ ===
  if (!unlocked && !document.getElementById('unlock-more-btn')) {
    const unlockBtn = document.createElement("button");
    unlockBtn.id = "unlock-more-btn";
    unlockBtn.textContent = "Unlock Premium Photos";
    unlockBtn.onclick = showUnlockOverlay;
    wrapper.appendChild(unlockBtn);
  }

  // Setup click xem full ảnh
  setupGalleryClick();
}

// ===================== PASSWORD OVERLAY =====================
function showUnlockOverlay() {
  const overlay = document.getElementById('unlock-overlay');
  const passwordInput = document.getElementById('unlock-password');
  const message = document.getElementById('unlock-message');

  overlay.classList.add('active');
  passwordInput.focus();
  message.textContent = '';

  // Xử lý Enter
  passwordInput.onkeydown = (e) => {
    if (e.key === 'Enter') unlockPhotos();
  };
}

function hideUnlockOverlay() {
  document.getElementById('unlock-overlay').classList.remove('active');
  document.getElementById('unlock-password').value = '';
}

async function unlockPhotos() {

  const password =
    document.getElementById('unlock-password')
      .value
      .trim();

  const message =
    document.getElementById('unlock-message');

  if (!password) {


    message.textContent =
      "Please enter a password.";

    message.className =
      "unlock-message error";

    return;
  }



  try {

    const response = await fetch(
      `${API_URL}/unlock-gallery`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          password: password
        })
      }
    );

    const result = await response.json();

    if (result.success) {

      message.innerHTML =
        "Password correct! Unlocking...";

      message.className =
        "unlock-message success";

      setTimeout(() => {

        unlocked = true;

        hideUnlockOverlay();

        const unlockBtn =
          document.getElementById(
            'unlock-more-btn'
          );

        if (unlockBtn) {
          unlockBtn.remove();
        }

        galleryInitialized = false;

        const gallery =
          document.getElementById(
            'special-gallery'
          );

        const wrapper =
          document.getElementById(
            'special-gallery-wrapper'
          );

        gallery.innerHTML = '';

        wrapper.scrollTop = 0;

        initVirtualGallery();

      }, 800);

    } else {

      message.textContent =
        "Incorrect password. Try again.";

      message.className =
        "unlock-message error";
    }

  } catch (error) {

    console.error(error);

    message.textContent =
      "Cannot connect to server.";

    message.className =
      "unlock-message error";
  }
}

// ===================== SETUP CLICK LIGHTBOX =====================
function setupGalleryClick() {
  const gallery = document.getElementById('special-gallery');
  if (!gallery) return;

  gallery.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (img && img.src) {
      openLightbox(img.src);
    }
  });
}

// Attach events cho overlay
document.getElementById('unlock-btn').addEventListener('click', unlockPhotos);
document.getElementById('unlock-cancel').addEventListener('click', hideUnlockOverlay);

// Cập nhật openWindow để khởi tạo gallery
function openWindow(id) {

  const windowElement =
    document.getElementById(id);

  if (!windowElement) return;

  windowElement.classList.add("active");

  highestZ++;
  windowElement.style.zIndex = highestZ;

  if (!windowElement.dataset.positioned) {

    requestAnimationFrame(() => {

      const rect =
        windowElement.getBoundingClientRect();

      windowElement.style.left =
        `${(window.innerWidth - rect.width) / 2}px`;

      windowElement.style.top =
        `${(window.innerHeight - rect.height) / 2 - 40}px`;

      windowElement.dataset.positioned = "true";

    });
  }

  updateTaskbarActive(id);

  // Journey
  if (id === 'journey-window') {
    animateTimeline();
  }

  // Gallery
  if (id === 'photo-window') {
    initVirtualGallery();
  }
}

/* =========================================
LIGHTBOX - XEM ẢNH FULL SIZE
========================================= */

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

// Mở lightbox
function openLightbox(src, caption = '') {
  lightboxImage.src = src;
  lightboxCaption.textContent = caption || `Photo #${src.split('/').pop().replace('.jpg', '')}`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Đóng lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Event listeners
lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
    closeLightbox();
  }
});

// ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === "Escape" && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// ==================== Tích hợp với Virtual Gallery ====================
function setupGalleryClick() {
  const gallery = document.getElementById('special-gallery');

  gallery.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (img && img.src) {
      openLightbox(img.src);
    }
  });
}

// Gọi sau khi init virtual gallery
const originalInitVirtualGallery = initVirtualGallery;
initVirtualGallery = function () {
  originalInitVirtualGallery.call(this);
  setupGalleryClick();   // Đảm bảo click listener được gắn
};

// Backup cho trường hợp gallery load lại
setTimeout(() => {
  if (document.getElementById('special-gallery')) {
    setupGalleryClick();
  }
}, 1000);


/* =========================================
GRADUATION COUNTDOWN
========================================= */

function updateGraduationCountdown() {

  // 16/06/2026 11:30
  const graduationDate =
    new Date("2026-06-16T11:30:00");

  const now = new Date();

  const diff =
    graduationDate - now;

  if (diff <= 0) {

    document.getElementById("cd-days").textContent = "0";
    document.getElementById("cd-hours").textContent = "0";
    document.getElementById("cd-minutes").textContent = "0";
    document.getElementById("cd-seconds").textContent = "0";

    return;
  }

  const days =
    Math.floor(diff / (1000 * 60 * 60 * 24));

  const hours =
    Math.floor((diff / (1000 * 60 * 60)) % 24);

  const minutes =
    Math.floor((diff / (1000 * 60)) % 60);

  const seconds =
    Math.floor((diff / 1000) % 60);

  document.getElementById("cd-days").textContent =
    days;

  document.getElementById("cd-hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("cd-minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("cd-seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateGraduationCountdown();
setInterval(updateGraduationCountdown, 1000);


/* =========================================
INTERACTIVE MAP
========================================= */

const mapLocations = {

  "hoi-truong-a": {
    title: "Hội trường A",
    description:
      "Nơi tổ chức lễ tốt nghiệp."
  },

  "parking": {
    title: "Bãi đỗ xe",
    description:
      "Khu vực gửi xe."
  },

  "day-a": {
    title: "Dãy A",
    description:
      "Khu học tập."
  },

  "day-a1": {
    title: "Dãy A",
    description:
      "Khu học tập."
  },

  "day-b": {
    title: "Dãy B",
    description:
      "Khu học tập."
  },

  "day-b1": {
    title: "Dãy B",
    description:
      "Khu học tập."
  },

  "day-b2": {
    title: "Dãy B",
    description:
      "Khu học tập."
  },

  "day-d": {
    title: "Dãy D",
    description:
      "Khu nghiên cứu."
  },

  "day-d1": {
    title: "Dãy D",
    description:
      "Khu nghiên cứu."
  },

  "day-e": {
    title: "Dãy E",
    description:
      "Khu học tập."
  },

  "ktx": {
    title: "Ký túc xá",
    description:
      "Khu sinh viên nội trú."
  },

  "ktx1": {
    title: "Ký túc xá",
    description:
      "Khu sinh viên nội trú."
  },

  "ktx2": {
    title: "Ký túc xá",
    description:
      "Khu sinh viên nội trú."
  },

  "ktx3": {
    title: "Ký túc xá",
    description:
      "Khu sinh viên nội trú."
  },

  "ktx4": {
    title: "Ký túc xá",
    description:
      "Khu sinh viên nội trú."
  },

  "ktx5": {
    title: "Ký túc xá",
    description:
      "Khu sinh viên nội trú."
  },

  "ktx6": {
    title: "Ký túc xá",
    description:
      "Khu sinh viên nội trú."
  },

  "ktx7": {
    title: "Ký túc xá",
    description:
      "Khu sinh viên nội trú."
  },

  "ktx8": {
    title: "Ký túc xá",
    description:
      "Khu sinh viên nội trú."
  },

  "ktx9": {
    title: "Ký túc xá",
    description:
      "Khu sinh viên nội trú."
  },

};

function initInteractiveMap() {
  const tooltip = document.getElementById("map-tooltip");
  const infoPanel = document.getElementById("map-info-panel");
  const buildingInfo = document.getElementById("building-info");

  // Tìm tất cả các phần tử có id trong mapLocations
  Object.keys(mapLocations).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    // Đảm bảo có class building
    if (!el.classList.contains('building')) {
      el.classList.add('building');
    }

    el.style.cursor = 'pointer';

    el.addEventListener("mousemove", (e) => {
      const data = mapLocations[id];
      if (!data) return;

      tooltip.style.display = "block";
      tooltip.style.left = e.clientX + 15 + "px";
      tooltip.style.top = e.clientY + 15 + "px";
      tooltip.innerHTML = `<strong>${data.title}</strong><br><small>${data.description}</small>`;
    });

    el.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });

    el.addEventListener("click", () => {
      const data = mapLocations[id];
      if (!data) return;

      buildingInfo.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.description}</p>
            `;
    });
  });
}

/* =========================================
GUIDE TO HALL
========================================= */

function highlightGraduationHall() {

  document
    .querySelectorAll(".route-highlight")
    .forEach(el =>
      el.classList.remove(
        "route-highlight"
      )
    );

  const hall =
    document.getElementById(
      "hoi-truong-a"
    );

  if (hall) {

    hall.classList.add(
      "route-highlight"
    );

    hall.scrollIntoView({

      behavior: "smooth",

      block: "center",

      inline: "center"
    });
  }
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initInteractiveMap();

    const btn =
      document.getElementById(
        "guide-btn"
      );

    if (btn) {

      btn.addEventListener(
        "click",
        highlightGraduationHall
      );
    }

  }
);


// Mở Google Maps PTIT
function openGoogleMaps() {
  window.open('https://maps.app.goo.gl/uUXz7sZEBcMicsXM9', '_blank');
  // Hoặc dùng link chính xác hơn:
  // window.open('https://www.google.com/maps/place/Học+viện+Công+nghệ+Bưu+chính+Viễn+thông/@21.0485,105.785,17z', '_blank');
}

function typeWriter(element, text, speed = 25) {

  element.textContent = "";

  let i = 0;

  const timer = setInterval(() => {

    element.textContent += text.charAt(i);

    i++;

    if (i >= text.length) {
      clearInterval(timer);
    }

  }, speed);
}


const messageSubmit =
  document.getElementById("message-submit");

if (messageSubmit) {

  messageSubmit.addEventListener("click", async () => {

    const password =
      document.getElementById("message-password").value.trim();

    if (!password) {

      resetMessageUI();

      showMessageStatus(
        "Please enter a password.",
        "error"
      );

      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/get-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            password: password
          })
        }
      );

      const data = await response.json();

      if (data.success) {

        resetMessageUI();

        document.getElementById(
          "receiver-name"
        ).innerText =
          `Gửi ${data.name}`;

        document.getElementById(
          "signature"
        ).innerText =
          `từ ${data.signature}`;

        typeWriter(
          document.getElementById("receiver-message"),
          data.message,
          35
        );

        document.getElementById(
          "message-result"
        ).style.display = "flex";

      } else {

        resetMessageUI();

        showMessageStatus(data.message, "error");

      }

    } catch (error) {

      console.error(error);

      resetMessageUI();

      showMessageStatus("Unable to connect to the server.", "error");
    }

  });

}

function resetMessageUI() {

  const status =
    document.getElementById("message-status");

  const result =
    document.getElementById("message-result");

  status.textContent = "";
  status.className = "message-status";

  result.style.display = "none";
}

function showMessageStatus(text, type) {

  const status =
    document.getElementById("message-status");

  status.textContent = text;

  status.className =
    `message-status ${type}`;
}