document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reminder-form");
    const messageInput = document.getElementById("reminder-message");
    const dateInput = document.getElementById("reminder-date");
    const hourSelect = document.getElementById("reminder-hour");
    const minuteSelect = document.getElementById("reminder-minute");
    const reminderList = document.getElementById("reminder-list");

    const sortButton = document.getElementById("sort-button");
    const sortMenu = document.getElementById("sort-menu");

    let editingIndex = null;
    let sortCriteria = "datetime";
    let sortOrder = "asc";

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

        const reminder = { message, date, hour, minute };

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

        reminders.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.hour.toString().padStart(2, '0')}:${a.minute.toString().padStart(2, '0')}`);
            const dateB = new Date(`${b.date}T${b.hour.toString().padStart(2, '0')}:${b.minute.toString().padStart(2, '0')}`);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

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
                const updatedReminders = JSON.parse(localStorage.getItem("reminders")) || [];
                updatedReminders.splice(index, 1);
                localStorage.setItem("reminders", JSON.stringify(updatedReminders));
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

        setTimeout(() => {
            new Notification("Напомняне", {
                body: reminder.message,
                icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
            });
        }, timeout);
    }

    // Сортиране – меню и логика
    sortButton.addEventListener("click", () => {
        sortMenu.classList.toggle("visible");
    });

    document.querySelectorAll("#sort-menu input").forEach(input => {
        input.addEventListener("change", () => {
            if (input.name === "sortOrder") sortOrder = input.value;
            renderReminders();
        });
    });

    document.addEventListener("click", (e) => {
        if (!sortButton.contains(e.target) && !sortMenu.contains(e.target)) {
            sortMenu.classList.remove("visible");
        }
    });
});
