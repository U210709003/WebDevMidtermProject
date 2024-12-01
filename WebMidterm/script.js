// data
const courses = [
    { id: 1, name: "Calculus", pointscale: 10, ects: 1, students: [] },
    { id: 2, name: "Physics", pointscale: 10, ects: 2, students: [] },
    { id: 3, name: "Chemistry", pointscale: 7, ects: 2, students: [] },
    { id: 4, name: "Web Dev", pointscale: 7, ects: 3, students: [] },
    { id: 5, name: "Database Management", pointscale: 7, ects: 2, students: [] }
];

const students = [
    { id: 1, name: "Super", surname: "Mario", courses: [] },
    { id: 2, name: "Luigi", surname: "Mario", courses: [] },
    { id: 3, name: "Speedy", surname: "Gonzales", courses: [] },
    { id: 4, name: "Tom", surname: "TheCat", courses: [] },
    { id: 5, name: "Jerry", surname: "TheMouse", courses: [] },
    { id: 6, name: "Donald", surname: "Duck", courses: [] },
    { id: 7, name: "Daisy", surname: "Duck", courses: [] },
    { id: 8, name: "Mickey", surname: "Mouse", courses: [] },
    { id: 9, name: "Minnie", surname: "Mouse", courses: [] },
    { id: 10, name: "Buggs", surname: "Bunny", courses: [] }
];

// DOM Elements
const contentArea = document.getElementById("contentArea");

// change content based on the selected type
function changeContent(type) {
    if (type === "Students") {
        displayStudents();
    } else if (type === "Lectures") {
        displayLectures();
    }
}

// display students
function displayStudents() {
    contentArea.innerHTML = `
        <h2>Students</h2>
        <ul id="studentList">
            ${students.map(student => 
                `<li>ID: ${student.id} | ${student.name} ${student.surname} 
                <button class="delete-student-btn" data-student-id="${student.id}">Delete</button></li>`
            ).join('')}
        </ul>
        <button onclick="addStudent()">Add Student</button>
    `;
}

// add a new student
function addStudent() {
    const id = parseInt(prompt("Enter student ID:"));
    const name = prompt("Enter student name:");
    const surname = prompt("Enter student surname:");

    if (isNaN(id) || !name || !surname) {
        alert("Invalid input. Please provide a valid ID, name, and surname.");
        return;
    }

    const existingStudent = students.find(student => student.id === id);
    if (existingStudent) {
        alert(`Student with ID ${id} already exists!`);
        return;
    }

    const newStudent = { id, name, surname, courses: [] };
    students.push(newStudent);
    displayStudents(); // refresh the student list
}

// display lectures
function displayLectures() {
    contentArea.innerHTML = `
        <h2>Lectures</h2>
        <ul id="lectureList">
            ${courses.map(course => 
                `<li><a href="#" onclick="showCourseStudents(${course.id})">${course.name} (${course.pointscale}-point scale)</a></li>`
            ).join('')}
        </ul>
        <button onclick="addLecture()">Add Lecture</button>
    `;
}

// show students in lectures
function showCourseStudents(courseId) {
    const course = courses.find(c => c.id === courseId);
    contentArea.innerHTML = `
        <h2>${course.name} (${course.pointscale}-point scale) Students</h2>
        <ul id="studentList">
            ${course.students.length > 0 
                ? course.students.map(student => `
                    <li>
                        ${student.name} ${student.surname} 
                        ${renderGrades(student, course)}
                        <button class="enter-grades-btn" data-course-id="${course.id}" data-student-id="${student.id}">Enter Grades</button>
                    </li>`).join('')
                : '<li>No students enrolled yet.</li>'}
        </ul>
        <button class="add-student-to-course-btn" data-course-id="${courseId}">Add Student to Course</button>
        <button onclick="displayLectures()">Back to Lectures</button>
    `;
}

