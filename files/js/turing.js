var de = de || {};
de.vad_systems = de.vad_systems || {};
de.vad_systems.turing = {};

/* Variables */
de.vad_systems.turing.interval = -1;
de.vad_systems.turing.semaphor = 0;

/* Machine Controls */
de.vad_systems.turing.controls = {};
	/* Read */
	de.vad_systems.turing.controls.read = function () {
		return document.querySelector("div#strip div.cell.selected").textContent;
	};
	
	/* Write */
	de.vad_systems.turing.controls.write = function (content) {
		document.querySelector("div#strip div.cell.selected").textContent = content;
	};
	
	/* Move */
	de.vad_systems.turing.controls.moveLeft = function () {
		de.vad_systems.turing.checkLeftEnd();
		
		var cell = document.querySelector("div#strip div.cell.selected");
		cell.classList.remove("selected");
		cell.previousSibling.classList.add("selected");
		de.vad_systems.turing.ui.centerView();
	};
	
	de.vad_systems.turing.controls.moveRight = function () {
		de.vad_systems.turing.checkRightEnd();
		
		var cell = document.querySelector("div#strip div.cell.selected");
		cell.classList.remove("selected");
		cell.nextSibling.classList.add("selected");
		de.vad_systems.turing.ui.centerView();
	};

/* Tick Execution */
de.vad_systems.turing.tick = function () {
	if(de.vad_systems.turing.semaphor > 0) return;
	
	de.vad_systems.turing.semaphor = 2;
	var rules = document.querySelectorAll("div#rules table tbody tr");
	var state = document.querySelector("div#info span#state").textContent;
	var read = document.querySelector("div#strip div.cell.selected").textContent;
	
	for(var i = 0; i < rules.length; i++) {
		var rule = rules[i];
		if(rule.querySelector("td.condition_state").textContent == state) {
			// Rule matches State
			if(rule.querySelector("td.condition_read").textContent == read) {
				// Rule matches Read
				de.vad_systems.turing.executeRule(rule);
				var steps = document.querySelector("div#info span#steps");
				steps.textContent = steps.textContent*1 + 1;
				return;
			}
		}
	}
	
	// No rule found
	de.vad_systems.turing.io.stop();
};

de.vad_systems.turing.executeRule = function (rule) {
	if(rule.querySelector("td.action_state").textContent != "") {
		document.querySelector("div#info span#state").textContent = rule.querySelector("td.action_state").textContent;
	}
	
	var write = function () {
		if(rule.querySelector("td.action_write").textContent != "") {
			document.querySelector("div#strip div.cell.selected").textContent = rule.querySelector("td.action_write").textContent;
			de.vad_systems.turing.semaphor--;
		}
	};
	
	var move = function () {
		switch(rule.querySelector("td.action_move").textContent) {
			case "R":
				de.vad_systems.turing.controls.moveRight();
				break;
			case "L":
				de.vad_systems.turing.controls.moveLeft();
				break;
			default:
		}
		de.vad_systems.turing.semaphor--;
	};
	
	window.setTimeout(write, 100);
	window.setTimeout(move, 200);
};

/* Overflow Check */
de.vad_systems.turing.checkLeftEnd = function () {
	var strip = document.querySelector("div#strip");
	
	var end = strip.firstChild.nextSibling.nextSibling;
	if(end == undefined || end === null || end.classList.contains("selected")) {
		var c = de.vad_systems.turing.createCell();
		strip.insertBefore(c, document.querySelector("div#strip #plus-left").nextSibling);
	}
};

de.vad_systems.turing.checkRightEnd = function () {
	var strip = document.querySelector("div#strip");
	
	var end = strip.lastChild.previousSibling.previousSibling;
	if(end == undefined || end === null || end.classList.contains("selected")) {
		var c = de.vad_systems.turing.createCell();
		strip.insertBefore(c, document.querySelector("div#strip #plus-right"));
	}
};

de.vad_systems.turing.createCell = function (content) {
	if(content == undefined || content === null) content = document.querySelector("#info #blank-symbol").textContent;
	
	var c = document.createElement("div");
	c.classList.add("cell");
	c.textContent = content;
	
	c.onclick = de.vad_systems.turing.event.enableInput;
	c.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	
	return c;
};

