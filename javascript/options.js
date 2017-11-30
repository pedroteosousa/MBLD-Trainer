document.cookie = "template"

var themes = ["dark", "light"]
var theme = 0

// Function to get a cookie by name
var getCookie = function (cname) {
	var name = cname + "="
	var decodedCookie = decodeURIComponent(document.cookie)
	var ca = decodedCookie.split(';')
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i]
		while (c.charAt(0) == ' ') {
			c = c.substring(1)
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length)
		}
	}
	return ""
}

var loadCookies = function () {
	if (getCookie('theme').length) theme = parseInt(getCookie('theme'))
	
	var themeButtons = document.getElementsByClassName('theme')
	for (var i in themeButtons) {
		if (theme == parseInt(themeButtons[i].value)) themeButtons[i].checked = true
		themeButtons[i].onclick = () => {
			var buttons = document.getElementsByClassName('theme')
			for (var j in buttons) {
				if (buttons[j].checked == true) {
					changeTheme(parseInt(buttons[j].value))
				}
			}
		}
	}

	saveCookies()
	changeTheme(theme)
}

var saveCookies = function () {
	document.cookie = "theme="+theme
}

var changeTheme = function (t) {
	theme = t
	var links = document.getElementsByTagName('link')
	document.getElementById("css").href = 'css/'+themes[theme]+'.css'
	saveCookies()
}
