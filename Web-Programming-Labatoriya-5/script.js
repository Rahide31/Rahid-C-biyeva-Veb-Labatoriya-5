// script.js

const eduList = document.getElementById('edu-list');
const expList = document.getElementById('exp-list');
const skillList = document.getElementById('skill-list');
const resetBtn = document.getElementById('resetBtn');

let profileData = {
  education: [],
  experience: [],
  skills: [],
};

const LOCAL_STORAGE_KEY = 'profileData';

// Simulyasiya üçün data.json kimi qəbul edəcəyimiz verilən
const simulatedFetchData = {
  education: [
    "Azərbaycan Texniki Universiteti - İnformasiya Təhlükəsizliyi (1-ci kurs, 2024-Davam edir)",
    "Bakı şəhər 252 nömrəli məktəb (2014-2024)",
  ],
  experience: ["Praktikaya gediləcək"],
  skills: ["Python", "HTML, CSS"]
};

// --- Render funksiyası ---
function renderList(listElement, items, type) {
  listElement.innerHTML = '';
  items.forEach((item, index) => {
    const li = document.createElement('li');

    // Normal görünüş (display)
    const span = document.createElement('span');
    span.textContent = item;
    li.appendChild(span);

    // Düymə - redaktə üçün
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Düzəliş et';
    editBtn.style.marginLeft = '10px';
    editBtn.addEventListener('click', () => enableEdit(li, index, type));
    li.appendChild(editBtn);

    listElement.appendChild(li);
  });
}

// --- Redaktə rejimi ---
function enableEdit(listItem, index, type) {
  listItem.innerHTML = '';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = profileData[type][index];
  input.style.width = '70%';
  listItem.appendChild(input);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Yadda saxla';
  saveBtn.style.marginLeft = '10px';
  saveBtn.addEventListener('click', () => {
    const newValue = input.value.trim();
    if (newValue) {
      profileData[type][index] = newValue;
      saveToLocalStorage();
      renderAll();
    } else {
      alert('Boş dəyər yaza bilməzsiniz!');
    }
  });
  listItem.appendChild(saveBtn);

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Ləğv et';
  cancelBtn.style.marginLeft = '10px';
  cancelBtn.addEventListener('click', () => {
    renderAll();
  });
  listItem.appendChild(cancelBtn);
}

// --- Bütün siyahıları yenidən render et ---
function renderAll() {
  renderList(eduList, profileData.education, 'education');
  renderList(expList, profileData.experience, 'experience');
  renderList(skillList, profileData.skills, 'skills');
}

// --- localStorage-dan yüklə ---
function loadFromLocalStorage() {
  const dataStr = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (dataStr) {
    try {
      profileData = JSON.parse(dataStr);
      return true;
    } catch (e) {
      console.error('localStorage-dan data oxunmadı:', e);
      return false;
    }
  }
  return false;
}

// --- localStorage-a yadda saxla ---
function saveToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profileData));
}

// --- Simulyasiya fetch funksiyası ---
function fetchProfileData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(simulatedFetchData);
    }, 1000);
  });
}

// --- Reset funksiyası ---
resetBtn.addEventListener('click', () => {
  if (confirm('Məlumat sıfırlansın? Bütün dəyişikliklər itəcək!')) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    init(); // yenidən ilkin datanı yüklə
  }
});

// --- İlk yüklənmə ---
async function init() {
  const hasLocalData = loadFromLocalStorage();
  if (!hasLocalData) {
    // Fetch ilə (simulyasiya) data yüklə
    try {
      const fetchedData = await fetchProfileData();
      profileData.education = fetchedData.education;
      profileData.experience = fetchedData.experience;
      profileData.skills = fetchedData.skills;
      saveToLocalStorage();
    } catch (error) {
      console.error('Fetch zamanı xəta:', error);
    }
  }
  renderAll();
}

init();


