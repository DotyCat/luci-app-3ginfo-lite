'use strict';
'require view';
'require dom';
'require fs';
'require ui';
var MODEM_STATUS = '/bin/modem_status';
var GET_IMEI_CMD = 'AT+EGMR=0,7';

function stylesheet() {
	return E('link', {
		'rel': 'stylesheet',
		'href': L.resource('view/modem/3ginfo-lite.css')
	});
}

function parseImei(output) {
	var match = String(output || '').match(/\b\d{15}\b/);
	return match ? match[0] : '';
}

function setStatus(text) {
	dom.content(document.getElementById('imei-status'), [text]);
}

function isAtResponseOk(output) {
	var text = String(output || '').replace(/\r/g, '\n');
	return /(^|\n)\s*OK\s*(\n|$)/.test(text) && !/(^|\n)\s*ERROR\s*(\n|$)/.test(text);
}
return view.extend({
	handleSaveApply: null,
	handleSave: null,
	handleReset: null,
	load: function() {
		return L.resolveDefault(fs.exec_direct(MODEM_STATUS, ['--at_cmd', GET_IMEI_CMD]), '');
	},
	handleRefresh: function(ev) {
		var button = ev.currentTarget;
		button.setAttribute('disabled', 'true');
		setStatus(_('Reading IMEI...'));
		return fs.exec_direct(MODEM_STATUS, ['--at_cmd', GET_IMEI_CMD]).then(function(res) {
			var imei = parseImei(res);
			document.getElementById('imei-value').value = imei;
			setStatus(imei ? _('IMEI loaded.') : _('IMEI not found in command output.'));
		}).catch(function(err) {
			setStatus(_('Failed to read IMEI.'));
			ui.addNotification(null, E('p', {}, err.message || err));
		}).finally(function() {
			button.removeAttribute('disabled');
		});
	},
	handleSubmit: function(ev) {
		var button = ev.currentTarget;
		var imei = document.getElementById('imei-value').value.replace(/\s+/g, '');
		if (!/^\d{15}$/.test(imei)) {
			ui.addNotification(null, E('p', {}, _('IMEI must be 15 digits.')));
			return;
		}
		button.setAttribute('disabled', 'true');
		setStatus(_('Setting IMEI...'));
		return fs.exec_direct(MODEM_STATUS, ['--at_cmd', 'AT+EGMR=1,7,"' + imei + '"']).then(function(res) {
			if (!isAtResponseOk(res))
				return Promise.reject(res || _('Failed to set IMEI.'));
			setStatus(_('IMEI set successfully.'));
			ui.addNotification(null, E('p', {}, _('IMEI set successfully.')));
		}).catch(function(err) {
			setStatus(_('Failed to set IMEI.'));
			ui.addNotification(null, E('p', {}, err.message || err));
		}).finally(function() {
			button.removeAttribute('disabled');
		});
	},
	render: function(output) {
		var imei = parseImei(output);
		return E('div', {
			'class': 'ginfo-page'
		}, [stylesheet(), E('div', {
			'class': 'cbi-map'
		}, [E('h2', {
			'name': 'content'
		}, [_('Set IMEI')]), E('div', {
			'class': 'cbi-map-descr'
		}, [_('Read and set the modem IMEI.')]), E('div', {
			'class': 'cbi-section'
		}, [E('table', {
			'class': 'table'
		}, [E('tr', {
			'class': 'tr'
		}, [E('td', {
			'class': 'td left'
		}, [_('IMEI')]), E('td', {
			'class': 'td left'
		}, [E('input', {
			'id': 'imei-value',
			'type': 'text',
			'value': imei,
			'maxlength': '15'
		})])])]), E('button', {
			'class': 'cbi-button cbi-button-action',
			'click': ui.createHandlerFn(this, 'handleRefresh')
		}, [_('Refresh')]), E('button', {
			'class': 'cbi-button cbi-button-apply important',
			'style': 'margin-left:8px',
			'click': ui.createHandlerFn(this, 'handleSubmit')
		}, [_('Submit')]), E('span', {
			'id': 'imei-status',
			'class': 'ginfo-status',
			'style': 'margin-left:12px'
		}, [imei ? _('IMEI loaded.') : _('IMEI not found in command output.')])])])]);
	}
});
