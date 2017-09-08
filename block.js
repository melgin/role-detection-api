var rectUtil = require('./utils/rectangle-util');

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

Block.prototype.setScore = function(score){
    this.block.score = score;
}

Block.prototype.setOverallScores = function(score){
    this.block.overallScores = score;
}

Block.prototype.setReason = function(reason){
    this.block.reason = reason;
}

Block.prototype.getRole = function(){
    return this.block.role;
}

Block.prototype.setParentRole = function(parentRole){
	if(parentRole){
		this.parentRole = parentRole.toLowerCase();
	} else {
		this.parentRole = '';
	}
}

Block.prototype.setLocationData = function(){
	var width = 0,
		height = 0,
		topX = 0,
		topY = 0;
	
	if(this.node.isCompositeNode() || this.node.getAttributes().height === 0){
		var location = this.getVirtualLocation();
		
		this.block.width = location.width;
		this.block.height = location.height;
		this.block.topX = location.topX;
		this.block.topY = location.topY;
	} else {
		this.block.width = this.node.getAttributes().width;
		this.block.height = this.node.getAttributes().height;
		this.block.topX = this.node.getAttributes().positionX;
		this.block.topY = this.node.getAttributes().positionY;
	}
	
	for(var i = 0; i < this.getChildCount(); i++){
		this.getChildAt(i).setLocationData();
	}
	
	for(var i = 0; i < this.getChildCount(); i++){
		for(var j = i + 1; j < this.getChildCount(); j++){
			var b1 = this.getChildAt(i),
				b2 = this.getChildAt(j);
				
			if(rectUtil.checkBlockIntersection(b1, b2)){
				rectUtil.subtractBlock(b1, b2);
			}
		}
	}
}

Block.prototype.getLocation = function(){
	return {
		width: this.block.width,
		height: this.block.height,
		topX: this.block.topX,
		topY: this.block.topY
	};
}

Block.prototype.setLocation = function(l){
	this.block.width = l.width;
	this.block.height = l.height;
	this.block.topX = l.topX;
	this.block.topY = l.topY;
}

Block.prototype.getVirtualLocation = function(){
	var minX = Number.MAX_SAFE_INTEGER,
	    maxX = 0,
	    minY = Number.MAX_SAFE_INTEGER,
	    maxY = 0;
	
	for(var i = 0; i < this.getChildCount(); i++){
		var child = this.getChildAt(i);
		
		if(child.getNode().isCompositeNode || child.getNode().attributes.height === 0){
			var childLocation = child.getVirtualLocation();

			minX = Math.min(minX, childLocation.topX);
			maxX = Math.max(maxX, childLocation.topX + childLocation.width);
			minY = Math.min(minY, childLocation.topY);
			maxY = Math.max(maxY, childLocation.topY + childLocation.height);
		} else {
			var attributes = child.getNode().attributes;
			
			minX = Math.min(minX, attributes.positionX);
			maxX = Math.max(maxX, attributes.positionX + attributes.width);
			minY = Math.min(minY, attributes.positionY);
			maxY = Math.max(maxY, attributes.positionY + attributes.height);
		}
	}
	
	return {
		width: maxX - minX,
		height: maxY - minY,
		topX: minX,
		topY: minY
	};
}

Block.prototype.getAsFact = function(pageWidth, pageHeight, fontSize, fontColor){
	var tagName = getInnerTagNames(this.getNode());

    return {
        "hasId": getIdentifierFeatures(this.getNode()),
        "hasTag": tagName,
        "mustHaveTag": tagName,
		"isComposite": this.getNode().isCompositeNode ? 1 : 0,
		"hasSize": getSize(this.getNode()),
		"hasOrder": this.order,
		"isAtomic": this.getChildCount() === 0 ? 1 : 0,
		"inPosition": getPositionX(this.getNode()) + ', ' + getPositionY(this.getNode()),
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
		"hasChild": "", //TODO
		"hasSibling": "" //TODO
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
            return '|' + tagName + '|';
        }

        var childList = [];

        node.children.forEach(function(child){
            childList.push(getInnerTagNames(child));
        });

        return '|' + tagName + '|,' + childList.join();
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

        if(node.children && node.children.length > 0){
            node.children.forEach(function(child){
				var childAttributes = getAttributes(child);
				
				if(childAttributes && childAttributes.trim() !== ''){
					attributes += ',' + getAttributes(child);
				}
            });
        }

        return attributes;
    }

    function checkListStyle(node){
        if(! node.attributes){
            return 0;
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
        if(node.attributes){
			var borderTypeList = ['borderBottom', 'borderLeft', 'borderTop', 'borderRight'];
			for(var i = 0; i < borderTypeList.length; i++){
				var borderType = borderTypeList[i];

				if(node.attributes[borderType]){
					var segments = node.attributes[borderType].split(' ');

					if(parseInt(segments[0]) > 0 && segments[1] !== 'none'){
						return 1;
					}
				}
			}
		}

        if(node.children && node.children.length > 0){
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

        if(node.children && node.children.length > 0){
            node.children.forEach(function(child){
                text += ' ' + getText(child);
            });
        }

        return text;
    }
}

module.exports = Block;
