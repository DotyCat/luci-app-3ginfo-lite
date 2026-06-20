'use strict';
'require view';
'require dom';
'require fs';
'require ui';
var MODEM_STATUS = '/bin/modem_status';

function stylesheet() {
	return E('link', {
		'rel': 'stylesheet',
		'href': L.resource('view/modem/3ginfo-lite.css')
	});
}
var BAND_GROUPS = [{
	rat: '3',
	title: 'WCDMA',
	currentKey: 'current_umts_band',
	supportKey: 'support_umts_band'
}, {
	rat: '4',
	title: 'LTE',
	currentKey: 'current_lte_band',
	supportKey: 'support_lte_band'
}, {
	rat: '5',
	title: 'NR',
	currentKey: 'current_nr_band',
	supportKey: 'support_nr_band'
}];
var RAT_MODES = [{
	value: '1',
	title: 'UMTS',
	acts: ['2']
}, {
	value: '2',
	title: 'LTE',
	acts: ['3']
}, {
	value: '4',
	title: 'LTE/UMTS',
	acts: ['3', '2']
}, {
	value: '10',
	title: 'Automatic',
	acts: ['6', '3', '2']
}, {
	value: '14',
	title: 'NR-RAN',
	acts: ['6']
}, {
	value: '16',
	title: 'NR-RAN/WCDMA',
	acts: ['6', '2']
}, {
	value: '17',
	title: 'NR-RAN/LTE',
	acts: ['6', '3']
}, {
	value: '20',
	title: 'NR-RAN/WCDMA/LTE',
	acts: ['6', '3', '2']
}];
var ACT_LABELS = {
	'2': 'WCDMA',
	'3': 'LTE',
	'6': 'NR-RAN'
};

function checkedBands(rat) {
	var nodes = document.querySelectorAll('input[data-rat="%s"]:checked'.format(rat));
	var bands = [];
	for (var i = 0; i < nodes.length; i++)
		bands.push(nodes[i].value);
	return bands;
}

function parseBandString(value) {
	if (!value || value === '0')
		return [];
	return String(value).split('/').map(function(band) {
		return band.replace(/[^\d]/g, '');
	}).filter(function(band) {
		return /^\d+$/.test(band) && band !== '0';
	}).map(function(band) {
		return +band;
	});
}

function parseBandlock(output) {
	try {
		return output ? JSON.parse(output) : {};
	} catch (e) {
		return {};
	}
}

function renderBandCheckbox(group, band) {
	return E('span', {
		'style': 'display:inline-flex;align-items:center;gap:4px;margin:0 12px 8px 0;white-space:nowrap'
	}, [E('input', {
		'type': 'checkbox',
		'class': 'cbi-input-checkbox',
		'data-rat': group.rat,
		'value': String(band)
	}), E('span', {}, [group.rat === '5' ? 'n' + band : 'B' + band])]);
}

function renderCurrentBands(value) {
	var bands = parseBandString(value);
	if (!bands.length)
		return '0';
	return E('div', {
		'class': 'ginfo-current-bands'
	}, bands.map(function(band) {
		return E('span', {}, [String(band)]);
	}));
}

function setGroupChecked(rat, checked) {
	var nodes = document.querySelectorAll('input[data-rat="%s"]'.format(rat));
	for (var i = 0; i < nodes.length; i++)
		nodes[i].checked = checked;
}

function getRatMode(value) {
	value = String(value || '');
	for (var i = 0; i < RAT_MODES.length; i++)
		if (RAT_MODES[i].value === value)
			return RAT_MODES[i];
	return null;
}

function parseNetworkPrefer(output) {
	var match = String(output || '').match(/\+GTACT:\s*([^\r\n]+)/);
	var parts = match ? match[1].split(',') : [];
	var rat = parts[0] ? parts[0].replace(/[^\d]/g, '') : '';
	if (!getRatMode(rat))
		rat = '20';
	return {
		rat: rat,
		preferredAct1: parts[1] ? parts[1].replace(/[^\d]/g, '') : '',
		preferredAct2: parts[2] ? parts[2].replace(/[^\d]/g, '') : '',
		raw: output || ''
	};
}

