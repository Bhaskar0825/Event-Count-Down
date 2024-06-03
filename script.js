// script.js

document.getElementById('addCountdown').addEventListener('click', function() {
    const dateInput = document.getElementById('dateInput').value;
    const eventNameInput = document.getElementById('eventNameInput').value;

    if (dateInput && eventNameInput) {
        const targetDate = new Date(dateInput);
        addCountdown(targetDate, eventNameInput);
        saveCountdown({ date: targetDate, name: eventNameInput });
    } else {
        alert("Please enter both an event name and a date.");
    }
});

function addCountdown(targetDate, eventName) {
    const countdownsDiv = document.getElementById('countdowns');
    const card = document.createElement('div');
    card.className = 'countdown-card';
    card.setAttribute('data-date', targetDate); // Set data-date attribute

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerText = 'X';
    removeBtn.addEventListener('click', function() {
        countdownsDiv.removeChild(card);
        removeCountdown({ date: targetDate, name: eventName });
    });
    card.appendChild(removeBtn);

    const title = document.createElement('h2');
    title.innerText = eventName;
    card.appendChild(title);

    const daysElement = document.createElement('p');
    const hoursElement = document.createElement('p');
    const minutesElement = document.createElement('p');
    const secondsElement = document.createElement('p');

    card.appendChild(daysElement);
    card.appendChild(hoursElement);
    card.appendChild(minutesElement);
    card.appendChild(secondsElement);

    countdownsDiv.appendChild(card);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            daysElement.innerText = 'Completed';
            hoursElement.innerText = '';
            minutesElement.innerText = '';
            secondsElement.innerText = '';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysElement.innerText = `${days}d`;
        hoursElement.innerText = `${hours}h`;
        minutesElement.innerText = `${minutes}m`;
        secondsElement.innerText = `${seconds}s`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function saveCountdown(countdown) {
    let countdowns = JSON.parse(localStorage.getItem('countdowns')) || [];
    countdowns.push(countdown);
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
}

function removeCountdown(countdownToRemove) {
    let countdowns = JSON.parse(localStorage.getItem('countdowns')) || [];
    countdowns = countdowns.filter(c => !(new Date(c.date).getTime() === countdownToRemove.date.getTime() && c.name === countdownToRemove.name));
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
    // Update UI
    const countdownCards = document.querySelectorAll('.countdown-card');
    countdownCards.forEach(card => {
        const cardName = card.querySelector('h2').innerText;
        const cardDate = new Date(card.getAttribute('data-date'));
        if (cardName === countdownToRemove.name && cardDate.getTime() === countdownToRemove.date.getTime()) {
            card.parentNode.removeChild(card);
        }
    });
}


function loadCountdowns() {
    let countdowns = JSON.parse(localStorage.getItem('countdowns')) || [];
    countdowns.forEach(c => {
        addCountdown(new Date(c.date), c.name);
    });
}

window.addEventListener('load', loadCountdowns);
  