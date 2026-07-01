/* =====================================================
   Recruitment Assessment System
   File : config.js
   ===================================================== */

// ===============================
// SUPABASE
// ===============================

const SUPABASE_URL = "https://nwrbjbwjmkahjuuyizfq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cmJqYndqbWthaGp1dXlpemZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjM4OTIsImV4cCI6MjA5MjQ5OTg5Mn0.n67pONlkoMqZguyoTwQQFJ0VBRfPaIVuVlPGxsajaGA";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ===============================
// SESSION
// ===============================

const SESSION = {

    save(candidate){

        sessionStorage.setItem(
            "candidate",
            JSON.stringify(candidate)
        );

    },

    get(){

        const data = sessionStorage.getItem("candidate");

        return data ? JSON.parse(data) : null;

    },

    clear(){

        sessionStorage.removeItem("candidate");

    }

};

// ===============================
// URL PARAMETER
// ===============================

function getToken(){

    const params = new URLSearchParams(window.location.search);

    return params.get("token");

}

// ===============================
// EVENT
// ===============================

async function getEventByToken(token){

    const { data, error } = await supabaseClient

        .from("recruitment_events")

        .select("*")

        .eq("token", token)

        .single();

    if(error){

        return null;

    }

    return data;

}

// ===============================
// CANDIDATE
// ===============================

async function getCandidate(phone,eventId){

    const { data, error } = await supabaseClient

        .from("candidates")

        .select("*")

        .eq("phone",phone)

        .eq("event_id",eventId)

        .maybeSingle();

    if(error){

        console.log(error);

        return null;

    }

    return data;

}

// ===============================
// FORMAT DATE
// ===============================

function formatDate(date){

    return new Date(date).toLocaleDateString("id-ID",{

        day:"2-digit",

        month:"long",

        year:"numeric"

    });

}

// ===============================
// LOADING BUTTON
// ===============================

function setButtonLoading(button,text="Mohon Tunggu..."){

    button.disabled = true;

    button.dataset.original = button.innerHTML;

    button.innerHTML = text;

}

function resetButton(button){

    button.disabled = false;

    button.innerHTML = button.dataset.original;

}

// ===============================
// ALERT
// ===============================

function showMessage(message){

    alert(message);

}