function buildActOptions(allowedActs, selectedAct, usedAct) {
	var options = [E('option', {
		'value': ''
	}, [_('None')])];
	for (var i = 0; i < allowedActs.length; i++) {
		var act = allowedActs[i];
		options.push(E('option', {
			'value': act,
			'selected': selectedAct === act ? 'selected' : null,
			'disabled': usedAct === act ? 'disabled' : null
		}, [ACT_LABELS[act] || act]));
	}
	return options;
}

function getSelectedNetworkPrefer() {
	var ratNode = document.getElementById('network-prefer-rat');
	var act1Node = document.getElementById('network-prefer-act1');
	var act2Node = document.getElementById('network-prefer-act2');
	return {
		rat: ratNode ? ratNode.value : '',
		preferredAct1: act1Node ? act1Node.value : '',
		preferredAct2: act2Node ? act2Node.value : ''
	};
}

function setSelectValue(node, value) {
	if (!node)
		return;
	node.value = value || '';
	if (node.value !== (value || ''))
		node.value = '';
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
		return Promise.all([L.resolveDefault(fs.exec_direct(MODEM_STATUS, ['--get_bandlock']), ''), L.resolveDefault(fs.exec_direct(MODEM_STATUS, ['--at_cmd', 'AT+GTACT?']), '')]);
	},
	buildBandlockArg: function() {
		var parts = [];
		for (var i = 0; i < BAND_GROUPS.length; i++) {
			var group = BAND_GROUPS[i];
			var bands = checkedBands(group.rat);
			if (bands.length)
				parts.push(group.rat + ',' + bands.join('/'));
		}
		return parts.join(';');
	},
	handleSelectAll: function(rat) {
		setGroupChecked(rat, true);
	},
	handleClearGroup: function(rat) {
		setGroupChecked(rat, false);
	},
	handleSubmit: function(ev) {
		var button = ev.currentTarget;
		var status = document.getElementById('bandlock-status');
		var arg = this.buildBandlockArg();
		if (!arg) {
			ui.addNotification(null, E('p', {}, _('No bands selected.')));
			return;
		}
		button.setAttribute('disabled', 'true');
		dom.content(status, [_('Setting band lock...')]);
		return fs.exec_direct(MODEM_STATUS, ['--set_bandlock', arg]).then(function(res) {
			dom.content(status, [_('Band lock set successfully.')]);
			ui.addNotification(null, E('p', {}, _('Band lock set successfully.')));
		}).catch(function(err) {
			dom.content(status, [_('Failed to set band lock.')]);
			ui.addNotification(null, E('p', {}, err.message || err));
		}).finally(function() {
			button.removeAttribute('disabled');
		});
	},
	buildNetworkPreferCommand: function() {
		var selected = getSelectedNetworkPrefer();
		var mode = getRatMode(selected.rat);
		var parts = [selected.rat];
		if (!mode)
			return null;
		if (selected.preferredAct1 && mode.acts.indexOf(selected.preferredAct1) === -1)
			return null;
		if (selected.preferredAct2 && mode.acts.indexOf(selected.preferredAct2) === -1)
			return null;
		if (selected.preferredAct1 && selected.preferredAct2 && selected.preferredAct1 === selected.preferredAct2)
			return null;
		if (selected.preferredAct2 && !selected.preferredAct1)
			return null;
		if (selected.preferredAct1 || selected.preferredAct2) {
			parts.push(selected.preferredAct1);
			if (selected.preferredAct2)
				parts.push(selected.preferredAct2);
		}
		return 'AT+GTACT=' + parts.join(',');
	},
	handleNetworkPreferSubmit: function(ev) {
		var button = ev.currentTarget;
		var status = document.getElementById('network-prefer-status');
		var cmd = this.buildNetworkPreferCommand();
		if (!cmd) {
			ui.addNotification(null, E('p', {}, _('Invalid network preference.')));
			return;
		}
		button.setAttribute('disabled', 'true');
		dom.content(status, [_('Setting network preference...')]);
		return fs.exec_direct(MODEM_STATUS, ['--at_cmd', cmd]).then(function(res) {
			if (!isAtResponseOk(res))
				return Promise.reject(res || _('Failed to set network preference.'));
			dom.content(status, [_('Network preference set successfully.')]);
			ui.addNotification(null, E('p', {}, _('Network preference set successfully.')));
		}).catch(function(err) {
			dom.content(status, [_('Failed to set network preference.')]);
			ui.addNotification(null, E('p', {}, err.message || err));
		}).finally(function() {
			button.removeAttribute('disabled');
		});
	},
	applyCurrentBands: function(data) {
		var mapping = {};
		for (var i = 0; i < BAND_GROUPS.length; i++)
			mapping[BAND_GROUPS[i].rat] = parseBandString(data[BAND_GROUPS[i].currentKey]);
		for (var rat in mapping) {
			setGroupChecked(rat, false);
			for (var i = 0; i < mapping[rat].length; i++) {
				var node = document.querySelector('input[data-rat="%s"][value="%s"]'.format(rat, mapping[rat][i]));
				if (node)
					node.checked = true;
			}
		}
	},
	makeGroups: function(data) {
		return BAND_GROUPS.map(function(group) {
			return Object.assign({}, group, {
				bands: parseBandString(data[group.supportKey]).sort(function(a, b) {
					return a - b;
				})
			});
		});
	},
	updateNetworkPreferOptions: function() {
		var selected = getSelectedNetworkPrefer();
		var mode = getRatMode(selected.rat) || RAT_MODES[RAT_MODES.length - 1];
		var act1Node = document.getElementById('network-prefer-act1');
		var act2Node = document.getElementById('network-prefer-act2');
		if (mode.acts.indexOf(selected.preferredAct1) === -1)
			selected.preferredAct1 = '';
		if (mode.acts.indexOf(selected.preferredAct2) === -1 || selected.preferredAct2 === selected.preferredAct1)
			selected.preferredAct2 = '';
		dom.content(act1Node, buildActOptions(mode.acts, selected.preferredAct1, ''));
		dom.content(act2Node, buildActOptions(mode.acts, selected.preferredAct2, selected.preferredAct1));
		setSelectValue(act1Node, selected.preferredAct1);
		setSelectValue(act2Node, selected.preferredAct2);
	},
	renderCurrentSummary: function(data) {
		return E('div', {
			'class': 'cbi-section'
		}, [E('h3', {}, [_('Current Lock Band')]), E('table', {
			'class': 'table'
		}, [E('tr', {
			'class': 'tr'
		}, [E('td', {
			'class': 'td left'
		}, ['WCDMA']), E('td', {
			'class': 'td left'
		}, [renderCurrentBands(data.current_umts_band)])]), E('tr', {
			'class': 'tr'
		}, [E('td', {
			'class': 'td left'
		}, ['LTE']), E('td', {
			'class': 'td left'
		}, [renderCurrentBands(data.current_lte_band)])]), E('tr', {
			'class': 'tr'
		}, [E('td', {
			'class': 'td left'
		}, ['NR']), E('td', {
			'class': 'td left'
		}, [renderCurrentBands(data.current_nr_band)])])])]);
	},
	renderNetworkPrefer: function(prefer) {
		var mode = getRatMode(prefer.rat) || RAT_MODES[RAT_MODES.length - 1];
		var current = mode.title;
		if (prefer.preferredAct1 && ACT_LABELS[prefer.preferredAct1])
			current += ', ' + _('Preferred') + ': ' + ACT_LABELS[prefer.preferredAct1];
		if (prefer.preferredAct2 && ACT_LABELS[prefer.preferredAct2])
			current += ' > ' + ACT_LABELS[prefer.preferredAct2];
		return E('div', {
			'class': 'cbi-section'
		}, [E('h3', {}, [_('Network Preference')]), E('table', {
			'class': 'table'
		}, [E('tr', {
			'class': 'tr'
		}, [E('td', {
			'class': 'td left',
			'style': 'width:30%'
		}, [_('Current')]), E('td', {
			'class': 'td left'
		}, [current])])]), E('div', {
			'class': 'cbi-value'
		}, [E('label', {
			'class': 'cbi-value-title',
			'for': 'network-prefer-rat'
		}, [_('Network Mode')]), E('div', {
			'class': 'cbi-value-field'
		}, [E('select', {
			'id': 'network-prefer-rat',
			'class': 'cbi-input-select',
			'change': L.bind(this.updateNetworkPreferOptions, this)
		}, RAT_MODES.map(function(item) {
			return E('option', {
				'value': item.value,
				'selected': item.value === prefer.rat ? 'selected' : null
			}, [item.title]);
		}))])]), E('div', {
			'class': 'cbi-value'
		}, [E('label', {
			'class': 'cbi-value-title',
			'for': 'network-prefer-act1'
		}, [_('Preferred Act 1')]), E('div', {
			'class': 'cbi-value-field'
		}, [E('select', {
			'id': 'network-prefer-act1',
			'class': 'cbi-input-select',
			'change': L.bind(this.updateNetworkPreferOptions, this)
		}, buildActOptions(mode.acts, prefer.preferredAct1, ''))])]), E('div', {
			'class': 'cbi-value'
		}, [E('label', {
			'class': 'cbi-value-title',
			'for': 'network-prefer-act2'
		}, [_('Preferred Act 2')]), E('div', {
			'class': 'cbi-value-field'
		}, [E('select', {
			'id': 'network-prefer-act2',
			'class': 'cbi-input-select'
		}, buildActOptions(mode.acts, prefer.preferredAct2, prefer.preferredAct1))])]), E('div', {
			'class': 'cbi-value'
		}, [E('label', {
			'class': 'cbi-value-title'
		}), E('div', {
			'class': 'cbi-value-field'
		}, [E('button', {
			'class': 'cbi-button cbi-button-apply important',
			'click': ui.createHandlerFn(this, 'handleNetworkPreferSubmit')
		}, [_('Apply Network Preference')]), E('span', {
			'id': 'network-prefer-status',
			'class': 'ginfo-status',
			'style': 'margin-left:12px'
		})])])]);
	},
	renderGroup: function(group) {
		return E('div', {
			'class': 'cbi-section'
		}, [E('h3', {}, [group.title]), group.bands.length ? E('div', {
			'class': 'ginfo-band-list'
		}, group.bands.map(function(band) {
			return renderBandCheckbox(group, band);
		})) : E('div', {
			'class': 'cbi-section-descr'
		}, [_('No supported bands reported.')]), E('button', {
			'class': 'cbi-button cbi-button-action',
			'disabled': group.bands.length ? null : 'true',
			'click': L.bind(function() {
				this.handleSelectAll(group.rat);
			}, this)
		}, [_('Select All')]), E('button', {
			'class': 'cbi-button cbi-button-remove',
			'style': 'margin-left:8px',
			'disabled': group.bands.length ? null : 'true',
			'click': L.bind(function() {
				this.handleClearGroup(group.rat);
			}, this)
		}, [_('Clear')])]);
	},
	render: function(output) {
		var data = parseBandlock(output[0]);
		var networkPrefer = parseNetworkPrefer(output[1]);
		var groups = this.makeGroups(data);
		var sections = groups.map(this.renderGroup.bind(this));
		sections.unshift(E('h2', {
			'name': 'content'
		}, [_('Lock Band')]), E('div', {
			'class': 'cbi-map-descr'
		}, [_('Select WCDMA, LTE and NR bands to lock.')]));
		sections.splice(2, 0, this.renderCurrentSummary(data));
		sections.push(E('div', {
			'class': 'cbi-section'
		}, [E('button', {
			'class': 'cbi-button cbi-button-apply important',
			'click': ui.createHandlerFn(this, 'handleSubmit')
		}, [_('Submit')]), E('span', {
			'id': 'bandlock-status',
			'class': 'ginfo-status',
			'style': 'margin-left:12px'
		})]));
		sections.push(this.renderNetworkPrefer(networkPrefer));
		window.setTimeout(L.bind(function() {
			this.applyCurrentBands(data);
			this.updateNetworkPreferOptions();
		}, this), 0);
		return E('div', {
			'class': 'ginfo-page'
		}, [stylesheet(), E('div', {
			'class': 'cbi-map'
		}, sections)]);
	}
});
