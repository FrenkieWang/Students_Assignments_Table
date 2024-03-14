document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('.App table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Create Title
    const headers = ["Student Name", "Student ID", "Assignment 1", "Assignment 2", "Assignment 3", "Assignment 4", "Assignment 5", "Average(%)"];
    const headerRow = thead.insertRow();
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.className = 'text-center';
        headerRow.appendChild(th);
    });

    // Generate and Create Student Data
    for (let i = 0; i < 10; i++) {
        const row = tbody.insertRow();        
        
        // Use Faker.js to random generate Student Name
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        // Random generate Student ID - 8 digits
        const id = `${Math.floor(10000000 + Math.random() * 90000000)}`; 

        // Fill Student Name and Student ID
        const nameCell = row.insertCell();
        nameCell.textContent = name;
        nameCell.className = 'text-left'; 

        const idCell = row.insertCell();
        idCell.textContent = id;
        idCell.className = 'text-left';

        // Default Value of Assignment X and Average -> "-"
        for (let j = 0; j < 5; j++) { 
            const cell = row.insertCell();
            cell.textContent = "-"; 
            cell.setAttribute('contenteditable', 'true'); 
            validateAndStyleCell(cell); // Validate and style each cell
        }
        const avgCell = row.insertCell(); 
        avgCell.textContent = "-"; 
        avgCell.className = 'text-right'; 
    }

    appDiv.appendChild(table);

   // Function: Validate Assignment cells and set their CSS.
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
});
