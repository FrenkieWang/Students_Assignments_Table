document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('.App table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // PART 1 - Create Table Headers 
    const headers = ["Student Name", "Student ID", "Assignment 1", "Assignment 2", "Assignment 3", "Assignment 4", "Assignment 5", "Average(%)"];
    const headerRow = thead.insertRow();

    headers.forEach((headerText, columnIndex) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.className = 'text-center';
        headerRow.appendChild(th);

        // [Click Event Listener] -> Assignment Title
        if (headerText.startsWith('Assignment')) {
            th.style.cursor = 'pointer'; 
            th.addEventListener('click', () => {
                clearSelection(); // Clear previous selection

                // Selected Assignment on Table Head
                th.classList.add('selected-column', 'selected-column-top');
                // Selected Assignment on Table Body
                const rows = tbody.querySelectorAll('tr');
                rows.forEach((row, rowIndex) => {
                    const cell = row.cells[columnIndex];
                    if (cell) {
                        cell.classList.add('selected-column');
                        if (rowIndex === rows.length - 1) {
                            cell.classList.add('selected-column-bottom');
                        }
                    }
                });
            });
        }

    });

    // PART 2 - Create Table Bodies 
    for (let i = 0; i < 10; i++) {
        const row = tbody.insertRow();        
        
        // Use Faker.js to random generate Student Name
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        // Random generate Student ID - 8 digits
        const id = `${Math.floor(10000000 + Math.random() * 90000000)}`; 

        // Fill Student Name 
        const nameCell = row.insertCell();
        nameCell.textContent = name;
        nameCell.className = 'text-left'; 

        // [Click Event Listener] -> Student Name
        nameCell.style.cursor = 'pointer'; 
        nameCell.addEventListener('click', () => {
            clearSelection(); // Clear previous selection
            // Selected Student on that Row
            row.classList.add('selected-row'); 
        });

        // Fill Student ID
        const idCell = row.insertCell();
        idCell.textContent = id;
        idCell.className = 'text-left';

        // Fill '-' as Default Value of Assignment X 
        for (let j = 0; j < 5; j++) { 
            const cell = row.insertCell();
            cell.textContent = "-"; 
            cell.setAttribute('contenteditable', 'true'); 
            validateAndStyleCell(cell); // Validate and style each cell
        }

        // Fill '-' as Default Value of Average
        const avgCell = row.insertCell(); 
        avgCell.textContent = "-"; 
        avgCell.className = 'text-right'; 
    }

    // PART 3 - Insert created table in App
    appDiv.appendChild(table);

    // PART 4 - Function: Validate Assignment cells and set their CSS.
    function validateAndStyleCell(cell) {

        // Check whether Cell value is Integer 0 - 100
        const validateCell = () => {
            const value = cell.textContent.trim();
            const isValidNumber = !isNaN(value) && parseInt(value) >= 0 && parseInt(value) <= 100;
            
            if (!isValidNumber || value === '') {
                cell.textContent = '-';
                cell.style.backgroundColor = 'yellow';
                cell.className = 'text-center';
            } else {
                cell.style.backgroundColor = '';
                cell.className = 'text-right';
            }
        };

        // Finish input by 'keydown' and 'blur'
        cell.addEventListener('keydown', function() {
            // Check if the pressed key is 'Enter'
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault(); // Prevent the default action to avoid line breaks
                validateCell();
                cell.blur(); // Remove focus from cell
            }
        });
        cell.addEventListener('blur', validateCell);

        // If select cell with default value, remove '-' for ease of edit.
        cell.addEventListener('focus', function() {
            if (cell.textContent === '-') {
                cell.textContent = '';
            }
        });

        // Initial CSS for default value '-'
        if (cell.textContent === '-') {
            cell.style.backgroundColor = 'yellow';
            cell.className = 'text-center';
        }
    }

    // PART 4 - function:  clear all selected Rows/Columns
    function clearSelection() {
        document.querySelectorAll('.selected-row, .selected-column, .selected-column-top, .selected-column-bottom')
        .forEach(el => {
            el.classList.remove('selected-row', 'selected-column', 'selected-column-top', 'selected-column-bottom');
        });
    }
});
