app.service('LoginService', function(factory) {
    var admin = 'admin';
    var pass = 'pass';
    var isAuthenticated = false;
    var userData = {
    		 nombre: null,
    		 password: null
    };
    
    return {
      login : function(username, password) {
        isAuthenticated = true;
        console.log(isAuthenticated);
        return isAuthenticated;
      },
      isAuthenticated : function() {
        return isAuthenticated;
      },
      getUserData : function() {
      	console.log(userData);
      	return userData;
      },
      setUserData : function(username,password){
    	userData.nombre=username;
    	userData.password=password;
      },
      postLogin: function(){
    	  let data = {"username": "solucionesdigitales", "password": "S0luc10n3sd1g1t4l3s", "submit": "Login"};
    	  factory.post("login", data).then(function(response){    		  
    		  
    	  }, function error(err){
    		  
    	  });
      }
    }
  });