const registerForm = document.getElementById('registerForm');

if (registerForm)
{
    registerForm.addEventListener('submit', async (e) =>
    {
        e.preventDefault();

        const fullName = document.getElementById('full_name').value;
        const password = document.getElementById('password').value;
        const confPassword = document.getElementById('conf-password').value;
        if(!fullName || !password || !confPassword)
        {
            alert('Please enter all inputs: Full Name, Password, and confirm Password');
            return;
        }
        else if(password !== confPassword)
        {
            alert('Passwords do not match!');
            return;
        }else
        {
            try{
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({fullName, password})
                });

                console.log(fullName + password);

                const data = await response.json();

                if(data?.success) {
                    console.log('Registration Successful!');
                    window.location.href = '/';
                }else{
                    console.error('Registration Failed!: ', data?.message);
                    alert(data?.message || 'Registration failed. Please try again.');
                }
            }catch(error)
            {
                console.error('Registration Request Failed', error);
                alert('Unable to Reach the Server. Please try again.');
            }
        }
    });
}