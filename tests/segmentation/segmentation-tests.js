var chai = require('chai'),
    expect = chai.expect,
    segmenter = require('./../../page-segmenter'),
    fs = require('fs');

describe('segment->normalForm', function() {
    console.log(' -- Normal case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/normal-form-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should create blocks for each line break node in normal form', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV,DIV[DIV,DIV,DIV,DIV]]");
    });
});

describe('segment->differentFontSize', function() {
    console.log(' -- Font size case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/font-size-data.json', 'utf8')),
        dom2 = JSON.parse(fs.readFileSync('./tests/data/font-size-data-2.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080),
        block2 = segmenter.segment(dom2, 1920, 1080);

    it('segment(node) should separate blocks with respect to max. font size', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV[DIV,COMPOSITE[DIV,DIV,DIV]],DIV[COMPOSITE[DIV,DIV]," +
         "COMPOSITE[DIV,DIV]],DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]],DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]]]");
    });

    it('segment(node) should separate blocks with respect to max. font size', function() {
        expect(block2.getTreeHierarchy()).to.equal("BODY[COMPOSITE[DIV[DIV,COMPOSITE[DIV,DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]]],COMPOSITE[DIV[DIV,COMPOSITE[DIV,COMPOSITE[DIV,DIV]]]," +
        "DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]]]]");
    });
});

describe('segment->virtualTextNode', function() {
    console.log(' -- Virtual text node case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/inline-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should not further segment virtual text nodes', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV,DIV,DIV,DIV]");
    });

    it('segment(node) assign doc = 11 if all children are virtual text node', function() {
        expect(block.getChildAt(0).getDoc()).to.equal(11);
    });
});

describe('segment->handleImageInChildren', function() {
    console.log(' -- Image case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/image-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to images', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV[IMG,COMPOSITE[DIV,DIV,DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV],IMG,COMPOSITE[DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV,DIV,DIV],IMG]," +
        "DIV[COMPOSITE[DIV,DIV],DIV,COMPOSITE[DIV,DIV]]]");
    });

    it('segment(node) assign doc = 8 if children contains image', function() {
        expect(block.getChildAt(0).getDoc()).to.equal(8);
    });

    it('segment(node) assign doc = 11 if node is image', function() {
        expect(block.getChildAt(0).getChildAt(0).getDoc()).to.equal(11);
    });

    it('segment(node) assign doc = 9 if sibling is image', function() {
        expect(block.getChildAt(0).getChildAt(1).getDoc()).to.equal(9);
    });
});

describe('segment->handleObjectInChildren', function() {
    console.log(' -- Object case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/object-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to objects', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV[OBJECT,COMPOSITE[DIV,DIV,DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV],OBJECT,COMPOSITE[DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV,DIV,DIV],OBJECT]," +
        "DIV[COMPOSITE[DIV,DIV],DIV,COMPOSITE[DIV,DIV]]]");
    });
});

describe('segment->handleEmptyListItem', function() {
    console.log(' -- Empty list item case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/empty-list-item-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to empty list items', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[UL[LI,LI,LI,LI]," +
        "UL[COMPOSITE[LI,LI],COMPOSITE[LI,LI]]," +
        "UL[LI,LI,LI,LI]," +
        "UL[LI,LI,LI,LI]]");
    });

    it('segment(node) assign doc = 9 if children contains empty list item', function() {
        expect(block.getChildAt(0).getDoc()).to.equal(9);
    });

    it('segment(node) assign doc = 11 if node is empty list item', function() {
        expect(block.getChildAt(0).getChildAt(0).getDoc()).to.equal(11);
    });

    it('segment(node) assign doc = 9 if composite node has empty list item', function() {
        expect(block.getChildAt(1).getChildAt(0).getDoc()).to.equal(9);
    });
});

describe('segment->handleLineBreaks', function() {
    console.log(' -- New line case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/newline-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to empty list items', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV[DIV,DIV,DIV,DIV]," +
        "DIV[DIV,COMPOSITE[DIV,DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]]," +
        "DIV[DIV,DIV,DIV,DIV]]");
    });

    it('segment(node) assign doc = 7 if children contains line break', function() {
        expect(block.getChildAt(2).getDoc()).to.equal(7);
    });

    it('segment(node) assign doc = 9 if composite node has line break', function() {
        expect(block.getChildAt(2).getChildAt(0).getDoc()).to.equal(9);
    });
});

