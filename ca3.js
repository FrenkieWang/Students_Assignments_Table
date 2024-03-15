document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    let gradeFormat = 'Average[%]'; // Default to Percent Grade

    // PART 1 - Create Table Header
    const headers = ["Student Name", "Student ID", "Assignment 1", "Assignment 2", "Assignment 3", "Assignment 4", "Assignment 5", "Average[%]"];
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
                // Click Again to disselect the Column
                if (th.classList.contains('selected-column')) {
                    clearSelection(); 
                } else { 
                    // Remove previous selection
                    clearSelection(); 
                    
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
                }
            });
        }
    });

    // PART 2 - Create Table Body
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
            // Click Again to disselect the Row
            if (row.classList.contains('selected-row')) {
                clearSelection(); 
            } else {
                // Remove previous selection
                clearSelection(); 
                // Selected Student on that Row
                row.classList.add('selected-row'); 
            }
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

    // PART 3 - Function: Validate Assignment cells and set their CSS.
    function validateAndStyleCell(cell) {
        // The parent of a Cell is its Row
        const row = cell.parentElement;

        // Check whether Cell value is Integer 0 - 100
        const validateCell = () => {
            const value = cell.textContent.trim();
            const isValidNumber = !isNaN(value) && parseInt(value) >= 0 && parseInt(value) <= 100;
            
            if (isValidNumber) {
                cell.style.backgroundColor = '';
                cell.className = 'text-right';
            } else {
                cell.textContent = '-';
                cell.style.backgroundColor = 'yellow';
                cell.className = 'text-center';
            }

            // Update the average whenever a cell is validated
            updateAverageForRow(row); 
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

    // PART 4 - Function to update the average for a row
    function updateAverageForRow(row) {
        let sum = 0;
        let count = 0;
        const cells = row.querySelectorAll('td');
        // Get the Sum and Count of valid homework scores
        cells.forEach((cell, index) => {
            // Excluding cells of Student Name, Student ID, and Average 
            if (index > 1 && index < cells.length - 1) {
                const value = cell.textContent.trim();
                if (value !== '-' && !isNaN(value)) {
                    sum += parseInt(value);
                    count++;
                }
            }
        });

        const avgCell = cells[cells.length - 1]; 
        if (count > 0) {
            const avg = Math.round(sum / count);

            // Store the original percent grade
            avgCell.setAttribute('data-percent-grade', avg); 
            
            // Convert Grade Format
            let formattedAvg = avg; // Default 
            if (gradeFormat === 'Average[Letter]') {
                formattedAvg = changeGradeFormat(avg); // Letter Grade
            } else if (gradeFormat === 'Average[4.0]') {
                formattedAvg = getFormattedGrade(avg); // 4.0 Scale
            }
            avgCell.textContent = formattedAvg;

            avgCell.className = 'text-right';
            // Check whether Average Score is "Failed"
            avg < 60 ? avgCell.classList.add('average-failed') : avgCell.classList.remove('average-failed');
        } else {
            // No Assignment is valid.
            avgCell.textContent = '-';
            avgCell.removeAttribute('data-percent-grade');
            avgCell.className = 'text-right';
            avgCell.classList.remove('average-failed');
        }
    }

    // PART 5 - Function to format grade based on current format setting
    function changeGradeFormat(score) {
        if (gradeFormat === 'Average[Letter]') {
            if (score >= 93) return 'A';
            if (score >= 90) return 'A-';
            if (score >= 87) return 'B+';
            if (score >= 83) return 'B';
            if (score >= 80) return 'B-';
            if (score >= 77) return 'C+';
            if (score >= 73) return 'C';
            if (score >= 70) return 'C-';
            if (score >= 67) return 'D+';
            if (score >= 63) return 'D';
            if (score >= 60) return 'D-';
            return 'F';
        } else if (gradeFormat === 'Average[4.0]') {
            if (score >= 93) return '4.0';
            if (score >= 90) return '3.7';
            if (score >= 87) return '3.3';
            if (score >= 83) return '3.0';
            if (score >= 80) return '2.7';
            if (score >= 77) return '2.3';
            if (score >= 73) return '2.0';
            if (score >= 70) return '1.7';
            if (score >= 67) return '1.3';
            if (score >= 63) return '1.0';
            if (score >= 60) return '0.7';
            return '0.0';
        }
        // Default return Percent Grade
        return score.toString();
    }

    // PART 6 - Event listener for clicking on average header to switch grade formats
    const averageHeader = headerRow.querySelector('th:last-child'); // Assuming the last header is for averages
    averageHeader.style.cursor = 'pointer'; 
    averageHeader.addEventListener('click', () => switchGradeFormat(gradeFormat));
    
    function switchGradeFormat(currentFormat) {
        // Switch grade format based on currentFormat
        let newFormat;
        let newText;
        // Switch grade format
        switch (currentFormat) {
            case 'Average[%]':
                newFormat = 'Average[Letter]';
                newText = 'Average[Letter]';
                break;
            case 'Average[Letter]':
                newFormat = 'Average[4.0]';
                newText = 'Average[4.0]';
                break;
            case 'Average[4.0]':
                newFormat = 'Average[%]';
                newText = 'Average[%]'; 
                break;
        }

        // Update global variable
        gradeFormat = newFormat;
        averageHeader.textContent = newText;

        // Update all rows' average cell display
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const avgCell = row.cells[row.cells.length - 1];
            const percentGrade = avgCell.getAttribute('data-percent-grade');
            if (percentGrade) {
                avgCell.textContent = gradeFormat === 'Average[%]' ? percentGrade : changeGradeFormat(parseInt(percentGrade));
            }
        });
    }


    // PART 7 - function:  clear all selected Rows/Columns
    function clearSelection() {
        document.querySelectorAll('.selected-row, .selected-column, .selected-column-top, .selected-column-bottom')
        .forEach(el => {
            el.classList.remove('selected-row', 'selected-column', 'selected-column-top', 'selected-column-bottom');
        });
    }
});