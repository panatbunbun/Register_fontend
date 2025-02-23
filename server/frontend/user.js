const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log('loaded');
    const response = await axios.get(`${BASE_URL}/user`);
    console.log(response.data);

    const userDataBody = document.getElementById('userDataBody');
    userDataBody.innerHTML = ''; // Clear previous data

    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i];

        let newRow = document.createElement('tr');

        let idCell = document.createElement('td');
        idCell.textContent = user.id;
        newRow.appendChild(idCell);

        let firstNameCell = document.createElement('td');
        firstNameCell.textContent = user.Firstname;
        newRow.appendChild(firstNameCell);

        let lastNameCell = document.createElement('td');
        lastNameCell.textContent = user.Lastname;
        newRow.appendChild(lastNameCell);

        let ageCell = document.createElement('td');
        ageCell.textContent = user.age;
        newRow.appendChild(ageCell);

        let genderCell = document.createElement('td');
        genderCell.textContent = user.gender;
        newRow.appendChild(genderCell);

        let congenitaldisorderCell = document.createElement('td');
        congenitaldisorderCell.textContent = user.congenitaldisorder;
        newRow.appendChild(congenitaldisorderCell);

        let doctorappointmentCell = document.createElement('td');
        doctorappointmentCell.textContent = user.doctorappointment;
        newRow.appendChild(doctorappointmentCell);

        let actionCell = document.createElement('td');
        let editButton = document.createElement('button');

        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            window.location.href = `registers.html?id=${user.id}`;
        });
        actionCell.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
            try {
                await axios.delete(`${BASE_URL}/user/${user.id}`);
                loadData(); // Reload data after deletion
            } catch (error) {
                console.log(error);
            }
        });
        actionCell.appendChild(deleteButton);

        newRow.appendChild(actionCell);

        userDataBody.appendChild(newRow);
    }
};

