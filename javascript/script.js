var memos = []
var timerID = -1
var times = ["-", "-"]
var date = 0

var randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
var randomLetter = function (last) {
	var letter =  String.fromCharCode(randomInt(65, 65+25))
	if (letter == last) return randomLetter(last)
	else return letter
}
var onlyLetters = function (str) {
	var newStr = ""
	for (var i in str) {
		if (ord(str[i]) >= 65 && ord(str[i]) <= 26+25) newStr += str[i]
	}
	return newStr
}
var copyOfMemo = function () {
	var temp = []
	for (var i in memos) {
		temp.push(memos[i].slice(0))
	}
	return temp
}

//timer functions
var updateTimer = function () {
	console.log("TIMER UPDATING")
}
var startTimer = function () {
	date = new Date()
	timerID = setTimeout(function() {updateTimer()}, 1000);
}
var stopTimer = function () {
	clearTimeout(timerID)
}
var getTime = function () {
	return (new Date()).getTime() - date.getTime()
}

//memo handling functions
var generateLetters = function (size) {
	var letters = ""
	var last = 0
	for (var i = 0; i<size; i++) {
		last = randomLetter(last)
		letters += last
	}
	return letters
}
var generateMemo = function () {
	return [generateLetters(randomInt(6, 10)), generateLetters(randomInt(9, 18))]
}
var createLine = function (part, option) {
	var finalString = ""
	var i = 0
	for (var k in part) {
		if (option == null) finalString += part[k]
		else if (option[k] == "+") finalString += '<span id="green">' + part[k] + '</span>'
		else if (option[k] == "-") finalString += '<span id="red">' + part[k] + '</span>' 
		i++
		if (i % 2 == 0) finalString += " "
	}
	return finalString
}
var createTable = function (option) {
	var tableCode = '<table class="table table-bordered"><thead><tr><th scope="col">#</th><th scope="col">Corners</th><th scope="col">Edges</th></tr></thead><tbody>'
	for (var i in memos) {
		tableCode += '<tr><th scope="row">' + (parseInt(i) + 1).toString() + '</th>'
		for (var j in memos[i]) {
			if (option != undefined) tableCode += '<td>' + createLine(memos[i][j], option[i][j]) + '</td>'
			else tableCode += '<td>' + createLine(memos[i][j], undefined) + '</td>'
		}
		tableCode += '</tr>'
	}
	tableCode += '</tbody></table>'
	return tableCode
}
var checkMemo = function (input) {
	options = copyOfMemo()
	for (var i in memos) {
		for (var j in memos[i]) {
			var temp = ""
			for (var k in memos[i][j]) {
				if (input[i][j].length < k || input[i][j][k] != memos[i][j][k]) {
					temp += "-"
				}
				else temp += "+"
			}
			options[i][j] = temp
		}
	}
	return options
}

//-----------
var start = function () {
	reset()
	var size = parseInt(prompt("How many cubes?"))
	console.log(size)
	for (var i = 0; i<size; i++) {
		memos.push(generateMemo())
	}
	startTimer()
	var temp = copyOfMemo()
	temp[0][0] = memos[0][0][0]
	document.getElementById("seila").innerHTML = createTable(checkMemo(temp))

}
var reset = function () {
	memos = []
	timerID = -1
	times = ["-", "-"]
}