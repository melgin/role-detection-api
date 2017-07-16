function Block(block) {
    this.block = block;
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

Block.prototype.getChildCount = function(){
    return this.block.children ? this.block.children.length : 0;
}

Block.prototype.addChild = function(child){
    this.block.children.push(child.toJson());
}

Block.prototype.getChildAt = function(i){
    return new Block(this.block.children[i]);
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
        childList.push((new Block(child)).getTreeHierarchy());
    });

    return this.block.tagName + '[' + childList.join() + ']';

}

module.exports = Block;
