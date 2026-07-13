// Background — side panel + inject on demand
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(function() {});

chrome.action.onClicked.addListener(function(tab) {
  chrome.sidePanel.open({ windowId: tab.windowId }).catch(function() {});
});

// Get current chat info from WhatsApp Web
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.type === 'getCurrentChat') {
    chrome.tabs.query({ url: '*://web.whatsapp.com/*', active: true }, function(tabs) {
      if (!tabs.length) return sendResponse({ ok: false, error: 'no WhatsApp tab' });
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getChatInfo
      }, function(results) {
        sendResponse({ ok: true, data: results && results[0] ? results[0].result : null });
      });
    });
    return true; // keep channel open for async
  }
});

// This function runs inside the WhatsApp Web page
function getChatInfo() {
  try {
    var store = window.Store;
    if (!store || !store.Chat) return { error: 'WhatsApp not loaded' };

    // Try to get active chat
    var chat = null;
    if (store.Chat.getActive) {
      chat = store.Chat.getActive();
    } else {
      var chats = store.Chat.getModelsArray ? store.Chat.getModelsArray() : [];
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].__x_isActive) { chat = chats[i]; break; }
      }
    }

    if (!chat) return { error: 'No active chat - click a conversation first' };

    var contact = chat.contact || chat.__x_contact;
    if (!contact) return { error: 'No contact info found' };

    var phone = '';
    if (contact.id && contact.id.user) phone = contact.id.user;
    else if (contact.id && contact.id._serialized) phone = contact.id._serialized.split('@')[0];

    var name = contact.name || contact.pushname || contact.verifiedName || contact.shortName || phone || '';

    // Country from phone prefix
    var country = getCountryFromPhone(phone);

    return { phone: phone, name: name, country: country };
  } catch(e) {
    return { error: String(e) };
  }
}

