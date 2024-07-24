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
    gpaBlock.style.top = '20px';
    gpaBlock.style.right = '20px';
    gpaBlock.style.backgroundColor = '#ffffff';
    gpaBlock.style.border = '1px solid #e0e0e0';
    gpaBlock.style.borderRadius = '8px';
    gpaBlock.style.padding = '20px';
    gpaBlock.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    gpaBlock.style.zIndex = '1000';
    gpaBlock.style.width = '300px';
    gpaBlock.style.fontFamily = "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
    gpaBlock.style.fontSize = '14px';
    gpaBlock.style.lineHeight = '1.5';
    
    let title = document.createElement('h2');
    title.textContent = 'GPA Calculations';
    title.style.margin = '0 0 15px 0';
    title.style.fontSize = '20px';
    title.style.borderBottom = '2px solid #007bff';
    title.style.paddingBottom = '10px';
    title.style.color = '#007bff';
    
    gpaBlock.appendChild(title);
    document.body.appendChild(gpaBlock);

    // Add toggle button
    let toggleButton = document.createElement('button');
    toggleButton.textContent = 'Hide';
    toggleButton.style.position = 'absolute';
    toggleButton.style.top = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.padding = '5px 15px';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.backgroundColor = '#007bff';
    toggleButton.style.color = '#ffffff';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontSize = '14px';
    toggleButton.onclick = function() {
        if (gpaBlock.style.width === '300px') {
            gpaBlock.style.width = '60px';
            gpaBlock.style.height = '30px';
            gpaBlock.style.overflow = 'hidden';
            this.textContent = 'Show';
        } else {
            gpaBlock.style.width = '300px';
            gpaBlock.style.height = 'auto';
            gpaBlock.style.overflow = 'visible';
            this.textContent = 'Hide';
        }
    };
    gpaBlock.appendChild(toggleButton);

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
    semesterGPADiv.style.marginBottom = '20px';
    gpaBlock.appendChild(semesterGPADiv);

    // Calculate and display GPAs
    let semesterGPAHeader = document.createElement('h3');
    semesterGPAHeader.textContent = 'Semester GPAs';
    semesterGPAHeader.style.margin = '0 0 10px 0';
    semesterGPAHeader.style.fontSize = '16px';
    semesterGPAHeader.style.color = '#333333';
    semesterGPADiv.appendChild(semesterGPAHeader);

    let semesterGPAs = [];
    Object.entries(semesters).forEach(([semester, grades]) => {
        let gpa = calculateGPA(grades);
        semesterGPAs.push(gpa);
        let gpaText = document.createElement('p');
        gpaText.textContent = `${semester}: ${gpa.toFixed(2)}`;
        gpaText.style.margin = '5px 0';
        semesterGPADiv.appendChild(gpaText);
    });

    let overallGPA = calculateGPA(allGrades);
    let overallGPADiv = document.createElement('div');
    let overallGPAHeader = document.createElement('h3');
    overallGPAHeader.textContent = 'Overall GPA';
    overallGPAHeader.style.margin = '20px 0 10px 0';
    overallGPAHeader.style.fontSize = '16px';
    overallGPAHeader.style.color = '#333333';
    overallGPADiv.appendChild(overallGPAHeader);
    let overallGPAText = document.createElement('p');
    overallGPAText.textContent = overallGPA.toFixed(2);
    overallGPAText.style.fontSize = '24px';
    overallGPAText.style.fontWeight = 'bold';
    overallGPAText.style.color = '#007bff';
    overallGPAText.style.margin = '10px 0';
    overallGPAText.style.textAlign = 'center';
    overallGPADiv.appendChild(overallGPAText);
    
    // Add a simple chart
    let chartContainer = document.createElement('div');
    chartContainer.style.height = '100px';
    chartContainer.style.display = 'flex';
    chartContainer.style.alignItems = 'flex-end';
    chartContainer.style.justifyContent = 'space-between';
    semesterGPAs.forEach((gpa, index) => {
        let bar = document.createElement('div');
        bar.style.width = `${100 / semesterGPAs.length - 5}%`;
        bar.style.height = `${gpa * 10}px`;
        bar.style.backgroundColor = '#007bff';
        bar.style.borderRadius = '3px 3px 0 0';
        bar.title = `Semester ${index + 1}: ${gpa.toFixed(2)}`;
        chartContainer.appendChild(bar);
    });
    overallGPADiv.appendChild(chartContainer);

    gpaBlock.appendChild(overallGPADiv);

    // Add export button
    let exportButton = document.createElement('button');
    exportButton.textContent = 'Export GPA Data';
    exportButton.style.marginTop = '20px';
    exportButton.style.padding = '10px';
    exportButton.style.border = 'none';
    exportButton.style.borderRadius = '5px';
    exportButton.style.backgroundColor = '#28a745';
    exportButton.style.color = '#ffffff';
    exportButton.style.cursor = 'pointer';
    exportButton.style.width = '100%';
    exportButton.style.fontSize = '14px';
    exportButton.onclick = function() {
        let csv = 'Semester,GPA\n';
        Object.entries(semesters).forEach(([semester, grades]) => {
            csv += `${semester},${calculateGPA(grades).toFixed(2)}\n`;
        });
        csv += `Overall,${overallGPA.toFixed(2)}`;
        
        let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        let link = document.createElement('a');
        if (link.download !== undefined) {
            let url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'gpa_data.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    gpaBlock.appendChild(exportButton);
} else {
    console.error('Table with class ".table.table-hover" not found.');
}