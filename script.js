document.addEventListener('DOMContentLoaded', () => {
  // semua DOM-access di sini


window.history.scrollRestoration = 'manual';

// URL guest functionality
const urlParams = new URLSearchParams(window.location.search);
const guestNameFromUrl = urlParams.get("to");
const guestNameInput = document.getElementById('guest-name-input');

// Populate guest name input if present in URL
if (guestNameFromUrl) {
    guestNameInput.value = decodeURIComponent(guestNameFromUrl);
}

// COVER SECTION
// Cover screen functionality
// 🔊 Variabel global hanya dideklarasikan sekali
const backgroundMusic = document.getElementById('background-music');
const musicToggleButton = document.getElementById('music-toggle-button');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

// 🚪 Fungsi masuk undangan
function masukWebsite() {
  document.getElementById('cover').classList.add('slide-up');
  document.body.classList.remove('cover-active');

  musicToggleButton.style.display = 'flex';

  backgroundMusic.play().then(() => {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  }).catch(() => {
    alert("Musik tidak dapat diputar otomatis. Silakan tekan tombol play.");
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  });
}
window.masukWebsite = masukWebsite;

// Ukuran window
function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);
setVh(); // jalankan saat pertama


  
// 🎵 Fungsi toggle play/pause musik
function toggleMusic() {
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(error => {
      console.log("Autoplay was prevented:", error);
      alert("Musik tidak dapat diputar otomatis. Silakan klik tombol play.");
    });
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    backgroundMusic.pause();
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
}

// 🎧 Jalankan toggle saat tombol musik diklik
musicToggleButton.addEventListener('click', toggleMusic);


// HERO SECTION
// Countdown functionality
const weddingDate = new Date("September 25, 2025 11:00:00").getTime();
const countdownElement = document.getElementById("hero-countdown");

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;

    if (distance < 0) {
        clearInterval(countdownInterval);
        countdownElement.innerHTML = "<div class='event-started'>Event has started!</div>";
    }
};

const countdownInterval = setInterval(updateCountdown, 1000);


// EVENT SECTION
// Save date functionality
function saveDateToCalendar() {
    const eventDateText = document.getElementById("event-date").innerText;
    const eventTimeText = document.getElementById("event-time").innerText;
    const eventLocationText = document.getElementById("event-location").innerText;

    const eventTitle = "Wedding Invitation - Hendra & Maylin";
    const eventDescription = "Join us for our wedding celebration!";

    // Parse date
    const dateParts = eventDateText.match(/(\d{1,2})\s(\w+)\s(\d{4})/);
    let day, monthName, year;
    if (dateParts) {
        day = parseInt(dateParts[1]);
        monthName = dateParts[2];
        year = parseInt(dateParts[3]);
    } else {
        console.error("Could not parse event date:", eventDateText);
        alertMessage("Gagal menyimpan tanggal. Format tanggal tidak dikenali.");
        return;
    }

    // Month mapping for Date object
    const monthMap = {
        "Januari": 0, "Februari": 1, "Maret": 2, "April": 3, "Mei": 4, "Juni": 5,
        "Juli": 6, "Agustus": 7, "September": 8, "Oktober": 9, "November": 10, "Desember": 11
    };
    const month = monthMap[monthName];

    // Parse time range
    const timeRangeParts = eventTimeText.split(' - ');
    if (timeRangeParts.length < 2) {
        console.error("Could not parse event time range:", eventTimeText);
        alertMessage("Gagal menyimpan tanggal. Format waktu tidak dikenali.");
        return;
    }

    const startTimeStr = timeRangeParts[0].trim();
    const endTimeStr = timeRangeParts[1].split(' ')[0].trim();

    const startTimeParts = startTimeStr.includes(':') ? startTimeStr.split(':') : startTimeStr.split('.');
    const startHour = parseInt(startTimeParts[0]);
    const startMinute = parseInt(startTimeParts[1]);

    const endTimeParts = endTimeStr.includes(':') ? endTimeStr.split(':') : endTimeStr.split('.');
    const endHour = parseInt(endTimeParts[0]);
    const endMinute = parseInt(endTimeParts[1]);

    // Create Date objects
    const startDate = new Date(year, month, day, startHour, startMinute);
    const endDate = new Date(year, month, day, endHour, endMinute);

    // Helper to format date for Google Calendar URL
    const formatDateTime = (date) => {
        const pad = (num) => String(num).padStart(2, '0');
        return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    }; 

    const formattedStartDate = formatDateTime(startDate);
    const formattedEndDate = formatDateTime(endDate);

    // TOMBOL BUKA MAPS
    // Construct Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${formattedStartDate}/${formattedEndDate}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocationText)}&sf=true&output=xml`;

    window.open(googleCalendarUrl, '_blank'); // Open in new tab
}
window.saveDateToCalendar = saveDateToCalendar;

