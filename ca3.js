document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    let gradeFormat = 'Average[%]'; // Default to Percent Grade

    // 用于存储最近被删除的行和列
    let deletedRow = null;
    let deletedColumn = {index: null, cells: []};

    // PART 1 - Create Table Header
    const headers = ["Student Name", "Student ID", "Assignment 1", "Assignment 2", "Assignment 3", "Assignment 4", "Assignment 5", "Average[%]"];
    const headerRow = thead.insertRow();

    headers.forEach((headerText) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.className = 'text-center';
        headerRow.appendChild(th);
    });
    bindColumnSelectListeners();

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
        nameCell.addEventListener('click', handleSelectRow);

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

    // PART 4 - Function to Update the average for a row
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
                formattedAvg = changeGradeFormat(avg); // 4.0 Scale
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

    // PART 6 - Toggle Grade Format when clicking 'Average' header
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
        
    // PART 7 - Click Student Name -> Select A Row
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

    // PART 8 - Click Assignment Title -> Select A Column
    function handleSelectColumn(event) {
        const th = event.target;
        const columnIndex = Array.from(thead.querySelectorAll('th')).indexOf(th); // 获取点击的列索引

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
    }

    // PART 9 - Clear all selected Rows/Columns
    function clearSelection() {
        document.querySelectorAll('.selected-row, .selected-column, .selected-column-top, .selected-column-bottom')
        .forEach(el => {
            el.classList.remove('selected-row', 'selected-column', 'selected-column-top', 'selected-column-bottom');
        });
    }

    // PART 10 - Delete selected Row
    document.getElementById('deleteRowBtn').addEventListener('click', deleteSelectedRow);

    function deleteSelectedRow(){
        // Find all selected rows
        const selectedRows = tbody.querySelectorAll('.selected-row');

        if (selectedRows.length === 0) {
            alert('Please select a Student to delete.');
            return;
        }

        const row = selectedRows[0];
        // Remember the Deleted Row!
        deletedRow = {element: row.cloneNode(true), index: Array.from(tbody.rows).indexOf(row)};
        row.parentNode.removeChild(row);

        document.getElementById('undeleteBtn').disabled = false;
    }
    

    // PART 11 -  Delete selected Column
    document.getElementById('deleteColumnBtn').addEventListener('click', deleteSelectedColumn);    

    function deleteSelectedColumn() {
        // Find the selected Column 
        const selectedTh = thead.querySelector('.selected-column');
        if (!selectedTh) {
            alert('Please select a column to delete.');
            return;
        }
        const columnIndex = Array.from(thead.querySelectorAll('th')).indexOf(selectedTh);

        // 在删除之前保存
        deletedColumn.index = columnIndex;
        deletedColumn.header = selectedTh.textContent;
        deletedColumn.classes = selectedTh.className; // 保存<th>元素的类
        
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

        bindColumnSelectListeners();
        document.getElementById('undeleteBtn').disabled = false;
    }


    // PART 12 - Button : Add Column Assignment X+1
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
        newAssignmentHeader.addEventListener('click', handleSelectColumn);

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
    }


    // PART 13 -  Bind Listeners when column changes
    function bindColumnSelectListeners() {
        thead.querySelectorAll('th').forEach((th, index) => {
            // Remove previous EventListener of 'Click'
            th.removeEventListener('click', handleSelectColumn);

            // Add EventListener on all Assignment Table Head
            if (th.textContent.trim().startsWith("Assignment")) {
                th.style.cursor = 'pointer'; 
                th.addEventListener('click', handleSelectColumn); 
            } else {
                th.style.cursor = 'default'; 
            }
        });
    }

    // PART 14 - Context Menu for Adding Rows
    document.querySelector('table tbody').addEventListener('contextmenu', function(event) {
        // 确保事件来源自td元素
        if (event.target && event.target.nodeName === 'TD') { // NodeName 必须是大写的标签名
            event.preventDefault(); // 阻止默认的右键菜单

            // 首先移除已存在的contextMenu
            removeContextMenu();

            // 创建自定义的上下文菜单
            const contextMenu = document.createElement('div');
            contextMenu.id = 'customContextMenu';
            contextMenu.style.position = 'fixed';
            contextMenu.style.left = `${event.clientX}px`;
            contextMenu.style.top = `${event.clientY}px`;
            contextMenu.style.backgroundColor = 'white';
            contextMenu.style.border = '1px solid #ccc';
            contextMenu.style.padding = '5px';
            contextMenu.style.zIndex = '1000'; // 确保菜单在最上层

            // 添加菜单项
            const insertAbove = document.createElement('div');
            insertAbove.textContent = 'Insert a row above';
            insertAbove.style.cursor = 'pointer';
            insertAbove.addEventListener('click', function() {
                // 在当前行上方插入新行
                const newRow = event.target.parentNode.parentNode.insertRow(event.target.parentNode.sectionRowIndex);
                createRowCells(newRow, event.target.parentNode.cells.length);
                document.body.removeChild(contextMenu); // 移除上下文菜单
            });

            const insertBelow = document.createElement('div');
            insertBelow.textContent = 'Insert a row below';
            insertBelow.style.cursor = 'pointer';
            insertBelow.addEventListener('click', function() {
                // 在当前行下方插入新行
                const newRow = event.target.parentNode.parentNode.insertRow(event.target.parentNode.sectionRowIndex + 1);
                createRowCells(newRow, event.target.parentNode.cells.length);
                document.body.removeChild(contextMenu); // 移除上下文菜单
            });

            contextMenu.appendChild(insertAbove);
            contextMenu.appendChild(insertBelow);

            // 在页面上添加自定义上下文菜单
            document.body.appendChild(contextMenu);
        }
    });

    // Part 15 - Fill the Cells into created Row
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
                cell.textContent = "-";
                cell.className = 'text-right';
            }
        }
    }

    // Part 16 - Remove Context Menu
    document.addEventListener('click', removeContextMenu);

    function removeContextMenu(){
        const existingMenu = document.getElementById('customContextMenu');
        if (existingMenu) {
            document.body.removeChild(existingMenu);
        }
    }

    // Part 17 - Button : Add Row at the buttom of Table
    document.getElementById('addStudentBtn').addEventListener('click', addStudentRow);

    function addStudentRow() {
        const rowCount = document.querySelector('table tbody').rows.length;
        const newRow = tbody.insertRow(rowCount);
        const cellCount = document.querySelector('table thead tr').cells.length;

        createRowCells(newRow, cellCount);
    }

    // Part 18 - Undelete Functionality
    document.getElementById('undeleteBtn').addEventListener('click', function() {
        // Case 1: Recover the Row
        if (deletedRow) {
            const refRow = tbody.rows[deletedRow.index] || tbody.appendChild(document.createElement('tr'));
            tbody.insertBefore(deletedRow.element, refRow);

            // 为“Student Name”单元格重新绑定点击事件监听器
            const nameCell = deletedRow.element.cells[0];
            nameCell.style.cursor = 'pointer'; 
            nameCell.addEventListener('click', handleSelectRow);

            // 为assignment单元格重新绑定验证和样式调整逻辑
            for (let i = 2; i < deletedRow.element.cells.length - 1; i++) {
                validateAndStyleCell(deletedRow.element.cells[i]);
            }

            deletedRow = null; // 清除存储的被删除行，防止重复恢复
        }

        // Case 2: Recover the Column
        if (deletedColumn.index !== null) {
            // Recover TBody of the Column
            Array.from(tbody.rows).forEach((row, i) => {
                const refCell = row.cells[deletedColumn.index] || row.appendChild(document.createElement('td'));
                row.insertBefore(deletedColumn.cells[i], refCell);
                validateAndStyleCell(deletedColumn.cells[i]); // CSS and JS of that cell
            });

            // Recover THead of the Column
            const headerCell = document.createElement('th');
            headerCell.textContent = deletedColumn.header;
            headerCell.className = deletedColumn.classes; // 重新应用保存的类
            headerCell.addEventListener('click', handleSelectColumn); // 重新绑定点击事件监听器
            headerCell.style.cursor = 'pointer';
            thead.rows[0].insertBefore(headerCell, thead.rows[0].cells[deletedColumn.index]);

            // Update the Average Score after Undelete!
            Array.from(tbody.rows).forEach(row => {
                updateAverageForRow(row);
            });

            deletedColumn = {index: null, cells: []}; // 清除存储的被删除列，防止重复恢复
        }

        // "Disable Undelete" Button after Clicked
        document.getElementById('undeleteBtn').disabled = true;
    });
});