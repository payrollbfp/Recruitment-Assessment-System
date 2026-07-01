/* =====================================================
   Recruitment Assessment System
   File : candidate_login.js
===================================================== */

document.addEventListener("DOMContentLoaded", init);

let currentEvent = null;

async function init() {

    const token = getToken();

    if (!token) {

        showError("Link assessment tidak valid.");

        disableForm();

        return;

    }

    currentEvent = await getEventByToken(token);

    if (!currentEvent) {

        showError("Assessment tidak ditemukan.");

        disableForm();

        return;

    }

    document.getElementById("companyName").textContent =
        currentEvent.company_name || "Recruitment Assessment";

    document.getElementById("eventName").textContent =
        currentEvent.event_name;

    document.getElementById("eventPeriod").textContent =
        formatDate(currentEvent.start_date) +
        " - " +
        formatDate(currentEvent.end_date);

    document
        .getElementById("loginForm")
        .addEventListener("submit", loginCandidate);

}

async function loginCandidate(e) {

    e.preventDefault();

    const phone = document
        .getElementById("phone")
        .value
        .trim();

    if (phone === "") {

        showError("Nomor HP harus diisi.");

        return;

    }

    const button = document.getElementById("btnLogin");

    setButtonLoading(button);

    try {

        const candidate = await getCandidate(
            phone,
            currentEvent.id
        );

        if (candidate) {

            SESSION.save({

                candidate_id: candidate.id,

                candidate_code: candidate.candidate_code,

                event_id: currentEvent.id,

                phone: phone

            });

            window.location.href =
                "dashboard.html?token=" +
                getToken();

        } else {

            sessionStorage.setItem(
                "new_phone",
                phone
            );

            window.location.href =
                "biodata.html?token=" +
                getToken();

        }

    } catch (err) {

        console.error(err);

        showError("Terjadi kesalahan.");

        resetButton(button);

    }

}

function showError(text) {

    document.getElementById("message").innerHTML = text;

}

function disableForm() {

    document.getElementById("phone").disabled = true;

    document.getElementById("btnLogin").disabled = true;

}
