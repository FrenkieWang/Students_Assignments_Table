# Tabular Content

HTML/CSS/JS application


### STEP 1:   Create Table Layout [CSS]
1.  Create a table with 11 rows and 8 column.

    The headings of columbn includes:  
    
    **Student Name, Student ID, Assignment 1, Assignment 2,...., Assignment 5, Average(%)**

    The table row contain **10 hypothetical students**.

2.  Headings:   **Dark Grey** BackGround-Color

    Cells:   **Alternating light-grey** BackGround-Color, **black** Text Color

3.  All data in Table:   **sans-serif** Font


4.  Heading: **center-aligned**

    Name and ID: **left-aligned**

    Average: **right-aligned**    

5.  Only Assigment:  **content enditable**

        a) not submitted: Default Value [-] center-aligned -> Yellow BackGround-Color
        b) submitted: 0 - 100 Integer right-aligned -> alternating Row BackGround-Color
        c) Not submit Integer 0-100: converts to Default Value [-]

6.  *[Extra]* Click Student Name -> Highlight complete table data row

        Click Student Name again -> Disselect the Row
        Not allowed to Click Table Title Row!

7.  *[Extra]* Click Assignment Column Title -> Highlight complete Assignment Grade Column

        Click Assignment Colum Title -> Disselect the Column
        Not allowed to Select Student Name and Student ID


### STEP 2:   Calculate the Average Score [JS]
1.  Create a function to Generate **random Name** and **ramdom ID** for 10 students.

2.  Average Score: **Rounded Integer 0 - 100**, without decimal places. 

        Default Value -> **-**

    Update Average Score when:

        a) Input an Assignment Score.
        b) Delete an Assignment Column which has valid Score.

3.  Change CSS of the Average Score:

        Default Value: Black Color and alternating Row BackGround-Color.
        0 ≤ Score ≤ 59: White Color and Red BackGround-Color.
        60 ≤ Score ≤ 100: Black Color and alternating Row BackGround-Color.

4.  Set a Div under the Table - [**Count of Unsubmitted** Assignments].

    Calculate the total value automatically when:

        a) Input an Assignment Score
        b) A valid Assignment Score becomes invalid
        c) Insert/Delete a Row/Column  

5.  Click the Column of **Average** —> Toggle the presentation of Average Grade

    Sequence: a -> b -> c -> a -> b -> c -> ..............

        a) (Default) Average[%] - Percentage Grade - **93-100**
        b) Arerage[Letter] - Letter Grade - **A**
        c) Average[4.0] - 4.0 Scale - **4.0**
 

### STEP 3:   Insert/Delete the Row/Column [JS]
**Row** - Student Information

**Column** - Assignment Score

1.  *[Extra]* Make a button to Delete Row/Column

        Delete a selected Row
        Delect a selected Column -> Update Final Grade Average

2.  *[Extra]* Make a button to undelete the last deleted Row/Column

        Once clicked, button disabled!
        Until another Row/Column is deleted, button can be clicked again.

3.  Make a button to insert a new Row after the last row of the table.

4.  *[Extra]* Right Click on any cell in a Row -> Show an Menu with 2 options

        a) Insert a row above
        b) Insert a row below

5.  Make a button to insert a new Column at the **one column left of Average[%] Column**.

    The title name is determined by the number of previous Assignments.

    [Format]  **`Assignment (count+1)`**

    For example, if there is `Assignment 1, Assignment 2, ... Assignment 5` in the table before,

    the title name of new inserted Column should be `Assignment 6`!

6.  Create a button to save all information of the current Table.

7.  Create a button to retrieve previously saved Table information in **Procedure 6**
    
### STEP 4:   Pay Attention when Insert/Delete[JS]
1.  Update **Count of Unsubmitted** Assignments.

2.  Update the **Average Score** of Each Student.

3.  Copy the **JavaScript function** in **STEP 2** and **STEP 3** of **default Row/Column**.    