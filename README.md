# 🎓 Preschool Special Education Case Conference Helper

A lightweight, browser-based web system that helps teachers record, manage, and print progress reports for preschool children receiving special education services.  

This project was built to reduce paperwork time, eliminate duplicate data entry, and improve the accuracy of student records.

---

## 🧩 Overview

Teachers in local preschools and daycare centers often need to complete **case conference forms** for each student.  
Traditionally, this process is **manual, repetitive, and time-consuming**.  

This simple system automates that work by allowing teachers to:
- Enter student and progress details digitally  
- Save information directly in the browser (no server needed)  
- Quickly generate and print official case conference reports  

---

## 🏗️ Features

✅ Add, edit, and delete student profiles  
✅ Write and save progress notes for each child  
✅ Automatically store data in the browser (`localStorage`)  
✅ Generate **printable case conference reports**  
✅ Export/Import data in JSON format (for backup and sharing)  
✅ Search students by name or preschool center  
✅ Fully responsive, built with **Tailwind CSS**  

---

## 🗂️ Project Structure

```
school-system/
│
├── index.html        # Main web interface (dashboard + form + list)
├── styles.css        # Custom styles to complement Tailwind
├── script.js         # Core app logic (data saving, editing, reports)
│
└── original_uploads/ # Folder containing original prototype files
```

---

## ⚙️ How to Run

1. **Download or clone** this repository / ZIP file  
2. Open the folder  
3. Double-click `index.html` to open it in your browser  
4. Start adding student records 🎉  

> 💾 All data is saved locally in your browser — no internet connection or server required.

---

## 🖨️ How to Use

| Action | Description |
|--------|-------------|
| **Add Student** | Fill out the form and click **Save Student** |
| **Edit** | Click ✏️ next to a name to load data back into the form |
| **Delete** | Click 🗑️ to remove a student |
| **Print Report** | Click 🖨️ to open a printable case conference form |
| **Export Data** | Save all students to a JSON backup file |
| **Import Data** | Upload a JSON file to restore saved records |

---

## 🧠 Technologies Used

- **HTML5** – structure  
- **CSS3 + Tailwind CSS** – styling and responsiveness  
- **JavaScript (ES6)** – data logic and UI control  
- **localStorage API** – local data storage  

---

## 📈 Benefits

- Saves time by eliminating repeated handwriting  
- Reduces data entry errors  
- Simplifies report preparation  
- Keeps records safely on each teacher’s device  
- Can be upgraded to a multi-user system later (with a backend)

---

## 🚀 Future Enhancements (Optional)

- Multi-user login (teacher accounts)  
- Cloud-based database (e.g., SQLite, Firebase)  
- PDF export for official report submission  
- Admin dashboard for tracking multiple schools  

---

## 👩‍🏫 Author

**Austine Lubanga**  
Created as part of the *Simplified Case Study – Preschool Special Education Reporting System.*
