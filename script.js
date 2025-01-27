const jsonUrl = 'https://gist.githubusercontent.com/cantoneseslang/1de427bff5bec392d4e3f6ca5ff71d3d/raw/064388b4847629ab0d4518c10d6c3285b59e7db4/gistfile1.txt';

async function fetchData() {
    try {
        console.log('Fetching data from:', jsonUrl);
        const response = await fetch(jsonUrl);
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const lottoData = await response.json();
        console.log('Fetched data:', lottoData);
        return lottoData;
    } catch (error) {
        console.error('Fetching data failed:', error);
        return [];
    }
}

function calculateFrequencies(numbers) {
    const frequency = Array(49).fill(0); // 1-49 の数字の出現回数をカウント
    numbers.forEach(num => {
        frequency[num - 1]++;
    });
    const totalNumbers = numbers.length;
    const frequencies = frequency.map((count, index) => ({
        number: index + 1,
        count: count,
        probability: ((count / totalNumbers) * 100).toFixed(2) + '%'
    }));
    return frequencies;
}

function getTopNumbers(numbers, count) {
    const frequencies = calculateFrequencies(numbers);
    return frequencies.sort((a, b) => b.count - a.count).slice(0, count);
}

function generateRandomCombination(numbers, count) {
    const combination = [];
    while (combination.length < count) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        const num = numbers[randomIndex];
        if (!combination.includes(num.number)) {
            combination.push(num);
        }
    }
    return combination;
}

function displayFrequencies(frequencies, elementId) {
    const frequenciesList = document.getElementById(elementId);
    frequenciesList.innerHTML = '';

    const columns = Array.from({ length: 5 }, () => []);
    frequencies.forEach((freq, index) => {
        const columnIndex = Math.floor(index / 10);
        columns[columnIndex].push(freq);
    });

    columns.forEach(column => {
        const columnElement = document.createElement('ul');
        columnElement.className = 'frequency-column';
        column.forEach(freq => {
            const listItem = document.createElement('li');
            listItem.textContent = `${freq.number}: ${freq.probability}`;
            columnElement.appendChild(listItem);
        });
        frequenciesList.appendChild(columnElement);
    });
}

document.getElementById('predict-button').addEventListener('click', async function() {
    const selectedDate = document.getElementById('date-picker').value;
    if (!selectedDate) {
        alert('Please select a date.');
        return;
    }

    console.log('Selected date:', selectedDate);

    const dayOfWeek = new Date(selectedDate).getDay();
    const daysOfWeekMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeekText = daysOfWeekMap[dayOfWeek];

    console.log('Day of the week:', dayOfWeekText);

    const lottoData = await fetchData();
    console.log('Fetched lotto data:', lottoData);

    const filteredData = lottoData.filter(entry => {
        const dateText = entry.drawn_result_date;
        const entryDayOfWeek = dateText.match(/\(星期(.)\)/)[1];
        const daysOfWeekMapChinese = {
            '日': 'Sunday',
            '一': 'Monday',
            '二': 'Tuesday',
            '三': 'Wednesday',
            '四': 'Thursday',
            '五': 'Friday',
            '六': 'Saturday'
        };
        return daysOfWeekMapChinese[entryDayOfWeek] === dayOfWeekText;
    });

    console.log('Filtered data:', filteredData);

    const allNumbers = [];
    filteredData.forEach(entry => {
        allNumbers.push(
            parseInt(entry.drawn_num_text, 10),
            parseInt(entry['drawn_num_text (2)'], 10),
            parseInt(entry['drawn_num_text (3)'], 10),
            parseInt(entry['drawn_num_text (4)'], 10),
            parseInt(entry['drawn_num_text (5)'], 10),
            parseInt(entry['drawn_num_text (6)'], 10)
        );
    });

    console.log('All numbers:', allNumbers);

    const frequencies = calculateFrequencies(allNumbers);
    const topNumbersWithFrequency = getTopNumbers(allNumbers, 20);
    console.log('Top numbers with frequency:', topNumbersWithFrequency);

    displayFrequencies(frequencies, 'frequencies-list');

    const combinationsListWeekly = document.getElementById('weekly-combinations-list');
    combinationsListWeekly.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const combination = generateRandomCombination(topNumbersWithFrequency, 6);
        const listItem = document.createElement('li');
        const numbersText = combination.map(num => num.number).join(', ');
        const probabilitiesText = combination.map(num => num.probability).join(', ');
        listItem.innerHTML = `<strong>${numbersText}</strong><br><em>${probabilitiesText}</em>`;
        combinationsListWeekly.appendChild(listItem);
    }

    // 最近10週分のデータを使用
    const recentData = lottoData.slice(-10); // 最後の10件のデータ
    const recentNumbers = [];
    recentData.forEach(entry => {
        recentNumbers.push(
            parseInt(entry.drawn_num_text, 10),
            parseInt(entry['drawn_num_text (2)'], 10),
            parseInt(entry['drawn_num_text (3)'], 10),
            parseInt(entry['drawn_num_text (4)'], 10),
            parseInt(entry['drawn_num_text (5)'], 10),
            parseInt(entry['drawn_num_text (6)'], 10)
        );
    });

    const recentFrequencies = calculateFrequencies(recentNumbers);
    const topRecentNumbersWithFrequency = getTopNumbers(recentNumbers, 20);

    const combinationsListRecent = document.getElementById('recent-combinations-list');
    combinationsListRecent.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const combination = generateRandomCombination(topRecentNumbersWithFrequency, 6);
        const listItem = document.createElement('li');
        const numbersText = combination.map(num => num.number).join(', ');
        const probabilitiesText = combination.map(num => num.probability).join(', ');
        listItem.innerHTML = `<strong>${numbersText}</strong><br><em>${probabilitiesText}</em>`;
        combinationsListRecent.appendChild(listItem);
    }

    const combinationsListTotal = document.getElementById('total-combinations-list');
    combinationsListTotal.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const combination = generateRandomCombination(frequencies, 6);
        const listItem = document.createElement('li');
        const numbersText = combination.map(num => num.number).join(', ');
        const probabilitiesText = combination.map(num => num.probability).join(', ');
        listItem.innerHTML = `<strong>${numbersText}</strong><br><em>${probabilitiesText}</em>`;
        combinationsListTotal.appendChild(listItem);
    }
});
