document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reminder-form");
    const messageInput = document.getElementById("reminder-message");
    const dateInput = document.getElementById("reminder-date");
    const hourSelect = document.getElementById("reminder-hour");
    const minuteSelect = document.getElementById("reminder-minute");
    const reminderList = document.getElementById("reminder-list");
    const sortIcon = document.getElementById("sort-icon");
    const sortMenu = document.getElementById("sort-menu");

    let editingIndex = null;
    let notificationTimeouts = [];
    let currentSortBy = "date";
    let currentSortOrder = "asc";

    populateTimeOptions();
    loadReminders();

    if ("Notification" in window && Notification.permission !== "granted" && window.isSecureContext) {
        Notification.requestPermission();
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const message = messageInput.value.trim();
        const date = dateInput.value;
        const hour = parseInt(hourSelect.value);
        const minute = parseInt(minuteSelect.value);

        if (!message || !date) return;

        const reminder = {
            message,
            date,
            hour,
            minute
        };

        const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

        if (editingIndex !== null) {
            reminders[editingIndex] = reminder;
            editingIndex = null;
        } else {
            reminders.push(reminder);
        }

        localStorage.setItem("reminders", JSON.stringify(reminders));
        renderReminders();
        form.reset();
    });

    sortIcon.addEventListener("click", () => {
        sortMenu.style.display = sortMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
        if (!sortMenu.contains(e.target) && e.target !== sortIcon) {
            sortMenu.style.display = "none";
        }
    });

    document.querySelectorAll('input[name="sort-by"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            currentSortBy = e.target.value;
            renderReminders();
        });
    });

    document.querySelectorAll('input[name="sort-order"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            currentSortOrder = e.target.value;
            renderReminders();
        });
    });

    function populateTimeOptions() {
        for (let h = 0; h < 24; h++) {
            const option = document.createElement("option");
            option.value = h;
            option.textContent = h.toString().padStart(2, '0');
            hourSelect.appendChild(option);
        }

        for (let m = 0; m < 60; m++) {
            const option = document.createElement("option");
            option.value = m;
            option.textContent = m.toString().padStart(2, '0');
            minuteSelect.appendChild(option);
        }
    }

    function loadReminders() {
        renderReminders();
    }

    function renderReminders() {
        reminderList.innerHTML = "";
        const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

        // Сортиране
        reminders.sort((a, b) => {
            let valA, valB;
            if (currentSortBy === "date") {
                valA = new Date(`${a.date}T00:00`);
                valB = new Date(`${b.date}T00:00`);
            } else {
                valA = a.hour * 60 + a.minute;
                valB = b.hour * 60 + b.minute;
            }
            return currentSortOrder === "asc" ? valA - valB : valB - valA;
        });

        // Изчистване на старите timeout-и
        notificationTimeouts.forEach(clearTimeout);
        notificationTimeouts = [];

        reminders.forEach((reminder, index) => {
            const card = document.createElement("div");
            card.className = "reminder-card";

            const timeText = `${reminder.hour.toString().padStart(2, '0')}:${reminder.minute.toString().padStart(2, '0')} ${reminder.date}`;
            const content = document.createElement("span");
            content.textContent = `${timeText} - ${reminder.message}`;

            const editBtn = document.createElement("button");
            editBtn.innerHTML = "✏️";
            editBtn.title = "Редактирай";
            editBtn.addEventListener("click", () => {
                messageInput.value = reminder.message;
                dateInput.value = reminder.date;
                hourSelect.value = reminder.hour;
                minuteSelect.value = reminder.minute;
                editingIndex = index;
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "🗑️";
            deleteBtn.title = "Изтрий";
            deleteBtn.addEventListener("click", () => {
                const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
                reminders.splice(index, 1);
                localStorage.setItem("reminders", JSON.stringify(reminders));
                renderReminders();
            });

            card.appendChild(content);
            card.appendChild(editBtn);
            card.appendChild(deleteBtn);
            reminderList.appendChild(card);

            scheduleNotification(reminder);
        });
    }

    function scheduleNotification(reminder) {
        if (!("Notification" in window) || Notification.permission !== "granted") return;

        const now = new Date();
        const reminderTime = new Date(`${reminder.date}T${reminder.hour.toString().padStart(2, '0')}:${reminder.minute.toString().padStart(2, '0')}`);

        if (reminderTime <= now) return;

        const timeout = reminderTime - now;

        const timeoutId = setTimeout(() => {
            new Notification("Напомняне", {
                body: reminder.message,
                icon: "../../../images/logo-example.jpg"
            });
        }, timeout);

        notificationTimeouts.push(timeoutId);
    }
});
