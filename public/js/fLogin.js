const loginForm = document.getElementById('loginForm');

if (loginForm)
{
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value;
        const password = document.getElementById('password').value;

        if(!fullname || !password)
        {
            alert('Full name and Password must be filled out!');
            return;
        } else {
            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({fullname, password})
                });

                const data = await response.json();

                if(data?.success)
                {
                    console.log('Login Successful!');
                    window.location.href = '/profile';
                } else {
                    console.error('Login Failed!: ', data?.message);
                    alert(data?.message || 'Login Failed. Please Try Again.');
                }

            } catch (error) {
                console.error('Registration Request Failed', error);
                alert('Unable to Reach the Server. Please try again.');
            }
        }

    });
}