de.vad_systems.turing.createRule = function (data) {
	if(data == undefined || data === null) data = {};
		if(data.conds == undefined || data.conds === null) data.conds = {};
			if(data.conds.state == undefined || data.conds.state === null) data.conds.state = "";
			if(data.conds.read == undefined || data.conds.read === null) data.conds.read = "";
		if(data.actions == undefined || data.actions === null) data.actions = {};
			if(data.actions.write == undefined || data.actions.write === null) data.actions.write = "";
			if(data.actions.move == undefined || data.actions.move === null) data.actions.move = "";
			if(data.actions.state == undefined || data.actions.state === null) data.actions.state = "";
	
	var rules = document.querySelector("div#rules table tbody");
	
	var rule = document.createElement("tr");
	
	var condition_state = document.createElement("td");
	condition_state.classList.add("condition_state");
	condition_state.textContent = data.conds.state.charAt(0);
	condition_state.onclick = de.vad_systems.turing.event.enableInput;
	condition_state.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	rule.appendChild(condition_state);
	
	var condition_read = document.createElement("td");
	condition_read.classList.add("condition_read");
	condition_read.textContent = data.conds.read.charAt(0);
	condition_read.onclick = de.vad_systems.turing.event.enableInput;
	condition_read.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	rule.appendChild(condition_read);
	
	var action_write = document.createElement("td");
	action_write.classList.add("action_write");
	action_write.textContent = data.actions.write.charAt(0);
	action_write.onclick = de.vad_systems.turing.event.enableInput;
	action_write.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	rule.appendChild(action_write);
	
	var action_move = document.createElement("td");
	action_move.classList.add("action_move");
	action_move.textContent = data.actions.move.charAt(0).toUpperCase();
	action_move.onclick = de.vad_systems.turing.event.enableInput;
	action_move.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	rule.appendChild(action_move);
	
	var action_state = document.createElement("td");
	action_state.classList.add("action_state");
	action_state.textContent = data.actions.state.charAt(0);
	action_state.onclick = de.vad_systems.turing.event.enableInput;
	action_state.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	rule.appendChild(action_state);
	
	var option_remove = document.createElement("td");
	option_remove.classList.add("option_remove");
	var button = document.createElement("button");
	button.textContent = "X";
	button.onclick = function () {
		this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);
	};
	option_remove.appendChild(button);
	rule.appendChild(option_remove);
	return rule;
};

/* View UI Specifics */
de.vad_systems.turing.ui = {};

de.vad_systems.turing.ui.centerView = function () {
	var cell = document.querySelector("div#strip div.cell.selected");
	
	var viewContent = document.querySelector("#view-content");
	viewContent.scrollLeft = cell.offsetLeft - ((viewContent.clientWidth/2) - (cell.clientWidth/2));
}

/* Event Handling */
de.vad_systems.turing.event = {};
/* Single Character Input */
	de.vad_systems.turing.event.singleKeyInput = function (e) {
		var s = String.fromCharCode(e.which);
		if(this.contentEditable) {
			this.textContent = s;
			this.contentEditable = false;
		}
	};
	
	/* Enabling Input */
	de.vad_systems.turing.event.enableInput = function () {
		this.contentEditable = true;
	};

/* IO */
de.vad_systems.turing.io = {};
	/* Start */
	de.vad_systems.turing.io.start = function () {
		de.vad_systems.turing.interval = window.setInterval(de.vad_systems.turing.tick, 500);
		var buttonToggle = document.querySelector("#run-toggle");
		buttonToggle.textContent = "Stop";
		buttonToggle.className = "active";
	};
	
	/* Stop */
	de.vad_systems.turing.io.stop = function () {
		window.clearInterval(de.vad_systems.turing.interval);
		var buttonToggle = document.querySelector("#run-toggle");
		buttonToggle.textContent = "Start";
		buttonToggle.className = "inactive";
	};
	
	/* Toggle Start/Stop */
	de.vad_systems.turing.io.toggleRun = function () {
		var buttonToggle = document.querySelector("#run-toggle");
		if(buttonToggle.textContent == "Start") {
			de.vad_systems.turing.io.start();
		}
		else {
			de.vad_systems.turing.io.stop();
		}
	};
	
	/* Reset */
	de.vad_systems.turing.io.reset = function () {
		de.vad_systems.turing.initialize(true);
	};
	
	/* Load from entered JSON */
	de.vad_systems.turing.io.load = function () {
		de.vad_systems.turing.initialize(true);
		
		var data = document.querySelector("#controls textarea").value;
		if(data == "") return;
		else {
			data = JSON.parse(data);
		}
		
		if(data.blank == undefined || data.blank === null) data.blank = document.querySelector("#info #blank-symbol").textContent;
		document.querySelector("div#info #blank-symbol").textContent = data.blank.charAt(0);
		
		if(data.word == undefined || data.word === null) data.word = data.blank.charAt(0);
		de.vad_systems.turing.initStrip(data.word);
		
		if(data.state == undefined || data.state === null) data.state = "1";
		document.querySelector("div#info #state").textContent = data.state.charAt(0);
		
		if(data.rules == undefined || data.rules === null) return;
		de.vad_systems.turing.initRules(data.rules);
	};

