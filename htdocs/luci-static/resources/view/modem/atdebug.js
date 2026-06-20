'use strict';
'require view';
'require fs';
'require ui';
var MODEM_STATUS = '/bin/modem_status';

function stylesheet() {
	return E('link', {
		'rel': 'stylesheet',
		'href': L.resource('view/modem/3ginfo-lite.css')
	});
}
var AT_COMMANDS = [{
	name: _('Module Information > ATI'),
	value: 'ATI'
}, {
	name: _('Query SIM Card Status > AT+CPIN?'),
	value: 'AT+CPIN?'
}, {
	name: _('Query Network Signal Quality (4G) > AT+CSQ'),
	value: 'AT+CSQ'
}, {
	name: _('Query Network Signal Quality (5G) > AT+CESQ'),
	value: 'AT+CESQ'
}, {
	name: _('Query Network Information > AT+COPS?'),
	value: 'AT+COPS?'
}, {
	name: _('Query PDP Information > AT+CGDCONT?'),
	value: 'AT+CGDCONT?'
}, {
	name: _('Query PDP Address > AT+CGPADDR'),
	value: 'AT+CGPADDR'
}, {
	name: _('Query Module IMEI > AT+CGSN'),
	value: 'AT+CGSN'
}, {
	name: _('Query Module IMEI > AT+GSN'),
	value: 'AT+GSN'
}, {
	name: _('Check Current Voltage > AT+CBC'),
	value: 'AT+CBC'
}, {
	name: _('Minimum Function Mode > AT+CFUN=0'),
	value: 'AT+CFUN=0'
}, {
	name: _('Full Function Mode > AT+CFUN=1'),
	value: 'AT+CFUN=1'
}, {
	name: _('Restart Module > AT+CFUN=1,1'),
	value: 'AT+CFUN=1,1'
}, {
	name: _('Query Band Lock > AT+GTACT?'),
	value: 'AT+GTACT?'
}, {
	name: _('Query Cell Lock > AT+GTCELLLOCK?'),
	value: 'AT+GTCELLLOCK?'
}, {
	name: _('Query Current Cell Information > AT+GTCCINFO?'),
	value: 'AT+GTCCINFO?'
}, {
	name: _('Query CA information > AT+GTCAINFO?'),
	value: 'AT+GTCAINFO?'
}];

function appendOutput(text) {
	var output = document.getElementById('at-debug-output');
	output.value += text;
	output.scrollTop = output.scrollHeight;
}