function openMapsApp(locationQuery) {
    const encodedLocation = encodeURIComponent(locationQuery);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    window.open(mapUrl, '_blank'); // Open in new tab
}
window.openMapsApp = openMapsApp;


// RSVP SECTION
// RSVP functionality
function sendRsvp() {
    const nameInput = document.getElementById('rsvp-name');
    const guestsSelect = document.getElementById('rsvp-guests');
    const name = nameInput.value.trim();
    const guests = guestsSelect.value;

    if (!name) {
        alertMessage("Nama lengkap tidak boleh kosong!");
        return;
    }
    if (guests < 1) {
        alertMessage("Jumlah tamu minimal 1.");
        return;
    }

    // REPLACE WITH YOUR GOOGLE FORM DETAILS
    const formId = '1FAIpQLSfGWLeHQVOsCbZpwHqPx3zLBe5tvP2fnihyZ3jk9oBB7rnOjQ'; // Replace with your actual Google Form ID
    const nameEntryId = '1590223346'; // Replace with the entry ID for Name field
    const guestsEntryId = '882125067'; // Replace with the entry ID for Guests field

    if (formId === 'YOUR_GOOGLE_FORM_ID_HERE' || nameEntryId === 'YOUR_NAME_ENTRY_ID' || guestsEntryId === 'YOUR_GUESTS_ENTRY_ID') {
        alertMessage("Harap konfigurasikan Google Form Anda terlebih dahulu di kode JavaScript.");
        console.error("Google Form IDs not configured. Please read the comments in sendRsvp() function.");
        return;
    }

    const googleFormUrl = `https://docs.google.com/forms/d/e/${formId}/viewform?usp=pp_url&entry.${nameEntryId}=${encodeURIComponent(name)}&entry.${guestsEntryId}=${encodeURIComponent(guests)}`;

    window.open(googleFormUrl, '_blank'); // Open Google Form in a new tab
}
window.sendRsvp = sendRsvp;


// GIFTS SECTION
// Copy to clipboard functionality
function copyToClipboard(elementId) {
    const copyText = document.getElementById(elementId).value;
    console.log(copyText);
    const textArea = document.createElement("textarea");
    textArea.value = copyText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alertMessage("Terima kasih atas perhatian dan kebaikan hati Anda!");
}
window.copyToClipboard = copyToClipboard;

// Alert message functionality
function alertMessage(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'glass-button-style duration-300 z-50 alert-message';
    alertBox.innerText = message;
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        alertBox.style.opacity = '0';
        alertBox.addEventListener('transitionend', () => alertBox.remove());
    }, 3000);
}


//GALLERY SECTION
// Gallery functionality
let hasMoved = false;
let currentSlideIndex = 0;
const totalSlides = 6;
let autoSlideInterval;
let startX = 0;
let currentX = 0;
let pendingLoopReset = null;
let isDragging = false;
let isLooping = false;
let queuedSwipe = null;
let isTransitioning = false;

        const photosTrack = document.getElementById('photosTrack');
        const navLeft = document.getElementById('navLeft');
        const navRight = document.getElementById('navRight');
        const dots = document.querySelectorAll('.dot');

        // Slide data
        const slides = [
            { text: '', class: 'slide-1' },
            { text: '', class: 'slide-2' },
            { text: '', class: 'slide-3' },
            { text: '', class: 'slide-4' },
            { text: '', class: 'slide-5' },
            { text: '', class: 'slide-6' }
        ];

        function createPhotoElement(slideData) {
            return `
                <div class="photo-item ${slideData.class}">
                    <div class="photo-content">
                        <div class="photo-placeholder">${slideData.text}</div>
                    </div>
                </div>
            `;
        }

        function buildTrack() {
            // Create infinite track with multiple clones for smoother transitions
            let trackHTML = '';
            
            // Add last two slides as clones for seamless previous transition
            trackHTML += createPhotoElement(slides[4]); // Clone slide 5
            trackHTML += createPhotoElement(slides[5]); // Clone slide 6
            
            // Add all original slides
            slides.forEach(slide => {
                trackHTML += createPhotoElement(slide);
            });
            
            // Add first two slides as clones for seamless next transition
            trackHTML += createPhotoElement(slides[0]); // Clone slide 1
            trackHTML += createPhotoElement(slides[1]); // Clone slide 2
            
            photosTrack.innerHTML = trackHTML;
        }

        function updateSlidePosition(immediate = false) {
            const slideWidth = photosTrack.querySelector('.photo-item').offsetWidth;
            const gap = 8; // 0.5rem = 8px
            const containerWidth = photosTrack.parentElement.offsetWidth;
            
            const totalSlideWidth = slideWidth + gap;
            const centerOffset = (containerWidth - slideWidth) / 2;
            
            // Position calculation: we start at index 2 (first real slide after 2 clones)
            // currentSlideIndex 0 = track position 2, etc.
            const slideOffset = (currentSlideIndex + 2) * totalSlideWidth;
            const translateX = centerOffset - slideOffset;
            
            if (immediate) {
                photosTrack.style.transition = 'none';
                photosTrack.style.transform = `translateX(${translateX}px)`;
                // Force reflow
                photosTrack.offsetHeight;
                photosTrack.style.transition = 'transform 0.6s cubic-bezier(0.42, 0, 0.58, 1)';
            } else {
                photosTrack.style.transform = `translateX(${translateX}px)`;
            }
        }

