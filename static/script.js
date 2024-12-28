document.getElementById('setup-operation').addEventListener('click', () => {
    const operation = document.getElementById('operation').value;
    const matrixSetup = document.getElementById('matrix-setup');
    const matrixBContainer = document.getElementById('matrix-b-container');
    const calculateSection = document.getElementById('calculate-section');

    matrixSetup.style.display = 'block';
    calculateSection.style.display = 'none';
    document.getElementById('result-output').innerText = '';

    if (['add', 'subtract', 'multiply'].includes(operation)) {
        matrixBContainer.style.display = 'block';
    } else {
        matrixBContainer.style.display = 'none';
    }
});

document.getElementById('generate-matrix-inputs').addEventListener('click', () => {
    const matrixARows = parseInt(document.getElementById('matrix-a-rows').value) || 0;
    const matrixACols = parseInt(document.getElementById('matrix-a-cols').value) || 0;
    const matrixBRows = parseInt(document.getElementById('matrix-b-rows').value) || 0;
    const matrixBCols = parseInt(document.getElementById('matrix-b-cols').value) || 0;
    const operation = document.getElementById('operation').value;

    generateMatrix('matrix-a-inputs', matrixARows, matrixACols);

    if (['add', 'subtract', 'multiply'].includes(operation)) {
        generateMatrix('matrix-b-inputs', matrixBRows, matrixBCols);
    }

    document.getElementById('calculate-section').style.display = 'block';
});

document.getElementById('calculate-matrix').addEventListener('click', async () => {
    const operation = document.getElementById('operation').value;
    const matrixA = getMatrixData('matrix-a-inputs');
    const matrixB = document.getElementById('matrix-b-container').style.display === 'block'
        ? getMatrixData('matrix-b-inputs')
        : null;

    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation, matrix_a: matrixA, matrix_b: matrixB })
        });

        const data = await response.json();

        if (data.result) {
            displayResultAsMatrix(data.result);
        } else {
            document.getElementById('result-output').innerText = `Error: ${data.error}`;
        }
    } catch (error) {
        document.getElementById('result-output').innerText = `Error: ${error.message}`;
    }
});

function displayResultAsMatrix(resultMatrix) {
    const resultContainer = document.getElementById('result-output');
    resultContainer.innerHTML = ''; // Clear previous result

    // Apply the "matrix-result" class for proper styling
    resultContainer.className = 'matrix-result';

    // Set grid template columns based on matrix dimensions
    const cols = resultMatrix[0].length;
    resultContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    // Populate the grid with result values
    resultMatrix.forEach(row => {
        row.forEach(value => {
            const cell = document.createElement('div');
            cell.textContent = value;
            cell.className = 'matrix-cell'; // Optional: add class for cell-specific styles
            resultContainer.appendChild(cell);
        });
    });
}   


function generateMatrix(containerId, rows, cols) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.classList.add('matrix-row');
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.classList.add('matrix-input');
            input.name = `${containerId}[${i}][${j}]`;
            row.appendChild(input);
        }
        container.appendChild(row);
    }
}

function getMatrixData(containerId) {
    const container = document.getElementById(containerId);
    return Array.from(container.children).map(row =>
        Array.from(row.children).map(input => parseFloat(input.value) || 0)
    );
}