describe('segment->handleDifferentMargin', function() {
    console.log(' -- Margin case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/margin-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to top and bottom margins', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV[DIV,DIV,DIV,DIV]," +
        "DIV[DIV,DIV,COMPOSITE[DIV,DIV]]," +
        "DIV[DIV,DIV,COMPOSITE[DIV,DIV]]," +
        "DIV[DIV,DIV,DIV,DIV]]");
    });
});

describe('segment->handleDifferentBgColorAtChildren', function() {
    console.log(' -- Background case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/background-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to background style', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV[DIV,COMPOSITE[DIV,DIV,DIV]]," +
        "DIV[DIV,DIV,COMPOSITE[DIV,DIV]]," +
        "DIV[DIV,DIV,DIV,DIV]," +
        "DIV[COMPOSITE[DIV,DIV,DIV],DIV]]");
    });

    it('segment(node) assign doc = 4 if children have different background', function() {
        expect(block.getChildAt(2).getDoc()).to.equal(4);
    });

    it('segment(node) assign doc = 9 if node has different background than siblings', function() {
        expect(block.getChildAt(3).getChildAt(0).getDoc()).to.equal(9);
    });
});

describe('segment->handleDivGroups', function() {
    console.log(' -- Div group case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/div-group-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to top and bottom margins', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV[P,COMPOSITE[DIV,DIV,DIV]]," +
        "DIV[DIV,P,COMPOSITE[DIV,DIV]]," +
        "DIV[P,DIV,P,DIV]," +
        "DIV[COMPOSITE[DIV,DIV,DIV],P]]");
    });

    it('segment(node) assign doc = 9 if children have different background', function() {
        expect(block.getChildAt(1).getDoc()).to.equal(6);
    });

    it('segment(node) assign doc = 9 if node has different background than siblings', function() {
        expect(block.getChildAt(3).getChildAt(0).getDoc()).to.equal(9);
    });
});

describe('segment->handleColumnsAtChildren', function() {
    console.log(' -- Layout case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/layout-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to layout', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV[DIV,DIV,DIV,DIV]," +
        "DIV[DIV,DIV,DIV,DIV]," +
        "DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV],DIV,DIV]," +
        "DIV[DIV,DIV,DIV,DIV]," +
        "DIV[DIV,DIV,DIV,DIV]]");
    });
});

describe('segment->linebreak', function() {
    console.log(' -- Line break case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/linebreak-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to line break nodes', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV," +
        "DIV[A,DIV,DIV,DIV]," +
        "DIV[DIV,COMPOSITE,DIV]]");
    });

    it('segment(node) assign doc = 11 if children are virtual text node', function() {
        expect(block.getChildAt(0).getDoc()).to.equal(11);
    });

    it('segment(node) assign doc = 9 if node has line break nodes', function() {
        expect(block.getChildAt(1).getDoc()).to.equal(9);
    });
});

describe('segment->handleDifferentFloat', function() {
    console.log(' -- Float case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/float-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to floats', function() {
        expect(block.getTreeHierarchy()).to.equal("BODY[DIV[COMPOSITE[DIV,DIV],DIV,DIV]," +
        "DIV[DIV,DIV,COMPOSITE[DIV,DIV]]," +
        "DIV[DIV,COMPOSITE[DIV,DIV,DIV]]," +
        "DIV[DIV,COMPOSITE[DIV,DIV,DIV],COMPOSITE[DIV,DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]]]");
    });
});

describe('segment', function() {
    console.log(' -- Bootstrap Starter Template http://getbootstrap.com/examples/starter-template/');
    var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-starter-template-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to specified rules (starter-template)', function() {
        expect(block.getTreeHierarchy()).to.equal(
            "BODY[NAV[DIV,DIV[LI,LI,LI]]," +
                 "DIV[H1,P[TEXT,TEXT]]]");
    });
});

describe('segment', function() {
    console.log(' -- Bootstrap Jumbotron http://getbootstrap.com/examples/jumbotron/');
    var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-jumbotron-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to specified rules (jumbotron)', function() {
        expect(block.getTreeHierarchy()).to.equal(
            "BODY[NAV[DIV,DIV[DIV,DIV,BUTTON]]," +
                 "DIV[H1,COMPOSITE[P,P]]," +
                 "DIV[DIV[" +
                 "DIV[H2,COMPOSITE[P,P]]," +
                 "DIV[H2,COMPOSITE[P,P]]," +
                 "DIV[H2,COMPOSITE[P,P]]" +
                 "],FOOTER]]");
    });
});


