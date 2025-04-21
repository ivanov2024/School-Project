document.addEventListener('DOMContentLoaded', async () => {
    const SERVER_BASE_URL = 'http://localhost:3000';

    // Popup елементи
    const uploadPopup = document.getElementById('uploadPopup');
    const feedbackPopup = document.getElementById('feedbackPopup');
    const uploadForm = document.getElementById('uploadForm');
    const feedbackForm = document.getElementById('feedbackForm');
    const uploadMsg = document.getElementById('uploadMsg');
    const feedbackMsg = document.getElementById('feedbackMsg');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');

    // Отваряне на попъпите
    document.querySelectorAll('.openUploadPopup').forEach(btn => {
        btn.addEventListener('click', () => {
            const galleryId = btn.dataset.galleryId;
            if (galleryId && uploadForm) {
                uploadForm.dataset.galleryId = galleryId;
            }
            showPopup(uploadPopup);
        });
    });

    document.querySelectorAll('.openFeedbackPopup').forEach(btn => {
        btn.addEventListener('click', () => showPopup(feedbackPopup));
    });

    function showPopup(popup) {
        // Затваряме всички други попъпи
        document.querySelectorAll('.popup').forEach(p => {
            if (p !== popup && p.classList.contains('active')) {
                hidePopup(p);
            }
        });
        popup.style.display = 'block';
        popup.classList.remove('fade-out');
        popup.classList.add('fade-in', 'active');
    }

    function hidePopup(popup) {
        popup.classList.remove('fade-in');
        popup.classList.add('fade-out');
        setTimeout(() => {
            popup.classList.remove('fade-out', 'active');
            popup.style.display = 'none';
        }, 300);
    }

    document.querySelectorAll('.close-popup').forEach(btn => {
        btn.addEventListener('click', function () {
            const popup = this.closest('.popup');
            if (popup) hidePopup(popup);
        });
    });

    // Логика за галериите във всеки "week-card"
    function initializeGalleries() {
        document.querySelectorAll('.week-card').forEach(card => {
            const gallery = card.querySelector('.gallery');
            const toggleBtn = card.querySelector('.toggleGalleryBtn');
            if (!gallery || !toggleBtn) return;

            const cardsPerRow = 3;
            let currentVisible = cardsPerRow;
            let isExpanded = false;

            const updateGalleryView = () => {
                const imageCards = gallery.querySelectorAll('.image-card');
                imageCards.forEach((card, index) => {
                    if (index < currentVisible) {
                        card.classList.add('visible');
                        card.classList.remove('hidden');
                        card.style.display = 'block'; // показваме картата преди анимацията
                        setTimeout(() => {
                            card.classList.add('visible'); // активиране на анимацията
                        }, 10);
                    } else {
                        card.classList.remove('visible');
                        setTimeout(() => {
                            card.classList.add('hidden'); // скриване след анимацията
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            
                toggleBtn.innerHTML = (isExpanded || currentVisible >= imageCards.length)
                    ? 'Покажи по-малко &#8593;'
                    : 'Покажи повече &#8595;';
            };            
            
            // Първоначално състояние
            updateGalleryView();

            toggleBtn.onclick = () => {
                const total = gallery.querySelectorAll('.image-card').length;
                if (isExpanded) {
                    currentVisible = cardsPerRow;
                    isExpanded = false;
                } else {
                    currentVisible += cardsPerRow;
                    if (currentVisible >= total) {
                        currentVisible = total;
                        isExpanded = true;
                    }
                }
                updateGalleryView();
            };
        });
    }

    // Зареждане на снимки от сървъра
    async function loadImages() {
        try {
            const response = await fetch(`${SERVER_BASE_URL}/get-images`);
            const images = await response.json();
            images.forEach(img => {
                const targetGallery = document.querySelector(`.gallery[data-gallery-id="${img.galleryId}"]`);
                if (targetGallery) {
                    const imageUrl = `${SERVER_BASE_URL}/uploads/${img.filename}`;
                    const card = createImageCard(imageUrl, img.caption, img.date);
                    targetGallery.appendChild(card);
                }
            });
        } catch (err) {
            console.error('Грешка при зареждане на снимки:', err);
        }
    }

    await loadImages();
    initializeGalleries();

    // Качване на снимка
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(uploadForm);
            const galleryId = uploadForm.dataset.galleryId;
            formData.append('galleryId', galleryId);
            console.log('Качваме снимка за галерия:', galleryId);
            try {
                const response = await fetch(`${SERVER_BASE_URL}/upload`, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    const imageUrl = `${SERVER_BASE_URL}/uploads/${result.filename}`;
                    const card = createImageCard(imageUrl, result.caption, result.date);
                    const targetGallery = document.querySelector(`.gallery[data-gallery-id="${galleryId}"]`);
                    if (targetGallery) targetGallery.appendChild(card);

                    uploadMsg.textContent = '✅ Успешно изпратена снимка!';
                    uploadForm.reset();
                    imagePreview.innerHTML = '<span class="file-icon">📁</span>';
                } else {
                    uploadMsg.textContent = '⚠️ Грешка при качване.';
                }
            } catch (err) {
                console.error(err);
                uploadMsg.textContent = '⚠️ Грешка при връзка със сървъра.';
            }
        });
    }

    // Изпращане на обратна връзка
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const feedback = feedbackForm.querySelector('textarea').value;
            try {
                const response = await fetch(`${SERVER_BASE_URL}/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ feedback })
                });
                const result = await response.json();
                if (result.success) {
                    feedbackMsg.textContent = '✅ Благодарим за обратната връзка!';
                    feedbackForm.reset();
                    setTimeout(() => {
                        hidePopup(feedbackPopup);
                        feedbackMsg.textContent = '';
                    }, 5000);
                } else {
                    feedbackMsg.textContent = '⚠️ Възникна грешка при изпращането.';
                }
            } catch (err) {
                console.error(err);
                feedbackMsg.textContent = '⚠️ Възникна грешка при свързване със сървъра.';
            }
        });
    }

    // Преглед на избрано изображение
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.innerHTML = '<span class="file-icon">📁</span>';
            }
        });
        imagePreview.addEventListener('click', () => imageInput.click());
    }

    // Функция за създаване на карта със снимка
    function createImageCard(url, caption, date) {
        const card = document.createElement('div');
        card.className = 'image-card';
        const img = document.createElement('img');
        img.src = url;
        img.alt = caption || 'Качена снимка';
        const pCaption = document.createElement('p');
        pCaption.className = 'caption';
        pCaption.textContent = caption || 'Без описание.';
        const pDate = document.createElement('span');
        pDate.className = 'date';
        if (date) {
            const formattedDate = formatDate(date);
            pDate.textContent = `📅 ${formattedDate}`;
        }
        card.appendChild(img);
        card.appendChild(pCaption);
        if (date) card.appendChild(pDate);
        return card;
    }

    // Форматиране на дата във вид dd.mm.yyyy
    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }
});