// --- Əlavə funksiyalar: Keyfiyyətləri qarışdır ---
function shuffleQualities() {
  const qualities = [
    "Yüksək məsuliyyət hissi və özünənəzarət",
    "Sürətli öyrənmə və tətbiqetmə bacarığı",
    "Komanda və fərdi şəkildə effektiv işləmək qabiliyyəti",
    "Analitik və tənqidi düşüncə",
    "Güclü təşkilati və planlaşdırma bacarığı",
    "Yeniliklərə açıq və inkişaf yönümlü düşüncə",
    "Güclü ünsiyyət və təqdimat bacarıqları"
  ];
  for (let i = qualities.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qualities[i], qualities[j]] = [qualities[j], qualities[i]];
  }
  const qualitiesUl = document.querySelector('.content ul:nth-of-type(2)');
  qualitiesUl.innerHTML = '';
  qualities.forEach(q => {
    const li = document.createElement('li');
    li.textContent = q;
    qualitiesUl.appendChild(li);
  });
}

// --- Kontakt Formu (sənin əvvəlki funksionallıq) ---
const contactForm = document.getElementById('contactForm');
const errorMessage = document.getElementById('errorMessage');
const savedData = document.getElementById('savedData');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const date = document.getElementById('date').value.trim();
  const description = document.getElementById('description').value.trim();

  // Sadə validasiya
  if (!name || !email || !date || !description) {
    errorMessage.textContent = 'Zəhmət olmasa bütün sahələri doldurun.';
    return;
  }
  if (!validateEmail(email)) {
    errorMessage.textContent = 'Email düzgün formatda deyil.';
    return;
  }

  errorMessage.textContent = '';

  // Məlumatı localStorage saxla
  const formData = { name, email, date, description };
  localStorage.setItem('contactFormData', JSON.stringify(formData));

  // Ekrana göstər
  savedData.innerHTML = `
  <h3>Yadda saxlanmış məlumatlar:</h3>
  <p><b>Ad:</b> ${name}</p>
  <p><b>Email:</b> ${email}</p>
  <p><b>Tarix:</b> ${date}</p>
  <p><b>Təsvir:</b> ${description}</p>
`;
  // Formu sıfırla
  contactForm.reset();
});

function validateEmail(email) {
  // Sadə email yoxlama regex
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// --- CV-ni göstər/gizlət funksiyası ---
function toggleCV() {
  const cvContainer = document.querySelector('.cv-container');
  if (cvContainer.style.display === 'none') {
    cvContainer.style.display = 'flex';
  } else {
    cvContainer.style.display = 'none';
  }
}

// --- Motivasiya funksiyası ---
function showMotivation() {
  const messages = [
    "Bugün əzmlə çalış, sabah uğur sənindir!",
    "Hər gün yeni bir fürsət gətirir.",
    "Sən bacararsan!",
    "Daim öyrən və inkişaf et."
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  alert(msg);
}
ocument.getElementById('editBirthDate').addEventListener('click', function() {
    const current = prompt("Doğum Tarixini daxil et:", "31.08.2007");
    if (current !== null) {
        // Yeni dəyəri göstərmək üçün
        this.parentElement.childNodes[1].textContent = " Doğum Tarixi: " + current + " ";
    }
});

document.getElementById('editContact').addEventListener('click', function() {
    const current = prompt("Əlaqə nömrəsini daxil et:", "099 864 04 54");
    if (current !== null) {
        this.parentElement.childNodes[1].textContent = " Əlaqə: " + current + " ";
    }
});

document.getElementById('editEmail').addEventListener('click', function() {
    const current = prompt("Email ünvanını daxil et:", "cebiyevarahide31@gmail.com");
    if (current !== null) {
        // Email linki update üçün:
        this.parentElement.querySelector('a').textContent = current;
        this.parentElement.querySelector('a').href = "mailto:" + current;
    }
});

document.getElementById('editAddress').addEventListener('click', function() {
    const current = prompt("Ünvanı daxil et:", "Bakı, Nizami rayonu, Şirin Mirzəyev 180");
    if (current !== null) {
        this.parentElement.childNodes[1].textContent = " Ünvan: " + current + " ";
    }
});

document.getElementById('editLanguages').addEventListener('click', function() {
    const current = prompt("Dilləri vergüllə ayıraraq daxil et:", "English - Pre-intermediate, Türk - Çox yaxşı, Azərbaycan - Çox yaxşı");
    if (current !== null) {
        const ul = this.parentElement.nextElementSibling;
        ul.innerHTML = ""; // təmizlə
        const langs = current.split(",");
        langs.forEach(lang => {
            const li = document.createElement("li");
            li.textContent = lang.trim();
            ul.appendChild(li);
        });
    }
});