function getCountryFromPhone(phone) {
  if (!phone) return '';
  // Try to extract country code from phone number
  var match = phone.match(/^\+(\d{1,3})/);
  if (!match) return '';
  var code = match[1];
  var map = {
    '1': 'US/Canada', '20': 'Egypt', '211': 'South Sudan', '212': 'Morocco', '213': 'Algeria',
    '216': 'Tunisia', '218': 'Libya', '220': 'Gambia', '221': 'Senegal', '222': 'Mauritania',
    '223': 'Mali', '224': 'Guinea', '225': 'Ivory Coast', '226': 'Burkina Faso', '227': 'Niger',
    '228': 'Togo', '229': 'Benin', '230': 'Mauritius', '231': 'Liberia', '232': 'Sierra Leone',
    '233': 'Ghana', '234': 'Nigeria', '235': 'Chad', '236': 'CAR', '237': 'Cameroon',
    '238': 'Cape Verde', '239': 'Sao Tome', '240': 'Equatorial Guinea', '241': 'Gabon',
    '242': 'Congo', '243': 'DR Congo', '244': 'Angola', '245': 'Guinea-Bissau', '246': 'British IO',
    '247': 'Ascension', '248': 'Seychelles', '249': 'Sudan', '250': 'Rwanda', '251': 'Ethiopia',
    '252': 'Somalia', '253': 'Djibouti', '254': 'Kenya', '255': 'Tanzania', '256': 'Uganda',
    '257': 'Burundi', '258': 'Mozambique', '260': 'Zambia', '261': 'Madagascar', '262': 'Reunion',
    '263': 'Zimbabwe', '264': 'Namibia', '265': 'Malawi', '266': 'Lesotho', '267': 'Botswana',
    '268': 'Eswatini', '269': 'Comoros', '27': 'South Africa', '290': 'St Helena',
    '291': 'Eritrea', '297': 'Aruba', '298': 'Faroe Islands', '299': 'Greenland',
    '30': 'Greece', '31': 'Netherlands', '32': 'Belgium', '33': 'France', '34': 'Spain',
    '350': 'Gibraltar', '351': 'Portugal', '352': 'Luxembourg', '353': 'Ireland',
    '354': 'Iceland', '355': 'Albania', '356': 'Malta', '357': 'Cyprus', '358': 'Finland',
    '359': 'Bulgaria', '36': 'Hungary', '370': 'Lithuania', '371': 'Latvia', '372': 'Estonia',
    '373': 'Moldova', '374': 'Armenia', '375': 'Belarus', '376': 'Andorra', '377': 'Monaco',
    '378': 'San Marino', '379': 'Vatican', '380': 'Ukraine', '381': 'Serbia', '382': 'Montenegro',
    '383': 'Kosovo', '385': 'Croatia', '386': 'Slovenia', '387': 'Bosnia', '389': 'N Macedonia',
    '39': 'Italy', '40': 'Romania', '41': 'Switzerland', '420': 'Czech Republic', '421': 'Slovakia',
    '423': 'Liechtenstein', '43': 'Austria', '44': 'UK', '45': 'Denmark', '46': 'Sweden',
    '47': 'Norway', '48': 'Poland', '49': 'Germany', '500': 'Falkland Islands', '501': 'Belize',
    '502': 'Guatemala', '503': 'El Salvador', '504': 'Honduras', '505': 'Nicaragua',
    '506': 'Costa Rica', '507': 'Panama', '508': 'St Pierre', '509': 'Haiti', '51': 'Peru',
    '52': 'Mexico', '53': 'Cuba', '54': 'Argentina', '55': 'Brazil', '56': 'Chile',
    '57': 'Colombia', '58': 'Venezuela', '590': 'Guadeloupe', '591': 'Bolivia', '592': 'Guyana',
    '593': 'Ecuador', '594': 'French Guiana', '595': 'Paraguay', '596': 'Martinique',
    '597': 'Suriname', '598': 'Uruguay', '599': 'Curacao', '60': 'Malaysia', '61': 'Australia',
    '62': 'Indonesia', '63': 'Philippines', '64': 'New Zealand', '65': 'Singapore', '66': 'Thailand',
    '670': 'Timor-Leste', '672': 'Norfolk Island', '673': 'Brunei', '674': 'Nauru',
    '675': 'Papua New Guinea', '676': 'Tonga', '677': 'Solomon Islands', '678': 'Vanuatu',
    '679': 'Fiji', '680': 'Palau', '681': 'Wallis', '682': 'Cook Islands', '683': 'Niue',
    '685': 'Samoa', '686': 'Kiribati', '687': 'New Caledonia', '688': 'Tuvalu',
    '689': 'French Polynesia', '690': 'Tokelau', '691': 'Micronesia', '692': 'Marshall Islands',
    '7': 'Russia/Kazakhstan', '81': 'Japan', '82': 'South Korea', '84': 'Vietnam',
    '850': 'North Korea', '852': 'Hong Kong', '853': 'Macau', '855': 'Cambodia', '856': 'Laos',
    '86': 'China', '880': 'Bangladesh', '886': 'Taiwan', '90': 'Turkey', '91': 'India',
    '92': 'Pakistan', '93': 'Afghanistan', '94': 'Sri Lanka', '95': 'Myanmar',
    '960': 'Maldives', '961': 'Lebanon', '962': 'Jordan', '963': 'Syria', '964': 'Iraq',
    '965': 'Kuwait', '966': 'Saudi Arabia', '967': 'Yemen', '968': 'Oman', '970': 'Palestine',
    '971': 'UAE', '972': 'Israel', '973': 'Bahrain', '974': 'Qatar', '975': 'Bhutan',
    '976': 'Mongolia', '977': 'Nepal', '98': 'Iran', '992': 'Tajikistan', '993': 'Turkmenistan',
    '994': 'Azerbaijan', '995': 'Georgia', '996': 'Kyrgyzstan', '998': 'Uzbekistan'
  };
  for (var len = 3; len >= 1; len--) {
    var prefix = code.substring(0, len);
    if (map[prefix]) return map[prefix];
  }
  return '';
}
