var RuleEngine = require('node-rules');
var fs = require('fs');
var rulesStore = fs.readFileSync('rules.json', 'utf8');
 
var rules = [{
    "condition": function(R) {
        R.when(this && ! this.processed);
    },
    "consequence": function(R) {
		this.processed = true;
		this.roles = {};
        this.roles['Citation'] = 0;
        this.roles['Copyright'] = 0;
        this.roles['TitleBanner'] = 0;
        this.roles['Label'] = 0;
        this.roles['Caption'] = 0;
        this.roles['Separator'] = 0;
        this.roles['Advertisement'] = 0;
        this.roles['Icon'] = 0;
        this.roles['Title'] = 0;
        this.roles['Interaction'] = 0;
        this.roles['Logo'] = 0;
        this.roles['Link'] = 0;
        this.roles['SpecialGraphic'] = 0;
        this.roles['MenuItem'] = 0;
        this.roles['Header'] = 0;
        this.roles['Article'] = 0;
        this.roles['ComplementaryContent'] = 0;
        this.roles['Figure'] = 0;
        this.roles['LinkMenu'] = 0;
        this.roles['SearchEngine'] = 0;
        this.roles['Container'] = 0;
        this.roles['Toolbar'] = 0;
        this.roles['Footer'] = 0;
        this.roles['List'] = 0;
        this.roles['BreadcrumbTrail'] = 0;
        this.roles['Sidebar'] = 0;
		
		this.reason = {};
		this.reason['Citation'] = [];
        this.reason['Copyright'] = [];
        this.reason['TitleBanner'] = [];
        this.reason['Label'] = [];
        this.reason['Caption'] = [];
        this.reason['Separator'] = [];
        this.reason['Advertisement'] = [];
        this.reason['Icon'] = [];
        this.reason['Title'] = [];
        this.reason['Interaction'] = [];
        this.reason['Logo'] = [];
        this.reason['Link'] = [];
        this.reason['SpecialGraphic'] = [];
        this.reason['MenuItem'] = [];
        this.reason['Header'] = [];
        this.reason['Article'] = [];
        this.reason['ComplementaryContent'] = [];
        this.reason['Figure'] = [];
        this.reason['LinkMenu'] = [];
        this.reason['SearchEngine'] = [];
        this.reason['Container'] = [];
        this.reason['Toolbar'] = [];
        this.reason['Footer'] = [];
        this.reason['List'] = [];
        this.reason['BreadcrumbTrail'] = [];
        this.reason['Sidebar'] = [];
		R.next();
    },
	"priority": 10
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag === '|body|');
	},
	"consequence": function(R) {
		this.roles['BODY'] += 1000;
		R.next();
	},
	"priority": 1,
	"name": 'BODY'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['Citation'].push('doc:11');
		this.roles['Citation'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Citation00'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|cite|') > -1);
	},
	"consequence": function(R) {
		this.reason['Citation'].push('hasTag:cite');
		this.roles['Citation'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Citation01'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|blockquote|') > -1);
	},
	"consequence": function(R) {
		this.reason['Citation'].push('hasTag:blockquote');
		this.roles['Citation'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Citation02'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|q|') > -1);
	},
	"consequence": function(R) {
		this.reason['Citation'].push('hasTag:q');
		this.roles['Citation'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Citation03'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['Citation'].push('isAtomic:1');
		this.roles['Citation'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Citation04'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('cite') > -1);
	},
	"consequence": function(R) {
		this.reason['Citation'].push('hasId:cite');
		this.roles['Citation'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Citation05'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('citation') > -1);
	},
	"consequence": function(R) {
		this.reason['Citation'].push('hasId:citation');
		this.roles['Citation'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Citation06'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('quotation') > -1);
	},
	"consequence": function(R) {
		this.reason['Citation'].push('hasId:quotation');
		this.roles['Citation'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Citation07'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('quote') > -1);
	},
	"consequence": function(R) {
		this.reason['Citation'].push('hasId:quote');
		this.roles['Citation'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Citation08'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('doc:11');
		this.roles['Copyright'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright00'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 10);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('doc:10');
		this.roles['Copyright'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright01'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('all_rights_reserved') > -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('hasKeyword:all_rights_reserved');
		this.roles['Copyright'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright02'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('©') > -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('hasKeyword:©');
		this.roles['Copyright'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright03'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('copyright') > -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('hasKeyword:copyright');
		this.roles['Copyright'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright04'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('privacy') > -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('hasKeyword:privacy');
		this.roles['Copyright'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright05'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('policy') > -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('hasKeyword:policy');
		this.roles['Copyright'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright06'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('terms_of_service') > -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('hasKeyword:terms_of_service');
		this.roles['Copyright'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright07'
}, {
	"condition": function(R) {
		R.when(this && this.fontSize && this.fontSize === 0);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('fontSize:0');
		this.roles['Copyright'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright08'
}, {
	"condition": function(R) {
		R.when(this && this.fontSize && this.fontSize === -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('fontSize:-1');
		this.roles['Copyright'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright09'
}, {
	"condition": function(R) {
		R.when(this && this.wordCount && this.wordCount.indexOf('medium') > -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('wordCount:medium');
		this.roles['Copyright'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright010'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('footer') > -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('hasParent:footer');
		this.roles['Copyright'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright011'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('isAtomic:1');
		this.roles['Copyright'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright012'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('copyright') > -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('hasId:copyright');
		this.roles['Copyright'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright013'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('short') > -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('relativeSize:short');
		this.roles['Copyright'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright014'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['Copyright'].push('relativeSize:medium_length');
		this.roles['Copyright'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Copyright015'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('header') > -1);
	},
	"consequence": function(R) {
		this.reason['TitleBanner'].push('hasParent:header');
		this.roles['TitleBanner'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'TitleBanner00'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['TitleBanner'].push('doc:11');
		this.roles['TitleBanner'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'TitleBanner01'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('atom') > -1);
	},
	"consequence": function(R) {
		this.reason['TitleBanner'].push('hasChild:atom');
		this.roles['TitleBanner'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'TitleBanner02'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('link') > -1);
	},
	"consequence": function(R) {
		this.reason['TitleBanner'].push('hasChild:link');
		this.roles['TitleBanner'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'TitleBanner03'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('logo') > -1);
	},
	"consequence": function(R) {
		this.reason['TitleBanner'].push('hasChild:logo');
		this.roles['TitleBanner'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'TitleBanner04'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 1);
	},
	"consequence": function(R) {
		this.reason['TitleBanner'].push('hasBackground:1');
		this.roles['TitleBanner'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'TitleBanner05'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['Label'].push('doc:11');
		this.roles['Label'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Label00'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 10);
	},
	"consequence": function(R) {
		this.reason['Label'].push('doc:10');
		this.roles['Label'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Label01'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('label') > -1);
	},
	"consequence": function(R) {
		this.reason['Label'].push('hasId:label');
		this.roles['Label'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Label02'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['Label'].push('isAtomic:1');
		this.roles['Label'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Label03'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('for') > -1);
	},
	"consequence": function(R) {
		this.reason['Label'].push('hasAttribute:for');
		this.roles['Label'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Label04'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|label|') > -1);
	},
	"consequence": function(R) {
		this.reason['Label'].push('mustHaveTag:label');
		this.roles['Label'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Label05'
}, {
	"condition": function(R) {
		R.when(this && this.hasSibling && this.hasSibling.indexOf('interaction') > -1);
	},
	"consequence": function(R) {
		this.reason['Label'].push('hasSibling:interaction');
		this.roles['Label'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Label06'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('short') > -1);
	},
	"consequence": function(R) {
		this.reason['Label'].push('relativeSize:short');
		this.roles['Label'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Label07'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('narrow') > -1);
	},
	"consequence": function(R) {
		this.reason['Label'].push('relativeSize:narrow');
		this.roles['Label'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Label08'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['Caption'].push('doc:11');
		this.roles['Caption'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Caption00'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|img|') > -1);
	},
	"consequence": function(R) {
		this.reason['Caption'].push('hasTag:img');
		this.roles['Caption'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Caption01'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|caption|') > -1);
	},
	"consequence": function(R) {
		this.reason['Caption'].push('hasTag:caption');
		this.roles['Caption'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Caption02'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['Caption'].push('isAtomic:1');
		this.roles['Caption'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Caption03'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('cap') > -1);
	},
	"consequence": function(R) {
		this.reason['Caption'].push('hasId:cap');
		this.roles['Caption'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Caption04'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('caption') > -1);
	},
	"consequence": function(R) {
		this.reason['Caption'].push('hasId:caption');
		this.roles['Caption'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Caption05'
}, {
	"condition": function(R) {
		R.when(this && this.hasOrder && this.hasOrder === 1);
	},
	"consequence": function(R) {
		this.reason['Caption'].push('hasOrder:1');
		this.roles['Caption'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Caption06'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['Separator'].push('doc:11');
		this.roles['Separator'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Separator00'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('list') > -1);
	},
	"consequence": function(R) {
		this.reason['Separator'].push('hasParent:list');
		this.roles['Separator'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Separator01'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['Separator'].push('isAtomic:1');
		this.roles['Separator'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Separator02'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|img|') > -1);
	},
	"consequence": function(R) {
		this.reason['Separator'].push('hasTag:img');
		this.roles['Separator'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Separator03'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|hr|') > -1);
	},
	"consequence": function(R) {
		this.reason['Separator'].push('hasTag:hr');
		this.roles['Separator'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Separator04'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|br|') > -1);
	},
	"consequence": function(R) {
		this.reason['Separator'].push('hasTag:br');
		this.roles['Separator'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Separator05'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('sponsored') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasId:sponsored');
		this.roles['Advertisement'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement00'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('ads') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasId:ads');
		this.roles['Advertisement'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement01'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('advertisement') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasId:advertisement');
		this.roles['Advertisement'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement02'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('advert') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasId:advert');
		this.roles['Advertisement'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement03'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('doc:11');
		this.roles['Advertisement'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement04'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('link') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasChild:link');
		this.roles['Advertisement'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement05'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('right') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('inPosition:right');
		this.roles['Advertisement'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement06'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('left') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('inPosition:left');
		this.roles['Advertisement'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement07'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('sponsored') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasKeyword:sponsored');
		this.roles['Advertisement'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement08'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('advertisement') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasKeyword:advertisement');
		this.roles['Advertisement'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement09'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|iframe|') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasTag:iframe');
		this.roles['Advertisement'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement010'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|img|') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasTag:img');
		this.roles['Advertisement'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement011'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|a|') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasTag:a');
		this.roles['Advertisement'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement012'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|object|') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasTag:object');
		this.roles['Advertisement'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement013'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('isAtomic:1');
		this.roles['Advertisement'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement014'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_height') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('relativeSize:medium_height');
		this.roles['Advertisement'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement015'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('970x250') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:970x250');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement016'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('970x550') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:970x550');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement017'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('728x90') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:728x90');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement018'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('120x60') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:120x60');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement019'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('300x1050') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:300x1050');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement020'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('850x550') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:850x550');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement021'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('970x415') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:970x415');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement022'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('300x250') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:300x250');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement023'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('180x150') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:180x150');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement024'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('970x90') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:970x90');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement025'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('160x600') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:160x600');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement026'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('88x31') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:88x31');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement027'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('300x600') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:300x600');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement028'
}, {
	"condition": function(R) {
		R.when(this && this.hasSize && this.hasSize.indexOf('550x480') > -1);
	},
	"consequence": function(R) {
		this.reason['Advertisement'].push('hasSize:550x480');
		this.roles['Advertisement'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Advertisement029'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|a|') > -1);
	},
	"consequence": function(R) {
		this.reason['Icon'].push('hasTag:a');
		this.roles['Icon'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Icon00'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['Icon'].push('doc:11');
		this.roles['Icon'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Icon01'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('alt') > -1);
	},
	"consequence": function(R) {
		this.reason['Icon'].push('hasAttribute:alt');
		this.roles['Icon'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Icon02'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('title') > -1);
	},
	"consequence": function(R) {
		this.reason['Icon'].push('hasAttribute:title');
		this.roles['Icon'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Icon03'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('hover') > -1);
	},
	"consequence": function(R) {
		this.reason['Icon'].push('hasAttribute:hover');
		this.roles['Icon'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Icon04'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['Icon'].push('isAtomic:1');
		this.roles['Icon'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Icon05'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('icon') > -1);
	},
	"consequence": function(R) {
		this.reason['Icon'].push('hasId:icon');
		this.roles['Icon'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Icon06'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|img|') > -1);
	},
	"consequence": function(R) {
		this.reason['Icon'].push('mustHaveTag:img');
		this.roles['Icon'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Icon07'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 1);
	},
	"consequence": function(R) {
		this.reason['Icon'].push('hasBackground:1');
		this.roles['Icon'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Icon08'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('short') > -1);
	},
	"consequence": function(R) {
		this.reason['Icon'].push('relativeSize:short');
		this.roles['Icon'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Icon09'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('narrow') > -1);
	},
	"consequence": function(R) {
		this.reason['Icon'].push('relativeSize:narrow');
		this.roles['Icon'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Icon010'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['Title'].push('doc:11');
		this.roles['Title'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Title00'
}, {
	"condition": function(R) {
		R.when(this && this.fontWeight && this.fontWeight === 1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('fontWeight:1');
		this.roles['Title'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Title01'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('header') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('hasParent:header');
		this.roles['Title'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Title02'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('article') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('hasParent:article');
		this.roles['Title'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Title03'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('link') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('hasChild:link');
		this.roles['Title'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Title04'
}, {
	"condition": function(R) {
		R.when(this && this.hasOrder && this.hasOrder === 1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('hasOrder:1');
		this.roles['Title'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Title05'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('hasBackground:1');
		this.roles['Title'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Title06'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|h4|') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('mustHaveTag:h4');
		this.roles['Title'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Title07'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|h3|') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('mustHaveTag:h3');
		this.roles['Title'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Title08'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|h6|') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('mustHaveTag:h6');
		this.roles['Title'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Title09'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|h5|') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('mustHaveTag:h5');
		this.roles['Title'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Title010'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|h1|') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('mustHaveTag:h1');
		this.roles['Title'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Title011'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|strong|') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('mustHaveTag:strong');
		this.roles['Title'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Title012'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|h2|') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('mustHaveTag:h2');
		this.roles['Title'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Title013'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('short') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('relativeSize:short');
		this.roles['Title'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Title014'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('narrow') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('relativeSize:narrow');
		this.roles['Title'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Title015'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('relativeSize:medium_length');
		this.roles['Title'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Title016'
}, {
	"condition": function(R) {
		R.when(this && this.wordCount && this.wordCount.indexOf('few') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('wordCount:few');
		this.roles['Title'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Title017'
}, {
	"condition": function(R) {
		R.when(this && this.wordCount && this.wordCount.indexOf('medium') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('wordCount:medium');
		this.roles['Title'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Title018'
}, {
	"condition": function(R) {
		R.when(this && this.fontSize && this.fontSize === 1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('fontSize:1');
		this.roles['Title'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Title019'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|p|') > -1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('hasTag:p');
		this.roles['Title'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Title020'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['Title'].push('isAtomic:1');
		this.roles['Title'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Title021'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|a|') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasTag:a');
		this.roles['Interaction'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction00'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('doc:11');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction01'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 10);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('doc:10');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction02'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('create') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasKeyword:create');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction03'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('submit') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasKeyword:submit');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction04'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('password') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasKeyword:password');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction05'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('username') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasKeyword:username');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction06'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('sign') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasKeyword:sign');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction07'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('remember') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasKeyword:remember');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction08'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('email') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasKeyword:email');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction09'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('account') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasKeyword:account');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction010'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('name') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasKeyword:name');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction011'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('forgot') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasKeyword:forgot');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction012'
}, {
	"condition": function(R) {
		R.when(this && this.wordCount && this.wordCount.indexOf('few') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('wordCount:few');
		this.roles['Interaction'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction013'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('searchengine') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasParent:searchengine');
		this.roles['Interaction'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction014'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('form') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasId:form');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction015'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('select') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasId:select');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction016'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('log') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasId:log');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction017'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('button') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasId:button');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction018'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('register') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasId:register');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction019'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('sign') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasId:sign');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction020'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('user') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasId:user');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction021'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|button|') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('mustHaveTag:button');
		this.roles['Interaction'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction022'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|selection|') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('mustHaveTag:selection');
		this.roles['Interaction'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction023'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|label|') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('mustHaveTag:label');
		this.roles['Interaction'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction024'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|form|') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('mustHaveTag:form');
		this.roles['Interaction'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction025'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|input|') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('mustHaveTag:input');
		this.roles['Interaction'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction026'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|textarea|') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('mustHaveTag:textarea');
		this.roles['Interaction'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction027'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('isAtomic:1');
		this.roles['Interaction'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction028'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('onclick') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasAttribute:onclick');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction029'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('type') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasAttribute:type');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction030'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('onfocus') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasAttribute:onfocus');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction031'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('value') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasAttribute:value');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction032'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('maxlength') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasAttribute:maxlength');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction033'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('size') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasAttribute:size');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction034'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('name') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('hasAttribute:name');
		this.roles['Interaction'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction035'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('short') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('relativeSize:short');
		this.roles['Interaction'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction036'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('narrow') > -1);
	},
	"consequence": function(R) {
		this.reason['Interaction'].push('relativeSize:narrow');
		this.roles['Interaction'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Interaction037'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('doc:11');
		this.roles['Logo'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Logo00'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('alt') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasAttribute:alt');
		this.roles['Logo'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Logo01'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('title') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasAttribute:title');
		this.roles['Logo'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Logo02'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|img|') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('mustHaveTag:img');
		this.roles['Logo'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Logo03'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('header') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasParent:header');
		this.roles['Logo'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Logo04'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('sidebar') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasParent:sidebar');
		this.roles['Logo'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Logo05'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasBackground:1');
		this.roles['Logo'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Logo06'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('graphic') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasId:graphic');
		this.roles['Logo'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Logo07'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('logo') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasId:logo');
		this.roles['Logo'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Logo08'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('header') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasId:header');
		this.roles['Logo'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Logo09'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('banner') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasId:banner');
		this.roles['Logo'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Logo010'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('home') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasId:home');
		this.roles['Logo'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Logo011'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_hight') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('relativeSize:medium_hight');
		this.roles['Logo'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Logo012'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('relativeSize:medium_length');
		this.roles['Logo'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Logo013'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('isAtomic:1');
		this.roles['Logo'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Logo014'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('atom') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasChild:atom');
		this.roles['Logo'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Logo015'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('link') > -1);
	},
	"consequence": function(R) {
		this.reason['Logo'].push('hasChild:link');
		this.roles['Logo'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Logo016'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['Link'].push('doc:11');
		this.roles['Link'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Link00'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 10);
	},
	"consequence": function(R) {
		this.reason['Link'].push('doc:10');
		this.roles['Link'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Link01'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('list') > -1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('hasParent:list');
		this.roles['Link'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Link02'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('title') > -1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('hasParent:title');
		this.roles['Link'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Link03'
}, {
	"condition": function(R) {
		R.when(this && this.border && this.border === 0);
	},
	"consequence": function(R) {
		this.reason['Link'].push('border:0');
		this.roles['Link'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Link04'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 0);
	},
	"consequence": function(R) {
		this.reason['Link'].push('hasBackground:0');
		this.roles['Link'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Link05'
}, {
	"condition": function(R) {
		R.when(this && this.fontColor && this.fontColor === 1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('fontColor:1');
		this.roles['Link'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Link06'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('short') > -1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('relativeSize:short');
		this.roles['Link'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Link07'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('narrow') > -1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('relativeSize:narrow');
		this.roles['Link'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Link08'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('relativeSize:medium_length');
		this.roles['Link'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Link09'
}, {
	"condition": function(R) {
		R.when(this && this.wordCount && this.wordCount.indexOf('few') > -1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('wordCount:few');
		this.roles['Link'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Link010'
}, {
	"condition": function(R) {
		R.when(this && this.wordCount && this.wordCount.indexOf('medium') > -1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('wordCount:medium');
		this.roles['Link'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Link011'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|base|') > -1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('hasTag:base');
		this.roles['Link'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Link012'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|link|') > -1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('hasTag:link');
		this.roles['Link'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Link013'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|a|') > -1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('hasTag:a');
		this.roles['Link'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Link014'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('href') > -1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('hasAttribute:href');
		this.roles['Link'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Link015'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['Link'].push('isAtomic:1');
		this.roles['Link'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Link016'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('doc:11');
		this.roles['SpecialGraphic'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic00'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('shot') > -1);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('hasId:shot');
		this.roles['SpecialGraphic'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic01'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('jpg') > -1);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('hasId:jpg');
		this.roles['SpecialGraphic'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic02'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('graphic') > -1);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('hasId:graphic');
		this.roles['SpecialGraphic'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic03'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('png') > -1);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('hasId:png');
		this.roles['SpecialGraphic'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic04'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('img') > -1);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('hasId:img');
		this.roles['SpecialGraphic'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic05'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('illustration') > -1);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('hasId:illustration');
		this.roles['SpecialGraphic'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic06'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('image') > -1);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('hasId:image');
		this.roles['SpecialGraphic'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic07'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('isAtomic:1');
		this.roles['SpecialGraphic'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic08'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_height') > -1);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('relativeSize:medium_height');
		this.roles['SpecialGraphic'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic09'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('relativeSize:medium_length');
		this.roles['SpecialGraphic'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic010'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|img|') > -1);
	},
	"consequence": function(R) {
		this.reason['SpecialGraphic'].push('mustHaveTag:img');
		this.roles['SpecialGraphic'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'SpecialGraphic011'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 11);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('doc:11');
		this.roles['MenuItem'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem00'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 10);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('doc:10');
		this.roles['MenuItem'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem01'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('linkmenu') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('hasParent:linkmenu');
		this.roles['MenuItem'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem02'
}, {
	"condition": function(R) {
		R.when(this && this.border && this.border === 1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('border:1');
		this.roles['MenuItem'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem03'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('hasBackground:1');
		this.roles['MenuItem'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem04'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('href') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('hasAttribute:href');
		this.roles['MenuItem'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem05'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('hover') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('hasAttribute:hover');
		this.roles['MenuItem'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem06'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|a|') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('hasTag:a');
		this.roles['MenuItem'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem07'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|li|') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('hasTag:li');
		this.roles['MenuItem'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem08'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|dd|') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('hasTag:dd');
		this.roles['MenuItem'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem09'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('isAtomic:1');
		this.roles['MenuItem'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem010'
}, {
	"condition": function(R) {
		R.when(this && this.wordCount && this.wordCount.indexOf('few') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('wordCount:few');
		this.roles['MenuItem'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem011'
}, {
	"condition": function(R) {
		R.when(this && this.wordCount && this.wordCount.indexOf('one') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('wordCount:one');
		this.roles['MenuItem'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem012'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('short') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('relativeSize:short');
		this.roles['MenuItem'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem013'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('narrow') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('relativeSize:narrow');
		this.roles['MenuItem'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem014'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('menuitem') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('hasId:menuitem');
		this.roles['MenuItem'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem015'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('menu-item') > -1);
	},
	"consequence": function(R) {
		this.reason['MenuItem'].push('hasId:menu-item');
		this.roles['MenuItem'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'MenuItem016'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('header') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasParent:header');
		this.roles['Header'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Header00'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('body') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasParent:body');
		this.roles['Header'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Header01'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('date') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasChild:date');
		this.roles['Header'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Header02'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('list') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasChild:list');
		this.roles['Header'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Header03'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('linkmenu') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasChild:linkmenu');
		this.roles['Header'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Header04'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('logo') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasChild:logo');
		this.roles['Header'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Header05'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('searchengine') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasChild:searchengine');
		this.roles['Header'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Header06'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|div|') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasTag:div');
		this.roles['Header'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Header07'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('right') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('inPosition:right');
		this.roles['Header'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Header08'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('left') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('inPosition:left');
		this.roles['Header'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Header09'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('top') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('inPosition:top');
		this.roles['Header'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Header010'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|header|') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('mustHaveTag:header');
		this.roles['Header'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Header011'
}, {
	"condition": function(R) {
		R.when(this && this.isComposite && this.isComposite === 1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('isComposite:1');
		this.roles['Header'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Header012'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_height') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('relativeSize:medium_height');
		this.roles['Header'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Header013'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('full') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('relativeSize:full');
		this.roles['Header'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Header014'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('wide') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('relativeSize:wide');
		this.roles['Header'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Header015'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasBackground:1');
		this.roles['Header'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Header016'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('header') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasId:header');
		this.roles['Header'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Header017'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('hd') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasId:hd');
		this.roles['Header'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Header018'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('heading') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasId:heading');
		this.roles['Header'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Header019'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('hdr') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasId:hdr');
		this.roles['Header'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Header020'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('register') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasKeyword:register');
		this.roles['Header'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Header021'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('home') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasKeyword:home');
		this.roles['Header'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Header022'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('account') > -1);
	},
	"consequence": function(R) {
		this.reason['Header'].push('hasKeyword:account');
		this.roles['Header'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Header023'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 2);
	},
	"consequence": function(R) {
		this.reason['Header'].push('doc:2');
		this.roles['Header'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Header024'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 4);
	},
	"consequence": function(R) {
		this.reason['Header'].push('doc:4');
		this.roles['Header'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Header025'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 7);
	},
	"consequence": function(R) {
		this.reason['Header'].push('doc:7');
		this.roles['Header'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Header026'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['Header'].push('isAtomic:0');
		this.roles['Header'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Header027'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_height') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('relativeSize:medium_height');
		this.roles['Article'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Article00'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('relativeSize:medium_length');
		this.roles['Article'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Article01'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('long') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('relativeSize:long');
		this.roles['Article'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Article02'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('wide') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('relativeSize:wide');
		this.roles['Article'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Article03'
}, {
	"condition": function(R) {
		R.when(this && this.fontWeight && this.fontWeight === 0);
	},
	"consequence": function(R) {
		this.reason['Article'].push('fontWeight:0');
		this.roles['Article'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Article04'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 0);
	},
	"consequence": function(R) {
		this.reason['Article'].push('hasBackground:0');
		this.roles['Article'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Article05'
}, {
	"condition": function(R) {
		R.when(this && this.isComposite && this.isComposite === 1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('isComposite:1');
		this.roles['Article'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Article06'
}, {
	"condition": function(R) {
		R.when(this && this.fontColor && this.fontColor === 0);
	},
	"consequence": function(R) {
		this.reason['Article'].push('fontColor:0');
		this.roles['Article'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Article07'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('title') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('hasChild:title');
		this.roles['Article'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Article08'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('content') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('hasChild:content');
		this.roles['Article'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Article09'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 5);
	},
	"consequence": function(R) {
		this.reason['Article'].push('doc:5');
		this.roles['Article'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Article010'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 7);
	},
	"consequence": function(R) {
		this.reason['Article'].push('doc:7');
		this.roles['Article'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Article011'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 8);
	},
	"consequence": function(R) {
		this.reason['Article'].push('doc:8');
		this.roles['Article'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Article012'
}, {
	"condition": function(R) {
		R.when(this && this.fontSize && this.fontSize === 0);
	},
	"consequence": function(R) {
		this.reason['Article'].push('fontSize:0');
		this.roles['Article'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Article013'
}, {
	"condition": function(R) {
		R.when(this && this.wordCount && this.wordCount.indexOf('many') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('wordCount:many');
		this.roles['Article'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Article014'
}, {
	"condition": function(R) {
		R.when(this && this.wordCount && this.wordCount.indexOf('medium') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('wordCount:medium');
		this.roles['Article'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Article015'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|div|') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('hasTag:div');
		this.roles['Article'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Article016'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|article|') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('hasTag:article');
		this.roles['Article'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Article017'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|p|') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('hasTag:p');
		this.roles['Article'] += 6;
		R.next();
	},
	"priority": 1,
	"name": 'Article017'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('container') > -1);
	},
	"consequence": function(R) {
		this.reason['Article'].push('hasParent:container');
		this.roles['Article'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Article018'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['Article'].push('isAtomic:0');
		this.roles['Article'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Article019'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('sidebar') > -1);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('hasParent:sidebar');
		this.roles['ComplementaryContent'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent00'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('isAtomic:0');
		this.roles['ComplementaryContent'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent01'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_height') > -1);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('relativeSize:medium_height');
		this.roles['ComplementaryContent'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent02'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('relativeSize:medium_length');
		this.roles['ComplementaryContent'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent03'
}, {
	"condition": function(R) {
		R.when(this && this.isComposite && this.isComposite === 1);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('isComposite:1');
		this.roles['ComplementaryContent'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent04'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('title') > -1);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('hasChild:title');
		this.roles['ComplementaryContent'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent05'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('content') > -1);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('hasChild:content');
		this.roles['ComplementaryContent'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent06'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 5);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('doc:5');
		this.roles['ComplementaryContent'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent07'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 7);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('doc:7');
		this.roles['ComplementaryContent'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent08'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 8);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('doc:8');
		this.roles['ComplementaryContent'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent09'
}, {
	"condition": function(R) {
		R.when(this && this.wordCount && this.wordCount.indexOf('many') > -1);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('wordCount:many');
		this.roles['ComplementaryContent'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent010'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|article|') > -1);
	},
	"consequence": function(R) {
		this.reason['ComplementaryContent'].push('hasTag:article');
		this.roles['ComplementaryContent'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'ComplementaryContent011'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['Figure'].push('isAtomic:0');
		this.roles['Figure'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Figure00'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 9);
	},
	"consequence": function(R) {
		this.reason['Figure'].push('doc:9');
		this.roles['Figure'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Figure01'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('specialgraphic') > -1);
	},
	"consequence": function(R) {
		this.reason['Figure'].push('hasChild:specialgraphic');
		this.roles['Figure'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Figure02'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('menu') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('hasId:menu');
		this.roles['LinkMenu'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu00'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('nav') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('hasId:nav');
		this.roles['LinkMenu'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu01'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('left') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('inPosition:left');
		this.roles['LinkMenu'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu02'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('top') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('inPosition:top');
		this.roles['LinkMenu'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu03'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('header') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('hasParent:header');
		this.roles['LinkMenu'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu04'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('sidebar') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('hasParent:sidebar');
		this.roles['LinkMenu'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu05'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('nav') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('hasParent:nav');
		this.roles['LinkMenu'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu06'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('footer') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('hasParent:footer');
		this.roles['LinkMenu'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu07'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('short') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('relativeSize:short');
		this.roles['LinkMenu'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu08'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('full') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('relativeSize:full');
		this.roles['LinkMenu'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu09'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('relativeSize:medium_length');
		this.roles['LinkMenu'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu010'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('wide') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('relativeSize:wide');
		this.roles['LinkMenu'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu011'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('hasBackground:1');
		this.roles['LinkMenu'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu012'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('menuitem') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('hasChild:menuitem');
		this.roles['LinkMenu'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu013'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|ol|') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('mustHaveTag:ol');
		this.roles['LinkMenu'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu014'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|dl|') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('mustHaveTag:dl');
		this.roles['LinkMenu'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu015'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|ul|') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('mustHaveTag:ul');
		this.roles['LinkMenu'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu016'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|nav|') > -1);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('mustHaveTag:nav');
		this.roles['LinkMenu'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu017'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('isAtomic:0');
		this.roles['LinkMenu'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu018'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 8);
	},
	"consequence": function(R) {
		this.reason['LinkMenu'].push('doc:8');
		this.roles['LinkMenu'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'LinkMenu019'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('atom') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasChild:atom');
		this.roles['SearchEngine'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine00'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('interaction') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasChild:interaction');
		this.roles['SearchEngine'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine01'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('autocomplete') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasId:autocomplete');
		this.roles['SearchEngine'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine02'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('suggestion') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasId:suggestion');
		this.roles['SearchEngine'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine03'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('input') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasId:input');
		this.roles['SearchEngine'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine04'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('search') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasId:search');
		this.roles['SearchEngine'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine05'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('short') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('relativeSize:short');
		this.roles['SearchEngine'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine06'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('narrow') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('relativeSize:narrow');
		this.roles['SearchEngine'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine07'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('relativeSize:medium_length');
		this.roles['SearchEngine'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine08'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('header') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasParent:header');
		this.roles['SearchEngine'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine09'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('method') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasAttribute:method');
		this.roles['SearchEngine'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine010'
}, {
	"condition": function(R) {
		R.when(this && this.hasAttribute && this.hasAttribute.indexOf('action') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasAttribute:action');
		this.roles['SearchEngine'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine011'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|form|') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasTag:form');
		this.roles['SearchEngine'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine012'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('isAtomic:0');
		this.roles['SearchEngine'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine013'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 9);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('doc:9');
		this.roles['SearchEngine'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine014'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('search') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasKeyword:search');
		this.roles['SearchEngine'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine015'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('advanced') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasKeyword:advanced');
		this.roles['SearchEngine'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine016'
}, {
	"condition": function(R) {
		R.when(this && this.hasKeyword && this.hasKeyword.indexOf('detailed') > -1);
	},
	"consequence": function(R) {
		this.reason['SearchEngine'].push('hasKeyword:detailed');
		this.roles['SearchEngine'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'SearchEngine017'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|div|') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('mustHaveTag:div');
		this.roles['Container'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Container00'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|li|') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('mustHaveTag:li');
		this.roles['Container'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Container01'
}, {
	"condition": function(R) {
		R.when(this && this.border && this.border === 1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('border:1');
		this.roles['Container'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Container02'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('sidebar') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasParent:sidebar');
		this.roles['Container'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Container03'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('container') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasParent:container');
		this.roles['Container'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Container04'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('body') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasParent:body');
		this.roles['Container'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Container05'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('tab') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:tab');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container06'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('midcolumn') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:midcolumn');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container07'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('wrap') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:wrap');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container08'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('row') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:row');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container09'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('grid') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:grid');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container010'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('mid') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:mid');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container011'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('container') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:container');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container012'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('column') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:column');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container013'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('bar') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:bar');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container014'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('content') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:content');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container015'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('box') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:box');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container016'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('main') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasId:main');
		this.roles['Container'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Container017'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 0);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasBackground:0');
		this.roles['Container'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Container018'
}, {
	"condition": function(R) {
		R.when(this && this.isComposite && this.isComposite === 1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('isComposite:1');
		this.roles['Container'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Container019'
}, {
	"condition": function(R) {
		R.when(this && this.fontColor && this.fontColor === 0);
	},
	"consequence": function(R) {
		this.reason['Container'].push('fontColor:0');
		this.roles['Container'] += 1;
		R.next();
	},
	"priority": 1,
	"name": 'Container020'
}, {
	"condition": function(R) {
		R.when(this && this.fontSize && this.fontSize === 0);
	},
	"consequence": function(R) {
		this.reason['Container'].push('fontSize:0');
		this.roles['Container'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Container021'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('sidebar') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasChild:sidebar');
		this.roles['Container'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Container022'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('title') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasChild:title');
		this.roles['Container'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Container023'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('article') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasChild:article');
		this.roles['Container'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Container024'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('content') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('hasChild:content');
		this.roles['Container'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Container025'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 2);
	},
	"consequence": function(R) {
		this.reason['Container'].push('doc:2');
		this.roles['Container'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Container026'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 5);
	},
	"consequence": function(R) {
		this.reason['Container'].push('doc:5');
		this.roles['Container'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Container027'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 4);
	},
	"consequence": function(R) {
		this.reason['Container'].push('doc:4');
		this.roles['Container'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Container028'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 7);
	},
	"consequence": function(R) {
		this.reason['Container'].push('doc:7');
		this.roles['Container'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Container029'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 8);
	},
	"consequence": function(R) {
		this.reason['Container'].push('doc:8');
		this.roles['Container'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Container030'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_height') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('relativeSize:medium_height');
		this.roles['Container'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Container031'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('full') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('relativeSize:full');
		this.roles['Container'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Container032'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('relativeSize:medium_length');
		this.roles['Container'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Container033'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('long') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('relativeSize:long');
		this.roles['Container'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Container034'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('large') > -1);
	},
	"consequence": function(R) {
		this.reason['Container'].push('relativeSize:large');
		this.roles['Container'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Container035'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['Container'].push('isAtomic:0');
		this.roles['Container'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Container036'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['Toolbar'].push('isAtomic:0');
		this.roles['Toolbar'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Toolbar00'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|table|') > -1);
	},
	"consequence": function(R) {
		this.reason['Toolbar'].push('hasTag:table');
		this.roles['Toolbar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Toolbar01'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|ul|') > -1);
	},
	"consequence": function(R) {
		this.reason['Toolbar'].push('hasTag:ul');
		this.roles['Toolbar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Toolbar02'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 1);
	},
	"consequence": function(R) {
		this.reason['Toolbar'].push('hasBackground:1');
		this.roles['Toolbar'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Toolbar03'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('atom') > -1);
	},
	"consequence": function(R) {
		this.reason['Toolbar'].push('hasChild:atom');
		this.roles['Toolbar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Toolbar04'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('button') > -1);
	},
	"consequence": function(R) {
		this.reason['Toolbar'].push('hasId:button');
		this.roles['Toolbar'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Toolbar05'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('bar') > -1);
	},
	"consequence": function(R) {
		this.reason['Toolbar'].push('hasId:bar');
		this.roles['Toolbar'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Toolbar06'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('toolbar') > -1);
	},
	"consequence": function(R) {
		this.reason['Toolbar'].push('hasId:toolbar');
		this.roles['Toolbar'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Toolbar07'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|div|') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('hasTag:div');
		this.roles['Footer'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Footer00'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('body') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('hasParent:body');
		this.roles['Footer'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Footer01'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('footer') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('hasParent:footer');
		this.roles['Footer'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Footer02'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('footer') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('hasId:footer');
		this.roles['Footer'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Footer03'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('ft') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('hasId:ft');
		this.roles['Footer'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Footer04'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('bottom') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('hasId:bottom');
		this.roles['Footer'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Footer05'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('ftr') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('hasId:ftr');
		this.roles['Footer'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Footer06'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('icon') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('hasChild:icon');
		this.roles['Footer'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Footer07'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('list') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('hasChild:list');
		this.roles['Footer'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Footer08'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('copyright') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('hasChild:copyright');
		this.roles['Footer'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Footer09'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_height') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('relativeSize:medium_height');
		this.roles['Footer'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Footer010'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('full') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('relativeSize:full');
		this.roles['Footer'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Footer011'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('wide') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('relativeSize:wide');
		this.roles['Footer'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Footer012'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('hasBackground:1');
		this.roles['Footer'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Footer013'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 2);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('doc:2');
		this.roles['Footer'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Footer014'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 4);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('doc:4');
		this.roles['Footer'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Footer015'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 7);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('doc:7');
		this.roles['Footer'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Footer016'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('right') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('inPosition:right');
		this.roles['Footer'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Footer017'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('left') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('inPosition:left');
		this.roles['Footer'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Footer018'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('bottom') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('inPosition:bottom');
		this.roles['Footer'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Footer019'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|footer|') > -1);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('mustHaveTag:footer');
		this.roles['Footer'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'Footer020'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['Footer'].push('isAtomic:0');
		this.roles['Footer'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Footer021'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|ol|') > -1);
	},
	"consequence": function(R) {
		this.reason['List'].push('mustHaveTag:ol');
		this.roles['List'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'List00'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|dl|') > -1);
	},
	"consequence": function(R) {
		this.reason['List'].push('mustHaveTag:dl');
		this.roles['List'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'List01'
}, {
	"condition": function(R) {
		R.when(this && this.mustHaveTag && this.mustHaveTag.indexOf('|ul|') > -1);
	},
	"consequence": function(R) {
		this.reason['List'].push('mustHaveTag:ul');
		this.roles['List'] += 8;
		R.next();
	},
	"priority": 1,
	"name": 'List02'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 0);
	},
	"consequence": function(R) {
		this.reason['List'].push('hasBackground:0');
		this.roles['List'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'List03'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('link') > -1);
	},
	"consequence": function(R) {
		this.reason['List'].push('hasChild:link');
		this.roles['List'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'List04'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('sidebar') > -1);
	},
	"consequence": function(R) {
		this.reason['List'].push('hasParent:sidebar');
		this.roles['List'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'List05'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('list') > -1);
	},
	"consequence": function(R) {
		this.reason['List'].push('hasParent:list');
		this.roles['List'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'List06'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('container') > -1);
	},
	"consequence": function(R) {
		this.reason['List'].push('hasParent:container');
		this.roles['List'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'List07'
}, {
	"condition": function(R) {
		R.when(this && this.hasListStyle && this.hasListStyle === 1);
	},
	"consequence": function(R) {
		this.reason['List'].push('hasListStyle:1');
		this.roles['List'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'List08'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['List'].push('isAtomic:0');
		this.roles['List'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'List09'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_height') > -1);
	},
	"consequence": function(R) {
		this.reason['List'].push('relativeSize:medium_height');
		this.roles['List'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'List010'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['List'].push('relativeSize:medium_length');
		this.roles['List'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'List011'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 8);
	},
	"consequence": function(R) {
		this.reason['List'].push('doc:8');
		this.roles['List'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'List012'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('header') > -1);
	},
	"consequence": function(R) {
		this.reason['BreadcrumbTrail'].push('hasParent:header');
		this.roles['BreadcrumbTrail'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'BreadcrumbTrail00'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('top') > -1);
	},
	"consequence": function(R) {
		this.reason['BreadcrumbTrail'].push('inPosition:top');
		this.roles['BreadcrumbTrail'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'BreadcrumbTrail01'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['BreadcrumbTrail'].push('isAtomic:0');
		this.roles['BreadcrumbTrail'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'BreadcrumbTrail02'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('link') > -1);
	},
	"consequence": function(R) {
		this.reason['BreadcrumbTrail'].push('hasChild:link');
		this.roles['BreadcrumbTrail'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'BreadcrumbTrail03'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('separator') > -1);
	},
	"consequence": function(R) {
		this.reason['BreadcrumbTrail'].push('hasChild:separator');
		this.roles['BreadcrumbTrail'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'BreadcrumbTrail04'
}, {
	"condition": function(R) {
		R.when(this && this.hasTag && this.hasTag.indexOf('|ul|') > -1);
	},
	"consequence": function(R) {
		this.reason['BreadcrumbTrail'].push('hasTag:ul');
		this.roles['BreadcrumbTrail'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'BreadcrumbTrail05'
}, {
	"condition": function(R) {
		R.when(this && this.border && this.border === 1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('border:1');
		this.roles['Sidebar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar00'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('right') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('inPosition:right');
		this.roles['Sidebar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar01'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('left') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('inPosition:left');
		this.roles['Sidebar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar02'
}, {
	"condition": function(R) {
		R.when(this && this.inPosition && this.inPosition.indexOf('top') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('inPosition:top');
		this.roles['Sidebar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar03'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_height') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('relativeSize:medium_height');
		this.roles['Sidebar'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar04'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('medium_length') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('relativeSize:medium_length');
		this.roles['Sidebar'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar05'
}, {
	"condition": function(R) {
		R.when(this && this.relativeSize && this.relativeSize.indexOf('long') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('relativeSize:long');
		this.roles['Sidebar'] += 4;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar06'
}, {
	"condition": function(R) {
		R.when(this && this.hasBackground && this.hasBackground === 1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('hasBackground:1');
		this.roles['Sidebar'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar07'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('left') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('hasId:left');
		this.roles['Sidebar'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar08'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('sidebar') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('hasId:sidebar');
		this.roles['Sidebar'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar09'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('column') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('hasId:column');
		this.roles['Sidebar'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar010'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('container') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('hasId:container');
		this.roles['Sidebar'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar011'
}, {
	"condition": function(R) {
		R.when(this && this.hasId && this.hasId.indexOf('right') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('hasId:right');
		this.roles['Sidebar'] += 5;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar012'
}, {
	"condition": function(R) {
		R.when(this && this.isAtomic && this.isAtomic === 0);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('isAtomic:0');
		this.roles['Sidebar'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar013'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('sidebar') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('hasParent:sidebar');
		this.roles['Sidebar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar014'
}, {
	"condition": function(R) {
		R.when(this && this.hasParent && this.hasParent.indexOf('container') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('hasParent:container');
		this.roles['Sidebar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar015'
}, {
	"condition": function(R) {
		R.when(this && this.doc && this.doc === 7);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('doc:7');
		this.roles['Sidebar'] += 3;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar016'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('linkmenu') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('hasChild:linkmenu');
		this.roles['Sidebar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar017'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('advertisement') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('hasChild:advertisement');
		this.roles['Sidebar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar018'
}, {
	"condition": function(R) {
		R.when(this && this.hasChild && this.hasChild.indexOf('title') > -1);
	},
	"consequence": function(R) {
		this.reason['Sidebar'].push('hasChild:title');
		this.roles['Sidebar'] += 2;
		R.next();
	},
	"priority": 1,
	"name": 'Sidebar019'
}
]
;
var R1 = new RuleEngine(rules);
var store = R1.toJSON();

console.log(JSON.stringify(store));
 
