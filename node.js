function Node(node) {
    this.node = node;
}

var inlineNodes = ["A", "ABBR", "ACRONYM", "B", "BDO",
	"BIG", "BUTTON", "CITE", "CODE", "DEL", "DFN", "EM",
	"FONT", "I", "IMG", "INPUT", "INS", "KBD", "LABEL",
	"OBJECT", "Q", "S", "SAMP", "SMALL", "SPAN", "STRIKE",
	"STRONG", "SUB", "SUP", "TT", "U", "VAR", "APPLET",
	"SELECT", "TEXTAREA"];

Node.prototype.getMaxFontSize = function() {
    if(this.isInlineNode()){
        return -1;
    }

    var maxFontSize = this.getFontSize();
    if(this.hasChild()){
        for(var i = 0; i < this.node.children.length; i++){
            maxFontSize = Math.max(maxFontSize, this.getChildAt(i).getMaxFontSize());
        }
    }

    return maxFontSize;
};

Node.prototype.getMaxFontSizeInChildren = function(){
    var maxFontSize = -1;

    for(var i = 0; i < this.node.children.length; i++){
        maxFontSize = Math.max(maxFontSize, this.getChildAt(i).getMaxFontSize());
    }

    return maxFontSize;
}

Node.prototype.getCountOfChildrenWithMaxFontSize = function(maxFontSize){
    var count = 0;

    for(var i = 0; i < count; i++){
        var fontSize = this.getChildAt(i).getMaxFontSize();

        if(fontSize === maxFontSize){
            count++;
        }
    }

    return count;
}

Node.prototype.getChildAt = function(i){
    return new Node(this.node.children[i]);
}

Node.prototype.areAllMaxFontSizeChildrenAtFront = function(count, maxFontSize){
    for(var i = 0; i < count; i++){
        var fontSize = this.getChildAt(i).getMaxFontSize();

        if(fontSize !== maxFontSize){
            return false;
        }
    }

    return true;
}

Node.prototype.hasChild = function(){
    return this.node.children && this.node.children.length > 0;
}

Node.prototype.getFontSize = function(){
    return parseInt(this.getAttributes().fontSize);
}

Node.prototype.isInlineNode = function(){
    return this.node.inline;
}

Node.prototype.areAllChildrenVirtualTextNodes = function() {
    var state = true;
    if(this.hasChild()){
        this.node.children.forEach(function(child){
            state = state && (child.inline || +child.type === 3 /*Node.TEXT_NODE*/);
        });
    }
    return state;
}

Node.prototype.childrenHaveDifferentBackground = function(){
    if(this.hasChild()){
        var state = false;
        var tempBg = this.getChildAt(0).getAttributes().background;

        this.node.children.forEach(function(child){
            var childNode = new Node(child);
            if(! childNode.tagNameEqualsTo('BUTTON') && ! childNode.tagNameEqualsTo('INPUT')){
                state = state || childNode.getAttributes().background !== tempBg;
            }
        });

        return state;
    }

    return false;
}

Node.prototype.containsEmptyListItem = function() {
    if(this.tagNameEqualsTo('UL') && this.hasChild()){
        for(var i = 0; i < this.node.children.length; i++){
            if(this.getChildAt(i).isEmptyListItem()){
                return true;
            }
        }
    }

    return false;
}

Node.prototype.isEmptyListItem = function(){
    return this.tagNameEqualsTo('LI') && ! this.hasChild();
}

Node.prototype.containsLineBreak = function(){
    if(this.node.isCompositeNode){
        if(! this.hasChild()){
            return false;
        }

        for(var i = 0; i < this.node.children.length; i++){
            var child = this.getChildAt(i);

            if(child.tagNameEqualsTo('HR') || child.tagNameEqualsTo('BR')){
                return true;
            }
        }

        return false;
    }

    return this.node.containsLineBreak ? true : false;
}

Node.prototype.containsImage = function(){
    if(this.node.containsImage){
        return true;
    }

    if(! this.hasChild()){
        return false;
    }

    for(var i = 0; i < this.node.children.length; i++){
        var child = this.node.children[i];

        if(child.children && child.children.length === 1 && child.containsImage){
            return true;
        }
    }

    return false;
}

Node.prototype.containsLineBreakObject = function() {
    if(this.node.containsLineBreakTerminalNode){
        return true;
    }

    if(! this.hasChild()){
        return false;
    }

    for(var i = 0; i < this.node.children.length; i++){
        var child = this.node.children[i];

        if(child.children && child.children.length === 1 && child.containsLineBreakTerminalNode){
            return true;
        }
    }

    return false;
}

