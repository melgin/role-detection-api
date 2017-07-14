var chai = require('chai'),
    expect = chai.expect,
    segmenter = require('./../../page-segmenter'),
    util = require('./../../utils/common-util'),
    fs = require('fs');

describe('segment->normalForm', function() {
    console.log(' -- Normal case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/normal-form-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should create blocks for each line break node in normal form', function() {
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV,DIV[DIV,DIV,DIV,DIV]]");
    });
});

describe('segment->differentFontSize', function() {
    console.log(' -- Font size case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/font-size-data.json', 'utf8')),
        dom2 = JSON.parse(fs.readFileSync('./tests/data/font-size-data-2.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080),
        block2 = segmenter.segment(dom2, 1920, 1080);

    it('segment(node) should separate blocks with respect to max. font size', function() {
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV[DIV,COMPOSITE[DIV,DIV,DIV]],DIV[COMPOSITE[DIV,DIV]," +
         "COMPOSITE[DIV,DIV]],DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]],DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]]]");
    });

    it('segment(node) should separate blocks with respect to max. font size', function() {
        expect(util.getTreeHierarchy(block2)).to.equal("BODY[COMPOSITE[DIV[DIV,COMPOSITE[DIV,DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]]],COMPOSITE[DIV[DIV,COMPOSITE[DIV,COMPOSITE[DIV,DIV]]]," +
        "DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]]]]");
    });
});

describe('segment->virtualTextNode', function() {
    console.log(' -- Virtual text node case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/inline-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should not further segment virtual text nodes', function() {
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV,DIV,DIV,DIV]");
    });
});

describe('segment->handleImageInChildren', function() {
    console.log(' -- Image case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/image-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to images', function() {
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV[IMG,COMPOSITE[DIV,DIV,DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV],IMG,COMPOSITE[DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV,DIV,DIV],IMG]," +
        "DIV[COMPOSITE[DIV,DIV],DIV,COMPOSITE[DIV,DIV]]]");
    });
});

describe('segment->handleObjectInChildren', function() {
    console.log(' -- Object case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/object-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to objects', function() {
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV[OBJECT,COMPOSITE[DIV,DIV,DIV,DIV]]," +
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
        expect(util.getTreeHierarchy(block)).to.equal("BODY[UL[LI,LI,LI,LI]," +
        "UL[COMPOSITE[LI,LI],COMPOSITE[LI,LI]]," +
        "UL[LI,LI,LI,LI]," +
        "UL[LI,LI,LI,LI]]");
    });
});

describe('segment->handleLineBreaks', function() {
    console.log(' -- New line case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/newline-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to empty list items', function() {
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV[DIV,DIV,DIV,DIV]," +
        "DIV[DIV,COMPOSITE[DIV,DIV,DIV]]," +
        "DIV[COMPOSITE[DIV,DIV],COMPOSITE[DIV,DIV]]," +
        "DIV[DIV,DIV,DIV,DIV]]");
    });
});

describe('segment->handleDifferentMargin', function() {
    console.log(' -- Margin case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/margin-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to top and bottom margins', function() {
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV[DIV,DIV,DIV,DIV]," +
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
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV[DIV,COMPOSITE[DIV,DIV,DIV]]," +
        "DIV[DIV,DIV,COMPOSITE[DIV,DIV]]," +
        "DIV[DIV,DIV,DIV,DIV]," +
        "DIV[COMPOSITE[DIV,DIV,DIV],DIV]]");
    });
});

describe('segment->handleDivGroups', function() {
    console.log(' -- Div group case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/div-group-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to top and bottom margins', function() {
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV[P,COMPOSITE[DIV,DIV,DIV]]," +
        "DIV[DIV,P,COMPOSITE[DIV,DIV]]," +
        "DIV[P,DIV,P,DIV]," +
        "DIV[COMPOSITE[DIV,DIV,DIV],P]]");
    });
});

describe('segment->handleColumnsAtChildren', function() {
    console.log(' -- Layout case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/layout-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to layout', function() {
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV[DIV,DIV,DIV,DIV]," +
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
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV," +
        "DIV[A,DIV,DIV,DIV]," +
        "DIV[DIV,COMPOSITE,DIV]]");
    });
});

describe('segment->handleDifferentFloat', function() {
    console.log(' -- Float case');
    var dom = JSON.parse(fs.readFileSync('./tests/data/float-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to top and bottom margins', function() {
        expect(util.getTreeHierarchy(block)).to.equal("BODY[DIV[COMPOSITE[DIV,DIV],DIV,DIV]," +
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

    it('segment(node) should divide the nodes with respect to specified rules', function() {
        expect(util.getTreeHierarchy(block)).to.equal(
            "BODY[NAV[DIV,DIV[LI,LI,LI]]," +
                 "DIV[H1,P]]");
    });
});

describe('segment', function() {
    console.log(' -- Bootstrap Jumbotron http://getbootstrap.com/examples/jumbotron/');
    var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-jumbotron-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080);

    it('segment(node) should divide the nodes with respect to specified rules', function() {
        expect(util.getTreeHierarchy(block)).to.equal(
            "BODY[NAV[DIV,DIV[DIV,DIV,BUTTON]]," +
                 "DIV[H1,COMPOSITE[P,P]]," +
                 "DIV[DIV[" +
                 "DIV[H2,COMPOSITE[P,P]]," +
                 "DIV[H2,COMPOSITE[P,P]]," +
                 "DIV[H2,COMPOSITE[P,P]]" +
                 "],FOOTER]]");
    });
});
