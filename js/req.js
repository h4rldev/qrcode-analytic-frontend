"use strict"

async function fetchFromApi() {
    try {
        const response = await fetch('/api', {
            method: "GET",
            headers: {
                "Request-Source": 'qrcode-analytic'
            }
        });
        const jsondata = await response.json();
        const status = response.status;
        return { status, jsondata };
    } catch (error) {
        console.error('Error:', error);
    }
}

async function init() {
    const data = await fetchFromApi();
    const jsondata = data.jsondata;
    const status = data.status;
    await populateMarkup(jsondata, status);
}

async function populateMarkup(data, status) {
    let header = document.getElementById('header');
    let lasttime = document.getElementById('lasttime');
    let visitor_count = document.getElementById('visitor');


    header.innerText = data.message;
    lasttime.innerText = `Last time of visit: ${data.last_time}`;


    if (status == 200) {
        let currenttime = document.getElementById(('yourtime'));
        visitor_count.innerText = `You're visitor no. ${data.counter}`;
        currenttime.innerText = `Your time of visit: ${data.time}`;
    } else {
        visitor_count.innerText = `Current visitor count: ${data.current_count}`;
    }
}

init();
