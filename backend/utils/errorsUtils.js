module.exports.signUpErrors = (err) => {
	let errors = { pseudo: "", email: "", password: "" };
	if (err.message.includes("pseudo"))
		errors.pseudo = "Pseudo incorrect ou déjà pris !";
	if (err.message.includes("password"))
		errors.password = "Le mot de pass doit contenir 6 caractères mini !";
	if (err.message.includes("email")) errors.email = "Email incorrect !";
	if (err.code === 11000 && object.keys(err.keyValue)[0].includes("pseudo"))
		errors.email = "Cet pseudo existe déjà !";
	if (err.code === 11000 && object.keys(err.keyValue)[0].includes("email"))
		errors.email = "Cet email existe déjà !";
	return errors;
};
