$(document).ready(function () {
    const spanContact = $('#spanContact');

    function checkLocalStorage() {
        if (Object.keys(localStorage).length === 0) {
            console.log('localStorage is empty');
            spanContact.html(`<span>Aucun élément enregistré</span>`);
        } else {
            console.log('localStorage is not empty');
            spanContact.hide();
        }
    }

    function displayContacts() {
        const contactDiv = $('#contact');
        contactDiv.empty();
        const contacts = getContacts();
        contacts.forEach(function (contact) {
            contactDiv.append(createContactElement(contact));
        });
    }

    function getContacts() {
        return JSON.parse(localStorage.getItem('contacts')) || [];
    }

    function createContactElement(contact) {
        const contactElement = $('<div></div>').addClass('singleContact');
        contactElement.html(`<p>${contact.Prénom} ${contact.Nom}</p>`);
        
        // Add click event listener
        contactElement.on('click', function () {
            displayContactInfo(contact);
        });
        
        checkLocalStorage();
        return contactElement;
    }

    function displayContactInfo(contact) {
        const contactInfoContainer = $('#formContainer');
        contactInfoContainer.html(`
            <p><strong>Civilité:</strong> ${contact.Civilité}</p>
            <p><strong>Prénom:</strong> ${contact.Prénom}</p>
            <p><strong>Nom:</strong> ${contact.Nom}</p>
            <p><strong>Téléphone:</strong> ${contact.Télephone}</p>
            <button id="deleteButton" class="button-36" role="button" style="background-color: #BB3113;" data-id="${contact.id}">Supprimer</button><br>
            <button id="editButton" class="button-36" role="button" style="background-color: yellow;" data-id="${contact.id}">Editer</button>
        `);

        $('#deleteButton').on('click', function () {
            const contactId = $(this).data('id');
            deleteContact(contactId);
        });

        $('#editButton').on('click', function () {
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
        $('#formContainer').html("");
    }

    function handleSubmit(event) {
        event.preventDefault();
        const formData = {
            id: generateUUID(),
            Civilité: $("#Civilité").val(),
            Prénom: $("input[name='Prénom']").val(),
            Nom: $("input[name='Nom']").val(),
            Télephone: $("input[name='Télephone']").val()
        };

        const contacts = getContacts();
        contacts.push(formData);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        displayContacts();
        $('#formContainer').html("");
    }

    function updateContactForm(contact) {
        const formContainer = $('#formContainer');
        const form = `
            <form class="form-style-9">
                <ul>
                    <li>
                        <label for="Civilité">Civilité</label><br>
                        <select id="Civilité" name="Civilité" class="field-style field-full align-none">
                            <option value=""></option>
                            <option value="Homme" ${contact.Civilité === "Homme" ? "selected" : ""}>Homme</option>
                            <option value="Femme" ${contact.Civilité === "Femme" ? "selected" : ""}>Femme</option>
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
    
        formContainer.html(form);
        $('#quitButton').on("click", function () {
            formContainer.html("");
        });
        $('#updateButton').on("click", function (event) {
            event.preventDefault();
            updateContact(contact.id);
        });
    }

    function updateContact(contactId) {
        const contacts = getContacts();
        const updatedContacts = contacts.map(function (contact) {
            if (contact.id === contactId) {
                contact.Civilité = $('#Civilité').val();
                contact.Prénom = $("input[name='Prénom']").val();
                contact.Nom = $("input[name='Nom']").val();
                contact.Télephone = $("input[name='Télephone']").val();
            }
            return contact;
        });
        localStorage.setItem('contacts', JSON.stringify(updatedContacts));
        displayContacts();
        $('#formContainer').html("");
        checkLocalStorage();
    }

    function generateUUID() {
        const randomNumber = Math.floor(Math.random() * 10000);
        const timestamp = new Date().getTime();
        return 'ID_' + timestamp + '_' + randomNumber;
    }

    function createContactForm() {
        const formContainer = $('#formContainer');
        const form = `
        <form class="form-style-9">
            <ul>
                <li>
                    <label for="Civilité">Civilité</label><br>
                    <select id="Civilité" name="Civilité" class="field-style field-full align-none">
                        <option value=""></option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
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
                    <label for="Télephone">Téléphone</label><br>
                    <input type="number" name="Télephone" class="field-style field-full align-none" placeholder="+216 222 222 222" />
                </li>
                <li>
                    <input type="submit" value="Enregistrer" id="saveButton" />
                    <input type="button" id="quitButton" value="Quitter" />
                </li>
            </ul>
        </form>
        `;

        formContainer.html(form);
        $('#quitButton').on("click", function () {
            formContainer.html("");
        });
        $('#saveButton').on("click", handleSubmit);
    }

    $('#addButton').on("click", function () {
        createContactForm();
    });

    displayContacts();
    checkLocalStorage();
});
