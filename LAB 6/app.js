// 2749 2026-11-13
const P = 7;
const M = 22;
const T = 49;

const form = document.getElementById("registrationForm");

if (form) {
  const errorList = document.getElementById("errorList");
  const nameCounter = document.getElementById("nameCounter");
  const cityOutput = document.getElementById("cityOutput");
  const citySelect = document.getElementById("city");
  const fieldIds = [
    "fullName",
    "email",
    "phone",
    "password",
    "confirmPassword",
    "city"
  ];

  function valueOf(id) {
    return document.getElementById(id).value;
  }

  function trimValueOf(id) {
    return valueOf(id).trim();
  }

  function isEmailValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isPhoneValid(value) {
    return /^\d{9}$/.test(value);
  }

  function validateField(id) {
    const value = valueOf(id);
    const trimmed = value.trim();
    const field = document.getElementById(id);
    let message = "";

    if (id === "fullName") {
      if (trimmed === "") message = "Full name is required.";
      else if (trimmed.length > M) message = `Name must be at most ${M} characters.`;
    }

    if (id === "email") {
      if (trimmed === "") message = "Email is required.";
      else if (!isEmailValid(trimmed)) message = "Email format is invalid.";
    }

    if (id === "phone") {
      if (trimmed === "") message = "Phone is required.";
      else if (!isPhoneValid(trimmed)) message = "Phone must be exactly 9 digits.";
    }

    if (id === "password") {
      if (value === "") message = "Password is required.";
      else if (value.length < P) message = `Password must be at least ${P} characters.`;
    }

    if (id === "confirmPassword") {
      if (value === "") message = "Please confirm your password.";
      else if (value !== valueOf("password")) message = "Passwords do not match.";
    }

    if (id === "city") {
      if (trimmed === "") message = "City is required.";
    }

    field.classList.toggle("invalid", message !== "");
    return message;
  }

  fieldIds.forEach((id) => {
    document.getElementById(id).addEventListener("blur", () => {
      validateField(id);
    });
  });

  document.getElementById("fullName").addEventListener("keyup", () => {
    const left = Math.max(0, M - valueOf("fullName").length);
    nameCounter.textContent = `${left} characters left`;
  });

  citySelect.addEventListener("change", () => {
    const chosen = citySelect.value === "" ? "..." : citySelect.value;
    cityOutput.textContent = `You chose ${chosen}`;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    errorList.textContent = "";
    const errors = [];

    fieldIds.forEach((id) => {
      const message = validateField(id);
      if (message !== "") errors.push(message);
    });

    if (errors.length > 0) {
      errors.forEach((message) => {
        const li = document.createElement("li");
        li.textContent = message;
        errorList.appendChild(li);
      });
      return;
    }

    const name = trimValueOf("fullName");
    if (confirm(`Register ${name}?`)) {
      location.href = `board.html?name=${encodeURIComponent(name)}`;
    }
  });
}

const marksBody = document.getElementById("marksBody");

if (marksBody) {
  const welcome = document.getElementById("welcome");
  const loadTime = document.getElementById("loadTime");
  const boardError = document.getElementById("boardError");
  const sortSelect = document.getElementById("sortSelect");
  const backBtn = document.getElementById("backBtn");

  const params = new URLSearchParams(location.search);
  const studentName = params.get("name") || "Student";

  welcome.textContent = `Welcome, ${studentName}`;
  loadTime.textContent = `Loaded at ${new Date().toLocaleString()}`;

  let students = [];

  function grade(marks) {
    if (marks < T) return "Fail";
    if (marks >= 75) return "Distinction";
    return "Pass";
  }

  function renderTable(list) {
    marksBody.textContent = "";

    list.forEach((student) => {
      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.textContent = student.name;

      const marksTd = document.createElement("td");
      marksTd.textContent = student.marks;

      const cityTd = document.createElement("td");
      cityTd.textContent = student.city;

      const gradeTd = document.createElement("td");
      gradeTd.textContent = grade(student.marks);

      tr.appendChild(nameTd);
      tr.appendChild(marksTd);
      tr.appendChild(cityTd);
      tr.appendChild(gradeTd);
      marksBody.appendChild(tr);
    });
  }

  async function loadStudents() {
    try {
      const response = await fetch("students.json");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      students = await response.json();
      renderTable(students);
    } catch (error) {
      boardError.textContent = `Could not load students.json: ${error.message}`;
    }
  }

  sortSelect.addEventListener("change", () => {
    const copy = [...students];
    if (sortSelect.value === "name") {
      copy.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      copy.sort((a, b) => b.marks - a.marks);
    }
    renderTable(copy);
  });

  backBtn.addEventListener("click", () => {
    history.back();
  });

  loadStudents();
}

console.log("2749");