
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        
        if (data.role === 'admin') {
            showAdminSection();
        } else {
            showUserSection();
        }
    } else {
        document.getElementById('login-error').innerText = data.message;
    }
});


document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value; // Get the role from the form

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role }) 
    });

    const data = await response.json();

    if (response.ok) {
        
        document.getElementById('login-username').value = username;
        document.getElementById('login-password').value = password;
        document.getElementById('login-form').dispatchEvent(new Event('submit'));
    } else {
        document.getElementById('register-error').innerText = data.message;
    }
});



document.getElementById('show-register').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
});

async function showAdminSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    await loadCars();
}

async function showUserSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-section').style.display = 'block';
    await loadCars();
}

async function loadCars() {
    try {
        const response = await fetch('/api/cars', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        const cars = data.cars; 

        if (!Array.isArray(cars)) {
            throw new Error('Expected "cars" to be an array.');
        }

        if (localStorage.getItem('role') === 'admin') {
            const carList = document.getElementById('cars');
            carList.innerHTML = '';

            cars.forEach(car => {
                const li = document.createElement('li');
                li.textContent = `${car.name} (${car.manufacturingYear}) - $${car.price}`;
                carList.appendChild(li);
            });

            document.getElementById('total-cars').innerText = data.totalCars; // Use totalCars from the response
        } else {
            const userCarList = document.getElementById('user-cars');
            userCarList.innerHTML = '';

            cars.forEach(car => {
                const li = document.createElement('li');
                li.textContent = `${car.name} (${car.manufacturingYear}) - $${car.price}`;
                userCarList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}


document.getElementById('car-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('car-name').value;
    const manufacturingYear = document.getElementById('car-year').value;
    const price = document.getElementById('car-price').value;

    const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, manufacturingYear, price })
    });

    if (response.ok) {
        document.getElementById('car-name').value = '';
        document.getElementById('car-year').value = '';
        document.getElementById('car-price').value = '';

        await loadCars();
    } else {
        alert('Failed to add car. Please try again.');
    }
});
