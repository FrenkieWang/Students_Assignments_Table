import React from 'react'
import './App.css'; // 确保导入了CSS文件

function App() {

  // 表头数据
  const headers = ["Student Name", "Student ID", "Assignment 1", "Assignment 2", "Assignment 3", "Assignment 4", "Assignment 5", "Average (%)"];

  // 根据列名确定对齐方式
  const getAlignment = (columnName) => {
    if (columnName === "Student Name" || columnName === "Student ID") {
      return "left-align"; // 左对齐
    } else {
      return "right-align"; // 右对齐
    }
  };

  // 检查列是否为作业列
  const isAssignmentColumn = (columnName) => {
    return columnName.startsWith("Assignment");
  };

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
              <td 
                key={itemIndex} 
                className={getAlignment(headers[itemIndex])}
                contentEditable={isAssignmentColumn(headers[itemIndex])}
              >{item}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    </div>
  );
}

export default App;