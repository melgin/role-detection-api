function Block(block, node) {
    this.block = block;
    this.node = node;
    this.children = [];
    this.order = block.order;
    delete this.block.order;
}

Block.prototype.setDoc = function(doc){
    this.block.doc = doc;
}

Block.prototype.toJson = function(){
    return this.block;
}

Block.prototype.getName = function(){
    return this.block.name;
}

Block.prototype.getTagName = function(){
    return this.block.tagName;
}

Block.prototype.getChildCount = function(){
    return this.block.children ? this.block.children.length : 0;
}

Block.prototype.addChild = function(child){
    this.block.children.push(child.toJson());
    this.children.push(child);
}

Block.prototype.getChildAt = function(i){
    return this.children[i];
}

Block.prototype.getDoc = function(){
    return this.block.doc;
}

Block.prototype.getTreeHierarchy = function(){
    if(! this.block.children || this.block.children.length === 0){
        return this.block.tagName;
    }

    var childList = [];

    this.block.children.forEach(function(child){
        childList.push((new Block(child, null)).getTreeHierarchy());
    });

    return this.block.tagName + '[' + childList.join() + ']';
}

Block.prototype.getNode = function(){
    if(this.node && this.node.getNode()){
        return this.node.getNode();
    }

    return {};
}

Block.prototype.setRole = function(role){
    this.block.role = role;
}

Block.prototype.getRole = function(){
    return this.block.role;
}

Block.prototype.setParentRole = function(parentRole){
    this.parentRole = parentRole;
}

Block.prototype.getWidth = function(){
    if(this.node && this.node.attributes){
        return this.node.attributes.width;
    }

    return 0;
}

Block.prototype.getHeight = function(){
    if(this.node && this.node.attributes){
        return this.node.attributes.height;
    }

    return 0;
}

