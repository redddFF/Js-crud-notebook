# Js-crud-notebook

## Overview

`Js-crud-notebook` is a simple web application for managing a list of contacts using JavaScript and `localStorage`. The app allows users to add, edit, delete, and view contact details. It also includes validation to prevent duplicate phone numbers when adding or updating contacts.

## Features

- **Add Contact**: Users can add new contacts with details such as Civilité (title), Prénom (first name), Nom (last name), and Téléphone (phone number).
- **Edit Contact**: Users can edit existing contact information.
- **Delete Contact**: Users can delete individual contacts or all contacts at once.
- **View Contact Details**: Users can view detailed information about each contact by clicking on them.
- **Sort Contacts**: Contacts are automatically sorted by Civilité, Nom, and Prénom.
- **Validation**: Prevents adding or updating a contact with a phone number that already exists in the contact list.

## How It Works

### Adding a Contact

1. Click the "Add Contact" button.
2. Fill out the form with the contact's Civilité, Prénom, Nom, and Téléphone.
3. Click "Enregistrer" to save the contact.
4. The app checks if the entered phone number already exists. If it does, an alert is shown, and the contact is not saved.

### Editing a Contact

1. Click on a contact in the list to view its details.
2. Click the "Editer" button.
3. Update the contact's information in the form.
4. Click "Enregistrer" to save the changes.
5. The app checks if the new phone number (if changed) already exists in other contacts. If it does, an alert is shown, and the contact is not updated.

### Deleting a Contact

1. Click on a contact in the list to view its details.
2. Click the "Supprimer" button to delete the contact.

### Deleting All Contacts

1. Click the "Delete All Contacts" button to remove all contacts from the list and `localStorage`.

### Viewing Contact Details

- Click on a contact in the list to view detailed information about that contact.

## LocalStorage Checks

- The app checks if `localStorage` is empty and displays a message if no contacts are found.
- When adding or updating a contact, the app checks for duplicate phone numbers to prevent conflicts.

## Code Snippet for Validation

Here’s a snippet showing how the app checks for duplicate phone numbers:

```javascript
function handleSubmit(event) {
    event.preventDefault();
    const phoneNumber = document.getElementsByName("Télephone")[0].value;
    const contacts = getContacts();

    // Check for duplicate phone number
    if (contacts.some(contact => contact.Télephone === phoneNumber)) {
        alert('Un contact avec ce numéro de téléphone existe déjà.');
        return;
    }

    const formData = {
        id: generateUUID(),
        Civilité: document.getElementById("Civilité").value,
        Prénom: document.getElementsByName("Prénom")[0].value,
        Nom: document.getElementsByName("Nom")[0].value,
        Télephone: phoneNumber
    };

    contacts.push(formData);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
    document.getElementById("formContainer").innerHTML = "";
}

function updateContact(contactId) {
    const phoneNumber = document.getElementsByName("Télephone")[0].value;
    const contacts = getContacts();

    // Check for duplicate phone number excluding the current contact
    if (contacts.some(contact => contact.id !== contactId && contact.Télephone === phoneNumber)) {
        alert('Un contact avec ce numéro de téléphone existe déjà.');
        return;
    }

    const updatedContacts = contacts.map(function (contact) {
        if (contact.id === contactId) {
            contact.Civilité = document.getElementById("Civilité").value;
            contact.Prénom = document.getElementsByName("Prénom")[0].value;
            contact.Nom = document.getElementsByName("Nom")[0].value;
            contact.Télephone = phoneNumber;
        }
        return contact;
    });

    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    displayContacts();
    const contactInfoContainer = document.getElementById('formContainer');
    contactInfoContainer.innerHTML = "";
    checkLocalStorage();
}
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/redddFF/Js-crud-notebook
   ```
2. Open `index.html` in your web browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

