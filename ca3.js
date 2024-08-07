document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    var averageGradeFormat = 'Average[%]'; // Default to Percent Grade
    const headers = ["Student Name", "Student ID", "Assignment 1", "Assignment 2", 
    "Assignment 3", "Assignment 4", "Assignment 5", averageGradeFormat];
    const initialStudents = []; // Save the Name and ID of the initial 10 Students

    //  Save recently deleted rows and columns
    var deletedRow = null;
    var deletedColumn = {index: null, cells: []}; 
    var lastDeletedType = null; // 'row' or 'column'


    // PART 1 - Initialize the Table
    function createInitialTable(){
        // Make Table Empty
        thead.innerHTML = '';
        tbody.innerHTML = '';

        // Initialize Table Header
        const newHeaderRow = thead.insertRow();
        headers.forEach((headerText) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.className = 'text-center';

            // [Click Event Listener] -> Assignment X
            if (headerText.startsWith('Assignment')) {
                th.style.cursor = 'pointer';
            }
            
            newHeaderRow.appendChild(th);
        });
        
        // Initialize Table Body
        for (let i = 0; i < 10; i++) {
            // Use Faker.js to generate Student Name and ID only if they don't exist
            if (initialStudents.length < 10) {
                const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
                const id = `${Math.floor(10000000 + Math.random() * 90000000)}`;
                initialStudents.push({ name, id });
            }      
            const student = initialStudents[i];

            const row = tbody.insertRow();   

            // Fill Student Name 
            const nameCell = row.insertCell();
            nameCell.textContent = student.name;
            nameCell.className = 'text-left'; 
            // [Click Event Listener] -> Student Name
            nameCell.style.cursor = 'pointer'; 
            nameCell.addEventListener('click', handleSelectRow);

            // Fill Student ID
            const idCell = row.insertCell();
            idCell.textContent = student.id;
            idCell.className = 'text-left';

            // Fill '-' as Default Value of Assignment X 
            for (let j = 0; j < 5; j++) { 
                const cell = row.insertCell();
                cell.textContent = "-"; 
                cell.setAttribute('contenteditable', 'true'); 
                validateAndStyleCell(cell); // Validate and style each cell
            }

            // Fill '/' as Default Value of Average
            const avgCell = row.insertCell(); 
            avgCell.textContent = "/"; 
            avgCell.className = 'text-right'; 
        }

        // [Click Event Listener] -> Average Header
        const averageHeader = newHeaderRow.querySelector('th:last-child'); 
        averageHeader.style.cursor = 'pointer';
        averageHeader.addEventListener('click', () => toggleAverageFormat(averageGradeFormat));
        bindColumnSelectListeners();
    }
    // Initialize the Table when Page loads
    createInitialTable();
 

    // PART 2 - Function: Validate Assignment cells and set their CSS.
    function validateAndStyleCell(cell) {
        const row = cell.parentElement;

        // Initial CSS for default value '-'
        if (cell.textContent === '-') {
            cell.style.backgroundColor = 'yellow';
            cell.classList.add('text-center');
            cell.classList.remove('text-right');
        }

        // Check whether Cell value is Integer 0 - 100
        const validateCell = () => {
            const value = cell.textContent.trim();
            // [Regex] - Whether Input is Integer from 0 to 100
            const isValidNumber = /^(100|[1-9]?[0-9])$/.test(value);
            
            if (isValidNumber) {
                cell.style.backgroundColor = '';
                cell.classList.add('text-right');
                cell.classList.remove('text-center');
            } else {
                cell.textContent = '-';
                cell.style.backgroundColor = 'yellow';
                cell.classList.add('text-center');
                cell.classList.remove('text-right');
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
    }


    // PART 3 - Function to Update the Average for a Row
    function updateAverageForRow(row) {
        let sum = 0;
        let count = 0;

        // Get the Sum and Count of valid homework scores
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
            // Excluding cells of Student Name, Student ID, and Average 
            if (index > 1 && index < cells.length - 1) {
                const value = cell.textContent.trim();
                if (value !== '/' && !isNaN(value)) {
                    sum += parseInt(value);
                    count++;
                }
            }
        });

        // Update Average Score in the last column
        const avgCell = cells[cells.length - 1];         
        if (count > 0) {
            const avg = Math.round(sum / count);

            // Store the original percent grade
            avgCell.setAttribute('data-percent-grade', avg); 
            avgCell.className = 'text-right';
            
            // Convert Grade Format
            let formattedAvg = avg; // Default 
            if (averageGradeFormat === 'Average[Letter]') {
                formattedAvg = changeGradeFormat(avg); // Letter Grade
            } else if (averageGradeFormat === 'Average[4.0]') {
                formattedAvg = changeGradeFormat(avg); // 4.0 Scale
            }
            avgCell.textContent = formattedAvg;

            // Check whether Average Score is "Failed"
            avg < 60 ? avgCell.classList.add('average-failed') : avgCell.classList.remove('average-failed');
        // No Assignment is valid.
        } else {
            avgCell.textContent = '/';
            avgCell.removeAttribute('data-percent-grade');
            avgCell.className = 'text-right';
            avgCell.classList.remove('average-failed');
        }
        updateUnsubmitCount();
    }


    // PART 4 - Function to format grade based on current format setting
    function changeGradeFormat(score) {
        if (averageGradeFormat === 'Average[Letter]') {
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
        } else if (averageGradeFormat === 'Average[4.0]') {
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


    // PART 5 - Toggle Average Format when clicking 'Average' header
    function toggleAverageFormat(currentFormat) {
        // Get the element of THead - Average
        const averageHeader = document.querySelector('table thead tr th:last-child');
        let newFormat;
        let newText;

        // Toggle Average format based on currentFormat
        // Percentage Grade -> Letter Grade -> 4.0 Scale -> Percentage Grade.....
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

        // Update global variable - gradeFromat
        averageGradeFormat = newFormat;
        averageHeader.textContent = newText;

        // Update all rows' average cell display
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const avgCell = row.cells[row.cells.length - 1];
            const percentGrade = avgCell.getAttribute('data-percent-grade');
            if (percentGrade) {
                avgCell.textContent = averageGradeFormat === 'Average[%]' ? percentGrade : changeGradeFormat(parseInt(percentGrade));
            }
        });
    }

        
    // PART 6 - Click Student Name -> Select A Row
    function handleSelectRow(event){
        const td = event.target;
        const row = td.parentNode; // 获取点击的单元格所在的行
        
        // Click Again to disselect the Row
        if (row.classList.contains('selected-row')) {
            clearSelection(); 
        } else {
            // Remove previous selection
            clearSelection(); 
            // Selected Student on that Row
            row.classList.add('selected-row'); 
        }
    }


    // PART 7 - Click Assignment Title -> Select A Column
    function handleSelectColumn(columnIndex) {
        // Clear any previous selection first
        clearSelection(); 

        // Select the header in the Table Head
        const currentHeader = thead.querySelectorAll('th')[columnIndex];
        currentHeader.classList.add('selected-column', 'selected-column-top');

        // Select corresponding cells in the Table Body
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, rowIndex) => {
            const cell = row.cells[columnIndex];
            if (cell) {
                cell.classList.add('selected-column');
                if (rowIndex === rows.length - 1) { // Last row's cell gets an additional class
                    cell.classList.add('selected-column-bottom');
                }
            }
        });                               
    }


    // PART 8 - Clear all selected Rows/Columns
    function clearSelection() {
        document.querySelectorAll('.selected-row, .selected-column, .selected-column-top, .selected-column-bottom')
        .forEach(el => {
            el.classList.remove('selected-row', 'selected-column', 'selected-column-top', 'selected-column-bottom');
        });
    }


    // PART 9 - Delete selected Row
    document.getElementById('deleteRowBtn').addEventListener('click', deleteSelectedRow);
    function deleteSelectedRow(){
        // Find all selected rows
        const selectedRows = tbody.querySelectorAll('.selected-row');
        if (selectedRows.length === 0) { // No Row Selected
            alert('Please select a Student to delete.');
            return; 
        }

        // Remember the Selected Row!
        const row = selectedRows[0];
        deletedRow = {element: row.cloneNode(true), index: Array.from(tbody.rows).indexOf(row)};

        // Delete the Row
        row.parentNode.removeChild(row);
        
        updateUnsubmitCount();
        document.getElementById('undeleteBtn').disabled = false;
        lastDeletedType = 'row';
    }
    

    // PART 10 -  Delete selected Column
    document.getElementById('deleteColumnBtn').addEventListener('click', deleteSelectedColumn);  
    function deleteSelectedColumn() {
        // Find the selected Column 
        const selectedTh = thead.querySelector('.selected-column');
        if (!selectedTh) { // No Column Selected
            alert('Please select a column to delete.');
            return;
        }

        const columnIndex = Array.from(thead.querySelectorAll('th')).indexOf(selectedTh);

        // Remember the Selected Column!
        deletedColumn.index = columnIndex;
        deletedColumn.header = selectedTh.textContent;
        deletedColumn.classes = selectedTh.className;         
        tbody.querySelectorAll('tr').forEach(row => {
            if (row.cells[columnIndex]) {
                deletedColumn.cells.push(row.cells[columnIndex].cloneNode(true));
            } else {
                deletedColumn.cells.push(document.createElement('td'));
            }
        });

        // Delete selected Column
        selectedTh.remove();
        tbody.querySelectorAll('tr').forEach(row => row.deleteCell(columnIndex));

        // Update Average Score
        tbody.querySelectorAll('tr').forEach(row => updateAverageForRow(row));

        updateUnsubmitCount();
        bindColumnSelectListeners();
        document.getElementById('undeleteBtn').disabled = false;
        lastDeletedType = 'column';
    }


    // PART 11 - Button : Add Column Assignment X+1
    document.getElementById('addAssignmentBtn').addEventListener('click', addAssignmentColumn);
    function addAssignmentColumn() {
        // Find 'Average' Table Head
        const headerCells = Array.from(thead.querySelectorAll('th'));
        const averageIndex = headerCells.findIndex(th => th.textContent.trim().startsWith('Average')); 

        // Find the bigggest Assignment Number - X 
        let lastAssignmentIndex = 0;
        headerCells.forEach(th => {
            if (th.textContent.trim().startsWith('Assignment')) {
                const match = th.textContent.trim().match(/Assignment (\d+)/);
                if (match) {
                    // match[1] -- (\d+) -- X
                    lastAssignmentIndex = Math.max(lastAssignmentIndex, parseInt(match[1]));
                }
            }
        });

        // Set Attribute for created Table Header - "Assignment X+1" 
        const newAssignmentIndex = lastAssignmentIndex + 1;
        const newAssignmentHeader = document.createElement('th');
        newAssignmentHeader.textContent = `Assignment ${newAssignmentIndex}`;
        newAssignmentHeader.className = 'text-center';
        newAssignmentHeader.style.cursor = 'pointer';

        // Add `Assignment x+1` to the left of `Average` Column
        thead.rows[0].insertBefore(newAssignmentHeader, thead.rows[0].cells[averageIndex]);

        // Set Attribute for every created Cell below Header "Assignment X+1"
        tbody.querySelectorAll('tr').forEach(row => {
            // Assignment X + 1 located at averageIndex
            const newCell = row.insertCell(averageIndex);
            newCell.textContent = "-";
            newCell.setAttribute('contenteditable', 'true');
            validateAndStyleCell(newCell);
        });

        bindColumnSelectListeners();
        updateUnsubmitCount();
    }


    // PART 12 - Right Click for Adding Rows
    document.querySelector('table tbody').addEventListener('contextmenu', handleRightClick);
    function handleRightClick(event) {
        // event.target must from 'TD' elements
        if (event.target && event.target.nodeName === 'TD') { // NodeName must all upperCase
            event.preventDefault(); // Block Default ContextMenu

            removeContextMenu(); // Remove existing first!

            // Set CSS for context Menu
            const contextMenu = document.createElement('div');
            contextMenu.id = 'customContextMenu';
            contextMenu.style.position = 'fixed';
            contextMenu.style.left = `${event.clientX}px`;
            contextMenu.style.top = `${event.clientY}px`;
            contextMenu.style.backgroundColor = 'white';
            contextMenu.style.border = '1px solid #ccc';
            contextMenu.style.padding = '5px';
            contextMenu.style.zIndex = '1000'; 

            // ASdd Menu Options
            const insertAbove = document.createElement('div');
            insertAbove.textContent = 'Insert a row above';
            insertAbove.style.cursor = 'pointer';
            // Insert new Row above current Row
            insertAbove.addEventListener('click', function() {
                const newRow = event.target.parentNode.parentNode.insertRow(event.target.parentNode.sectionRowIndex);
                createRowCells(newRow, event.target.parentNode.cells.length);
                document.body.removeChild(contextMenu); 
            });

            const insertBelow = document.createElement('div');
            insertBelow.textContent = 'Insert a row below';
            insertBelow.style.cursor = 'pointer';
            // Insert new Row below current Row
            insertBelow.addEventListener('click', function() {
                const newRow = event.target.parentNode.parentNode.insertRow(event.target.parentNode.sectionRowIndex + 1);
                createRowCells(newRow, event.target.parentNode.cells.length);
                document.body.removeChild(contextMenu); 
            });

            contextMenu.appendChild(insertAbove);
            contextMenu.appendChild(insertBelow);

            // Add contextMenu in the Webpage
            document.body.appendChild(contextMenu);   
        } 
    }


    // Part 13 - Function : Add data in the created Student Row
    function createRowCells(row, cellCount) {
        for (let i = 0; i < cellCount; i++) {
            const cell = row.insertCell(i);

            // Student Name
            if (i === 0) { 
                const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
                cell.textContent = name;
                cell.className = 'text-left';
                // Add EventListener to Select that Row
                cell.style.cursor = 'pointer'; 
                cell.addEventListener('click', handleSelectRow );
            // Student ID
            } else if (i === 1) { 
                const id = `${Math.floor(10000000 + Math.random() * 90000000)}`;
                cell.textContent = id;
                cell.className = 'text-left';
            // Assignment X
            }  else if (i < cellCount - 1) { 
                cell.textContent = "-";
                cell.setAttribute('contenteditable', 'true');
                cell.className = 'text-right';
                validateAndStyleCell(cell);
            // Average
            }  else { 
                cell.textContent = "/";
                cell.className = 'text-right';
            }
        }
    }


    // Part 14 - Remove Context Menu - By Clicking Anywhere
    document.addEventListener('click', removeContextMenu);
    function removeContextMenu(){
        const existingMenu = document.getElementById('customContextMenu');
        if (existingMenu) {
            document.body.removeChild(existingMenu);
        }
        updateUnsubmitCount();
    }


    // Part 15 - Button : Add Row at the buttom of Table
    document.getElementById('addStudentBtn').addEventListener('click', addStudentRow);
    function addStudentRow() {
        // Insert Row at the buttom of the Table
        const rowCount = document.querySelector('table tbody').rows.length;
        const newRow = tbody.insertRow(rowCount);

        const cellCount = document.querySelector('table thead tr').cells.length;
        createRowCells(newRow, cellCount);

        updateUnsubmitCount();
    }


    // Part 16 - Undelete/Retrieve - Bind Listeners to Assginment Column again.
    function bindColumnSelectListeners() {
        const headers = thead.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (header.textContent.trim().startsWith("Assignment")) {
                header.style.cursor = 'pointer';
                // Update the Click Event Listener on its Index
                header.onclick = () => handleSelectColumn(index);
            }
        });
    }


    // Part 17 - Undelete Row / Column
    document.getElementById('undeleteBtn').addEventListener('click', function() {
        // [Case 1] - Recover the Row
        if (lastDeletedType === 'row' && deletedRow) {
            const refRow = tbody.rows[deletedRow.index] || tbody.appendChild(document.createElement('tr'));
            tbody.insertBefore(deletedRow.element, refRow);

            // Add Listener to Student Name in Row
            const nameCell = deletedRow.element.cells[0];
            nameCell.style.cursor = 'pointer'; 
            nameCell.addEventListener('click', handleSelectRow);

            // Change CSS FOR Assginment Cell
            for (let i = 2; i < deletedRow.element.cells.length - 1; i++) {
                validateAndStyleCell(deletedRow.element.cells[i]);
            }

            deletedRow = null;
            lastDeletedType = null;  // Clear after undelete
        }

        // [Case 2] - Recover the Column
        if (lastDeletedType === 'column' && deletedColumn.index !== null) {
            // Recover THead of the Column
            const headerCell = document.createElement('th');
            headerCell.textContent = deletedColumn.header;
            headerCell.className = deletedColumn.classes; 
            headerCell.style.cursor = 'pointer';
            thead.rows[0].insertBefore(headerCell, thead.rows[0].cells[deletedColumn.index]);

            // Recover TBody of the Column
            Array.from(tbody.rows).forEach((row, i) => {
                const refCell = row.cells[deletedColumn.index] || row.appendChild(document.createElement('td'));
                row.insertBefore(deletedColumn.cells[i], refCell);
                validateAndStyleCell(deletedColumn.cells[i]); // CSS and JS of that cell
            });

            // Update the Average Score after Undelete!
            Array.from(tbody.rows).forEach(row => {
                updateAverageForRow(row);
            });

            deletedColumn = {index: null, cells: []}; //  Clear after undelete
            lastDeletedType = null; // Reset lastDeletedType
            bindColumnSelectListeners();
        }

        updateUnsubmitCount();

        // "Disable Undelete" Button after Clicked
        document.getElementById('undeleteBtn').disabled = true;
    });


    // PART 18 - Save Table State
    document.getElementById('saveBtn').addEventListener('click', function() {
        const tableData = {
            headers: [], 
            rows: [],
            averageGradeFormat: averageGradeFormat
        };

        // Save all data in Table Header
        const headerCells = thead.querySelectorAll('th');
        headerCells.forEach(header => {
            const headerData = {
                text: header.textContent,
                className: header.className
            };
            tableData.headers.push(headerData);
        });

        // Save all data in Table Body
        tbody.querySelectorAll('tr').forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach(cell => {
                const cellData = {
                    html: cell.innerHTML, 
                    class: cell.className 
                };
                rowData.push(cellData); 
            });
            tableData.rows.push(rowData);
        });

        // Save Table information into Windows localStorage
        localStorage.setItem('tableData', JSON.stringify(tableData));
        console.log(localStorage.getItem('tableData'));
    });


    // PART 19 - Retrieve Table State
    document.getElementById('retrieveBtn').addEventListener('click', function() {
        // Retrieve Table information from Windows localStorage
        const tableDataStr = localStorage.getItem('tableData');
        if (tableDataStr) {
            const tableData = JSON.parse(tableDataStr);

            // Clear all table information first
            thead.innerHTML = '';
            tbody.innerHTML = '';

            // Retrieve Table Head
            if (tableData.headers && tableData.headers.length > 0) {
                const headerRow = thead.insertRow();
                tableData.headers.forEach(headerData => {
                    const th = document.createElement('th');
                    th.textContent = headerData.text; 
                    th.className = headerData.className; 
                    headerRow.appendChild(th);
                });
            }

            // Retrieve Table Body
            tableData.rows.forEach(rowData => {
                const row = tbody.insertRow();
                rowData.forEach((cellData, index) => {
                    const cell = row.insertCell();
                    cell.innerHTML = cellData.html;
                    cell.className = cellData.class; 
                    // Retrieve Student Name
                    if (index === 0) { 
                        cell.addEventListener('click', handleSelectRow);
                        cell.style.cursor = 'pointer';
                    // Retrieve Assignment Information
                    } else {
                        // Excluding Student Name, Student ID and Average Score
                        if (!cellData.class.includes('text-left') && index < rowData.length - 1) { 
                            cell.setAttribute('contenteditable', 'true');
                            validateAndStyleCell(cell);
                        }
                    }
                });
                updateAverageForRow(row); // Update Average Score for every row
            });

            // Restore Average Format and its Listener
            averageGradeFormat = tableData.averageGradeFormat;
            const averageHeader = thead.querySelector('th:last-child'); 
            averageHeader.style.cursor = 'pointer'; 
            averageHeader.addEventListener('click', () => toggleAverageFormat(averageGradeFormat));
            averageHeader.textContent = averageGradeFormat;

            bindColumnSelectListeners();
            updateUnsubmitCount();
        }
    });

    // PART 20 - Update the Number of Unsubmitted Assignment
    function updateUnsubmitCount() {
        const cells = tbody.querySelectorAll('td'); 
        let unsubmittedCount = 0; 
    
        // Traverse all <td>, find whose value is "-"
        cells.forEach(cell => {
            if (cell.textContent.trim() === "-") {
                unsubmittedCount++; 
            }
        });
    
        // Update the Count for Unsubmitted Assignments
        const unsubmittedAssignmentsElement = document.getElementById('CANum');
        unsubmittedAssignmentsElement.textContent = unsubmittedCount;
    }
    updateUnsubmitCount();

    // PART 21 - Initialize the Table
    document.getElementById('initialBtn').addEventListener('click', createInitialTable);
});