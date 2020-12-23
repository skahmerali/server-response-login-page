
// var users = [
//     // { name: "ahmer1", email: "1ahmerali75@gmail.com", pasword:"10000" , birthdate:"1xx-xx-xxxx", address:"1xxxxxxxxxxxxxxxxxxxx", gender:"male" },
//     // {name: "ahmer2", email: "2ahmerali75@gmail.com", pasword:"20000" , birthdate:"2xx-xx-xxxx", address:"2xxxxxxxxxxxxxxxxxxxx", gender:"male"  },


// ]
var isFound = false;
function signup() {
    let name = document.getElementById("signup-name").value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;
    let rePassword = document.getElementById("signup-re-password").value;
    let Dbirth = document.getElementById("signup-date_birth").value;
    let address = document.getElementById("signup-address").value;
    let gender = document.getElementById("gender").value;

    email = email.toLowerCase();

    user({ userName: name, userEmail: email, userPassword: password });
    document.getElementById("signup-name").value = "";
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";


    const Http = new XMLHttpRequest();
    const url = 'https://localhost:3000/signup';
    Http.open("POST", url);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify(user));

    Http.onreadystatechange = (e) => {
        // console.log(Http.responseText)
        document.getElementById('res').innerHTML = Http.responseText;
    }

    // for(i=0; i<users.length;i++){
    //     if(users[i]===email){

    //         alert("kindly change ur email address ")
    //     }

    //     else{

    // users.push({
    //     name: name,
    //     email: email,
    //     password: password,
    //     confirmPassword: rePassword,
    //     birthDate: Dbirth,
    //     address: address,
    //     gender: gender,

    // });
    // localStorage.setItem("userData", JSON.stringify(users));
    // window.location.href = "index.html";
    return false;
}
// }
// }
// var getEmail = localStorage.getItem('email')
// var getPass = localStorage.getItem('password')
// var getBirth = localStorage.getItem('date-birth')
// var getAdress = localStorage.getItem('address')
// var getGender = localStorage.getItem('gender')
// var getUser = JSON.parse(localStorage.getItem('userData'))


function login() {
    let Lemail = document.getElementById("login-email").value;
    let Lpassword = document.getElementById("login-password").value;


    const Http = new XMLHttpRequest();
    const url = 'https://localhost:3000/login';

    Http.open("POST", url);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify({ email: uEmail, pass: uPassword }));

    document.getElementById('login-email').value = ""
    document.getElementById('login-password').value = ""

    Http.onreadystatechange = (e) => {
        // console.log(Http.responseText)
        document.getElementById('result').innerHTML = Http.responseText;
    }
    // for (i = 0; i < getUser.length; i++) {

    //     if ((getUser[i].email === Lemail) && (getUser[i].password === Lpassword)) {


    //         window.location.href = "home.html"
    //     }
    //     else {
    //         alert("INVALID EMAIL OR PASSWORD");
    //     }
    // }
    return false;
}

var getUser = JSON.parse(localStorage.getItem('userData'))
document.getElementById("print-username").value = getUser[0].name;
document.getElementById("print-email").value = getUser[0].email;
document.getElementById("print-password").value = getUser[0].password;
document.getElementById("print-re-password").value = getUser[0].confirmPassword;
document.getElementById("print-date_birth").value = getUser[0].birthDate;
document.getElementById("print-address").value = getUser[0].address;
document.getElementById("print-number").value = getUser[0].gender;
console.log(getUser);