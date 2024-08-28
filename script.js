'use strict'

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnOpenModal = document.querySelector('.btn--open-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');

const openModal = function() {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}
const closeModal = function() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

const apiUrl = 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en';

async function fetchRandomFact() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error('Network Error');
        }
        const data = await response.json();

        console.log(data.text);

        document.querySelector('.fact').innerText = data.text;
        openModal();
        
    } catch (error) {
        console.error('Error fetching the fact: ', error);
    }
}

btnOpenModal.addEventListener('click', fetchRandomFact);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// HANDLE CONTACT FORM:

const form = document.getElementById('form');
const btnSubmit = form.querySelector('.btn--submit');

const formEvent = form.addEventListener('submit', (event) => {
    event.preventDefault();

    btnSubmit.setAttribute('value', 'Submitting...'); 

    let mail = new FormData(form);

    fetch('/send', {
        method: 'POST',
        body: mail,
    })
    .then(response => response.json())
    .then(data => {
        if (data.message == 'Email successfully sent!') {
            btnSubmit.setAttribute('value', data.message);
            btnSubmit.classList.add('nohover');
            btnSubmit.disabled = true;
            form.reset();
        } else {
            btnSubmit.setAttribute('value', data.message);
        }
    })
    .catch(error => {
        console.error(`Error: ${error}`);
        btnSubmit.setAttribute('value', data.message);
    });
});

const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let  id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a [href*=' + id + ']').classList.add('active');
            })
        }
    })
}
menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