/* Init */
de.vad_systems.turing.initialize = function (soft) {
	de.vad_systems.turing.semaphor = 0;
	de.vad_systems.turing.initStrip();
	de.vad_systems.turing.initInfo(soft);
	de.vad_systems.turing.initControls();
	if(soft !== true) {
		de.vad_systems.turing.initRules();
	}
};

de.vad_systems.turing.initStrip = function (word) {
	if(word == undefined || word === null) word = "#";
	
	var strip = document.querySelector("#strip");
	strip.innerHTML = "";
	var plusLeft = document.createElement("button");
	plusLeft.textContent = "+";
	plusLeft.id = "plus-left";
	plusLeft.onclick = function () {
		document.querySelector("#strip").insertBefore(de.vad_systems.turing.createCell(), this.nextSibling);
	};
	
	var plusRight = document.createElement("button");
	plusRight.textContent = "+";
	plusRight.id = "plus-right";
	plusRight.onclick = function () {
		document.querySelector("#strip").insertBefore(de.vad_systems.turing.createCell(), this);
	};
	
	/* Left Plus */
	strip.appendChild(plusLeft);
	
	/* Starting cells */
	var c;
	c = de.vad_systems.turing.createCell();
	strip.appendChild(c);
	
	/* Loaded word */
	for(var i = 0; i < word.length; i++) {
		c = de.vad_systems.turing.createCell(word.charAt(i));
		if(i == 0) {
			c.classList.add("initial");
			c.classList.add("selected");
		}
		strip.appendChild(c);
	}
	
	c = de.vad_systems.turing.createCell();
	strip.appendChild(c);
	
	/* Right Plus */
	strip.appendChild(plusRight);
	
	de.vad_systems.turing.ui.centerView();
};

de.vad_systems.turing.initInfo = function (soft) {
	var info = document.querySelector("#info");
	
	var state = info.querySelector("#state");
	state.textContent = "1";
	state.onclick = de.vad_systems.turing.event.enableInput;
	state.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	
	var steps = info.querySelector("#steps");
	steps.textContent = "0";
	
	if(!soft) {
		var blankSymbol = info.querySelector("#blank-symbol");
		blankSymbol.onclick = de.vad_systems.turing.event.enableInput;
		blankSymbol.onkeypress = de.vad_systems.turing.event.singleKeyInput;
	}
};

de.vad_systems.turing.initRules = function (ruleData) {
	var rules = document.querySelector("div#rules");
	
	rules.querySelector("table tbody").innerHTML = "";
	rules.querySelector("table tfoot button").onclick = function () {
		document.querySelector("div#rules table tbody").appendChild(de.vad_systems.turing.createRule());
	};
	
	if(ruleData == undefined || ruleData === null) return;
	for(var i = 0; i < ruleData.length; i++) {
		document.querySelector("div#rules table tbody").appendChild(de.vad_systems.turing.createRule(ruleData[i]));
	}
};

de.vad_systems.turing.initControls = function () {
	var controls = document.querySelector("#controls");
	
	var buttonToggle = controls.querySelector("#run-toggle");
	buttonToggle.onclick = de.vad_systems.turing.io.toggleRun;
	de.vad_systems.turing.io.stop();
	
	var buttonReset = controls.querySelector("#reset");
	buttonReset.textContent = "Reset";
	buttonReset.onclick = de.vad_systems.turing.io.reset;
	
	var buttonLoad = controls.querySelector("#load");
	buttonLoad.textContent = "Load";
	buttonLoad.onclick = de.vad_systems.turing.io.load;
};
