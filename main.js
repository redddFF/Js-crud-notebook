document.addEventListener("DOMContentLoaded", function () {
    const spanContact = document.getElementById('spanContact');

    function checkLocalStorage() {
        if (Object.keys(localStorage).length === 0) {
            console.log('localStorage is empty');
            spanContact.innerHTML = `<span>Aucun élément enregistré</span>`;
        } else {
            console.log('localStorage is not empty');
            spanContact.style.display = 'none';
        }
    }

    function displayContacts() {
        const contactDiv = document.getElementById('contact');
        contactDiv.innerHTML = "";
        let contacts = getContacts();

        contacts.sort((a, b) => {
            const civiliteOrder = { "Mademoiselle": 1, "Madame": 2, "Monsieur": 3 };
            if (civiliteOrder[a.Civilité] < civiliteOrder[b.Civilité]) {
                return -1;
            }
            if (civiliteOrder[a.Civilité] > civiliteOrder[b.Civilité]) {
                return 1;
            }

            if (a.Nom < b.Nom) {
                return -1;
            }
            if (a.Nom > b.Nom) {
                return 1;
            }

            if (a.Prénom < b.Prénom) {
                return -1;
            }
            if (a.Prénom > b.Prénom) {
                return 1;
            }

            return 0;
        });

        contacts.forEach(function (contact) {
            contactDiv.appendChild(createContactElement(contact));
        });
    }

    function getContacts() {
        return JSON.parse(localStorage.getItem('contacts')) || [];
    }

    function createContactElement(contact) {
        const contactElement = document.createElement('div');
        contactElement.classList.add('singleContact');
        contactElement.innerHTML = `<p>${contact.Prénom} ${contact.Nom}</p>`;

        // Add click event listener
        contactElement.addEventListener('click', function () {
            displayContactInfo(contact);
        });

        checkLocalStorage();
        return contactElement;
    }

    function displayContactInfo(contact) {
        const contactInfoContainer = document.getElementById('formContainer');
        contactInfoContainer.innerHTML = `
            <p><strong>Civilité:</strong> ${contact.Civilité}</p>
            <p><strong>Prénom:</strong> ${contact.Prénom}</p>
            <p><strong>Nom:</strong> ${contact.Nom}</p>
            <p><strong>Téléphone:</strong> ${contact.Télephone}</p>
            <button id="deleteButton" class="button-36" role="button" style="background-color: #BB3113;" data-id="${contact.id}">Supprimer</button><br>
            <button id="editButton" class="button-36" role="button" style="background-color: yellow;" data-id="${contact.id}">Editer</button>
        `;

        const deleteButton = document.getElementById('deleteButton');
        deleteButton.addEventListener('click', function () {
            const contactId = deleteButton.getAttribute('data-id');
            deleteContact(contactId);
        });

        const editButton = document.getElementById('editButton');
        editButton.addEventListener('click', function () {
            updateContactForm(contact);
        });
    }

    function deleteContact(contactId) {
        const contacts = getContacts();
        const updatedContacts = contacts.filter(function (contact) {
            return contact.id !== contactId;
        });
        localStorage.setItem('contacts', JSON.stringify(updatedContacts));
        displayContacts();
        checkLocalStorage();
        const contactInfoContainer = document.getElementById('formContainer');
        contactInfoContainer.innerHTML = "";
    }

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

    function updateContactForm(contact) {
        const formContainer = document.getElementById("formContainer");
        const form = `
            <form class="form-style-9">
                <ul>
                    <li>
                        <label for="Civilité">Civilité</label><br>
                        <select id="Civilité" name="Civilité" class="field-style field-full align-none">
                            <option value="" default></option>
                            <option value="Madame" ${contact.Civilité === "Madame" ? "selected" : ""}>Madame</option>
                            <option value="Mademoiselle" ${contact.Civilité === "Mademoiselle" ? "selected" : ""}>Mademoiselle</option>
                            <option value="Monsieur" ${contact.Civilité === "Monsieur" ? "selected" : ""}>Monsieur</option>
                        </select>
                    </li>
                    <li>
                        <label for="Prénom">Prénom</label><br>
                        <input type="text" name="Prénom" class="field-style field-full align-none" placeholder="Prénom" value="${contact.Prénom}" />
                    </li>
                    <li>
                        <label for="Nom">Nom</label><br>
                        <input type="text" name="Nom" class="field-style field-full align-none" placeholder="Nom" value="${contact.Nom}" />
                    </li>
                    <li>
                        <label for="Télephone">Téléphone</label><br>
                        <input type="number" name="Télephone" class="field-style field-full align-none" placeholder="+216 222 222 222" value="${contact.Télephone}" />
                    </li>
                    <li>
                        <input type="submit" value="Enregistrer" id="updateButton" />
                        <input type="button" id="quitButton" value="Quitter" />
                    </li>
                </ul>
            </form>
        `;

        formContainer.innerHTML = form;
        document.getElementById("quitButton").addEventListener("click", function () {
            formContainer.innerHTML = "";
        });
        document.getElementById("updateButton").addEventListener("click", function (event) {
            event.preventDefault();
            updateContact(contact.id);
        });
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

    function generateUUID() {
        const randomNumber = Math.floor(Math.random() * 10000);
        const timestamp = new Date().getTime();
        return 'ID_' + timestamp + '_' + randomNumber;
    }

    function createContactForm() {
        const formContainer = document.getElementById("formContainer");
        const form = `
        <form class="form-style-9">
            <ul>
                <li>
                    <label for="Civilité">Civilité</label><br>
                    <select id="Civilité" name="Civilité" class="field-style field-full align-none">
                        <option value="" default></option>
                        <option value="Madame">Madame</option>
                        <option value="Mademoiselle">Mademoiselle</option>
                        <option value="Monsieur">Monsieur</option>
                    </select>
                </li>
                <li>
                    <label for="Prénom">Prénom</label><br>
                    <input type="text" name="Prénom" class="field-style field-full align-none" placeholder="Prénom" />
                </li>
                <li>
                    <label for="Nom">Nom</label><br>
                    <input type="text" name="Nom" class="field-style field-full align-none" placeholder="Nom" />
                </li>
                <li>
                    <label for="Télephone">Télephone</label><br>
                    <input type="number" name="Télephone" class="field-style field-full align-none" placeholder="+216 222 222 222" />
                </li>
                <li>
                    <input type="submit" value="Enregistrer" id="saveButton" />
                    <input type="button" id="quitButton" value="Quitter" />
                </li>
            </ul>
        </form>
        `;

        formContainer.innerHTML = form;
        document.getElementById("quitButton").addEventListener("click", function () {
            formContainer.innerHTML = "";
        });
        document.getElementById("saveButton").addEventListener("click", handleSubmit);
    }

    function deleteContacts() {
        localStorage.removeItem('contacts');
        displayContacts();
        checkLocalStorage();
        const contactInfoContainer = document.getElementById('formContainer');
        contactInfoContainer.innerHTML = "";
    }

    document.getElementById("addButton").addEventListener("click", function () {
        createContactForm();
    });
    document.getElementById("deleteButton").addEventListener("click", function () {
        deleteContacts();
    });
});
