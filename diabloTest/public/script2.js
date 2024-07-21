document.addEventListener('DOMContentLoaded', function() {
    const checkboxesContainer1 = document.getElementById('checkboxColumn1');
    const checkboxesContainer2 = document.getElementById('checkboxColumn2');
    const checkboxesContainer3 = document.getElementById('checkboxColumn3');
    const checkboxesContainer4 = document.getElementById('checkboxColumn4');
    const statusContainer = document.getElementById('statusContainer');
    const checkFrequency = 5;

    let groupContainers = {};
    let previousStatus = {};

    window.onload = () => {
        createGroupContainers();
        fetchAndDisplayStatus();
        startTimer();
        createButtons();
        hideAllGroups();
    };

    function createGroupContainers() {
        groupContainers = {
            normal: createGroupContainer('normal'),
            hardcore: createGroupContainer('hardcore'),
            ladder: createGroupContainer('ladder'),
            'ladder-hardcore': createGroupContainer('ladder-hardcore')
        };
    }

    async function fetchAndDisplayStatus() {
        try {
            const response = await fetch('/api/status');
            if (!response.ok) {
                throw new Error('Failed to fetch status data');
            }
            const data = await response.json();
            displayStatus(data);
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    }

    function displayStatus(data) {
        const { allLadders } = data;

        if (!allLadders) {
            console.error('Invalid data format:', data);
            return;
        }

        for (const key in allLadders) {
            if (allLadders.hasOwnProperty(key)) {
                const commonName = allLadders[key].commonName;
                const statusData = allLadders[key].statusData;

                let groupKey;
                if (commonName.includes('Ladder HC')) {
                    groupKey = 'ladder-hardcore';
                } else if (commonName.includes('HC')) {
                    groupKey = 'hardcore';
                } else if (commonName.includes('Ladder')) {
                    groupKey = 'ladder';
                } else {
                    groupKey = 'normal';
                }

                updateStatusItem(groupContainers[groupKey].container, key, { commonName, statusData });
            }
        }

        updateRecentlyChanged(data);
    }

    function updateRecentlyChanged(data) {
        const { allLadders, nameMapping } = data;

        let mostRecentChange = '';
        for (const key in allLadders) {
            if (allLadders.hasOwnProperty(key)) {
                const currentStatus = allLadders[key].status;
                if (previousStatus[key] !== currentStatus) {
                    previousStatus[key] = currentStatus;
                    mostRecentChange = `${nameMapping[key]}: ${currentStatus}`;
                    playSound(); // Play sound on status change
                }
            }
        }

        if (!statusContainer.querySelector('#recentlyChanged')) {
            const recentChangeElement = document.createElement('div');
            recentChangeElement.id = 'recentlyChanged';
            statusContainer.appendChild(recentChangeElement);
        }
        statusContainer.querySelector('#recentlyChanged').textContent = `Recently Changed: ${mostRecentChange}`;
    }

    function createGroupContainer(groupKey) {
        const container = document.createElement('div');
        container.classList.add('group-container');
        console.log(`Creating container for ${groupKey}`);
        container.classList.add(groupKey);
        statusContainer.appendChild(container);
        return { name: groupKey, container };
    }

    function updateStatusItem(container, key, { commonName, statusData }) {
        let itemContainer = container.querySelector(`#${key}Item`);
        if (!itemContainer) {
            itemContainer = document.createElement('div');
            itemContainer.classList.add('status-item');
            itemContainer.id = key + 'Item';
            container.appendChild(itemContainer);
        }

        const statusText = document.createElement('span');
        statusText.textContent = `${commonName}: status=${statusData.status}`;
        itemContainer.innerHTML = '';
        itemContainer.appendChild(statusText);
    }

    function createButtons() {
        addToggleButton(checkboxesContainer1, 'normal');
        addToggleButton(checkboxesContainer2, 'hardcore');
        addToggleButton(checkboxesContainer3, 'ladder');
        addToggleButton(checkboxesContainer4, 'ladder-hardcore');
    }

    function addToggleButton(parentContainer, groupKey) {
        const button = document.createElement('button');
        button.textContent = groupKey.replace('-', ' ').toUpperCase();
        button.addEventListener('click', function() {
            toggleGroupVisibility(groupKey);
        });
        parentContainer.appendChild(button);
    }

    function toggleGroupVisibility(groupKey) {
        const container = groupContainers[groupKey]?.container;
        console.log(`Toggling visibility for ${groupKey}`);
        if (container) {
            container.classList.toggle('hidden');
        }
    }

    function hideAllGroups() {
        for (const key in groupContainers) {
            if (groupContainers.hasOwnProperty(key)) {
                console.log(`Hiding group: ${key}`);
                groupContainers[key].container.classList.add('hidden');
            }
        }
    }

    function startTimer() {
        let seconds = 0;
        updateDateTime();
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds % checkFrequency === 0) {
                fetchAndDisplayStatus();
            }
            updateDateTime();
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function updateDateTime() {
        const dateTimeElement = document.getElementById('dateTime');
        if (dateTimeElement) {
            const now = new Date();
            const formattedDateTime = now.toLocaleString();
            dateTimeElement.textContent = `Current Date Time: ${formattedDateTime}`;
        }
    }

    function playSound() {
        const audio = new Audio('sounds/UIBeep.wav');
        audio.play();
    }
});
