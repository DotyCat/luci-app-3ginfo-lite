'use strict';'require baseclass';'require form';'require fs';'require view';'require ui';'require uci';'require poll';'require dom';'require tools.widgets as widgets';function csq_bar(v,m){var pg=document.querySelector('#csq')
var vn=parseInt(v)||0;var mn=parseInt(m)||100;var pc=Math.floor((100/mn)*vn);if(vn>=20&&vn<=31)
{pg.firstElementChild.style.background='lime';var tip=_('Very good');};if(vn>=14&&vn<=19)
{pg.firstElementChild.style.background='yellow';var tip=_('Good');};if(vn>=10&&vn<=13)
{pg.firstElementChild.style.background='darkorange';var tip=_('Weak');};if(vn<=9&&vn>=1)
{pg.firstElementChild.style.background='red';var tip=_('Very weak');};pg.firstElementChild.style.width=pc+'%';pg.style.width='33%';pg.setAttribute('title','%s'.format(v)+' | '+tip+' ');}
function rssi_bar(v,m){var pg=document.querySelector('#rssi')
var vn=parseInt(v)||0;var mn=parseInt(m)||100;if(vn>-50){vn=-50};if(vn<-110){vn=-110};var pc=Math.floor(100*(1-(-50-vn)/(-50-mn)));if(vn>-70)
{pg.firstElementChild.style.background='lime';var tip=_('Very good');};if(vn>=-85&&vn<=-70)
{pg.firstElementChild.style.background='yellow';var tip=_('Good');};if(vn>=-100&&vn<=-86)
{pg.firstElementChild.style.background='darkorange';var tip=_('Weak');};if(vn<-100)
{pg.firstElementChild.style.background='red';var tip=_('Very weak');};pg.firstElementChild.style.width=pc+'%';pg.style.width='33%';pg.firstElementChild.style.animationDirection="reverse";pg.setAttribute('title','%s'.format(v)+' | '+tip+' ');}
function rsrp_bar(v,m){var pg=document.querySelector('#rsrp')
var vn=parseInt(v)||0;var mn=parseInt(m)||100;if(vn>-50){vn=-50};if(vn<-140){vn=-140};var pc=Math.floor(120*(1-(-50-vn)/(-70-mn)));if(vn>=-80)
{pg.firstElementChild.style.background='lime';var tip=_('Very good');};if(vn>=-90&&vn<=-79)
{pg.firstElementChild.style.background='yellow';var tip=_('Good');};if(vn>=-100&&vn<=-89)
{pg.firstElementChild.style.background='darkorange';var tip=_('Weak');};if(vn<-100)
{pg.firstElementChild.style.background='red';var tip=_('Very weak');};pg.firstElementChild.style.width=pc+'%';pg.style.width='33%';pg.firstElementChild.style.animationDirection="reverse";pg.setAttribute('title','%s'.format(v)+' | '+tip+' ');}
function sinr_bar(v,m){var pg=document.querySelector('#sinr')
var vn=parseInt(v)||0;var mn=parseInt(m)||100;var pc=Math.floor(100-(100*(1-((mn-vn)/(mn-40)))));if(vn>20)
{pg.firstElementChild.style.background='lime';var tip=_('Excellent');};if(vn>=13&&vn<=20)
{pg.firstElementChild.style.background='yellow';var tip=_('Good');};if(vn>0&&vn<=12)
{pg.firstElementChild.style.background='darkorange';var tip=_('Mid cell');};if(vn<=0)
{pg.firstElementChild.style.background='red';var tip=_('Cell edge');};pg.firstElementChild.style.width=pc+'%';pg.style.width='33%';pg.firstElementChild.style.animationDirection="reverse";pg.setAttribute('title','%s'.format(v)+' | '+tip+' ');}
function rsrq_bar(v,m){var pg=document.querySelector('#rsrq')
var vn=parseInt(v)||0;var mn=parseInt(m)||100;var pc=Math.floor(115-(100/mn)*vn);if(vn>0){vn=0;};if(vn>=-10)
{pg.firstElementChild.style.background='lime';var tip=_('Excellent');};if(vn>=-15&&vn<=-9)
{pg.firstElementChild.style.background='yellow';var tip=_('Good');};if(vn>=-20&&vn<=-14)
{pg.firstElementChild.style.background='darkorange';var tip=_('Mid cell');};if(vn<-20)
{pg.firstElementChild.style.background='red';var tip=_('Cell edge');};pg.firstElementChild.style.width=pc+'%';pg.style.width='33%';pg.firstElementChild.style.animationDirection="reverse";pg.setAttribute('title','%s'.format(v)+' | '+tip+' ');}
function SIMdata(data){var sdata=JSON.parse(data);if(sdata.simslot.length>0){return ui.itemlist(E('span'),[_('SIM Slot'),sdata.simslot,_('SIM IMSI'),sdata.imsi,_('SIM ICCID'),sdata.iccid,_('Modem IMEI'),sdata.imei,_('Hint'),_('CLICK ME TO SEE NEW MENU')]);}
else{return ui.itemlist(E('span'),[_('SIM IMSI'),sdata.imsi,_('SIM ICCID'),sdata.iccid,_('Modem IMEI'),sdata.imei,_('Hint'),_('CLICK ME TO SEE NEW MENU')]);}}
function active_select(){uci.load('modemdefine').then(function(){var modemz=(uci.get('modemdefine','@modemdefine[1]','comm_port'));if(!modemz){document.getElementById("modc").disabled=true;}
else{document.getElementById("modc").disabled=false;}});}
function formatDuration(sec){if(sec==='-'){return'-';}
if(sec===''){return'-';}
var d=Math.floor(sec/86400),h=Math.floor(sec/3600)%24,m=Math.floor(sec/60)%60,s=sec%60;var time=d>0?d+'d ':'';if(time!==''){time+=h+'h ';}else{time=h>0?h+'h ':'';}
if(time!==''){time+=m+'m ';}else{time=m>0?m+'m ':'';}
time+=s+'s';return time;}
function formatDateTime(s){if(s.length==14){return s.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,"$1-$2-$3 $4:$5:$6");}else if(s.length==12){return s.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/,"$1-$2-$3 $4:$5");}else if(s.length==8){return s.replace(/(\d{4})(\d{2})(\d{2})/,"$1-$2-$3");}else if(s.length==6){return s.replace(/(\d{4})(\d{2})/,"$1-$2");}
return s;}
function checkOperatorName(t){var w=t.split(" ");var f={};for(var i=0;i<w.length;i++){var wo=w[i].toLowerCase();if(!f.hasOwnProperty(wo)){f[wo]=i;}}
var u=Object.keys(f).map(function(wo){return w[f[wo]];});var r=u.join(" ");return r;}
var dashboardStyle=`
.ginfo-dashboard {
 position: relative;
 margin: -0.25rem 0 1rem;
 padding: 16px;
 border-radius: 8px;
 background:
  linear-gradient(135deg, rgba(214, 252, 246, 0.92), rgba(242, 249, 252, 0.96) 38%, rgba(248, 250, 252, 0.98));
 color: #0f172a;
}

.ginfo-dashboard * {
 box-sizing: border-box;
}

.ginfo-topbar {
 display: flex;
 align-items: center;
 justify-content: space-between;
 gap: 12px;
 margin-bottom: 14px;
}

.ginfo-title {
 display: flex;
 flex-direction: column;
 gap: 4px;
 min-width: 0;
}

.ginfo-title strong {
 font-size: 19px;
 line-height: 1.2;
 font-weight: 800;
 color: #0f172a;
}

.ginfo-title span {
 font-size: 12px;
 color: #64748b;
}

.ginfo-actions {
 display: flex;
 align-items: center;
 gap: 8px;
 flex: 0 0 auto;
}

.ginfo-dashboard .ginfo-icon-button {
 display: inline-flex;
 align-items: center;
 justify-content: center;
 min-width: 38px;
 height: 36px;
 margin: 0 !important;
 border: 1px solid rgba(15, 23, 42, 0.08);
 border-radius: 8px;
 background: rgba(255, 255, 255, 0.88);
 box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
 color: #0f766e;
 font-weight: 800;
}

.ginfo-dashboard h4 {
 display: flex;
 align-items: center;
 gap: 8px;
 margin: 18px 0 10px;
 font-size: 15px;
 line-height: 1.25;
 font-weight: 800;
 color: #111827;
}

.ginfo-dashboard h4::before {
 content: "";
 display: inline-block;
 width: 5px;
 height: 16px;
 border-radius: 999px;
 background: #14b8a6;
}

.ginfo-dashboard h4:first-of-type {
 margin-top: 0;
}

.ginfo-dashboard table.table {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
 gap: 12px;
 width: 100%;
 margin: 0 0 18px;
 border: 0;
 background: transparent;
}

.ginfo-dashboard table.table tbody {
 display: contents;
}

.ginfo-dashboard table.table tr.tr {
 position: relative;
 display: flex;
 flex-direction: column;
 justify-content: flex-start;
 min-height: 78px;
 padding: 13px 14px;
 border: 1px solid rgba(15, 23, 42, 0.07);
 border-radius: 8px;
 background: rgba(255, 255, 255, 0.94);
 box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07);
 overflow: visible;
 transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
}

.ginfo-dashboard table.table tr.tr::after {
 content: "";
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 width: 3px;
 background: linear-gradient(180deg, #2dd4bf, #0ea5e9);
 opacity: 0.82;
}

.ginfo-dashboard table.table tr.tr:hover {
 transform: translateY(-1px);
 border-color: rgba(20, 184, 166, 0.26);
 box-shadow: 0 12px 26px rgba(15, 23, 42, 0.10);
}

.ginfo-dashboard table.table td.td {
 display: block;
 width: auto !important;
 padding: 0 !important;
 border: 0 !important;
 background: transparent !important;
}

.ginfo-dashboard table.table tr.tr > td.td:first-child {
 flex: 0 0 auto;
 margin-bottom: 8px;
 font-size: 11px;
 line-height: 1.35;
 font-weight: 700;
 letter-spacing: 0;
 color: #64748b;
}

.ginfo-dashboard table.table tr.tr > td.td:last-child {
 display: flex;
 flex: 1 1 auto;
 align-items: center;
 min-width: 0;
 min-height: 32px;
 font-size: 14px;
 line-height: 1.35;
 font-weight: 700;
 color: #0f172a;
 overflow-wrap: anywhere;
}

.ginfo-dashboard table.table tr.tr > td.td:last-child > .right,
.ginfo-dashboard table.table tr.tr > td.td:last-child > .cbi-progressbar {
 width: 100%;
}

.ginfo-dashboard table.table tr.tr > td.td:last-child > .ifacebadge {
 flex: 0 0 auto;
 margin-right: 8px !important;
}

.ginfo-dashboard .ginfo-duplex {
 display: grid;
 gap: 3px;
 width: 100%;
}

.ginfo-dashboard .ginfo-duplex-row {
 display: grid;
 grid-template-columns: 2.6em minmax(0, 1fr);
 column-gap: 4px;
 align-items: start;
}

.ginfo-dashboard .ginfo-duplex-label {
 font-weight: inherit;
 color: inherit;
}

.ginfo-dashboard .ginfo-duplex-value {
 min-width: 0;
 overflow-wrap: anywhere;
}

.ginfo-dashboard .ginfo-rx-grid {
 display: grid;
 gap: 3px;
 width: 100%;
}

.ginfo-dashboard .ginfo-rx-row {
 display: flex;
 align-items: baseline;
 gap: 8px;
 min-width: 0;
 overflow-wrap: anywhere;
}

.ginfo-dashboard .ginfo-rx-label {
 font-weight: inherit;
 color: inherit;
}

.ginfo-dashboard .ginfo-rx-value {
 color: inherit;
}

.ginfo-dashboard .ginfo-rx-separator {
 color: inherit;
}

.ginfo-dashboard #signal {
 font-size: 22px;
 line-height: 1.15;
 font-weight: 800;
 color: #059669;
}

.ginfo-dashboard #mode,
.ginfo-dashboard #protocol,
.ginfo-dashboard #sim,
.ginfo-dashboard #mccmnc {
 color: #0f766e;
}

.ginfo-dashboard #operator {
 font-size: 15px !important;
 font-weight: 800 !important;
 color: #0f172a;
}

.ginfo-dashboard #location {
 margin-top: 4px;
 font-size: 12px !important;
 font-weight: 600 !important;
 color: #64748b;
}

.ginfo-dashboard .ifacebadge {
 border: 0;
 border-radius: 8px;
 background: rgba(153, 246, 228, 0.58);
 box-shadow: none;
}

.ginfo-dashboard #simv {
 margin: 0 8px 0 0 !important;
}

.ginfo-dashboard #simv img {
 margin: 0 !important;
}

.ginfo-dashboard #simv .cbi-tooltip {
 z-index: 50;
}

.ginfo-dashboard .cbi-progressbar {
 width: 100% !important;
 height: 22px;
 margin-top: 2px;
 border: 0;
 border-radius: 999px;
 background: #e5edf5;
 box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.08);
 overflow: hidden;
 font-size: 11px;
 line-height: 22px;
 font-weight: 700;
 color: #0f172a;
 text-align: center;
}

.ginfo-dashboard .cbi-progressbar > div {
 height: 100%;
 border-radius: 999px;
 background: #14b8a6;
}

.ginfo-dashboard .cbi-progressbar::after {
 font-size: 11px;
 line-height: 22px;
}

@media (max-width: 720px) {
 .ginfo-dashboard {
  padding: 12px;
 }

 .ginfo-topbar {
  align-items: flex-start;
 }

 .ginfo-title strong {
  font-size: 19px;
 }

 .ginfo-dashboard table.table {
  grid-template-columns: 1fr;
  gap: 10px;
 }
}
`;function renderDuplexText(view,value){var text=value==null?'':String(value);var m=text.match(/^DL:\s*(.*?)\s+\|?\s*UL:\s*(.*)$/);if(!m){view.textContent=text;return;}
dom.content(view,E('div',{'class':'ginfo-duplex'},[E('div',{'class':'ginfo-duplex-row'},[E('span',{'class':'ginfo-duplex-label'},['DL:']),E('span',{'class':'ginfo-duplex-value'},[m[1]])]),E('div',{'class':'ginfo-duplex-row'},[E('span',{'class':'ginfo-duplex-label'},['UL:']),E('span',{'class':'ginfo-duplex-value'},[m[2]])])]));}
function renderRxText(view,value){var text=value==null?'':String(value);var parts=text.split('|').map(function(v){return v.trim();}).filter(function(v){return v!=='';});if(parts.length<2){view.textContent=text;return;}
var rows=[];parts.slice(0,4).forEach(function(v,i){if((i%2)===0)
rows.push([]);rows[rows.length-1].push({index:i,value:v});});dom.content(view,E('div',{'class':'ginfo-rx-grid'},rows.map(function(row){var children=[];row.forEach(function(item,idx){if(idx>0)
children.push(E('span',{'class':'ginfo-rx-separator'},['|']));children.push(E('span',{'class':'ginfo-rx-item'},[E('span',{'class':'ginfo-rx-label'},['RX%d: '.format(item.index)]),E('span',{'class':'ginfo-rx-value'},[item.value])]));});return E('div',{'class':'ginfo-rx-row'},children);})));}
return view.extend({modemDialog:baseclass.extend({__init__:function(title,description,callback){this.title=title;this.description=description;this.callback=callback;},load:function(){return uci.load('modemdefine');},render:function(content){var sections=uci.sections('modemdefine');var portM=sections.length;var result="";for(var i=1;i<portM;i++){result+=sections[i].comm_port+'_'+sections[i].network+'#'+sections[i].comm_port+' - '+sections[i].modem+' ('+sections[i].user_desc+');';}
var result=result.slice(0,-1);var result=result.replace("(undefined)","");ui.showModal(this.title,[E('div',{'class':'cbi-section'},[E('div',{'class':'cbi-section-descr'},this.description),E('div',{'class':'cbi-section'},E('p',{},E('div',{'class':'cbi-value'},[E('p'),E('label',{'class':'cbi-value-title'},[_('Modem')]),E('div',{'class':'cbi-value-field'},[E('select',{'class':'cbi-input-select','id':'mselect','style':'margin:0px 0; width:100%;',},(result||"").trim().split(/;/).map(function(cmd){var fields=cmd.split(/#/);var name=fields[1];var code=fields[0];return E('option',{'value':code},name)}))])]),)),]),E('div',{'class':'right'},[E('button',{'class':'btn','click':ui.createHandlerFn(this,this.handleDissmis),},_('Cancel')),' ',E('button',{'id':'btn_save','class':'btn cbi-button-positive important','click':ui.createHandlerFn(this,this.handleSave),},_('Save')),]),]);},handleSave:function(ev){return uci.load('modemdefine').then(function(){var vx=document.getElementById('mselect').value;var marr=vx.split('_');uci.set('modemdefine','@general[0]','main_modem',marr[0].toString());uci.set('modemdefine','@general[0]','main_network',marr[1].toString());uci.save();uci.apply();window.setTimeout(function(){if(!poll.active())poll.start();location.reload();},2000).finally();});},handleDissmis:function(ev){ui.hideModal();if(!poll.active())poll.start();},show:function(){ui.showModal(null,E('p',{'class':'spinning'},_('Loading')));poll.stop();this.load().then(content=>{ui.hideModal();return this.render(content);}).catch(e=>{ui.hideModal();return this.error(e);})},}),simDialog:baseclass.extend({__init__:function(title,description,callback){this.title=title;this.description=description;this.callback=callback;},load:function(){return L.resolveDefault(fs.exec_direct('/usr/share/3ginfo-lite/3ginfo.sh',['json']));},render:function(content){var json=JSON.parse(content);if(json){if(!json.imei.length>2){return false,poll.start()}}
ui.showModal(this.title,[E('div',{'class':'cbi-section'},[E('div',{'class':'cbi-section-descr'},this.description),E('div',{'class':'cbi-section'},E('p',{},E('div',{'class':'cbi-value'},[E('p'),E('label',{'class':'cbi-value-title'},[_('SIM IMSI')]),E('div',{'class':'cbi-value-field'},[E('input',{'class':'cbi-input-text','readonly':'readonly','value':json.imsi},null),]),E('label',{'class':'cbi-value-title'},[_('SIM ICCID')]),E('div',{'class':'cbi-value-field'},[E('input',{'class':'cbi-input-text','readonly':'readonly','value':json.iccid},null),]),E('label',{'class':'cbi-value-title'},[_('Modem IMEI')]),E('div',{'class':'cbi-value-field'},[E('input',{'class':'cbi-input-text','readonly':'readonly','value':json.imei},null),])]),)),]),E('div',{'class':'right'},[E('button',{'class':'btn','click':ui.createHandlerFn(this,this.handleDissmis),},_('Close')),]),]);},handleDissmis:function(ev){ui.hideModal();if(!poll.active())poll.start();},show:function(){ui.showModal(null,E('p',{'class':'spinning'},_('Loading')));poll.stop();this.load().then(content=>{ui.hideModal();return this.render(content);}).catch(e=>{ui.hideModal();return this.error(e);})},}),formdata:{threeginfo:{}},load:function(){return L.resolveDefault(fs.exec_direct('/usr/share/3ginfo-lite/3ginfo.sh',['json']));},render:function(data){var m,s,o;active_select();var upModemDialog=new this.modemDialog(_('Defined modems'),_('Interface for selecting user defined modems.'),);var upSIMDialog=new this.simDialog(_('SIM card menu'),_('Information read from the SIM card and device.'),);if(data!=null){try{var json=JSON.parse(data);if(!json.hasOwnProperty('error')){if(json.registration=='SIM not inserted'||json.registration=='-'){ui.addNotification(null,E('p',_('Problem with registering to the network, check the SIM card.')),'info');}
if(json.registration=='SIM PIN required'){ui.addNotification(null,E('p',_('SIM PIN required')),'info');}
if(json.registration=='SIM PUK required'){ui.addNotification(null,E('p',_('SIM PUK required')),'info');}
if(json.registration=='SIM failure'){ui.addNotification(null,E('p',_('SIM failure')),'info');}
if(json.registration=='SIM busy'){ui.addNotification(null,E('p',_('SIM busy')),'info');}
if(json.registration=='SIM wrong'){ui.addNotification(null,E('p',_('SIM wrong')),'info');}
if(json.registration=='SIM PIN2 required'){ui.addNotification(null,E('p',_('SIM PIN2 required')),'info');}
if(json.registration=='SIM PUK2 required'){ui.addNotification(null,E('p',_('SIM PUK2 required')),'info');}
if(json.signal=='0'||json.signal==''||json.signal=='-'){ui.addNotification(null,E('p',_('There is a problem reading data from the modem. \
          <br /><br /><b>Please check:</b> \
          <ul><li>1. Modem availability in the system.</li><li>2. The correct installation of the SIM card in the modem.</li><li> \
          3. Port for communication with the modem.</li><li><ul>')),'info');}
else{if(json.connt==''||json.connt=='-'){ui.addNotification(null,E('p',_('There is a problem reading connection data. \
           <br /><br /><b>Please check:</b> \
           <ul><li>1. Connection of the modem to the internet, the correctness of the entered APN. Some modems need to force the APN on the modem using at commands to connect to internet.</li><li> \
           2. Check that the correct interface assigned to the modem is selected. The default name of the interface in the package is wan.</li><li><ul>')),'info');}
pollData:poll.add(function(){return L.resolveDefault(fs.exec_direct('/usr/share/3ginfo-lite/3ginfo.sh','json')).then(function(res){var json=JSON.parse(res);if(!json.cport.includes('192.')){if(json.signal=='0'||json.signal==''){fs.exec('sleep 3');if(json.signal=='0'||json.signal==''||json.signal=='-'){L.ui.showModal(_('device-info'),[E('p',{'class':'spinning'},_('Waiting to read data from the modem...'))]);window.setTimeout(function(){location.reload();},5000).finally();}}
else{L.hideModal();}}
var icon,wicon,ticon,t;var wicon=L.resource('icons/loading.gif');var ticon=L.resource('icons/ctime.png');var p=(json.signal);if(p<0)
icon=L.resource('icons/3ginfo-0.png');else if(p==0)
icon=L.resource('icons/3ginfo-0.png');else if(p<20)
icon=L.resource('icons/3ginfo-0-20.png');else if(p<40)
icon=L.resource('icons/3ginfo-20-40.png');else if(p<60)
icon=L.resource('icons/3ginfo-40-60.png');else if(p<80)
icon=L.resource('icons/3ginfo-60-80.png');else
icon=L.resource('icons/3ginfo-80-100.png');if(document.getElementById('signal')){var view=document.getElementById("signal");view.innerHTML=String.format('<medium>%d%%</medium><br/>'+'<img style="padding-left: 10px;" src="%s"/>',p,icon);}
if(document.getElementById('connst')){var view=document.getElementById("connst");if(json.conn_time==''||json.conn_time=='-'){view.innerHTML=String.format('<img style="width: 16px; height: 16px; vertical-align: middle;" src="%s"/>'+' '+_('Waiting for connection data...'),wicon,p);}
else{view.innerHTML=String.format('<img style="width: 16px; height: 16px; vertical-align: middle;" src="%s"/>'+' '+formatDuration(json.conn_time_sec)+' '+' | \u25bc\u202f'+json.rx+' \u25b2\u202f'+json.tx,ticon,t);}}
if(document.getElementById('operator')){var view=document.getElementById("operator");if(!json.operator_name.length>1){view.textContent='-';}
else{view.textContent=checkOperatorName(json.operator_name);}}
if(document.getElementById('location')){var viewloc=document.getElementById("location");if(!json.location.length>2){viewloc.style.display='none';}
else{viewloc.innerHTML=json.location;}}
if(document.getElementById('sim')){var view=document.getElementById("sim");var sv=document.getElementById("simv");if(json.registration==''){view.textContent='-';}
else{sv.style.visibility="visible";view.textContent=json.registration;if(json.registration=='0'){view.textContent=_('Not registered');}
if(json.registration=='1'){view.textContent=_('Registered');}
if(json.registration=='2'){view.textContent=_('Searching..');}
if(json.registration=='3'){view.textContent=_('Registering denied');}
if(json.registration=='5'){view.textContent=_('Registered (roaming)');}
if(json.registration=='6'){view.textContent=_('Registered, only SMS');}
if(json.registration=='7'){view.textContent=_('Registered (roaming), only SMS');}}}
if(document.getElementById('roaming')){var view=document.getElementById("roaming");if(json.roaming=='1'){view.textContent=_('Roaming');}
else if(json.roaming=='0'){view.textContent=_('Home network');}
else{view.textContent='-';}}
if(document.getElementById('mode')){var view=document.getElementById("mode");if(!json.mode.length>1){view.textContent='-';}
else{view.textContent=json.mode;}}
if(document.getElementById('modem')){var view=document.getElementById("modem");if(!json.modem.length>1){view.textContent='-';}
else{view.textContent=json.modem;}}
if(document.getElementById('fw')){var view=document.getElementById("fw");if(!json.firmware.length>1){view.textContent='-';}
else{view.textContent=json.firmware;}}
if(document.getElementById('cport')){var view=document.getElementById("cport");if(!json.cport.length>1){view.textContent='-';}
else{view.textContent=json.cport;}}
if(document.getElementById('protocol')){var view=document.getElementById("protocol");if(!json.protocol.length>1){view.textContent='-';}
else{view.textContent=json.protocol;}}
if(document.getElementById('temp')){var view=document.getElementById("temp");var viewn=document.getElementById("tempn");var t=json.mtemp;if(!t.length>1&&t.includes(' ')||t==''||t=='-'){viewn.style.display='none';}
else{view.textContent=t.replace('&deg;','°');}}
if(document.getElementById('ambr')){var view=document.getElementById("ambr");var viewn=document.getElementById("ambr").parentElement;if(json.ambr==''||json.ambr=='-'){view.textContent='-';}else{renderDuplexText(view,json.ambr);viewn.style.display="";}}
if(document.getElementById('csq')){var view=document.getElementById("csq");if(json.signal==0||json.signal==''){view.style.visibility='hidden';}
else{if(json.csq==''){view.textContent='-';}
else{csq_bar(json.csq,31);}}}
if(document.getElementById('rssi')){var view=document.getElementById("rssi");if(json.rssi==''){view.style.visibility='hidden';}
else{view.style.visibility='visible';var z=json.rssi;if(z.includes('dBm')){var rssi_min=-110;rssi_bar(json.rssi,rssi_min);}
else{var rssi_min=-110;rssi_bar(json.rssi+" dBm",rssi_min);}}}
if(document.getElementById('rsrp')){var view=document.getElementById('rsrp');if(json.rsrp==''){view.style.visibility='hidden';}
else{view.style.visibility='visible';var z=json.rsrp;if(z.includes('dBm')){var rsrp_min=-140;rsrp_bar(json.rsrp,rsrp_min);}
else{var rsrp_min=-140;rsrp_bar(json.rsrp+" dBm",rsrp_min);}}}
if(document.getElementById('sinr')){var view=document.getElementById("sinr");if(json.sinr==''){view.style.visibility='hidden';}
else{view.style.visibility='visible';var z=json.sinr;if(z.includes('dB')){view.textContent=json.sinr;}
else{var sinr_min=-21;sinr_bar(json.sinr+" dB",sinr_min);}}}
if(document.getElementById('rsrq')){var view=document.getElementById("rsrq");if(json.rsrq==''){view.style.visibility='hidden';}
else{view.style.visibility='visible';var z=json.rsrq;if(z.includes('dB')){view.textContent=json.rsrq;}
else{var rsrq_min=-20;rsrq_bar(json.rsrq+" dB",rsrq_min);}}}
if(document.getElementById('mac_rate')){var view=document.getElementById('mac_rate');var viewn=document.getElementById('mac_rate').parentElement;if(json.mac_rate==''||json.mac_rate=='-'){view.textContent='-';viewn.style.display='none';}else{renderDuplexText(view,json.mac_rate);viewn.style.display='';}}
if(document.getElementById('prssi')){var view=document.getElementById('prssi');var viewn=document.getElementById('prssi').parentElement;if(json.prssi==''||json.prssi=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.prssi);}}
if(document.getElementById('prsrp')){var view=document.getElementById('prsrp');var viewn=document.getElementById('prsrp').parentElement;if(json.prsrp==''||json.prsrp=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.prsrp);}}
if(document.getElementById('psinr')){var view=document.getElementById('psinr');var viewn=document.getElementById('psinr').parentElement;if(json.psinr==''||json.psinr=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.psinr);}}
if(document.getElementById('pbw')){var view=document.getElementById('pbw');var viewn=document.getElementById('pbw').parentElement;if(json.pbw==''||json.pbw=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.pbw);}}
if(document.getElementById('pspeed')){var view=document.getElementById('pspeed');var viewn=document.getElementById('pspeed').parentElement;if(json.pspeed==''||json.pspeed=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.pspeed);}}
if(document.getElementById('pmcs')){var view=document.getElementById('pmcs');var viewn=document.getElementById('pmcs').parentElement;if(json.pmcs==''||json.pmcs=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.pmcs);}}
if(document.getElementById('ptwr')){var view=document.getElementById('ptwr');var viewn=document.getElementById('ptwr').parentElement;if(json.ptwr==''||json.ptwr=='-'){view.textContent='-';}else{viewn.style.display="";view.textContent=json.ptwr;}}
if(document.getElementById('s1rssi')){var view=document.getElementById('s1rssi');var viewn=document.getElementById('s1rssi').parentElement;if(json.s1rssi==''||json.s1rssi=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s1rssi);}}
if(document.getElementById('s1rsrp')){var view=document.getElementById('s1rsrp');var viewn=document.getElementById('s1rsrp').parentElement;if(json.s1rsrp==''||json.s1rsrp=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s1rsrp);}}
if(document.getElementById('s1sinr')){var view=document.getElementById('s1sinr');var viewn=document.getElementById('s1sinr').parentElement;if(json.s1sinr==''||json.s1sinr=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s1sinr);}}
if(document.getElementById('s1bw')){var view=document.getElementById('s1bw');var viewn=document.getElementById('s1bw').parentElement;if(json.s1bw==''||json.s1bw=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s1bw);}}
if(document.getElementById('s1speed')){var view=document.getElementById('s1speed');var viewn=document.getElementById('s1speed').parentElement;if(json.s1speed==''||json.s1speed=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s1speed);}}
if(document.getElementById('s1mcs')){var view=document.getElementById('s1mcs');var viewn=document.getElementById('s1mcs').parentElement;if(json.s1mcs==''||json.s1mcs=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s1mcs);}}
if(document.getElementById('s1twr')){var view=document.getElementById('s1twr');var viewn=document.getElementById('s1twr').parentElement;if(json.s1twr==''||json.s1twr=='-'){view.textContent='-';}else{viewn.style.display="";view.textContent=json.s1twr;}}
if(document.getElementById('s2rssi')){var view=document.getElementById('s2rssi');var viewn=document.getElementById('s2rssi').parentElement;if(json.s2rssi==''||json.s2rssi=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s2rssi);}}
if(document.getElementById('s2rsrp')){var view=document.getElementById('s2rsrp');var viewn=document.getElementById('s2rsrp').parentElement;if(json.s2rsrp==''||json.s2rsrp=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s2rsrp);}}
if(document.getElementById('s2sinr')){var view=document.getElementById('s2sinr');var viewn=document.getElementById('s2sinr').parentElement;if(json.s2sinr==''||json.s2sinr=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s2sinr);}}
if(document.getElementById('s2bw')){var view=document.getElementById('s2bw');var viewn=document.getElementById('s2bw').parentElement;if(json.s2bw==''||json.s2bw=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s2bw);}}
if(document.getElementById('s2speed')){var view=document.getElementById('s2speed');var viewn=document.getElementById('s2speed').parentElement;if(json.s2speed==''||json.s2speed=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s2speed);}}
if(document.getElementById('s2mcs')){var view=document.getElementById('s2mcs');var viewn=document.getElementById('s2mcs').parentElement;if(json.s2mcs==''||json.s2mcs=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s2mcs);}}
if(document.getElementById('s2twr')){var view=document.getElementById('s2twr');var viewn=document.getElementById('s2twr').parentElement;if(json.s2twr==''||json.s2twr=='-'){view.textContent='-';}else{viewn.style.display="";view.textContent=json.s2twr;}}
if(document.getElementById('s3rssi')){var view=document.getElementById('s3rssi');var viewn=document.getElementById('s3rssi').parentElement;if(json.s3rssi==''||json.s3rssi=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s3rssi);}}
if(document.getElementById('s3rsrp')){var view=document.getElementById('s3rsrp');var viewn=document.getElementById('s3rsrp').parentElement;if(json.s3rsrp==''||json.s3rsrp=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s3rsrp);}}
if(document.getElementById('s3sinr')){var view=document.getElementById('s3sinr');var viewn=document.getElementById('s3sinr').parentElement;if(json.s3sinr==''||json.s3sinr=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s3sinr);}}
if(document.getElementById('s3bw')){var view=document.getElementById('s3bw');var viewn=document.getElementById('s3bw').parentElement;if(json.s3bw==''||json.s3bw=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s3bw);}}
if(document.getElementById('s3speed')){var view=document.getElementById('s3speed');var viewn=document.getElementById('s3speed').parentElement;if(json.s3speed==''||json.s3speed=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s3speed);}}
if(document.getElementById('s3mcs')){var view=document.getElementById('s3mcs');var viewn=document.getElementById('s3mcs').parentElement;if(json.s3mcs==''||json.s3mcs=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s3mcs);}}
if(document.getElementById('s3twr')){var view=document.getElementById('s3twr');var viewn=document.getElementById('s3twr').parentElement;if(json.s3twr==''||json.s3twr=='-'){view.textContent='-';}else{viewn.style.display="";view.textContent=json.s3twr;}}
if(document.getElementById('s4rssi')){var view=document.getElementById('s4rssi');var viewn=document.getElementById('s4rssi').parentElement;if(json.s4rssi==''||json.s4rssi=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s4rssi);}}
if(document.getElementById('s4rsrp')){var view=document.getElementById('s4rsrp');var viewn=document.getElementById('s4rsrp').parentElement;if(json.s4rsrp==''||json.s4rsrp=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s4rsrp);}}
if(document.getElementById('s4sinr')){var view=document.getElementById('s4sinr');var viewn=document.getElementById('s4sinr').parentElement;if(json.s4sinr==''||json.s4sinr=='-'){view.textContent='-';}else{viewn.style.display="";renderRxText(view,json.s4sinr);}}
if(document.getElementById('s4bw')){var view=document.getElementById('s4bw');var viewn=document.getElementById('s4bw').parentElement;if(json.s4bw==''||json.s4bw=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s4bw);}}
if(document.getElementById('s4speed')){var view=document.getElementById('s4speed');var viewn=document.getElementById('s4speed').parentElement;if(json.s4speed==''||json.s4speed=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s4speed);}}
if(document.getElementById('s4mcs')){var view=document.getElementById('s4mcs');var viewn=document.getElementById('s4mcs').parentElement;if(json.s4mcs==''||json.s4mcs=='-'){view.textContent='-';}else{viewn.style.display="";renderDuplexText(view,json.s4mcs);}}
if(document.getElementById('s4twr')){var view=document.getElementById('s4twr');var viewn=document.getElementById('s4twr').parentElement;if(json.s4twr==''||json.s4twr=='-'){view.textContent='-';}else{viewn.style.display="";view.textContent=json.s4twr;}}
if(document.getElementById('mccmnc')){var view=document.getElementById("mccmnc");if(json.operator_mcc==''&json.operator_mnc==''){view.textContent='-';}
else{view.textContent=json.operator_mcc+" "+json.operator_mnc;}}
if(document.getElementById('lac')){var view=document.getElementById("lac");var viewn=document.getElementById("lacn");if(json.lac_dec.length<2||json.lac_hex.length<2){viewn.style.display="none";}
else{if(json.lac_dec==''||json.lac_hex==''){var lc=json.lac_dec+' '+json.lac_hex;var ld=lc.split(' ').join('');view.textContent=ld;}
else{view.innerHTML=json.lac_dec+' ('+json.lac_hex+')';}}}
if(document.getElementById('tac')){var view=document.getElementById("tac");var tac_dh,tac_dec_hex,lac_dec_hex;if(json.tac_d.length>1||json.tac_h.length>1){var tac_dh=json.tac_d+' ('+json.tac_h+')';view.textContent=tac_dh;}
else{if(json.tac_dec.length>1||json.tac_hex.length>1){var tac_dh=json.tac_dec+' ('+json.tac_hex+')';view.textContent=tac_dh;}
else{view.textContent='-';}}}
if(document.getElementById('cid')){var view=document.getElementById("cid");if(json.cid_dec==''||json.cid_hex==''){var cc=json.cid_hex+' '+json.cid_dec;var cd=cc.split(' ').join('');view.textContent=cd;}
else{view.innerHTML=json.cid_dec+' ('+''+json.cid_hex+')';}}
if(document.getElementById('pband')){var view=document.getElementById("pband");if(json.pband==''||json.pband.includes('-')){view.textContent='-';}
else{if(json.pci.length>0&&json.earfcn.length>0){view.textContent=json.pband+' | '+json.pci+' '+json.earfcn;}
else{view.textContent=json.pband;}}}
if(document.getElementById('s1band')){var view=document.getElementById("s1band");var viewn=document.getElementById("s1band").parentElement;if(json.s1band==''||json.s1band.includes('-')){view.textContent='-';viewn.style.display="none";}
else{viewn.style.display="";if(json.s1pci.length>0&&json.s1earfcn.length>0){view.textContent=json.s1band+' | '+json.s1pci+' '+json.s1earfcn;}
else{view.textContent=json.s1band;}}}
if(document.getElementById('s2band')){var view=document.getElementById("s2band");var viewn=document.getElementById("s2band").parentElement;if(json.s2band==''||json.s2band.includes('-')){view.textContent='-';viewn.style.display="none";}
else{viewn.style.display="";if(json.s2pci.length>0&&json.s2earfcn.length>0){view.textContent=json.s2band+' | '+json.s2pci+' '+json.s2earfcn;}
else{view.textContent=json.s2band;}}}
if(document.getElementById('s3band')){var view=document.getElementById("s3band");var viewn=document.getElementById("s3band").parentElement;if(json.s3band==''||json.s3band.includes('-')){view.textContent='-';viewn.style.display="none";}
else{viewn.style.display="";if(json.s3pci.length>0&&json.s3earfcn.length>0){view.textContent=json.s3band+' | '+json.s3pci+' '+json.s3earfcn;}
else{view.textContent=json.s3band;}}}
if(document.getElementById('s4band')){var view=document.getElementById("s4band");var viewn=document.getElementById("s4band").parentElement;if(json.s4band==''||json.s4band.includes('-')){view.textContent='-';viewn.style.display="none";}
else{viewn.style.display="";if(json.s4pci.length>0&&json.s4earfcn.length>0){view.textContent=json.s4band+' | '+json.s4pci+' '+json.s4earfcn;}
else{view.textContent=json.s4band;}}}});});}}}catch(err){ui.addNotification(null,E('p',_('Error: ')+err.message),'error');}}
m=new form.JSONMap(this.formdata,_('device-info'));s=m.section(form.TypedSection,'3ginfo','',null);s.anonymous=true;s.render=L.bind(function(view,section_id){return E('div',{'class':'cbi-section ginfo-dashboard'},[E('style',{},[dashboardStyle]),E('div',{'class':'ginfo-topbar'},[E('div',{'class':'ginfo-title'},[E('strong',{},[_('')]),E('span',{},[_('Modem status and cellular information')]),]),E('div',{'class':'ginfo-actions'},[E('button',{'id':'modc','disabled':'true','data-tooltip':_('Modem selection menu'),'class':'btn cbi-button ginfo-icon-button','click':ui.createHandlerFn(this,function(){return upModemDialog.show();}),},_('☰')),]),]),E('h4',{},[_('General Information')]),E('table',{'class':'table'},[E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('Signal strength')]),E('td',{'class':'td left','id':'signal'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('Operator')]),E('td',{'class':'td left'},[E('div',{'class':'right'},[E('div',{'style':'text-align:left;font-size:100%','id':'operator'},['-']),E('div',{'style':'text-align:left;font-size:66%','id':'location'},['-']),]),]),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('SIM status')]),E('td',{'class':'td left'},[E('span',{'class':'ifacebadge','title':null,'id':'simv','style':'visibility: hidden; padding: 4px;','click':ui.createHandlerFn(this,function(){return upSIMDialog.show();}),},[E('div',{'class':'ifacebox-body'},[E('div',{'class':'cbi-tooltip-container'},[E('img',{'src':L.resource('icons/sim1m.png'),'style':'width:24px; height:auto; padding: 1%;','title':_(''),'class':'middle',}),E('span',{'class':'cbi-tooltip','style':'text-align:left;font-size:80%'},SIMdata(data)),]),]),]),E('normal',{'id':'sim','style':'margin-left: 0.5em;'},['-']),]),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('Roaming status')]),E('td',{'class':'td left','id':'roaming'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('Connection statistics')]),E('td',{'class':'td left','id':'connst'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('Technology')]),E('td',{'class':'td left','id':'mode'},['-']),]),]),E('h4',{},[_('Modem Information')]),E('table',{'class':'table'},[E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('Modem type')]),E('td',{'class':'td left','id':'modem'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('Revision / Firmware')]),E('td',{'class':'td left','id':'fw'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('IP adress / Communication Port')]),E('td',{'class':'td left','id':'cport'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('Protocol')]),E('td',{'class':'td left','id':'protocol'},['-']),]),E('tr',{'id':'tempn','class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('Chip Temperature')]),E('td',{'class':'td left','id':'temp'},['-']),]),]),E('h4',{},[_('Cell / Signal Information')]),E('table',{'class':'table'},[E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('MCC MNC')]),E('td',{'class':'td left','id':'mccmnc'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('Cell ID')]),E('td',{'class':'td left','id':'cid'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('TAC')]),E('td',{'class':'td left','id':'tac'},['-']),]),E('tr',{'id':'lacn','class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('LAC')]),E('td',{'class':'td left','id':'lac'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('AMBR')]),E('td',{'class':'td left','id':'ambr'},['-']),]),E('tr',{'id':'csqn','class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('CSQ'),E('div',{'style':'text-align:left;font-size:66%'},[_('(Signal Strength)')]),]),E('td',{'class':'td'},E('div',{'id':'csq','class':'cbi-progressbar','title':'-'},E('div')))]),E('tr',{'id':'rssin','class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('RSSI'),E('div',{'style':'text-align:left;font-size:66%'},[_('(Received Signal Strength Indicator)')]),]),E('td',{'class':'td'},E('div',{'id':'rssi','class':'cbi-progressbar','title':'-'},E('div')))]),E('tr',{'id':'rsrpn','class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('RSRP'),E('div',{'style':'text-align:left;font-size:66%'},[_('(Reference Signal Receive Power)')]),]),E('td',{'class':'td'},E('div',{'id':'rsrp','class':'cbi-progressbar','title':'-'},E('div')))]),E('tr',{'id':'sinrn','class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('SINR'),E('div',{'style':'text-align:left;font-size:66%'},[_('(Signal to Interference plus Noise Ratio)')]),]),E('td',{'class':'td'},E('div',{'id':'sinr','class':'cbi-progressbar','title':'-'},E('div')))]),E('tr',{'id':'rsrqn','class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('RSRQ'),E('div',{'style':'text-align:left;font-size:66%'},[_('(Reference Signal Received Quality)')]),]),E('td',{'class':'td'},E('div',{'id':'rsrq','class':'cbi-progressbar','title':'-'},E('div')))]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('MAC rate')]),E('td',{'class':'td left','id':'mac_rate'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('Primary (PCC) BAND | PCI & EARFCN')]),E('td',{'class':'td left','id':'pband'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('Primary (PCC) RSSI')]),E('td',{'class':'td left','id':'prssi'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('Primary (PCC) RSRP')]),E('td',{'class':'td left','id':'prsrp'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('Primary (PCC) SINR')]),E('td',{'class':'td left','id':'psinr'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('Primary (PCC) BandWidth & RB Number')]),E('td',{'class':'td left','id':'pbw'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('Primary (PCC) NetSpeed')]),E('td',{'class':'td left','id':'pspeed'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('Primary (PCC) MIMO & MCS & Modulation')]),E('td',{'class':'td left','id':'pmcs'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('Primary (PCC) PUCCH & PUSCH TX Power')]),E('td',{'class':'td left','id':'ptwr'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('CA (SCC1) BAND | PCI & EARFCN')]),E('td',{'class':'td left','id':'s1band'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC1) RSSI')]),E('td',{'class':'td left','id':'s1rssi'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC1) RSRP')]),E('td',{'class':'td left','id':'s1rsrp'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC1) SINR')]),E('td',{'class':'td left','id':'s1sinr'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC1) BandWidth & RB Number')]),E('td',{'class':'td left','id':'s1bw'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC1) NetSpeed')]),E('td',{'class':'td left','id':'s1speed'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC1) MIMO & MCS & Modulation')]),E('td',{'class':'td left','id':'s1mcs'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC1) PUCCH & PUSCH TX Power')]),E('td',{'class':'td left','id':'s1twr'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('CA (SCC2) BAND | PCI & EARFCN')]),E('td',{'class':'td left','id':'s2band'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC2) RSSI')]),E('td',{'class':'td left','id':'s2rssi'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC2) RSRP')]),E('td',{'class':'td left','id':'s2rsrp'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC2) SINR')]),E('td',{'class':'td left','id':'s2sinr'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC2) BandWidth & RB Number')]),E('td',{'class':'td left','id':'s2bw'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC2) NetSpeed')]),E('td',{'class':'td left','id':'s2speed'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC2) MIMO & MCS & Modulation')]),E('td',{'class':'td left','id':'s2mcs'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC2) PUCCH & PUSCH TX Power')]),E('td',{'class':'td left','id':'s2twr'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('CA (SCC3) BAND | PCI & EARFCN')]),E('td',{'class':'td left','id':'s3band'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC3) RSSI')]),E('td',{'class':'td left','id':'s3rssi'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC3) RSRP')]),E('td',{'class':'td left','id':'s3rsrp'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC3) SINR')]),E('td',{'class':'td left','id':'s3sinr'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC3) BandWidth & RB Number')]),E('td',{'class':'td left','id':'s3bw'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC3) NetSpeed')]),E('td',{'class':'td left','id':'s3speed'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC3) MIMO & MCS & Modulation ')]),E('td',{'class':'td left','id':'s3mcs'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC3) PUCCH & PUSCH TX Power')]),E('td',{'class':'td left','id':'s3twr'},['-']),]),E('tr',{'class':'tr'},[E('td',{'class':'td left','width':'33%'},[_('CA (SCC4) BAND | PCI & EARFCN')]),E('td',{'class':'td left','id':'s4band'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC4) RSSI')]),E('td',{'class':'td left','id':'s4rssi'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC4) RSRP')]),E('td',{'class':'td left','id':'s4rsrp'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC4) SINR')]),E('td',{'class':'td left','id':'s4sinr'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC4) BandWidth & RB Number')]),E('td',{'class':'td left','id':'s4bw'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC4) NetSpeed')]),E('td',{'class':'td left','id':'s4speed'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC4) MIMO & MCS & Modulation ')]),E('td',{'class':'td left','id':'s4mcs'},['-']),]),E('tr',{'class':'tr','style':'display: none;'},[E('td',{'class':'td left','width':'33%'},[_('CA (SSC4) PUCCH & PUSCH TX Power')]),E('td',{'class':'td left','id':'s4twr'},['-']),]),])]);},o,this);return m.render();},handleSaveApply:null,handleSave:null,handleReset:null});