function currentTime() {
	var now = new Date();
	var pad = function(value) {
		value = String(value);
		return value.length < 2 ? '0' + value : value;
	};
	return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + ' ' +
		pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
}
return view.extend({
	handleSaveApply: null,
	handleSave: null,
	handleReset: null,
	handleCommandChange: function(ev) {
		var input = document.getElementById('at-command-input');
		var descr = document.getElementById('at-command-input-descr');
		var custom = ev.currentTarget.value === '';
		input.style.display = custom ? '' : 'none';
		descr.style.display = custom ? '' : 'none';
		if (custom)
			input.focus();
	},
	handleEditCommand: function(ev) {
		var selector = document.getElementById('at-command-selector');
		var input = document.getElementById('at-command-input');
		ev.preventDefault();
		input.value = selector.value;
		selector.value = '';
		selector.dispatchEvent(new Event('change'));
	},
	handleSend: function(ev) {
		var button = ev.currentTarget;
		var selector = document.getElementById('at-command-selector');
		var input = document.getElementById('at-command-input');
		var port = document.getElementById('at-port-selector').value;
		var command = selector.value || input.value;
		command = command.replace(/^\s+|\s+$/g, '');
		if (!command) {
			ui.addNotification(null, E('p', {}, _('AT command is empty.')));
			return;
		}
		button.setAttribute('disabled', 'true');
		appendOutput(command + ' >> ' + port + ' [' + currentTime() + ']\n');
		return fs.exec_direct(MODEM_STATUS, ['--at_cmd', command]).then(function(res) {
			appendOutput(String(res || '').replace(/\r/g, '') + '\n<<EOF\n');
		}).catch(function(err) {
			appendOutput(String(err && err.message ? err.message : err) + '\n<<EOF\n');
			ui.addNotification(null, E('p', {}, err.message || err));
		}).finally(function() {
			button.removeAttribute('disabled');
		});
	},
	handleClearPort: function() {
		document.getElementById('at-port-selector').selectedIndex = 0;
	},
	handleClearCommand: function() {
		var selector = document.getElementById('at-command-selector');
		var input = document.getElementById('at-command-input');
		selector.value = '';
		selector.dispatchEvent(new Event('change'));
		input.value = '';
	},
	handleClearOutput: function() {
		document.getElementById('at-debug-output').value = '';
	},
	render: function() {
		var commandOptions = [E('option', {
			'value': ''
		}, [_('-- custom ---')])];
		for (var i = 0; i < AT_COMMANDS.length; i++)
			commandOptions.push(E('option', {
				'value': AT_COMMANDS[i].value
			}, [AT_COMMANDS[i].name]));
		return E('div', {
			'class': 'ginfo-page'
		}, [stylesheet(), E('div', {
			'class': 'cbi-map'
		}, [E('h2', {
			'name': 'content'
		}, [_('AT Debug')]), E('div', {
			'class': 'cbi-section'
		}, [E('table', {
			'class': 'table'
		}, [E('tr', {
			'class': 'tr'
		}, [E('td', {
			'class': 'td left'
		}, [_('AT Port') + ':']), E('td', {
			'class': 'td left',
			'style': 'width:70%'
		}, [E('select', {
			'id': 'at-port-selector',
			'style': 'width:100%'
		}, [E('option', {
			'value': _('Default AT channel')
		}, [_('Default AT channel')])])])]), E('tr', {
			'class': 'tr'
		}, [E('td', {
			'class': 'td left'
		}, [_('AT Command') + ':']), E('td', {
			'class': 'td left'
		}, [E('select', {
			'id': 'at-command-selector',
			'style': 'width:100%',
			'change': ui.createHandlerFn(this, 'handleCommandChange'),
			'dblclick': ui.createHandlerFn(this, 'handleEditCommand'),
			'contextmenu': ui.createHandlerFn(this, 'handleEditCommand')
		}, commandOptions), E('div', {
			'class': 'cbi-section-descr'
		}, [_('Double Click or Right Click to Edit')]), E('input', {
			'id': 'at-command-input',
			'type': 'text',
			'style': 'width:100%',
			'placeholder': _('Input AT Command')
		}), E('div', {
			'id': 'at-command-input-descr',
			'class': 'cbi-section-descr'
		}, [_('Lost focus to save')])])]), E('tr', {
			'class': 'tr'
		}, [E('td', {
			'class': 'td left',
			'colspan': '2'
		}, [E('span', {
			'class': 'flex_container'
		}, [E('button', {
			'class': 'cbi-button cbi-button-action',
			'click': ui.createHandlerFn(this, 'handleSend')
		}, [_('Send')]), E('button', {
			'class': 'cbi-button',
			'style': 'margin-left:8px',
			'click': ui.createHandlerFn(this, 'handleClearPort')
		}, [_('Clear AT Port')]), E('button', {
			'class': 'cbi-button',
			'style': 'margin-left:8px',
			'click': ui.createHandlerFn(this, 'handleClearCommand')
		}, [_('Clear AT Command')])])])])]), E('textarea', {
			'id': 'at-debug-output',
			'readonly': 'readonly',
			'style': 'width:100%;height:420px;box-sizing:border-box;margin-top:8px'
		}), E('button', {
			'class': 'cbi-button',
			'style': 'margin-top:8px',
			'click': ui.createHandlerFn(this, 'handleClearOutput')
		}, [_('Clear')])])])]);
	}
});