// Update dots
            function updateDot(index) {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}



        function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    currentSlideIndex++;
    updateSlidePosition();
    updateDot(currentSlideIndex >= totalSlides ? 0 : currentSlideIndex);

    if (currentSlideIndex >= totalSlides) {
        pendingLoopReset = 0; // akan di-reset ke slide 0
    }

    // Tetap biarkan transition berjalan
    setTimeout(() => {
    isTransitioning = false;
}, 600);
}


        function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    currentSlideIndex--;
    updateSlidePosition();
    updateDot(currentSlideIndex < 0 ? totalSlides - 1 : currentSlideIndex);

    if (currentSlideIndex < 0) {
        pendingLoopReset = totalSlides - 1; // akan di-reset ke slide terakhir
    }

    // Biarkan transisi jalan dulu
    setTimeout(() => {
    isTransitioning = false;
}, 600);

}


function swipeNextSlide() {
    if (isLooping) return;

    currentSlideIndex++;

    if (currentSlideIndex >= totalSlides) {
        updateSlidePosition();
        updateDot(0);
        isLooping = true;
        pendingLoopReset = 0; // ← jadwal reset ke index 0 setelah transisi selesai
    } else {
        updateSlidePosition();
        updateDot(currentSlideIndex);
    }
}




function swipePrevSlide() {
    if (isLooping) return;

    currentSlideIndex--;

    if (currentSlideIndex < 0) {
        updateSlidePosition();
        updateDot(totalSlides - 1);
        isLooping = true;
        pendingLoopReset = totalSlides - 1;
    } else {
        updateSlidePosition();
        updateDot(currentSlideIndex);
    }
}




        function currentSlide(n) {
            if (isTransitioning) return;
            currentSlideIndex = n - 1;
            updateSlidePosition();
            resetAutoSlide();
        }
window.currentSlide = currentSlide;

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        function resetAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }

        // Touch/Mouse events for swipe
        function handleStart(e) {
            isDragging = true;
            hasMoved = false;
            startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            currentX = startX; // <-- tambahkan ini untuk memastikan nilai awal
            stopAutoSlide();
        }

        function handleMove(e) {
            if (!isDragging) return;
            currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            hasMoved = true;
        }

        function handleEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    const deltaX = currentX - startX;
    const threshold = 40;
    console.log('deltaX:', deltaX);
    console.log('Swipe Direction:', deltaX > 0 ? '→ prev' : '← next');

    if (deltaX <= -threshold) {
        // Geser ke kiri cukup jauh → next
        if (isLooping) queuedSwipe = 'next';
        else swipeNextSlide();
    } else if (deltaX >= threshold) {
        // Geser ke kanan cukup jauh → prev
        if (isLooping) queuedSwipe = 'prev';
        else swipePrevSlide();
    }

    resetAutoSlide();
}


        // Event listeners
        photosTrack.addEventListener('mousedown', handleStart);
        photosTrack.addEventListener('mousemove', handleMove);
        photosTrack.addEventListener('mouseup', handleEnd);
        photosTrack.addEventListener('mouseleave', handleEnd);

        photosTrack.addEventListener('touchstart', handleStart);
        photosTrack.addEventListener('touchmove', handleMove, { passive: false }); // Baru ditambahkan 
        photosTrack.addEventListener('touchend', handleEnd);

        // Navigation areas click events
        navLeft.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        navRight.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        // Prevent image dragging
        photosTrack.addEventListener('dragstart', (e) => e.preventDefault());

        // Pause on hover
        photosTrack.addEventListener('mouseenter', stopAutoSlide);
        photosTrack.addEventListener('mouseleave', startAutoSlide);

        // Handle window resize
        window.addEventListener('resize', () => {
            updateSlidePosition(true);
        });

        // Initialize
        buildTrack();
        setTimeout(() => {
            updateSlidePosition(true);
            startAutoSlide();
        }, 100);
        photosTrack.addEventListener('transitionend', () => {
    if (pendingLoopReset !== null) {
        const resetIndex = pendingLoopReset;
        pendingLoopReset = null;
        requestAnimationFrame(() => {
            currentSlideIndex = resetIndex;
            updateSlidePosition(true);
            isLooping = false;

            // ✅ Eksekusi swipe yang tertunda jika ada
            if (queuedSwipe) {
                if (queuedSwipe === 'next') swipeNextSlide();
                else swipePrevSlide();
                queuedSwipe = null;
            }
        });
    }
});
// END Gallery //

});



