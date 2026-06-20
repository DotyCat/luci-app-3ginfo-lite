'use strict';
'require view';
'require form';
'require uci';

function stylesheet() {
	return E('link', {
		'rel': 'stylesheet',
		'href': L.resource('view/modem/3ginfo-lite.css')
	});
}
return view.extend({
	load: function() {
		return uci.load('3ginfo_ttl');
	},
	render: function() {
		var m, s, o;
		m = new form.Map('3ginfo_ttl', _('TTL Configuration'), _('Configure TTL/Hop Limit settings to modify outgoing packet TTL values. This can help bypass carrier restrictions on tethering.'));
		s = m.section(form.NamedSection, 'main', 'main', _('Global TTL Settings'));
		s.anonymous = true;
		o = s.option(form.Flag, 'enable', _('Enable TTL Modification'));
		o.default = '0';
		o.rmempty = false;
		o.description = _('Enable or disable TTL/Hop Limit modification for outgoing packets.');
		o = s.option(form.Value, 'ttl', _('TTL Value'));
		o.datatype = 'range(1,255)';
		o.default = '64';
		o.placeholder = '64';
		o.rmempty = false;
		o.description = _('Set the TTL (Time To Live) value for IPv4 packets and Hop Limit for IPv6 packets. Common values: 64 (Linux default), 128 (Windows default).');
		s = m.section(form.NamedSection, 'main', 'main', _('Important Notes'));
		s.anonymous = true;
		o = s.option(form.DummyValue, '_warning');
		o.rawhtml = true;
		o.cfgvalue = function() {
			return E('div', {
				'class': 'cbi-value-description'
			}, [E('p', {
				'style': 'color:#c00;font-weight:bold'
			}, _('Warning:')), E('ul', {}, [E('li', {}, _('Enabling TTL modification will disable hardware flow offloading for proper packet modification.')), E('li', {}, _('This may affect network performance on some devices.')), E('li', {}, _('NSS ECM, SFE, and other acceleration modules will be disabled when TTL modification is active.')), E('li', {}, _('Settings will take effect after saving and applying changes.'))])]);
		};
		return Promise.resolve(m.render()).then(function(node) {
			return E('div', {
				'class': 'ginfo-page'
			}, [stylesheet(), node]);
		});
	}
});
