// Function to calculate GPA
function calculateGPA(grades) {
    let totalWeightedGrade = 0;
    let totalCredits = 0;

    grades.forEach(grade => {
        if (grade.grade && grade.credit) {
            totalWeightedGrade += grade.grade * grade.credit;
            totalCredits += grade.credit;
        }
    });

    return totalCredits > 0 ? totalWeightedGrade / totalCredits : 0;
}

// Create a block element to display GPA calculations
function createGPABlock() {
    let gpaBlock = document.createElement('div');
    gpaBlock.id = 'gpaBlock';
    gpaBlock.style.position = 'fixed';
    gpaBlock.style.top = '10px';
    gpaBlock.style.right = '10px';
    gpaBlock.style.backgroundColor = '#f9f9f9';
    gpaBlock.style.border = '1px solid #ccc';
    gpaBlock.style.padding = '10px';
    gpaBlock.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    gpaBlock.style.zIndex = '1000';
    gpaBlock.style.maxHeight = '80vh';
    gpaBlock.style.overflowY = 'auto';
    gpaBlock.style.width = '300px';
    gpaBlock.style.fontFamily = 'Arial, sans-serif';
    gpaBlock.style.fontSize = '14px';
    
    let title = document.createElement('h2');
    title.textContent = 'GPA Calculations';
    title.style.marginTop = '0';
    title.style.fontSize = '18px';
    title.style.borderBottom = '1px solid #ccc';
    title.style.paddingBottom = '5px';
    
    gpaBlock.appendChild(title);
    document.body.appendChild(gpaBlock);
    return gpaBlock;
}

// Extract data from the table
let table = document.querySelector('.table.table-hover');
if (table) {
    let rows = Array.from(table.querySelectorAll('tbody tr'));

    let semesters = {};
    let allGrades = [];
    let excludedCodes = ["GDQP", "ENT", "VOV", "TRS", "ÐSA", "LAB", "OJS", "OJT", "SYB301"];

    rows.forEach(row => {
        let cells = row.querySelectorAll('td');

        // Ensure there are enough cells in the row
        if (cells.length >= 9) {
            let semester = cells[2]?.textContent;
            let subjectCode = cells[3]?.textContent;
            let credit = parseFloat(cells[7]?.textContent) || 0;
            let gradeElement = cells[8]?.querySelector('.label-primary');
            let grade = gradeElement ? parseFloat(gradeElement.textContent) : null;

            if (grade !== null && credit > 0 && !excludedCodes.some(code => subjectCode.includes(code))) {
                if (!semesters[semester]) {
                    semesters[semester] = [];
                }
                semesters[semester].push({ grade, credit });
                allGrades.push({ grade, credit });
            }
        }
    });

    let gpaBlock = createGPABlock();
    let semesterGPADiv = document.createElement('div');
    semesterGPADiv.style.marginBottom = '10px';
    gpaBlock.appendChild(semesterGPADiv);

    // Calculate and display GPAs
    let semesterGPAHeader = document.createElement('h3');
    semesterGPAHeader.textContent = 'Semester GPAs:';
    semesterGPAHeader.style.marginBottom = '5px';
    semesterGPADiv.appendChild(semesterGPAHeader);

    Object.entries(semesters).forEach(([semester, grades]) => {
        let gpa = calculateGPA(grades);
        let gpaText = document.createElement('p');
        gpaText.textContent = `${semester}: ${gpa.toFixed(2)}`;
        semesterGPADiv.appendChild(gpaText);
    });

    let overallGPA = calculateGPA(allGrades);
    let overallGPADiv = document.createElement('div');
    let overallGPAHeader = document.createElement('h3');
    overallGPAHeader.textContent = 'Overall GPA:';
    overallGPAHeader.style.marginBottom = '5px';
    overallGPADiv.appendChild(overallGPAHeader);
    
    let overallGPAText = document.createElement('p');
    overallGPAText.textContent = overallGPA.toFixed(2);
    overallGPADiv.appendChild(overallGPAText);

    gpaBlock.appendChild(overallGPADiv);
} else {
    console.error('Table with class ".table.table-hover" not found.');
}
