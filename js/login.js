"use strict";

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function can_login() {
    try {
        const response = await fetch('/api/can_i_login', {
            method: "GET",
            headers: {
                "Request-Source": 'qrcode-analytic',
                'Content-Type': 'application/json',
            }
        });

        const jsondata = await response.json();
        const status = response.status;

        if (response.status == 200) {
            await populateMarkup(jsondata, status);
            await sleep(1000);
            window.location.href = jsondata.route;
        } else {
            console.log(`Failed to autologin: \n${jsondata.title} | ${jsondata.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function flushMarkup() {
    let title_good = document.getElementById('title_good');
    let message_good = document.getElementById('message_good');
    let title_bad = document.getElementById('title_bad');
    let message_bad = document.getElementById('message_bad');

    title_good.innerText = "";
    title_bad.innerText = "";
    message_good.innerText = "";
    message_bad.innerText = "";
}


async function populateMarkup(data, status) {
    let title;
    let message;

    await flushMarkup();

    if (status == 200) {
        title = document.getElementById('title_good');
        message = document.getElementById('message_good');
    } else {
        title = document.getElementById('title_bad');
        message = document.getElementById('message_bad');
    }

    title.innerText = data.title;
    message.innerText = data.message;
}

async function hook() {
    document.getElementById('login').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        let formData = new FormData(this); // Get the form data
        let jsonData = {}; // Object to hold the JSON data

        // Convert FormData to JSON
        formData.forEach(function(value, key) {
            jsonData[key] = value;
        });

        // Send the JSON data as a POST request
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Request-Source": 'qrcode-analytic'
                },
                body: JSON.stringify(jsonData)
            });

            let data = await response.json();
            let status = response.status

            await populateMarkup(data, status);

            if (status == 200) {
                await sleep(1000);
                window.location.href = data.route;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

}


async function init() {
    await hook();
    await can_login();
}

init();

