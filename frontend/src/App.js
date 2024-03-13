import React from 'react'

function App() {

  // 表头数据
  const headers = ["Student Name", "Student ID", "Assignment 1", "Assignment 2", "Assignment 3", "Assignment 4", "Assignment 5", "Average (%)"];

  // 学生数据，使用 '-' 作为占位符
  const studentsData = Array(4).fill(Array(headers.length).fill('-'));

  return (
    <div className="App">
      <h3>Students Assignments Table</h3>
      
      <table border="1">
      <thead>
        <tr>
          {headers.map(header => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {studentsData.map((student, index) => (
          <tr key={index}>
            {student.map((item, itemIndex) => (
              <td key={itemIndex}>{item}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    </div>
  );
}

export default App;