Node.prototype.hasDifferentFloatInChildren = function() {
    if(this.hasChild()){
        var state = false;
        var tempFloat = this.node.children[0].attributes.float;

        this.node.children.forEach(function(child){
            state = state || child.attributes.float !== tempFloat;
        });

        return state;
    }

    return false;
}

Node.prototype.hasDivGroups = function() {
    var divCount = 0,
        lineBreakCount = 0;

    if(this.hasChild()){
        this.node.children.forEach(function(child){
            if(child.tagName === 'DIV'){
                divCount++;
            } else if(! child.inline && inlineNodes.indexOf(child.tagName) === -1){
                lineBreakCount++;
            }
        });
    }

	if (divCount > 0 && lineBreakCount > 0){
        return true;
    }

    return false;
}

function areAllMarginSame(node){
    var tempMarginTop = node.children[0].attributes.marginTop,
        tempMarginBottom = node.children[0].attributes.marginBottom;

    for(var i = 0; i < node.children.length; i++){
        var child = node.children[i],
            marginTop = child.attributes.marginTop,
            marginBottom = child.attributes.marginBottom;

        if(marginTop !== tempMarginTop || marginBottom !== tempMarginBottom){
            return false;
        }
    }

    return true;
}

Node.prototype.hasDifferentMarginInChildren = function() {
    if(this.hasChild()){
        if(areAllMarginSame(this.node)){
            return false;
        }

        for(var i = 0; i < this.node.children.length; i++){
            var child = this.node.children[i];

            if (i !== 0 && hasMargin(child.attributes.marginTop)) {
				return true;
			} else if (i !== this.node.children.length - 1 &&
                hasMargin(child.attributes.marginBottom)) {
				return true;
			}
        }
    }

    return false;
}

Node.prototype.hasDifferentFontSizeInChildren = function() {
    if(this.hasChild()){
        var state = false;

        var tempFontSize = null;

        for(var i = 0; i < this.node.children.length; i++){
            var child = this.getChildAt(i),
                fontSize = child.getMaxFontSize();

            if(fontSize !== -1){
                tempFontSize = fontSize;
                break;
            }
        }

        this.node.children.forEach(function(child){
            var fontSize = (new Node(child)).getMaxFontSize();
            if(fontSize !== -1){
                state = state || fontSize !== tempFontSize;
            }
        });

        return state;
    }

    return false;
}

Node.prototype.childrenHaveRows = function(screenWidth){
    if(! this.node.children || this.node.children.length <= 1){
        return false;
    }

    var positionMap = {};
    for(var i = 0; i < this.node.children.length; i++){
        var child = this.getChildAt(i);
        if(! child.tagNameEqualsTo('BR') && ! child.tagNameEqualsTo('HR')){
            var positionY = parseInt(child.getAttributes().positionY / 2, 10) * 2;
            if(positionMap[positionY]){
                positionMap[positionY] = positionMap[positionY] + 1;
            } else {
                positionMap[positionY] = 1;
            }
        }
    }

    if(Object.keys(positionMap).length === 1){
        return false;
    }

    for (var property in positionMap) {
        if (positionMap.hasOwnProperty(property) && positionMap[property] > 1) {
            return true;
        }
    }

    return false;
}

Node.prototype.getAttributes = function(){
    if(this.node.attributes){
        return this.node.attributes;
    }

    return {};
}

Node.prototype.isTextNode = function(){
    return +this.node.type === 3 /*Node.TEXT_NODE*/;
}

Node.prototype.tagNameEqualsTo = function(tagName){
    return this.node.tagName === tagName;
}

Node.prototype.hasSingleChild = function() {
    return this.node.children && this.node.children.length === 1;
}

Node.prototype.isCompositeNode = function(){
    return this.node.isCompositeNode;
}

Node.prototype.getNode = function(){
    return this.node;
}

Node.prototype.getXPath = function(){
    return this.node.xpath;
}

Node.prototype.getNewCompositeNode = function(){
    return new Node({children: [], isCompositeNode: true,
        tagName: "COMPOSITE", xpath: this.node.xpath + '/COMPOSITE'});
}

Node.prototype.addChild = function(child){
    this.node.children.push(new Node(child.getNode()));
}

Node.prototype.getChildCount = function(){
    return this.node.children.length;
}

Node.prototype.getChildren = function(){
    return this.node.children;
}

Node.prototype.removeChildAt = function(index){
    this.node.children.splice(index, 1);
}



/**
 * Checks whether specified margin value is 0 or auto.
 *
 * @param {string} margin - Margin value to be checked
 *
 * @method
 */
function hasMargin(margin) {
	return margin && margin.toLowerCase() !== 'auto' && parseInt(margin, 10) !== 0;
}

module.exports = Node;
