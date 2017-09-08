var RuleEngine = require('node-rules'),
    fs = require('fs'),
    rulesStore = fs.readFileSync('rules.txt', 'utf8');

function detectRoles(block, pageWidth, pageHeight, fontSize, fontColor, explainRoles, callback){
    //initialize the rule engine
    var R = new RuleEngine();
    R.fromJSON(rulesStore);
    //Now pass the fact on to the rule engine for results
    R.execute(block.getAsFact(pageWidth, pageHeight, fontSize, fontColor), function(result){
		var maxRole = "";
		
		if(block.getRole() !== 'Unknown'){
			maxRole = block.getRole();
		} else {		
			var maxValue = -1;
			for (var role in result.roles) {
				if (result.roles.hasOwnProperty(role)) {
					if(maxValue < result.roles[role]){
						maxValue = result.roles[role];
						maxRole = role;
					}
				}
			}

			block.setRole(maxRole);
			if(explainRoles){
				block.setReason(result.reason[maxRole]);
				block.setScore(maxValue);
				block.setOverallScores({
					roles: result.roles,
					reasons: result.reason
				});
			}
		}

        detectRolesOfChildren(block, pageWidth, pageHeight, fontSize, fontColor, explainRoles, callback);
    });
}

function detectRolesOfChildren(block, pageWidth, pageHeight, fontSize, fontColor, explainRoles, callback){
    if(block.getChildCount() === 0){
        callback(block);
    } else {
        detectRoleOfChildAt(0, block.getChildCount());
    }

    function detectRoleOfChildAt(index, numberOfChildren){
        var child = block.getChildAt(index);
        if(! child){
            return callback(block);
        }

        child.setParentRole(block.getRole());

        detectRoles(block.getChildAt(index), pageWidth, pageHeight, fontSize, fontColor, explainRoles, function(){
            if(index >= numberOfChildren - 1){
                callback(block);
            } else {
                detectRoleOfChildAt(index + 1, numberOfChildren);
            }
        });
    }
}

module.exports.detectRoles = detectRoles;