// render grades
function renderGrades(student, course) {
    const studentCourse = student.courses.find(c => c.id === course.id);
    if (studentCourse && studentCourse.grades.midterm !== null && studentCourse.grades.final !== null) {
        const { midterm, final } = studentCourse.grades;
        const gpa = calculateGPA(studentCourse);
        const letterGrade = getLetterGrade(gpa, course.pointscale);
        const status = letterGrade === "F" ? "Failed" : "Passed";
        return `<span> | Midterm: ${midterm}, Final: ${final}, GPA: ${gpa}, Grade: ${letterGrade} (${status})</span>`;
    }
    return "<span> | Grades not entered</span>";
}

// get letter grade
function getLetterGrade(gpa, pointScale) {
    if (pointScale === 10) {
        if (gpa >= 90) return "A";
        if (gpa >= 80) return "B";
        if (gpa >= 70) return "C";
        if (gpa >= 60) return "D";
        return "F";
    } else if (pointScale === 7) {
        if (gpa >= 93) return "A";
        if (gpa >= 85) return "B";
        if (gpa >= 77) return "C";
        if (gpa >= 70) return "D";
        return "F";
    }
     
}

// enter grades
function enterGrades(courseId, studentId) {
    const student = students.find(s => s.id === studentId);
    const course = student.courses.find(c => c.id === courseId);

    if (!course) {
        alert("Error: Course not found in student's course list.");
        return;
    }

    const midterm = parseFloat(prompt(`Enter Midterm Grade for ${course.name}:`));
    const final = parseFloat(prompt(`Enter Final Grade for ${course.name}:`));

    if (!isNaN(midterm) && !isNaN(final)) {
        course.grades.midterm = midterm; // update the grades
        course.grades.final = final;

        const gpa = calculateGPA(course);
        const letterGrade = getLetterGrade(gpa, courses.find(c => c.id === courseId).pointscale);
        const status = letterGrade === "F" ? "Failed" : "Passed";

        alert(`Grades updated! GPA: ${gpa}, Grade: ${letterGrade} (${status})`);
        showCourseStudents(courseId); // refresh the courses student list
    } else {
        alert("Invalid grades. Please enter numeric values.");
    }
}


// calculate gpa
function calculateGPA(course) {
    const { midterm, final } = course.grades;
    if (midterm !== null && final !== null) {
        return ((midterm * 0.4) + (final * 0.6)).toFixed(2);
    }
    return 0; // if the grades are missing then return 0
}


// add a student to a course
function addStudentToCourse(courseId) {
    const studentId = parseInt(prompt("Enter student ID to add:"));
    const student = students.find(s => s.id === studentId);
    const course = courses.find(c => c.id === courseId);

    if (!student) {
        alert("Student not found.");
        return;
    }
    if (!course) {
        alert("Course not found.");
        return;
    }

    if (course.students.some(s => s.id === studentId)) {
        alert("Student is already enrolled in this course.");
        return;
    }

   
    course.students.push(student);

    
    student.courses.push({
        id: course.id,
        name: course.name,
        grades: { midterm: null, final: null } // refresh grades
    });

    alert(`${student.name} has been added to the course: ${course.name}.`);
    showCourseStudents(courseId); // refresh the courses student list
}


// delete a student
function deleteStudent(studentId) {
    const index = students.findIndex(student => student.id === studentId);
    if (index !== -1) {
        students.splice(index, 1);
        alert(`Student with ID ${studentId} has been deleted.`);
        displayStudents(); // refresh the student list
    } else {
        alert("Student not found.");
    }
}

// add a new lecture
function addLecture() {
    const lectureName = prompt("Enter lecture name:");
    if (lectureName) {
        const newLecture = { id: courses.length + 1, name: lectureName, pointscale: 10, ects: 2, students: [] };
        courses.push(newLecture);
        displayLectures(); 
    }
}

// event delegation for dynamic buttons
document.addEventListener('click', function (event) {
    if (event.target.matches('.delete-student-btn')) {
        const studentId = parseInt(event.target.dataset.studentId);
        deleteStudent(studentId);
    }

    if (event.target.matches('.add-student-to-course-btn')) {
        const courseId = parseInt(event.target.dataset.courseId);
        addStudentToCourse(courseId);
    }

    if (event.target.matches('.enter-grades-btn')) {
        const courseId = parseInt(event.target.dataset.courseId);
        const studentId = parseInt(event.target.dataset.studentId);
        enterGrades(courseId, studentId);
    }
});