// FIREBASE
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAnalytics
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import {
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore, collection, doc, setDoc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

/* 2️⃣ Pindahkan config ke sini atau ekspor via window di HTML */
const firebaseConfig = {
    apiKey: "AIzaSyCl7Gu6RydnDB1txrFueXZnxBPN7gGjtjk",
    authDomain: "doa-restu.firebaseapp.com",
    databaseURL: "https://doa-restu-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "doa-restu",
    storageBucket: "doa-restu.firebasestorage.app",
    messagingSenderId: "883130310391",
    appId: "1:883130310391:web:a3816d58d134432926bdf2",
    measurementId: "G-KCP6V8GZQL"
};

const app  = initializeApp(firebaseConfig);
getAnalytics(app);

const db   = getFirestore(app);
const auth = getAuth(app);

/* 3️⃣ Lanjutkan logika blessing persis seperti kode Anda — tidak
      perlu inisialisasi Firebase kedua kalinya. */

let userId;
let blessingsCollection;

// Sign in (anonymous atau custom token)
if (typeof __initial_auth_token !== 'undefined') {
  signInWithCustomToken(auth, __initial_auth_token);
} else {
  signInAnonymously(auth);
}

// Cek status auth dan siapkan collection
onAuthStateChanged(auth, user => {
  if (user) {
    userId = user.uid;
  } else {
    userId = crypto.randomUUID();
  }

  console.log("Firebase User ID:", userId);

  const appId = typeof __app_id !== 'undefined' ? __app_id : 'blessings-list';
  blessingsCollection = collection(db, "blessings-list");

  displayBlessings();
  document.getElementById('blessings-list').innerText = `User ID: ${userId}`;
});

// Fungsi kirim ucapan
document.getElementById('sendBlessingBtn').addEventListener('click', sendBlessing);
export async function sendBlessing() {
  const nameInput = document.getElementById('blessing-name');
  const messageInput = document.getElementById('blessing-message');
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  

  if (!name || !message) {
    alertMessage("Nama dan ucapan tidak boleh kosong!");
    return;
  }

  try {
    const uniqueId = `${name}-${Date.now()}`;
    const docRef = doc(blessingsCollection, uniqueId); // nama jadi ID dokumen
    await setDoc(docRef, {
      name: name,
      message: message,
      timestamp: serverTimestamp(),
      userId: userId
    });

    nameInput.value = '';
    messageInput.value = '';
    alertMessage("Ucapan doa restu berhasil dikirim!");
  } catch (error) {
    console.error("Error saving blessing:", error);
    alertMessage("Gagal mengirim ucapan. Coba lagi nanti.");
  }
}

// Tampilkan ucapan
function displayBlessings() {
  const blessingsListDiv = document.getElementById('blessings-list');
  if (!blessingsCollection) return;

  onSnapshot(blessingsCollection, snapshot => {
    blessingsListDiv.innerHTML = '';
    const blessings = [];

    snapshot.forEach(doc => {
      blessings.push({ id: doc.id, ...doc.data() });
    });

    blessings.sort((a, b) => {
      const timeA = a.timestamp?.toDate?.() || new Date(0);
      const timeB = b.timestamp?.toDate?.() || new Date(0);
      return timeA - timeB;
    });

    blessings.forEach(blessing => {
      const card = document.createElement('div');
      card.className = 'blessing-input';

      const nameEl = document.createElement('p');
      nameEl.className = 'blessing-name';
      nameEl.textContent = blessing.name;

      const msgEl = document.createElement('p');
      msgEl.className = 'text-sm text-black mt-2';
      msgEl.textContent = blessing.message;

      const timeEl = document.createElement('p');
      timeEl.className = 'time-stamp';
      timeEl.textContent = blessing.timestamp?.toDate?.().toLocaleString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }) || 'Waktu tidak tersedia';

      card.append(nameEl, msgEl, timeEl);
      blessingsListDiv.appendChild(card);
    });

    // ⬇️ Scroll ke bawah agar ucapan terbaru terlihat
blessingsListDiv.scrollTop = blessingsListDiv.scrollHeight;



  }, err => {
    console.error("Error listening to blessings:", err);
    alertMessage("Gagal memuat ucapan.");
  });
}

// Submit handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      sendBlessing();
    });
  }
});

// Fungsi alert (pastikan ini ada)
function alertMessage(msg) {
  alert(msg);
}



