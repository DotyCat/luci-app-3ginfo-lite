'use strict';
'require view';
'require form';
'require fs';
'require uci';
'require ui';

function stylesheet() {
	return E('link', {
		'rel': 'stylesheet',
		'href': L.resource('view/modem/3ginfo-lite.css')
	});
}
return view.extend({
	load: function() {
		return uci.load('network');
	},
	restartWan: function() {
		ui.addNotification(null, E('p', {}, _('Restarting WAN...')));
		return fs.exec('/sbin/ifup', ['wan']).then(function() {
			ui.addNotification(null, E('p', {}, _('WAN restart command sent.')));
		}).catch(function(err) {
			ui.addNotification(null, E('p', {}, err.message || _('Failed to restart WAN.')));
		});
	},
	render: function() {
		var m, s, o;
		m = new form.Map('network', _('APN Dial Management'), _('Configure WAN APN dialing parameters from network.wan. Save and apply changes, then restart WAN for them to take effect.'));
		s = m.section(form.NamedSection, 'wan', 'interface', _('WAN APN Settings'));
		s.anonymous = true;
		o = s.option(form.Value, 'apn', _('APN'));
		o.rmempty = true;
		o = s.option(form.ListValue, 'auth', _('Authentication Type'));
		o.value('none', _('NONE'));
		o.value('pap', _('PAP'));
		o.value('chap', _('CHAP'));
		o.value('both', _('PAP/CHAP'));
		o.default = 'none';
		o.rmempty = false;
		o = s.option(form.Value, 'username', _('PAP/CHAP Username'));
		o.rmempty = true;
		o.depends('auth', 'pap');
		o.depends('auth', 'chap');
		o.depends('auth', 'both');
		o = s.option(form.Value, 'password', _('PAP/CHAP Password'));
		o.password = true;
		o.rmempty = true;
		o.depends('auth', 'pap');
		o.depends('auth', 'chap');
		o.depends('auth', 'both');
		o = s.option(form.ListValue, 'iptype', _('IP Type'));
		o.value('1', _('IPv4'));
		o.value('2', _('IPv6'));
		o.value('3', _('IPv4/IPv6'));
		o.default = '3';
		o.rmempty = false;
		o = s.option(form.Value, 'iaapn', _('IAAPN'));
		o.rmempty = true;
		o = s.option(form.ListValue, 'auto_conf', _('SIM Auto Configuration'));
		o.value('1', _('Yes'));
		o.value('0', _('No'));
		o.default = '1';
		o.rmempty = false;
		s = m.section(form.NamedSection, 'wan', 'interface', _('WAN Restart'));
		s.anonymous = true;
		o = s.option(form.Button, '_restart_wan', _('Restart WAN'));
		o.inputstyle = 'apply';
		o.description = _('Restart the WAN interface after saving and applying changes.');
		o.onclick = this.restartWan;
		return Promise.resolve(m.render()).then(function(node) {
			return E('div', {
				'class': 'ginfo-page'
			}, [stylesheet(), node]);
		});
	}
});