Block.prototype.getAsFact = function(pageWidth, pageHeight, fontSize, fontColor){
	var tagName = getInnerTagNames(this.getNode());

    return {
        "hasId": getIdentifierFeatures(this.getNode()),
        "hasTag": tagName,
        "mustHaveTag": tagName,
		"isComposite": this.getNode().isCompositeNode,
		"hasSize": getSize(this.getNode()),
		"hasOrder": this.order,
		"isAtomic": this.getChildCount() === 0 ? 0 : 1,
		"inPosition": getPositionX(this.getNode()) + ',' + getPositionY(this.getNode()),
		"fontSize": checkFontSize(this.getNode()),
		"border": checkBorder(this.getNode()),
		"fontColor": checkFontColor(this.getNode()),
		"hasBackground": checkBackground(this.getNode()),
		"wordCount": getWordCount(this.getNode()),
		"hasParent": this.parentRole,
		"relativeSize": getRelativeSizeX(this.getNode())+ ', ' + getRelativeSizeY(this.getNode()),
		"doc": this.block.doc,
		"hasListStyle": checkListStyle(this.getNode()),
		"hasAttribute": getAttributes(this.getNode()),
		"fontWeight": checkFontWeight(this.getNode()),

        "hasKeyword": getText(this.getNode()),
		"hasChild": "",
		"hasSibling": ""
    };

    function getIdentifierFeatures(node){
        var features = [];

        if(node.id){
            features.push(node.id);
        }

        if(node.className){
            features.push(node.className);
        }

        if(node.attributes){
            if(node.attributes.src){
                features.push(node.attributes.src);
            }

            if(node.attributes.value){
                features.push(node.attributes.value);
            }

            if(node.attributes.role){
                features.push(node.attributes.role);
            }

            if(node.attributes.name){
                features.push(node.attributes.name);
            }

            if(node.attributes.backgroundImage &&
                node.attributes.backgroundImage !== 'none' &&
                node.attributes.backgroundImage.indexOf('linear-gradient') !== 0){
                features.push(node.attributes.backgroundImage);
            }
        }

        return features.join();
    }

    function getInnerTagNames(node){
        var tagName = node.tagName ? node.tagName.toLowerCase() : '';
        if(! node.children || node.children.length === 0){
            return tagName;
        }

        var childList = [];

        node.children.forEach(function(child){
            childList.push(getInnerTagNames(child));
        });

        return tagName + ',' + childList.join();
    }

    function getWordCount(node){
        var count = node.attributes ? node.attributes.wordCount : 0;

        if(isNaN(count) || count === 0){
            return "none";
        } else if(count === 1){
            return "one";
        } else if(count <= 3){
            return "few";
        } else if(count <= 10){
            return "medium";
        } else {
            return "many";
        }
    }

    function getSize(node){
        if(! node.attributes){
            return '';
        }

        if(! node.attributes.width || ! node.attributes.height){
            return '';
        }

        return node.attributes.width + 'x' + node.attributes.height;
    }

    function getPositionX(node) {
        if(! node.attributes || isNaN(node.attributes.positionX)){
            return '';
        }

        var positionX = node.attributes.positionX;

		if(positionX < pageWidth / 3){
            return 'left';
        } else if(positionX > 2*pageWidth/3){
            return 'right';
        } else {
            return 'center';
        }
	}

	function getPositionY(node) {
        if(! node.attributes || isNaN(node.attributes.positionY)){
            return '';
        }

        var positionY = node.attributes.positionY;

		if(positionY < pageHeight / 3){
            return 'top';
        } else if(positionY > 2 * pageHeight / 3) {
            return 'bottom';
        } else {
            return 'center';
        }
	}

    function getAttributes(node){
        if(! node.attributes){
            return '';
        }

        var attributeSet = ["role", "hover", "for", "href", "command", "type",
					"value", "onFocus", "onClick", "method", "action", "alt", "title"];

        var existingAttributes = [];
        attributeSet.forEach(function(attr){
            if(node.attributes[attr]){
                existingAttributes.push(attr);
            }
        });

        var attributes = existingAttributes.join();

        if(node.children.length > 0){
            node.children.forEach(function(child){
                attributes += ',' + getAttributes(child);
            });
        }

        return attributes;
    }

    function checkListStyle(node){
        if(! node.attributes){
            return '';
        }

        if(! node.attributes.listStyle){
            return 0;
        }

        if(node.tagName === 'UL' || node.tagName === 'OL' || node.tagName === 'LI'){
            var segments = node.attributes.listStyle.split(' ');

            if(segments[0] !== 'none'){
                return 1;
            } else {
                return 0;
            }
        }

        return 0;
    }

    function getRelativeSizeX(node){
        if(! node.attributes || isNaN(node.attributes.width)){
            return '';
        }

        var width = node.attributes.width;

		if(width > pageWidth * 0.9){
            return 'full';
        } else if(width > pageWidth * 0.5){
            return 'wide';
        } else if(width < 50){
            return 'narrow';
        } else {
            return 'medium_length';
        }
    }

    function getRelativeSizeY(node){
        if(! node.attributes || isNaN(node.attributes.height)){
            return '';
        }

        var height = node.attributes.height;

        if(height > pageHeight * 0.4){
            return 'long';
        } else if(height < 50){
            return 'short';
        } else {
            return 'medium_height';
        }
    }

    function checkBackground(node){
        if(! node.attributes || ! node.attributes.background){
            return 0;
        }

        var bg = node.attributes.background;
        if((bg === 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box' ||
           bg === 'rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box') &&
            node.attributes.backgroundImage === 'none'){
                for(var i = 0; i < node.children.length; i++){
                    var child = node.children[i];

                    if(checkBackground(child) === 1){
                        return 1;
                    }
                }

            return 0;
        }

        return 1;
    }

    function checkBorder(node){
        if(! node.attributes || ! node.attributes.border){
            return 0;
        }

        var borderTypeList = ['borderBottom', 'borderLeft', 'borderTop', 'borderRight'];
        for(var i = 0; i < borderTypeList.length; i++){
            var borderType = borderTypeList[i];

            var segments = node.attributes[borderType].split(' ');

            if(parseInt(segments[0]) > 0 && segments[1] !== 'none'){
                return 1;
            }
        }

        if(node.children.length > 0){
            for(i = 0; i < node.children.length; i++){
                if(checkBorder(node.children[i]) === 1){
                    return 1;
                }
            }
        }

        return 0;
    }

    function checkFontColor(node){
        if(! node.attributes || ! node.attributes.fontColor){
            return 0;
        }

        if(node.attributes.fontColor === fontColor){
            return 0;
        }

        return 1;
    }

    function checkFontWeight(node){
        if(! node.attributes || ! node.attributes.fontWeight){
            return 0;
        }

        var fontWeightInt = parseInt(node.attributes.fontWeight);
        if(isNaN(fontWeightInt)){
            if(node.attributes.fontWeight === 'bold' || node.attributes.fontWeight === 'bolder'){
                return 1;
            }

            return 0;
        }

        if(fontWeightInt > 400){
            return 1;
        }

        return 0;
    }

    function checkFontSize(node){
        if(! node.attributes || ! node.attributes.fontSize){
            return 0;
        }

        var nodeFontSize = parseInt(node.attributes.fontSize),
            bodyFontSize = parseInt(fontSize);

        if(nodeFontSize > bodyFontSize){
            return 1;
        } else if(nodeFontSize < bodyFontSize){
            return -1;
        } else {
            return 0;
        }
    }

    function getText(node){
        if(! node.attributes){
            return '';
        }

        var text = node.attributes.text;

        if(node.children.length > 0){
            node.children.forEach(function(child){
                text += ' ' + getText(child);
            });
        }

        return text;
    }
}

module.exports = Block;
