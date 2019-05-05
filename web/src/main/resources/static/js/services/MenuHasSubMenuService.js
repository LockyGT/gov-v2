app.service('MenuHasSubMenuService', function() {
    var indexMenu = 0;
    return {
      setIndexMenu : function(index) {
    	  console.log(index);
        indexMenu = index;
      },
      getIndexMenu : function() {
    	  console.log(indexMenu);
        return indexMenu;
      }
    }
  });