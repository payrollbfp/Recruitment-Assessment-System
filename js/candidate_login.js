/* ============================================
   Recruitment Assessment System
   candidate_login.js
============================================ */

document.addEventListener("DOMContentLoaded", init);

let currentEvent = null;

async function init() {

    const token = getToken();

    if (!token) {

        showMessage("Link assessment tidak valid.");

        disableLogin();

        return;

    }

    currentEvent = await loadEvent(token);

    if (!currentEvent) {

        showMessage("Assessment tidak ditemukan.");

        disableLogin();

        return;

    }

    document.getElementById("eventName").innerText =
        currentEvent.event_name;

    document.getElementById("eventPeriod").innerText =
        "Status : " + currentEvent.status;

    document
        .getElementById("loginForm")
        .addEventListener("submit", login);

}

async function loadEvent(token){

    const { data, error } = await supabaseClient

        .from("recruitment_events")

        .select("*")

        .eq("token", token)

        .eq("status","Aktif")

        .single();

    if(error){

        console.error(error);

        return null;

    }

    return data;

}

async function login(e){

    e.preventDefault();

    const phone =
        document
        .getElementById("phone")
        .value
        .trim();

    if(phone==""){

        showMessage("Nomor HP harus diisi.");

        return;

    }

    const btn =
        document.getElementById("btnLogin");

    setButtonLoading(btn);

    const { data, error } = await supabaseClient

        .from("candidates")

        .select("*")

        .eq("event_id",currentEvent.id)

        .eq("phone",phone)

        .maybeSingle();

    resetButton(btn);

    if(error){

        console.error(error);

        showMessage("Terjadi kesalahan.");

        return;

    }

    if(data){

        SESSION.save({

            id:data.id,

            candidate_code:data.candidate_code,

            event_id:data.event_id,

            phone:data.phone

        });

        window.location.href =
        "dashboard.html?token=" +
        getToken();

    }else{

        sessionStorage.setItem(
            "phone",
            phone
        );

        sessionStorage.setItem(
            "event_id",
            currentEvent.id
        );

        window.location.href =
        "biodata.html?token=" +
        getToken();

    }

}

function showMessage(text){

    document.getElementById("message")
    .innerHTML = text;

}

function disableLogin(){

    document
        .getElementById("phone")
        .disabled=true;

    document
        .getElementById("btnLogin")
        .disabled=true;

}
