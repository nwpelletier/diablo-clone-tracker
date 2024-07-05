const apiUrl = process.env.API_URL || 'https://diablo-clone-tracker.onrender.com/api/status';
let previousStatus = {};
let timerInterval;
let checkFrequency = 10;
let mostRecentChange = '';

let sound = new Audio('sounds/UiBeep.wav');
let isSoundEnabled = false;


/*
    Set checkFrequency to set how often you want to fetch status
*/

async function fetchStatus() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch status data');
        }
        const data = await response.json();
        
        const expectedProperties = [
            'krNonLadder',
            'krNonLadderHardcore',
            'krLadder',
            'krLadderHardcore',
            'usNonLadder',
            'usNonLadderHardcore',
            'usLadder',
            'usLadderHardcore',
            'euNonLadder',
            'euNonLadderHardcore',
            'euLadder',
            'euLadderHardcore'
        ];
        const missingProperties = expectedProperties.filter(prop => !data.hasOwnProperty(prop));

        if (missingProperties.length > 0) {
            throw new Error(`Missing properties in API response: ${missingProperties.join(', ')}`);
        }
        
        const updatedKeys = Object.keys(data).filter(key => previousStatus[key] !== data[key].status);
        
        if (updatedKeys.length > 0) {
            playSound();
            updatePreviousStatus(data);
            updateMostRecentChange(data, updatedKeys);
        }

        displayStatus(data);
        updateDateTime();

    } catch (error) {
        console.error('Error fetching status:', error);
    }
}


function updatePreviousStatus(data) {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            previousStatus[key] = data[key].status;
        }
    }
}

function updateMostRecentChange(statusData, updatedKeys) {
    const mostRecentKey = updatedKeys[updatedKeys.length - 1];
    mostRecentChange = `${mostRecentKey}: ${statusData[mostRecentKey].status}`;
}


function enableSound() {
    isSoundEnabled = true;
    sound.load();
    document.getElementById('enableSound').style.display = 'none';  // Hide the button after enabling sound
}

function playSound() {
    if (isSoundEnabled) {
        sound.currentTime = 0;  // Rewind to start
        sound.play().catch(error => {
            console.warn('Audio playback was prevented due to autoplay policy.', error);
        });
    } else {
        console.warn('Sound is not enabled by user.');
    }
}

function displayStatus(statusData) {
    const statusContainer = document.getElementById('statusContainer');
    if (!statusContainer) {
        console.error('Status Container not found.');
        return;
    }

    let statusText = 'Fetched Data:<br>';
    for (const key in statusData) {
        if (statusData.hasOwnProperty(key)) {
            statusText += `<span>${key}: ${statusData[key].status}</span><br>`;
        }
    }

    statusContainer.innerHTML = statusText;

    const recentChangeElement = document.createElement('div');
    recentChangeElement.innerHTML = `<strong>Recently Changed:</strong> ${mostRecentChange}`;
    statusContainer.appendChild(recentChangeElement);
}

function updateDateTime() {
    const dateTimeElement = document.getElementById('dateTime');
    if (dateTimeElement) {
        const now = new Date();
        const formattedDateTime = now.toLocaleString();
        dateTimeElement.textContent = formattedDateTime;
    }
}

function startTimer() {
    let seconds = 0;
    updateDateTime();
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds % checkFrequency === 0) {
            fetchStatus();
        }
        updateDateTime();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

window.onload = () => {
    fetchStatus();
    startTimer();
};
