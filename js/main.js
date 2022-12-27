const isLetter = (str) => str.length === 1 && str.match(/[a-zA-Z]/i);

const removeAcents = (value) => {
    if (!value) {
        return "";
    }

    return value
        .replace(/\s/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

function cripto() {
    const inputKey = document.getElementById("chave"),
        inputText = document.getElementById("texto"),
        labelOutput = document.getElementById("output")

    let key = removeAcents(inputKey.value.toUpperCase().substr(0, 10)),
        text = removeAcents(inputText.value),
        keyMod = "",
        num = "",
        word = "",
        ret = "@",
        sum = 0;

    labelOutput.value = "";

    if (!key || !text) {
        return;
    }

    for (const index of key) {
        keyMod = index + keyMod;
    }

    for (const index of text) {
        if (isLetter(index)) {
            word += index;
        } else {
            if (num.length < 5) {
                num += index;
            }
        }
    }

    for (var i = 0; i < word.length; i++) {
        sum += word.toLowerCase().charCodeAt(i) - 97;
    }

    for (const index of sum.toString()) {
        ret += String.fromCharCode(parseInt(index) + 97);
        ret += index;
    }

    ret += keyMod + num + "$";

    labelOutput.value = ret;
}

function showPassword(show) {
    const input = document.getElementById("chave");

    if (show) {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

const setKey = () => {
    let key = document.getElementById("chave").value,
        msg = "Chave armazenada!";

    if (!!key) {
        msg = "Chave criptografada e armazenada!";
        localStorage.setItem("key", btoa(key));
    } else {
        msg = "Chave retirada do armazenamento!";
        localStorage.setItem("key", "");
    }

    alert(msg);
};

/**
 * Define o tema do app
 * @param {String} theme `dark` | `light`
 */
const setTheme = (theme = "dark") => {
    const style = document.documentElement.style,
        linkedinDiv = document.getElementsByClassName("LI-profile-badge")[0];
   
    let colorDefault = "#2f2f2f";
    
    if (theme == "dark") {
        style.setProperty("--CorTexto", "#fff");                           
        localStorage.setItem("theme", "dark");
    } else {        
        colorDefault = "#fff";        
        style.setProperty("--CorTexto", "#000");
        localStorage.setItem("theme", "light");
    }
    
    style.setProperty("--CorPrincipal", colorDefault);
    
    const themeMetaTag = document.head.querySelector('meta[name="theme-color"]');
        
    if(themeMetaTag) {
        themeMetaTag.content = colorDefault;
    }    
};

const initial = () => {
    new ClipboardJS(".btnCopy");

    let theme = localStorage.getItem("theme"),
        inputKey = document.getElementById("chave"),
        key = localStorage.getItem("key");

    if (!!key) {
        inputKey.value = atob(key);
    }

    if (!theme) {
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches // Pega o tema do sistema
            ? setTheme("dark")
            : setTheme("light");
    } else {
        setTheme(theme);
    }
};

// Identifica mudança de tema do sistema
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
        e.matches ? setTheme("dark") : setTheme("light");
    });

const changeTheme = () => {
    let theme = localStorage.getItem("theme");

    if (theme == "dark") {
        setTheme("light");
    } else {
        setTheme("dark");
    }
};


initial();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch((error) => console.log(error));
}

const chave = document
   .getElementById("chave")
   .addEventListener("input", cripto);

const texto = document
   .getElementById("texto")
   .addEventListener("input", cripto);

const btnShowPass = document
   .getElementById("btnShowPass")
   .addEventListener("click", (btn) => {  showPassword(btn.target.checked) });