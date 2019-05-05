app.service('VoteSessionHasInitiativesService', function() {
    var voteSession = null;
    var date = null;
    var dateEnd = null;
    var initiative = null;
    return {
      setVoteSession : function(voteSessionInitiative) {
    	  if(voteSessionInitiative != null ){
	    	if(voteSessionInitiative.iniciativas == null ){
	    		voteSessionInitiative.iniciativas = [];
	    	}
    	  }
        voteSession = voteSessionInitiative;
      },
      getVoteSessionInitiatives : function() {
        return voteSession.iniciativas;
      },
      getVoteSession : function() {
      	return voteSession;
      },
      setDateSearch : function(_date){
    	  date = _date;
      },
      getDateSearch : function(){
    	  return date;
      },
      setDateSearchEnd : function(_date){
    	  dateEnd = _date;
      },
      getDateSearchEnd : function(){
    	  return dateEnd;
      },
      setInitiativeInitiated : function(_initiative){
    	  console.log('setInitiativeInitiated' );
    	  initiative = _initiative;
    	  console.log(initiative);
      },
      getInitiativeInitiated : function(){
    	  console.log('getInitiativeInitiated' );
    	  console.log(initiative);
    	  return initiative;
      }
    }
  });