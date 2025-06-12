const modal = document.getElementById('contactModal');
const addContactBtn = document.querySelector('.add-contact-btn');
const closeModalBtn = document.querySelector('.close-button');
const contactForm = document.getElementById('contactForm');
const contactsContainer = document.getElementById('contacts');

let editingContactId = null;

// Show modal
function openModal() {
  modal.classList.remove('hidden');
}

// Show alert on login failure/success (moved from inline <script>)
const params = new URLSearchParams(window.location.search);
if (params.get('error')) {
  alert('Wrong username or password.');
}
if (params.get('success')) {
  alert('Successfully logged in!');
}


// Hide modal
function closeModal() {
  modal.classList.add('hidden');
  contactForm.reset();
  editingContactId = null;
}

// Handle Add Contact button
addContactBtn.addEventListener('click', () => {
  editingContactId = null;
  openModal();
});

// Handle Close button
closeModalBtn.addEventListener('click', closeModal);

// Submit form
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  const url = editingContactId ? `/contacts/${editingContactId}` : '/contacts';
  const method = editingContactId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    location.reload();
  } else {
    alert('Failed to save contact');
  }
});

// Load contacts and attach Edit/Delete events
fetch('/api/contacts')
  .then(res => res.json())
  .then(data => {
    contactsContainer.innerHTML = '';

    data.forEach(c => {
      const div = document.createElement('div');
      div.className = 'contact';
      div.innerHTML = `
        - Creator: ${c.firstName} - Instructions: ${c.lastName} - Baking time: ${c.email} - Ingredients: ${c.favoriteColor} - Country Of Origin: ${c.birthday}
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;

      // Edit button logic
      div.querySelector('.edit-btn').addEventListener('click', () => {
        editingContactId = c._id;
        contactForm.firstName.value = c.firstName;
        contactForm.lastName.value = c.lastName;
        contactForm.email.value = c.email;
        contactForm.favoriteColor.value = c.favoriteColor;
        contactForm.birthday.value = c.birthday;
        openModal();
      });

      // Delete button logic
      div.querySelector('.delete-btn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this contact?')) {
          const res = await fetch(`/contacts/${c._id}`, {
            method: 'DELETE'
          });

          if (res.ok) {
            location.reload();
          } else {
            alert('Failed to delete contact');
          }
        }
      });

      contactsContainer.appendChild(div);
    });
  });

  