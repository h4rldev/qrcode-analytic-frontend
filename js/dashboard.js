const monday = document.getElementById('monday');

async function get_data() {
    try {
        const response = await fetch('/api/get_data', {
            method: "GET",
            headers: {
                "Request-Source": 'qrcode-analytic',
                'Content-Type': 'application/json',
            }
        });

        const jsondata = await response.json();
        const status = response.status;
        return { jsondata, status };
    } catch (error) {
        console.error('Error:', error);
    }
}

async function get_datasets(data, status) {
    const arr = data.state;
    let days = [];
    let counts = [];

    if (status != 200) {
        console.error(`Error: ${data.title} | ${data.message}`);
        return 1;
    }

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].dotw !== "Sat") {
            if (arr[i].dotw !== "Sun") {
                days.push(`${arr[i].dotw} - ${arr[i].date}`);
                counts.push(arr[i].counter);
            }
        }
    }

    return { days, counts };
}

async function get_datasets_of_latest_month(data, status) {
    let now = new Date();
    const month_len = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    let datasets = await get_datasets(data, status);

    let counts = [];
    let days = [];

    let data_counts = datasets.counts;
    let data_days = datasets.days;

    const lastmonth_counts = data_counts.slice(-month_len);
    const lastmonth_days = data_days.slice(-month_len);

    for (let i = 0; i < month_len; i++) {
        counts.push(lastmonth_counts[i]);
        days.push(lastmonth_days[i]);
    }

    return { days, counts };
}

async function get_datasets_of_today(data, status) {
    const datasets = await get_datasets(data, status);

    const count = datasets.counts.at(-1);
    const day = datasets.days.at(-1);

    return { day, count };
}

async function get_datasets_of_latest_workweek(data, status) {
    const datasets = await get_datasets(data, status);

    let counts = [];
    let days = [];

    let data_counts = datasets.counts;
    let data_days = datasets.days;

    const last5_counts = data_counts.slice(-5);
    const last5_days = data_days.slice(-5);

    for (let i = 0; i < 5; i++) {
        counts.push(last5_counts[i]);
        days.push(last5_days[i]);
    }

    return { days, counts };
}

async function get_datasets_of_last_quarter(data, status) {
    const datasets = await get_datasets(data, status);

    // Create a new Date object for the current date
    let now = new Date();

    // Calculate the start date of the last 3 months
    now.setMonth(now.getMonth() - 3);

    // Calculate the end date of the last 3 months
    let end_date = new Date(now);
    end_date.setMonth(end_date.getMonth() + 2); // Set to the end of the last 3 months

    // Calculate the difference in milliseconds
    let lastquarter_millis = end_date.getTime() - now.getTime();

    // Convert milliseconds to days
    let lastquarter_len = Math.floor(lastquarter_millis / (1000 * 60 * 60 * 24));

    let counts = [];
    let days = [];

    let data_counts = datasets.counts;
    let data_days = datasets.days;

    const lastquarter_counts = data_counts.slice(-lastquarter_len);
    const lastquarter_days = data_days.slice(-lastquarter_len);

    for (let i = 0; i < lastquarter_len; i++) {
        counts.push(lastquarter_counts[i]);
        days.push(lastquarter_days[i]);
    }
    return { days, counts };
}

async function get_datasets_of_last_half_year(data, status) {
    const datasets = await get_datasets(data, status);

    // Create a new Date object for the current date
    let now = new Date();

    // Calculate the start date of the last 3 months
    now.setMonth(now.getMonth() - 6);

    // Calculate the end date of the last 3 months
    let end_date = new Date(now);
    end_date.setMonth(end_date.getMonth() + 5); // Set to the end of the last 3 months

    // Calculate the difference in milliseconds
    let last_halfyear_millis = end_date.getTime() - now.getTime();

    // Convert milliseconds to days
    let last_halfyear_len = Math.floor(last_halfyear_millis / (1000 * 60 * 60 * 24));

    let counts = [];
    let days = [];

    let data_counts = datasets.counts;
    let data_days = datasets.days;

    const last_halfyear_counts = data_counts.slice(-last_halfyear_len);
    const last_halfyear_days = data_days.slice(-last_halfyear_len);

    for (let i = 0; i < last_halfyear_len; i++) {
        counts.push(last_halfyear_counts[i]);
        days.push(last_halfyear_days[i]);
    }
    return { days, counts };
}


async function init() {
    const data = await get_data();
    const status = data.status;
    const json = data.jsondata;

    const data_sets_today = await get_datasets_of_today(json, status);
    const data_sets_week = await get_datasets_of_latest_workweek(json, status);
    const data_sets_month = await get_datasets_of_latest_month(json, status);
    const data_sets_quarter = await get_datasets_of_last_quarter(json, status);
    const data_sets_halfyear = await get_datasets_of_last_half_year(json, status);
    const data_sets_all = await get_datasets(json, status);

    new Chart(today, {
        type: 'bar',
        data: {
            labels: [data_sets_today.day],
            datasets: [{
                label: 'Visits',
                data: [data_sets_today.count],
                borderWidth: 1,
                backgroundColor: '#ef476f'
            }]
        },
    })

    new Chart(week, {
        type: 'line',
        data: {
            labels: data_sets_week.days,
            datasets: [{
                label: 'Visits',
                data: data_sets_week.counts,
                borderWidth: 4,
                borderColor: '#f78c6b',
            }]
        },
    });

    new Chart(month, {
        type: 'line',
        data: {
            labels: data_sets_month.days,
            datasets: [{
                label: 'Visits',
                data: data_sets_month.counts,
                borderWidth: 4,
                borderColor: '#ffd166',
            }]
        },
    });

    new Chart(quarter, {
        type: 'line',
        data: {
            labels: data_sets_quarter.days,
            datasets: [{
                label: 'Visits',
                data: data_sets_quarter.counts,
                borderWidth: 4,
                borderColor: '#06d6a0',
            }]
        },
    });

    new Chart(halfyear, {
        type: 'line',
        data: {
            labels: data_sets_halfyear.days,
            datasets: [{
                label: 'Visits',
                data: data_sets_halfyear.counts,
                borderWidth: 4,
                borderColor: '#118ab2',
            }]
        },
    });


    new Chart(all, {
        type: 'line',
        data: {
            labels: data_sets_all.days,
            datasets: [{
                label: 'Visits',
                data: data_sets_all.counts,
                borderWidth: 4,
                borderColor: '#073b4c',
            }]
        },
    });
}

init();