describe('segment', function() {
    console.log(' -- Bootstrap Signin http://getbootstrap.com/examples/signin/');
    var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-signin-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to specified rules (signin)', function() {
        expect(block.getTreeHierarchy()).to.equal(
            "BODY[H2,COMPOSITE[COMPOSITE[INPUT,INPUT],DIV[INPUT,TEXT],BUTTON]]");
    });
});

describe('segment', function() {
    console.log(' -- Bootstrap Signin http://getbootstrap.com/examples/sticky-footer/');
    var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-sticky-footer-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to specified rules (sticky-footer)', function() {
        expect(block.getTreeHierarchy()).to.equal(
            "BODY[DIV[DIV,COMPOSITE[P,P]],FOOTER]");
    });
});

describe('segment', function() {
    console.log(' -- Bootstrap Narrow Jumbotron http://getbootstrap.com/examples/jumbotron-narrow/');
    var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-jumbotron-narrow-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to specified rules (jumbotron-narrow)', function() {
        expect(block.getTreeHierarchy()).to.equal(
            "BODY[DIV[NAV[LI,LI,LI],H3]," +
                 "DIV[H1,COMPOSITE[P,P]]," +
                 "COMPOSITE[DIV[DIV[COMPOSITE[H4,P],COMPOSITE[H4,P],COMPOSITE[H4,P]]," +
                               "DIV[COMPOSITE[H4,P],COMPOSITE[H4,P],COMPOSITE[H4,P]]],FOOTER]]");
    });
});

describe('segment', function() {
    console.log(' -- Bootstrap Navbar http://getbootstrap.com/examples/navbar/');
    var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-navbar-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to specified rules (navbar)', function() {
        expect(block.getTreeHierarchy()).to.equal(
            "BODY[NAV[DIV,DIV[UL[LI,LI,LI,LI],UL[LI,LI,LI]]],DIV[H1,COMPOSITE[P,P]]]");
    });
});

describe('segment', function() {
    console.log(' -- Bootstrap Justified Nav http://getbootstrap.com/examples/justified-nav/');
    var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-justified-nav-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to specified rules (justified-nav)', function() {
        expect(block.getTreeHierarchy()).to.equal(
            "BODY[DIV[H3,NAV[LI,LI,LI,LI,LI,LI]],COMPOSITE[DIV[H1,COMPOSITE[P,P]]," +
            "COMPOSITE[DIV[DIV[H2,COMPOSITE[P,P,P]],DIV[H2,COMPOSITE[P,P]],DIV[H2,COMPOSITE[P,P]]],FOOTER]]]");
    });
});

describe('segment', function() {
    console.log(' -- Bootstrap Non-responsive http://getbootstrap.com/examples/non-responsive/');
    var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-non-responsive-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to specified rules (non-responsive)', function() {
        expect(block.getTreeHierarchy()).to.equal(
            "BODY[NAV[DIV,DIV[UL[LI,LI,LI,LI],FORM[DIV,BUTTON],UL[LI,LI,LI]]],DIV[DIV[H1,P]," +
            "COMPOSITE[COMPOSITE[H3,P],COMPOSITE[H3,P],COMPOSITE[H3,COMPOSITE[P,P]]," +
            "COMPOSITE[H3,DIV[DIV,DIV,DIV]]]]]");
    });
});

describe('segment', function() {
    console.log(' -- Bootstrap Offcanvas http://getbootstrap.com/examples/offcanvas/');
    var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-offcanvas-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to specified rules (offcanvas)', function() {
        expect(block.getTreeHierarchy()).to.equal(
            "BODY[NAV[DIV,DIV[LI,LI,LI]],DIV[DIV[DIV[DIV[H1,P],DIV[COMPOSITE[DIV[H2,COMPOSITE[P,P]]," +
            "DIV[H2,COMPOSITE[P,P]],DIV[H2,COMPOSITE[P,P]]],COMPOSITE[DIV[H2,COMPOSITE[P,P]]," +
            "DIV[H2,COMPOSITE[P,P]]," +
            "DIV[H2,COMPOSITE[P,P]]]]],DIV[A,A,A,A,A,A,A,A,A,A]],FOOTER]]");
    });
});
