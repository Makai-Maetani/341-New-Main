const modal = document.getElementById('contactModal');
const addContactBtn = document.querySelector('.add-contact-btn');
const closeModalBtn = document.querySelector('.close-button');
const contactForm = document.getElementById('contactForm');
const contactsContainer = document.getElementById('contacts');

let editingContactId = null;

// Show modal
function openModal(isEditing = false) {
  modal.classList.remove('hidden');
  document.getElementById('modalTitle').textContent = 
    isEditing ? 'Edit Recipe' : 'Add New Recipe';
}


// Show alert on login failure/success
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
  openModal(false);
});

// Handle Close button
closeModalBtn.addEventListener('click', closeModal);

// Submit form
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const data = {
    dishName: formData.get('dishName'),
    chefName: formData.get('chefName'),
    calories: formData.get('calories'),
    bakingTime: formData.get('bakingTime'),
    countryOfOrigin: formData.get('countryOfOrigin'),
    ingredients: formData.get('ingredients'),
    instructions: formData.get('instructions')
  };

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
    alert('Failed to save recipe');
  }
});

// Show expanded recipe view
function showExpandedRecipe(recipe) {
  const expandedView = document.createElement('div');
  expandedView.className = 'recipe-expanded';
 expandedView.innerHTML = `
  <div class="recipe-expanded-content">
    <button class="close-expanded">&times;</button>
    <h2>${recipe.chefName}</h2>
    
    <div class="recipe-meta">
      <div><strong>Baking Time:</strong> ${recipe.bakingTime}</div>
      <div><strong>Country of Origin:</strong> ${recipe.countryOfOrigin}</div>
    </div>
    
    <h3>Ingredients</h3>
    <ul>
      ${recipe.ingredients.split(',').map(ing => `<li>${ing.trim()}</li>`).join('')}
    </ul>
    
    <h3>Instructions</h3>
    <div class="recipe-instructions">${recipe.instructions}</div>
  </div>
`;

  // Close button
  expandedView.querySelector('.close-expanded').addEventListener('click', () => {
    document.body.removeChild(expandedView);
  });

  // Close when clicking outside content
  expandedView.addEventListener('click', (e) => {
    if (e.target === expandedView) {
      document.body.removeChild(expandedView);
    }
  });

  document.body.appendChild(expandedView);
}

// Load recipes and create recipe cards
fetch('/api/contacts')
  .then(res => res.json())
  .then(data => {
    contactsContainer.innerHTML = '';

    data.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <h3>${recipe.dishName || 'Untitled Recipe'}</h3>
        <div class="chef-byline">made by ${recipe.chefName || 'Unknown Chef'}</div>
        <div class="recipe-meta">
          <span><strong>Baking Time:</strong> ${recipe.bakingTime || 'Not specified'}</span>
          <span class="calories">${recipe.calories || '?'} calories</span>
          <span><strong>Origin:</strong> ${recipe.countryOfOrigin || 'Unknown'}</span>
        </div>
        <div class="recipe-actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;

      // Click to expand
      card.addEventListener('click', (e) => {
        // Don't expand if clicking on edit/delete buttons
        if (e.target.classList.contains('edit-btn') || 
            e.target.classList.contains('delete-btn')) return;
        
        showExpandedRecipe(recipe);
      });

      // Edit button logic
      card.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        editingContactId = recipe._id;
        
       
        contactForm.dishName.value = recipe.dishName || '';
        contactForm.chefName.value = recipe.chefName || '';
        contactForm.calories.value = recipe.calories || '';
        contactForm.bakingTime.value = recipe.bakingTime || '';
        contactForm.countryOfOrigin.value = recipe.countryOfOrigin || '';
        contactForm.ingredients.value = recipe.ingredients || '';
        contactForm.instructions.value = recipe.instructions || '';
        
        openModal(true);
      });

      // Delete button logic
      card.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this recipe?')) {
          const res = await fetch(`/contacts/${recipe._id}`, {
            method: 'DELETE'
          });

          if (res.ok) {
            location.reload();
          } else {
            alert('Failed to delete recipe');
          }
        }
      });

      contactsContainer.appendChild(card);
    });
  });