document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const login = e.target.login.value.trim();
  const password = e.target.password.value.trim();
  const errorMessage = document.getElementById("error-message");

  // 👇 Login va parol ro'yxati — sahifaga yo'naltirish bilan
  const users = [
    { login: "filial1", password: "1234", redirect: "/branches/filial1.html" },
    { login: "filial2", password: "5678", redirect: "/branches/filial2.html" },
    { login: "filial3", password: "9999", redirect: "/branches/filial3.html" }
  ];

  const foundUser = users.find(
    (user) => user.login === login && user.password === password
  );

  if (foundUser) {
    window.location.href = foundUser.redirect;
  } else {
    errorMessage.textContent = "❌ Login yoki parol noto‘g‘ri!";
    errorMessage.style.color = "red";
  }
});
